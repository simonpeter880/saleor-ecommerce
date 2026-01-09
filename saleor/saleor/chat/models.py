"""Live chat models linked to users and optionally orders."""

from django.conf import settings
from django.db import models


class ChatSessionStatus(models.TextChoices):
    """Status of a chat session."""

    WAITING = "waiting", "Waiting for Agent"
    ACTIVE = "active", "Active"
    CLOSED = "closed", "Closed"


class ChatSession(models.Model):
    """A live chat session between a customer and support."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="chat_sessions",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    visitor_name = models.CharField(max_length=255, blank=True)
    visitor_email = models.EmailField(blank=True)
    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="agent_chat_sessions",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    order = models.ForeignKey(
        "order.Order",
        related_name="chat_sessions",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Related order if chat is about a specific order",
    )
    status = models.CharField(
        max_length=20,
        choices=ChatSessionStatus.choices,
        default=ChatSessionStatus.WAITING,
    )
    subject = models.CharField(max_length=255, blank=True)
    department = models.CharField(max_length=100, blank=True)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["agent", "status"]),
            models.Index(fields=["status", "started_at"]),
        ]

    def __str__(self):
        user_str = self.user.email if self.user else self.visitor_email or "Anonymous"
        return f"Chat session {self.id} - {user_str}"

    @property
    def unread_count(self):
        """Get count of unread messages for the user."""
        return self.messages.filter(is_read=False, sender_type="agent").count()


class ChatMessage(models.Model):
    """Individual message in a chat session."""

    class SenderType(models.TextChoices):
        USER = "user", "User"
        AGENT = "agent", "Agent"
        BOT = "bot", "Bot"
        SYSTEM = "system", "System"

    session = models.ForeignKey(
        ChatSession,
        related_name="messages",
        on_delete=models.CASCADE,
    )
    content = models.TextField()
    sender_type = models.CharField(
        max_length=10,
        choices=SenderType.choices,
    )
    sender_name = models.CharField(max_length=255, blank=True)
    sender_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="chat_messages_sent",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    attachment_url = models.URLField(blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        indexes = [
            models.Index(fields=["session", "is_read"]),
            models.Index(fields=["session", "created_at"]),
        ]

    def __str__(self):
        return f"Message in session {self.session_id} by {self.sender_type}"


class ChatWidgetSettings(models.Model):
    """Global chat widget configuration."""

    class Provider(models.TextChoices):
        INTERNAL = "internal", "Internal Chat"
        TAWK_TO = "tawk_to", "Tawk.to"
        INTERCOM = "intercom", "Intercom"
        ZENDESK = "zendesk", "Zendesk"
        CRISP = "crisp", "Crisp"
        CUSTOM = "custom", "Custom"

    class Position(models.TextChoices):
        BOTTOM_RIGHT = "bottom_right", "Bottom Right"
        BOTTOM_LEFT = "bottom_left", "Bottom Left"

    enabled = models.BooleanField(default=False)
    provider = models.CharField(
        max_length=20,
        choices=Provider.choices,
        default=Provider.INTERNAL,
    )
    widget_id = models.CharField(max_length=255, blank=True)
    api_key = models.CharField(max_length=255, blank=True)
    position = models.CharField(
        max_length=20,
        choices=Position.choices,
        default=Position.BOTTOM_RIGHT,
    )
    primary_color = models.CharField(max_length=7, default="#0066cc")
    welcome_message = models.TextField(
        default="Hi! How can we help you today?"
    )
    offline_message = models.TextField(
        default="We're currently offline. Leave a message!"
    )
    show_on_mobile = models.BooleanField(default=True)
    delay_seconds = models.PositiveIntegerField(default=3)
    custom_script_url = models.URLField(blank=True)
    custom_config = models.JSONField(default=dict, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Chat Widget Settings"
        verbose_name_plural = "Chat Widget Settings"

    def __str__(self):
        return f"Chat Widget Settings ({self.provider})"

    @classmethod
    def get_settings(cls):
        """Get or create the singleton settings instance."""
        settings, _ = cls.objects.get_or_create(pk=1)
        return settings
