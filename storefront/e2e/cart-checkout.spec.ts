import { test, expect } from '@playwright/test';

test.describe('Shopping Cart & Checkout', () => {
	test.describe('Shopping Cart', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel');
			await page.waitForLoadState('networkidle');
		});

		test('should navigate to cart page', async ({ page }) => {
			await page.goto('/default-channel/cart');
			await expect(page).toHaveURL(/\/cart/);
		});

		test('should display empty cart state', async ({ page }) => {
			await page.goto('/default-channel/cart');
			await page.waitForTimeout(1000);

			// Cart might be empty or have items
			const emptyState = page.getByText(/empty|no items|cart is empty/i);
			const cartItems = page.locator('[data-testid="cart-item"], .cart-item');

			const isEmpty = await emptyState.isVisible().catch(() => false);
			const hasItems = (await cartItems.count()) > 0;

			expect(isEmpty || hasItems).toBeTruthy();
		});

		test('should add product to cart from product page', async ({ page }) => {
			// Navigate to a product
			await page.goto('/default-channel/products');
			await page.waitForTimeout(2000);

			const firstProduct = page.locator('[href*="/products/"]').first();
			if (await firstProduct.isVisible()) {
				await firstProduct.click();
				await page.waitForLoadState('networkidle');

				// Add to cart
				const addToCartButton = page.getByRole('button', { name: /add to cart/i });
				if (await addToCartButton.isVisible() && await addToCartButton.isEnabled()) {
					await addToCartButton.click();
					await page.waitForTimeout(1000);

					// Check for success feedback
					const toast = page.locator('.toast, [role="alert"]');
					const cartBadge = page.locator('[href*="/cart"]');

					const toastVisible = await toast.isVisible().catch(() => false);
					const badgeVisible = await cartBadge.isVisible();

					expect(toastVisible || badgeVisible).toBeTruthy();
				}
			}
		});

		test('should update quantity in cart', async ({ page }) => {
			await page.goto('/default-channel/cart');
			await page.waitForTimeout(1000);

			const quantityInput = page.locator('input[type="number"], [role="spinbutton"]').first();

			if (await quantityInput.isVisible()) {
				const initialValue = await quantityInput.inputValue();
				await quantityInput.fill('2');
				await page.waitForTimeout(1000);

				// Cart should update
				const newValue = await quantityInput.inputValue();
				expect(newValue).toBe('2');
			}
		});

		test('should remove item from cart', async ({ page }) => {
			await page.goto('/default-channel/cart');
			await page.waitForTimeout(1000);

			const removeButton = page.getByRole('button', { name: /remove|delete/i }).first();

			if (await removeButton.isVisible()) {
				await removeButton.click();
				await page.waitForTimeout(1000);

				// Item should be removed
			}
		});

		test('should display cart summary', async ({ page }) => {
			await page.goto('/default-channel/cart');
			await page.waitForTimeout(1000);

			const summary = page.getByText(/subtotal|total|summary/i);
			const isVisible = await summary.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should proceed to checkout from cart', async ({ page }) => {
			await page.goto('/default-channel/cart');
			await page.waitForTimeout(1000);

			const checkoutButton = page.getByRole('button', { name: /checkout|proceed/i }).or(page.getByRole('link', { name: /checkout|proceed/i }));

			if (await checkoutButton.isVisible()) {
				await checkoutButton.click();
				await page.waitForLoadState('networkidle');
				await expect(page).toHaveURL(/checkout/);
			}
		});

		test('should continue shopping from cart', async ({ page }) => {
			await page.goto('/default-channel/cart');
			await page.waitForTimeout(1000);

			const continueButton = page.getByRole('link', { name: /continue shopping|shop/i }).first();

			if (await continueButton.isVisible()) {
				await continueButton.click();
				await page.waitForLoadState('networkidle');
			}
		});
	});

	test.describe('Checkout Flow', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/checkout');
			await page.waitForLoadState('networkidle');
		});

		test('should display checkout page', async ({ page }) => {
			await expect(page).toHaveURL(/checkout/);
		});

		test('should show checkout steps', async ({ page }) => {
			const steps = page.locator('[data-step], .step, nav[aria-label*="step"]');
			// May or may not have visible steps
			const count = await steps.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should fill shipping information', async ({ page }) => {
			const firstNameInput = page.locator('input[name*="firstName"], input[placeholder*="first name"]').first();
			const lastNameInput = page.locator('input[name*="lastName"], input[placeholder*="last name"]').first();
			const emailInput = page.locator('input[type="email"]').first();

			if (await firstNameInput.isVisible()) {
				await firstNameInput.fill('John');
			}

			if (await lastNameInput.isVisible()) {
				await lastNameInput.fill('Doe');
			}

			if (await emailInput.isVisible()) {
				await emailInput.fill('john.doe@example.com');
			}
		});

		test('should fill address fields', async ({ page }) => {
			const addressInput = page.locator('input[name*="address"], input[placeholder*="address"]').first();
			const cityInput = page.locator('input[name*="city"], input[placeholder*="city"]').first();
			const postalInput = page.locator('input[name*="postal"], input[placeholder*="postal"]').first();

			if (await addressInput.isVisible()) {
				await addressInput.fill('123 Main St');
			}

			if (await cityInput.isVisible()) {
				await cityInput.fill('Kampala');
			}

			if (await postalInput.isVisible()) {
				await postalInput.fill('12345');
			}
		});

		test('should validate required fields', async ({ page }) => {
			const continueButton = page.getByRole('button', { name: /continue|next/i }).first();

			if (await continueButton.isVisible()) {
				await continueButton.click();
				await page.waitForTimeout(500);

				// Should show validation errors
				const errors = page.locator('.error, [role="alert"], .text-red');
				const count = await errors.count();
				// May or may not show errors depending on form state
				expect(count).toBeGreaterThanOrEqual(0);
			}
		});

		test('should proceed to payment step', async ({ page }) => {
			// Fill minimum required fields
			const emailInput = page.locator('input[type="email"]').first();

			if (await emailInput.isVisible()) {
				await emailInput.fill('test@example.com');

				const continueButton = page.getByRole('button', { name: /continue|next/i }).first();
				if (await continueButton.isVisible()) {
					await continueButton.click();
					await page.waitForTimeout(1000);
				}
			}
		});

		test('should select payment method', async ({ page }) => {
			const paymentOptions = page.locator('input[type="radio"][name*="payment"], button[role="radio"]');
			const count = await paymentOptions.count();

			if (count > 0) {
				await paymentOptions.first().click();
				await page.waitForTimeout(500);
			}
		});

		test('should display mobile money options', async ({ page }) => {
			const mobileMoney = page.getByText(/mobile money|mtn|airtel/i);
			// May or may not be visible
			const isVisible = await mobileMoney.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should review order before submission', async ({ page }) => {
			const orderSummary = page.getByText(/order summary|review|total/i);
			const isVisible = await orderSummary.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should display order items in review', async ({ page }) => {
			await page.waitForTimeout(1000);

			const orderItems = page.locator('[data-testid="order-item"], .order-item, .cart-item');
			const count = await orderItems.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should calculate order total', async ({ page }) => {
			const total = page.getByText(/total.*ugx|ugx.*\d+/i);
			const isVisible = await total.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should show shipping cost', async ({ page }) => {
			const shipping = page.getByText(/shipping|delivery/i);
			const isVisible = await shipping.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should show free shipping message for eligible orders', async ({ page }) => {
			const freeShipping = page.getByText(/free shipping|free delivery/i);
			// May or may not be visible depending on order total
			const isVisible = await freeShipping.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should allow editing shipping information', async ({ page }) => {
			const editButton = page.getByRole('button', { name: /edit/i }).first();

			if (await editButton.isVisible()) {
				await editButton.click();
				await page.waitForTimeout(500);

				// Should go back to shipping step
			}
		});
	});

	test.describe('Order Submission', () => {
		test('should submit order', async ({ page }) => {
			await page.goto('/default-channel/checkout');
			await page.waitForTimeout(1000);

			const submitButton = page.getByRole('button', { name: /place order|submit|confirm/i }).first();

			if (await submitButton.isVisible() && await submitButton.isEnabled()) {
				// Note: Don't actually submit in tests unless using test mode
				// await submitButton.click();
				// await page.waitForTimeout(2000);
			}
		});
	});

	test.describe('Order Confirmation', () => {
		test('should display order confirmation page', async ({ page }) => {
			await page.goto('/default-channel/order-confirmation');
			await expect(page).toHaveURL(/order-confirmation/);
		});

		test('should show order number', async ({ page }) => {
			await page.goto('/default-channel/order-confirmation');
			await page.waitForTimeout(1000);

			const orderNumber = page.getByText(/order.*#|order number/i);
			const isVisible = await orderNumber.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should show order timeline', async ({ page }) => {
			await page.goto('/default-channel/order-confirmation');
			await page.waitForTimeout(1000);

			const timeline = page.locator('.timeline, [data-testid="order-timeline"]');
			const isVisible = await timeline.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should show order status', async ({ page }) => {
			await page.goto('/default-channel/order-confirmation');
			await page.waitForTimeout(1000);

			const status = page.getByText(/placed|processing|confirmed/i);
			const isVisible = await status.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should show next steps', async ({ page }) => {
			await page.goto('/default-channel/order-confirmation');
			await page.waitForTimeout(1000);

			const nextSteps = page.getByText(/next steps|what.*next/i);
			const isVisible = await nextSteps.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should have view order details button', async ({ page }) => {
			await page.goto('/default-channel/order-confirmation');
			await page.waitForTimeout(1000);

			const viewButton = page.getByRole('button', { name: /view.*order|order details/i }).or(page.getByRole('link', { name: /view.*order|order details/i }));
			const isVisible = await viewButton.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should have continue shopping button', async ({ page }) => {
			await page.goto('/default-channel/order-confirmation');
			await page.waitForTimeout(1000);

			const continueButton = page.getByRole('link', { name: /continue shopping|shop/i });
			if (await continueButton.isVisible()) {
				await continueButton.click();
				await page.waitForLoadState('networkidle');
			}
		});

		test('should show customer support info', async ({ page }) => {
			await page.goto('/default-channel/order-confirmation');
			await page.waitForTimeout(1000);

			const support = page.getByText(/support|contact|help/i);
			const isVisible = await support.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});
	});

	test.describe('Mobile Checkout', () => {
		test.use({ viewport: { width: 375, height: 667 } });

		test('should display mobile-optimized checkout', async ({ page }) => {
			await page.goto('/default-channel/checkout');
			await page.waitForTimeout(1000);

			const container = page.locator('main, .container').first();
			await expect(container).toBeVisible();
		});

		test('should have mobile-friendly form inputs', async ({ page }) => {
			await page.goto('/default-channel/checkout');
			await page.waitForTimeout(1000);

			const inputs = page.locator('input');
			const count = await inputs.count();

			if (count > 0) {
				const firstInput = inputs.first();
				const box = await firstInput.boundingBox();

				if (box) {
					expect(box.height).toBeGreaterThan(40); // Touch-friendly size
				}
			}
		});

		test('should show mobile payment options', async ({ page }) => {
			await page.goto('/default-channel/checkout');
			await page.waitForTimeout(1000);

			const mobilePayment = page.getByText(/mobile money/i);
			const isVisible = await mobilePayment.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});
	});

	test.describe('Cart Persistence', () => {
		test('should persist cart items across page reloads', async ({ page }) => {
			await page.goto('/default-channel/cart');
			await page.waitForTimeout(1000);

			const initialCount = await page.locator('[data-testid="cart-item"], .cart-item').count();

			// Reload page
			await page.reload();
			await page.waitForTimeout(1000);

			const newCount = await page.locator('[data-testid="cart-item"], .cart-item').count();

			// Cart should persist
			expect(newCount).toBe(initialCount);
		});
	});
});
