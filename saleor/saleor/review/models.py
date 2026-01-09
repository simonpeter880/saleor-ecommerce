from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Avg, Count

from ..core.models import ModelWithMetadata


class ProductReview(ModelWithMetadata):
    """Customer review for a product."""

    product = models.ForeignKey(
        "product.Product",
        related_name="reviews",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="reviews",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5 stars",
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    is_verified_purchase = models.BooleanField(
        default=False,
        help_text="Whether the reviewer has purchased this product",
    )
    is_approved = models.BooleanField(
        default=False,
        help_text="Whether the review has been approved for display",
    )
    helpful_count = models.PositiveIntegerField(
        default=0,
        help_text="Number of users who found this review helpful",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [["product", "user"]]
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["product", "is_approved"]),
            models.Index(fields=["rating"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"Review by {self.user.email if self.user else 'Anonymous'} - {self.rating}/5"

    @classmethod
    def get_product_statistics(cls, product_id):
        """Get review statistics for a product."""
        reviews = cls.objects.filter(product_id=product_id, is_approved=True)
        stats = reviews.aggregate(
            average_rating=Avg("rating"),
            total_count=Count("id"),
        )

        # Get rating distribution
        distribution = []
        for stars in range(5, 0, -1):
            count = reviews.filter(rating=stars).count()
            percentage = (count / stats["total_count"] * 100) if stats["total_count"] > 0 else 0
            distribution.append({
                "stars": stars,
                "count": count,
                "percentage": round(percentage, 1),
            })

        return {
            "average_rating": round(stats["average_rating"] or 0, 1),
            "total_count": stats["total_count"],
            "distribution": distribution,
        }


class ReviewHelpful(models.Model):
    """Track which users found a review helpful."""

    review = models.ForeignKey(
        ProductReview,
        related_name="helpful_votes",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="helpful_votes",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [["review", "user"]]

    def __str__(self):
        return f"{self.user.email} found review {self.review.id} helpful"
