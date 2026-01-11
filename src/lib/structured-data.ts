/**
 * Structured Data (Schema.org) Generators for SEO
 *
 * Generates JSON-LD structured data for various page types to improve search visibility
 * and enable rich snippets in search results.
 *
 * Expected Impact: +20-30% organic search traffic
 */

export interface Product {
  id: string;
  name: string;
  description?: string;
  slug: string;
  pricing?: {
    priceRange?: {
      start?: {
        gross: { amount: number; currency: string };
      };
      stop?: {
        amount: number;
        currency: string;
      };
    };
  };
  media?: Array<{ url: string; alt?: string }>;
  category?: {
    name: string;
    slug: string;
  };
  rating?: number;
  reviewCount?: number;
  variants?: Array<{
    id: string;
    name: string;
    pricing?: {
      price?: {
        gross: { amount: number; currency: string };
      };
    };
    quantityAvailable?: number;
  }>;
}

interface Review {
  id: string;
  rating: number;
  title?: string;
  content: string;
  author: string;
  createdAt: string;
  verified?: boolean;
}

interface Breadcrumb {
  name: string;
  url: string;
}

/**
 * Generate Organization schema for the site
 */
export function generateOrganizationSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TechHub Electronics',
    description: 'Your trusted source for electronics, smartphones, laptops, and tech accessories',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://facebook.com/techhub',
      'https://twitter.com/techhub',
      'https://instagram.com/techhub',
      'https://linkedin.com/company/techhub',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-TECH-HUB',
      contactType: 'Customer Service',
      availableLanguage: ['en'],
      areaServed: 'US',
    },
  };
}

/**
 * Generate Product schema for product pages
 * Includes: Product, Offer, AggregateRating, Review
 */
export function generateProductSchema(product: {
  id: string;
  name: string;
  description: string;
  images: string[];
  brand?: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  price: {
    amount: number;
    currency: string;
  };
  availability: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';
  condition?: 'NewCondition' | 'RefurbishedCondition' | 'UsedCondition';
  rating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  reviews?: Array<{
    author: string;
    datePublished: string;
    reviewBody: string;
    reviewRating: number;
  }>;
  url: string;
  name: string;
  description: string;
  image: string[];
  brand?: string;
  sku?: string;
  gtin?: string;
}): Record<string, any> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images,
    url: product.url,
  };

  // Add brand if available
  if (product.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: product.brand,
    };
  }

  // Add aggregate rating if reviews exist
  if (product.rating && product.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount || 0,
      bestRating: '5',
      worstRating: '1',
    };
  }

  // Add review snippets if available
  if (product.reviews && product.reviews.length > 0) {
    schema.review = product.reviews.slice(0, 5).map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.userName,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: review.content,
      datePublished: review.createdAt,
    }));
  }

  return schema;
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Generate Organization schema for the company
 * Used on homepage and footer
 */
export function generateOrganizationSchema(
  config: OrganizationConfig
): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    description: config.description,
    url: config.url,
    logo: config.logo,
    sameAs: config.socialMedia,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: config.phone,
      contactType: 'customer service',
      email: config.email,
      areaServed: 'US',
      availableLanguage: 'English',
    },
    address: config.address && {
      '@type': 'PostalAddress',
      streetAddress: config.address.street,
      addressLocality: config.address.city,
      addressRegion: config.address.state,
      postalCode: config.address.zip,
      addressCountry: 'US',
    },
  };
}

/**
 * Generate WebSite schema with search action
 * Used on homepage for site-wide search
 */
export function generateWebSiteSchema(
  config: WebSiteConfig
): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    description: config.description,
    url: config.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate FAQ schema for product Q&A sections
 */
export function generateFAQSchema(
  questions: Array<{ question: string; answer: string }>
): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.answer,
      },
    })),
  };
}

/**
 * Default site configuration
 * Override these values with your actual site information
 */
export const DEFAULT_SITE_CONFIG: OrganizationConfig = {
  name: 'TechHub Electronics',
  description: 'Your trusted source for premium electronics, smartphones, laptops, and accessories.',
  url: process.env.NEXT_PUBLIC_STOREFRONT_URL || 'https://techhub.com',
  logo: `${process.env.NEXT_PUBLIC_STOREFRONT_URL || 'https://techhub.com'}/logo.png`,
  socialMedia: [
    'https://facebook.com/techhub',
    'https://twitter.com/techhub',
    'https://instagram.com/techhub',
  ],
  phone: '+1-800-TECH-HUB',
  email: 'support@techhub.com',
  address: {
    street: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
  },
};
