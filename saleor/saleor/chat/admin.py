from django.contrib import admin

from .models import ChatSession, ChatMessage, ChatWidgetSettings


class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ["created_at"]


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "visitor_email",
        "agent",
        "status",
        "rating",
        "started_at",
        "ended_at",
    ]
    list_filter = ["status", "department", "rating"]
    search_fields = ["user__email", "visitor_email", "visitor_name"]
    raw_id_fields = ["user", "agent", "order"]
    readonly_fields = ["started_at"]
    inlines = [ChatMessageInline]


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "session",
        "sender_type",
        "sender_name",
        "is_read",
        "created_at",
    ]
    list_filter = ["sender_type", "is_read"]
    search_fields = ["content", "sender_name"]
    raw_id_fields = ["session", "sender_user"]
    readonly_fields = ["created_at"]


@admin.register(ChatWidgetSettings)
class ChatWidgetSettingsAdmin(admin.ModelAdmin):
    list_display = [
        "provider",
        "enabled",
        "position",
        "show_on_mobile",
        "updated_at",
    ]

    def has_add_permission(self, request):
        # Only allow one instance
        return not ChatWidgetSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
