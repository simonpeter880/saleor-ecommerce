"""
Caching utilities and decorators for Saleor.

This module provides utilities for caching frequently accessed data
with automatic invalidation and monitoring.
"""

import hashlib
import json
import logging
from functools import wraps
from typing import Any, Callable

from django.core.cache import cache

logger = logging.getLogger(__name__)


# Cache TTL constants (in seconds)
CACHE_TTL_SHORT = 60  # 1 minute
CACHE_TTL_MEDIUM = 300  # 5 minutes
CACHE_TTL_LONG = 900  # 15 minutes
CACHE_TTL_VERY_LONG = 3600  # 1 hour
CACHE_TTL_DAY = 86400  # 24 hours


def make_cache_key(*parts: Any) -> str:
    """
    Create a cache key from multiple parts.

    Args:
        *parts: Parts to combine into a cache key

    Returns:
        str: A cache key with parts joined by colons

    Example:
        >>> make_cache_key("product", 123, "channel", 5)
        'product:123:channel:5'
    """
    return ":".join(str(part) for part in parts)


def hash_cache_key(data: Any) -> str:
    """
    Create a hashed cache key from complex data.

    Args:
        data: Data to hash (will be JSON-serialized)

    Returns:
        str: SHA256 hash of the data

    Example:
        >>> hash_cache_key({"product_id": 123, "channel_id": 5})
        'a1b2c3...'
    """
    json_data = json.dumps(data, sort_keys=True)
    return hashlib.sha256(json_data.encode("utf-8")).hexdigest()


def cached(
    cache_key_fn: Callable[..., str],
    timeout: int = CACHE_TTL_MEDIUM,
    log_metrics: bool = False,
):
    """
    Decorator to cache function results with automatic metrics logging.

    Args:
        cache_key_fn: Function that generates cache key from args/kwargs
        timeout: Cache timeout in seconds
        log_metrics: Whether to log cache hits/misses

    Returns:
        Decorated function with caching

    Example:
        >>> @cached(
        ...     cache_key_fn=lambda product_id: f"product:{product_id}",
        ...     timeout=CACHE_TTL_LONG
        ... )
        ... def get_product(product_id):
        ...     return Product.objects.get(id=product_id)
    """

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = cache_key_fn(*args, **kwargs)
            result = cache.get(cache_key)

            if result is not None:
                if log_metrics:
                    logger.debug(f"Cache HIT: {cache_key}")
                return result

            if log_metrics:
                logger.debug(f"Cache MISS: {cache_key}")

            result = func(*args, **kwargs)
            cache.set(cache_key, result, timeout=timeout)
            return result

        # Add cache invalidation method
        def invalidate(*args, **kwargs):
            cache_key = cache_key_fn(*args, **kwargs)
            cache.delete(cache_key)
            if log_metrics:
                logger.debug(f"Cache INVALIDATED: {cache_key}")

        wrapper.invalidate = invalidate
        return wrapper

    return decorator


def invalidate_cache_pattern(pattern: str):
    """
    Invalidate all cache keys matching a pattern.

    Note: This requires a cache backend that supports pattern matching (Redis).

    Args:
        pattern: Pattern to match (e.g., "product:*")

    Example:
        >>> invalidate_cache_pattern("product:123:*")
    """
    try:
        # This works with Redis cache backend
        from django.core.cache.backends.redis import RedisCache

        if isinstance(cache, RedisCache):
            client = cache._cache.get_client(write=True)
            keys = client.keys(f"{cache.key_prefix}*{pattern}*")
            if keys:
                client.delete(*keys)
                logger.info(f"Invalidated {len(keys)} cache keys matching: {pattern}")
        else:
            logger.warning("Pattern-based cache invalidation requires Redis backend")
    except Exception as e:
        logger.error(f"Error invalidating cache pattern {pattern}: {e}")


def get_or_set_cache(
    cache_key: str,
    callable_fn: Callable[[], Any],
    timeout: int = CACHE_TTL_MEDIUM,
) -> Any:
    """
    Get value from cache or compute and cache it.

    Args:
        cache_key: Cache key to use
        callable_fn: Function to call if cache miss
        timeout: Cache timeout in seconds

    Returns:
        Cached or computed value

    Example:
        >>> result = get_or_set_cache(
        ...     "expensive_query",
        ...     lambda: perform_expensive_query(),
        ...     timeout=CACHE_TTL_LONG
        ... )
    """
    result = cache.get(cache_key)
    if result is None:
        result = callable_fn()
        cache.set(cache_key, result, timeout=timeout)
    return result


# Specific cache key generators for common use cases


def product_channel_listing_cache_key(product_id: int, channel_id: int) -> str:
    """Generate cache key for product channel listing."""
    return make_cache_key("product_channel_listing", product_id, channel_id)


def product_listings_cache_key(product_id: int) -> str:
    """Generate cache key for all product listings."""
    return make_cache_key("product_listings", product_id)


def shipping_methods_cache_key(channel_id: int) -> str:
    """Generate cache key for shipping methods per channel."""
    return make_cache_key("shipping_methods", channel_id)


def user_permissions_cache_key(user_id: int) -> str:
    """Generate cache key for user permissions."""
    return make_cache_key("user_permissions", user_id)


def category_tree_cache_key(channel_id: int | None = None) -> str:
    """Generate cache key for category tree."""
    if channel_id:
        return make_cache_key("category_tree", channel_id)
    return "category_tree"


def tax_configuration_cache_key(channel_id: int) -> str:
    """Generate cache key for tax configuration."""
    return make_cache_key("tax_config", channel_id)


def collection_products_cache_key(collection_id: int, channel_id: int) -> str:
    """Generate cache key for collection products."""
    return make_cache_key("collection_products", collection_id, channel_id)


# Cache invalidation helpers


def invalidate_product_cache(product_id: int):
    """Invalidate all caches related to a product."""
    keys_to_delete = [
        product_listings_cache_key(product_id),
    ]
    cache.delete_many(keys_to_delete)
    logger.debug(f"Invalidated product cache for product_id={product_id}")


def invalidate_channel_cache(channel_id: int):
    """Invalidate all caches related to a channel."""
    keys_to_delete = [
        shipping_methods_cache_key(channel_id),
        category_tree_cache_key(channel_id),
        tax_configuration_cache_key(channel_id),
    ]
    cache.delete_many(keys_to_delete)
    logger.debug(f"Invalidated channel cache for channel_id={channel_id}")


def invalidate_user_cache(user_id: int):
    """Invalidate all caches related to a user."""
    keys_to_delete = [
        user_permissions_cache_key(user_id),
    ]
    cache.delete_many(keys_to_delete)
    logger.debug(f"Invalidated user cache for user_id={user_id}")
