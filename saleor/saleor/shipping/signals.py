"""
Signal handlers for shipping cache invalidation.
"""

from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from ..core.cache_utils import shipping_methods_cache_key
from .models import ShippingMethod, ShippingZone, ShippingZoneChannel


@receiver([post_save, post_delete], sender=ShippingMethod)
def invalidate_shipping_methods_cache(sender, instance, **kwargs):
    """
    Invalidate shipping methods cache when shipping methods change.
    """
    from django.core.cache import cache

    # Invalidate cache for all channels in this shipping zone
    for channel in instance.shipping_zone.channels.all():
        cache_key = shipping_methods_cache_key(channel.id)
        cache.delete(cache_key)


@receiver([post_save, post_delete], sender=ShippingZoneChannel)
def invalidate_shipping_zone_channel_cache(sender, instance, **kwargs):
    """
    Invalidate shipping methods cache when zone-channel relationships change.
    """
    from django.core.cache import cache

    cache_key = shipping_methods_cache_key(instance.channel_id)
    cache.delete(cache_key)


@receiver([post_save, post_delete], sender=ShippingZone)
def invalidate_shipping_zone_cache(sender, instance, **kwargs):
    """
    Invalidate shipping methods cache when shipping zones change.
    """
    from django.core.cache import cache

    # Invalidate cache for all channels in this zone
    for channel in instance.channels.all():
        cache_key = shipping_methods_cache_key(channel.id)
        cache.delete(cache_key)
