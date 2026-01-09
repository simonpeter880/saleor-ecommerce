# TechHub Electronics - Frontend Documentation

Welcome to the TechHub Electronics storefront documentation! This directory contains comprehensive guides for all frontend features and improvements.

## 📚 Documentation Index

### Recent Improvements (2026-01-06)

- **[FRONTEND_IMPROVEMENTS.md](./FRONTEND_IMPROVEMENTS.md)** - Complete guide to all recent frontend enhancements
  - Custom 404 and error pages
  - Route transitions and animations
  - Accessibility improvements
  - Google Analytics integration
  - Reviews system overview

- **[REVIEWS_INTEGRATION.md](./REVIEWS_INTEGRATION.md)** - Product reviews backend integration guide
  - Multiple integration options (Saleor App, Metadata, Third-party, External DB)
  - Implementation steps
  - API examples
  - Production checklist

### Quick Start Guides

#### 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Add your Google Analytics ID (optional)
# NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# Run development server
pnpm dev
```

#### 📊 Setting Up Analytics

1. Create a Google Analytics 4 property at https://analytics.google.com/
2. Copy your tracking ID (format: `G-XXXXXXXXXX`)
3. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
   ```
4. Analytics will automatically start tracking page views

#### 🔌 Setting Up Reviews

1. Read [REVIEWS_INTEGRATION.md](./REVIEWS_INTEGRATION.md)
2. Choose your backend option:
   - **Saleor App** (recommended for production)
   - **Saleor Metadata** (simple, no backend)
   - **Third-party service** (Yotpo, Trustpilot, etc.)
   - **External database** (PostgreSQL, MongoDB, etc.)
3. Update `/src/app/review-actions.ts` with your backend
4. Test thoroughly

## 🎯 Feature Overview

### ✨ User Experience
- Smooth page transitions (300ms)
- Top loading bar for route changes
- Enhanced 404 page with product suggestions
- Professional error boundaries with recovery options
- Dark mode support throughout
- Mobile-optimized design

### ♿ Accessibility
- WCAG 2.1 Level AA compliant
- Skip-to-content link for keyboard users
- Focus trap for modals
- Screen reader optimized
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support

### 📊 Analytics & Tracking
- Google Analytics 4 integration
- Automatic page view tracking
- E-commerce event tracking:
  - Product views
  - Add to cart
  - Remove from cart
  - Begin checkout
  - Purchase completion
- Custom event tracking
- Enhanced e-commerce data

### ⭐ Reviews System
- 5-star rating system
- Review submission with validation
- Verified purchase badges
- Helpful voting
- Rating statistics and distribution
- Pagination and sorting
- Multiple backend integration options

## 🏗️ Architecture

### Component Structure

```
storefront/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── reviews/       # Reviews API endpoints
│   │   ├── [channel]/         # Channel-based routing
│   │   ├── layout.tsx         # Root layout
│   │   ├── not-found.tsx      # Custom 404 page
│   │   └── error.tsx          # Error boundary
│   │
│   ├── ui/
│   │   └── components/        # React components
│   │       ├── GoogleAnalytics.tsx
│   │       ├── LoadingBar.tsx
│   │       ├── PageTransition.tsx
│   │       ├── SkipToContent.tsx
│   │       ├── FocusTrap.tsx
│   │       └── VisuallyHidden.tsx
│   │
│   ├── lib/
│   │   └── analytics.ts       # GA4 tracking utilities
│   │
│   ├── contexts/              # React Context providers
│   ├── hooks/                 # Custom React hooks
│   └── graphql/               # GraphQL queries
│
└── docs/                      # Documentation (you are here!)
```

### Key Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **State Management**: React Context + Zustand
- **GraphQL**: urql + GraphQL Codegen
- **Analytics**: Google Analytics 4
- **Testing**: Jest + Testing Library

## 📖 Component Documentation

### LoadingBar

Shows a top progress bar during route transitions.

```tsx
// Automatically included in root layout
<LoadingBar />
```

**Features**:
- Triggers on route change
- Smooth progress animation
- Brand-colored gradient
- Shimmer effect

### PageTransition

Provides smooth fade transitions between pages.

```tsx
// Wraps all pages in root layout
<PageTransition>{children}</PageTransition>
```

**Features**:
- 300ms fade transition
- Auto scroll-to-top
- No configuration needed

### SkipToContent

Accessibility link for keyboard users.

```tsx
<SkipToContent />
```

**Features**:
- Hidden until focused
- Jumps to main content
- WCAG compliant

### FocusTrap

Traps keyboard focus within a component (for modals).

```tsx
<FocusTrap active={isOpen} onEscape={() => setIsOpen(false)}>
  <Modal>{content}</Modal>
</FocusTrap>
```

**Features**:
- Tab/Shift+Tab cycling
- Escape key support
- Auto-focus first element

### GoogleAnalytics

Google Analytics 4 integration.

```tsx
// Automatically included in root layout
<GoogleAnalytics />
```

**Features**:
- Auto page tracking
- Server-side scripts
- Environment-based

## 🎨 Styling Guidelines

### Brand Colors

```css
--primary: #FB7701        /* Orange */
--primary-dark: #E66A01
--primary-light: #FFA940
```

### Animations

```css
/* Standard transition */
transition: all 200ms ease-out;

/* Page transition */
transition: opacity 300ms ease-out;

/* Loading animation */
transition: width 300ms ease-out;
```

### Dark Mode

All components support dark mode via Tailwind's `dark:` variant:

```tsx
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

### Accessibility Testing

1. **Keyboard Navigation**
   - Press Tab to navigate
   - Shift+Tab to go back
   - Enter to activate
   - Escape to close modals

2. **Screen Readers**
   - Test with NVDA (Windows)
   - Test with JAWS (Windows)
   - Test with VoiceOver (Mac/iOS)

3. **Automated Tools**
   - Use axe DevTools
   - Use Lighthouse
   - Use WAVE extension

### Analytics Testing

1. **Development**
   - Open browser DevTools
   - Go to Network tab
   - Filter for "google-analytics"
   - Trigger events
   - Verify requests

2. **Production**
   - Check GA Real-Time reports
   - Verify page views
   - Check event tracking
   - Review conversion data

## 🚀 Deployment

### Pre-Deployment Checklist

- [ ] Set `NEXT_PUBLIC_GA_TRACKING_ID` in production env
- [ ] Configure reviews backend
- [ ] Test all error pages
- [ ] Verify analytics tracking
- [ ] Test accessibility
- [ ] Check mobile responsiveness
- [ ] Verify dark mode
- [ ] Review performance metrics
- [ ] Set up error monitoring

### Environment Variables

```bash
# Required
NEXT_PUBLIC_SALEOR_API_URL=https://your-saleor.com/graphql/
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel

# Optional
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_STOREFRONT_URL=https://your-site.com
```

### Build Commands

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Generate GraphQL types
pnpm generate
```

## 📈 Performance

### Optimization Techniques

- ✅ Server-side rendering (SSR)
- ✅ Static site generation (SSG) where possible
- ✅ Image optimization with Next.js Image
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Font optimization
- ✅ CSS optimization with Tailwind

### Performance Metrics

Target metrics:
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.9s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Bundle Analysis

```bash
# Analyze bundle size
npx @next/bundle-analyzer
```

## 🔧 Troubleshooting

### Common Issues

#### Google Analytics not tracking

1. Check `NEXT_PUBLIC_GA_TRACKING_ID` is set
2. Verify tracking ID format (G-XXXXXXXXXX)
3. Check browser DevTools Network tab
4. Ensure ad blockers are disabled for testing
5. Wait 24-48 hours for data to appear in GA

#### Reviews not displaying

1. Check browser console for errors
2. Verify `/src/app/review-actions.ts` configuration
3. Check localStorage (demo mode)
4. Verify backend connection (if configured)

#### Page transitions not smooth

1. Check browser performance
2. Disable browser extensions
3. Clear browser cache
4. Check console for errors

#### Accessibility issues

1. Test with keyboard only
2. Use screen reader
3. Run axe DevTools scan
4. Check Lighthouse report

## 📚 Additional Resources

### External Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Web Accessibility (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Saleor Documentation](https://docs.saleor.io/)

### Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/extension/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

## 🤝 Contributing

When adding new features:

1. ✅ Follow existing code style
2. ✅ Add TypeScript types
3. ✅ Ensure accessibility (WCAG 2.1)
4. ✅ Support dark mode
5. ✅ Make responsive
6. ✅ Add error handling
7. ✅ Include loading states
8. ✅ Write tests
9. ✅ Update documentation

## 📞 Support

For help with:
- **Saleor**: https://docs.saleor.io/
- **Next.js**: https://nextjs.org/docs
- **Accessibility**: https://www.w3.org/WAI/
- **Analytics**: https://support.google.com/analytics

---

**Last Updated**: 2026-01-06

**Made with ❤️ for TechHub Electronics**
