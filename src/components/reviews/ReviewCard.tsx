/**
 * ReviewCard Component
 *
 * Individual review display with:
 * - Star rating and verified badge
 * - Review title and content
 * - Photo gallery with lightbox
 * - Pros and cons lists
 * - Helpfulness voting
 * - Reply system
 * - Expand/collapse for long reviews
 *
 * Expected Impact: Rich review display, builds trust
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Review } from '@/lib/reviews/review-types';
import { formatRelativeTime, formatAbsoluteDate } from '@/lib/reviews/review-utils';

interface ReviewCardProps {
  review: Review;
  onVoteHelpful?: (reviewId: string, helpful: boolean) => void;
  onReply?: (reviewId: string) => void;
  showProduct?: boolean;
}

export function ReviewCard({
  review,
  onVoteHelpful,
  onReply,
  showProduct = false,
}: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const needsExpansion = review.content.length > 500;
  const displayContent = expanded || !needsExpansion
    ? review.content
    : review.content.slice(0, 500) + '...';

  const visiblePhotos = showAllPhotos ? review.photos : review.photos?.slice(0, 4);
  const remainingPhotos = review.photos ? review.photos.length - 4 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {/* User Avatar */}
          <div className="relative w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 overflow-hidden">
            {review.userAvatar ? (
              <Image src={review.userAvatar} alt={review.userName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold">
                {review.userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {review.userName}
              </span>
              {review.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatRelativeTime(review.createdAt)}
              {review.metadata?.usageDuration && (
                <> • Used for {review.metadata.usageDuration}</>
              )}
            </div>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-5 h-5 ${
                star <= review.rating
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Review Title */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {review.title}
        </h4>
      </div>

      {/* Review Content */}
      <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {displayContent}
        {needsExpansion && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary-600 dark:text-primary-400 hover:underline ml-2"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Pros and Cons */}
      {(review.pros || review.cons) && (
        <div className="grid md:grid-cols-2 gap-4">
          {review.pros && review.pros.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-green-900 dark:text-green-100">Pros</span>
              </div>
              <ul className="space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index} className="text-sm text-green-800 dark:text-green-200">
                    • {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {review.cons && review.cons.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-red-900 dark:text-red-100">Cons</span>
              </div>
              <ul className="space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index} className="text-sm text-red-800 dark:text-red-200">
                    • {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-2">
            {visiblePhotos?.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className="relative w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
              >
                <Image
                  src={photo.thumbnailUrl || photo.url}
                  alt={photo.caption || `Review photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
            {!showAllPhotos && remainingPhotos > 0 && (
              <button
                onClick={() => setShowAllPhotos(true)}
                className="w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="text-center">
                  <div className="text-xl font-bold">+{remainingPhotos}</div>
                  <div className="text-xs">more</div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recommendation Badge */}
      {review.metadata?.recommendsProduct && (
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Recommends this product
          </span>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        {/* Helpfulness Voting */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Was this helpful?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onVoteHelpful?.(review.id, true)}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>Yes ({review.helpfulCount})</span>
            </button>
            <button
              onClick={() => onVoteHelpful?.(review.id, false)}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
              </svg>
              <span>No ({review.notHelpfulCount})</span>
            </button>
          </div>
        </div>

        {/* Reply Button */}
        {onReply && (
          <button
            onClick={() => onReply(review.id)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Reply
          </button>
        )}
      </div>

      {/* Replies */}
      {review.replies && review.replies.length > 0 && (
        <div className="pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
          {review.replies.map((reply) => (
            <div key={reply.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="relative w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 overflow-hidden">
                  {reply.userAvatar ? (
                    <Image src={reply.userAvatar} alt={reply.userName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-xs font-semibold">
                      {reply.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {reply.userName}
                    </span>
                    {reply.isVendor && (
                      <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 text-xs font-medium rounded">
                        Vendor
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Lightbox */}
      {selectedPhotoIndex !== null && review.photos && (
        <PhotoLightbox
          photos={review.photos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </div>
  );
}

/**
 * Photo lightbox for full-size viewing
 */
function PhotoLightbox({
  photos,
  initialIndex,
  onClose,
}: {
  photos: { id: string; url: string; caption?: string }[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentPhoto = photos[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous Button */}
      {photos.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div className="relative max-w-4xl max-h-[80vh] w-full">
        <img
          src={currentPhoto.url}
          alt={currentPhoto.caption || `Photo ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
        {currentPhoto.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
            {currentPhoto.caption}
          </div>
        )}
      </div>

      {/* Next Button */}
      {photos.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
}

export default ReviewCard;
