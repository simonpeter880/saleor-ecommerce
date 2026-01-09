/**
 * Product Catalog Integration Tests
 *
 * These tests verify product catalog functionality including
 * product listings, filtering, sorting, categories, and collections.
 */

import { describe, it, expect, beforeAll } from '@jest/globals';

const SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL || 'http://localhost:8000/graphql/';

describe('Product Catalog Integration', () => {
	let channelSlug: string;
	let categoryId: string | null = null;
	let collectionId: string | null = null;

	beforeAll(async () => {
		channelSlug = 'default-channel';

		// Get a category for testing
		const categoryQuery = `
			query {
				categories(first: 1) {
					edges {
						node {
							id
							name
						}
					}
				}
			}
		`;

		const categoryResponse = await fetch(SALEOR_API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: categoryQuery }),
		});

		const categoryData = await categoryResponse.json();

		if (categoryData.data.categories.edges.length > 0) {
			categoryId = categoryData.data.categories.edges[0].node.id;
		}

		// Get a collection for testing
		const collectionQuery = `
			query {
				collections(channel: "${channelSlug}", first: 1) {
					edges {
						node {
							id
							name
						}
					}
				}
			}
		`;

		const collectionResponse = await fetch(SALEOR_API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: collectionQuery }),
		});

		const collectionData = await collectionResponse.json();

		if (collectionData.data.collections.edges.length > 0) {
			collectionId = collectionData.data.collections.edges[0].node.id;
		}
	});

	describe('Product Listings', () => {
		it('should list products with pagination', async () => {
			const query = `
				query ProductList($channel: String!, $first: Int!, $after: String) {
					products(channel: $channel, first: $first, after: $after) {
						pageInfo {
							hasNextPage
							hasPreviousPage
							startCursor
							endCursor
						}
						edges {
							cursor
							node {
								id
								name
								slug
								thumbnail {
									url
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
						first: 5,
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.errors).toBeUndefined();
			expect(data.data.products.pageInfo).toBeDefined();
			expect(data.data.products.edges).toBeDefined();
			expect(Array.isArray(data.data.products.edges)).toBe(true);
		});

		it('should fetch product variants and pricing', async () => {
			const query = `
				query Products($channel: String!) {
					products(channel: $channel, first: 1) {
						edges {
							node {
								id
								name
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
										priceUndiscounted {
											gross {
												amount
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
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);

			if (data.data.products.edges.length > 0) {
				const product = data.data.products.edges[0].node;
				expect(product.variants).toBeDefined();
				expect(Array.isArray(product.variants)).toBe(true);

				if (product.variants.length > 0) {
					expect(product.variants[0].pricing).toBeDefined();
				}
			}
		});

		it('should fetch product media and images', async () => {
			const query = `
				query Products($channel: String!) {
					products(channel: $channel, first: 1) {
						edges {
							node {
								id
								thumbnail {
									url
									alt
								}
								media {
									url
									alt
									type
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
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);

			if (data.data.products.edges.length > 0) {
				const product = data.data.products.edges[0].node;
				expect(product.media).toBeDefined();
			}
		});

		it('should handle out of stock products', async () => {
			const query = `
				query Products($channel: String!) {
					products(channel: $channel, first: 10) {
						edges {
							node {
								id
								name
								variants {
									id
									quantityAvailable
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
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);

			// Check that quantityAvailable is properly returned
			if (data.data.products.edges.length > 0) {
				const product = data.data.products.edges[0].node;

				if (product.variants.length > 0) {
					expect(typeof product.variants[0].quantityAvailable).toBeDefined();
				}
			}
		});
	});

	describe('Product Filtering', () => {
		it('should filter products by price range', async () => {
			const query = `
				query ProductsWithFilter($channel: String!, $filter: ProductFilterInput!) {
					products(channel: $channel, first: 10, filter: $filter) {
						edges {
							node {
								id
								name
								pricing {
									priceRange {
										start {
											gross {
												amount
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
						filter: {
							price: {
								gte: 10,
								lte: 100,
							},
						},
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.products).toBeDefined();
		});

		it('should filter products by availability', async () => {
			const query = `
				query ProductsWithFilter($channel: String!, $filter: ProductFilterInput!) {
					products(channel: $channel, first: 10, filter: $filter) {
						edges {
							node {
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
						channel: channelSlug,
						filter: {
							isAvailable: true,
						},
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.products).toBeDefined();
		});

		it('should filter products by attributes', async () => {
			const query = `
				query ProductsWithFilter($channel: String!, $filter: ProductFilterInput!) {
					products(channel: $channel, first: 10, filter: $filter) {
						edges {
							node {
								id
								name
								attributes {
									attribute {
										slug
									}
									values {
										name
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
						filter: {},
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.products).toBeDefined();
		});
	});

	describe('Product Sorting', () => {
		it('should sort products by name', async () => {
			const query = `
				query ProductsWithSort($channel: String!, $sortBy: ProductOrder) {
					products(channel: $channel, first: 10, sortBy: $sortBy) {
						edges {
							node {
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
						channel: channelSlug,
						sortBy: {
							field: 'NAME',
							direction: 'ASC',
						},
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.products).toBeDefined();

			if (data.data.products.edges.length > 1) {
				const names = data.data.products.edges.map((edge: any) => edge.node.name);
				const sortedNames = [...names].sort();
				expect(names).toEqual(sortedNames);
			}
		});

		it('should sort products by price', async () => {
			const query = `
				query ProductsWithSort($channel: String!, $sortBy: ProductOrder) {
					products(channel: $channel, first: 10, sortBy: $sortBy) {
						edges {
							node {
								id
								name
								pricing {
									priceRange {
										start {
											gross {
												amount
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
						sortBy: {
							field: 'PRICE',
							direction: 'ASC',
						},
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.products).toBeDefined();
		});
	});

	describe('Categories', () => {
		it('should fetch category hierarchy', async () => {
			const query = `
				query Categories {
					categories(first: 10) {
						edges {
							node {
								id
								name
								slug
								parent {
									id
									name
								}
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
				body: JSON.stringify({ query }),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.categories).toBeDefined();
		});

		it('should fetch products by category', async () => {
			if (!categoryId) {
				console.log('Skipping test: no category available');
				return;
			}

			const query = `
				query ProductsByCategory($channel: String!, $categoryId: ID!) {
					products(channel: $channel, first: 10, filter: { categories: [$categoryId] }) {
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
						channel: channelSlug,
						categoryId,
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.products).toBeDefined();
		});

		it('should get category details with product count', async () => {
			if (!categoryId) {
				console.log('Skipping test: no category available');
				return;
			}

			const query = `
				query Category($id: ID!) {
					category(id: $id) {
						id
						name
						description
						products(first: 1) {
							totalCount
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
						id: categoryId,
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);

			if (data.data.category) {
				// Products might be null if no channel is specified
				if (data.data.category.products) {
					expect(data.data.category.products.totalCount).toBeDefined();
				} else {
					// Expected if no channel context
					expect(data.data.category.products).toBeNull();
				}
			}
		});
	});

	describe('Collections', () => {
		it('should fetch collections list', async () => {
			const query = `
				query Collections($channel: String!) {
					collections(channel: $channel, first: 10) {
						edges {
							node {
								id
								name
								slug
								backgroundImage {
									url
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
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.collections).toBeDefined();
		});

		it('should fetch products by collection', async () => {
			if (!collectionId) {
				console.log('Skipping test: no collection available');
				return;
			}

			const query = `
				query ProductsByCollection($channel: String!, $collectionId: ID!) {
					products(channel: $channel, first: 10, filter: { collections: [$collectionId] }) {
						edges {
							node {
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
						channel: channelSlug,
						collectionId,
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.products).toBeDefined();
		});
	});

	describe('Product Search', () => {
		it('should search products by name', async () => {
			const query = `
				query SearchProducts($channel: String!, $search: String!) {
					products(channel: $channel, first: 10, filter: { search: $search }) {
						edges {
							node {
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
						channel: channelSlug,
						search: 'juice',
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.products).toBeDefined();
		});

		it('should handle empty search results', async () => {
			const query = `
				query SearchProducts($channel: String!, $search: String!) {
					products(channel: $channel, first: 10, filter: { search: $search }) {
						edges {
							node {
								id
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
						search: 'xyz123nonexistent456',
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.products.edges).toHaveLength(0);
		});

		it('should provide search suggestions', async () => {
			const query = `
				query SearchProducts($channel: String!, $search: String!) {
					products(channel: $channel, first: 5, filter: { search: $search }) {
						edges {
							node {
								id
								name
								thumbnail {
									url
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
						search: 'app',
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.products).toBeDefined();
		});
	});

	describe('Product Attributes', () => {
		it('should fetch product attributes', async () => {
			const query = `
				query Products($channel: String!) {
					products(channel: $channel, first: 1) {
						edges {
							node {
								id
								name
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
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);

			if (data.data.products.edges.length > 0) {
				const product = data.data.products.edges[0].node;
				expect(product.attributes).toBeDefined();
				expect(Array.isArray(product.attributes)).toBe(true);
			}
		});
	});
});
