"""Live chat widget GraphQL types."""

import graphene

from ..core.scalars import DateTime
from ..core.fields import JSONString


class ChatProvider(graphene.Enum):
    """Supported chat service providers."""

    TAWK_TO = "tawk_to"
    INTERCOM = "intercom"
    ZENDESK = "zendesk"
    CRISP = "crisp"
    LIVECHAT = "livechat"
    TIDIO = "tidio"
    DRIFT = "drift"
    FRESHCHAT = "freshchat"
    CUSTOM = "custom"


class ChatWidgetPosition(graphene.Enum):
    """Position of the chat widget on the page."""

    BOTTOM_RIGHT = "bottom_right"
    BOTTOM_LEFT = "bottom_left"
    TOP_RIGHT = "top_right"
    TOP_LEFT = "top_left"


class ChatWidgetConfig(graphene.ObjectType):
    """Configuration for the live chat widget."""

    enabled = graphene.Boolean(
        required=True,
        description="Whether the chat widget is enabled.",
    )
    provider = graphene.Field(
        ChatProvider,
        description="The chat service provider being used.",
    )
    widget_id = graphene.String(
        description="Provider-specific widget/property ID.",
    )
    api_key = graphene.String(
        description="API key for the chat service (if applicable).",
    )
    position = graphene.Field(
        ChatWidgetPosition,
        description="Position of the chat widget on the page.",
    )
    color = graphene.String(
        description="Primary color for the chat widget (hex code).",
    )
    welcome_message = graphene.String(
        description="Welcome message shown when chat is opened.",
    )
    offline_message = graphene.String(
        description="Message shown when agents are offline.",
    )
    show_on_mobile = graphene.Boolean(
        description="Whether to show the widget on mobile devices.",
    )
    delay_seconds = graphene.Int(
        description="Delay in seconds before showing the widget.",
    )
    custom_script_url = graphene.String(
        description="URL to custom chat script (for CUSTOM provider).",
    )
    custom_config = JSONString(
        description="Additional custom configuration as JSON.",
    )


class ChatAgentInfo(graphene.ObjectType):
    """Information about a chat support agent."""

    id = graphene.ID(required=True)
    name = graphene.String(required=True)
    avatar_url = graphene.String()
    is_online = graphene.Boolean(required=True)
    department = graphene.String()


class ChatAvailability(graphene.ObjectType):
    """Current chat support availability status."""

    is_available = graphene.Boolean(
        required=True,
        description="Whether chat support is currently available.",
    )
    agents_online = graphene.Int(
        description="Number of agents currently online.",
    )
    estimated_wait_time = graphene.Int(
        description="Estimated wait time in minutes.",
    )
    next_available_time = graphene.String(
        description="ISO timestamp of next available time if currently offline.",
    )
    available_agents = graphene.List(
        ChatAgentInfo,
        description="List of available support agents.",
    )


class ChatMessage(graphene.ObjectType):
    """A chat message."""

    id = graphene.ID(required=True)
    content = graphene.String(required=True)
    sender_type = graphene.String(
        required=True,
        description="Either 'user', 'agent', or 'bot'.",
    )
    sender_name = graphene.String()
    timestamp = DateTime(required=True)
    is_read = graphene.Boolean()


class ChatSession(graphene.ObjectType):
    """A chat session."""

    id = graphene.ID(required=True)
    status = graphene.String(
        required=True,
        description="Status: 'active', 'waiting', 'closed'.",
    )
    started_at = DateTime(required=True)
    ended_at = DateTime()
    agent = graphene.Field(ChatAgentInfo)
    messages = graphene.List(ChatMessage)
    unread_count = graphene.Int()
