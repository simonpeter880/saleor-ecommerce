#!/bin/bash

# DigitalOcean Droplet Setup Script
# This script prepares a fresh Ubuntu droplet for running Saleor e-commerce platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root (use sudo)"
    exit 1
fi

log_info "Starting DigitalOcean Droplet setup..."

# Update system
log_info "Updating system packages..."
apt-get update -y
apt-get upgrade -y

# Install required packages
log_info "Installing required packages..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    git \
    ufw \
    fail2ban

# Install Docker
log_info "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io
    systemctl start docker
    systemctl enable docker
    log_info "Docker installed successfully"
else
    log_info "Docker is already installed"
fi

# Install Docker Compose
log_info "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_VERSION="2.24.5"
    curl -L "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log_info "Docker Compose installed successfully"
else
    log_info "Docker Compose is already installed"
fi

# Configure firewall
log_info "Configuring firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
log_info "Firewall configured"

# Configure fail2ban
log_info "Configuring fail2ban..."
systemctl start fail2ban
systemctl enable fail2ban
cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
EOF
systemctl restart fail2ban
log_info "fail2ban configured"

# Create deployment user
log_info "Creating deployment user..."
if ! id -u deploy &>/dev/null; then
    useradd -m -s /bin/bash deploy
    usermod -aG docker deploy
    log_info "User 'deploy' created and added to docker group"
else
    log_info "User 'deploy' already exists"
fi

# Create deployment directory
log_info "Creating deployment directory..."
mkdir -p /opt/saleor
chown -R deploy:deploy /opt/saleor

# Setup swap (recommended for Droplets with less than 2GB RAM)
log_info "Setting up swap space..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
    log_info "Swap space created (2GB)"
else
    log_info "Swap file already exists"
fi

# Configure Docker daemon for production
log_info "Configuring Docker for production..."
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF
systemctl restart docker

# Install certbot for SSL certificates
log_info "Installing certbot..."
apt-get install -y certbot
log_info "Certbot installed"

# System tuning for production
log_info "Applying system tuning..."
cat >> /etc/sysctl.conf <<EOF

# Saleor production tuning
net.core.somaxconn = 1024
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.ip_local_port_range = 10000 65000
vm.swappiness = 10
EOF
sysctl -p

# Setup automatic security updates
log_info "Configuring automatic security updates..."
apt-get install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

log_info "Droplet setup completed successfully!"
log_info ""
log_info "Next steps:"
log_info "1. Switch to deploy user: sudo su - deploy"
log_info "2. Clone your repository to /opt/saleor"
log_info "3. Create .env.production file with your configuration"
log_info "4. Run the deployment script: ./deploy.sh"
log_info ""
log_info "Security recommendations:"
log_info "- Change SSH port from default 22"
log_info "- Disable password authentication and use SSH keys only"
log_info "- Setup monitoring and alerts"
log_info "- Regular backups of database and media files"
