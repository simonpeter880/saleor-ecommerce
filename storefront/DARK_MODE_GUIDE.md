# 🌓 Dark Mode Implementation Guide

## Overview
The TechHub Electronics storefront now supports a comprehensive dark mode with smooth transitions, localStorage persistence, and system preference detection.

## Quick Start

### Using the Theme
```tsx
import { useTheme } from "@/contexts/ThemeContext";

function MyComponent() {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current theme: {actualTheme}
    </button>
  );
}
```

### Adding Dark Mode to Components
Use Tailwind's `dark:` prefix for dark mode styles:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  <p className="text-gray-600 dark:text-gray-400">Secondary text</p>
</div>
```

## Common Patterns

### Backgrounds
```tsx
// Main backgrounds
className="bg-white dark:bg-gray-900"
className="bg-gray-50 dark:bg-gray-800"
className="bg-gray-100 dark:bg-gray-700"

// Card backgrounds
className="bg-white dark:bg-gray-800"

// Hover states
className="hover:bg-gray-50 dark:hover:bg-gray-700"
```

### Text Colors
```tsx
// Primary text
className="text-gray-900 dark:text-gray-100"

// Secondary text
className="text-gray-600 dark:text-gray-400"

// Muted text
className="text-gray-500 dark:text-gray-500"

// Links
className="text-temu-600 dark:text-temu-400"
```

### Borders
```tsx
className="border-gray-200 dark:border-gray-700"
className="border-gray-300 dark:border-gray-600"
```

### Shadows
```tsx
// Subtle shadow in dark mode
className="shadow-lg dark:shadow-gray-900/50"

// Remove shadow in dark mode
className="shadow-md dark:shadow-none"
```

## Component Examples

### Button
```tsx
<button className="bg-temu-500 hover:bg-temu-600 dark:bg-temu-600 dark:hover:bg-temu-700 text-white rounded-lg px-4 py-2 transition-colors">
  Click me
</button>
```

### Card
```tsx
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md dark:shadow-gray-900/50">
  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### Input
```tsx
<input
  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:border-temu-500 dark:focus:border-temu-400 focus:ring-1 focus:ring-temu-500 dark:focus:ring-temu-400"
  placeholder="Search..."
/>
```

### Modal/Overlay
```tsx
<div className="fixed inset-0 bg-black/50 dark:bg-black/70">
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Modal Title</h2>
  </div>
</div>
```

## Files Modified

### Core Files
- `/src/contexts/ThemeContext.tsx` - Theme state management
- `/src/ui/components/ThemeToggle.tsx` - Toggle component
- `/src/app/layout.tsx` - ThemeProvider integration
- `/tailwind.config.ts` - Dark mode configuration
- `/src/app/globals.css` - Smooth transitions

### Updated Components
- `/src/ui/components/TemuHeader.tsx` - Header with dark mode support

## Features

✅ **Three Theme Options:**
- Light Mode
- Dark Mode
- System (Auto-detect)

✅ **Smooth Transitions:**
- 200ms transitions on all color changes
- No jarring theme switches

✅ **Persistence:**
- Theme preference saved to localStorage
- Survives page reloads

✅ **System Integration:**
- Automatically follows system dark mode preference
- Updates when system preference changes

✅ **Accessibility:**
- ARIA labels
- Keyboard navigation
- Screen reader support

## Theme Toggle Variants

### Icon Button (Header)
```tsx
<ThemeToggle variant="icon" />
```

### Dropdown with System Option
```tsx
<ThemeToggle variant="dropdown" showLabel />
```

## Color Palette

### Light Mode
- Background: `white`, `gray-50`, `gray-100`
- Text: `gray-900`, `gray-700`, `gray-600`
- Borders: `gray-200`, `gray-300`
- Primary: `temu-500`, `temu-600`

### Dark Mode
- Background: `gray-900`, `gray-800`, `gray-700`
- Text: `gray-100`, `gray-300`, `gray-400`
- Borders: `gray-700`, `gray-600`
- Primary: `temu-400`, `temu-500`

## Best Practices

1. **Always provide dark mode variants** for:
   - Backgrounds
   - Text colors
   - Borders
   - Hover states
   - Focus states

2. **Test both modes** when creating new components

3. **Use semantic colors**:
   - Don't use absolute colors like `bg-white` without `dark:bg-gray-800`
   - Keep contrast ratios accessible in both modes

4. **Avoid flash of unstyled content**:
   - ThemeProvider handles this automatically
   - Uses `suppressHydrationWarning` on html element

5. **Consider images and icons**:
   - Some images may need dark mode variants
   - Use CSS filters if needed: `dark:invert dark:brightness-90`

## Updating Existing Components

To add dark mode to an existing component:

1. **Identify color-related classes**:
   - Background colors
   - Text colors
   - Border colors
   - Shadow classes

2. **Add dark: variants**:
   ```tsx
   // Before
   className="bg-white text-gray-900 border-gray-200"

   // After
   className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
   ```

3. **Test the component** in both light and dark modes

4. **Check hover and focus states** work in both modes

## Common Issues

### Issue: Flash of white on page load
**Solution**: Already handled by ThemeProvider's mounted state

### Issue: Theme not persisting
**Solution**: Check localStorage key `techhub_theme` exists

### Issue: System theme not updating
**Solution**: ThemeProvider automatically listens to `prefers-color-scheme` changes

### Issue: Transitions too slow/fast
**Solution**: Modify duration in `globals.css`:
```css
transition-duration: 200ms; /* Adjust this value */
```

## Future Enhancements

Potential improvements:
- [ ] Per-component theme overrides
- [ ] High contrast mode
- [ ] Color blindness modes
- [ ] Custom color scheme selection
- [ ] Accent color customization

---

**Note**: This is a class-based dark mode implementation using Tailwind CSS. All components support dark mode out of the box when using the standard patterns above.
