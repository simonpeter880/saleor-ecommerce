# DigitalOcean Deployment Guide for Saleor E-commerce Platform

This guide will walk you through deploying your Saleor backend and Next.js storefront to DigitalOcean using Docker.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [DigitalOcean Account Setup](#digitalocean-account-setup)
3. [Create and Configure a Droplet](#create-and-configure-a-droplet)
4. [Setup Your Droplet](#setup-your-droplet)
5. [Deploy Your Application](#deploy-your-application)
6. [Configure SSL Certificates](#configure-ssl-certificates)
7. [Post-Deployment](#post-deployment)
8. [Maintenance](#maintenance)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

- A registered domain name
- Basic knowledge of SSH and command line
- Git installed locally
- Your code repository ready for deployment

## DigitalOcean Account Setup

### 1. Create a DigitalOcean Account

1. Go to [DigitalOcean](https://www.digitalocean.com/)
2. Click "Sign Up" and create your account
3. Verify your email address
4. Add a payment method

### 2. Create an API Token

1. Log in to your DigitalOcean account
2. Click on **API** in the left sidebar (or go to https://cloud.digitalocean.com/account/api/tokens)
3. Click **Generate New Token**
4. Name your token (e.g., "Saleor Deployment")
5. Select **Read** and **Write** scopes
6. Click **Generate Token**
7. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!
8. Save it securely (you'll need it for automation, though we'll use manual deployment first)

### 3. Add SSH Key (Recommended)

1. Generate an SSH key on your local machine (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Display your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

3. In DigitalOcean dashboard:
   - Go to **Settings** → **Security** → **SSH Keys**
   - Click **Add SSH Key**
   - Paste your public key
   - Give it a name
   - Click **Add SSH Key**

## Create and Configure a Droplet

### 1. Create a Droplet

1. Click **Create** → **Droplets**
2. **Choose an image**: Ubuntu 22.04 LTS x64
3. **Choose a plan**:
   - **Minimum**: Basic plan with 2GB RAM ($12/month) - suitable for testing
   - **Recommended**: Basic plan with 4GB RAM ($24/month) - better for production
   - **Production**: 8GB RAM or more for higher traffic
4. **Choose a datacenter region**: Select closest to your target audience
5. **Authentication**: Select your SSH key (recommended) or use password
6. **Hostname**: Give it a meaningful name (e.g., `saleor-production`)
7. Click **Create Droplet**
8. Wait for the droplet to be created (takes ~1 minute)
9. **Copy the IP address** of your new droplet

### 2. Configure Domain DNS

Point your domain to your droplet's IP address:

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS settings for your domain
3. Add/Update these records:
   ```
   Type: A Record
   Host: @
   Value: YOUR_DROPLET_IP
   TTL: 3600

   Type: A Record
   Host: www
   Value: YOUR_DROPLET_IP
   TTL: 3600
   ```
4. Save changes (DNS propagation may take 1-48 hours, but usually 5-30 minutes)

### 3. Test DNS Propagation

```bash
# Check if your domain points to the correct IP
nslookup your-domain.com
dig your-domain.com
```

## Setup Your Droplet

### 1. Connect to Your Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

If using SSH keys, this should connect immediately. If using password, enter the password emailed to you.

### 2. Run Initial Setup Script

Copy the `setup-digitalocean-droplet.sh` script to your droplet and run it:

```bash
# On your local machine, copy the setup script
scp setup-digitalocean-droplet.sh root@YOUR_DROPLET_IP:/root/

# SSH into your droplet
ssh root@YOUR_DROPLET_IP

# Run the setup script
chmod +x setup-digitalocean-droplet.sh
./setup-digitalocean-droplet.sh
```

This script will:
- Update system packages
- Install Docker and Docker Compose
- Configure firewall (UFW)
- Install and configure fail2ban
- Create a deployment user
- Setup swap space
- Configure Docker for production
- Install certbot for SSL certificates
- Apply system tuning

### 3. Switch to Deploy User

```bash
sudo su - deploy
cd /opt/saleor
```

## Deploy Your Application

### 1. Clone Your Repository

```bash
cd /opt/saleor
git clone YOUR_REPOSITORY_URL .
```

Or, copy files from your local machine:

```bash
# On your local machine
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '__pycache__' \
  /home/cymo/projects/ deploy@YOUR_DROPLET_IP:/opt/saleor/
```

### 2. Configure Environment Variables

```bash
cd /opt/saleor
cp .env.production.example .env.production
nano .env.production
```

Fill in all required values:

```bash
# Domain Configuration
DOMAIN_NAME=your-domain.com

# Database Configuration
POSTGRES_PASSWORD=generate-strong-password-here

# Django Configuration
SECRET_KEY=generate-random-50-character-string-here
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# Email Configuration
DEFAULT_FROM_EMAIL=noreply@your-domain.com
EMAIL_URL=smtp://username:password@smtp.gmail.com:587/?tls=True

# Frontend URLs
NEXT_PUBLIC_SALEOR_API_URL=https://your-domain.com/graphql/
NEXT_PUBLIC_STOREFRONT_URL=https://your-domain.com

# First deployment
CREATE_SUPERUSER=true
POPULATE_DB=true  # Set to false if you don't want sample data

# Admin credentials
DJANGO_SUPERUSER_EMAIL=admin@your-domain.com
DJANGO_SUPERUSER_PASSWORD=choose-secure-password
```

**Generate SECRET_KEY**:
```bash
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

**Generate strong password**:
```bash
openssl rand -base64 32
```

### 3. Run Deployment Script

```bash
./deploy.sh
```

This will:
- Build Docker images
- Start all services (PostgreSQL, Redis, Saleor API, Celery workers, Storefront, Nginx)
- Run database migrations
- Create superuser (if configured)
- Populate database with sample data (if configured)
- Collect static files
- Check service health

## Configure SSL Certificates

### 1. Initial Setup with Self-Signed Certificates

The deployment script creates self-signed certificates initially. Your site will be accessible via HTTP but browsers will show security warnings for HTTPS.

### 2. Get Let's Encrypt SSL Certificates

**IMPORTANT**: Make sure your domain DNS is pointing to your droplet before running this!

```bash
./setup-ssl.sh
```

This script will:
- Create temporary self-signed certificates
- Update nginx configuration
- Obtain Let's Encrypt certificates for your domain
- Configure auto-renewal

### 3. Verify SSL

Visit your site: `https://your-domain.com`

The certificate should be valid and issued by Let's Encrypt.

## Post-Deployment

### 1. Access Your Application

- **Storefront**: https://your-domain.com
- **GraphQL API**: https://your-domain.com/graphql/
- **Admin Dashboard**: https://your-domain.com/dashboard/

### 2. Login to Admin Dashboard

Use the superuser credentials you configured in `.env.production`:
- Email: Your `DJANGO_SUPERUSER_EMAIL`
- Password: Your `DJANGO_SUPERUSER_PASSWORD`

### 3. Configure Saleor

1. Go to Configuration → Channels
2. Set up your sales channels
3. Configure shipping methods
4. Set up payment gateways (Stripe, Adyen, etc.)
5. Configure email templates

### 4. Test Your Storefront

Visit your storefront and test:
- Product browsing
- Search functionality
- Add to cart
- Checkout process
- User registration/login

## Maintenance

### View Logs

```bash
# All services
docker-compose -f docker-compose.production.yml logs -f

# Specific service
docker-compose -f docker-compose.production.yml logs -f saleor-api
docker-compose -f docker-compose.production.yml logs -f storefront
docker-compose -f docker-compose.production.yml logs -f nginx
```

### Restart Services

```bash
# All services
docker-compose -f docker-compose.production.yml restart

# Specific service
docker-compose -f docker-compose.production.yml restart saleor-api
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and redeploy
./deploy.sh
```

### Backup Database

```bash
# Create backup
docker-compose -f docker-compose.production.yml exec -T postgres \
  pg_dump -U saleor saleor > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
cat backup_file.sql | docker-compose -f docker-compose.production.yml exec -T postgres \
  psql -U saleor saleor
```

### Backup Media Files

```bash
# Create backup of media files
docker-compose -f docker-compose.production.yml exec saleor-api \
  tar -czf /tmp/media_backup.tar.gz /app/media

# Copy to local machine
docker cp saleor-api:/tmp/media_backup.tar.gz ./media_backup_$(date +%Y%m%d_%H%M%S).tar.gz
```

### Monitor Resources

```bash
# Container resource usage
docker stats

# Disk usage
df -h

# Check Docker disk usage
docker system df
```

### Clean Up Docker

```bash
# Remove unused containers, networks, images
docker system prune -a

# Remove unused volumes (BE CAREFUL - this includes data!)
docker volume prune
```

## Troubleshooting

### Services Not Starting

```bash
# Check container status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs

# Restart all services
docker-compose -f docker-compose.production.yml restart
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.production.yml ps postgres

# Check database logs
docker-compose -f docker-compose.production.yml logs postgres

# Connect to database manually
docker-compose -f docker-compose.production.yml exec postgres psql -U saleor
```

### SSL Certificate Issues

```bash
# Check certbot logs
docker-compose -f docker-compose.production.yml logs certbot

# Manually renew certificates
docker-compose -f docker-compose.production.yml run --rm certbot renew

# Check certificate expiration
openssl x509 -in nginx/ssl/fullchain.pem -noout -dates
```

### Frontend Not Loading

```bash
# Check storefront logs
docker-compose -f docker-compose.production.yml logs storefront

# Rebuild storefront
docker-compose -f docker-compose.production.yml build storefront
docker-compose -f docker-compose.production.yml up -d storefront
```

### High Memory Usage

```bash
# Check memory usage
free -h

# Restart memory-intensive services
docker-compose -f docker-compose.production.yml restart celery-worker
```

### Can't Access Site

1. Check firewall rules:
   ```bash
   sudo ufw status
   ```

2. Check nginx configuration:
   ```bash
   docker-compose -f docker-compose.production.yml exec nginx nginx -t
   ```

3. Check DNS propagation:
   ```bash
   nslookup your-domain.com
   ```

## Security Best Practices

1. **Regular Updates**: Keep your system and Docker images updated
2. **Strong Passwords**: Use strong, unique passwords for all services
3. **Firewall**: Keep UFW enabled with minimal open ports
4. **SSH Security**:
   - Disable password authentication
   - Use SSH keys only
   - Change default SSH port
5. **Backups**: Regular automated backups of database and media
6. **Monitoring**: Set up monitoring and alerts (consider DigitalOcean Monitoring)
7. **HTTPS Only**: Always use HTTPS in production
8. **Environment Variables**: Never commit `.env.production` to version control

## Cost Optimization

1. **Right-size your droplet**: Start small, scale as needed
2. **Use Spaces for media**: DigitalOcean Spaces (S3-compatible) for media storage
3. **Enable caching**: Redis caching is already configured
4. **CDN**: Use DigitalOcean CDN or Cloudflare for static assets
5. **Database optimization**: Regular database maintenance and optimization

## Scaling

As your traffic grows:

1. **Vertical Scaling**: Upgrade to a larger droplet
2. **Horizontal Scaling**:
   - Separate database to a managed database
   - Use DigitalOcean Spaces for media
   - Multiple app droplets behind a load balancer
3. **Managed Services**:
   - DigitalOcean Managed PostgreSQL
   - DigitalOcean Managed Redis
   - DigitalOcean Container Registry

## Getting Help

- **DigitalOcean Docs**: https://docs.digitalocean.com/
- **Saleor Docs**: https://docs.saleor.io/
- **Community**: DigitalOcean Community Forums
- **Support**: DigitalOcean Support (if on paid plan)

## Next Steps

1. Configure payment gateways
2. Set up email service (SendGrid, Mailgun, etc.)
3. Configure analytics (Google Analytics, Sentry)
4. Set up automated backups
5. Configure monitoring and alerts
6. Performance optimization
7. SEO optimization
