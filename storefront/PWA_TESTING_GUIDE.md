# PWA Install Testing Guide

## 🔍 Why the Install Prompt May Not Appear

The PWA install prompt (`beforeinstallprompt` event) has **specific requirements** and **browser limitations**:

### Requirements for Install Prompt

The install prompt will ONLY appear when **ALL** of these are met:

1. ✅ **Valid manifest.json** - Must exist and be valid
2. ✅ **HTTPS or localhost** - Secure origin required
3. ✅ **Service Worker** (optional but recommended)
4. ✅ **Responsive design** - Works on mobile
5. ✅ **Not already installed** - User hasn't installed yet
6. ✅ **Chrome/Edge only** - Firefox and Safari don't support it
7. ✅ **Not in incognito mode** - Regular browsing only
8. ✅ **User engagement** - Some browsers require user interaction first

### Browser Support

| Browser | Auto Install Prompt | Manual Install |
|---------|-------------------|----------------|
| **Chrome (Android)** | ✅ Yes | ✅ Yes |
| **Chrome (Desktop)** | ✅ Yes | ✅ Yes (icon in address bar) |
| **Edge (Desktop)** | ✅ Yes | ✅ Yes |
| **Safari (iOS)** | ❌ No | ✅ Yes (Share → Add to Home Screen) |
| **Firefox** | ❌ No | ⚠️ Limited |
| **Samsung Internet** | ✅ Yes | ✅ Yes |

## 🧪 How to Test PWA Install

### Method 1: Using Chrome DevTools (Easiest)

1. **Open Chrome** (not Firefox/Safari)
2. **Visit**: http://localhost:3000
3. **Open DevTools**: Press F12
4. **Go to Application tab**
5. **Check "Manifest"** section:
   - Should show app name, icons, colors
   - Click "Errors" to see any issues
6. **Look at "Service Workers"** (optional for now)
7. **Scroll down to "Install"** section
8. **Watch Console** for these messages:
   ```
   🔍 Listening for PWA install prompt...
   📱 Device: Desktop
   ✅ PWA install prompt is available!
   ```

### Method 2: Look for Install Button

I've added a **test install button** that appears immediately when the install prompt is available:

- **Location**: Bottom-right corner
- **Color**: Orange with bounce animation
- **Text**: "Install App"

**If you see this button** → Click it to install!
**If you don't see it** → See troubleshooting below

### Method 3: Manual Install (Chrome)

1. Look for **install icon** in address bar:
   - Desktop Chrome: ⊕ or computer icon
   - Mobile Chrome: "Add to Home Screen" in menu (⋮)
2. Click the icon
3. Click "Install"

### Method 4: Using Application Panel

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Find **"App"** section on left
4. Look for **"Install"** or **"Installability"**
5. See why app may not be installable

## 🐛 Troubleshooting

### ❌ No Install Button Appears

**Possible Causes**:

1. **Wrong Browser**
   - ✅ **Solution**: Use Chrome or Edge (not Firefox/Safari)
   - Check: `console.log(navigator.userAgent)`

2. **Already Installed**
   - ✅ **Solution**: Uninstall the app first
   - Chrome: Settings → Apps → TechHub → Uninstall
   - Or check if you see "✅ App Installed" message

3. **Incognito Mode**
   - ✅ **Solution**: Use regular browser window

4. **Manifest Error**
   - ✅ **Solution**: Check DevTools → Application → Manifest
   - Look for error messages
   - Verify manifest.json loads: http://localhost:3000/manifest.json

5. **Missing User Engagement**
   - ✅ **Solution**: Click around the site first
   - Some browsers require interaction before showing prompt

6. **Service Worker Required (Some Browsers)**
   - ✅ **Solution**: Add service worker (future enhancement)
   - For now, Chrome should work without it

### ❌ Console Shows No Messages

**Check**:
```javascript
// Paste in browser console
console.log('Browser:', navigator.userAgent);
console.log('Standalone?', window.matchMedia('(display-mode: standalone)').matches);
console.log('Supports PWA?', 'BeforeInstallPromptEvent' in window);
```

### ❌ "beforeinstallprompt not supported"

This means your browser doesn't support automatic install prompts.

**Solutions**:
- **Desktop**: Switch to Chrome or Edge
- **Mobile**: Use Chrome for Android
- **iOS**: Use manual install (Safari Share menu)

### ❌ Manifest Shows Errors

Common errors and fixes:

**"start_url not reachable"**
- Fix: Ensure `/` loads correctly

**"Icons missing"**
- Fix: Verify `/icon.svg` exists
- Check: http://localhost:3000/icon.svg

**"Invalid JSON"**
- Fix: Validate manifest.json
- Tool: https://manifest-validator.appspot.com/

## ✅ Manual Install Instructions

If automatic prompt doesn't work, users can still install manually:

### Chrome (Desktop)
1. Click menu (⋮) → "Install TechHub..."
2. Or click install icon (⊕) in address bar
3. Click "Install"

### Chrome (Android)
1. Tap menu (⋮)
2. Tap "Add to Home screen" or "Install app"
3. Tap "Add" or "Install"
4. Find app icon on home screen

### Safari (iOS) - Manual Only
1. Tap Share button (box with arrow)
2. Scroll and tap "Add to Home Screen"
3. Tap "Add"
4. Find app icon on home screen

### Edge (Desktop)
1. Click menu (⋯) → "Apps" → "Install TechHub..."
2. Or click install icon in address bar
3. Click "Install"

## 📊 Verify PWA is Working

### Check Manifest Loads
Visit: http://localhost:3000/manifest.json

Should see:
```json
{
  "name": "TechHub Electronics",
  "short_name": "TechHub",
  "theme_color": "#FB7701",
  ...
}
```

### Check Icon Loads
Visit: http://localhost:3000/icon.svg

Should see orange icon with "TH" and lightning bolt.

### Check DevTools Lighthouse

1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Click "Generate report"

**Should Pass**:
- ✅ Installable
- ✅ Manifest exists
- ✅ Icons present
- ✅ Theme color set
- ✅ Display mode standalone

**May Fail** (Optional):
- ⚠️ Service worker (not required for install)
- ⚠️ Offline support (future enhancement)

## 🎯 Quick Test Checklist

Try these in order:

1. [ ] **Use Chrome or Edge** (not Firefox/Safari)
2. [ ] **Visit** http://localhost:3000
3. [ ] **Open DevTools Console** (F12)
4. [ ] **Look for** debug messages starting with 🔍 and ✅
5. [ ] **Look for** orange "Install App" button (bottom-right)
6. [ ] **If button appears** → Click it!
7. [ ] **If no button** → Check address bar for install icon
8. [ ] **Still nothing?** → Try manual install from menu
9. [ ] **On mobile?** → Get your computer's IP and visit from phone

## 🔧 Testing on Real Devices

### Get Your Computer's IP

**Linux/Mac**:
```bash
hostname -I | awk '{print $1}'
```

**Windows**:
```bash
ipconfig
# Look for IPv4 Address
```

### Test on Mobile

1. Connect phone to **same WiFi** as computer
2. On phone browser, visit: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`
3. **Android Chrome**: Should see install banner after browsing
4. **iOS Safari**: Use manual install (Share → Add to Home Screen)

## 💡 Current Implementation

### Test Mode (Active Now)

- **PWAInstallButton** - Shows immediately when prompt available
- Orange bouncing button in bottom-right
- Console logging for debugging
- Perfect for testing!

### Production Mode (Optional)

- **PWAInstallPrompt** - Shows after 30 seconds
- Dismissable for 7 days
- Polished UI with benefits listed
- Better for real users

**To switch back to production mode**:
Edit `/src/app/[channel]/(main)/layout.tsx`:
```typescript
// Change this:
import { PWAInstallButton } from "@/ui/components/PWAInstallButton";

// To this:
import { PWAInstallPrompt } from "@/ui/components/PWAInstallPrompt";

// And change the component:
<PWAInstallButton /> → <PWAInstallPrompt />
```

## 📱 iOS Testing Notes

**Important**: iOS Safari does **NOT** support the `beforeinstallprompt` event!

On iOS:
- ❌ No automatic install prompt
- ❌ No install button
- ✅ Manual install works: Share → "Add to Home Screen"

Our `PWAInstallPrompt` component (production version) detects iOS and shows **manual installation instructions** instead.

## 🚀 Next Steps

Once you verify PWA works:

1. **Customize Icon**: Replace `/public/icon.svg` with branded icon
2. **Test on Phone**: Try install on your actual mobile device
3. **Add Service Worker**: For offline support (optional)
4. **Deploy to Production**: Requires HTTPS
5. **Switch to Production Mode**: Use PWAInstallPrompt instead of PWAInstallButton
6. **Track Installs**: Add analytics for install events

## 📚 Resources

- **Test Manifest**: https://manifest-validator.appspot.com/
- **PWA Checklist**: https://web.dev/pwa-checklist/
- **Browser Support**: https://caniuse.com/web-app-manifest
- **Debug PWA**: Chrome DevTools → Application → Manifest

---

## 🎯 TL;DR - Quick Test

```bash
# 1. Open Chrome (not Firefox/Safari)
# 2. Visit http://localhost:3000
# 3. Open Console (F12)
# 4. Look for orange "Install App" button (bottom-right)
# 5. If you see it → Click it!
# 6. If not → Check console for error messages
```

**Most common issue**: Wrong browser (use Chrome!)

---

Need help? Check console logs for debugging info!
