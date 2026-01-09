import graphene
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Avg

from ...order.models import Order
from ...review import models
from ..core import ResolveInfo
from ..core.doc_category import DOC_CATEGORY_PRODUCTS
from ..core.mutations import BaseMutation
from ..core.types import BaseInputObjectType
from ..core.utils import from_global_id_or_error
from .types import ProductReview


class ReviewError(graphene.ObjectType):
    """Represents an error in review operations."""

    field = graphene.String(description="Name of the field that caused the error.")
    message = graphene.String(description="The error message.")
    code = graphene.String(description="The error code.")


class ReviewCreateInput(BaseInputObjectType):
    """Input for creating a review."""

    product_id = graphene.ID(required=True, description="ID of the product to review.")
    rating = graphene.Int(
        required=True, description="Rating from 1 to 5 stars."
    )
    title = graphene.String(required=True, description="Review title.")
    content = graphene.String(required=True, description="Review content.")

    class Meta:
        doc_category = DOC_CATEGORY_PRODUCTS


class ReviewCreate(BaseMutation):
    """Create a new product review."""

    review = graphene.Field(ProductReview, description="The created review.")

    class Arguments:
        input = ReviewCreateInput(
            required=True, description="Fields required to create a review."
        )

    class Meta:
        description = "Create a new product review."
        doc_category = DOC_CATEGORY_PRODUCTS
        error_type_class = ReviewError
        error_type_field = "review_errors"

    @classmethod
    @transaction.atomic
    def perform_mutation(cls, root, info: ResolveInfo, /, **data):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise ValidationError("You must be logged in to create a review.")

        input_data = data.get("input", {})
        product_id = input_data.get("product_id")
        rating = input_data.get("rating")
        title = input_data.get("title")
        content = input_data.get("content")

        # Validate rating
        if rating < 1 or rating > 5:
            raise ValidationError({"rating": "Rating must be between 1 and 5."})

        # Resolve product ID
        _, product_pk = from_global_id_or_error(product_id, "Product")

        # Check if user already reviewed this product
        existing_review = models.ProductReview.objects.filter(
            product_id=product_pk, user=user
        ).first()
        if existing_review:
            raise ValidationError(
                {"product_id": "You have already reviewed this product."}
            )

        # Check if user has purchased this product
        is_verified_purchase = Order.objects.filter(
            user=user,
            lines__variant__product_id=product_pk,
            status__in=["fulfilled", "partially_fulfilled"],
        ).exists()

        # Create review
        review = models.ProductReview.objects.create(
            product_id=product_pk,
            user=user,
            rating=rating,
            title=title,
            content=content,
            is_verified_purchase=is_verified_purchase,
            is_approved=True,  # Auto-approve for now
        )

        # Update product rating
        cls._update_product_rating(product_pk)

        return cls(review=review)

    @staticmethod
    def _update_product_rating(product_pk):
        from ...product.models import Product

        avg_rating = models.ProductReview.objects.filter(
            product_id=product_pk, is_approved=True
        ).aggregate(avg=Avg("rating"))["avg"]

        if avg_rating:
            Product.objects.filter(pk=product_pk).update(rating=round(avg_rating, 2))


class ReviewUpdateInput(BaseInputObjectType):
    """Input for updating a review."""

    rating = graphene.Int(description="Rating from 1 to 5 stars.")
    title = graphene.String(description="Review title.")
    content = graphene.String(description="Review content.")

    class Meta:
        doc_category = DOC_CATEGORY_PRODUCTS


class ReviewUpdate(BaseMutation):
    """Update an existing review."""

    review = graphene.Field(ProductReview, description="The updated review.")

    class Arguments:
        id = graphene.ID(required=True, description="ID of the review to update.")
        input = ReviewUpdateInput(
            required=True, description="Fields to update."
        )

    class Meta:
        description = "Update an existing product review. Only the author can update."
        doc_category = DOC_CATEGORY_PRODUCTS
        error_type_class = ReviewError
        error_type_field = "review_errors"

    @classmethod
    @transaction.atomic
    def perform_mutation(cls, root, info: ResolveInfo, /, **data):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise ValidationError("You must be logged in to update a review.")

        review_id = data.get("id")
        input_data = data.get("input", {})

        _, review_pk = from_global_id_or_error(review_id, "ProductReview")

        try:
            review = models.ProductReview.objects.get(pk=review_pk)
        except models.ProductReview.DoesNotExist:
            raise ValidationError({"id": "Review not found."})

        if review.user != user:
            raise ValidationError({"id": "You can only update your own reviews."})

        # Update fields
        if "rating" in input_data:
            rating = input_data["rating"]
            if rating < 1 or rating > 5:
                raise ValidationError({"rating": "Rating must be between 1 and 5."})
            review.rating = rating

        if "title" in input_data:
            review.title = input_data["title"]

        if "content" in input_data:
            review.content = input_data["content"]

        review.save()

        # Update product rating
        ReviewCreate._update_product_rating(review.product_id)

        return cls(review=review)


class ReviewDelete(BaseMutation):
    """Delete a review."""

    success = graphene.Boolean(description="Whether the deletion was successful.")

    class Arguments:
        id = graphene.ID(required=True, description="ID of the review to delete.")

    class Meta:
        description = "Delete a product review. Only the author can delete."
        doc_category = DOC_CATEGORY_PRODUCTS
        error_type_class = ReviewError
        error_type_field = "review_errors"

    @classmethod
    @transaction.atomic
    def perform_mutation(cls, root, info: ResolveInfo, /, **data):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise ValidationError("You must be logged in to delete a review.")

        review_id = data.get("id")
        _, review_pk = from_global_id_or_error(review_id, "ProductReview")

        try:
            review = models.ProductReview.objects.get(pk=review_pk)
        except models.ProductReview.DoesNotExist:
            raise ValidationError({"id": "Review not found."})

        if review.user != user:
            raise ValidationError({"id": "You can only delete your own reviews."})

        product_pk = review.product_id
        review.delete()

        # Update product rating
        ReviewCreate._update_product_rating(product_pk)

        return cls(success=True)


class ReviewMarkHelpful(BaseMutation):
    """Mark a review as helpful."""

    review = graphene.Field(ProductReview, description="The updated review.")

    class Arguments:
        id = graphene.ID(required=True, description="ID of the review to mark helpful.")

    class Meta:
        description = "Mark a product review as helpful."
        doc_category = DOC_CATEGORY_PRODUCTS
        error_type_class = ReviewError
        error_type_field = "review_errors"

    @classmethod
    @transaction.atomic
    def perform_mutation(cls, root, info: ResolveInfo, /, **data):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise ValidationError("You must be logged in to mark reviews as helpful.")

        review_id = data.get("id")
        _, review_pk = from_global_id_or_error(review_id, "ProductReview")

        try:
            review = models.ProductReview.objects.get(pk=review_pk)
        except models.ProductReview.DoesNotExist:
            raise ValidationError({"id": "Review not found."})

        # Check if user already marked this helpful
        existing_vote = models.ReviewHelpful.objects.filter(
            review=review, user=user
        ).first()

        if existing_vote:
            # Toggle off - remove the helpful vote
            existing_vote.delete()
            review.helpful_count = max(0, review.helpful_count - 1)
        else:
            # Add helpful vote
            models.ReviewHelpful.objects.create(review=review, user=user)
            review.helpful_count += 1

        review.save(update_fields=["helpful_count"])

        return cls(review=review)
