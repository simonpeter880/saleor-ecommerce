/**
 * PriceHistogram Component
 *
 * Visual price distribution chart that helps users:
 * - Understand price ranges in category
 * - Identify sweet spots
 * - Make informed budget decisions
 *
 * Expected Impact: Better price filtering, +10% filter usage
 */

'use client';

import React, { useMemo } from 'react';

interface PriceHistogramProps {
  products: Array<{ pricing?: { priceRange?: { start?: { gross?: { amount: number } } } } }>;
  selectedRange?: [number, number];
  onRangeSelect?: (min: number, max: number) => void;
  bins?: number;
}

export function PriceHistogram({
  products,
  selectedRange,
  onRangeSelect,
  bins = 10,
}: PriceHistogramProps) {
  // Calculate histogram data
  const histogramData = useMemo(() => {
    // Extract prices
    const prices = products
      .map((p) => p.pricing?.priceRange?.start?.gross?.amount || 0)
      .filter((price) => price > 0);

    if (prices.length === 0) {
      return { bins: [], min: 0, max: 10000000, binSize: 1000000 };
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const binSize = (max - min) / bins;

    // Create bins
    const histogram = new Array(bins).fill(0);
    prices.forEach((price) => {
      const binIndex = Math.min(Math.floor((price - min) / binSize), bins - 1);
      histogram[binIndex]++;
    });

    // Calculate bin ranges and percentages
    const maxCount = Math.max(...histogram);
    const binsData = histogram.map((count, index) => ({
      count,
      percentage: (count / maxCount) * 100,
      min: min + index * binSize,
      max: min + (index + 1) * binSize,
      selected: false,
    }));

    // Mark selected bins
    if (selectedRange) {
      binsData.forEach((bin) => {
        if (bin.min >= selectedRange[0] && bin.max <= selectedRange[1]) {
          bin.selected = true;
        }
      });
    }

    return { bins: binsData, min, max, binSize };
  }, [products, selectedRange, bins]);

  // Handle bin click
  const handleBinClick = (binMin: number, binMax: number) => {
    if (onRangeSelect) {
      onRangeSelect(Math.floor(binMin), Math.ceil(binMax));
    }
  };

  if (histogramData.bins.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Price Distribution
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {formatPrice(histogramData.min)} - {formatPrice(histogramData.max)} UGX
        </div>
      </div>

      {/* Histogram */}
      <div className="relative h-32 flex items-end gap-1">
        {histogramData.bins.map((bin, index) => (
          <button
            key={index}
            onClick={() => handleBinClick(bin.min, bin.max)}
            className={`flex-1 group relative transition-all duration-200 ${
              bin.selected
                ? 'bg-primary-500 hover:bg-primary-600'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-400 dark:hover:bg-primary-500'
            }`}
            style={{ height: `${bin.percentage}%` }}
            title={`${formatPrice(bin.min)} - ${formatPrice(bin.max)}: ${bin.count} product${
              bin.count !== 1 ? 's' : ''
            }`}
          >
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded px-2 py-1 whitespace-nowrap">
                <div className="font-semibold">{bin.count} products</div>
                <div>
                  {formatPrice(bin.min)} - {formatPrice(bin.max)}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Lower price</span>
        <span>Click bars to filter</span>
        <span>Higher price</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">Lowest</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {formatPrice(histogramData.min)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">Average</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {formatPrice((histogramData.min + histogramData.max) / 2)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">Highest</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {formatPrice(histogramData.max)}
          </div>
        </div>
      </div>

      {/* Price sweet spots */}
      <PriceSweetSpots bins={histogramData.bins} />
    </div>
  );
}

/**
 * Show price sweet spots (bins with most products)
 */
function PriceSweetSpots({
  bins,
}: {
  bins: Array<{ count: number; min: number; max: number }>;
}) {
  const topBins = useMemo(() => {
    return [...bins]
      .sort((a, b) => b.count - a.count)
      .slice(0, 2)
      .filter((bin) => bin.count > 0);
  }, [bins]);

  if (topBins.length === 0) return null;

  return (
    <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <div className="flex-1 text-sm">
          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Popular Price Ranges
          </div>
          <div className="space-y-1 text-gray-700 dark:text-gray-300">
            {topBins.map((bin, index) => (
              <div key={index}>
                {formatPrice(bin.min)} - {formatPrice(bin.max)} ({bin.count} products)
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Format price with thousands separator
 */
function formatPrice(price: number): string {
  return Math.round(price).toLocaleString('en-UG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default PriceHistogram;
