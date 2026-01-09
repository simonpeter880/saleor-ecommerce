from django.contrib import admin

from .models import ProductShare, ProductShareClick


@admin.register(ProductShare)
class ProductShareAdmin(admin.ModelAdmin):
    list_display = ["id", "product", "platform", "user", "created_at"]
    list_filter = ["platform", "created_at"]
    search_fields = ["product__name", "user__email"]
    raw_id_fields = ["product", "user"]
    readonly_fields = ["created_at"]


@admin.register(ProductShareClick)
class ProductShareClickAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "product",
        "source_platform",
        "converted_to_order",
        "created_at",
    ]
    list_filter = ["source_platform", "converted_to_order"]
    search_fields = ["product__name"]
    raw_id_fields = ["share", "product", "order"]
    readonly_fields = ["created_at"]
