#!/bin/bash

# SSL Certificate Setup Script
# This script obtains SSL certificates from Let's Encrypt for your domain

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

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
    exit 1
fi

# Load environment variables
source .env.production

if [ -z "$DOMAIN_NAME" ]; then
    log_error "DOMAIN_NAME is not set in .env.production"
    exit 1
fi

if [ -z "$DEFAULT_FROM_EMAIL" ]; then
    log_error "DEFAULT_FROM_EMAIL is not set in .env.production"
    exit 1
fi

log_info "Setting up SSL certificates for: $DOMAIN_NAME"

# Create SSL directory
mkdir -p nginx/ssl

# Generate Diffie-Hellman parameters for enhanced security
log_info "Generating Diffie-Hellman parameters (this may take a few minutes)..."
if [ ! -f nginx/ssl/dhparam.pem ]; then
    openssl dhparam -out nginx/ssl/dhparam.pem 2048
    log_info "Diffie-Hellman parameters generated"
else
    log_info "Diffie-Hellman parameters already exist, skipping..."
fi

# First, create self-signed certificates for initial setup
log_info "Creating temporary self-signed certificates..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/privkey.pem \
    -out nginx/ssl/fullchain.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=${DOMAIN_NAME}"

log_info "Self-signed certificates created"

# Update nginx configuration with domain name
log_info "Updating nginx configuration..."
sed -i "s/\${DOMAIN_NAME}/${DOMAIN_NAME}/g" nginx/conf.d/default.conf

log_info "Starting nginx with self-signed certificates..."
docker-compose -f docker-compose.production.yml up -d nginx

# Wait for nginx to start
sleep 5

# Obtain Let's Encrypt certificate
log_info "Obtaining Let's Encrypt certificate..."
log_warn "Make sure your domain DNS is pointing to this server!"

docker-compose -f docker-compose.production.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email ${DEFAULT_FROM_EMAIL} \
    --agree-tos \
    --no-eff-email \
    -d ${DOMAIN_NAME} \
    -d www.${DOMAIN_NAME}

# Copy Let's Encrypt certificates to nginx ssl directory
log_info "Copying Let's Encrypt certificates..."
docker-compose -f docker-compose.production.yml exec -T nginx \
    cp /etc/letsencrypt/live/${DOMAIN_NAME}/fullchain.pem /etc/nginx/ssl/
docker-compose -f docker-compose.production.yml exec -T nginx \
    cp /etc/letsencrypt/live/${DOMAIN_NAME}/privkey.pem /etc/nginx/ssl/

# Reload nginx
log_info "Reloading nginx with new certificates..."
docker-compose -f docker-compose.production.yml exec nginx nginx -s reload

log_info "SSL certificates installed successfully!"
log_info "Your site should now be accessible via HTTPS: https://${DOMAIN_NAME}"
log_info ""
log_info "Certificates will auto-renew via certbot container"
