from django.contrib import admin

from .models import ProductReview, ReviewHelpful


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "product",
        "user",
        "rating",
        "is_verified_purchase",
        "is_approved",
        "helpful_count",
        "created_at",
    ]
    list_filter = ["rating", "is_verified_purchase", "is_approved", "created_at"]
    search_fields = ["product__name", "user__email", "title", "content"]
    raw_id_fields = ["product", "user"]
    readonly_fields = ["helpful_count", "created_at", "updated_at"]
    actions = ["approve_reviews", "reject_reviews"]

    def approve_reviews(self, request, queryset):
        count = queryset.update(is_approved=True)
        self.message_user(request, f"{count} reviews approved.")

    approve_reviews.short_description = "Approve selected reviews"

    def reject_reviews(self, request, queryset):
        count = queryset.update(is_approved=False)
        self.message_user(request, f"{count} reviews rejected.")

    reject_reviews.short_description = "Reject selected reviews"


@admin.register(ReviewHelpful)
class ReviewHelpfulAdmin(admin.ModelAdmin):
    list_display = ["id", "review", "user", "created_at"]
    raw_id_fields = ["review", "user"]
