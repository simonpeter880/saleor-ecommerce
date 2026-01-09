#!/bin/bash

# Saleor E-commerce Deployment Script for DigitalOcean
# This script automates the deployment of Saleor backend and storefront to a DigitalOcean Droplet

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env.production" ]; then
    log_error ".env.production file not found!"
    log_info "Please create .env.production file with required environment variables"
    log_info "You can use .env.production.example as a template"
    exit 1
fi

# Load environment variables
source .env.production

# Check required variables
REQUIRED_VARS=(
    "DOMAIN_NAME"
    "POSTGRES_PASSWORD"
    "SECRET_KEY"
    "NEXT_PUBLIC_SALEOR_API_URL"
    "NEXT_PUBLIC_STOREFRONT_URL"
    "DEFAULT_FROM_EMAIL"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        log_error "Required environment variable $var is not set in .env.production"
        exit 1
    fi
done

log_info "Starting deployment process..."

# Build and start services
log_info "Building Docker images..."
docker-compose -f docker-compose.production.yml build --no-cache

log_info "Stopping existing containers..."
docker-compose -f docker-compose.production.yml down

log_info "Starting services..."
docker-compose -f docker-compose.production.yml up -d

# Wait for database to be ready
log_info "Waiting for database to be ready..."
sleep 10

# Run database migrations
log_info "Running database migrations..."
docker-compose -f docker-compose.production.yml exec -T saleor-api python manage.py migrate

# Create superuser if needed (only on first deployment)
if [ "$CREATE_SUPERUSER" = "true" ]; then
    log_info "Creating superuser..."
    docker-compose -f docker-compose.production.yml exec -T saleor-api python manage.py createsuperuser --noinput || log_warn "Superuser already exists or creation failed"
fi

# Populate database with sample data (optional)
if [ "$POPULATE_DB" = "true" ]; then
    log_info "Populating database with sample data..."
    docker-compose -f docker-compose.production.yml exec -T saleor-api python manage.py populatedb || log_warn "Database population failed or already populated"
fi

# Collect static files
log_info "Collecting static files..."
docker-compose -f docker-compose.production.yml exec -T saleor-api python manage.py collectstatic --noinput

# Check service health
log_info "Checking service health..."
sleep 5

# Check if containers are running
CONTAINERS=("saleor-postgres" "saleor-redis" "saleor-api" "saleor-storefront" "saleor-nginx")
for container in "${CONTAINERS[@]}"; do
    if docker ps | grep -q "$container"; then
        log_info "✓ $container is running"
    else
        log_error "✗ $container is not running"
        docker-compose -f docker-compose.production.yml logs "$container"
    fi
done

log_info "Deployment completed successfully!"
log_info "Your application should be accessible at: https://${DOMAIN_NAME}"
log_info ""
log_info "Useful commands:"
log_info "  View logs: docker-compose -f docker-compose.production.yml logs -f"
log_info "  Stop services: docker-compose -f docker-compose.production.yml down"
log_info "  Restart services: docker-compose -f docker-compose.production.yml restart"
log_info "  Shell access: docker-compose -f docker-compose.production.yml exec saleor-api bash"
