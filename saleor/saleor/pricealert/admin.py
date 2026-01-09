from django.contrib import admin

from .models import PriceAlert, PriceHistory, PriceAlertNotification


@admin.register(PriceAlert)
class PriceAlertAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "product",
        "trigger_type",
        "status",
        "original_price",
        "target_price",
        "created_at",
    ]
    list_filter = ["status", "trigger_type", "channel"]
    search_fields = ["user__email", "product__name"]
    raw_id_fields = ["user", "product", "variant", "channel"]
    readonly_fields = ["created_at", "updated_at", "triggered_at"]


@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = ["id", "product", "price", "currency", "channel", "recorded_at"]
    list_filter = ["channel", "currency"]
    search_fields = ["product__name"]
    raw_id_fields = ["product", "variant", "channel"]


@admin.register(PriceAlertNotification)
class PriceAlertNotificationAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "alert",
        "old_price",
        "new_price",
        "drop_percentage",
        "is_read",
        "is_sent",
        "created_at",
    ]
    list_filter = ["is_read", "is_sent", "notification_channel"]
    raw_id_fields = ["alert"]
