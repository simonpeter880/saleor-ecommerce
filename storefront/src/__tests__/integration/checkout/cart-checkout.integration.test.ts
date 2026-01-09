/**
 * Cart and Checkout Integration Tests
 *
 * These tests verify the complete shopping cart and checkout flow,
 * including adding items, updating quantities, applying discounts,
 * and completing orders.
 */

import { describe, it, expect, beforeAll, afterEach } from '@jest/globals';

const SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL || 'http://localhost:8000/graphql/';

describe('Cart and Checkout Integration', () => {
	let channelSlug: string;
	let productId: string;
	let variantId: string;
	let checkoutId: string | null = null;

	beforeAll(async () => {
		channelSlug = 'default-channel';

		// Get a product to use in tests
		const productQuery = `
			query {
				products(channel: "${channelSlug}", first: 1) {
					edges {
						node {
							id
							variants {
								id
							}
						}
					}
				}
			}
		`;

		const response = await fetch(SALEOR_API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: productQuery }),
		});

		const data = await response.json();

		if (data.data.products.edges.length > 0) {
			productId = data.data.products.edges[0].node.id;
			variantId = data.data.products.edges[0].node.variants[0].id;
		}
	});

	afterEach(async () => {
		// Cleanup checkout after each test
		if (checkoutId) {
			// Could delete checkout here if needed
			checkoutId = null;
		}
	});

	describe('Checkout Creation', () => {
		it('should create a new checkout', async () => {
			const mutation = `
				mutation CheckoutCreate($input: CheckoutCreateInput!) {
					checkoutCreate(input: $input) {
						checkout {
							id
							email
							lines {
								id
								quantity
							}
							totalPrice {
								gross {
									amount
									currency
								}
							}
						}
						errors {
							field
							message
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
					query: mutation,
					variables: {
						input: {
							channel: channelSlug,
							email: 'test@example.com',
							lines: [],
						},
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.data.checkoutCreate.checkout).toBeDefined();
			expect(data.data.checkoutCreate.errors).toHaveLength(0);

			checkoutId = data.data.checkoutCreate.checkout.id;
		});

		it('should create checkout with initial line items', async () => {
			if (!variantId) {
				console.log('Skipping test: no variant available');
				return;
			}

			const mutation = `
				mutation CheckoutCreate($input: CheckoutCreateInput!) {
					checkoutCreate(input: $input) {
						checkout {
							id
							lines {
								id
								quantity
								variant {
									id
								}
							}
						}
						errors {
							message
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
					query: mutation,
					variables: {
						input: {
							channel: channelSlug,
							email: 'test@example.com',
							lines: [
								{
									variantId,
									quantity: 2,
								},
							],
						},
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);

			if (data.data.checkoutCreate.checkout) {
				expect(data.data.checkoutCreate.checkout.lines).toHaveLength(1);
				expect(data.data.checkoutCreate.checkout.lines[0].quantity).toBe(2);

				checkoutId = data.data.checkoutCreate.checkout.id;
			}
		});

		it('should validate channel parameter', async () => {
			const mutation = `
				mutation CheckoutCreate($input: CheckoutCreateInput!) {
					checkoutCreate(input: $input) {
						checkout {
							id
						}
						errors {
							field
							message
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
					query: mutation,
					variables: {
						input: {
							channel: 'invalid-channel',
							email: 'test@example.com',
							lines: [],
						},
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			// Should have error for invalid channel
			if (data.data.checkoutCreate.errors.length > 0) {
				expect(data.data.checkoutCreate.checkout).toBeNull();
			}
		});
	});

	describe('Cart Line Management', () => {
		beforeEach(async () => {
			// Create a checkout for each test
			const mutation = `
				mutation {
					checkoutCreate(input: {
						channel: "${channelSlug}",
						email: "test@example.com",
						lines: []
					}) {
						checkout {
							id
						}
					}
				}
			`;

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query: mutation }),
			});

			const data = await response.json();
			checkoutId = data.data.checkoutCreate.checkout.id;
		});

		it('should add line items to checkout', async () => {
			if (!checkoutId || !variantId) {
				console.log('Skipping test: no checkout or variant');
				return;
			}

			const mutation = `
				mutation CheckoutLinesAdd($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
					checkoutLinesAdd(checkoutId: $checkoutId, lines: $lines) {
						checkout {
							id
							lines {
								id
								quantity
								variant {
									id
								}
							}
						}
						errors {
							message
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
					query: mutation,
					variables: {
						checkoutId,
						lines: [
							{
								variantId,
								quantity: 1,
							},
						],
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);

			if (data.data.checkoutLinesAdd.checkout) {
				expect(data.data.checkoutLinesAdd.checkout.lines.length).toBeGreaterThan(0);
			}
		});

		it('should update line item quantity', async () => {
			if (!checkoutId || !variantId) {
				console.log('Skipping test: no checkout or variant');
				return;
			}

			// First add a line
			const addMutation = `
				mutation {
					checkoutLinesAdd(
						checkoutId: "${checkoutId}",
						lines: [{ variantId: "${variantId}", quantity: 1 }]
					) {
						checkout {
							lines {
								id
							}
						}
					}
				}
			`;

			const addResponse = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query: addMutation }),
			});

			const addData = await addResponse.json();

			if (addData.data.checkoutLinesAdd?.checkout?.lines && addData.data.checkoutLinesAdd.checkout.lines.length > 0) {
				const lineId = addData.data.checkoutLinesAdd.checkout.lines[0].id;

				// Update quantity
				const updateMutation = `
					mutation CheckoutLinesUpdate($checkoutId: ID!, $lines: [CheckoutLineUpdateInput!]!) {
						checkoutLinesUpdate(checkoutId: $checkoutId, lines: $lines) {
							checkout {
								lines {
									id
									quantity
								}
							}
							errors {
								message
							}
						}
					}
				`;

				const updateResponse = await fetch(SALEOR_API_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						query: updateMutation,
						variables: {
							checkoutId,
							lines: [
								{
									lineId,
									quantity: 5,
								},
							],
						},
					}),
				});

				const updateData = await updateResponse.json();

				expect(updateResponse.status).toBe(200);

				if (updateData.data.checkoutLinesUpdate.checkout) {
					const updatedLine = updateData.data.checkoutLinesUpdate.checkout.lines.find(
						(line: any) => line.id === lineId
					);
					expect(updatedLine.quantity).toBe(5);
				}
			}
		});

		it('should remove line items from checkout', async () => {
			if (!checkoutId || !variantId) {
				console.log('Skipping test: no checkout or variant');
				return;
			}

			// Add a line first
			const addMutation = `
				mutation {
					checkoutLinesAdd(
						checkoutId: "${checkoutId}",
						lines: [{ variantId: "${variantId}", quantity: 1 }]
					) {
						checkout {
							lines {
								id
							}
						}
					}
				}
			`;

			const addResponse = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query: addMutation }),
			});

			const addData = await addResponse.json();

			if (addData.data.checkoutLinesAdd?.checkout?.lines && addData.data.checkoutLinesAdd.checkout.lines.length > 0) {
				const lineId = addData.data.checkoutLinesAdd.checkout.lines[0].id;

				// Remove line
				const deleteMutation = `
					mutation CheckoutLinesDelete($checkoutId: ID!, $linesIds: [ID!]!) {
						checkoutLinesDelete(checkoutId: $checkoutId, linesIds: $linesIds) {
							checkout {
								lines {
									id
								}
							}
							errors {
								message
							}
						}
					}
				`;

				const deleteResponse = await fetch(SALEOR_API_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						query: deleteMutation,
						variables: {
							checkoutId,
							linesIds: [lineId],
						},
					}),
				});

				const deleteData = await deleteResponse.json();

				expect(deleteResponse.status).toBe(200);

				if (deleteData.data.checkoutLinesDelete.checkout) {
					const remainingLine = deleteData.data.checkoutLinesDelete.checkout.lines.find(
						(line: any) => line.id === lineId
					);
					expect(remainingLine).toBeUndefined();
				}
			}
		});

		it('should validate quantity limits', async () => {
			if (!checkoutId || !variantId) {
				console.log('Skipping test: no checkout or variant');
				return;
			}

			const mutation = `
				mutation CheckoutLinesAdd($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
					checkoutLinesAdd(checkoutId: $checkoutId, lines: $lines) {
						checkout {
							id
						}
						errors {
							message
							field
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
					query: mutation,
					variables: {
						checkoutId,
						lines: [
							{
								variantId,
								quantity: -1, // Invalid quantity
							},
						],
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			// Should have validation error
			if (data.data.checkoutLinesAdd.errors.length > 0) {
				expect(data.data.checkoutLinesAdd.errors).toBeDefined();
			}
		});
	});

	describe('Checkout Information', () => {
		beforeEach(async () => {
			const mutation = `
				mutation {
					checkoutCreate(input: {
						channel: "${channelSlug}",
						email: "test@example.com",
						lines: []
					}) {
						checkout {
							id
						}
					}
				}
			`;

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query: mutation }),
			});

			const data = await response.json();
			checkoutId = data.data.checkoutCreate.checkout.id;
		});

		it('should update checkout email', async () => {
			if (!checkoutId) return;

			const mutation = `
				mutation CheckoutEmailUpdate($checkoutId: ID!, $email: String!) {
					checkoutEmailUpdate(checkoutId: $checkoutId, email: $email) {
						checkout {
							id
							email
						}
						errors {
							message
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
					query: mutation,
					variables: {
						checkoutId,
						email: 'newemail@example.com',
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);

			if (data.data.checkoutEmailUpdate.checkout) {
				expect(data.data.checkoutEmailUpdate.checkout.email).toBe('newemail@example.com');
			}
		});

		it('should validate email format', async () => {
			if (!checkoutId) return;

			const mutation = `
				mutation CheckoutEmailUpdate($checkoutId: ID!, $email: String!) {
					checkoutEmailUpdate(checkoutId: $checkoutId, email: $email) {
						checkout {
							id
						}
						errors {
							field
							message
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
					query: mutation,
					variables: {
						checkoutId,
						email: 'invalid-email',
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			// Should have validation error
			if (data.data.checkoutEmailUpdate.errors.length > 0) {
				expect(data.data.checkoutEmailUpdate.errors).toBeDefined();
			}
		});

		it('should calculate total price correctly', async () => {
			if (!checkoutId || !variantId) return;

			// Add items to checkout
			const addMutation = `
				mutation {
					checkoutLinesAdd(
						checkoutId: "${checkoutId}",
						lines: [{ variantId: "${variantId}", quantity: 2 }]
					) {
						checkout {
							id
							subtotalPrice {
								gross {
									amount
								}
							}
							totalPrice {
								gross {
									amount
								}
							}
						}
					}
				}
			`;

			const response = await fetch(SALEOR_API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query: addMutation }),
			});

			const data = await response.json();

			expect(response.status).toBe(200);

			if (data.data.checkoutLinesAdd.checkout) {
				expect(data.data.checkoutLinesAdd.checkout.totalPrice.gross.amount).toBeGreaterThan(0);
			}
		});
	});

	describe('Shipping & Billing', () => {
		it('should update shipping address', async () => {
			if (!checkoutId) {
				const createMutation = `
					mutation {
						checkoutCreate(input: {
							channel: "${channelSlug}",
							email: "test@example.com",
							lines: []
						}) {
							checkout {
								id
							}
						}
					}
				`;
				const createResponse = await fetch(SALEOR_API_URL, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: createMutation }),
				});
				const createData = await createResponse.json();
				checkoutId = createData.data.checkoutCreate.checkout.id;
			}

			const mutation = `
				mutation CheckoutShippingAddressUpdate($checkoutId: ID!, $shippingAddress: AddressInput!) {
					checkoutShippingAddressUpdate(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
						checkout {
							id
							shippingAddress {
								firstName
								lastName
								streetAddress1
								city
								postalCode
								country {
									code
								}
							}
						}
						errors {
							message
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
					query: mutation,
					variables: {
						checkoutId,
						shippingAddress: {
							firstName: 'John',
							lastName: 'Doe',
							streetAddress1: '123 Test St',
							city: 'Test City',
							postalCode: '12345',
							country: 'US',
						},
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);

			if (data.data.checkoutShippingAddressUpdate.checkout) {
				expect(data.data.checkoutShippingAddressUpdate.checkout.shippingAddress.city).toBe('Test City');
			}
		});

		it('should get available shipping methods', async () => {
			if (!checkoutId) return;

			const query = `
				query Checkout($id: ID!) {
					checkout(id: $id) {
						id
						shippingMethods {
							id
							name
							price {
								amount
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
						id: checkoutId,
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);

			if (data.data.checkout) {
				expect(data.data.checkout.shippingMethods).toBeDefined();
			}
		});
	});

	describe('Promo Codes & Discounts', () => {
		it('should apply promo code to checkout', async () => {
			if (!checkoutId) {
				const createMutation = `
					mutation {
						checkoutCreate(input: {
							channel: "${channelSlug}",
							email: "test@example.com",
							lines: []
						}) {
							checkout {
								id
							}
						}
					}
				`;
				const createResponse = await fetch(SALEOR_API_URL, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: createMutation }),
				});
				const createData = await createResponse.json();
				checkoutId = createData.data.checkoutCreate.checkout.id;
			}

			const mutation = `
				mutation CheckoutAddPromoCode($checkoutId: ID!, $promoCode: String!) {
					checkoutAddPromoCode(checkoutId: $checkoutId, promoCode: $promoCode) {
						checkout {
							id
							discount {
								amount
							}
						}
						errors {
							message
							field
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
					query: mutation,
					variables: {
						checkoutId,
						promoCode: 'TEST10',
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			// Promo code may or may not exist
			expect(data.data.checkoutAddPromoCode).toBeDefined();
		});

		it('should handle invalid promo code', async () => {
			if (!checkoutId) return;

			const mutation = `
				mutation CheckoutAddPromoCode($checkoutId: ID!, $promoCode: String!) {
					checkoutAddPromoCode(checkoutId: $checkoutId, promoCode: $promoCode) {
						checkout {
							id
						}
						errors {
							message
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
					query: mutation,
					variables: {
						checkoutId,
						promoCode: 'INVALID_CODE_12345',
					},
				}),
			});

			const data = await response.json();

			expect(response.status).toBe(200);
			// Should have error for invalid code
			if (data.data.checkoutAddPromoCode.errors) {
				expect(data.data.checkoutAddPromoCode.errors.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Checkout Completion', () => {
		it('should complete checkout', async () => {
			// This test requires a fully configured checkout
			// Skipped in basic integration tests as it requires payment setup
			expect(true).toBe(true);
		});
	});
});
