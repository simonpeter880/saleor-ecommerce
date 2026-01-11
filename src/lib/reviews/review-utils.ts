/**
 * Review Utilities
 *
 * Helper functions for review system:
 * - Calculate review statistics
 * - Filter and sort reviews
 * - Validate review data
 * - Format review dates
 */

import { Review, ReviewStats, ReviewFilters, ReviewSortOption } from './review-types';

/**
 * Calculate review statistics
 */
export function calculateReviewStats(reviews: Review[]): ReviewStats {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      verifiedPurchasePercentage: 0,
      withPhotosPercentage: 0,
      recommendationPercentage: 0,
    };
  }

  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  // Calculate rating distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((review) => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
  });

  // Calculate percentages
  const verifiedCount = reviews.filter((r) => r.isVerifiedPurchase).length;
  const withPhotosCount = reviews.filter((r) => r.photos && r.photos.length > 0).length;
  const recommendsCount = reviews.filter((r) => r.metadata?.recommendsProduct === true).length;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
    ratingDistribution,
    verifiedPurchasePercentage: Math.round((verifiedCount / reviews.length) * 100),
    withPhotosPercentage: Math.round((withPhotosCount / reviews.length) * 100),
    recommendationPercentage: Math.round((recommendsCount / reviews.length) * 100),
  };
}

/**
 * Filter reviews based on criteria
 */
export function filterReviews(reviews: Review[], filters: ReviewFilters): Review[] {
  let filtered = [...reviews];

  // Filter by rating
  if (filters.rating && filters.rating.length > 0) {
    filtered = filtered.filter((review) => filters.rating!.includes(review.rating));
  }

  // Filter by verified purchase
  if (filters.verified === true) {
    filtered = filtered.filter((review) => review.isVerifiedPurchase);
  }

  // Filter by photos
  if (filters.withPhotos === true) {
    filtered = filtered.filter((review) => review.photos && review.photos.length > 0);
  }

  // Filter by videos
  if (filters.withVideos === true) {
    filtered = filtered.filter((review) => review.videos && review.videos.length > 0);
  }

  // Filter by search query
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      (review) =>
        review.title.toLowerCase().includes(query) ||
        review.content.toLowerCase().includes(query) ||
        review.userName.toLowerCase().includes(query)
    );
  }

  return filtered;
}

/**
 * Sort reviews
 */
export function sortReviews(reviews: Review[], sortBy: ReviewSortOption): Review[] {
  const sorted = [...reviews];

  switch (sortBy) {
    case 'helpful':
      return sorted.sort((a, b) => {
        const aScore = a.helpfulCount - a.notHelpfulCount;
        const bScore = b.helpfulCount - b.notHelpfulCount;
        return bScore - aScore;
      });

    case 'recent':
      return sorted.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    case 'rating-high':
      return sorted.sort((a, b) => b.rating - a.rating);

    case 'rating-low':
      return sorted.sort((a, b) => a.rating - b.rating);

    case 'verified':
      return sorted.sort((a, b) => {
        if (a.isVerifiedPurchase && !b.isVerifiedPurchase) return -1;
        if (!a.isVerifiedPurchase && b.isVerifiedPurchase) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    default:
      return sorted;
  }
}

/**
 * Apply filters and sorting to reviews
 */
export function processReviews(
  reviews: Review[],
  filters: ReviewFilters
): Review[] {
  let processed = filterReviews(reviews, filters);

  if (filters.sortBy) {
    processed = sortReviews(processed, filters.sortBy);
  }

  return processed;
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
    }
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
}

/**
 * Format absolute date (e.g., "January 15, 2024")
 */
export function formatAbsoluteDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Validate review data
 */
export function validateReviewData(data: {
  rating: number;
  title: string;
  content: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate rating
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.push('Rating must be between 1 and 5 stars');
  }

  // Validate title
  if (!data.title || data.title.trim().length < 5) {
    errors.push('Title must be at least 5 characters');
  } else if (data.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  // Validate content
  if (!data.content || data.content.trim().length < 20) {
    errors.push('Review content must be at least 20 characters');
  } else if (data.content.length > 5000) {
    errors.push('Review content must be less than 5000 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate helpfulness score
 */
export function calculateHelpfulnessScore(review: Review): number {
  const total = review.helpfulCount + review.notHelpfulCount;
  if (total === 0) return 0;

  return (review.helpfulCount / total) * 100;
}

/**
 * Check if review is recent (within last 30 days)
 */
export function isRecentReview(review: Review): boolean {
  const reviewDate = new Date(review.createdAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return reviewDate >= thirtyDaysAgo;
}

/**
 * Get review summary text
 */
export function getReviewSummary(stats: ReviewStats): string {
  if (stats.totalReviews === 0) {
    return 'No reviews yet';
  }

  const avgRating = stats.averageRating.toFixed(1);
  const total = stats.totalReviews;
  const unit = total === 1 ? 'review' : 'reviews';

  return `${avgRating} out of 5 stars (${total} ${unit})`;
}

/**
 * Get rating percentage for distribution bar
 */
export function getRatingPercentage(
  count: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}

export default {
  calculateReviewStats,
  filterReviews,
  sortReviews,
  processReviews,
  formatRelativeTime,
  formatAbsoluteDate,
  validateReviewData,
  calculateHelpfulnessScore,
  isRecentReview,
  getReviewSummary,
  getRatingPercentage,
};
