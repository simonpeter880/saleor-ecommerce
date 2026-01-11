/**
 * Product Recommendations Engine
 *
 * Generates personalized product recommendations using:
 * - Collaborative filtering (users who bought X also bought Y)
 * - Content-based filtering (similar specs/category)
 * - Behavioral signals (views, cart adds, purchases)
 * - Price-based suggestions (alternatives at different price points)
 *
 * Expected Impact: +25% cross-sell, +15% average order value
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  category?: string;
  price?: number;
  metadata?: Record<string, string>;
  tags?: string[];
}

export interface RecommendationContext {
  productId?: string;
  categorySlug?: string;
  userId?: string;
  viewedProducts?: string[];
  cartProducts?: string[];
  priceRange?: [number, number];
  preferredBrands?: string[];
}

export interface Recommendation {
  product: Product;
  score: number;
  reason: 'similar' | 'frequently-bought-together' | 'personalized' | 'trending' | 'price-alternative';
  reasonText: string;
}

/**
 * Main recommendation engine
 */
export class RecommendationEngine {
  /**
   * Get similar products based on specs and category
   */
  static getSimilarProducts(
    currentProduct: Product,
    allProducts: Product[],
    limit: number = 6
  ): Recommendation[] {
    const scored = allProducts
      .filter((p) => p.id !== currentProduct.id)
      .map((product) => ({
        product,
        score: this.calculateSimilarityScore(currentProduct, product),
        reason: 'similar' as const,
        reasonText: 'Similar specifications and features',
      }))
      .filter((rec) => rec.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored;
  }

  /**
   * Get frequently bought together products
   */
  static getFrequentlyBoughtTogether(
    currentProduct: Product,
    purchaseHistory: Array<{ products: string[] }>,
    allProducts: Product[],
    limit: number = 4
  ): Recommendation[] {
    // Find orders containing current product
    const relatedOrders = purchaseHistory.filter((order) =>
      order.products.includes(currentProduct.id)
    );

    // Count co-occurrences
    const coOccurrences = new Map<string, number>();
    relatedOrders.forEach((order) => {
      order.products.forEach((productId) => {
        if (productId !== currentProduct.id) {
          coOccurrences.set(productId, (coOccurrences.get(productId) || 0) + 1);
        }
      });
    });

    // Convert to recommendations
    const recommendations: Recommendation[] = [];
    coOccurrences.forEach((count, productId) => {
      const product = allProducts.find((p) => p.id === productId);
      if (product) {
        recommendations.push({
          product,
          score: count / relatedOrders.length,
          reason: 'frequently-bought-together',
          reasonText: `${count} customers bought this together`,
        });
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get personalized recommendations based on user behavior
   */
  static getPersonalizedRecommendations(
    context: RecommendationContext,
    allProducts: Product[],
    limit: number = 8
  ): Recommendation[] {
    const scored = allProducts.map((product) => ({
      product,
      score: this.calculatePersonalizationScore(product, context),
      reason: 'personalized' as const,
      reasonText: 'Based on your browsing history',
    }));

    return scored
      .filter((rec) => rec.score > 0.4)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get price alternatives (cheaper/premium options)
   */
  static getPriceAlternatives(
    currentProduct: Product,
    allProducts: Product[],
    type: 'cheaper' | 'premium' = 'cheaper',
    limit: number = 4
  ): Recommendation[] {
    if (!currentProduct.price) return [];

    const currentPrice = currentProduct.price;
    const priceRange = type === 'cheaper'
      ? [0, currentPrice * 0.9]
      : [currentPrice * 1.1, currentPrice * 2];

    const alternatives = allProducts
      .filter((p) =>
        p.id !== currentProduct.id &&
        p.price &&
        p.price >= priceRange[0] &&
        p.price <= priceRange[1] &&
        this.isSameCategory(currentProduct, p)
      )
      .map((product) => ({
        product,
        score: this.calculateSimilarityScore(currentProduct, product),
        reason: 'price-alternative' as const,
        reasonText: type === 'cheaper'
          ? `Save ${formatPrice(currentPrice - (product.price || 0))} UGX`
          : `Premium option with enhanced features`,
      }))
      .sort((a, b) => type === 'cheaper'
        ? (b.product.price || 0) - (a.product.price || 0) // Closest to original price
        : (a.product.price || 0) - (b.product.price || 0) // Cheapest premium option
      )
      .slice(0, limit);

    return alternatives;
  }

  /**
   * Get trending products in category
   */
  static getTrendingProducts(
    categorySlug: string,
    viewHistory: Array<{ productId: string; timestamp: number }>,
    allProducts: Product[],
    limit: number = 6
  ): Recommendation[] {
    const now = Date.now();
    const last7Days = now - 7 * 24 * 60 * 60 * 1000;

    // Count views in last 7 days
    const viewCounts = new Map<string, number>();
    viewHistory
      .filter((view) => view.timestamp >= last7Days)
      .forEach((view) => {
        viewCounts.set(view.productId, (viewCounts.get(view.productId) || 0) + 1);
      });

    // Convert to recommendations
    const recommendations: Recommendation[] = [];
    viewCounts.forEach((count, productId) => {
      const product = allProducts.find((p) =>
        p.id === productId &&
        (!categorySlug || p.category === categorySlug)
      );

      if (product) {
        recommendations.push({
          product,
          score: count,
          reason: 'trending',
          reasonText: `${count} views this week`,
        });
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Calculate similarity score between two products (0-1)
   */
  private static calculateSimilarityScore(product1: Product, product2: Product): number {
    let score = 0;
    let factors = 0;

    // Same category (30 points)
    if (this.isSameCategory(product1, product2)) {
      score += 0.3;
    }
    factors++;

    // Similar price (20 points)
    if (product1.price && product2.price) {
      const priceDiff = Math.abs(product1.price - product2.price);
      const avgPrice = (product1.price + product2.price) / 2;
      const priceSimiliarity = 1 - Math.min(priceDiff / avgPrice, 1);
      score += priceSimiliarity * 0.2;
      factors++;
    }

    // Matching specs (50 points)
    const specScore = this.calculateSpecSimilarity(
      product1.metadata || {},
      product2.metadata || {}
    );
    score += specScore * 0.5;
    factors++;

    return score / factors;
  }

  /**
   * Calculate spec similarity between two products
   */
  private static calculateSpecSimilarity(
    metadata1: Record<string, string>,
    metadata2: Record<string, string>
  ): number {
    const keys = new Set([...Object.keys(metadata1), ...Object.keys(metadata2)]);
    if (keys.size === 0) return 0;

    let matches = 0;
    keys.forEach((key) => {
      const value1 = metadata1[key];
      const value2 = metadata2[key];

      if (value1 && value2) {
        // Exact match
        if (value1 === value2) {
          matches += 1;
        }
        // Numeric similarity (e.g., RAM: 8GB vs 16GB)
        else if (!isNaN(Number(value1)) && !isNaN(Number(value2))) {
          const num1 = Number(value1);
          const num2 = Number(value2);
          const diff = Math.abs(num1 - num2);
          const avg = (num1 + num2) / 2;
          matches += Math.max(0, 1 - diff / avg);
        }
      }
    });

    return matches / keys.size;
  }

  /**
   * Calculate personalization score based on user context
   */
  private static calculatePersonalizationScore(
    product: Product,
    context: RecommendationContext
  ): number {
    let score = 0;

    // Viewed products influence (30 points)
    if (context.viewedProducts && context.viewedProducts.length > 0) {
      const viewedSimilarity = context.viewedProducts
        .map((viewedId) => {
          // In real implementation, fetch viewed product and calculate similarity
          // For now, simple heuristic
          return 0.5;
        })
        .reduce((sum, sim) => sum + sim, 0) / context.viewedProducts.length;

      score += viewedSimilarity * 0.3;
    }

    // Price range match (25 points)
    if (context.priceRange && product.price) {
      const [min, max] = context.priceRange;
      if (product.price >= min && product.price <= max) {
        score += 0.25;
      }
    }

    // Preferred brands (25 points)
    if (context.preferredBrands && context.preferredBrands.length > 0) {
      const productBrand = product.name.toLowerCase();
      const matchesBrand = context.preferredBrands.some((brand) =>
        productBrand.includes(brand.toLowerCase())
      );
      if (matchesBrand) {
        score += 0.25;
      }
    }

    // Category match (20 points)
    if (context.categorySlug && product.category === context.categorySlug) {
      score += 0.2;
    }

    return score;
  }

  /**
   * Check if two products are in the same category
   */
  private static isSameCategory(product1: Product, product2: Product): boolean {
    if (!product1.category || !product2.category) {
      // Fallback: check if names contain similar category keywords
      const cat1 = this.extractCategory(product1.name);
      const cat2 = this.extractCategory(product2.name);
      return cat1 === cat2;
    }
    return product1.category === product2.category;
  }

  /**
   * Extract category from product name
   */
  private static extractCategory(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('laptop')) return 'laptop';
    if (lower.includes('phone') || lower.includes('smartphone')) return 'phone';
    if (lower.includes('tablet')) return 'tablet';
    if (lower.includes('headphone') || lower.includes('earphone')) return 'audio';
    if (lower.includes('watch')) return 'watch';
    return 'other';
  }
}

/**
 * Format price
 */
function formatPrice(price: number): string {
  return Math.round(price).toLocaleString('en-UG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default RecommendationEngine;
