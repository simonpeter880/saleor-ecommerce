# Database Connection Pooling Improvements

This document describes the database connection pooling improvements implemented for better performance.

## Overview

Two complementary improvements have been implemented:

1. **Django Connection Persistence** - Reuses database connections across requests
2. **PgBouncer Connection Pooling** - Centralized connection pool manager

## 1. Django Connection Persistence

### What Changed

- Enabled `DB_CONN_MAX_AGE=600` (10 minutes) in `.env`
- Previously set to `0` (no connection reuse)

### Benefits

- Eliminates connection overhead for each request
- Reduces PostgreSQL connection setup time
- Improves response times, especially for high-traffic APIs

### Configuration

Located in [.env](.env):

```bash
DB_CONN_MAX_AGE=600  # 10 minutes
```

### How It Works

- Django maintains a connection pool per worker process
- Connections are reused for up to 10 minutes
- After 10 minutes of inactivity, connections are closed
- New connections are created as needed

## 2. PgBouncer Connection Pooling

### What Changed

- Added `pgbouncer` service to Docker Compose
- Created pgbouncer configuration files:
  - [.devcontainer/pgbouncer.ini](.devcontainer/pgbouncer.ini)
  - [.devcontainer/userlist.txt](.devcontainer/userlist.txt)

### Benefits

- Centralized connection management across all application instances
- Prevents connection exhaustion under high load
- Reduces PostgreSQL resource usage
- Better connection distribution

### Configuration

#### Pool Settings

Located in [.devcontainer/pgbouncer.ini](.devcontainer/pgbouncer.ini):

```ini
pool_mode = transaction          # Release connection after each transaction
default_pool_size = 25          # Default connections per database
min_pool_size = 5               # Minimum connections to keep warm
reserve_pool_size = 5           # Additional connections for bursts
max_db_connections = 100        # Maximum total connections
max_client_conn = 1000          # Maximum client connections
```

#### Connection Timeouts

```ini
server_idle_timeout = 600       # Close idle server connections after 10 min
server_lifetime = 3600          # Recycle connections every hour
server_connect_timeout = 15     # Connection timeout to PostgreSQL
query_wait_timeout = 120        # Max time query waits for connection
```

### How It Works

1. **Transaction Mode**: Connection is returned to pool after each transaction completes
2. **Connection Reuse**: Idle connections are reused for new transactions
3. **Pool Management**: Maintains min_pool_size warm connections always ready
4. **Burst Handling**: Can temporarily allocate reserve_pool_size extra connections
5. **Connection Limits**: Enforces max_db_connections to prevent PostgreSQL overload

## Usage

### Option 1: Direct PostgreSQL Connection (Default)

Current setup - connects directly to PostgreSQL on port 5432:

```bash
DATABASE_URL=postgres://saleor:saleor@localhost:5432/saleor
```

**Pros:**
- Simpler setup
- Good for development
- Benefits from Django connection persistence

**Cons:**
- No centralized pooling
- Higher PostgreSQL connection count under load

### Option 2: Using PgBouncer (Recommended for Production)

To enable PgBouncer, update `.env`:

```bash
# Change port from 5432 to 6432
DATABASE_URL=postgres://saleor:saleor@localhost:6432/saleor
```

**Pros:**
- Centralized connection pooling
- Lower PostgreSQL resource usage
- Better performance under high concurrency
- Connection queueing prevents overload

**Cons:**
- Additional service to monitor
- Slightly more complex setup

### Starting the Services

```bash
cd /home/cymo/projects/saleor/.devcontainer
docker-compose up -d
```

To verify PgBouncer is running:

```bash
docker-compose ps pgbouncer
```

## Monitoring

### PgBouncer Admin Console

Connect to PgBouncer admin database:

```bash
psql "postgres://saleor:saleor@localhost:6432/pgbouncer"
```

Useful commands:

```sql
-- Show pool statistics
SHOW POOLS;

-- Show client connections
SHOW CLIENTS;

-- Show server connections
SHOW SERVERS;

-- Show configuration
SHOW CONFIG;

-- Show statistics
SHOW STATS;
```

### Key Metrics to Monitor

1. **Pool Utilization**: `cl_active / default_pool_size` from `SHOW POOLS`
2. **Wait Queue**: `maxwait` should typically be 0 or low
3. **Connection Age**: Monitor `server_lifetime` effectiveness
4. **Pool Saturation**: If `cl_waiting > 0` frequently, increase `default_pool_size`

## Performance Tuning

### When to Increase Pool Size

Increase `default_pool_size` if:
- You see frequent `cl_waiting > 0` in `SHOW POOLS`
- Query wait times are increasing
- You have many concurrent transactions

### When to Decrease Pool Size

Decrease `default_pool_size` if:
- Many idle connections (`sv_idle` consistently high)
- PostgreSQL connection limit is being approached
- Memory usage is a concern

### Recommended Settings by Workload

#### Low Traffic (Development)
```ini
default_pool_size = 10
min_pool_size = 2
reserve_pool_size = 3
```

#### Medium Traffic (Staging)
```ini
default_pool_size = 25
min_pool_size = 5
reserve_pool_size = 5
```

#### High Traffic (Production)
```ini
default_pool_size = 50
min_pool_size = 10
reserve_pool_size = 10
max_db_connections = 200
```

## Troubleshooting

### Connection Timeouts

If you see connection timeout errors:

1. Check PgBouncer is running: `docker-compose ps pgbouncer`
2. Verify port 6432 is accessible
3. Check logs: `docker-compose logs pgbouncer`
4. Increase `query_wait_timeout` in pgbouncer.ini

### Pool Exhaustion

If queries are waiting for connections:

1. Check pool stats: `psql postgres://saleor:saleor@localhost:6432/pgbouncer -c "SHOW POOLS"`
2. Increase `default_pool_size` or `reserve_pool_size`
3. Verify no long-running transactions blocking pool

### Transaction Mode Issues

If you see unexpected transaction errors:

- Verify `pool_mode = transaction` in pgbouncer.ini
- Check for code that expects persistent connections across transactions
- Consider using `session` mode temporarily to diagnose

## Testing

### Load Testing

To test connection pooling under load:

```bash
# Install apache bench
apt-get install apache2-utils

# Test GraphQL endpoint
ab -n 1000 -c 50 -p graphql_query.json -T application/json http://localhost:8000/graphql/
```

Monitor during load:

```bash
# Terminal 1: Watch PgBouncer pools
watch -n 1 'psql postgres://saleor:saleor@localhost:6432/pgbouncer -c "SHOW POOLS"'

# Terminal 2: Watch PostgreSQL connections
watch -n 1 'psql postgres://saleor:saleor@localhost:5432/saleor -c "SELECT count(*) FROM pg_stat_activity"'
```

### Expected Results

**Without PgBouncer (direct PostgreSQL):**
- PostgreSQL connections ≈ number of worker processes × concurrent requests
- Higher connection churn

**With PgBouncer:**
- PostgreSQL connections ≤ default_pool_size (typically ~25)
- Stable connection count even under load
- Lower PostgreSQL CPU usage

## Migration Checklist

When deploying to production:

- [ ] Update `.env` with `DB_CONN_MAX_AGE=600`
- [ ] Deploy pgbouncer service
- [ ] Test with direct PostgreSQL connection first
- [ ] Monitor baseline performance metrics
- [ ] Update `DATABASE_URL` to use port 6432
- [ ] Monitor PgBouncer pool statistics
- [ ] Tune pool sizes based on observed load
- [ ] Set up alerts for pool exhaustion
- [ ] Document rollback procedure

## Rollback Procedure

To revert to direct PostgreSQL connection:

1. Update `.env`:
   ```bash
   DATABASE_URL=postgres://saleor:saleor@localhost:5432/saleor
   ```

2. Restart application

3. Optionally set `DB_CONN_MAX_AGE=0` to disable connection persistence

## References

- [Django Database Documentation](https://docs.djangoproject.com/en/5.0/ref/databases/)
- [PgBouncer Documentation](https://www.pgbouncer.org/usage.html)
- [PostgreSQL Connection Pooling Best Practices](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [Saleor Performance Optimizations](PERFORMANCE_OPTIMIZATIONS.md)

## Performance Impact

### Expected Improvements

Based on typical Django + PostgreSQL workloads:

1. **Connection Overhead Reduction**: 10-30ms saved per request
2. **Lower PostgreSQL CPU**: 20-40% reduction under load
3. **Better Concurrency**: Handle 2-3x more concurrent requests
4. **Reduced Latency**: P95 latency reduction of 15-25%

### Actual Results

Monitor these metrics before and after enabling:

- Request latency (P50, P95, P99)
- PostgreSQL connection count
- PostgreSQL CPU usage
- Application error rate
- Query wait times

---

**Last Updated**: 2026-01-05
**Author**: Claude Code
**Status**: Ready for testing
