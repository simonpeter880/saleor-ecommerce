/**
 * ReviewList Component
 *
 * Main review list with filtering and sorting:
 * - Filter by rating, verified, photos, videos
 * - Sort by helpful, recent, rating
 * - Search reviews
 * - Pagination
 * - Empty states
 *
 * Expected Impact: Easy review navigation, better UX
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Review, ReviewFilters as ReviewFiltersType, ReviewSortOption } from '@/lib/reviews/review-types';
import { processReviews } from '@/lib/reviews/review-utils';
import { ReviewCard } from './ReviewCard';

interface ReviewListProps {
  reviews: Review[];
  onVoteHelpful?: (reviewId: string, helpful: boolean) => void;
  onReply?: (reviewId: string) => void;
  perPage?: number;
}

export function ReviewList({
  reviews,
  onVoteHelpful,
  onReply,
  perPage = 10,
}: ReviewListProps) {
  const [filters, setFilters] = useState<ReviewFiltersType>({
    sortBy: 'helpful',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Process reviews (filter and sort)
  const processedReviews = useMemo(() => {
    return processReviews(reviews, filters);
  }, [reviews, filters]);

  // Paginate
  const totalPages = Math.ceil(processedReviews.length / perPage);
  const paginatedReviews = processedReviews.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Handle filter changes
  const handleRatingFilter = (rating: number) => {
    setFilters((prev) => {
      const currentRatings = prev.rating || [];
      const newRatings = currentRatings.includes(rating)
        ? currentRatings.filter((r) => r !== rating)
        : [...currentRatings, rating];

      return {
        ...prev,
        rating: newRatings.length > 0 ? newRatings : undefined,
      };
    });
    setCurrentPage(1);
  };

  const handleSortChange = (sortBy: ReviewSortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search: search || undefined }));
    setCurrentPage(1);
  };

  const toggleVerifiedFilter = () => {
    setFilters((prev) => ({ ...prev, verified: !prev.verified }));
    setCurrentPage(1);
  };

  const togglePhotosFilter = () => {
    setFilters((prev) => ({ ...prev, withPhotos: !prev.withPhotos }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ sortBy: 'helpful' });
    setCurrentPage(1);
  };

  const hasActiveFilters =
    (filters.rating && filters.rating.length > 0) ||
    filters.verified ||
    filters.withPhotos ||
    filters.search;

  if (reviews.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No reviews yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Be the first to share your experience with this product
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <select
              value={filters.sortBy || 'helpful'}
              onChange={(e) => handleSortChange(e.target.value as ReviewSortOption)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="helpful">Most Helpful</option>
              <option value="recent">Most Recent</option>
              <option value="rating-high">Highest Rated</option>
              <option value="rating-low">Lowest Rated</option>
              <option value="verified">Verified Purchases</option>
            </select>
          </div>

          {/* Filter Toggles */}
          <button
            onClick={toggleVerifiedFilter}
            className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
              filters.verified
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 text-gray-700 dark:text-gray-300'
            }`}
          >
            ✓ Verified Only
          </button>

          <button
            onClick={togglePhotosFilter}
            className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
              filters.withPhotos
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 text-gray-700 dark:text-gray-300'
            }`}
          >
            📷 With Photos
          </button>

          {/* More Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:border-primary-500 text-gray-700 dark:text-gray-300 transition-colors"
          >
            {showFilters ? 'Hide' : 'More'} Filters
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 dark:text-red-400 hover:underline ml-auto"
            >
              Clear all filters
            </button>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400 ml-auto">
            Showing {processedReviews.length} of {reviews.length} reviews
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Rating:
              </label>
              <div className="flex flex-wrap gap-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingFilter(rating)}
                    className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
                      filters.rating?.includes(rating)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {rating} ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Reviews:
              </label>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search in reviews..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        )}
      </div>

      {/* Reviews */}
      {processedReviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No reviews match your filters. Try adjusting your criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onVoteHelpful={onVoteHelpful}
              onReply={onReply}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Show first, last, current, and adjacent pages
              return (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              );
            })
            .map((page, index, arr) => {
              // Add ellipsis
              if (index > 0 && page - arr[index - 1] > 1) {
                return (
                  <React.Fragment key={`ellipsis-${page}`}>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {page}
                </button>
              );
            })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewList;
