/**
 * ProductSpecifications Component
 *
 * Displays detailed product specifications in an organized table format
 * Parses metadata from Saleor products into category-specific specs
 */

'use client';

import React, { useState } from 'react';
import { parseProductSpecifications, type ParsedSpecifications } from '@/lib/specifications-parser';

interface ProductSpecificationsProps {
  metadata: Record<string, string>;
  productType?: string;
}

export function ProductSpecifications({ metadata, productType }: ProductSpecificationsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general']));

  const specifications = parseProductSpecifications(metadata, productType);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const renderSpecSection = (key: string, section: ParsedSpecifications[keyof ParsedSpecifications]) => {
    if (!section || section.specs.length === 0) return null;

    const isExpanded = expandedSections.has(key);

    return (
      <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
        <button
          onClick={() => toggleSection(key)}
          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-750 transition"
        >
          <h3 className="text-lg font-semibold">{section.category}</h3>
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="bg-white dark:bg-gray-900">
            <table className="w-full">
              <tbody>
                {section.specs.map((spec, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-300 w-1/3">
                      {spec.label}
                    </td>
                    <td className="px-6 py-3 text-gray-900 dark:text-gray-100">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>

      {renderSpecSection('general', specifications.general)}
      {renderSpecSection('technical', specifications.technical)}
      {renderSpecSection('physical', specifications.physical)}
      {renderSpecSection('warranty', specifications.warranty)}

      {/* Additional Information */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Need Help?
        </h4>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Have questions about specifications? <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact our expert team</a> for detailed information.
        </p>
      </div>
    </div>
  );
}

export default ProductSpecifications;
