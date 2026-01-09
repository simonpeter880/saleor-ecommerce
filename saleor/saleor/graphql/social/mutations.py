"""Social sharing mutations using database models."""

import graphene

from ...product import models as product_models
from ...social.models import ProductShare, ProductShareClick
from ..core.fields import JSONString
from ..core.mutations import BaseMutation
from ..core.types import Error
from ..core.utils import from_global_id_or_error
from .types import SocialPlatform


class SocialShareError(Error):
    """Errors for social sharing operations."""

    code = graphene.String(description="The error code.", required=True)


class TrackProductShare(BaseMutation):
    """Track when a product is shared on social media."""

    success = graphene.Boolean(
        required=True,
        description="Whether the share was tracked successfully.",
    )
    share_count = graphene.Int(
        description="Updated total share count for this product.",
    )

    class Arguments:
        product_id = graphene.ID(
            required=True,
            description="The ID of the product being shared.",
        )
        platform = graphene.Argument(
            SocialPlatform,
            required=True,
            description="The platform where the product is being shared.",
        )

    class Meta:
        description = "Track a product share event for analytics."
        error_type_class = SocialShareError

    @classmethod
    def perform_mutation(cls, root, info, **data):
        product_id = data.get("product_id")
        platform = data.get("platform")

        try:
            _, product_pk = from_global_id_or_error(product_id, "Product")
            product = product_models.Product.objects.get(pk=product_pk)
        except Exception:
            return cls(success=False, share_count=None)

        # Get user if authenticated
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

        # Get platform value
        platform_value = platform.value if hasattr(platform, 'value') else str(platform)

        # Create share record in database
        ProductShare.objects.create(
            product=product,
            user=user,
            platform=platform_value,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        # Get total share count
        share_count = ProductShare.objects.filter(product=product).count()

        return cls(success=True, share_count=share_count)


class GetShareAnalytics(BaseMutation):
    """Get sharing analytics for a product."""

    total_shares = graphene.Int(
        description="Total number of shares across all platforms.",
    )
    platform_breakdown = JSONString(
        description="Share counts by platform.",
    )

    class Arguments:
        product_id = graphene.ID(
            required=True,
            description="The ID of the product.",
        )

    class Meta:
        description = "Get sharing analytics for a product."
        error_type_class = SocialShareError

    @classmethod
    def perform_mutation(cls, root, info, **data):
        product_id = data.get("product_id")

        try:
            _, product_pk = from_global_id_or_error(product_id, "Product")
        except Exception:
            return cls(total_shares=0, platform_breakdown={})

        # Get stats from database
        stats = ProductShare.get_product_share_stats(product_pk)

        return cls(
            total_shares=stats["total_shares"],
            platform_breakdown=stats["platform_breakdown"],
        )


class TrackShareClick(BaseMutation):
    """Track when someone clicks a shared product link."""

    success = graphene.Boolean(required=True)

    class Arguments:
        product_id = graphene.ID(required=True)
        source_platform = graphene.Argument(SocialPlatform)

    class Meta:
        description = "Track a click on a shared product link."
        error_type_class = SocialShareError

    @classmethod
    def perform_mutation(cls, root, info, **data):
        product_id = data.get("product_id")
        source_platform = data.get("source_platform")

        try:
            _, product_pk = from_global_id_or_error(product_id, "Product")
            product = product_models.Product.objects.get(pk=product_pk)
        except Exception:
            return cls(success=False)

        request = info.context
        ip_address = None
        user_agent = ""
        if hasattr(request, "META"):
            ip_address = request.META.get("REMOTE_ADDR")
            user_agent = request.META.get("HTTP_USER_AGENT", "")

        platform_value = ""
        if source_platform:
            platform_value = source_platform.value if hasattr(source_platform, 'value') else str(source_platform)

        ProductShareClick.objects.create(
            product=product,
            source_platform=platform_value,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        return cls(success=True)


class SocialMutations(graphene.ObjectType):
    """Social sharing mutations."""

    track_product_share = TrackProductShare.Field()
    get_share_analytics = GetShareAnalytics.Field()
    track_share_click = TrackShareClick.Field()
