from django.contrib import admin

from .models import Wishlist, WishlistItem


class WishlistItemInline(admin.TabularInline):
    model = WishlistItem
    extra = 0
    raw_id_fields = ["product", "variant"]


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "item_count", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__email"]
    raw_id_fields = ["user"]
    inlines = [WishlistItemInline]

    def item_count(self, obj):
        return obj.items.count()

    item_count.short_description = "Items"


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ["id", "wishlist", "product", "variant", "created_at"]
    list_filter = ["created_at"]
    raw_id_fields = ["wishlist", "product", "variant"]
