"""Mobile app banner GraphQL types."""

import graphene


class AppPlatform(graphene.Enum):
    """Mobile app platforms."""

    IOS = "ios"
    ANDROID = "android"


class BannerDisplayMode(graphene.Enum):
    """When to display the app banner."""

    ALWAYS = "always"
    MOBILE_ONLY = "mobile_only"
    FIRST_VISIT = "first_visit"
    AFTER_SCROLL = "after_scroll"
    ON_EXIT_INTENT = "on_exit_intent"


class BannerPosition(graphene.Enum):
    """Position of the app banner."""

    TOP = "top"
    BOTTOM = "bottom"
    FLOATING = "floating"


class AppStoreInfo(graphene.ObjectType):
    """App store information for a specific platform."""

    platform = graphene.Field(
        AppPlatform,
        required=True,
        description="The app platform (iOS or Android).",
    )
    app_id = graphene.String(
        required=True,
        description="App ID in the store (e.g., com.myapp for Android, id123456789 for iOS).",
    )
    store_url = graphene.String(
        required=True,
        description="Direct link to the app in the store.",
    )
    app_name = graphene.String(
        description="Display name of the app.",
    )
    app_icon_url = graphene.String(
        description="URL to the app icon image.",
    )
    rating = graphene.Float(
        description="App rating in the store.",
    )
    price = graphene.String(
        description="App price or 'Free'.",
    )
    publisher = graphene.String(
        description="App publisher name.",
    )


class SmartBannerConfig(graphene.ObjectType):
    """Configuration for the smart app banner."""

    enabled = graphene.Boolean(
        required=True,
        description="Whether the app banner is enabled.",
    )
    title = graphene.String(
        description="Banner title text.",
    )
    description = graphene.String(
        description="Banner description text.",
    )
    button_text = graphene.String(
        description="Text for the download button.",
    )
    close_button_text = graphene.String(
        description="Text for the close/dismiss button.",
    )
    position = graphene.Field(
        BannerPosition,
        description="Position of the banner on the page.",
    )
    display_mode = graphene.Field(
        BannerDisplayMode,
        description="When to display the banner.",
    )
    show_after_close_days = graphene.Int(
        description="Days before showing banner again after user closes it.",
    )
    background_color = graphene.String(
        description="Background color of the banner (hex code).",
    )
    text_color = graphene.String(
        description="Text color (hex code).",
    )
    button_color = graphene.String(
        description="Button background color (hex code).",
    )
    icon_url = graphene.String(
        description="Custom app icon URL for the banner.",
    )
    ios_app = graphene.Field(
        AppStoreInfo,
        description="iOS App Store information.",
    )
    android_app = graphene.Field(
        AppStoreInfo,
        description="Google Play Store information.",
    )


class DeepLinkConfig(graphene.ObjectType):
    """Deep linking configuration for the mobile app."""

    enabled = graphene.Boolean(
        required=True,
        description="Whether deep linking is enabled.",
    )
    scheme = graphene.String(
        description="Custom URL scheme (e.g., 'myapp://').",
    )
    ios_universal_link_domain = graphene.String(
        description="Domain for iOS Universal Links.",
    )
    android_app_link_domain = graphene.String(
        description="Domain for Android App Links.",
    )
    fallback_url = graphene.String(
        description="URL to redirect to if app is not installed.",
    )


class MobileAppConfig(graphene.ObjectType):
    """Complete mobile app configuration."""

    smart_banner = graphene.Field(
        SmartBannerConfig,
        description="Smart app banner configuration.",
    )
    deep_linking = graphene.Field(
        DeepLinkConfig,
        description="Deep linking configuration.",
    )
    ios_app_store_url = graphene.String(
        description="iOS App Store URL.",
    )
    android_play_store_url = graphene.String(
        description="Google Play Store URL.",
    )


class AppDownloadLink(graphene.ObjectType):
    """Dynamic app download link based on user's device."""

    platform = graphene.Field(
        AppPlatform,
        description="Detected platform (null if desktop).",
    )
    store_url = graphene.String(
        required=True,
        description="URL to download the app.",
    )
    is_mobile = graphene.Boolean(
        required=True,
        description="Whether the user is on a mobile device.",
    )
    qr_code_url = graphene.String(
        description="URL to a QR code image for desktop users.",
    )
