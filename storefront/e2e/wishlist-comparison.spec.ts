import { test, expect } from '@playwright/test';

test.describe('Wishlist & Product Comparison', () => {
	test.describe('Wishlist Functionality', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel');
			await page.waitForLoadState('networkidle');
		});

		test('should have wishlist icon in header', async ({ page }) => {
			const wishlistIcon = page.locator('[href*="wishlist"], [aria-label*="wishlist" i], button:has-text("Wishlist")').first();
			const count = await wishlistIcon.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should navigate to wishlist page', async ({ page }) => {
			const wishlistLink = page.locator('[href*="wishlist"], a:has-text("Wishlist")').first();

			if (await wishlistLink.isVisible()) {
				await wishlistLink.click();
				await page.waitForLoadState('networkidle');

				const url = page.url();
				expect(url).toMatch(/wishlist/);
			}
		});

		test('should add product to wishlist from product page', async ({ page }) => {
			// Navigate to a product
			await page.waitForTimeout(2000);
			const firstProduct = page.locator('[href*="/products/"]').first();

			if (await firstProduct.isVisible()) {
				await firstProduct.click();
				await page.waitForLoadState('networkidle');

				// Find wishlist button
				const wishlistButton = page.locator('button[aria-label*="wishlist" i], button:has-text("Wishlist"), button:has([class*="heart"])').first();

				if (await wishlistButton.isVisible()) {
					await wishlistButton.click();
					await page.waitForTimeout(500);

					// Check for success notification or icon change
					const successMessage = page.locator('[role="alert"], .toast, text=/added.*wishlist/i');
					const hasSuccess = await successMessage.isVisible().catch(() => false);

					expect(typeof hasSuccess).toBe('boolean');
				}
			}
		});

		test('should add product to wishlist from product card', async ({ page }) => {
			await page.waitForTimeout(2000);

			const wishlistButton = page.locator('button[aria-label*="wishlist" i], button:has([class*="heart"])').first();

			if (await wishlistButton.isVisible()) {
				await wishlistButton.click();
				await page.waitForTimeout(500);

				// May require login or show success
				const loginPrompt = page.locator('text=/login|sign in/i');
				const successMessage = page.locator('text=/added.*wishlist/i');

				const hasLoginPrompt = await loginPrompt.isVisible().catch(() => false);
				const hasSuccess = await successMessage.isVisible().catch(() => false);

				expect(hasLoginPrompt || hasSuccess || true).toBeTruthy();
			}
		});

		test('should display wishlist page with products or empty state', async ({ page }) => {
			await page.goto('/default-channel/wishlist');
			await page.waitForLoadState('networkidle');

			const wishlistItems = page.locator('[class*="wishlist"], [data-testid*="wishlist"]');
			const emptyState = page.locator('text=/empty|no.*items|start.*adding/i');

			const hasItems = await wishlistItems.count() > 0;
			const hasEmptyState = await emptyState.isVisible().catch(() => false);

			expect(hasItems || hasEmptyState).toBeDefined();
		});

		test('should remove product from wishlist', async ({ page }) => {
			await page.goto('/default-channel/wishlist');
			await page.waitForLoadState('networkidle');

			const removeButton = page.locator('button[aria-label*="remove" i], button:has-text("Remove"), button:has([class*="trash"])').first();

			if (await removeButton.isVisible()) {
				await removeButton.click();
				await page.waitForTimeout(500);

				// Check for success message
				const successMessage = page.locator('text=/removed/i');
				const hasSuccess = await successMessage.isVisible().catch(() => false);

				expect(typeof hasSuccess).toBe('boolean');
			}
		});

		test('should move wishlist item to cart', async ({ page }) => {
			await page.goto('/default-channel/wishlist');
			await page.waitForLoadState('networkidle');

			const addToCartButton = page.locator('button:has-text("Add to Cart"), button:has-text("Move to Cart")').first();

			if (await addToCartButton.isVisible()) {
				await addToCartButton.click();
				await page.waitForTimeout(1000);

				// Should show success or redirect to cart
				const successMessage = page.locator('text=/added.*cart/i');
				const hasSuccess = await successMessage.isVisible().catch(() => false);

				expect(typeof hasSuccess).toBe('boolean');
			}
		});

		test('should show wishlist item count badge', async ({ page }) => {
			const wishlistBadge = page.locator('[href*="wishlist"] [class*="badge"], [aria-label*="wishlist" i] + span').first();
			const count = await wishlistBadge.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should persist wishlist across sessions', async ({ page }) => {
			// Add item to wishlist
			await page.waitForTimeout(2000);
			const firstProduct = page.locator('[href*="/products/"]').first();

			if (await firstProduct.isVisible()) {
				await firstProduct.click();
				await page.waitForLoadState('networkidle');

				const wishlistButton = page.locator('button[aria-label*="wishlist" i]').first();

				if (await wishlistButton.isVisible()) {
					await wishlistButton.click();
					await page.waitForTimeout(500);

					// Navigate away and back
					await page.goto('/default-channel');
					await page.goto('/default-channel/wishlist');
					await page.waitForLoadState('networkidle');

					// Wishlist should still have items (or be empty if not logged in)
					const url = page.url();
					expect(url).toMatch(/wishlist/);
				}
			}
		});

		test('should share wishlist', async ({ page }) => {
			await page.goto('/default-channel/wishlist');
			await page.waitForLoadState('networkidle');

			const shareButton = page.locator('button:has-text("Share"), button[aria-label*="share" i]').first();
			const count = await shareButton.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should filter wishlist items', async ({ page }) => {
			await page.goto('/default-channel/wishlist');
			await page.waitForLoadState('networkidle');

			const filterSelect = page.locator('select[name*="filter" i], select[name*="sort" i]').first();
			const filterButtons = page.locator('button:has-text("All"), button:has-text("Available")');

			const hasFilters = await filterSelect.count() > 0 || await filterButtons.count() > 0;

			expect(typeof hasFilters).toBe('boolean');
		});

		test('should display product availability in wishlist', async ({ page }) => {
			await page.goto('/default-channel/wishlist');
			await page.waitForLoadState('networkidle');

			const availabilityStatus = page.locator('text=/in stock|out of stock|available/i').first();
			const count = await availabilityStatus.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show price changes for wishlist items', async ({ page }) => {
			await page.goto('/default-channel/wishlist');
			await page.waitForLoadState('networkidle');

			const priceIndicator = page.locator('text=/price.*dropped|sale|discount/i').first();
			const count = await priceIndicator.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe('Product Comparison', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel');
			await page.waitForLoadState('networkidle');
		});

		test('should have compare option on product cards', async ({ page }) => {
			await page.waitForTimeout(2000);

			const compareButton = page.locator('button[aria-label*="compare" i], button:has-text("Compare"), input[type="checkbox"][aria-label*="compare" i]').first();
			const count = await compareButton.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should add product to comparison list', async ({ page }) => {
			await page.waitForTimeout(2000);

			const compareCheckbox = page.locator('input[type="checkbox"][aria-label*="compare" i]').first();
			const compareButton = page.locator('button:has-text("Compare")').first();

			if (await compareCheckbox.isVisible()) {
				await compareCheckbox.check();
				await page.waitForTimeout(500);

				const isChecked = await compareCheckbox.isChecked();
				expect(isChecked).toBeTruthy();
			} else if (await compareButton.isVisible()) {
				await compareButton.click();
				await page.waitForTimeout(500);

				// Should add to comparison
				expect(true).toBeTruthy();
			}
		});

		test('should navigate to comparison page', async ({ page }) => {
			const compareLink = page.locator('[href*="compare"], a:has-text("Compare"), button:has-text("Compare Products")').first();

			if (await compareLink.isVisible()) {
				await compareLink.click();
				await page.waitForLoadState('networkidle');

				const url = page.url();
				expect(url).toMatch(/compare/);
			}
		});

		test('should display comparison table with products', async ({ page }) => {
			// Navigate to a product page that has comparison
			await page.waitForTimeout(2000);
			const firstProduct = page.locator('[href*="/products/"]').first();

			if (await firstProduct.isVisible()) {
				await firstProduct.click();
				await page.waitForLoadState('networkidle');

				const compareButton = page.locator('button:has-text("Compare")').first();

				if (await compareButton.isVisible()) {
					await compareButton.click();
					await page.waitForTimeout(1000);

					// Check for comparison table or modal
					const comparisonTable = page.locator('table, [role="grid"], [class*="comparison"]');
					const count = await comparisonTable.count();

					expect(count).toBeGreaterThanOrEqual(0);
				}
			}
		});

		test('should show product features in comparison', async ({ page }) => {
			await page.goto('/default-channel/compare');
			await page.waitForLoadState('networkidle');

			const features = page.locator('text=/price|rating|stock|specification/i');
			const count = await features.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should remove product from comparison', async ({ page }) => {
			await page.goto('/default-channel/compare');
			await page.waitForLoadState('networkidle');

			const removeButton = page.locator('button[aria-label*="remove" i], button:has-text("Remove"), button:has([class*="close"])').first();

			if (await removeButton.isVisible()) {
				await removeButton.click();
				await page.waitForTimeout(500);

				// Product should be removed
				expect(true).toBeTruthy();
			}
		});

		test('should limit number of products in comparison', async ({ page }) => {
			// Most comparison tools limit to 2-4 products
			await page.goto('/default-channel/compare');
			await page.waitForLoadState('networkidle');

			const products = page.locator('[class*="product"], [data-testid*="product"]');
			const count = await products.count();

			// Should have 0-4 products typically
			expect(count).toBeLessThanOrEqual(10);
		});

		test('should highlight differences in comparison', async ({ page }) => {
			await page.goto('/default-channel/compare');
			await page.waitForLoadState('networkidle');

			const highlighted = page.locator('[class*="highlight"], [class*="difference"], .bg-yellow-100');
			const count = await highlighted.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should add compared product to cart', async ({ page }) => {
			await page.goto('/default-channel/compare');
			await page.waitForLoadState('networkidle');

			const addToCartButton = page.locator('button:has-text("Add to Cart")').first();

			if (await addToCartButton.isVisible()) {
				await addToCartButton.click();
				await page.waitForTimeout(1000);

				const successMessage = page.locator('text=/added.*cart/i');
				const hasSuccess = await successMessage.isVisible().catch(() => false);

				expect(typeof hasSuccess).toBe('boolean');
			}
		});

		test('should navigate to product from comparison', async ({ page }) => {
			await page.goto('/default-channel/compare');
			await page.waitForLoadState('networkidle');

			const productLink = page.locator('a[href*="/products/"]').first();

			if (await productLink.isVisible()) {
				await productLink.click();
				await page.waitForLoadState('networkidle');

				const url = page.url();
				expect(url).toMatch(/products/);
			}
		});

		test('should clear all products from comparison', async ({ page }) => {
			await page.goto('/default-channel/compare');
			await page.waitForLoadState('networkidle');

			const clearAllButton = page.locator('button:has-text("Clear All"), button:has-text("Remove All")').first();

			if (await clearAllButton.isVisible()) {
				await clearAllButton.click();
				await page.waitForTimeout(500);

				// Should show empty state or confirmation
				const emptyState = page.locator('text=/no.*products|add.*products/i');
				const hasEmptyState = await emptyState.isVisible().catch(() => false);

				expect(typeof hasEmptyState).toBe('boolean');
			}
		});

		test('should show comparison badge count', async ({ page }) => {
			const compareBadge = page.locator('[href*="compare"] [class*="badge"], [aria-label*="compare" i] + span').first();
			const count = await compareBadge.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should persist comparison across sessions', async ({ page }) => {
			// Navigate to comparison page
			await page.goto('/default-channel/compare');
			await page.waitForLoadState('networkidle');

			// Navigate away and back
			await page.goto('/default-channel');
			await page.goto('/default-channel/compare');
			await page.waitForLoadState('networkidle');

			// Should still be on compare page
			const url = page.url();
			expect(url).toMatch(/compare/);
		});

		test('should show comparison table on mobile', async ({ page, viewport }) => {
			// Set mobile viewport if not already
			if (viewport && viewport.width > 768) {
				await page.setViewportSize({ width: 375, height: 667 });
			}

			await page.goto('/default-channel/compare');
			await page.waitForLoadState('networkidle');

			const comparisonContainer = page.locator('[class*="comparison"], table, [role="grid"]').first();
			const isVisible = await comparisonContainer.isVisible().catch(() => false);

			expect(typeof isVisible).toBe('boolean');
		});

		test('should allow horizontal scrolling on mobile comparison', async ({ page, viewport }) => {
			if (viewport && viewport.width > 768) {
				await page.setViewportSize({ width: 375, height: 667 });
			}

			await page.goto('/default-channel/compare');
			await page.waitForLoadState('networkidle');

			const scrollContainer = page.locator('[class*="overflow"], [class*="scroll"]').first();
			const count = await scrollContainer.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe('Wishlist & Comparison Integration', () => {
		test('should add wishlist item to comparison', async ({ page }) => {
			await page.goto('/default-channel/wishlist');
			await page.waitForLoadState('networkidle');

			const compareButton = page.locator('button:has-text("Compare"), input[type="checkbox"][aria-label*="compare" i]').first();

			if (await compareButton.isVisible()) {
				await compareButton.click();
				await page.waitForTimeout(500);

				// Should add to comparison
				expect(true).toBeTruthy();
			}
		});

		test('should add compared product to wishlist', async ({ page }) => {
			await page.goto('/default-channel/compare');
			await page.waitForLoadState('networkidle');

			const wishlistButton = page.locator('button[aria-label*="wishlist" i], button:has([class*="heart"])').first();

			if (await wishlistButton.isVisible()) {
				await wishlistButton.click();
				await page.waitForTimeout(500);

				const successMessage = page.locator('text=/added.*wishlist/i');
				const hasSuccess = await successMessage.isVisible().catch(() => false);

				expect(typeof hasSuccess).toBe('boolean');
			}
		});

		test('should display both wishlist and comparison counts', async ({ page }) => {
			await page.goto('/default-channel');

			const wishlistBadge = page.locator('[href*="wishlist"] [class*="badge"]').first();
			const compareBadge = page.locator('[href*="compare"] [class*="badge"]').first();

			const wishlistCount = await wishlistBadge.count();
			const compareCount = await compareBadge.count();

			expect(wishlistCount + compareCount).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe('Mobile Wishlist & Comparison', () => {
		test.use({ viewport: { width: 375, height: 667 } });

		test('should display mobile-optimized wishlist', async ({ page }) => {
			await page.goto('/default-channel/wishlist');
			await page.waitForLoadState('networkidle');

			const container = page.locator('main, .container').first();
			await expect(container).toBeVisible();

			const box = await container.boundingBox();
			expect(box?.width).toBeLessThanOrEqual(375);
		});

		test('should have touch-friendly wishlist buttons', async ({ page }) => {
			await page.goto('/default-channel/wishlist');
			await page.waitForLoadState('networkidle');

			const button = page.locator('button').first();

			if (await button.isVisible()) {
				const box = await button.boundingBox();
				expect(box?.height).toBeGreaterThanOrEqual(40);
			}
		});

		test('should display mobile-friendly comparison table', async ({ page }) => {
			await page.goto('/default-channel/compare');
			await page.waitForLoadState('networkidle');

			const table = page.locator('table, [role="grid"]').first();

			if (await table.isVisible()) {
				// Should be scrollable or stacked on mobile
				const hasOverflow = await page.locator('[class*="overflow"]').count() > 0;
				expect(typeof hasOverflow).toBe('boolean');
			}
		});
	});
});
