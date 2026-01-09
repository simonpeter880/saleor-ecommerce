# SSH Key Setup Guide for DigitalOcean

## Your SSH Key Has Been Created!

Your SSH key pair has been generated and stored in `~/.ssh/`:
- **Private key**: `~/.ssh/id_ed25519` (Keep this SECRET!)
- **Public key**: `~/.ssh/id_ed25519.pub` (This is what you share)

## Your Public SSH Key

Copy this entire key to add to DigitalOcean:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICW9BS01QjuUdh/QlSH2+RuQHi6Qls/sH5QFZHLwZ2sr cymo@digitalocean-saleor
```

## Step-by-Step: Add SSH Key to DigitalOcean

### Method 1: Add to DigitalOcean Account (Recommended)

This allows you to use the key for all your droplets.

1. **Log in to DigitalOcean**
   - Go to https://cloud.digitalocean.com/

2. **Navigate to SSH Keys**
   - Click **Settings** (gear icon) in the left sidebar
   - Click **Security** tab
   - Scroll to **SSH Keys** section
   - Click **Add SSH Key** button

3. **Add Your Key**
   - Paste your public key (the entire line above)
   - Give it a name: "Saleor Deployment Key" or "My Local Machine"
   - Click **Add SSH Key**

4. **Verify**
   - You should see your key listed with a fingerprint
   - Fingerprint: `SHA256:3i7GQgS+eFaOxmX8Ni2BZOk9S79yHFXmzkr+nKMfCUU`

### Method 2: Add When Creating a Droplet

If you're creating a new droplet:

1. **Create Droplet**
   - Click **Create** → **Droplets**

2. **In Authentication Section**
   - Select **SSH Keys**
   - Click **New SSH Key**
   - Paste your public key
   - Give it a name
   - Click **Add SSH Key**

3. **Complete Droplet Creation**
   - Make sure your new key is checked/selected
   - Continue with droplet creation

## Testing Your SSH Connection

### After Creating Your Droplet

Once you have a droplet with your SSH key:

```bash
# Test connection (replace YOUR_DROPLET_IP with actual IP)
ssh root@YOUR_DROPLET_IP

# If this is your first time connecting, you'll see:
# "The authenticity of host 'YOUR_DROPLET_IP' can't be established."
# Type 'yes' to continue
```

### If Connection Works

You should connect immediately without being asked for a password!

```bash
# You'll see something like:
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-58-generic x86_64)
root@droplet-name:~#
```

## Quick Reference Commands

### Display Your Public Key

```bash
cat ~/.ssh/id_ed25519.pub
```

### Copy Public Key to Clipboard (Linux)

```bash
# If you have xclip installed
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard

# Or xsel
cat ~/.ssh/id_ed25519.pub | xsel --clipboard
```

### Check SSH Key Fingerprint

```bash
ssh-keygen -lf ~/.ssh/id_ed25519.pub
```

Should show: `256 SHA256:3i7GQgS+eFaOxmX8Ni2BZOk9S79yHFXmzkr+nKMfCUU cymo@digitalocean-saleor (ED25519)`

## SSH Configuration (Optional but Recommended)

Create an SSH config file for easier connections:

```bash
# Create/edit SSH config
nano ~/.ssh/config
```

Add this configuration:

```
# DigitalOcean Saleor Production Server
Host saleor-prod
    HostName YOUR_DROPLET_IP
    User root
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
    ServerAliveCountMax 3

# After initial setup, use deploy user
Host saleor-deploy
    HostName YOUR_DROPLET_IP
    User deploy
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

Then connect easily:

```bash
# Instead of: ssh root@YOUR_DROPLET_IP
ssh saleor-prod

# After setup script creates deploy user:
ssh saleor-deploy
```

## Security Best Practices

### 1. Protect Your Private Key

```bash
# Ensure correct permissions (already set)
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 700 ~/.ssh
```

### 2. Never Share Your Private Key

- **NEVER** copy `id_ed25519` (private key) anywhere
- **ONLY** share `id_ed25519.pub` (public key)
- Private key = your password, keep it secret!

### 3. Backup Your Private Key

```bash
# Backup to a secure location (USB drive, password manager, etc.)
cp ~/.ssh/id_ed25519 /path/to/secure/backup/location/

# Encrypt the backup
gpg -c ~/.ssh/id_ed25519
```

### 4. After Initial Droplet Setup

Once your droplet is configured, disable password authentication:

```bash
# On your droplet, edit SSH config
sudo nano /etc/ssh/sshd_config

# Change these settings:
PasswordAuthentication no
PermitRootLogin prohibit-password

# Restart SSH service
sudo systemctl restart sshd
```

## Troubleshooting

### "Permission denied (publickey)"

1. **Check key is being used:**
   ```bash
   ssh -v root@YOUR_DROPLET_IP
   ```
   Look for "Offering public key" in the output

2. **Verify key is added to DigitalOcean:**
   - Check DigitalOcean dashboard → Settings → Security → SSH Keys

3. **Check local permissions:**
   ```bash
   ls -la ~/.ssh/
   # id_ed25519 should be -rw------- (600)
   # id_ed25519.pub should be -rw-r--r-- (644)
   ```

4. **Specify key explicitly:**
   ```bash
   ssh -i ~/.ssh/id_ed25519 root@YOUR_DROPLET_IP
   ```

### "Connection refused"

1. Check firewall allows SSH:
   ```bash
   sudo ufw status
   # Should show: 22/tcp ALLOW
   ```

2. Verify droplet is running in DigitalOcean dashboard

### "Host key verification failed"

This happens if you rebuilt the droplet with the same IP:

```bash
# Remove old host key
ssh-keygen -R YOUR_DROPLET_IP

# Try connecting again
ssh root@YOUR_DROPLET_IP
```

## Multiple Machines

If you want to access your droplet from multiple computers:

### Option 1: Generate Separate Keys (Recommended)

On each computer:
1. Generate a new key with a different comment:
   ```bash
   ssh-keygen -t ed25519 -C "cymo@laptop"
   ```
2. Add each key to DigitalOcean separately
3. Can revoke individual keys if a device is compromised

### Option 2: Copy Same Key (Less Secure)

Copy your private key to other machines:
```bash
# From current machine to another
scp ~/.ssh/id_ed25519* user@other-machine:~/.ssh/
```

**Note**: This is less secure because compromising one machine compromises all.

## SSH Agent (Optional)

Use SSH agent to avoid typing passphrase repeatedly:

```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add your key
ssh-add ~/.ssh/id_ed25519

# Verify key is loaded
ssh-add -l
```

Add to `~/.bashrc` or `~/.zshrc` to start automatically:

```bash
# Auto-start SSH agent
if [ -z "$SSH_AUTH_SOCK" ]; then
    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/id_ed25519 2>/dev/null
fi
```

## Next Steps

1. ✅ SSH key created
2. ➡️ Add public key to DigitalOcean (follow steps above)
3. ➡️ Create a droplet with your SSH key selected
4. ➡️ Test SSH connection: `ssh root@YOUR_DROPLET_IP`
5. ➡️ Run the droplet setup script: `./setup-digitalocean-droplet.sh`
6. ➡️ Deploy your application: `./deploy.sh`

## Additional Resources

- [DigitalOcean SSH Keys Documentation](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/)
- [SSH Key Best Practices](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/to-account/)
- [Troubleshooting SSH](https://docs.digitalocean.com/support/how-to-troubleshoot-ssh-connectivity-issues/)

---

**Your Public Key (for easy copy-paste):**

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICW9BS01QjuUdh/QlSH2+RuQHi6Qls/sH5QFZHLwZ2sr cymo@digitalocean-saleor
```
