from django.conf import settings
from django.db import models

from ..core.models import ModelWithMetadata


class Wishlist(ModelWithMetadata):
    """User's wishlist to save products for later."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        related_name="wishlist",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Wishlist for {self.user.email}"


class WishlistItem(models.Model):
    """Individual item in a user's wishlist."""

    wishlist = models.ForeignKey(
        Wishlist,
        related_name="items",
        on_delete=models.CASCADE,
    )
    product = models.ForeignKey(
        "product.Product",
        related_name="wishlist_items",
        on_delete=models.CASCADE,
    )
    variant = models.ForeignKey(
        "product.ProductVariant",
        related_name="wishlist_items",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [["wishlist", "product", "variant"]]
        ordering = ["-created_at"]

    def __str__(self):
        variant_str = f" ({self.variant.name})" if self.variant else ""
        return f"{self.product.name}{variant_str}"
