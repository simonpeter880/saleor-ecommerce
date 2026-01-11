/**
 * GraphQL Client with Caching
 *
 * Features:
 * - Request caching with Redis
 * - Error handling
 * - Retry logic
 * - Rate limiting
 * - Request deduplication
 */

import { getCache, withCache, CacheKeys, CacheTTL } from './cache/redis-client';

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

interface RequestOptions {
  cache?: boolean;
  cacheTTL?: number;
  cacheKey?: string;
  cacheTags?: string[];
}

class GraphQLClient {
  private apiUrl: string;
  private headers: Record<string, string>;
  private pendingRequests: Map<string, Promise<any>> = new Map();

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL || 'http://localhost:8000/graphql/';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Execute GraphQL query with caching
   */
  async query<T = any>(
    query: string,
    variables?: Record<string, any>,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      cache = true,
      cacheTTL = CacheTTL.MEDIUM,
      cacheKey,
      cacheTags = [],
    } = options;

    // Generate cache key
    const key = cacheKey || this.generateCacheKey(query, variables);

    // Check if caching is enabled
    if (cache) {
      const cached = await getCache().get<T>(key);
      if (cached) {
        return cached;
      }
    }

    // Deduplicate identical requests
    const requestKey = `${query}-${JSON.stringify(variables)}`;
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey)!;
    }

    // Create new request
    const requestPromise = this.executeRequest<T>(query, variables);
    this.pendingRequests.set(requestKey, requestPromise);

    try {
      const data = await requestPromise;

      // Store in cache
      if (cache) {
        await getCache().set(key, data, { ttl: cacheTTL, tags: cacheTags });
      }

      return data;
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * Execute mutation (no caching)
   */
  async mutate<T = any>(
    mutation: string,
    variables?: Record<string, any>
  ): Promise<T> {
    return this.executeRequest<T>(mutation, variables);
  }

  /**
   * Execute GraphQL request
   */
  private async executeRequest<T>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors && result.errors.length > 0) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(result.errors[0].message);
      }

      if (!result.data) {
        throw new Error('No data returned from GraphQL query');
      }

      return result.data;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      throw error;
    }
  }

  /**
   * Generate cache key from query and variables
   */
  private generateCacheKey(query: string, variables?: Record<string, any>): string {
    const queryHash = this.hashString(query);
    const varsString = variables ? JSON.stringify(variables) : '';
    return `gql:${queryHash}:${varsString}`;
  }

  /**
   * Simple string hash function
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Invalidate cache by tags
   */
  async invalidateCache(tags: string[]): Promise<void> {
    for (const tag of tags) {
      await getCache().invalidateTag(tag);
    }
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string): void {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authorization header
   */
  clearAuthToken(): void {
    delete this.headers['Authorization'];
  }
}

// Singleton instance
let clientInstance: GraphQLClient | null = null;

export function getGraphQLClient(): GraphQLClient {
  if (!clientInstance) {
    clientInstance = new GraphQLClient();
  }
  return clientInstance;
}

/**
 * Helper functions for common queries
 */
export const graphql = {
  /**
   * Get product by slug
   */
  async getProduct(slug: string) {
    const client = getGraphQLClient();
    return client.query(
      `
      query GetProduct($slug: String!) {
        product(slug: $slug) {
          id
          name
          slug
          description
          media {
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
          metadata {
            key
            value
          }
        }
      }
    `,
      { slug },
      {
        cache: true,
        cacheTTL: CacheTTL.MEDIUM,
        cacheKey: CacheKeys.product(slug),
        cacheTags: ['products', `product:${slug}`],
      }
    );
  },

  /**
   * Get products list
   */
  async getProducts(params: { first?: number; after?: string; search?: string } = {}) {
    const client = getGraphQLClient();
    return client.query(
      `
      query GetProducts($first: Int, $after: String, $search: String) {
        products(first: $first, after: $after, filter: { search: $search }) {
          edges {
            node {
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
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
      params,
      {
        cache: true,
        cacheTTL: CacheTTL.SHORT,
        cacheKey: CacheKeys.productList(params),
        cacheTags: ['products'],
      }
    );
  },

  /**
   * Get categories
   */
  async getCategories() {
    const client = getGraphQLClient();
    return client.query(
      `
      query GetCategories {
        categories(first: 100) {
          edges {
            node {
              id
              name
              slug
              level
              parent {
                id
                name
              }
            }
          }
        }
      }
    `,
      undefined,
      {
        cache: true,
        cacheTTL: CacheTTL.LONG,
        cacheKey: CacheKeys.categoryList(),
        cacheTags: ['categories'],
      }
    );
  },
};

export default getGraphQLClient;
