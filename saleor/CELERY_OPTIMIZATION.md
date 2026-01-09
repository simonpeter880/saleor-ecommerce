# Celery Task Optimization Guide

This guide covers best practices for optimizing Celery async tasks in Saleor for better performance and reliability.

## Current Configuration Status

✅ **Well-Configured:** Saleor's Celery setup is already optimized with:
- JSON serialization (fast and secure)
- Prefetch multiplier = 1 (prevents worker hogging)
- Task expiration (prevents stale tasks)
- Periodic beat schedules
- Read replica support (via database router)

---

## Key Configuration Settings

### Current Settings (Already Optimal)

```python
# From saleor/settings.py

CELERY_ACCEPT_CONTENT = ["json"]  # Secure serialization
CELERY_TASK_SERIALIZER = "json"   # Fast and safe
CELERY_RESULT_SERIALIZER = "json"

# Prefetch only 1 task at a time (prevents long task blocking)
CELERY_WORKER_PREFETCH_MULTIPLIER = 1

# Task timeouts
BEAT_EXPIRE_ORDERS_AFTER_TIMEDELTA = 5 minutes
BEAT_UPDATE_SEARCH_EXPIRE_AFTER_SEC = 20 seconds
BEAT_PRICE_RECALCULATION_SCHEDULE_EXPIRE_AFTER_SEC = 30 seconds
```

**Why These Are Good:**
- Prevents worker starvation
- Avoids pickle security issues
- Expires old tasks automatically
- Distributes work evenly

---

## Best Practices for Writing Tasks

### 1. Use Idempotent Tasks

**BAD:**
```python
@shared_task
def increment_counter(product_id):
    product = Product.objects.get(id=product_id)
    product.view_count += 1  # NOT idempotent!
    product.save()
```

**GOOD:**
```python
@shared_task
def set_view_count(product_id, count):
    product = Product.objects.get(id=product_id)
    product.view_count = count  # Idempotent!
    product.save(update_fields=['view_count'])
```

### 2. Set Task Timeouts

```python
@shared_task(time_limit=300, soft_time_limit=240)  # 5 min hard, 4 min soft
def process_large_export(export_id):
    """Process export with timeout protection."""
    try:
        export = Export.objects.get(id=export_id)
        # Process export...
    except SoftTimeLimitExceeded:
        # Clean up and retry
        logger.warning(f"Export {export_id} exceeded soft limit")
        raise
```

### 3. Use Batch Operations

**BAD (slow):**
```python
@shared_task
def update_prices(product_ids):
    for product_id in product_ids:
        product = Product.objects.get(id=product_id)
        product.price = calculate_price(product)
        product.save()  # Individual save - slow!
```

**GOOD (10x faster):**
```python
from saleor.core.batch_ops import bulk_update_fields

@shared_task
def update_prices(product_ids):
    products = Product.objects.filter(id__in=product_ids)

    updated_products = []
    for product in products:
        product.price = calculate_price(product)
        updated_products.append(product)

    # Batch update - 10x faster!
    bulk_update_fields(updated_products, ['price'], batch_size=1000)
```

### 4. Use Database Read Replicas

The database router automatically uses replicas for reads:

```python
@shared_task
def generate_report(start_date, end_date):
    # Automatically uses read replica!
    orders = Order.objects.filter(
        created_at__range=(start_date, end_date)
    )

    # Generate report...
```

### 5. Use Memory-Efficient Iteration

```python
@shared_task
def process_all_products():
    # BAD: Loads all products into memory
    # products = Product.objects.all()

    # GOOD: Memory-efficient iteration
    for product in Product.objects.iterator(chunk_size=1000):
        process_product(product)
```

### 6. Implement Retry Logic

```python
@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={'max_retries': 3, 'countdown': 60},
    retry_backoff=True,
)
def send_order_confirmation(self, order_id):
    """Send confirmation with automatic retries."""
    order = Order.objects.get(id=order_id)
    send_email(order.email, order.confirmation_template)
```

### 7. Use Task Chaining for Complex Workflows

```python
from celery import chain

# Chain tasks sequentially
workflow = chain(
    process_order.si(order_id),
    calculate_shipping.si(order_id),
    send_confirmation.si(order_id),
)
workflow.apply_async()

# Or use groups for parallel execution
from celery import group

parallel_tasks = group(
    update_inventory.si(line_id) for line_id in line_ids
)
parallel_tasks.apply_async()
```

---

## Performance Tuning

### Concurrency Settings

**For CPU-bound tasks:**
```bash
# Use multiprocessing (default)
celery -A saleor.celeryconf:app worker --concurrency=4
```

**For I/O-bound tasks:**
```bash
# Use gevent for better I/O handling
celery -A saleor.celeryconf:app worker --pool=gevent --concurrency=100
```

### Queue Prioritization

```python
# Define queues with priorities
CELERY_TASK_ROUTES = {
    'saleor.order.tasks.send_order_confirmation': {
        'queue': 'high_priority',
    },
    'saleor.product.tasks.update_search_vectors': {
        'queue': 'low_priority',
    },
}

# Start workers for specific queues
# High priority: celery -A saleor worker -Q high_priority --concurrency=8
# Low priority: celery -A saleor worker -Q low_priority --concurrency=2
```

### Task Result Backend

For production, use Redis as result backend:

```bash
# In .env
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# Or disable if not needed (faster)
CELERY_RESULT_BACKEND=

# Set result expiration
CELERY_RESULT_EXPIRES=3600  # 1 hour
```

---

## Monitoring and Debugging

### Enable Task Events

```bash
# Start worker with events
celery -A saleor worker --events

# Monitor with Flower
celery -A saleor flower

# Or use celery events
celery -A saleor events
```

### Logging Best Practices

```python
import logging

logger = logging.getLogger(__name__)

@shared_task
def complex_task(data_id):
    logger.info(f"Starting task for {data_id}")

    try:
        # Task logic
        result = process_data(data_id)
        logger.info(f"Task completed for {data_id}: {result}")
        return result
    except Exception as e:
        logger.error(f"Task failed for {data_id}: {e}", exc_info=True)
        raise
```

### Performance Metrics

Monitor these metrics in production:

1. **Task Duration:**
   ```python
   from time import time

   @shared_task
   def monitored_task():
       start = time()
       # Do work
       duration = time() - start
       logger.info(f"Task took {duration:.2f}s")
   ```

2. **Queue Length:**
   ```bash
   # Check queue lengths
   celery -A saleor inspect active_queues
   ```

3. **Worker Stats:**
   ```bash
   # Check worker statistics
   celery -A saleor inspect stats
   ```

---

## Common Patterns in Saleor

### Pattern 1: Periodic Search Vector Updates

```python
# From saleor/product/tasks.py
@shared_task
def update_products_search_vector_task():
    """Update search vectors for products."""
    products = Product.objects.filter(search_index_dirty=True)

    for product in products.iterator(chunk_size=100):
        product.search_vector = generate_search_vector(product)
        product.search_index_dirty = False

    # Bulk update for efficiency
    Product.objects.bulk_update(
        products,
        ['search_vector', 'search_index_dirty'],
        batch_size=100
    )
```

### Pattern 2: Order Expiration

```python
@shared_task
def expire_orders_task():
    """Expire old draft orders."""
    expiration_time = timezone.now() - BEAT_EXPIRE_ORDERS_AFTER_TIMEDELTA

    expired_orders = Order.objects.filter(
        status='draft',
        created_at__lt=expiration_time,
    )

    # Use iterator for memory efficiency
    for order in expired_orders.iterator(chunk_size=100):
        order.status = 'expired'
        order.save(update_fields=['status'])
```

### Pattern 3: Webhook Delivery

```python
@shared_task(
    bind=True,
    autoretry_for=(RequestException,),
    retry_kwargs={'max_retries': 5},
    retry_backoff=True,
)
def send_webhook(self, webhook_id, payload):
    """Send webhook with retry logic."""
    webhook = Webhook.objects.get(id=webhook_id)

    try:
        response = requests.post(
            webhook.target_url,
            json=payload,
            timeout=10,
        )
        response.raise_for_status()
    except RequestException as e:
        logger.warning(f"Webhook {webhook_id} failed, retrying: {e}")
        raise
```

---

## Troubleshooting

### Issue: Tasks Not Being Processed

**Possible Causes:**
1. Worker not running
2. Wrong queue name
3. Broker connection issue

**Solutions:**
```bash
# Check worker status
celery -A saleor inspect active

# Check broker connection
celery -A saleor inspect ping

# Check queue routing
celery -A saleor inspect registered
```

### Issue: High Memory Usage

**Causes:**
- Loading large querysets without `.iterator()`
- Prefetch multiplier too high
- Not using batch operations

**Solutions:**
```python
# Use iterator for large datasets
for item in queryset.iterator(chunk_size=1000):
    process(item)

# Set prefetch multiplier to 1
CELERY_WORKER_PREFETCH_MULTIPLIER = 1

# Use batch operations
bulk_update_fields(objects, fields, batch_size=1000)
```

### Issue: Tasks Taking Too Long

**Diagnosis:**
```python
# Add timing logs
import time

@shared_task
def slow_task():
    start = time.time()

    step1_start = time.time()
    do_step_1()
    logger.info(f"Step 1: {time.time() - step1_start:.2f}s")

    step2_start = time.time()
    do_step_2()
    logger.info(f"Step 2: {time.time() - step2_start:.2f}s")

    logger.info(f"Total: {time.time() - start:.2f}s")
```

**Solutions:**
- Split into smaller tasks
- Use batch operations
- Add database indexes
- Use read replicas
- Cache expensive computations

---

## Recommended Task Structure

```python
import logging
from celery import shared_task
from django.db import transaction

logger = logging.getLogger(__name__)

@shared_task(
    bind=True,  # Access to self
    autoretry_for=(Exception,),  # Auto-retry on errors
    retry_kwargs={'max_retries': 3, 'countdown': 60},
    retry_backoff=True,  # Exponential backoff
    time_limit=300,  # 5 minute hard limit
    soft_time_limit=240,  # 4 minute soft limit
)
def optimized_task(self, data_id):
    """
    Well-structured task with best practices.

    Args:
        data_id: ID of data to process

    Returns:
        Result of processing
    """
    logger.info(f"Starting task for {data_id}")

    try:
        with transaction.atomic():
            # Get data (uses read replica automatically)
            data = Data.objects.get(id=data_id)

            # Process (with proper error handling)
            result = process_data(data)

            # Save (uses primary database)
            data.result = result
            data.save(update_fields=['result'])

        logger.info(f"Task completed for {data_id}")
        return result

    except SoftTimeLimitExceeded:
        logger.warning(f"Task {data_id} exceeded soft time limit")
        # Clean up and re-queue
        raise

    except Exception as e:
        logger.error(f"Task failed for {data_id}: {e}", exc_info=True)
        # Will auto-retry due to autoretry_for
        raise
```

---

## Summary

Saleor's Celery configuration is **already well-optimized**! Key points:

✅ **Good defaults:** Prefetch=1, JSON serialization, task expiration
✅ **Database routing:** Automatic read replica usage
✅ **Memory efficiency:** Uses `.iterator()` in many places

**Quick Wins:**
1. Use `bulk_update_fields()` for batch updates (10x faster)
2. Set task timeouts to prevent hung tasks
3. Use `.iterator()` for large querysets (60-80% less memory)
4. Implement retry logic for network tasks
5. Monitor task duration and queue length

**Advanced:**
- Use gevent pool for I/O-bound tasks
- Implement queue prioritization
- Set up Flower for monitoring
- Use Redis result backend for production

---

**Last Updated:** 2026-01-05
**Status:** ✅ Well-Configured - Best practices documentation
