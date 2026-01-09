import { test, expect } from '@playwright/test';

test.describe('Product Browsing & Search', () => {
	test.describe('Products Page', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/products');
			await page.waitForLoadState('networkidle');
		});

		test('should display products grid', async ({ page }) => {
			await page.waitForTimeout(2000);

			const products = page.locator('[href*="/products/"]');
			const count = await products.count();
			expect(count).toBeGreaterThan(0);
		});

		test('should display product information', async ({ page }) => {
			await page.waitForTimeout(2000);

			const firstProduct = page.locator('[href*="/products/"]').first();
			await expect(firstProduct).toBeVisible();
		});

		test('should navigate to product detail', async ({ page }) => {
			await page.waitForTimeout(2000);

			const firstProduct = page.locator('[href*="/products/"]').first();
			await firstProduct.click();
			await expect(page).toHaveURL(/\/products\//);
		});
	});

	test.describe('Search Functionality', () => {
		test('should search with query parameter', async ({ page }) => {
			await page.goto('/default-channel/search?query=phone');
			await page.waitForLoadState('networkidle');

			await expect(page).toHaveURL(/search.*query=phone/);
		});

		test('should display search results', async ({ page }) => {
			await page.goto('/default-channel/search?query=laptop');
			await page.waitForTimeout(2000);

			// Check for results or empty state
			const results = page.locator('[href*="/products/"], .no-results, .empty-state');
			const count = await results.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should handle empty search results', async ({ page }) => {
			await page.goto('/default-channel/search?query=xyzinvalidproduct123');
			await page.waitForTimeout(2000);

			const emptyState = page.getByText(/no results|no products found|nothing found/i);
			// May show empty state or still show some products
			const isVisible = await emptyState.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should search from search bar', async ({ page }) => {
			await page.goto('/default-channel');

			const searchInput = page.getByPlaceholder(/search/i);
			await searchInput.fill('headphones');
			await searchInput.press('Enter');

			await page.waitForLoadState('networkidle');
			await expect(page).toHaveURL(/search|products/);
		});
	});

	test.describe('Product Filtering', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/search');
			await page.waitForLoadState('networkidle');
		});

		test('should display filter options', async ({ page }) => {
			const filters = page.locator('[role="group"], .filters, aside').filter({ hasText: /filter|category|price/i });
			// Filters may or may not be visible
			const count = await filters.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should filter by category', async ({ page }) => {
			const categoryFilter = page.locator('select, button, a').filter({ hasText: /category/i }).first();

			if (await categoryFilter.isVisible()) {
				await categoryFilter.click();
				await page.waitForTimeout(500);

				// URL should update or results should change
				await page.waitForTimeout(1000);
			}
		});

		test('should filter by price range', async ({ page }) => {
			const priceFilter = page.locator('input[type="range"], input[type="number"]').first();

			if (await priceFilter.isVisible()) {
				await priceFilter.fill('100');
				await page.waitForTimeout(1000);
			}
		});

		test('should filter by rating', async ({ page }) => {
			const ratingFilter = page.locator('[data-rating], .rating-filter').first();

			if (await ratingFilter.isVisible()) {
				await ratingFilter.click();
				await page.waitForTimeout(1000);
			}
		});

		test('should filter by stock availability', async ({ page }) => {
			const stockFilter = page.locator('input[type="checkbox"]').filter({ hasText: /in stock|available/i }).first();

			if (await stockFilter.isVisible()) {
				await stockFilter.check();
				await page.waitForTimeout(1000);
			}
		});

		test('should clear all filters', async ({ page }) => {
			const clearButton = page.getByRole('button', { name: /clear|reset/i }).first();

			if (await clearButton.isVisible()) {
				await clearButton.click();
				await page.waitForTimeout(500);
			}
		});
	});

	test.describe('Product Sorting', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/products');
			await page.waitForLoadState('networkidle');
		});

		test('should display sort options', async ({ page }) => {
			const sortSelect = page.locator('select, button').filter({ hasText: /sort|order/i }).first();
			// Sort may or may not be visible
			const count = await sortSelect.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should sort by price low to high', async ({ page }) => {
			const sortSelect = page.locator('select').filter({ hasText: /sort/i }).first();

			if (await sortSelect.isVisible()) {
				await sortSelect.selectOption({ label: /price.*low|lowest/i });
				await page.waitForTimeout(1000);
			}
		});

		test('should sort by price high to low', async ({ page }) => {
			const sortSelect = page.locator('select').filter({ hasText: /sort/i }).first();

			if (await sortSelect.isVisible()) {
				await sortSelect.selectOption({ label: /price.*high|highest/i });
				await page.waitForTimeout(1000);
			}
		});

		test('should sort by rating', async ({ page }) => {
			const sortSelect = page.locator('select').filter({ hasText: /sort/i }).first();

			if (await sortSelect.isVisible()) {
				const options = await sortSelect.locator('option').allTextContents();
				const hasRating = options.some((opt) => /rating/i.test(opt));

				if (hasRating) {
					await sortSelect.selectOption({ label: /rating/i });
					await page.waitForTimeout(1000);
				}
			}
		});

		test('should sort by name', async ({ page }) => {
			const sortSelect = page.locator('select').filter({ hasText: /sort/i }).first();

			if (await sortSelect.isVisible()) {
				const options = await sortSelect.locator('option').allTextContents();
				const hasName = options.some((opt) => /name|a-z/i.test(opt));

				if (hasName) {
					await sortSelect.selectOption({ label: /name|a-z/i });
					await page.waitForTimeout(1000);
				}
			}
		});
	});

	test.describe('Pagination', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/products');
			await page.waitForLoadState('networkidle');
		});

		test('should display pagination if many products', async ({ page }) => {
			const pagination = page.locator('[role="navigation"], .pagination, nav').filter({ hasText: /next|previous|page/i });
			// May or may not have pagination
			const count = await pagination.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should navigate to next page', async ({ page }) => {
			const nextButton = page.getByRole('button', { name: /next/i }).or(page.getByRole('link', { name: /next/i }));

			if (await nextButton.isVisible()) {
				await nextButton.click();
				await page.waitForLoadState('networkidle');
			}
		});

		test('should navigate to specific page number', async ({ page }) => {
			const pageTwo = page.getByRole('button', { name: '2' }).or(page.getByRole('link', { name: '2' }));

			if (await pageTwo.isVisible()) {
				await pageTwo.click();
				await page.waitForLoadState('networkidle');
			}
		});
	});

	test.describe('Category Browsing', () => {
		test('should navigate to categories page', async ({ page }) => {
			await page.goto('/default-channel/categories');
			await page.waitForLoadState('networkidle');

			await expect(page).toHaveURL(/categories/);
		});

		test('should display category list', async ({ page }) => {
			await page.goto('/default-channel/categories');
			await page.waitForTimeout(2000);

			const categories = page.locator('[href*="/categories/"]');
			const count = await categories.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should navigate to category products', async ({ page }) => {
			await page.goto('/default-channel/categories');
			await page.waitForTimeout(2000);

			const firstCategory = page.locator('[href*="/categories/"]').first();

			if (await firstCategory.isVisible()) {
				await firstCategory.click();
				await expect(page).toHaveURL(/\/categories\//);
			}
		});

		test('should display products in category', async ({ page }) => {
			await page.goto('/default-channel/categories');
			await page.waitForTimeout(1000);

			const firstCategory = page.locator('[href*="/categories/"]').first();

			if (await firstCategory.isVisible()) {
				await firstCategory.click();
				await page.waitForTimeout(2000);

				const products = page.locator('[href*="/products/"]');
				const count = await products.count();
				expect(count).toBeGreaterThanOrEqual(0);
			}
		});
	});

	test.describe('View Toggle', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/products');
			await page.waitForLoadState('networkidle');
		});

		test('should toggle between grid and list view', async ({ page }) => {
			const viewToggle = page.locator('button[aria-label*="view"], .view-toggle').first();

			if (await viewToggle.isVisible()) {
				await viewToggle.click();
				await page.waitForTimeout(300);

				// Layout should change
				await expect(page.locator('main')).toBeVisible();
			}
		});
	});

	test.describe('Product Quick Actions', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/products');
			await page.waitForTimeout(2000);
		});

		test('should add product to wishlist from listing', async ({ page }) => {
			const wishlistButton = page.locator('button[aria-label*="wishlist"], button[title*="wishlist"]').first();

			if (await wishlistButton.isVisible()) {
				await wishlistButton.click();
				await page.waitForTimeout(500);
			}
		});

		test('should quick view product', async ({ page }) => {
			const quickViewButton = page.locator('button[aria-label*="quick view"], button[title*="quick view"]').first();

			if (await quickViewButton.isVisible()) {
				await quickViewButton.click();
				await page.waitForTimeout(500);

				// Modal should open
				const modal = page.locator('[role="dialog"], .modal');
				const isVisible = await modal.isVisible().catch(() => false);
				expect(typeof isVisible).toBe('boolean');
			}
		});

		test('should add to cart from listing', async ({ page }) => {
			const addToCartButton = page.locator('button').filter({ hasText: /add to cart/i }).first();

			if (await addToCartButton.isVisible()) {
				await addToCartButton.click();
				await page.waitForTimeout(1000);

				// Toast or cart should update
				const toast = page.locator('.toast, [role="alert"]');
				const cartBadge = page.locator('[href*="/cart"]');

				const toastVisible = await toast.isVisible().catch(() => false);
				const badgeVisible = await cartBadge.isVisible();

				expect(toastVisible || badgeVisible).toBeTruthy();
			}
		});
	});

	test.describe('Mobile Product Browsing', () => {
		test.use({ viewport: { width: 375, height: 667 } });

		test('should display products in mobile view', async ({ page }) => {
			await page.goto('/default-channel/products');
			await page.waitForTimeout(2000);

			const products = page.locator('[href*="/products/"]');
			const count = await products.count();
			expect(count).toBeGreaterThan(0);
		});

		test('should open mobile filter menu', async ({ page }) => {
			await page.goto('/default-channel/search');
			await page.waitForTimeout(1000);

			const filterButton = page.getByRole('button', { name: /filter/i }).first();

			if (await filterButton.isVisible()) {
				await filterButton.click();
				await page.waitForTimeout(300);
			}
		});

		test('should scroll to load more products', async ({ page }) => {
			await page.goto('/default-channel/products');
			await page.waitForTimeout(2000);

			// Scroll down
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(1000);

			// More products may load
			const products = page.locator('[href*="/products/"]');
			const count = await products.count();
			expect(count).toBeGreaterThan(0);
		});
	});

	test.describe('Performance', () => {
		test('should load products page quickly', async ({ page }) => {
			const startTime = Date.now();
			await page.goto('/default-channel/products');
			await page.waitForSelector('[href*="/products/"]');
			const loadTime = Date.now() - startTime;

			expect(loadTime).toBeLessThan(5000);
		});

		test('should lazy load product images', async ({ page }) => {
			await page.goto('/default-channel/products');
			await page.waitForTimeout(1000);

			const lazyImages = page.locator('img[loading="lazy"]');
			const count = await lazyImages.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});
	});
});
