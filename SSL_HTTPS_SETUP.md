# SSL/HTTPS Configuration Guide

This guide explains the complete SSL/HTTPS setup for your Saleor e-commerce platform.

## Overview

Your Saleor platform is configured with:
- **Nginx** as a reverse proxy with SSL/TLS termination
- **Let's Encrypt** for free SSL certificates via Certbot
- **Automatic certificate renewal** using Docker container
- **Modern security headers** and HTTPS enforcement
- **HSTS (HTTP Strict Transport Security)** for enhanced security

## Architecture

```
Internet (HTTPS) → Nginx (Port 443) → Storefront/API Services
Internet (HTTP)  → Nginx (Port 80)  → Redirect to HTTPS
```

## SSL/HTTPS Features

### 1. Nginx SSL Configuration

Location: [nginx/conf.d/default.conf](nginx/conf.d/default.conf)

**Enabled Features:**
- ✅ TLS 1.2 and TLS 1.3 only (no legacy protocols)
- ✅ Strong cipher suites (ECDHE, AES-GCM, ChaCha20-Poly1305)
- ✅ OCSP Stapling for faster certificate validation
- ✅ Diffie-Hellman parameters for perfect forward secrecy
- ✅ HTTP/2 support for improved performance
- ✅ Session caching and ticket disabling
- ✅ Automatic HTTP to HTTPS redirect

**Security Headers:**
- `Strict-Transport-Security`: Forces HTTPS for 1 year (with preload)
- `X-Frame-Options`: Prevents clickjacking attacks
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-XSS-Protection`: Enables XSS filter
- `Referrer-Policy`: Controls referrer information
- `Permissions-Policy`: Restricts browser features

### 2. Let's Encrypt Integration

**Certificate Provider:** Let's Encrypt (free, automated, trusted)
**Renewal:** Automatic every 12 hours via certbot container
**Validation Method:** HTTP-01 challenge via `.well-known/acme-challenge/`

### 3. Application Security Settings

**Django/Saleor Backend:**
Environment variables in [.env.production.example](.env.production.example):
```env
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
```

**Next.js Storefront:**
Security headers configured in [storefront/next.config.js](storefront/next.config.js) for production.

## Setup Instructions

### Prerequisites

1. **Domain name** pointing to your server's IP address
2. **DNS configured** with A records for:
   - `your-domain.com` → Your Server IP
   - `www.your-domain.com` → Your Server IP
3. **Server accessible** on ports 80 and 443
4. **Docker and Docker Compose** installed

### Method 1: Quick Setup (Recommended)

Use the deployment helper script with SSL option:

```bash
./deploy-to-droplet.sh
# Choose option 4: Setup SSL certificates
# Enter your domain and email when prompted
```

### Method 2: Manual Setup

#### Step 1: Configure Environment

1. Copy and edit the production environment file:
```bash
cp .env.production.example .env.production
nano .env.production
```

2. Set these required values:
```env
DOMAIN_NAME=your-domain.com
DEFAULT_FROM_EMAIL=admin@your-domain.com
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
NEXT_PUBLIC_SALEOR_API_URL=https://your-domain.com/graphql/
NEXT_PUBLIC_STOREFRONT_URL=https://your-domain.com
```

#### Step 2: Run SSL Setup Script

```bash
chmod +x setup-ssl.sh
./setup-ssl.sh
```

This script will:
1. Generate Diffie-Hellman parameters (takes 2-3 minutes)
2. Create temporary self-signed certificates
3. Start Nginx with self-signed certs
4. Obtain Let's Encrypt certificates
5. Replace self-signed certs with Let's Encrypt certs
6. Reload Nginx with production certificates

#### Step 3: Verify SSL Installation

1. Check certificate status:
```bash
docker-compose -f docker-compose.production.yml exec nginx \
  openssl s_client -connect localhost:443 -servername your-domain.com
```

2. Test SSL configuration:
```bash
curl -I https://your-domain.com
```

3. Verify HTTPS redirect:
```bash
curl -I http://your-domain.com
# Should return: HTTP/1.1 301 Moved Permanently
# Location: https://your-domain.com/
```

## Certificate Management

### Automatic Renewal

The certbot container automatically checks for certificate renewal twice daily:

```yaml
# In docker-compose.production.yml
certbot:
  image: certbot/certbot
  entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

Certificates are renewed automatically when they have 30 days or less remaining.

### Manual Renewal

To manually renew certificates:

```bash
docker-compose -f docker-compose.production.yml run --rm certbot renew
docker-compose -f docker-compose.production.yml exec nginx nginx -s reload
```

### Check Certificate Expiration

```bash
docker-compose -f docker-compose.production.yml run --rm certbot certificates
```

### Revoke Certificate

If you need to revoke a certificate:

```bash
docker-compose -f docker-compose.production.yml run --rm certbot revoke \
  --cert-path /etc/letsencrypt/live/your-domain.com/cert.pem
```

## Testing SSL Configuration

### 1. SSL Labs Test

Test your SSL configuration security:
```
https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
```

**Expected Grade:** A or A+

### 2. Security Headers Test

Test security headers:
```
https://securityheaders.com/?q=your-domain.com
```

### 3. HSTS Preload

Check HSTS preload eligibility:
```
https://hstspreload.org/?domain=your-domain.com
```

### 4. Local Tests

Test from command line:

```bash
# Test TLS version support
openssl s_client -connect your-domain.com:443 -tls1_2
openssl s_client -connect your-domain.com:443 -tls1_3

# Test OCSP stapling
openssl s_client -connect your-domain.com:443 -status

# View certificate details
openssl s_client -connect your-domain.com:443 -servername your-domain.com 2>/dev/null | \
  openssl x509 -noout -dates -subject -issuer
```

## Troubleshooting

### Certificate Acquisition Fails

**Problem:** Let's Encrypt validation fails

**Solutions:**
1. Verify DNS is pointing to your server:
   ```bash
   dig your-domain.com
   nslookup your-domain.com
   ```

2. Ensure ports 80 and 443 are open:
   ```bash
   sudo ufw status
   # Should show: 80/tcp ALLOW, 443/tcp ALLOW
   ```

3. Check nginx is serving the challenge directory:
   ```bash
   curl http://your-domain.com/.well-known/acme-challenge/test
   ```

4. Check certbot logs:
   ```bash
   docker-compose -f docker-compose.production.yml logs certbot
   ```

### Mixed Content Warnings

**Problem:** Browser shows "mixed content" warnings

**Solutions:**
1. Ensure all resources use HTTPS:
   - Update `NEXT_PUBLIC_SALEOR_API_URL` to use `https://`
   - Check image URLs in database
   - Verify CDN/S3 URLs use HTTPS

2. Check nginx configuration:
   ```bash
   docker-compose -f docker-compose.production.yml exec nginx nginx -t
   ```

### Certificate Not Trusted

**Problem:** Browser shows "Certificate not trusted"

**Solutions:**
1. Verify you're using Let's Encrypt production certificates (not staging)
2. Ensure certificate chain is complete:
   ```bash
   docker-compose -f docker-compose.production.yml exec nginx \
     cat /etc/nginx/ssl/fullchain.pem | grep -c "BEGIN CERTIFICATE"
   # Should return: 2 or more
   ```

### SSL Connection Errors

**Problem:** `ERR_SSL_PROTOCOL_ERROR` or similar

**Solutions:**
1. Verify nginx is listening on port 443:
   ```bash
   docker-compose -f docker-compose.production.yml exec nginx netstat -tlnp | grep 443
   ```

2. Check nginx error logs:
   ```bash
   docker-compose -f docker-compose.production.yml logs nginx | grep error
   ```

3. Restart nginx:
   ```bash
   docker-compose -f docker-compose.production.yml restart nginx
   ```

## Security Best Practices

### 1. Keep Certificates Updated
- Automatic renewal is enabled, but monitor logs
- Set up alerts for expiration (30 days before)

### 2. Monitor SSL/TLS Configuration
- Regularly test with SSL Labs
- Stay updated on security advisories
- Update cipher suites as needed

### 3. Use Strong Ciphers Only
- Disable TLS 1.0 and 1.1 (already done)
- Prefer ECDHE for perfect forward secrecy
- Use AEAD ciphers (GCM, ChaCha20-Poly1305)

### 4. Enable HSTS Preload
After verifying HTTPS works correctly for 30+ days:

1. Submit to HSTS preload list: https://hstspreload.org/
2. Your domain will be hardcoded in browsers
3. **Warning:** This is difficult to undo

### 5. Regular Security Audits
```bash
# Check for security vulnerabilities
docker-compose -f docker-compose.production.yml exec nginx nginx -V

# Verify TLS configuration
nmap --script ssl-enum-ciphers -p 443 your-domain.com

# Check certificate transparency logs
https://crt.sh/?q=your-domain.com
```

## File Structure

```
├── nginx/
│   ├── nginx.conf                 # Main nginx configuration
│   ├── conf.d/
│   │   └── default.conf          # SSL/HTTPS virtual host config
│   └── ssl/                       # SSL certificates directory
│       ├── fullchain.pem         # Certificate + intermediate CA
│       ├── privkey.pem           # Private key
│       └── dhparam.pem           # Diffie-Hellman parameters
├── docker-compose.production.yml # Production Docker setup
├── .env.production               # Production environment variables
├── setup-ssl.sh                  # SSL setup automation script
└── deploy-to-droplet.sh          # Deployment helper with SSL option
```

## Advanced Configuration

### Custom SSL Certificate

If you have a custom SSL certificate (not Let's Encrypt):

1. Place your certificate files:
   ```bash
   cp your-cert.pem nginx/ssl/fullchain.pem
   cp your-key.pem nginx/ssl/privkey.pem
   ```

2. Ensure proper permissions:
   ```bash
   chmod 644 nginx/ssl/fullchain.pem
   chmod 600 nginx/ssl/privkey.pem
   ```

3. Restart nginx:
   ```bash
   docker-compose -f docker-compose.production.yml restart nginx
   ```

### Enable OCSP Must-Staple

For enhanced security, add to nginx config:

```nginx
ssl_stapling on;
ssl_stapling_verify on;
add_header Expect-CT "enforce, max-age=86400" always;
```

### Certificate Pinning (Advanced)

For mobile apps, implement certificate pinning:

```nginx
# Generate pin
openssl x509 -in nginx/ssl/fullchain.pem -pubkey -noout | \
  openssl pkey -pubin -outform der | \
  openssl dgst -sha256 -binary | base64
```

## Resources

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [SSL Labs Best Practices](https://github.com/ssllabs/research/wiki/SSL-and-TLS-Deployment-Best-Practices)
- [OWASP Transport Layer Protection](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html)

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review nginx and certbot logs
3. Test DNS and firewall configuration
4. Verify environment variables are set correctly

For Let's Encrypt rate limits and troubleshooting:
- [Rate Limits](https://letsencrypt.org/docs/rate-limits/)
- [Community Forum](https://community.letsencrypt.org/)
