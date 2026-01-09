"""Price drop alert schema using database models."""

import graphene
from datetime import datetime, timedelta
from decimal import Decimal

from ...pricealert.models import (
    PriceAlert as PriceAlertModel,
    PriceHistory as PriceHistoryModel,
    PriceAlertNotification as PriceAlertNotificationModel,
    AlertTriggerType as AlertTriggerTypeChoices,
    AlertStatus as AlertStatusChoices,
    NotificationChannel as NotificationChannelChoices,
)
from ..core.mutations import BaseMutation
from ..core.types import Error
from ..core.utils import from_global_id_or_error
from .types import (
    AlertTriggerType,
    AlertStatus,
    NotificationChannel,
    PriceAlert,
    PriceDropNotification,
    PriceAlertSummary,
    ProductPriceInfo,
    PriceHistory,
)


class PriceAlertError(Error):
    """Errors for price alert operations."""

    code = graphene.String(description="The error code.", required=True)


class CreatePriceAlert(BaseMutation):
    """Create a price drop alert for a product."""

    alert = graphene.Field(PriceAlert)

    class Arguments:
        product_id = graphene.ID(required=True, description="Product to track.")
        channel_slug = graphene.String(required=True, description="Channel slug.")
        variant_id = graphene.ID(description="Specific variant to track.")
        trigger_type = graphene.Argument(
            AlertTriggerType,
            required=True,
            description="What triggers the alert.",
        )
        target_price = graphene.Float(
            description="Target price (for TARGET_PRICE trigger).",
        )
        target_percentage = graphene.Float(
            description="Target percentage drop (for PERCENTAGE trigger).",
        )
        notification_channels = graphene.List(
            NotificationChannel,
            description="How to notify the user.",
        )
        expires_in_days = graphene.Int(
            description="Alert expiration in days (default: 90).",
        )

    class Meta:
        description = "Create a price drop alert for a product."
        error_type_class = PriceAlertError

    @classmethod
    def perform_mutation(cls, root, info, **data):
        from ...product import models as product_models
        from ...channel.models import Channel

        # Require authenticated user
        user = info.context.user
        if not user or not user.is_authenticated:
            return cls(alert=None)

        product_id = data.get("product_id")
        channel_slug = data.get("channel_slug")
        trigger_type = data.get("trigger_type", AlertTriggerTypeChoices.ANY_DROP)

        try:
            _, product_pk = from_global_id_or_error(product_id, "Product")
            product = product_models.Product.objects.get(pk=product_pk)
        except Exception:
            return cls(alert=None)

        try:
            channel = Channel.objects.get(slug=channel_slug)
        except Channel.DoesNotExist:
            return cls(alert=None)

        # Get variant if provided
        variant = None
        if data.get("variant_id"):
            try:
                _, variant_pk = from_global_id_or_error(data["variant_id"], "ProductVariant")
                variant = product_models.ProductVariant.objects.get(pk=variant_pk)
            except Exception:
                pass

        # Get current price from channel listing
        current_price = Decimal("0.00")
        currency = channel.currency_code

        if variant:
            variant_listing = variant.channel_listings.filter(channel=channel).first()
            if variant_listing and variant_listing.price_amount:
                current_price = variant_listing.price_amount
        else:
            # Get from first variant
            first_variant = product.variants.first()
            if first_variant:
                variant_listing = first_variant.channel_listings.filter(channel=channel).first()
                if variant_listing and variant_listing.price_amount:
                    current_price = variant_listing.price_amount

        expires_in_days = data.get("expires_in_days", 90)
        notification_channels = data.get("notification_channels", [
            NotificationChannelChoices.EMAIL,
            NotificationChannelChoices.IN_APP,
        ])

        # Create the alert in database
        alert = PriceAlertModel.objects.create(
            user=user,
            product=product,
            variant=variant,
            channel=channel,
            trigger_type=trigger_type,
            status=AlertStatusChoices.ACTIVE,
            original_price=current_price,
            target_price=Decimal(str(data.get("target_price", 0))) if data.get("target_price") else None,
            target_percentage=Decimal(str(data.get("target_percentage", 0))) if data.get("target_percentage") else None,
            currency=currency,
            notification_channels=notification_channels,
            expires_at=datetime.now() + timedelta(days=expires_in_days),
        )

        return cls(
            alert=PriceAlert(
                id=graphene.Node.to_global_id("PriceAlert", alert.pk),
                product_id=product_id,
                product_name=product.name,
                trigger_type=alert.trigger_type,
                status=alert.status,
                original_price=float(alert.original_price),
                current_price=float(current_price),
                target_price=float(alert.target_price) if alert.target_price else None,
                target_percentage=float(alert.target_percentage) if alert.target_percentage else None,
                currency=alert.currency,
                notification_channels=alert.notification_channels,
                created_at=alert.created_at,
                expires_at=alert.expires_at,
            )
        )


class DeletePriceAlert(BaseMutation):
    """Delete a price alert."""

    success = graphene.Boolean(required=True)

    class Arguments:
        alert_id = graphene.ID(required=True, description="Alert ID to delete.")

    class Meta:
        description = "Delete a price drop alert."
        error_type_class = PriceAlertError

    @classmethod
    def perform_mutation(cls, root, info, alert_id):
        user = info.context.user
        if not user or not user.is_authenticated:
            return cls(success=False)

        try:
            _, alert_pk = from_global_id_or_error(alert_id, "PriceAlert")
            alert = PriceAlertModel.objects.get(pk=alert_pk, user=user)
            alert.status = AlertStatusChoices.CANCELLED
            alert.save()
            return cls(success=True)
        except Exception:
            return cls(success=False)


class UpdatePriceAlert(BaseMutation):
    """Update an existing price alert."""

    alert = graphene.Field(PriceAlert)

    class Arguments:
        alert_id = graphene.ID(required=True, description="Alert ID to update.")
        target_price = graphene.Float(description="New target price.")
        target_percentage = graphene.Float(description="New target percentage.")
        notification_channels = graphene.List(NotificationChannel)

    class Meta:
        description = "Update a price drop alert."
        error_type_class = PriceAlertError

    @classmethod
    def perform_mutation(cls, root, info, alert_id, **data):
        user = info.context.user
        if not user or not user.is_authenticated:
            return cls(alert=None)

        try:
            _, alert_pk = from_global_id_or_error(alert_id, "PriceAlert")
            alert = PriceAlertModel.objects.select_related("product", "channel").get(
                pk=alert_pk, user=user
            )
        except Exception:
            return cls(alert=None)

        # Update fields
        if data.get("target_price") is not None:
            alert.target_price = Decimal(str(data["target_price"]))
        if data.get("target_percentage") is not None:
            alert.target_percentage = Decimal(str(data["target_percentage"]))
        if data.get("notification_channels") is not None:
            alert.notification_channels = data["notification_channels"]

        alert.save()

        return cls(
            alert=PriceAlert(
                id=graphene.Node.to_global_id("PriceAlert", alert.pk),
                product_id=graphene.Node.to_global_id("Product", alert.product_id),
                product_name=alert.product.name,
                trigger_type=alert.trigger_type,
                status=alert.status,
                original_price=float(alert.original_price),
                current_price=float(alert.original_price),  # Would need to fetch current price
                target_price=float(alert.target_price) if alert.target_price else None,
                target_percentage=float(alert.target_percentage) if alert.target_percentage else None,
                currency=alert.currency,
                notification_channels=alert.notification_channels,
                created_at=alert.created_at,
                triggered_at=alert.triggered_at,
                expires_at=alert.expires_at,
            )
        )


class MarkNotificationRead(BaseMutation):
    """Mark a price drop notification as read."""

    success = graphene.Boolean(required=True)

    class Arguments:
        notification_id = graphene.ID(required=True)

    class Meta:
        description = "Mark a price drop notification as read."
        error_type_class = PriceAlertError

    @classmethod
    def perform_mutation(cls, root, info, notification_id):
        user = info.context.user
        if not user or not user.is_authenticated:
            return cls(success=False)

        try:
            _, notif_pk = from_global_id_or_error(notification_id, "PriceAlertNotification")
            notification = PriceAlertNotificationModel.objects.get(
                pk=notif_pk, alert__user=user
            )
            notification.is_read = True
            notification.save()
            return cls(success=True)
        except Exception:
            return cls(success=False)


class PriceAlertQueries(graphene.ObjectType):
    """Price alert queries."""

    my_price_alerts = graphene.Field(
        PriceAlertSummary,
        status=graphene.Argument(AlertStatus, description="Filter by status."),
        description="Get all price alerts for the current user.",
    )
    price_alert = graphene.Field(
        PriceAlert,
        alert_id=graphene.ID(required=True, description="Alert ID."),
        description="Get a specific price alert.",
    )
    product_price_info = graphene.Field(
        ProductPriceInfo,
        product_id=graphene.ID(required=True, description="Product ID."),
        channel_slug=graphene.String(required=True, description="Channel slug."),
        description="Get price information and history for a product.",
    )
    my_price_notifications = graphene.List(
        PriceDropNotification,
        unread_only=graphene.Boolean(default_value=False),
        description="Get price drop notifications for the current user.",
    )

    @staticmethod
    def resolve_my_price_alerts(root, info, status=None):
        user = info.context.user
        if not user or not user.is_authenticated:
            return PriceAlertSummary(
                total_alerts=0,
                active_alerts=0,
                triggered_today=0,
                average_savings=0.0,
                alerts=[],
            )

        queryset = PriceAlertModel.objects.filter(user=user).select_related("product")

        if status:
            queryset = queryset.filter(status=status)

        alerts = []
        active_count = 0
        triggered_today = 0

        for alert in queryset:
            if alert.status == AlertStatusChoices.ACTIVE:
                active_count += 1

            if alert.triggered_at and alert.triggered_at.date() == datetime.now().date():
                triggered_today += 1

            alerts.append(PriceAlert(
                id=graphene.Node.to_global_id("PriceAlert", alert.pk),
                product_id=graphene.Node.to_global_id("Product", alert.product_id),
                product_name=alert.product.name,
                trigger_type=alert.trigger_type,
                status=alert.status,
                original_price=float(alert.original_price),
                current_price=float(alert.original_price),
                target_price=float(alert.target_price) if alert.target_price else None,
                target_percentage=float(alert.target_percentage) if alert.target_percentage else None,
                currency=alert.currency,
                notification_channels=alert.notification_channels,
                created_at=alert.created_at,
                triggered_at=alert.triggered_at,
                expires_at=alert.expires_at,
            ))

        return PriceAlertSummary(
            total_alerts=len(alerts),
            active_alerts=active_count,
            triggered_today=triggered_today,
            average_savings=0.0,
            alerts=alerts,
        )

    @staticmethod
    def resolve_price_alert(root, info, alert_id):
        user = info.context.user
        if not user or not user.is_authenticated:
            return None

        try:
            _, alert_pk = from_global_id_or_error(alert_id, "PriceAlert")
            alert = PriceAlertModel.objects.select_related("product").get(
                pk=alert_pk, user=user
            )
        except Exception:
            return None

        return PriceAlert(
            id=graphene.Node.to_global_id("PriceAlert", alert.pk),
            product_id=graphene.Node.to_global_id("Product", alert.product_id),
            product_name=alert.product.name,
            trigger_type=alert.trigger_type,
            status=alert.status,
            original_price=float(alert.original_price),
            current_price=float(alert.original_price),
            target_price=float(alert.target_price) if alert.target_price else None,
            target_percentage=float(alert.target_percentage) if alert.target_percentage else None,
            currency=alert.currency,
            notification_channels=alert.notification_channels,
            created_at=alert.created_at,
            triggered_at=alert.triggered_at,
            expires_at=alert.expires_at,
        )

    @staticmethod
    def resolve_product_price_info(root, info, product_id, channel_slug):
        from ...product import models as product_models
        from ...channel.models import Channel

        try:
            _, product_pk = from_global_id_or_error(product_id, "Product")
            product = product_models.Product.objects.get(pk=product_pk)
            channel = Channel.objects.get(slug=channel_slug)
        except Exception:
            return None

        # Check if user has an active alert for this product
        has_active_alert = False
        user = info.context.user
        if user and user.is_authenticated:
            has_active_alert = PriceAlertModel.objects.filter(
                user=user,
                product=product,
                channel=channel,
                status=AlertStatusChoices.ACTIVE,
            ).exists()

        # Get price history from database
        history_records = PriceHistoryModel.objects.filter(
            product=product,
            channel=channel,
        ).order_by("-recorded_at")[:30]

        price_history = [
            PriceHistory(
                price=float(h.price),
                currency=h.currency,
                recorded_at=h.recorded_at,
            )
            for h in history_records
        ]

        # Get current price from variant listing
        current_price = 0.0
        currency = channel.currency_code

        first_variant = product.variants.first()
        if first_variant:
            variant_listing = first_variant.channel_listings.filter(channel=channel).first()
            if variant_listing and variant_listing.price_amount:
                current_price = float(variant_listing.price_amount)

        # Calculate stats from history
        lowest_30 = None
        highest_30 = None
        price_trend = "stable"

        if price_history:
            prices = [h.price for h in price_history]
            lowest_30 = min(prices)
            highest_30 = max(prices)

            if len(prices) >= 2:
                if prices[0] > prices[-1]:  # Most recent vs oldest
                    price_trend = "up"
                elif prices[0] < prices[-1]:
                    price_trend = "down"

        return ProductPriceInfo(
            product_id=product_id,
            current_price=current_price,
            currency=currency,
            lowest_price_30_days=lowest_30,
            highest_price_30_days=highest_30,
            price_trend=price_trend,
            price_history=price_history,
            has_active_alert=has_active_alert,
        )

    @staticmethod
    def resolve_my_price_notifications(root, info, unread_only=False):
        user = info.context.user
        if not user or not user.is_authenticated:
            return []

        queryset = PriceAlertNotificationModel.objects.filter(
            alert__user=user
        ).select_related("alert", "alert__product")

        if unread_only:
            queryset = queryset.filter(is_read=False)

        notifications = []
        for notif in queryset:
            alert = notif.alert
            alert_obj = PriceAlert(
                id=graphene.Node.to_global_id("PriceAlert", alert.pk),
                product_id=graphene.Node.to_global_id("Product", alert.product_id),
                product_name=alert.product.name,
                trigger_type=alert.trigger_type,
                status=alert.status,
                original_price=float(alert.original_price),
                current_price=float(notif.new_price),
                target_price=float(alert.target_price) if alert.target_price else None,
                target_percentage=float(alert.target_percentage) if alert.target_percentage else None,
                currency=alert.currency,
                notification_channels=alert.notification_channels,
                created_at=alert.created_at,
                triggered_at=alert.triggered_at,
                expires_at=alert.expires_at,
            )

            notifications.append(PriceDropNotification(
                id=graphene.Node.to_global_id("PriceAlertNotification", notif.pk),
                alert=alert_obj,
                old_price=float(notif.old_price),
                new_price=float(notif.new_price),
                drop_percentage=float(notif.drop_percentage),
                currency=notif.currency,
                created_at=notif.created_at,
                is_read=notif.is_read,
            ))

        return notifications


class PriceAlertMutations(graphene.ObjectType):
    """Price alert mutations."""

    create_price_alert = CreatePriceAlert.Field()
    update_price_alert = UpdatePriceAlert.Field()
    delete_price_alert = DeletePriceAlert.Field()
    mark_price_notification_read = MarkNotificationRead.Field()


__all__ = ["PriceAlertMutations", "PriceAlertQueries"]
