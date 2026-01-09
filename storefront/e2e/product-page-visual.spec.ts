import { test, expect } from '@playwright/test';

test.describe('Product Page - Visual Regression', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/default-channel/products/apple-juice');
		await page.waitForLoadState('networkidle');
		// Wait for images to load
		await page.waitForTimeout(2000);
	});

	test('should match full page screenshot', async ({ page }) => {
		await expect(page).toHaveScreenshot('product-page-full.png', {
			fullPage: true,
			timeout: 10000,
		});
	});

	test('should match hero section screenshot', async ({ page }) => {
		const hero = page.locator('.grid.grid-cols-1.lg\\:grid-cols-2').first();
		await expect(hero).toHaveScreenshot('product-hero.png');
	});

	test('should match image gallery screenshot', async ({ page }) => {
		const gallery = page.locator('.space-y-4').first();
		await expect(gallery).toHaveScreenshot('image-gallery.png');
	});

	test('should match size guide modal screenshot', async ({ page }) => {
		await page.getByRole('button', { name: /View Size Guide/i }).click();
		await page.waitForTimeout(500); // Wait for animation

		const modal = page.locator('.max-w-3xl');
		await expect(modal).toHaveScreenshot('size-guide-modal.png');
	});

	test('should match comparison table screenshot', async ({ page }) => {
		await page.getByRole('button', { name: /Compare with Similar Products/i }).click();
		await page.waitForTimeout(2000);

		const comparison = page.locator('.bg-white.rounded-xl.shadow-lg');
		await expect(comparison).toHaveScreenshot('comparison-table.png');
	});

	test('should match Q&A section screenshot', async ({ page }) => {
		await page.getByRole('button', { name: /Q&A/i }).click();
		await page.waitForTimeout(1500);

		const qaSection = page.locator('.space-y-6').first();
		await expect(qaSection).toHaveScreenshot('qa-section.png');
	});

	test('should match flash sale timer screenshot', async ({ page }) => {
		const timer = page.locator('.animate-gradient').first();
		await expect(timer).toHaveScreenshot('flash-timer.png');
	});

	test('should match trust badges screenshot', async ({ page }) => {
		const badges = page.locator('.grid.grid-cols-3.gap-4');
		await expect(badges).toHaveScreenshot('trust-badges.png');
	});

	test('should match product tabs screenshot', async ({ page }) => {
		const tabs = page.locator('.bg-white.rounded-xl.shadow-sm.border').first();
		await expect(tabs).toHaveScreenshot('product-tabs.png');
	});

	test('should match shipping tab content screenshot', async ({ page }) => {
		await page.getByRole('button', { name: /Shipping & Returns/i }).click();
		await page.waitForTimeout(500);

		const shippingContent = page.locator('.space-y-6').first();
		await expect(shippingContent).toHaveScreenshot('shipping-content.png');
	});

	test.describe('Hover States', () => {
		test('should capture image gallery hover state', async ({ page }) => {
			const gallery = page.locator('.group').first();
			await gallery.hover();
			await page.waitForTimeout(300);

			await expect(gallery).toHaveScreenshot('gallery-hover.png');
		});

		test('should capture button hover state', async ({ page }) => {
			const button = page.getByRole('button', { name: /Add to Cart/i });
			await button.hover();
			await page.waitForTimeout(200);

			await expect(button).toHaveScreenshot('button-hover.png');
		});

		test('should capture tab hover state', async ({ page }) => {
			const tab = page.getByRole('button', { name: /Reviews/i });
			await tab.hover();
			await page.waitForTimeout(200);

			await expect(tab).toHaveScreenshot('tab-hover.png');
		});
	});

	test.describe('Active States', () => {
		test('should capture selected thumbnail', async ({ page }) => {
			const thumbnails = page.locator('.aspect-square.bg-white.rounded-lg');
			const count = await thumbnails.count();

			if (count > 1) {
				await thumbnails.nth(1).click();
				await page.waitForTimeout(300);

				await expect(thumbnails.nth(1)).toHaveScreenshot('thumbnail-active.png');
			}
		});

		test('should capture active tab', async ({ page }) => {
			const tab = page.getByRole('button', { name: /Reviews/i });
			await tab.click();
			await page.waitForTimeout(500);

			await expect(tab).toHaveScreenshot('tab-active.png');
		});
	});

	test.describe('Loading States', () => {
		test('should capture loading spinner', async ({ page }) => {
			await page.goto('/default-channel/products/apple-juice');

			const spinner = page.locator('.animate-spin').first();
			await expect(spinner).toHaveScreenshot('loading-spinner.png', {
				timeout: 1000,
			});
		});
	});

	test.describe('Mobile Visual Tests', () => {
		test.use({ viewport: { width: 375, height: 667 } });

		test('should match mobile full page', async ({ page }) => {
			await expect(page).toHaveScreenshot('mobile-full-page.png', {
				fullPage: true,
			});
		});

		test('should match mobile hero section', async ({ page }) => {
			const hero = page.locator('.space-y-4').first();
			await expect(hero).toHaveScreenshot('mobile-hero.png');
		});

		test('should match mobile tabs', async ({ page }) => {
			const tabs = page.locator('.overflow-x-auto.scrollbar-hide');
			await expect(tabs).toHaveScreenshot('mobile-tabs.png');
		});

		test('should match mobile buttons', async ({ page }) => {
			const button = page.getByRole('button', { name: /Add to Cart/i });
			await expect(button).toHaveScreenshot('mobile-button.png');
		});
	});

	test.describe('Cross-Browser Visual Tests', () => {
		test('should look consistent across browsers', async ({ page, browserName }) => {
			await expect(page).toHaveScreenshot(`${browserName}-full-page.png`, {
				fullPage: true,
				maxDiffPixels: 100, // Allow slight differences between browsers
			});
		});
	});

	test.describe('Dark Mode Support', () => {
		test('should handle system dark mode preference', async ({ page }) => {
			await page.emulateMedia({ colorScheme: 'dark' });
			await page.reload();
			await page.waitForLoadState('networkidle');

			// Capture in dark mode
			await expect(page).toHaveScreenshot('dark-mode-full.png', {
				fullPage: true,
			});
		});
	});

	test.describe('Animation States', () => {
		test('should capture gradient animation frame', async ({ page }) => {
			const gradient = page.locator('.animate-gradient');
			await page.waitForTimeout(1500); // Mid-animation

			await expect(gradient).toHaveScreenshot('gradient-mid-animation.png');
		});

		test('should capture fade-in animation', async ({ page }) => {
			const fadeElement = page.locator('.animate-fadeIn').first();
			await expect(fadeElement).toHaveScreenshot('fade-in.png');
		});
	});

	test.describe('Responsive Breakpoints', () => {
		const breakpoints = [
			{ name: 'mobile-sm', width: 320, height: 568 },
			{ name: 'mobile', width: 375, height: 667 },
			{ name: 'mobile-lg', width: 414, height: 896 },
			{ name: 'tablet', width: 768, height: 1024 },
			{ name: 'desktop-sm', width: 1024, height: 768 },
			{ name: 'desktop', width: 1440, height: 900 },
			{ name: 'desktop-lg', width: 1920, height: 1080 },
		];

		for (const breakpoint of breakpoints) {
			test(`should match ${breakpoint.name} viewport`, async ({ page }) => {
				await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
				await page.reload();
				await page.waitForLoadState('networkidle');
				await page.waitForTimeout(1000);

				await expect(page).toHaveScreenshot(`${breakpoint.name}-view.png`, {
					fullPage: false, // Just above the fold
				});
			});
		}
	});
});
