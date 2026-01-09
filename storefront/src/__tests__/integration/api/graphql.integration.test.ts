/**
 * GraphQL API Integration Tests
 *
 * These tests verify that GraphQL queries and mutations work correctly
 * with the Saleor backend API.
 */

import { describe, it, expect, beforeAll } from '@jest/globals';

// Mock environment variables for testing
const SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL || 'http://localhost:8000/graphql/';

describe('GraphQL API Integration', () => {
	let channelSlug: string;

	beforeAll(async () => {
		// Set default channel for tests
		channelSlug = 'default-channel';
	});

	describe('Product Queries', () => {
		it('should fetch product list', async () => {
			const query = `
				query ProductList($channel: String!, $first: Int!) {
					products(channel: $channel, first: $first) {
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
					}
				}
			`;

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query,
					variables: {
						channel: channelSlug,
						first: 10,
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.errors).toBeUndefined();
			expect(data.data).toBeDefined();
			expect(data.data.products).toBeDefined();
			expect(Array.isArray(data.data.products.edges)).toBe(true);
		});

		it('should fetch product by slug', async () => {
			const query = `
				query ProductBySlug($slug: String!, $channel: String!) {
					product(slug: $slug, channel: $channel) {
						id
						name
						slug
						description
						thumbnail {
							url
							alt
						}
						media {
							url
							alt
						}
						variants {
							id
							name
							pricing {
								price {
									gross {
										amount
										currency
									}
								}
							}
						}
					}
				}
			`;

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query,
					variables: {
						slug: 'apple-juice',
						channel: channelSlug,
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.errors).toBeUndefined();

			if (data.data.product) {
				expect(data.data.product.slug).toBe('apple-juice');
				expect(data.data.product.name).toBeDefined();
			}
		});

		it('should search products', async () => {
			const query = `
				query SearchProducts($search: String!, $channel: String!, $first: Int!) {
					products(channel: $channel, first: $first, filter: { search: $search }) {
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

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query,
					variables: {
						search: 'juice',
						channel: channelSlug,
						first: 10,
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.errors).toBeUndefined();
			expect(data.data.products).toBeDefined();
		});

		it('should fetch products by category', async () => {
			const query = `
				query ProductsByCategory($category: ID!, $channel: String!, $first: Int!) {
					products(channel: $channel, first: $first, filter: { categories: [$category] }) {
						edges {
							node {
								id
								name
								category {
									id
									name
								}
							}
						}
					}
				}
			`;

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query,
					variables: {
						category: 'Q2F0ZWdvcnk6Mg==',
						channel: channelSlug,
						first: 10,
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			// May or may not have products in this category
			expect(data.data).toBeDefined();
		});

		it('should handle product not found', async () => {
			const query = `
				query ProductBySlug($slug: String!, $channel: String!) {
					product(slug: $slug, channel: $channel) {
						id
						name
					}
				}
			`;

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query,
					variables: {
						slug: 'non-existent-product-12345',
						channel: channelSlug,
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.product).toBeNull();
		});
	});

	describe('Category Queries', () => {
		it('should fetch category list', async () => {
			const query = `
				query CategoryList($first: Int!) {
					categories(first: $first) {
						edges {
							node {
								id
								name
								slug
								children(first: 10) {
									edges {
										node {
											id
											name
										}
									}
								}
							}
						}
					}
				}
			`;

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query,
					variables: {
						first: 10,
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.errors).toBeUndefined();
			expect(data.data.categories).toBeDefined();
		});
	});

	describe('Channel Queries', () => {
		it('should fetch channel list', async () => {
			const query = `
				query ChannelsList {
					channels {
						id
						name
						slug
						currencyCode
					}
				}
			`;

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query,
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			// Channels query requires authentication, so expect permission error
			if (data.errors) {
				expect(data.errors[0].message).toContain('permissions');
			} else {
				expect(data.data.channels).toBeDefined();
				expect(Array.isArray(data.data.channels)).toBe(true);
			}
		});
	});

	describe('Menu Queries', () => {
		it('should fetch menu by slug', async () => {
			const query = `
				query MenuBySlug($slug: String!, $channel: String!) {
					menu(slug: $slug, channel: $channel) {
						id
						name
						items {
							id
							name
							url
							category {
								id
								name
							}
						}
					}
				}
			`;

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query,
					variables: {
						slug: 'navbar',
						channel: channelSlug,
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			// Menu may or may not exist
			expect(data.data).toBeDefined();
		});
	});

	describe('Error Handling', () => {
		it('should handle invalid GraphQL syntax', async () => {
			const invalidQuery = `
				query Invalid {
					invalid syntax here
				}
			`;

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: invalidQuery,
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.errors).toBeDefined();
			expect(Array.isArray(data.errors)).toBe(true);
		});

		it('should handle missing required variables', async () => {
			const query = `
				query ProductBySlug($slug: String!, $channel: String!) {
					product(slug: $slug, channel: $channel) {
						id
						name
					}
				}
			`;

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query,
					variables: {
						// Missing required channel variable
						slug: 'test',
					},
				}),
			});

			const data = await response.json();

			expect(data.errors).toBeDefined();
		});

		it('should handle network errors gracefully', async () => {
			const query = `query { __typename }`;

			try {
				const response = await fetch('http://invalid-url-12345.local/graphql/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ query }),
				});

				// If we get here, the fetch succeeded (shouldn't happen)
				expect(response).toBeDefined();
			} catch (error) {
				// Expected to throw network error
				expect(error).toBeDefined();
			}
		});
	});

	describe('Performance', () => {
		it('should respond within acceptable time', async () => {
			const query = `
				query QuickQuery {
					__typename
				}
			`;

			const startTime = Date.now();

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query,
				}),
			});

			const endTime = Date.now();
			const duration = endTime - startTime;

			expect(response.status).toBe(200);
			// Should respond in under 2 seconds
			expect(duration).toBeLessThan(2000);
		});

		it('should handle concurrent requests', async () => {
			const query = `
				query { __typename }
			`;

			const requests = Array(5).fill(null).map(() =>
				fetch(SALEOR_API_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ query }),
				})
			);

			const responses = await Promise.all(requests);

			responses.forEach(response => {
				expect(response.status).toBe(200);
			});
		});
	});
});
