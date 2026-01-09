# Google OAuth Setup Guide for Saleor

This guide will help you configure Google Sign-In for your Saleor storefront.

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**

### 1.2 Create OAuth 2.0 Client ID
1. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
2. If prompted, configure the OAuth consent screen first:
   - Choose **External** user type
   - Fill in:
     - App name: `TechHub Electronics`
     - User support email: Your email
     - Developer contact email: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Save and continue

3. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `TechHub Storefront`
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     http://localhost:8000
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3000/channel-pln/auth/callback
     ```
   - Click **CREATE**

4. **Save the credentials:**
   - Copy your **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
   - Copy your **Client Secret**

## Step 2: Configure Saleor OpenID Connect Plugin

### 2.1 Access Saleor Dashboard
1. Navigate to: http://localhost:8000/dashboard/
2. Login with your admin credentials
3. Go to **Configuration** → **Plugins**
4. Find **OpenID Connect** and click **Configure**

### 2.2 Configure the Plugin

Enable the plugin and fill in these values:

**Client ID:**
```
YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

**Client Secret:**
```
YOUR_GOOGLE_CLIENT_SECRET
```

**Enable refreshing token:**
```
✓ Checked (Yes)
```

**OAuth Authorization URL:**
```
https://accounts.google.com/o/oauth2/v2/auth
```

**OAuth Token URL:**
```
https://oauth2.googleapis.com/token
```

**JSON Web Key Set URL:**
```
https://www.googleapis.com/oauth2/v3/certs
```

**User info URL:**
```
https://www.googleapis.com/oauth2/v3/userinfo
```

**OAuth logout URL:** (optional)
```
https://accounts.google.com/logout
```

**Audience:** (leave empty for Google)
```
(empty)
```

**Use OAuth scope permissions:**
```
☐ Unchecked (No) - unless you have custom scope mappings
```

**Staff user domains:** (optional - for restricting staff access)
```
(empty) - or your company domain like: yourdomain.com
```

**Default group name for new staff users:** (optional)
```
(empty)
```

### 2.3 Save Configuration
Click **Save** at the bottom of the page.

## Step 3: Test the Integration

### 3.1 Test Login Flow
1. Go to http://localhost:3000/channel-pln/login
2. Click **Continue with Google**
3. You should be redirected to Google's login page
4. After successful login, you'll be redirected back to your storefront

### 3.2 Test Registration Flow
1. Go to http://localhost:3000/channel-pln/register
2. Click **Sign up with Google**
3. Complete the Google authentication
4. Your account will be created automatically

## Step 4: Production Setup (When Ready)

When deploying to production, update:

### 4.1 Google Cloud Console
1. Add your production URLs to:
   - **Authorized JavaScript origins:**
     ```
     https://yourdomain.com
     https://api.yourdomain.com
     ```
   - **Authorized redirect URIs:**
     ```
     https://yourdomain.com/channel-pln/auth/callback
     ```

### 4.2 Saleor Environment Variables (Optional)
You can also configure the plugin via environment variables instead of the dashboard:

Create a `.env` file in `/home/cymo/projects/saleor/` with:

```bash
# OpenID Connect Plugin Configuration
OPENID_CONNECT_ENABLED=true
OPENID_CONNECT_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
OPENID_CONNECT_CLIENT_SECRET=your_google_client_secret
OPENID_CONNECT_OAUTH_AUTHORIZATION_URL=https://accounts.google.com/o/oauth2/v2/auth
OPENID_CONNECT_OAUTH_TOKEN_URL=https://oauth2.googleapis.com/token
OPENID_CONNECT_JSON_WEB_KEY_SET_URL=https://www.googleapis.com/oauth2/v3/certs
OPENID_CONNECT_USER_INFO_URL=https://www.googleapis.com/oauth2/v3/userinfo
OPENID_CONNECT_ENABLE_REFRESH_TOKEN=true
```

## Troubleshooting

### Issue: "redirect_uri_mismatch" error
**Solution:** Make sure the redirect URI in Google Cloud Console matches exactly:
```
http://localhost:3000/channel-pln/auth/callback
```

### Issue: "Failed to initialize Google Sign-In"
**Solution:**
1. Check that the OpenID Connect plugin is enabled in Saleor dashboard
2. Verify all URLs are correct (no typos)
3. Check Saleor backend logs for detailed errors

### Issue: "Authentication failed"
**Solution:**
1. Verify Client ID and Client Secret are correct
2. Check that the OAuth consent screen is published (not in testing mode with restricted users)
3. Ensure your Google account has access to the app

### Issue: User created but not logged in
**Solution:**
- Check that your Saleor channel name matches: `channel-pln`
- Verify the callback URL processing in `/home/cymo/projects/storefront/src/app/[channel]/(main)/auth/callback/page.tsx`

## Testing Checklist

- [ ] Google OAuth credentials created
- [ ] Saleor OpenID Connect plugin configured
- [ ] Plugin enabled and saved
- [ ] Login button redirects to Google
- [ ] After Google login, redirected back to storefront
- [ ] User account created in Saleor
- [ ] User logged in successfully
- [ ] User can access account page

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Saleor OpenID Connect Plugin Docs](https://docs.saleor.io/docs/3.x/developer/extending/plugins/openid-connect)
- Saleor Dashboard: http://localhost:8000/dashboard/

## Quick Reference: Google OAuth URLs

```
Authorization: https://accounts.google.com/o/oauth2/v2/auth
Token:        https://oauth2.googleapis.com/token
JWKS:         https://www.googleapis.com/oauth2/v3/certs
UserInfo:     https://www.googleapis.com/oauth2/v3/userinfo
Logout:       https://accounts.google.com/logout
```

---

**Note:** Keep your Client ID and Client Secret secure. Never commit them to version control!
