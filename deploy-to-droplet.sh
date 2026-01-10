#!/bin/bash

# Quick Deployment Script for DigitalOcean Droplet
# This script helps you deploy your Saleor platform to DigitalOcean

set -e

echo "========================================"
echo "Saleor DigitalOcean Deployment Helper"
echo "========================================"
echo ""

# Check if .env.production exists locally
if [ ! -f .env.production ]; then
    echo "ERROR: .env.production file not found!"
    echo "Please create it from .env.production.example first:"
    echo "  cp .env.production.example .env.production"
    echo "  nano .env.production  # Edit with your values"
    exit 1
fi

# Get droplet IP
read -p "Enter your DigitalOcean droplet IP address: " DROPLET_IP

if [ -z "$DROPLET_IP" ]; then
    echo "ERROR: Droplet IP is required"
    exit 1
fi

# Get SSH user (default: root)
read -p "SSH user [root]: " SSH_USER
SSH_USER=${SSH_USER:-root}

echo ""
echo "Testing SSH connection to $SSH_USER@$DROPLET_IP..."
if ssh -o ConnectTimeout=5 -o BatchMode=yes $SSH_USER@$DROPLET_IP exit 2>/dev/null; then
    echo "✓ SSH connection successful!"
else
    echo "✗ Cannot connect via SSH. Please check:"
    echo "  1. Droplet IP is correct"
    echo "  2. SSH key is configured"
    echo "  3. Firewall allows SSH (port 22)"
    exit 1
fi

echo ""
echo "What would you like to do?"
echo "1) Initial server setup (install Docker, etc.)"
echo "2) Deploy application (first time)"
echo "3) Update existing deployment"
echo "4) Setup SSL certificates"
echo "5) Create database backup"
echo "6) View logs"
read -p "Enter choice [1-6]: " CHOICE

case $CHOICE in
    1)
        echo ""
        echo "Running initial server setup..."
        echo "This will install Docker, configure firewall, and prepare the server."
        read -p "Continue? (y/n): " CONFIRM
        if [ "$CONFIRM" != "y" ]; then
            echo "Aborted."
            exit 0
        fi

        # Copy setup script if it exists
        if [ -f setup-digitalocean-droplet.sh ]; then
            echo "Copying setup script to droplet..."
            scp setup-digitalocean-droplet.sh $SSH_USER@$DROPLET_IP:/tmp/

            echo "Running setup script..."
            ssh $SSH_USER@$DROPLET_IP "chmod +x /tmp/setup-digitalocean-droplet.sh && /tmp/setup-digitalocean-droplet.sh"
        else
            echo "Running basic setup commands..."
            ssh $SSH_USER@$DROPLET_IP << 'EOF'
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
apt install -y docker-compose-plugin

# Install Git
apt install -y git

# Configure firewall
apt install -y ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable

# Create deployment directory
mkdir -p /opt/saleor
chmod 755 /opt/saleor

echo "✓ Server setup complete!"
EOF
        fi

        echo ""
        echo "✓ Server setup complete!"
        echo "Next step: Run option 2 to deploy your application"
        ;;

    2)
        echo ""
        echo "Deploying application for the first time..."
        echo "This will:"
        echo "  - Copy all files to the droplet"
        echo "  - Build Docker images"
        echo "  - Start all services"
        echo "  - Initialize database"
        read -p "Continue? (y/n): " CONFIRM
        if [ "$CONFIRM" != "y" ]; then
            echo "Aborted."
            exit 0
        fi

        echo ""
        echo "Creating deployment directory on droplet..."
        ssh $SSH_USER@$DROPLET_IP "mkdir -p /opt/saleor"

        echo "Copying files to droplet..."
        rsync -avz --exclude 'node_modules' \
                   --exclude '.venv' \
                   --exclude '*.pyc' \
                   --exclude '__pycache__' \
                   --exclude '.git' \
                   --exclude '*.log' \
                   --exclude 'media/*' \
                   --progress \
                   ./ $SSH_USER@$DROPLET_IP:/opt/saleor/

        echo ""
        echo "Starting deployment on droplet..."
        ssh $SSH_USER@$DROPLET_IP << 'EOF'
cd /opt/saleor

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Build and start services
echo "Building Docker images..."
docker compose -f docker-compose.production.yml build

echo "Starting services..."
docker compose -f docker-compose.production.yml up -d

echo "Waiting for services to be healthy..."
sleep 30

echo "Running database migrations..."
docker compose -f docker-compose.production.yml exec -T saleor-api python manage.py migrate

# Create superuser if configured
if [ "$CREATE_SUPERUSER" = "true" ]; then
    echo "Creating superuser..."
    docker compose -f docker-compose.production.yml exec -T saleor-api python manage.py createsuperuser --noinput || true
fi

# Populate database if configured
if [ "$POPULATE_DB" = "true" ]; then
    echo "Populating database with sample data..."
    docker compose -f docker-compose.production.yml exec -T saleor-api python manage.py populatedb --createsuperuser
fi

echo "Collecting static files..."
docker compose -f docker-compose.production.yml exec -T saleor-api python manage.py collectstatic --no-input

echo ""
echo "✓ Deployment complete!"
echo ""
echo "Service status:"
docker compose -f docker-compose.production.yml ps
EOF

        echo ""
        echo "========================================"
        echo "✓ Application deployed successfully!"
        echo "========================================"
        echo ""
        echo "Your site should now be accessible at:"
        echo "  http://$DROPLET_IP"
        echo ""
        echo "Next steps:"
        echo "  1. Configure your domain DNS to point to $DROPLET_IP"
        echo "  2. Run option 4 to setup SSL certificates"
        echo "  3. Access admin dashboard at http://$DROPLET_IP/dashboard/"
        ;;

    3)
        echo ""
        echo "Updating existing deployment..."
        read -p "Continue? (y/n): " CONFIRM
        if [ "$CONFIRM" != "y" ]; then
            echo "Aborted."
            exit 0
        fi

        echo "Copying updated files to droplet..."
        rsync -avz --exclude 'node_modules' \
                   --exclude '.venv' \
                   --exclude '*.pyc' \
                   --exclude '__pycache__' \
                   --exclude '.git' \
                   --exclude '*.log' \
                   --progress \
                   ./ $SSH_USER@$DROPLET_IP:/opt/saleor/

        echo ""
        echo "Rebuilding and restarting services..."
        ssh $SSH_USER@$DROPLET_IP << 'EOF'
cd /opt/saleor

# Rebuild and restart
docker compose -f docker-compose.production.yml up -d --build

# Run migrations
docker compose -f docker-compose.production.yml exec -T saleor-api python manage.py migrate

# Collect static files
docker compose -f docker-compose.production.yml exec -T saleor-api python manage.py collectstatic --no-input

echo ""
echo "✓ Update complete!"
echo ""
echo "Service status:"
docker compose -f docker-compose.production.yml ps
EOF

        echo ""
        echo "✓ Application updated successfully!"
        ;;

    4)
        echo ""
        read -p "Enter your domain name (e.g., example.com): " DOMAIN

        if [ -z "$DOMAIN" ]; then
            echo "ERROR: Domain name is required"
            exit 1
        fi

        read -p "Enter your email for Let's Encrypt: " EMAIL

        if [ -z "$EMAIL" ]; then
            echo "ERROR: Email is required"
            exit 1
        fi

        echo ""
        echo "Setting up SSL certificates for $DOMAIN..."
        echo "Make sure your domain DNS is pointing to $DROPLET_IP first!"
        read -p "Continue? (y/n): " CONFIRM
        if [ "$CONFIRM" != "y" ]; then
            echo "Aborted."
            exit 0
        fi

        ssh $SSH_USER@$DROPLET_IP << EOF
cd /opt/saleor

# Stop nginx temporarily
docker compose -f docker-compose.production.yml stop nginx

# Get SSL certificate
docker compose -f docker-compose.production.yml run --rm certbot certonly \
    --standalone \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email

# Update nginx config with domain
sed -i "s/your-domain.com/$DOMAIN/g" nginx/conf.d/default.conf

# Start nginx with SSL
docker compose -f docker-compose.production.yml up -d nginx

echo ""
echo "✓ SSL certificates installed!"
EOF

        echo ""
        echo "✓ SSL setup complete!"
        echo "Your site should now be accessible at https://$DOMAIN"
        ;;

    5)
        echo ""
        echo "Creating database backup..."
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"

        ssh $SSH_USER@$DROPLET_IP << EOF
cd /opt/saleor
docker compose -f docker-compose.production.yml exec -T postgres \
    pg_dump -U saleor saleor > /tmp/$BACKUP_FILE
EOF

        echo "Downloading backup to local machine..."
        scp $SSH_USER@$DROPLET_IP:/tmp/$BACKUP_FILE ./backups/

        ssh $SSH_USER@$DROPLET_IP "rm /tmp/$BACKUP_FILE"

        echo ""
        echo "✓ Backup saved to: ./backups/$BACKUP_FILE"
        ;;

    6)
        echo ""
        echo "Which service logs would you like to view?"
        echo "1) All services"
        echo "2) Saleor API"
        echo "3) Storefront"
        echo "4) Nginx"
        echo "5) PostgreSQL"
        echo "6) Redis"
        read -p "Enter choice [1-6]: " LOG_CHOICE

        case $LOG_CHOICE in
            1) SERVICE="" ;;
            2) SERVICE="saleor-api" ;;
            3) SERVICE="storefront" ;;
            4) SERVICE="nginx" ;;
            5) SERVICE="postgres" ;;
            6) SERVICE="redis" ;;
            *) echo "Invalid choice"; exit 1 ;;
        esac

        echo ""
        echo "Press Ctrl+C to exit logs"
        sleep 2

        ssh $SSH_USER@$DROPLET_IP "cd /opt/saleor && docker compose -f docker-compose.production.yml logs -f $SERVICE"
        ;;

    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "Done!"
