import graphene
from graphene import relay

from ...review import models
from ..account.types import User
from ..core.connection import CountableConnection
from ..core.doc_category import DOC_CATEGORY_PRODUCTS
from ..core.scalars import DateTime
from ..core.types import ModelObjectType
from ..meta.types import ObjectWithMetadata


class RatingDistribution(graphene.ObjectType):
    """Distribution of ratings for a product."""

    stars = graphene.Int(required=True, description="Rating value (1-5 stars).")
    count = graphene.Int(required=True, description="Number of reviews with this rating.")
    percentage = graphene.Float(
        required=True, description="Percentage of reviews with this rating."
    )


class ReviewStatistics(graphene.ObjectType):
    """Statistics about product reviews."""

    average_rating = graphene.Float(
        required=True, description="Average rating across all reviews."
    )
    total_count = graphene.Int(
        required=True, description="Total number of approved reviews."
    )
    distribution = graphene.List(
        graphene.NonNull(RatingDistribution),
        required=True,
        description="Distribution of ratings by stars.",
    )


class ProductReview(ModelObjectType[models.ProductReview]):
    """Represents a product review."""

    id = graphene.GlobalID(required=True)
    rating = graphene.Int(required=True, description="Rating from 1 to 5 stars.")
    title = graphene.String(required=True, description="Review title.")
    content = graphene.String(required=True, description="Review content.")
    author = graphene.Field(User, description="Author of the review.")
    author_name = graphene.String(
        required=True, description="Display name of the author."
    )
    is_verified_purchase = graphene.Boolean(
        required=True, description="Whether the reviewer purchased the product."
    )
    helpful_count = graphene.Int(
        required=True, description="Number of users who found this review helpful."
    )
    created_at = DateTime(
        required=True, description="Date when the review was created."
    )
    updated_at = DateTime(
        required=True, description="Date when the review was last updated."
    )

    class Meta:
        description = "Represents a customer review for a product."
        interfaces = [relay.Node, ObjectWithMetadata]
        model = models.ProductReview
        doc_category = DOC_CATEGORY_PRODUCTS

    @staticmethod
    def resolve_author(root: models.ProductReview, info):
        return root.user

    @staticmethod
    def resolve_author_name(root: models.ProductReview, info):
        if root.user:
            if root.user.first_name:
                # Show first name and last initial for privacy
                last_initial = root.user.last_name[0] + "." if root.user.last_name else ""
                return f"{root.user.first_name} {last_initial}".strip()
            return root.user.email.split("@")[0]
        return "Anonymous"


class ProductReviewCountableConnection(CountableConnection):
    class Meta:
        node = ProductReview
