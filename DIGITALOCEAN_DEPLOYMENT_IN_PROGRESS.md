# DigitalOcean Deployment - In Progress

**Date**: 2026-01-11
**Server IP**: 138.68.173.139
**Status**: 🔄 Building new storefront

## Current Status

### ✅ Completed Steps

1. **Server Access Verified**
   - SSH access confirmed to root@138.68.173.139
   - Server: Ubuntu (London datacenter)
   - Existing services running properly

2. **Existing Infrastructure Discovered**
   - ✅ Saleor API running (saleor-api container)
   - ✅ PostgreSQL database (saleor-postgres)
   - ✅ Redis cache (saleor-redis)
   - ✅ Celery workers (saleor-celery-worker, saleor-celery-beat)
   - ✅ Nginx reverse proxy (saleor-nginx)
   - ✅ Saleor Dashboard (saleor-dashboard)
   - ✅ Old storefront (saleor-storefront - to be replaced)

3. **Repository Deployed**
   - Cloned from: https://github.com/simonpeter880/saleor-ecommerce.git
   - Location: `/opt/deployments/storefront`
   - Branch: `feature/simplify-storefront`
   - Commits: 14 total (all migrations included)

4. **Environment Configuration**
   - Created `.env.local` with Saleor API connection
   - API URL: `http://saleor-api:8000/graphql/` (internal Docker network)
   - Storefront URL: `http://138.68.173.139`
   - Channel: `default-channel`

5. **Docker Setup**
   - Created `docker-compose.deploy.yml`
   - Network: Connected to existing `saleor_saleor_network`
   - Port: 3001 (new storefront) vs 3000 (old storefront)

### 🔄 In Progress

**Building New Storefront Docker Image**
- Command: `docker compose -f docker-compose.deploy.yml build`
- Network: `saleor_saleor_network` (for GraphQL access during build)
- Build stages:
  1. Installing dependencies with pnpm
  2. Generating GraphQL types from Saleor API
  3. Building Next.js production bundle
  4. Creating optimized Docker image

**Expected Build Time**: 5-10 minutes

## Deployment Plan

### Current Deployment (Old Storefront)

```
Port 80 → Nginx → Port 3000 (saleor-storefront container)
```

### New Deployment (During Testing)

```
Port 80 → Nginx → Port 3000 (old saleor-storefront)
Port 3001 → Direct access → Port 3001 (saleor-storefront-new)
```

You can test the new storefront at `http://138.68.173.139:3001`

### Final Deployment (After Testing)

**Option A: Replace Existing Container**
```bash
# Stop old storefront
docker stop saleor-storefront
docker rm saleor-storefront

# Rename new container to take over
docker stop saleor-storefront-new
docker rename saleor-storefront-new saleor-storefront

# Update to use port 3000
docker run ... -p 3000:3000 saleor-storefront
```

**Option B: Update Nginx Config**
```bash
# Keep new container on port 3001
# Update nginx to proxy to port 3001 instead of 3000
# This allows easy rollback
```

## Next Steps

### 1. Wait for Build to Complete
Monitor: `/tmp/claude/-home-cymo-projects/tasks/bc361bc.output`

### 2. Start the New Container
```bash
cd /opt/deployments/storefront/storefront
docker compose -f docker-compose.deploy.yml up -d
```

### 3. Test the New Storefront
```bash
# Check if it's running
docker ps | grep storefront-new

# Check logs
docker logs saleor-storefront-new

# Test access
curl http://localhost:3001
```

### 4. Verify Functionality
- Homepage loads (professional design, no Temu branding)
- Product pages work
- Add to cart functions
- Dark mode toggle works
- Account pages accessible
- Search works
- Mobile responsive

### 5. Update Nginx (After Testing)
```bash
# Edit nginx config to point to new storefront
docker exec -it saleor-nginx vi /etc/nginx/conf.d/default.conf

# Change upstream from port 3000 to 3001
# OR
# Stop old container and move new one to port 3000

# Reload nginx
docker exec saleor-nginx nginx -s reload
```

## Rollback Plan

If issues occur:

```bash
# Stop new storefront
docker compose -f docker-compose.deploy.yml down

# Old storefront is still running on port 3000
# Just don't update nginx, and everything stays as is
```

## What's Different in New Storefront

### Removed ❌
- Temu orange branding (#FB7701)
- Fake urgency (countdown timers, flash sales)
- Gamification (spin wheel, daily check-in, mini-games)
- Adyen payment (Stripe only now)
- 4,500 lines of unnecessary code

### Added ✅
- Professional blue theme
- Clean Header/Footer
- Modern Homepage (no fake discounts)
- Clean ProductPage (honest pricing)
- Professional AccountPage
- Dark mode throughout
- Better performance (smaller bundle)

## Server Details

**IP**: 138.68.173.139
**Location**: London (DigitalOcean)
**OS**: Ubuntu
**Docker Network**: saleor_saleor_network

**Running Containers**:
- saleor-api (Saleor backend)
- saleor-postgres (Database)
- saleor-redis (Cache)
- saleor-celery-worker (Task queue)
- saleor-celery-beat (Scheduled tasks)
- saleor-nginx (Reverse proxy on port 80/443)
- saleor-dashboard (Admin panel)
- saleor-storefront (OLD - will be replaced)
- saleor-storefront-new (NEW - building...)

## Files on Server

**Location**: `/opt/deployments/storefront/storefront`

**Key Files**:
- `docker-compose.deploy.yml` - Deployment configuration
- `.env.local` - Environment variables
- `Dockerfile` - Multi-stage build configuration
- All source code from `feature/simplify-storefront` branch

## Monitoring

**Build Progress**:
```bash
ssh root@138.68.173.139 "tail -f /tmp/build.log"
```

**Container Status**:
```bash
ssh root@138.68.173.139 "docker ps"
```

**Nginx Logs**:
```bash
ssh root@138.68.173.139 "docker logs saleor-nginx"
```

**New Storefront Logs** (after deployment):
```bash
ssh root@138.68.173.139 "docker logs saleor-storefront-new"
```

## Support

If build fails, check:
- Saleor API is accessible: `docker exec saleor-api env`
- Network connectivity: `docker network inspect saleor_saleor_network`
- Build logs: `/tmp/build.log` on server

---

**Status**: Waiting for Docker build to complete (~5-10 minutes)
**Next**: Deploy and test on port 3001
**Final**: Update nginx to point to new storefront
