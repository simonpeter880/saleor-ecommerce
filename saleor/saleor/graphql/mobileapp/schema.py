"""Mobile app banner schema."""

import graphene
from django.core.cache import cache

from .types import (
    AppPlatform,
    BannerDisplayMode,
    BannerPosition,
    AppStoreInfo,
    SmartBannerConfig,
    DeepLinkConfig,
    MobileAppConfig,
    AppDownloadLink,
)


# Cache key
MOBILE_APP_CONFIG_KEY = "mobile_app_config"


# Default configuration
DEFAULT_CONFIG = {
    "smart_banner": {
        "enabled": True,
        "title": "Get Our App",
        "description": "Shop faster and get exclusive deals!",
        "button_text": "Download",
        "close_button_text": "Not Now",
        "position": BannerPosition.TOP,
        "display_mode": BannerDisplayMode.MOBILE_ONLY,
        "show_after_close_days": 7,
        "background_color": "#ffffff",
        "text_color": "#333333",
        "button_color": "#007bff",
    },
    "deep_linking": {
        "enabled": False,
        "scheme": None,
        "ios_universal_link_domain": None,
        "android_app_link_domain": None,
        "fallback_url": None,
    },
    "ios": {
        "app_id": None,
        "store_url": None,
        "app_name": None,
        "app_icon_url": None,
        "rating": None,
        "price": "Free",
        "publisher": None,
    },
    "android": {
        "app_id": None,
        "store_url": None,
        "app_name": None,
        "app_icon_url": None,
        "rating": None,
        "price": "Free",
        "publisher": None,
    },
}


def get_mobile_config():
    """Get mobile app configuration from cache or return defaults."""
    config = cache.get(MOBILE_APP_CONFIG_KEY)
    if config is None:
        config = DEFAULT_CONFIG.copy()
    return config


class MobileAppQueries(graphene.ObjectType):
    """Mobile app queries."""

    mobile_app_config = graphene.Field(
        MobileAppConfig,
        description="Get mobile app configuration including smart banner settings.",
    )
    app_download_link = graphene.Field(
        AppDownloadLink,
        user_agent=graphene.String(
            description="User agent string to detect platform.",
        ),
        description="Get the appropriate app download link based on user's device.",
    )
    product_deep_link = graphene.String(
        product_id=graphene.ID(required=True, description="Product ID."),
        description="Generate a deep link URL for a specific product.",
    )

    @staticmethod
    def resolve_mobile_app_config(root, info):
        config = get_mobile_config()
        banner_config = config.get("smart_banner", {})
        deep_link_config = config.get("deep_linking", {})
        ios_config = config.get("ios", {})
        android_config = config.get("android", {})

        ios_app = None
        if ios_config.get("app_id"):
            ios_app = AppStoreInfo(
                platform=AppPlatform.IOS,
                app_id=ios_config.get("app_id"),
                store_url=ios_config.get("store_url", f"https://apps.apple.com/app/{ios_config.get('app_id')}"),
                app_name=ios_config.get("app_name"),
                app_icon_url=ios_config.get("app_icon_url"),
                rating=ios_config.get("rating"),
                price=ios_config.get("price", "Free"),
                publisher=ios_config.get("publisher"),
            )

        android_app = None
        if android_config.get("app_id"):
            android_app = AppStoreInfo(
                platform=AppPlatform.ANDROID,
                app_id=android_config.get("app_id"),
                store_url=android_config.get("store_url", f"https://play.google.com/store/apps/details?id={android_config.get('app_id')}"),
                app_name=android_config.get("app_name"),
                app_icon_url=android_config.get("app_icon_url"),
                rating=android_config.get("rating"),
                price=android_config.get("price", "Free"),
                publisher=android_config.get("publisher"),
            )

        smart_banner = SmartBannerConfig(
            enabled=banner_config.get("enabled", True),
            title=banner_config.get("title", "Get Our App"),
            description=banner_config.get("description", "Shop faster and get exclusive deals!"),
            button_text=banner_config.get("button_text", "Download"),
            close_button_text=banner_config.get("close_button_text", "Not Now"),
            position=banner_config.get("position", BannerPosition.TOP),
            display_mode=banner_config.get("display_mode", BannerDisplayMode.MOBILE_ONLY),
            show_after_close_days=banner_config.get("show_after_close_days", 7),
            background_color=banner_config.get("background_color", "#ffffff"),
            text_color=banner_config.get("text_color", "#333333"),
            button_color=banner_config.get("button_color", "#007bff"),
            icon_url=banner_config.get("icon_url"),
            ios_app=ios_app,
            android_app=android_app,
        )

        deep_linking = DeepLinkConfig(
            enabled=deep_link_config.get("enabled", False),
            scheme=deep_link_config.get("scheme"),
            ios_universal_link_domain=deep_link_config.get("ios_universal_link_domain"),
            android_app_link_domain=deep_link_config.get("android_app_link_domain"),
            fallback_url=deep_link_config.get("fallback_url"),
        )

        return MobileAppConfig(
            smart_banner=smart_banner,
            deep_linking=deep_linking,
            ios_app_store_url=ios_config.get("store_url"),
            android_play_store_url=android_config.get("store_url"),
        )

    @staticmethod
    def resolve_app_download_link(root, info, user_agent=None):
        config = get_mobile_config()
        ios_config = config.get("ios", {})
        android_config = config.get("android", {})

        # Detect platform from user agent
        platform = None
        is_mobile = False
        store_url = None

        if user_agent:
            user_agent_lower = user_agent.lower()

            if "iphone" in user_agent_lower or "ipad" in user_agent_lower:
                platform = AppPlatform.IOS
                is_mobile = True
                if ios_config.get("app_id"):
                    store_url = ios_config.get("store_url", f"https://apps.apple.com/app/{ios_config.get('app_id')}")

            elif "android" in user_agent_lower:
                platform = AppPlatform.ANDROID
                is_mobile = True
                if android_config.get("app_id"):
                    store_url = android_config.get("store_url", f"https://play.google.com/store/apps/details?id={android_config.get('app_id')}")

            elif "mobile" in user_agent_lower:
                is_mobile = True

        # Fallback URL for desktop or unknown platforms
        if not store_url:
            # Default to Play Store or a landing page
            store_url = android_config.get("store_url") or ios_config.get("store_url") or "#download"

        # QR code URL for desktop users
        qr_code_url = None
        if not is_mobile and store_url:
            # In production, this would generate or link to an actual QR code
            qr_code_url = f"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={store_url}"

        return AppDownloadLink(
            platform=platform,
            store_url=store_url,
            is_mobile=is_mobile,
            qr_code_url=qr_code_url,
        )

    @staticmethod
    def resolve_product_deep_link(root, info, product_id):
        config = get_mobile_config()
        deep_link_config = config.get("deep_linking", {})

        if not deep_link_config.get("enabled"):
            return None

        scheme = deep_link_config.get("scheme", "myapp")

        # Extract product slug or ID from global ID
        from ..core.utils import from_global_id_or_error
        try:
            _, product_pk = from_global_id_or_error(product_id, "Product")
            return f"{scheme}://product/{product_pk}"
        except Exception:
            return None


__all__ = ["MobileAppQueries"]
