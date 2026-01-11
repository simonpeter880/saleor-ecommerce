/**
 * Product Comparison Page
 *
 * Full-page comparison view with:
 * - Side-by-side product specs
 * - Difference highlighting
 * - Share functionality
 * - Add more products
 * - Export comparison
 *
 * Expected Impact: Informed decisions, reduced returns
 */

import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Products | TechHub Electronics',
  description: 'Compare up to 4 products side-by-side to find the perfect match for your needs.',
};

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Compare Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compare specifications side-by-side to make an informed decision
          </p>
        </div>

        {/* Client Component */}
        <ComparePageClient />
      </div>
    </div>
  );
}

/**
 * Client component for comparison page
 * Separated to enable client-side hooks
 */
'use client';

import { useComparison } from '@/hooks/useComparison';
import { ComparisonTable } from '@/components/comparison/ComparisonTable';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function ComparePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, removeItem, clearAll, shareComparison, getShareableUrl } = useComparison();
  const [category, setCategory] = useState<string>();

  // Load products from URL if shared
  useEffect(() => {
    const ids = searchParams.get('ids');
    if (ids) {
      // TODO: Fetch products by IDs and add to comparison
      console.log('Loading comparison from URL:', ids);
    }
  }, [searchParams]);

  // Detect category from products
  useEffect(() => {
    if (items.length > 0) {
      const firstProductName = items[0].name.toLowerCase();
      if (firstProductName.includes('laptop')) setCategory('laptop');
      else if (firstProductName.includes('phone')) setCategory('smartphone');
      else if (firstProductName.includes('tablet')) setCategory('tablet');
    }
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12">
        <div className="text-center max-w-md mx-auto">
          <svg
            className="w-20 h-20 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No Products to Compare
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Browse our catalog and click "Add to Compare" on products you want to compare
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Comparing <span className="font-semibold text-gray-900 dark:text-gray-100">{items.length}</span> products
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Share Button */}
            <button
              onClick={shareComparison}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </button>

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print
            </button>

            {/* Clear All */}
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <ComparisonTable products={items} onRemove={removeItem} category={category} />

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Comparison Tips
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Green checkmarks indicate better specifications</li>
              <li>• Red crosses indicate worse specifications</li>
              <li>• Yellow highlights show different values between products</li>
              <li>• Click product names to view full details</li>
              <li>• Share this comparison with the share button above</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add More Products */}
      {items.length < 4 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Add More Products
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You can compare up to 4 products at once
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}
