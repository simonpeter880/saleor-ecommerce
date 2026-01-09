"""Social sharing models for tracking product shares and analytics."""

from django.conf import settings
from django.db import models
from django.db.models import Count


class SocialPlatform(models.TextChoices):
    """Supported social media platforms."""

    FACEBOOK = "facebook", "Facebook"
    TWITTER = "twitter", "Twitter/X"
    WHATSAPP = "whatsapp", "WhatsApp"
    TELEGRAM = "telegram", "Telegram"
    LINKEDIN = "linkedin", "LinkedIn"
    PINTEREST = "pinterest", "Pinterest"
    EMAIL = "email", "Email"
    COPY_LINK = "copy_link", "Copy Link"


class ProductShare(models.Model):
    """Track individual product share events."""

    product = models.ForeignKey(
        "product.Product",
        related_name="shares",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="product_shares",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    platform = models.CharField(
        max_length=20,
        choices=SocialPlatform.choices,
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["product", "platform"]),
            models.Index(fields=["product", "created_at"]),
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self):
        user_str = self.user.email if self.user else "Anonymous"
        return f"{self.product.name} shared on {self.platform} by {user_str}"

    @classmethod
    def get_product_share_stats(cls, product_id):
        """Get sharing statistics for a product."""
        shares = cls.objects.filter(product_id=product_id)
        total = shares.count()

        # Get breakdown by platform
        breakdown = shares.values("platform").annotate(
            count=Count("id")
        ).order_by("-count")

        platform_stats = {
            item["platform"]: item["count"]
            for item in breakdown
        }

        return {
            "total_shares": total,
            "platform_breakdown": platform_stats,
        }


class ProductShareClick(models.Model):
    """Track clicks on shared product links (for referral tracking)."""

    share = models.ForeignKey(
        ProductShare,
        related_name="clicks",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    product = models.ForeignKey(
        "product.Product",
        related_name="share_clicks",
        on_delete=models.CASCADE,
    )
    source_platform = models.CharField(
        max_length=20,
        choices=SocialPlatform.choices,
        blank=True,
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    converted_to_order = models.BooleanField(default=False)
    order = models.ForeignKey(
        "order.Order",
        related_name="share_click_conversions",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["product", "source_platform"]),
            models.Index(fields=["converted_to_order"]),
        ]

    def __str__(self):
        return f"Click on {self.product.name} from {self.source_platform}"
