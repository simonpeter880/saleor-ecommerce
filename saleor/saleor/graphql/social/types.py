"""Social sharing GraphQL types."""

import graphene
from urllib.parse import quote_plus

from ...core.utils import build_absolute_uri


class SocialPlatform(graphene.Enum):
    """Supported social media platforms for sharing."""

    FACEBOOK = "facebook"
    TWITTER = "twitter"
    WHATSAPP = "whatsapp"
    TELEGRAM = "telegram"
    LINKEDIN = "linkedin"
    PINTEREST = "pinterest"
    EMAIL = "email"
    COPY_LINK = "copy_link"


class SocialShareLink(graphene.ObjectType):
    """A shareable link for a specific social platform."""

    platform = graphene.Field(
        SocialPlatform,
        required=True,
        description="The social media platform.",
    )
    url = graphene.String(
        required=True,
        description="The shareable URL for this platform.",
    )
    label = graphene.String(
        required=True,
        description="Display label for the share button.",
    )
    icon = graphene.String(
        description="Icon identifier for the platform.",
    )


class SocialShareData(graphene.ObjectType):
    """Social sharing data for a product."""

    product_url = graphene.String(
        required=True,
        description="Direct URL to the product page.",
    )
    share_links = graphene.List(
        graphene.NonNull(SocialShareLink),
        required=True,
        description="Pre-built share links for each platform.",
    )
    open_graph = graphene.Field(
        "saleor.graphql.social.types.OpenGraphData",
        description="Open Graph metadata for social previews.",
    )
    share_count = graphene.Int(
        description="Total number of times this product has been shared.",
    )


class OpenGraphData(graphene.ObjectType):
    """Open Graph metadata for social media previews."""

    title = graphene.String(
        required=True,
        description="OG title - typically the product name.",
    )
    description = graphene.String(
        description="OG description - product description.",
    )
    image = graphene.String(
        description="OG image URL - product thumbnail.",
    )
    url = graphene.String(
        required=True,
        description="Canonical URL for the product.",
    )
    type = graphene.String(
        description="OG type - typically 'product'.",
    )
    site_name = graphene.String(
        description="Site name for OG tags.",
    )


def generate_share_links(
    product_url: str,
    product_name: str,
    product_description: str = "",
    image_url: str = "",
    price: str = "",
) -> list:
    """Generate share links for all supported platforms."""
    encoded_url = quote_plus(product_url)
    encoded_name = quote_plus(product_name)

    # Create share text with optional price
    share_text = product_name
    if price:
        share_text = f"{product_name} - {price}"
    encoded_text = quote_plus(share_text)

    # Create longer description for platforms that support it
    full_text = share_text
    if product_description:
        full_text = f"{share_text}\n\n{product_description[:200]}"
    encoded_full_text = quote_plus(full_text)

    return [
        {
            "platform": SocialPlatform.FACEBOOK,
            "url": f"https://www.facebook.com/sharer/sharer.php?u={encoded_url}",
            "label": "Share on Facebook",
            "icon": "facebook",
        },
        {
            "platform": SocialPlatform.TWITTER,
            "url": f"https://twitter.com/intent/tweet?url={encoded_url}&text={encoded_text}",
            "label": "Share on X (Twitter)",
            "icon": "twitter",
        },
        {
            "platform": SocialPlatform.WHATSAPP,
            "url": f"https://api.whatsapp.com/send?text={encoded_full_text}%20{encoded_url}",
            "label": "Share on WhatsApp",
            "icon": "whatsapp",
        },
        {
            "platform": SocialPlatform.TELEGRAM,
            "url": f"https://t.me/share/url?url={encoded_url}&text={encoded_text}",
            "label": "Share on Telegram",
            "icon": "telegram",
        },
        {
            "platform": SocialPlatform.LINKEDIN,
            "url": f"https://www.linkedin.com/sharing/share-offsite/?url={encoded_url}",
            "label": "Share on LinkedIn",
            "icon": "linkedin",
        },
        {
            "platform": SocialPlatform.PINTEREST,
            "url": f"https://pinterest.com/pin/create/button/?url={encoded_url}&description={encoded_text}&media={quote_plus(image_url) if image_url else ''}",
            "label": "Pin on Pinterest",
            "icon": "pinterest",
        },
        {
            "platform": SocialPlatform.EMAIL,
            "url": f"mailto:?subject={encoded_text}&body={encoded_full_text}%0A%0A{encoded_url}",
            "label": "Share via Email",
            "icon": "email",
        },
        {
            "platform": SocialPlatform.COPY_LINK,
            "url": product_url,
            "label": "Copy Link",
            "icon": "link",
        },
    ]
