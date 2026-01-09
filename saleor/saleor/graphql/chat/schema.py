"""Live chat widget schema using database models."""

import graphene
from datetime import datetime

from ...chat.models import (
    ChatSession as ChatSessionModel,
    ChatMessage as ChatMessageModel,
    ChatWidgetSettings,
    ChatSessionStatus,
)
from ..core.fields import JSONString
from ..core.mutations import BaseMutation
from ..core.types import Error
from ..core.utils import from_global_id_or_error
from .types import (
    ChatProvider,
    ChatWidgetConfig,
    ChatWidgetPosition,
    ChatAvailability,
    ChatSession,
    ChatMessage,
    ChatAgentInfo,
)


class ChatError(Error):
    """Errors for chat operations."""

    code = graphene.String(description="The error code.", required=True)


class ChatConfigInput(graphene.InputObjectType):
    """Input for configuring the chat widget."""

    enabled = graphene.Boolean(description="Whether the chat widget is enabled.")
    provider = graphene.Argument(ChatProvider, description="The chat service provider.")
    widget_id = graphene.String(description="Provider-specific widget/property ID.")
    api_key = graphene.String(description="API key for the chat service.")
    position = graphene.Argument(ChatWidgetPosition, description="Widget position.")
    color = graphene.String(description="Primary color (hex code).")
    welcome_message = graphene.String(description="Welcome message.")
    offline_message = graphene.String(description="Offline message.")
    show_on_mobile = graphene.Boolean(description="Show on mobile devices.")
    delay_seconds = graphene.Int(description="Delay before showing widget.")
    custom_script_url = graphene.String(description="Custom script URL.")
    custom_config = JSONString(description="Additional custom configuration.")


class UpdateChatConfig(BaseMutation):
    """Update the chat widget configuration."""

    config = graphene.Field(ChatWidgetConfig)

    class Arguments:
        input = ChatConfigInput(required=True, description="Chat widget configuration.")

    class Meta:
        description = "Update the live chat widget configuration."
        error_type_class = ChatError

    @classmethod
    def perform_mutation(cls, root, info, input):
        settings = ChatWidgetSettings.get_settings()

        # Update fields from input
        if input.get("enabled") is not None:
            settings.enabled = input["enabled"]
        if input.get("provider"):
            settings.provider = input["provider"]
        if input.get("widget_id"):
            settings.widget_id = input["widget_id"]
        if input.get("api_key"):
            settings.api_key = input["api_key"]
        if input.get("position"):
            settings.position = input["position"]
        if input.get("color"):
            settings.primary_color = input["color"]
        if input.get("welcome_message"):
            settings.welcome_message = input["welcome_message"]
        if input.get("offline_message"):
            settings.offline_message = input["offline_message"]
        if input.get("show_on_mobile") is not None:
            settings.show_on_mobile = input["show_on_mobile"]
        if input.get("delay_seconds") is not None:
            settings.delay_seconds = input["delay_seconds"]
        if input.get("custom_script_url"):
            settings.custom_script_url = input["custom_script_url"]
        if input.get("custom_config"):
            settings.custom_config = input["custom_config"]

        settings.save()

        return cls(
            config=ChatWidgetConfig(
                enabled=settings.enabled,
                provider=settings.provider,
                widget_id=settings.widget_id,
                api_key=settings.api_key,
                position=settings.position,
                color=settings.primary_color,
                welcome_message=settings.welcome_message,
                offline_message=settings.offline_message,
                show_on_mobile=settings.show_on_mobile,
                delay_seconds=settings.delay_seconds,
                custom_script_url=settings.custom_script_url,
                custom_config=settings.custom_config,
            )
        )


class StartChatSession(BaseMutation):
    """Start a new chat session."""

    session = graphene.Field(ChatSession)

    class Arguments:
        visitor_name = graphene.String(description="Name of the visitor.")
        visitor_email = graphene.String(description="Email of the visitor.")
        initial_message = graphene.String(description="Initial message from visitor.")
        order_id = graphene.ID(description="Related order ID if applicable.")
        subject = graphene.String(description="Chat subject.")
        metadata = JSONString(description="Additional metadata.")

    class Meta:
        description = "Start a new chat session with support."
        error_type_class = ChatError

    @classmethod
    def perform_mutation(cls, root, info, **data):
        user = None
        if hasattr(info.context, "user") and info.context.user.is_authenticated:
            user = info.context.user

        # Get request info
        request = info.context
        ip_address = None
        user_agent = ""
        if hasattr(request, "META"):
            ip_address = request.META.get("REMOTE_ADDR")
            user_agent = request.META.get("HTTP_USER_AGENT", "")

        # Get order if provided
        order = None
        if data.get("order_id"):
            from ...order.models import Order
            try:
                _, order_pk = from_global_id_or_error(data["order_id"], "Order")
                order = Order.objects.get(pk=order_pk)
            except Exception:
                pass

        session = ChatSessionModel.objects.create(
            user=user,
            visitor_name=data.get("visitor_name", ""),
            visitor_email=data.get("visitor_email", ""),
            order=order,
            subject=data.get("subject", ""),
            ip_address=ip_address,
            user_agent=user_agent,
            metadata=data.get("metadata", {}),
        )

        # Add initial message if provided
        if data.get("initial_message"):
            ChatMessageModel.objects.create(
                session=session,
                content=data["initial_message"],
                sender_type=ChatMessageModel.SenderType.USER,
                sender_name=data.get("visitor_name", "Visitor"),
                sender_user=user,
            )

        return cls(
            session=ChatSession(
                id=graphene.Node.to_global_id("ChatSession", session.pk),
                status=session.status,
                started_at=session.started_at,
                messages=[],
            )
        )


class SendChatMessage(BaseMutation):
    """Send a message in a chat session."""

    message = graphene.Field(ChatMessage)

    class Arguments:
        session_id = graphene.ID(required=True, description="The chat session ID.")
        content = graphene.String(required=True, description="Message content.")

    class Meta:
        description = "Send a message in a chat session."
        error_type_class = ChatError

    @classmethod
    def perform_mutation(cls, root, info, session_id, content):
        try:
            _, session_pk = from_global_id_or_error(session_id, "ChatSession")
            session = ChatSessionModel.objects.get(pk=session_pk)
        except Exception:
            return cls(message=None)

        user = None
        sender_name = "Visitor"
        if hasattr(info.context, "user") and info.context.user.is_authenticated:
            user = info.context.user
            sender_name = user.email

        message = ChatMessageModel.objects.create(
            session=session,
            content=content,
            sender_type=ChatMessageModel.SenderType.USER,
            sender_name=sender_name,
            sender_user=user,
        )

        return cls(
            message=ChatMessage(
                id=graphene.Node.to_global_id("ChatMessage", message.pk),
                content=message.content,
                sender_type=message.sender_type,
                sender_name=message.sender_name,
                timestamp=message.created_at,
                is_read=message.is_read,
            )
        )


class EndChatSession(BaseMutation):
    """End a chat session."""

    success = graphene.Boolean(required=True)

    class Arguments:
        session_id = graphene.ID(required=True, description="The chat session ID.")
        rating = graphene.Int(description="Session rating (1-5).")
        feedback = graphene.String(description="Optional feedback.")

    class Meta:
        description = "End a chat session."
        error_type_class = ChatError

    @classmethod
    def perform_mutation(cls, root, info, session_id, rating=None, feedback=None):
        try:
            _, session_pk = from_global_id_or_error(session_id, "ChatSession")
            session = ChatSessionModel.objects.get(pk=session_pk)
        except Exception:
            return cls(success=False)

        session.status = ChatSessionStatus.CLOSED
        session.ended_at = datetime.now()
        if rating:
            session.rating = rating
        if feedback:
            session.feedback = feedback
        session.save()

        return cls(success=True)


class ChatQueries(graphene.ObjectType):
    """Chat widget queries."""

    chat_widget_config = graphene.Field(
        ChatWidgetConfig,
        description="Get the chat widget configuration.",
    )
    chat_availability = graphene.Field(
        ChatAvailability,
        description="Get current chat support availability.",
    )
    chat_session = graphene.Field(
        ChatSession,
        session_id=graphene.ID(required=True, description="The chat session ID."),
        description="Get a chat session by ID.",
    )
    my_chat_sessions = graphene.List(
        ChatSession,
        description="Get all chat sessions for the current user.",
    )

    @staticmethod
    def resolve_chat_widget_config(root, info):
        settings = ChatWidgetSettings.get_settings()

        return ChatWidgetConfig(
            enabled=settings.enabled,
            provider=settings.provider,
            widget_id=settings.widget_id,
            api_key=settings.api_key,
            position=settings.position,
            color=settings.primary_color,
            welcome_message=settings.welcome_message,
            offline_message=settings.offline_message,
            show_on_mobile=settings.show_on_mobile,
            delay_seconds=settings.delay_seconds,
            custom_script_url=settings.custom_script_url,
            custom_config=settings.custom_config,
        )

    @staticmethod
    def resolve_chat_availability(root, info):
        # Count active agents (users who are staff and have agent sessions)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        agents_online = User.objects.filter(is_staff=True, is_active=True).count()

        return ChatAvailability(
            is_available=agents_online > 0,
            agents_online=agents_online,
            estimated_wait_time=5 if agents_online > 0 else None,
            next_available_time=None,
            available_agents=[],
        )

    @staticmethod
    def resolve_chat_session(root, info, session_id):
        try:
            _, session_pk = from_global_id_or_error(session_id, "ChatSession")
            session = ChatSessionModel.objects.prefetch_related("messages").get(pk=session_pk)
        except Exception:
            return None

        messages = [
            ChatMessage(
                id=graphene.Node.to_global_id("ChatMessage", msg.pk),
                content=msg.content,
                sender_type=msg.sender_type,
                sender_name=msg.sender_name,
                timestamp=msg.created_at,
                is_read=msg.is_read,
            )
            for msg in session.messages.all()
        ]

        return ChatSession(
            id=graphene.Node.to_global_id("ChatSession", session.pk),
            status=session.status,
            started_at=session.started_at,
            ended_at=session.ended_at,
            messages=messages,
            unread_count=session.unread_count,
        )

    @staticmethod
    def resolve_my_chat_sessions(root, info):
        user = info.context.user
        if not user or not user.is_authenticated:
            return []

        sessions = ChatSessionModel.objects.filter(user=user).order_by("-started_at")

        return [
            ChatSession(
                id=graphene.Node.to_global_id("ChatSession", session.pk),
                status=session.status,
                started_at=session.started_at,
                ended_at=session.ended_at,
                unread_count=session.unread_count,
            )
            for session in sessions
        ]


class ChatMutations(graphene.ObjectType):
    """Chat widget mutations."""

    update_chat_config = UpdateChatConfig.Field()
    start_chat_session = StartChatSession.Field()
    send_chat_message = SendChatMessage.Field()
    end_chat_session = EndChatSession.Field()


__all__ = ["ChatMutations", "ChatQueries"]
