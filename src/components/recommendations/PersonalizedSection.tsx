/**
 * PersonalizedSection Component
 *
 * Homepage section with personalized product recommendations:
 * - Based on browsing history
 * - "Continue Shopping" for recently viewed
 * - "Recommended for You"
 * - Category-specific suggestions
 * - New arrivals in preferred categories
 *
 * Expected Impact: +35% homepage engagement, +20% return visitors
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductRecommendations } from './ProductRecommendations';
import { Recommendation } from '@/lib/recommendations/engine';

interface PersonalizedSectionProps {
  userId?: string;
}

export function PersonalizedSection({ userId }: PersonalizedSectionProps) {
  const [recommendations, setRecommendations] = useState<{
    recentlyViewed: Recommendation[];
    forYou: Recommendation[];
    trending: Recommendation[];
    newArrivals: Recommendation[];
  }>({
    recentlyViewed: [],
    forYou: [],
    trending: [],
    newArrivals: [],
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    setLoading(true);

    try {
      // Load recently viewed from localStorage
      const recentlyViewed = getRecentlyViewedProducts();

      // Load personalized recommendations
      // In production, this would call your API
      const forYou = await fetchPersonalizedRecommendations(userId);
      const trending = await fetchTrendingProducts();
      const newArrivals = await fetchNewArrivals();

      setRecommendations({
        recentlyViewed,
        forYou,
        trending,
        newArrivals,
      });

      // Load user name if authenticated
      if (userId) {
        const user = await fetchUserProfile(userId);
        setUserName(user?.firstName);
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasAnyRecommendations =
    recommendations.recentlyViewed.length > 0 ||
    recommendations.forYou.length > 0 ||
    recommendations.trending.length > 0 ||
    recommendations.newArrivals.length > 0;

  if (!loading && !hasAnyRecommendations) {
    return null;
  }

  return (
    <div className="space-y-12">
      {/* Welcome Message */}
      {userName && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-primary-200 dark:border-primary-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, {userName}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here are some personalized recommendations just for you
          </p>
        </div>
      )}

      {/* Recently Viewed */}
      {recommendations.recentlyViewed.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Continue Shopping
            </h2>
            <button
              onClick={clearRecentlyViewed}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Clear history
            </button>
          </div>
          <ProductRecommendations
            title=""
            recommendations={recommendations.recentlyViewed}
            variant="carousel"
            showReason={false}
            loading={loading}
          />
        </section>
      )}

      {/* Personalized Recommendations */}
      {recommendations.forYou.length > 0 && (
        <section>
          <ProductRecommendations
            title={userName ? `Picked for ${userName}` : 'Recommended for You'}
            recommendations={recommendations.forYou}
            variant="carousel"
            showReason={true}
            loading={loading}
          />
        </section>
      )}

      {/* Trending Products */}
      {recommendations.trending.length > 0 && (
        <section>
          <ProductRecommendations
            title="🔥 Trending Now"
            recommendations={recommendations.trending}
            variant="carousel"
            showReason={true}
            loading={loading}
          />
        </section>
      )}

      {/* New Arrivals */}
      {recommendations.newArrivals.length > 0 && (
        <section>
          <ProductRecommendations
            title="🆕 New Arrivals"
            recommendations={recommendations.newArrivals}
            variant="carousel"
            showReason={false}
            loading={loading}
          />
        </section>
      )}

      {/* Category Quick Links */}
      <CategoryQuickLinks />
    </div>
  );
}

/**
 * Category quick links based on user preferences
 */
function CategoryQuickLinks() {
  const categories = [
    { slug: 'laptops', name: 'Laptops', icon: '💻', color: 'from-blue-500 to-blue-600' },
    { slug: 'smartphones', name: 'Smartphones', icon: '📱', color: 'from-purple-500 to-purple-600' },
    { slug: 'tablets', name: 'Tablets', icon: '📱', color: 'from-green-500 to-green-600' },
    { slug: 'audio', name: 'Audio', icon: '🎧', color: 'from-orange-500 to-orange-600' },
    { slug: 'accessories', name: 'Accessories', icon: '🔌', color: 'from-pink-500 to-pink-600' },
    { slug: 'gaming', name: 'Gaming', icon: '🎮', color: 'from-red-500 to-red-600' },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group"
          >
            <div className={`bg-gradient-to-br ${category.color} rounded-lg p-6 text-center hover:scale-105 transition-transform`}>
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="text-white font-semibold">{category.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Get recently viewed products from localStorage
 */
function getRecentlyViewedProducts(): Recommendation[] {
  try {
    const stored = localStorage.getItem('recently_viewed');
    if (!stored) return [];

    const products = JSON.parse(stored);
    return products.slice(0, 8).map((product: any) => ({
      product,
      score: 1,
      reason: 'personalized' as const,
      reasonText: 'Recently viewed',
    }));
  } catch (error) {
    console.error('Failed to load recently viewed:', error);
    return [];
  }
}

/**
 * Clear recently viewed history
 */
function clearRecentlyViewed() {
  if (confirm('Clear your browsing history?')) {
    localStorage.removeItem('recently_viewed');
    window.location.reload();
  }
}

/**
 * Fetch personalized recommendations (mock implementation)
 */
async function fetchPersonalizedRecommendations(userId?: string): Promise<Recommendation[]> {
  // TODO: Replace with actual API call
  // In production, this would call your recommendation API endpoint
  // that uses the RecommendationEngine
  return [];
}

/**
 * Fetch trending products (mock implementation)
 */
async function fetchTrendingProducts(): Promise<Recommendation[]> {
  // TODO: Replace with actual API call
  return [];
}

/**
 * Fetch new arrivals (mock implementation)
 */
async function fetchNewArrivals(): Promise<Recommendation[]> {
  // TODO: Replace with actual API call
  return [];
}

/**
 * Fetch user profile (mock implementation)
 */
async function fetchUserProfile(userId: string): Promise<{ firstName: string } | null> {
  // TODO: Replace with actual API call
  return null;
}

export default PersonalizedSection;
