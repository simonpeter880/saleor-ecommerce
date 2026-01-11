/**
 * Review System Types
 *
 * Complete type definitions for the review system:
 * - Review structure with photos
 * - Verified purchase badges
 * - Helpfulness voting
 * - Review filters and sorting
 * - Review statistics
 */

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  title: string;
  content: string;
  photos?: ReviewPhoto[];
  videos?: ReviewVideo[];
  pros?: string[];
  cons?: string[];
  isVerifiedPurchase: boolean;
  purchaseDate?: string;
  createdAt: string;
  updatedAt?: string;
  helpfulCount: number;
  notHelpfulCount: number;
  replies?: ReviewReply[];
  metadata?: {
    deviceUsed?: string;
    usageDuration?: string; // "1 week", "2 months", etc.
    recommendsProduct?: boolean;
  };
}

export interface ReviewPhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  uploadedAt: string;
}

export interface ReviewVideo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  uploadedAt: string;
}

export interface ReviewReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  isVendor: boolean;
  createdAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedPurchasePercentage: number;
  withPhotosPercentage: number;
  recommendationPercentage: number;
}

export interface ReviewFilters {
  rating?: number[];
  verified?: boolean;
  withPhotos?: boolean;
  withVideos?: boolean;
  sortBy?: 'helpful' | 'recent' | 'rating-high' | 'rating-low';
  search?: string;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
  photos?: File[];
  pros?: string[];
  cons?: string[];
  recommendsProduct?: boolean;
  usageDuration?: string;
}

export type ReviewSortOption =
  | 'helpful'
  | 'recent'
  | 'rating-high'
  | 'rating-low'
  | 'verified';

export default {
  Review,
  ReviewStats,
  ReviewFilters,
  ReviewFormData,
};
