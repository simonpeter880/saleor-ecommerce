import graphene

from ...review import models
from ..core import ResolveInfo
from ..core.connection import create_connection_slice, filter_connection_queryset
from ..core.doc_category import DOC_CATEGORY_PRODUCTS
from ..core.fields import BaseField, FilterConnectionField
from ..core.utils import from_global_id_or_error
from .mutations import ReviewCreate, ReviewDelete, ReviewMarkHelpful, ReviewUpdate
from .types import ProductReview, ProductReviewCountableConnection, ReviewStatistics


class ReviewQueries(graphene.ObjectType):
    """Queries for product reviews."""

    product_reviews = FilterConnectionField(
        ProductReviewCountableConnection,
        product_id=graphene.ID(required=True, description="ID of the product."),
        description="Get reviews for a product.",
        doc_category=DOC_CATEGORY_PRODUCTS,
    )

    review_statistics = BaseField(
        ReviewStatistics,
        product_id=graphene.ID(required=True, description="ID of the product."),
        description="Get review statistics for a product.",
        doc_category=DOC_CATEGORY_PRODUCTS,
    )

    @staticmethod
    def resolve_product_reviews(root, info: ResolveInfo, *, product_id, **kwargs):
        _, product_pk = from_global_id_or_error(product_id, "Product")

        qs = models.ProductReview.objects.filter(
            product_id=product_pk,
            is_approved=True,
        ).order_by("-created_at")

        return create_connection_slice(
            qs, info, kwargs, ProductReviewCountableConnection
        )

    @staticmethod
    def resolve_review_statistics(root, info: ResolveInfo, *, product_id, **kwargs):
        _, product_pk = from_global_id_or_error(product_id, "Product")
        stats = models.ProductReview.get_product_statistics(product_pk)

        return ReviewStatistics(
            average_rating=stats["average_rating"],
            total_count=stats["total_count"],
            distribution=stats["distribution"],
        )


class ReviewMutations(graphene.ObjectType):
    """Mutations for product reviews."""

    review_create = ReviewCreate.Field()
    review_update = ReviewUpdate.Field()
    review_delete = ReviewDelete.Field()
    review_mark_helpful = ReviewMarkHelpful.Field()
