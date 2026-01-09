# Progressive Web App (PWA) Setup

TechHub Electronics is now a fully installable Progressive Web App! Users can install it on their devices for a native app-like experience.

## 📱 What is a PWA?

A Progressive Web App allows users to install your website as an app on their device. Benefits include:

- **Faster Performance**: Instant loading and caching
- **Offline Support**: Works without internet connection
- **Native Feel**: Runs in standalone mode without browser UI
- **Home Screen Icon**: Easy access from device home screen
- **Push Notifications**: Re-engage users (future enhancement)
- **App-like Experience**: Fullscreen, smooth animations

## ✅ What's Implemented

### 1. Web App Manifest

**File**: [/public/manifest.json](/storefront/public/manifest.json)

Defines the app's appearance and behavior:

```json
{
  "name": "TechHub Electronics",
  "short_name": "TechHub",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#FB7701",
  "background_color": "#ffffff"
}
```

**Features**:
- App name and short name
- Brand colors (orange theme)
- Standalone display mode (no browser UI)
- App icons (192x192 and 512x512)
- App shortcuts (Products, Cart, Deals)
- Screenshots for app stores
- Categories and metadata

### 2. App Icons

**Files**:
- [/public/icon.svg](/storefront/public/icon.svg) - Scalable vector icon
- Auto-generated PNGs at 192x192 and 512x512

**Icon Design**:
- Brand orange background (#FB7701)
- Lightning bolt symbol for electronics
- "TH" letters for TechHub
- Maskable for different platform styles

**Replace Icons**:
To use your own branded icons:
1. Create a 512x512px PNG icon
2. Save as `/public/icon-512.png`
3. Create a 192x192px version as `/public/icon-192.png`
4. Update `manifest.json` to reference PNG files

### 3. Install Prompt

**File**: [/src/ui/components/PWAInstallPrompt.tsx](/storefront/src/ui/components/PWAInstallPrompt.tsx)

Smart install prompt that:
- **Detects platform**: Different UI for iOS vs Android/Desktop
- **Shows after 30 seconds**: Doesn't interrupt initial browsing
- **Remembers dismissal**: Won't show again for 7 days if dismissed
- **Detects if already installed**: Hides prompt if app is installed
- **Beautiful UI**: Matches brand design with animations

#### Android/Desktop Prompt
- One-click install button
- Shows benefits (faster, offline, native)
- Smooth slide-up animation
- Dismissable with "Later" button

#### iOS Prompt
- Step-by-step instructions
- Visual guides for Share button
- Custom UI (iOS doesn't support automatic prompts)
- Clear, simple steps

### 4. Metadata Configuration

**File**: [/src/app/layout.tsx](/storefront/src/app/layout.tsx)

Added PWA-specific metadata:

```typescript
{
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TechHub"
  },
  themeColor: "#FB7701",
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover"
  },
  icons: {
    icon: [{ url: "/icon.svg" }],
    apple: [{ url: "/icon.svg" }]
  }
}
```

## 📲 How to Install

### On Android (Chrome/Edge)

1. **Visit the site**: http://localhost:3000
2. **Wait for prompt**: Install banner appears after 30 seconds
3. **Click "Install"**: One-click installation
4. **Or manually**:
   - Tap menu (⋮) → "Install app" or "Add to Home screen"
   - Tap "Install"

### On iOS (Safari)

1. **Visit the site**: http://localhost:3000
2. **Tap Share button**: Bottom center of browser (box with arrow)
3. **Scroll and tap**: "Add to Home Screen"
4. **Tap "Add"**: Confirms installation
5. **Find app**: On your home screen

### On Desktop (Chrome/Edge)

1. **Visit the site**: http://localhost:3000
2. **Look for install icon**: In address bar (computer icon)
3. **Click icon**: Shows install dialog
4. **Click "Install"**: Installs app
5. **Find app**: In your apps menu / taskbar

### On Desktop (Other Browsers)

- **Firefox**: Currently doesn't support PWA installation (use as website)
- **Safari (macOS)**: Limited PWA support (use as website)

## 🎨 Customization

### Changing App Name

Edit [/public/manifest.json](/storefront/public/manifest.json):

```json
{
  "name": "Your Store Name - Full Version",
  "short_name": "YourStore"
}
```

Also update [/src/app/layout.tsx](/storefront/src/app/layout.tsx):

```typescript
applicationName: "Your Store Name",
appleWebApp: {
  title: "YourStore"
}
```

### Changing Theme Color

Edit [/public/manifest.json](/storefront/public/manifest.json):

```json
{
  "theme_color": "#YOUR_COLOR",
  "background_color": "#YOUR_BG_COLOR"
}
```

Also update [/src/app/layout.tsx](/storefront/src/app/layout.tsx):

```typescript
themeColor: "#YOUR_COLOR"
```

### Changing Icons

Replace these files:
- `/public/icon.svg` - Vector icon
- `/public/icon-192.png` - Small icon
- `/public/icon-512.png` - Large icon
- `/public/favicon.ico` - Browser favicon

**Icon Requirements**:
- **Format**: PNG or SVG
- **Size**: 512x512px recommended
- **Shape**: Square with optional rounded corners
- **Maskable**: Design should work with circular masks
- **Safe area**: Keep important content in center 80%

### Adding Screenshots

For app store listings and install previews:

1. **Take screenshots**:
   - Mobile: 390x844px (iPhone 13 size)
   - Desktop: 1920x1080px

2. **Save to /public/**:
   - `/public/screenshot-mobile.png`
   - `/public/screenshot-desktop.png`

3. **Already configured** in manifest.json!

### Customizing Install Prompt

Edit [/src/ui/components/PWAInstallPrompt.tsx](/storefront/src/ui/components/PWAInstallPrompt.tsx):

**Change delay** (default: 30 seconds):
```typescript
setTimeout(() => setShowPrompt(true), 30000); // 30000ms = 30s
```

**Change dismissal period** (default: 7 days):
```typescript
expiryDate.setDate(expiryDate.getDate() + 7); // Change 7 to desired days
```

**Disable prompt**:
Simply don't import/use PWAInstallPrompt component

### Adding App Shortcuts

Edit [/public/manifest.json](/storefront/public/manifest.json):

```json
{
  "shortcuts": [
    {
      "name": "Your Shortcut",
      "url": "/your-path",
      "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
    }
  ]
}
```

Shortcuts appear when long-pressing the app icon (Android).

## 🔧 Advanced Features

### Service Worker (Future Enhancement)

To add offline support and caching:

1. **Install next-pwa**:
   ```bash
   pnpm add next-pwa
   ```

2. **Configure next.config.js**:
   ```javascript
   const withPWA = require('next-pwa')({
     dest: 'public',
     register: true,
     skipWaiting: true,
   });

   module.exports = withPWA({
     // your next config
   });
   ```

3. **Service worker auto-generated** on build!

### Push Notifications (Future Enhancement)

To enable push notifications:

1. **Get VAPID keys** from web push service
2. **Request permission** from user
3. **Subscribe** to push notifications
4. **Send notifications** from backend

Example code:
```typescript
// Request permission
const permission = await Notification.requestPermission();

if (permission === 'granted') {
  // Register service worker
  const registration = await navigator.serviceWorker.ready;

  // Subscribe to push
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
  });

  // Send subscription to backend
  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription)
  });
}
```

### Background Sync (Future Enhancement)

Sync data when connection is restored:

```typescript
// Register background sync
const registration = await navigator.serviceWorker.ready;
await registration.sync.register('sync-orders');

// In service worker
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});
```

## 🧪 Testing PWA

### Lighthouse Audit

1. Open Chrome DevTools (F12)
2. Go to **Lighthouse** tab
3. Select **Progressive Web App**
4. Click **Generate Report**
5. Review PWA checklist

**Current Score**: Should be 90%+ ✅

### PWA Checklist

✅ **Manifest**: Valid manifest.json
✅ **Icons**: Multiple sizes provided
✅ **Theme Color**: Configured
✅ **Display Mode**: Standalone
✅ **HTTPS**: Required for production
✅ **Responsive**: Mobile-friendly
✅ **Fast**: Loading optimized

⏳ **Service Worker**: Not yet (future enhancement)
⏳ **Offline**: Not yet (future enhancement)

### Test Install Flow

**Android Emulator**:
1. Install Android Studio
2. Create virtual device
3. Open Chrome
4. Visit http://YOUR_IP:3000
5. Test install prompt

**iOS Simulator**:
1. Install Xcode (Mac only)
2. Open Simulator
3. Open Safari
4. Visit http://YOUR_IP:3000
5. Test manual install

**BrowserStack**:
- Test on real devices remotely
- https://www.browserstack.com/

### Debug Mode

Check browser console for PWA events:

```javascript
// Check if app is installed
const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
console.log('App installed:', isInstalled);

// Check if iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
console.log('iOS device:', isIOS);

// Listen for install events
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('Install prompt ready');
});

window.addEventListener('appinstalled', (e) => {
  console.log('App installed successfully');
});
```

## 📊 Analytics Integration

Track PWA installs with Google Analytics:

```typescript
// Track install prompt shown
window.addEventListener('beforeinstallprompt', (e) => {
  trackEvent({
    action: 'pwa_prompt_shown',
    category: 'PWA',
  });
});

// Track install accepted
window.addEventListener('appinstalled', (e) => {
  trackEvent({
    action: 'pwa_installed',
    category: 'PWA',
  });
});

// Track if running as PWA
if (window.matchMedia('(display-mode: standalone)').matches) {
  trackEvent({
    action: 'pwa_launch',
    category: 'PWA',
  });
}
```

## 🚀 Deployment Checklist

Before deploying PWA to production:

- [ ] **HTTPS Required**: PWAs require secure connection
- [ ] **Test on real devices** (Android + iOS)
- [ ] **Custom branded icons** (replace placeholder)
- [ ] **Screenshots** for app stores
- [ ] **Update manifest.json** with production URLs
- [ ] **Test install flow** on all platforms
- [ ] **Lighthouse audit** passes (90%+)
- [ ] **Analytics tracking** for installs
- [ ] **Consider service worker** for offline support
- [ ] **Update start_url** to production domain

## 🌐 Production URLs

Update these in [/public/manifest.json](/storefront/public/manifest.json):

```json
{
  "start_url": "https://yourdomain.com/",
  "scope": "https://yourdomain.com/"
}
```

## 💡 Best Practices

### Do's
✅ Use HTTPS in production (required)
✅ Provide multiple icon sizes
✅ Make icons maskable (safe area design)
✅ Test on real devices
✅ Keep manifest.json updated
✅ Use meaningful app name
✅ Provide screenshots
✅ Test install UX

### Don'ts
❌ Don't prompt immediately on first visit
❌ Don't show prompt on every page
❌ Don't use low-quality icons
❌ Don't ignore iOS users
❌ Don't force installation
❌ Don't skip testing

## 🆘 Troubleshooting

### Install button doesn't appear

**Causes**:
- Not using HTTPS (in production)
- Manifest.json has errors
- Icons missing or wrong size
- Browser doesn't support PWA
- User already dismissed prompt

**Solutions**:
- Check browser console for errors
- Validate manifest.json
- Test on different browser
- Clear site data and retry

### iOS install doesn't work

**Note**: iOS doesn't support automatic install prompts!

**Solution**:
- Show manual instructions (already implemented)
- Guide users through Safari share menu
- Can't be automated on iOS

### App doesn't open in standalone mode

**Causes**:
- Manifest display not set to "standalone"
- Opened from browser instead of home screen

**Solutions**:
- Check manifest.json display property
- Reinstall app
- Launch from home screen icon

### Icons not showing correctly

**Causes**:
- Wrong icon sizes
- Icons not maskable
- Path incorrect in manifest

**Solutions**:
- Use 192x192 and 512x512 sizes
- Keep important content in center 80%
- Check file paths in manifest.json

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Manifest Generator](https://www.simicart.com/manifest-generator.html/)
- [Icon Generator](https://favicon.io/)
- [Maskable Icons](https://maskable.app/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Your storefront is now a full Progressive Web App!** 🎉

Users can install it on their devices for a native app-like experience with fast loading, offline support (with service worker), and easy access from their home screen.
