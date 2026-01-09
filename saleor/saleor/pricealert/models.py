"""Price alert models linked to users, products, and channels."""

from decimal import Decimal

from django.conf import settings
from django.db import models

from ..channel.models import Channel
from ..core.models import ModelWithMetadata


class AlertTriggerType(models.TextChoices):
    """Types of price alert triggers."""

    ANY_DROP = "any_drop", "Alert on any price drop"
    PERCENTAGE = "percentage", "Alert when price drops by percentage"
    TARGET_PRICE = "target_price", "Alert when price reaches target"
    BACK_IN_STOCK = "back_in_stock", "Alert when product is back in stock"


class AlertStatus(models.TextChoices):
    """Status of a price alert."""

    ACTIVE = "active", "Active"
    TRIGGERED = "triggered", "Triggered"
    EXPIRED = "expired", "Expired"
    CANCELLED = "cancelled", "Cancelled"


class NotificationChannel(models.TextChoices):
    """Channels for sending notifications."""

    EMAIL = "email", "Email"
    PUSH = "push", "Push Notification"
    SMS = "sms", "SMS"
    IN_APP = "in_app", "In-App Notification"


class PriceAlert(ModelWithMetadata):
    """Price drop alert for a product linked to a user."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="price_alerts",
        on_delete=models.CASCADE,
    )
    product = models.ForeignKey(
        "product.Product",
        related_name="price_alerts",
        on_delete=models.CASCADE,
    )
    variant = models.ForeignKey(
        "product.ProductVariant",
        related_name="price_alerts",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    channel = models.ForeignKey(
        Channel,
        related_name="price_alerts",
        on_delete=models.CASCADE,
    )
    trigger_type = models.CharField(
        max_length=20,
        choices=AlertTriggerType.choices,
        default=AlertTriggerType.ANY_DROP,
    )
    status = models.CharField(
        max_length=20,
        choices=AlertStatus.choices,
        default=AlertStatus.ACTIVE,
    )
    original_price = models.DecimalField(
        max_digits=12,
        decimal_places=3,
        help_text="Price when alert was created",
    )
    target_price = models.DecimalField(
        max_digits=12,
        decimal_places=3,
        null=True,
        blank=True,
        help_text="Target price for TARGET_PRICE alerts",
    )
    target_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Target percentage drop for PERCENTAGE alerts",
    )
    currency = models.CharField(max_length=3)
    notification_channels = models.JSONField(
        default=list,
        help_text="List of notification channels",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    triggered_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["product", "status"]),
            models.Index(fields=["status", "expires_at"]),
        ]

    def __str__(self):
        return f"Price Alert for {self.product.name} by {self.user.email}"

    def check_trigger(self, current_price: Decimal) -> bool:
        """Check if the alert should be triggered based on current price."""
        if self.status != AlertStatus.ACTIVE:
            return False

        if self.trigger_type == AlertTriggerType.ANY_DROP:
            return current_price < self.original_price

        elif self.trigger_type == AlertTriggerType.TARGET_PRICE:
            return current_price <= self.target_price

        elif self.trigger_type == AlertTriggerType.PERCENTAGE:
            drop_percentage = (
                (self.original_price - current_price) / self.original_price * 100
            )
            return drop_percentage >= self.target_percentage

        return False


class PriceHistory(models.Model):
    """Track price history for products to show trends."""

    product = models.ForeignKey(
        "product.Product",
        related_name="price_history",
        on_delete=models.CASCADE,
    )
    variant = models.ForeignKey(
        "product.ProductVariant",
        related_name="price_history",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    channel = models.ForeignKey(
        Channel,
        related_name="price_history",
        on_delete=models.CASCADE,
    )
    price = models.DecimalField(max_digits=12, decimal_places=3)
    currency = models.CharField(max_length=3)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-recorded_at"]
        indexes = [
            models.Index(fields=["product", "channel", "recorded_at"]),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.price} {self.currency} at {self.recorded_at}"


class PriceAlertNotification(models.Model):
    """Notification sent when a price alert is triggered."""

    alert = models.ForeignKey(
        PriceAlert,
        related_name="notifications",
        on_delete=models.CASCADE,
    )
    old_price = models.DecimalField(max_digits=12, decimal_places=3)
    new_price = models.DecimalField(max_digits=12, decimal_places=3)
    drop_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    currency = models.CharField(max_length=3)
    notification_channel = models.CharField(
        max_length=20,
        choices=NotificationChannel.choices,
    )
    is_read = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Notification for {self.alert} - {self.drop_percentage}% drop"
