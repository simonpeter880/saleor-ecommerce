"""Social sharing schema."""

import graphene
from django.core.cache import cache

from .types import (
    SocialShareData,
    SocialShareLink,
    OpenGraphData,
    SocialPlatform,
    generate_share_links,
)
from .mutations import SocialMutations


class SocialQueries(graphene.ObjectType):
    """Social sharing queries."""

    product_share_data = graphene.Field(
        SocialShareData,
        product_id=graphene.ID(
            required=True,
            description="ID of the product to get share data for.",
        ),
        storefront_url=graphene.String(
            required=True,
            description="Base URL of the storefront (e.g., 'https://mystore.com').",
        ),
        site_name=graphene.String(
            description="Name of the site for Open Graph tags.",
        ),
        description=(
            "Get social sharing data for a product including share links "
            "and Open Graph metadata."
        ),
    )

    @staticmethod
    def resolve_product_share_data(root, info, product_id, storefront_url, site_name=None):
        from ..core.utils import from_global_id_or_error
        from ...product import models as product_models

        try:
            _, product_pk = from_global_id_or_error(product_id, "Product")
            product = product_models.Product.objects.get(pk=product_pk)
        except Exception:
            return None

        # Build product URL
        product_url = f"{storefront_url.rstrip('/')}/product/{product.slug}"

        # Get product thumbnail
        image_url = ""
        thumbnail = product.media.filter(type="IMAGE").first()
        if thumbnail:
            image_url = thumbnail.image.url if thumbnail.image else ""

        # Get product description
        description = ""
        if product.description:
            # Extract plain text from rich text
            if isinstance(product.description, dict):
                blocks = product.description.get("blocks", [])
                description = " ".join(
                    block.get("data", {}).get("text", "")
                    for block in blocks
                    if block.get("type") == "paragraph"
                )
            else:
                description = str(product.description)[:500]

        # Get price if available (simplified - would need channel context in real impl)
        price_str = ""

        # Generate share links
        share_links_data = generate_share_links(
            product_url=product_url,
            product_name=product.name,
            product_description=description,
            image_url=image_url,
            price=price_str,
        )

        share_links = [
            SocialShareLink(
                platform=link["platform"],
                url=link["url"],
                label=link["label"],
                icon=link["icon"],
            )
            for link in share_links_data
        ]

        # Build Open Graph data
        open_graph = OpenGraphData(
            title=product.name,
            description=description[:200] if description else None,
            image=image_url or None,
            url=product_url,
            type="product",
            site_name=site_name,
        )

        # Get share count from cache
        cache_key = f"product_share_count:{product_pk}"
        share_count = cache.get(cache_key, 0)

        return SocialShareData(
            product_url=product_url,
            share_links=share_links,
            open_graph=open_graph,
            share_count=share_count,
        )


__all__ = ["SocialMutations", "SocialQueries"]
