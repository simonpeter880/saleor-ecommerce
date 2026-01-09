"""Price drop alert GraphQL types."""

import graphene
from decimal import Decimal

from ..core.scalars import DateTime


class AlertTriggerType(graphene.Enum):
    """Type of alert trigger."""

    ANY_DROP = "any_drop"  # Alert on any price drop
    PERCENTAGE = "percentage"  # Alert when price drops by X%
    TARGET_PRICE = "target_price"  # Alert when price reaches target
    BACK_IN_STOCK = "back_in_stock"  # Alert when product is back in stock


class AlertStatus(graphene.Enum):
    """Status of a price alert."""

    ACTIVE = "active"
    TRIGGERED = "triggered"
    EXPIRED = "expired"
    CANCELLED = "cancelled"


class NotificationChannel(graphene.Enum):
    """Channel for sending notifications."""

    EMAIL = "email"
    PUSH = "push"
    SMS = "sms"
    IN_APP = "in_app"


class PriceHistory(graphene.ObjectType):
    """Historical price data point."""

    price = graphene.Float(required=True, description="Price at this point in time.")
    currency = graphene.String(required=True, description="Currency code.")
    recorded_at = DateTime(required=True, description="When this price was recorded.")


class PriceAlert(graphene.ObjectType):
    """A price drop alert for a product."""

    id = graphene.ID(required=True)
    product_id = graphene.ID(required=True, description="The product being tracked.")
    product_name = graphene.String(description="Name of the product.")
    product_thumbnail = graphene.String(description="Product thumbnail URL.")
    trigger_type = graphene.Field(
        AlertTriggerType,
        required=True,
        description="What triggers this alert.",
    )
    status = graphene.Field(
        AlertStatus,
        required=True,
        description="Current status of the alert.",
    )
    original_price = graphene.Float(
        description="Price when alert was created.",
    )
    current_price = graphene.Float(
        description="Current price of the product.",
    )
    target_price = graphene.Float(
        description="Target price for TARGET_PRICE alerts.",
    )
    target_percentage = graphene.Float(
        description="Target percentage drop for PERCENTAGE alerts.",
    )
    currency = graphene.String(
        description="Currency code.",
    )
    notification_channels = graphene.List(
        NotificationChannel,
        description="Channels to notify through.",
    )
    created_at = DateTime(required=True)
    triggered_at = DateTime(
        description="When the alert was triggered (if triggered).",
    )
    expires_at = DateTime(
        description="When the alert expires.",
    )


class PriceDropNotification(graphene.ObjectType):
    """A notification about a price drop."""

    id = graphene.ID(required=True)
    alert = graphene.Field(PriceAlert, required=True)
    old_price = graphene.Float(required=True)
    new_price = graphene.Float(required=True)
    drop_percentage = graphene.Float(required=True)
    currency = graphene.String(required=True)
    created_at = DateTime(required=True)
    is_read = graphene.Boolean(required=True)


class PriceAlertSummary(graphene.ObjectType):
    """Summary of user's price alerts."""

    total_alerts = graphene.Int(required=True)
    active_alerts = graphene.Int(required=True)
    triggered_today = graphene.Int(required=True)
    average_savings = graphene.Float(description="Average savings from triggered alerts.")
    alerts = graphene.List(PriceAlert)


class ProductPriceInfo(graphene.ObjectType):
    """Price information for a product including history."""

    product_id = graphene.ID(required=True)
    current_price = graphene.Float(required=True)
    currency = graphene.String(required=True)
    lowest_price_30_days = graphene.Float(description="Lowest price in last 30 days.")
    highest_price_30_days = graphene.Float(description="Highest price in last 30 days.")
    price_trend = graphene.String(description="'up', 'down', or 'stable'.")
    price_history = graphene.List(PriceHistory, description="Price history data points.")
    has_active_alert = graphene.Boolean(description="Whether user has an active alert for this product.")
