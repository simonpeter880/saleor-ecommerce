/**
 * ComparisonTable Component
 *
 * Side-by-side product comparison with:
 * - Spec-by-spec comparison
 * - Difference highlighting (green=better, red=worse)
 * - Category grouping
 * - Sticky headers
 * - Mobile-responsive horizontal scroll
 *
 * Expected Impact: Informed purchase decisions, +20% conversion
 */

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { compareProducts, ComparisonDifference } from '@/lib/comparison/spec-differ';
import { ComparisonProduct } from '@/hooks/useComparison';

interface ComparisonTableProps {
  products: ComparisonProduct[];
  onRemove: (productId: string) => void;
  category?: string;
}

export function ComparisonTable({ products, onRemove, category }: ComparisonTableProps) {
  // Generate comparison data
  const comparison = useMemo(() => {
    return compareProducts(products, category);
  }, [products, category]);

  // Group by category
  const groupedComparison = useMemo(() => {
    const groups = new Map<string, ComparisonDifference[]>();

    comparison.forEach((diff) => {
      const existing = groups.get(diff.category) || [];
      groups.set(diff.category, [...existing, diff]);
    });

    return Array.from(groups.entries());
  }, [comparison]);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No Products to Compare
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Add products from catalog to start comparing
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Mobile warning */}
      <div className="md:hidden p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>Swipe left/right to view all products</span>
        </div>
      </div>

      {/* Scrollable container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          {/* Product Headers */}
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <tr>
              <th className="p-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-48">
                Specification
              </th>
              {products.map((product) => (
                <th key={product.id} className="p-4 text-center w-56">
                  <div className="space-y-3">
                    {/* Product Image */}
                    <div className="relative w-32 h-32 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Product Name */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="block text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2"
                    >
                      {product.name}
                    </Link>

                    {/* Price */}
                    {product.price && (
                      <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(product.price, product.currency)}
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemove(product.id)}
                      className="text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Specifications */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {groupedComparison.map(([categoryName, diffs]) => (
              <React.Fragment key={categoryName}>
                {/* Category Header */}
                <tr className="bg-gray-100 dark:bg-gray-900">
                  <td
                    colSpan={products.length + 1}
                    className="p-3 text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase"
                  >
                    {formatCategoryName(categoryName)}
                  </td>
                </tr>

                {/* Specs in Category */}
                {diffs.map((diff) => (
                  <tr
                    key={diff.key}
                    className={diff.isDifferent ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}
                  >
                    <td className="p-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {diff.label}
                      {diff.isDifferent && (
                        <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">
                          ⚡ Different
                        </span>
                      )}
                    </td>
                    {diff.values.map((value) => (
                      <td
                        key={value.productId}
                        className={`p-4 text-center text-sm ${getStatusColor(value.status)}`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {value.status === 'better' && (
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {value.status === 'worse' && (
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          <span className="font-medium">{value.value}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">Better</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">Worse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-100 dark:bg-yellow-900/20 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Different values</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Get color classes based on status
 */
function getStatusColor(status: 'better' | 'worse' | 'neutral'): string {
  switch (status) {
    case 'better':
      return 'text-green-900 dark:text-green-100 font-semibold';
    case 'worse':
      return 'text-red-900 dark:text-red-100';
    case 'neutral':
    default:
      return 'text-gray-900 dark:text-gray-100';
  }
}

/**
 * Format category name for display
 */
function formatCategoryName(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format price with currency
 */
function formatPrice(price: number, currency: string = 'UGX'): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default ComparisonTable;
