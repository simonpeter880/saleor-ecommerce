/**
 * WarrantyInfo Component
 *
 * Displays warranty and return policy information
 * Builds trust by clearly communicating product guarantees
 */

'use client';

import React from 'react';
import { getWarrantyInfo, getReturnPolicy } from '@/lib/specifications-parser';

interface WarrantyInfoProps {
  metadata?: Record<string, string>;
}

export function WarrantyInfo({ metadata = {} }: WarrantyInfoProps) {
  const warranty = getWarrantyInfo(metadata);
  const returnPolicy = getReturnPolicy();

  return (
    <div className="space-y-6">
      {/* Warranty Information */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Warranty Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-32">Duration:</span>
                <span className="text-gray-900 dark:text-gray-100">{warranty.duration}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-32">Type:</span>
                <span className="text-gray-900 dark:text-gray-100">{warranty.type}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-32">Coverage:</span>
                <span className="text-gray-900 dark:text-gray-100">{warranty.coverage}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-32">Support:</span>
                <span className="text-gray-900 dark:text-gray-100">{warranty.support}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All products come with a manufacturer warranty covering hardware defects and malfunctions.
            Extended warranty options available at checkout.
          </p>
        </div>
      </div>

      {/* Return Policy */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Return Policy</h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-32">Period:</span>
                <span className="text-gray-900 dark:text-gray-100">{returnPolicy.period}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-32">Condition:</span>
                <span className="text-gray-900 dark:text-gray-100">{returnPolicy.condition}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-32">Shipping:</span>
                <span className="text-gray-900 dark:text-gray-100">{returnPolicy.process}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-32">Refund:</span>
                <span className="text-gray-900 dark:text-gray-100">{returnPolicy.refund}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Not satisfied? Return your product within 30 days for a full refund.
            <a href="/returns" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
              Learn more about our return policy
            </a>
          </p>
        </div>
      </div>

      {/* Authenticity Guarantee */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6">
        <div className="flex items-center mb-3">
          <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-lg font-semibold">100% Authenticity Guaranteed</h3>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          All products are sourced directly from authorized distributors and manufacturers.
          We guarantee genuine products with valid serial numbers and full warranty coverage.
        </p>
      </div>
    </div>
  );
}

export default WarrantyInfo;
