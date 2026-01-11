/**
 * GraphQL Fragments for Query Optimization
 *
 * Reusable fragments to:
 * - Reduce query size
 * - Ensure consistency
 * - Improve maintainability
 * - Enable better caching
 */

/**
 * Basic product information for lists
 */
export const PRODUCT_LIST_FRAGMENT = `
  fragment ProductListItem on Product {
    id
    name
    slug
    thumbnail {
      url
      alt
    }
    pricing {
      priceRange {
        start {
          gross {
            amount
            currency
          }
        }
      }
    }
    category {
      id
      name
      slug
    }
  }
`;

/**
 * Full product details
 */
export const PRODUCT_DETAILS_FRAGMENT = `
  fragment ProductDetails on Product {
    id
    name
    slug
    description
    media {
      url
      alt
      type
    }
    pricing {
      priceRange {
        start {
          gross {
            amount
            currency
          }
        }
        stop {
          gross {
            amount
            currency
          }
        }
      }
      onSale
      discount {
        gross {
          amount
          currency
        }
      }
    }
    category {
      id
      name
      slug
      ancestors {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
    }
    variants {
      id
      name
      sku
      quantityAvailable
      pricing {
        price {
          gross {
            amount
            currency
          }
        }
      }
      attributes {
        attribute {
          id
          name
          slug
        }
        values {
          id
          name
          slug
        }
      }
    }
    metadata {
      key
      value
    }
  }
`;

/**
 * Category information
 */
export const CATEGORY_FRAGMENT = `
  fragment CategoryInfo on Category {
    id
    name
    slug
    description
    level
    parent {
      id
      name
      slug
    }
    ancestors {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;

/**
 * User information
 */
export const USER_FRAGMENT = `
  fragment UserInfo on User {
    id
    email
    firstName
    lastName
    isActive
    metadata {
      key
      value
    }
  }
`;

/**
 * Cart/Checkout line item
 */
export const CHECKOUT_LINE_FRAGMENT = `
  fragment CheckoutLine on CheckoutLine {
    id
    quantity
    variant {
      id
      name
      sku
      product {
        id
        name
        slug
        thumbnail {
          url
          alt
        }
      }
      pricing {
        price {
          gross {
            amount
            currency
          }
        }
      }
    }
    totalPrice {
      gross {
        amount
        currency
      }
    }
  }
`;

/**
 * Order information
 */
export const ORDER_FRAGMENT = `
  fragment OrderInfo on Order {
    id
    number
    created
    status
    total {
      gross {
        amount
        currency
      }
    }
    lines {
      id
      quantity
      variant {
        id
        name
        product {
          id
          name
          slug
          thumbnail {
            url
            alt
          }
        }
      }
      totalPrice {
        gross {
          amount
          currency
        }
      }
    }
    shippingAddress {
      firstName
      lastName
      streetAddress1
      city
      country {
        code
        country
      }
    }
  }
`;

/**
 * Review fragment
 */
export const REVIEW_FRAGMENT = `
  fragment ReviewInfo on ProductReview {
    id
    rating
    title
    content
    createdAt
    userName
    verified
    helpfulVotes
  }
`;

/**
 * Build GraphQL query with fragments
 */
export function buildQuery(query: string, fragments: string[] = []): string {
  return `
    ${fragments.join('\n\n')}

    ${query}
  `;
}

/**
 * Example usage:
 *
 * const query = buildQuery(`
 *   query GetProduct($slug: String!) {
 *     product(slug: $slug) {
 *       ...ProductDetails
 *     }
 *   }
 * `, [PRODUCT_DETAILS_FRAGMENT]);
 */
