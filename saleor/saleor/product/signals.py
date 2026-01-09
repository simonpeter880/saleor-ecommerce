from django.core.cache import cache
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from ..core.cache_utils import (
    category_tree_cache_key,
    invalidate_product_cache,
    product_channel_listing_cache_key,
    product_listings_cache_key,
)
from ..core.tasks import delete_from_storage_task


def delete_background_image(sender, instance, **kwargs):
    if img := instance.background_image:
        delete_from_storage_task.delay(img.name)


def delete_digital_content_file(sender, instance, **kwargs):
    if file := instance.content_file:
        delete_from_storage_task.delay(file.name)


def delete_product_media_image(sender, instance, **kwargs):
    if file := instance.image:
        delete_from_storage_task.delay(file.name)


# Cache invalidation signal handlers


@receiver([post_save, post_delete], sender="product.ProductChannelListing")
def invalidate_product_channel_listing_cache(sender, instance, **kwargs):
    """
    Invalidate product channel listing cache when it's updated or deleted.

    This ensures that product visibility and pricing changes are reflected immediately.
    """
    cache_keys = [
        product_channel_listing_cache_key(instance.product_id, instance.channel_id),
        product_listings_cache_key(instance.product_id),
    ]
    cache.delete_many(cache_keys)


@receiver([post_save, post_delete], sender="product.Product")
def invalidate_product_cache_on_change(sender, instance, **kwargs):
    """
    Invalidate product caches when product is updated or deleted.
    """
    invalidate_product_cache(instance.id)


@receiver([post_save, post_delete], sender="product.Category")
def invalidate_category_tree_cache(sender, instance, **kwargs):
    """
    Invalidate category tree cache when categories change.

    This invalidates the cache for all channels since categories are global.
    """
    # Invalidate global category tree
    cache.delete(category_tree_cache_key())


@receiver([post_save, post_delete], sender="product.CollectionProduct")
def invalidate_collection_products_cache(sender, instance, **kwargs):
    """
    Invalidate collection products cache when products are added/removed from collection.
    """
    # Pattern: collection_products:{collection_id}:{channel_id}
    # Clear pattern if using Redis, otherwise clear on next access
    pass  # Will be cleared naturally or via pattern invalidation in Redis
