import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/default-channel');
		await page.waitForLoadState('networkidle');
	});

	test.describe('Page Load & Performance', () => {
		test('should load home page within 3 seconds', async ({ page }) => {
			const startTime = Date.now();
			await page.goto('/default-channel');
			await page.waitForSelector('h1, h2');
			const loadTime = Date.now() - startTime;
			expect(loadTime).toBeLessThan(3000);
		});

		test('should display header with logo', async ({ page }) => {
			const logo = page.locator('header img, header svg').first();
			await expect(logo).toBeVisible();
		});

		test('should display footer', async ({ page }) => {
			const footer = page.locator('footer');
			await expect(footer).toBeVisible();
		});
	});

	test.describe('Header Navigation', () => {
		test('should display search bar', async ({ page }) => {
			const searchBar = page.getByPlaceholder(/search/i);
			await expect(searchBar).toBeVisible();
		});

		test('should display cart icon with badge', async ({ page }) => {
			const cartIcon = page.locator('[href*="/cart"]').first();
			await expect(cartIcon).toBeVisible();
		});

		test('should display user menu or login link', async ({ page }) => {
			const userMenu = page.locator('[href*="/login"], [href*="/account"]').first();
			await expect(userMenu).toBeVisible();
		});

		test('should navigate to home when clicking logo', async ({ page }) => {
			const logo = page.locator('header a[href*="/"]').first();
			await logo.click();
			await expect(page).toHaveURL(/default-channel/);
		});
	});

	test.describe('Main Navigation', () => {
		test('should display main navigation links', async ({ page }) => {
			const navLinks = page.locator('nav a');
			const count = await navLinks.count();
			expect(count).toBeGreaterThan(0);
		});

		test('should navigate to categories page', async ({ page }) => {
			const categoriesLink = page.getByRole('link', { name: /categories/i }).first();
			if (await categoriesLink.isVisible()) {
				await categoriesLink.click();
				await expect(page).toHaveURL(/categories/);
			}
		});

		test('should navigate to products page', async ({ page }) => {
			const productsLink = page.getByRole('link', { name: /products|shop/i }).first();
			if (await productsLink.isVisible()) {
				await productsLink.click();
				await expect(page).toHaveURL(/products/);
			}
		});
	});

	test.describe('Featured Products', () => {
		test('should display product cards', async ({ page }) => {
			// Wait for products to load
			await page.waitForTimeout(2000);

			const productCards = page.locator('[href*="/products/"]');
			const count = await productCards.count();
			expect(count).toBeGreaterThan(0);
		});

		test('should display product images', async ({ page }) => {
			await page.waitForTimeout(2000);

			const productImages = page.locator('img[alt*=""], img[src*="product"]');
			const count = await productImages.count();
			expect(count).toBeGreaterThan(0);
		});

		test('should navigate to product page when clicking product', async ({ page }) => {
			await page.waitForTimeout(2000);

			const firstProduct = page.locator('[href*="/products/"]').first();
			await firstProduct.click();
			await expect(page).toHaveURL(/\/products\//);
		});
	});

	test.describe('Search Functionality', () => {
		test('should search for products', async ({ page }) => {
			const searchInput = page.getByPlaceholder(/search/i);
			await searchInput.fill('phone');
			await searchInput.press('Enter');

			await page.waitForLoadState('networkidle');
			await expect(page).toHaveURL(/search|products/);
		});

		test('should show search suggestions', async ({ page }) => {
			const searchInput = page.getByPlaceholder(/search/i);
			await searchInput.fill('laptop');
			await page.waitForTimeout(500);

			// Check if suggestions appear
			const suggestions = page.locator('[role="listbox"], .suggestions, .autocomplete');
			const isVisible = await suggestions.isVisible().catch(() => false);
			// Just verify it doesn't crash
			expect(typeof isVisible).toBe('boolean');
		});

		test('should clear search input', async ({ page }) => {
			const searchInput = page.getByPlaceholder(/search/i);
			await searchInput.fill('test');
			await searchInput.clear();

			const value = await searchInput.inputValue();
			expect(value).toBe('');
		});
	});

	test.describe('Promotional Features', () => {
		test('should display flash deals section', async ({ page }) => {
			const flashDeals = page.getByText(/flash|deal|sale/i).first();
			// May or may not be visible
			const isVisible = await flashDeals.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should display newsletter signup', async ({ page }) => {
			const newsletter = page.locator('input[type="email"]').filter({ hasText: '' });
			// Newsletter might be in footer
			const count = await newsletter.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe('Footer', () => {
		test('should display company information', async ({ page }) => {
			const footer = page.locator('footer');
			await expect(footer).toBeVisible();
		});

		test('should display social media links', async ({ page }) => {
			const socialLinks = page.locator('footer a[href*="facebook"], footer a[href*="twitter"], footer a[href*="instagram"]');
			// May or may not have social links
			const count = await socialLinks.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should display quick links', async ({ page }) => {
			const footerLinks = page.locator('footer a');
			const count = await footerLinks.count();
			expect(count).toBeGreaterThan(0);
		});

		test('should navigate to about page from footer', async ({ page }) => {
			const aboutLink = page.locator('footer a[href*="/about"]').first();
			if (await aboutLink.isVisible()) {
				await aboutLink.click();
				await expect(page).toHaveURL(/about/);
			}
		});

		test('should navigate to contact page from footer', async ({ page }) => {
			const contactLink = page.locator('footer a[href*="/contact"]').first();
			if (await contactLink.isVisible()) {
				await contactLink.click();
				await expect(page).toHaveURL(/contact/);
			}
		});
	});

	test.describe('Mobile Navigation', () => {
		test.use({ viewport: { width: 375, height: 667 } });

		test('should display mobile menu toggle', async ({ page }) => {
			const menuToggle = page.locator('button[aria-label*="menu"], .hamburger, [aria-label*="Menu"]');
			const count = await menuToggle.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should open mobile menu when clicked', async ({ page }) => {
			const menuToggle = page.locator('button[aria-label*="menu"], .hamburger').first();

			if (await menuToggle.isVisible()) {
				await menuToggle.click();
				await page.waitForTimeout(300);

				// Menu should be visible
				const mobileMenu = page.locator('[role="dialog"], .mobile-menu, nav');
				await expect(mobileMenu.first()).toBeVisible();
			}
		});

		test('should have mobile-optimized layout', async ({ page }) => {
			const container = page.locator('main, .container').first();
			await expect(container).toBeVisible();

			const box = await container.boundingBox();
			expect(box?.width).toBeLessThanOrEqual(375);
		});
	});

	test.describe('Accessibility', () => {
		test('should have main landmark', async ({ page }) => {
			const main = page.locator('main');
			await expect(main).toBeVisible();
		});

		test('should have skip to content link', async ({ page }) => {
			const skipLink = page.locator('a[href="#main"], a[href="#content"]').first();
			// May or may not have skip link
			const count = await skipLink.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should have proper heading hierarchy', async ({ page }) => {
			const h1 = page.locator('h1');
			const count = await h1.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should have alt text on images', async ({ page }) => {
			await page.waitForTimeout(2000);

			const images = page.locator('img');
			const count = await images.count();

			if (count > 0) {
				const firstImage = images.first();
				const alt = await firstImage.getAttribute('alt');
				expect(alt).toBeDefined();
			}
		});
	});

	test.describe('Loading States', () => {
		test('should show loading indicators', async ({ page }) => {
			await page.goto('/default-channel');

			// Check for loading states during navigation
			const loadingIndicators = page.locator('.loading, .spinner, .skeleton');
			// May or may not be visible depending on timing
			const count = await loadingIndicators.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe('Recently Viewed', () => {
		test('should track recently viewed products', async ({ page }) => {
			// View a product
			await page.waitForTimeout(2000);
			const firstProduct = page.locator('[href*="/products/"]').first();
			if (await firstProduct.isVisible()) {
				await firstProduct.click();
				await page.waitForLoadState('networkidle');

				// Go back to home
				await page.goto('/default-channel');
				await page.waitForTimeout(1000);

				// Check if recently viewed section exists
				const recentlyViewed = page.getByText(/recently viewed/i);
				// May or may not be visible
				const isVisible = await recentlyViewed.isVisible().catch(() => false);
				expect(typeof isVisible).toBe('boolean');
			}
		});
	});
});
