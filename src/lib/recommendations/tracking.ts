/**
 * Recommendation Tracking Utilities
 *
 * Track user behavior for personalized recommendations:
 * - Product views
 * - Add to cart events
 * - Purchases
 * - Search queries
 * - Category browsing
 *
 * Data stored in localStorage and synced to server for authenticated users
 */

const STORAGE_KEYS = {
  RECENTLY_VIEWED: 'recently_viewed',
  VIEW_HISTORY: 'view_history',
  SEARCH_HISTORY: 'search_history',
  CART_HISTORY: 'cart_history',
  PREFERRED_CATEGORIES: 'preferred_categories',
  PREFERRED_BRANDS: 'preferred_brands',
};

export interface ProductView {
  id: string;
  name: string;
  slug: string;
  category?: string;
  price?: number;
  thumbnail?: string;
  metadata?: Record<string, string>;
  viewedAt: number;
}

export interface UserPreferences {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  recentSearches: string[];
}

/**
 * Track product view
 */
export function trackProductView(product: {
  id: string;
  name: string;
  slug: string;
  category?: string;
  price?: number;
  thumbnail?: string;
  metadata?: Record<string, string>;
}): void {
  const view: ProductView = {
    ...product,
    viewedAt: Date.now(),
  };

  // Update recently viewed (max 20 items)
  const recentlyViewed = getRecentlyViewed();
  const filtered = recentlyViewed.filter((v) => v.id !== product.id);
  const updated = [view, ...filtered].slice(0, 20);
  localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(updated));

  // Update view history for analytics
  const viewHistory = getViewHistory();
  viewHistory.push({
    productId: product.id,
    timestamp: Date.now(),
  });
  localStorage.setItem(STORAGE_KEYS.VIEW_HISTORY, JSON.stringify(viewHistory.slice(-100)));

  // Update category preferences
  if (product.category) {
    updateCategoryPreference(product.category);
  }

  // Update brand preferences
  const brand = extractBrand(product.name);
  if (brand) {
    updateBrandPreference(brand);
  }

  // Sync to server if authenticated
  syncToServer('view', product.id);
}

/**
 * Track add to cart event
 */
export function trackAddToCart(productId: string): void {
  const cartHistory = getCartHistory();
  cartHistory.push({
    productId,
    timestamp: Date.now(),
  });
  localStorage.setItem(STORAGE_KEYS.CART_HISTORY, JSON.stringify(cartHistory.slice(-50)));

  syncToServer('add-to-cart', productId);
}

/**
 * Track purchase
 */
export function trackPurchase(productIds: string[]): void {
  // Clear cart history for purchased items
  const cartHistory = getCartHistory().filter(
    (item) => !productIds.includes(item.productId)
  );
  localStorage.setItem(STORAGE_KEYS.CART_HISTORY, JSON.stringify(cartHistory));

  syncToServer('purchase', productIds.join(','));
}

/**
 * Track search query
 */
export function trackSearch(query: string): void {
  const searches = getSearchHistory();
  const filtered = searches.filter((s) => s !== query);
  const updated = [query, ...filtered].slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated));

  syncToServer('search', query);
}

/**
 * Get recently viewed products
 */
export function getRecentlyViewed(): ProductView[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load recently viewed:', error);
    return [];
  }
}

/**
 * Get view history (for analytics)
 */
export function getViewHistory(): Array<{ productId: string; timestamp: number }> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VIEW_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load view history:', error);
    return [];
  }
}

/**
 * Get search history
 */
export function getSearchHistory(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load search history:', error);
    return [];
  }
}

/**
 * Get cart history
 */
export function getCartHistory(): Array<{ productId: string; timestamp: number }> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CART_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load cart history:', error);
    return [];
  }
}

/**
 * Get user preferences based on behavior
 */
export function getUserPreferences(): UserPreferences {
  const categories = getPreferredCategories();
  const brands = getPreferredBrands();
  const priceRange = calculatePreferredPriceRange();
  const recentSearches = getSearchHistory();

  return {
    categories,
    brands,
    priceRange,
    recentSearches,
  };
}

/**
 * Get preferred categories
 */
function getPreferredCategories(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERRED_CATEGORIES);
    const categoryMap: Record<string, number> = stored ? JSON.parse(stored) : {};

    // Sort by count and return top 5
    return Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category]) => category);
  } catch (error) {
    console.error('Failed to load preferred categories:', error);
    return [];
  }
}

/**
 * Get preferred brands
 */
function getPreferredBrands(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERRED_BRANDS);
    const brandMap: Record<string, number> = stored ? JSON.parse(stored) : {};

    // Sort by count and return top 5
    return Object.entries(brandMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([brand]) => brand);
  } catch (error) {
    console.error('Failed to load preferred brands:', error);
    return [];
  }
}

/**
 * Calculate preferred price range from view history
 */
function calculatePreferredPriceRange(): [number, number] {
  const recentlyViewed = getRecentlyViewed();
  const prices = recentlyViewed
    .map((v) => v.price)
    .filter((p): p is number => p !== undefined);

  if (prices.length === 0) {
    return [0, 10000000]; // Default range
  }

  const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const min = Math.max(0, avg * 0.5);
  const max = avg * 1.5;

  return [min, max];
}

/**
 * Update category preference counter
 */
function updateCategoryPreference(category: string): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERRED_CATEGORIES);
    const categoryMap: Record<string, number> = stored ? JSON.parse(stored) : {};

    categoryMap[category] = (categoryMap[category] || 0) + 1;

    localStorage.setItem(STORAGE_KEYS.PREFERRED_CATEGORIES, JSON.stringify(categoryMap));
  } catch (error) {
    console.error('Failed to update category preference:', error);
  }
}

/**
 * Update brand preference counter
 */
function updateBrandPreference(brand: string): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERRED_BRANDS);
    const brandMap: Record<string, number> = stored ? JSON.parse(stored) : {};

    brandMap[brand] = (brandMap[brand] || 0) + 1;

    localStorage.setItem(STORAGE_KEYS.PREFERRED_BRANDS, JSON.stringify(brandMap));
  } catch (error) {
    console.error('Failed to update brand preference:', error);
  }
}

/**
 * Extract brand from product name
 */
function extractBrand(name: string): string | null {
  const brands = [
    'Apple',
    'Samsung',
    'HP',
    'Dell',
    'Lenovo',
    'ASUS',
    'Acer',
    'Huawei',
    'Xiaomi',
    'OPPO',
    'TECNO',
    'Infinix',
    'Nokia',
    'Sony',
    'LG',
    'Microsoft',
    'Google',
  ];

  const nameLower = name.toLowerCase();
  for (const brand of brands) {
    if (nameLower.includes(brand.toLowerCase())) {
      return brand;
    }
  }

  return null;
}

/**
 * Sync tracking data to server
 */
async function syncToServer(eventType: string, data: string): Promise<void> {
  try {
    // Only sync if user is authenticated
    const userId = getUserId();
    if (!userId) return;

    await fetch('/api/tracking/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        eventType,
        data,
        timestamp: Date.now(),
      }),
    });
  } catch (error) {
    // Silently fail - tracking shouldn't block user experience
    console.error('Failed to sync tracking data:', error);
  }
}

/**
 * Get user ID from session/cookie
 */
function getUserId(): string | null {
  // TODO: Implement based on your auth system
  // This is a placeholder
  return null;
}

/**
 * Clear all tracking data
 */
export function clearTrackingData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

export default {
  trackProductView,
  trackAddToCart,
  trackPurchase,
  trackSearch,
  getRecentlyViewed,
  getUserPreferences,
  clearTrackingData,
};
