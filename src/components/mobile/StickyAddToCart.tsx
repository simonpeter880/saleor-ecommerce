/**
 * StickyAddToCart Component
 *
 * Sticky bottom bar on product pages for mobile
 * Always visible for quick add to cart action
 *
 * Expected Impact: +15-20% mobile conversion
 */

'use client';

import React, { useState, useEffect } from 'react';

interface StickyAddToCartProps {
  productName: string;
  price: number;
  currency: string;
  inStock: boolean;
  onAddToCart: () => void;
  isLoading?: boolean;
}

export function StickyAddToCart({
  productName,
  price,
  currency,
  inStock,
  onAddToCart,
  isLoading = false,
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled past the product image/details
      const scrollThreshold = 400; // Adjust based on your layout
      const shouldShow = window.scrollY > scrollThreshold;

      setHasScrolledPast(shouldShow);
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatPrice = (amount: number, curr: string) => {
    if (curr === 'UGX') {
      return new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: curr,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
    }).format(amount);
  };

  if (!hasScrolledPast) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden z-40 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {productName}
            </div>
            <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(price, currency)}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={onAddToCart}
            disabled={!inStock || isLoading}
            className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold transition-all ${
              !inStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isLoading
                ? 'bg-primary-400 text-white cursor-wait'
                : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding...
              </span>
            ) : !inStock ? (
              'Out of Stock'
            ) : (
              <>
                <svg
                  className="w-5 h-5 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Floating Action Button (FAB) variant
 * Alternative to sticky bar for a more minimal approach
 */
export function FloatingAddToCartButton({
  inStock,
  onAddToCart,
  isLoading = false,
}: {
  inStock: boolean;
  onAddToCart: () => void;
  isLoading?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 400;
      setIsVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={onAddToCart}
      disabled={!inStock || isLoading}
      className={`fixed bottom-20 right-4 md:hidden z-40 p-4 rounded-full shadow-lg transition-all ${
        !inStock
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-primary-600 hover:bg-primary-700 active:scale-90'
      } ${isVisible ? 'scale-100' : 'scale-0'}`}
      aria-label="Add to cart"
    >
      {isLoading ? (
        <svg
          className="animate-spin h-6 w-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      )}
    </button>
  );
}

export default StickyAddToCart;
