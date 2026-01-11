/**
 * StructuredData Component
 *
 * Renders JSON-LD structured data for SEO
 * This component should be included in pages that need rich snippets in search results
 */

'use client';

import React from 'react';

interface StructuredDataProps {
  data: Record<string, any> | Record<string, any>[];
}

/**
 * Client component that renders JSON-LD structured data
 * Can accept single schema object or array of schemas
 */
export function StructuredData({ data }: StructuredDataProps) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
        />
      ))}
    </>
  );
}

export default StructuredData;
