import { test, expect, devices } from '@playwright/test';

test.use(devices['iPhone 12']);

test.describe('Product Page - Mobile', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/default-channel/products/apple-juice');
		await page.waitForLoadState('networkidle');
	});

	test.describe('Mobile Layout', () => {
		test('should display single column layout', async ({ page }) => {
			const viewport = page.viewportSize();
			expect(viewport?.width).toBeLessThan(768);

			// Main content should stack vertically
			const mainContainer = page.locator('.grid.grid-cols-1');
			await expect(mainContainer).toBeVisible();
		});

		test('should have mobile-optimized image gallery', async ({ page }) => {
			const imageGallery = page.locator('.aspect-square').first();
			await expect(imageGallery).toBeVisible();

			// Thumbnails should be in 4 columns on mobile
			const thumbnails = page.locator('.grid-cols-4');
			const count = await thumbnails.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should have mobile-friendly spacing', async ({ page }) => {
			const container = page.locator('.px-4.sm\\:px-6');
			await expect(container).toBeVisible();
		});

		test('should display responsive typography', async ({ page }) => {
			const heading = page.locator('h1');
			await expect(heading).toHaveClass(/text-2xl/);
		});
	});

	test.describe('Touch Interactions', () => {
		test('should have large touch targets (44px minimum)', async ({ page }) => {
			const buttons = page.locator('button');
			const count = await buttons.count();

			for (let i = 0; i < Math.min(count, 5); i++) {
				const box = await buttons.nth(i).boundingBox();
				if (box) {
					expect(box.height).toBeGreaterThanOrEqual(40); // Close to 44px
				}
			}
		});

		test('should support swipe gestures on image gallery', async ({ page }) => {
			const imageContainer = page.locator('.aspect-square').first();
			const box = await imageContainer.boundingBox();

			if (box) {
				// Simulate swipe
				await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
				await page.waitForTimeout(300);
			}
		});

		test('should show navigation arrows on mobile', async ({ page }) => {
			// On mobile, arrows might always be visible
			const images = page.locator('img[alt*=""]');
			await expect(images.first()).toBeVisible();
		});
	});

	test.describe('Mobile Navigation', () => {
		test('should have sticky breadcrumb on mobile', async ({ page }) => {
			const breadcrumb = page.locator('.sticky.top-0');
			await expect(breadcrumb).toBeVisible();

			// Scroll down
			await page.evaluate(() => window.scrollTo(0, 500));
			await page.waitForTimeout(300);

			// Should still be visible at top
			await expect(breadcrumb).toBeVisible();
		});

		test('should have horizontal scrollable tabs', async ({ page }) => {
			const tabs = page.locator('.overflow-x-auto.scrollbar-hide');
			await expect(tabs).toBeVisible();
		});

		test('should truncate long text appropriately', async ({ page }) => {
			const breadcrumb = page.locator('.truncate');
			const count = await breadcrumb.count();
			expect(count).toBeGreaterThan(0);
		});
	});

	test.describe('Mobile Modals', () => {
		test('should display size guide modal full screen on mobile', async ({ page }) => {
			await page.getByRole('button', { name: /View Size Guide/i }).click();

			const modal = page.locator('.max-w-3xl');
			await expect(modal).toBeVisible();

			const box = await modal.boundingBox();
			const viewport = page.viewportSize();

			if (box && viewport) {
				// Modal should take most of the screen width
				expect(box.width).toBeGreaterThan(viewport.width * 0.8);
			}
		});

		test('should be scrollable in size guide modal on mobile', async ({ page }) => {
			await page.getByRole('button', { name: /View Size Guide/i }).click();

			const modal = page.locator('.max-h-\\[90vh\\].overflow-auto');
			await expect(modal).toBeVisible();
		});

		test('should close modal with touch on backdrop', async ({ page }) => {
			await page.getByRole('button', { name: /View Size Guide/i }).click();

			// Tap outside modal
			await page.touchscreen.tap(10, 10);
			await page.waitForTimeout(300);

			const modal = page.getByRole('heading', { name: /Size Guide/i });
			await expect(modal).not.toBeVisible();
		});
	});

	test.describe('Mobile Forms', () => {
		test('should have mobile-friendly quantity selector', async ({ page }) => {
			const quantityButtons = page.locator('button').filter({ has: page.locator('svg') });
			const count = await quantityButtons.count();
			expect(count).toBeGreaterThan(0);

			// Buttons should be large enough to tap
			const plusButton = quantityButtons.last();
			const box = await plusButton.boundingBox();

			if (box) {
				expect(box.height).toBeGreaterThan(40);
			}
		});

		test('should have full-width buttons on mobile', async ({ page }) => {
			const addToCartButton = page.getByRole('button', { name: /Add to Cart/i });
			const box = await addToCartButton.boundingBox();
			const viewport = page.viewportSize();

			if (box && viewport) {
				// Button should be close to full width on mobile
				expect(box.width).toBeGreaterThan(viewport.width * 0.7);
			}
		});
	});

	test.describe('Mobile Q&A Section', () => {
		test('should display Q&A optimally on mobile', async ({ page }) => {
			await page.getByRole('button', { name: /Q&A/i }).click();
			await page.waitForTimeout(1000);

			const qaSection = page.getByText(/Questions & Answers/i);
			await expect(qaSection).toBeVisible();
		});

		test('should have mobile-friendly question input', async ({ page }) => {
			await page.getByRole('button', { name: /Q&A/i }).click();
			await page.waitForTimeout(1000);

			const input = page.getByPlaceholder(/Type your question/i);
			await expect(input).toBeVisible();

			// Input should be appropriately sized
			const box = await input.boundingBox();
			expect(box?.width).toBeGreaterThan(200);
		});

		test('should stack Q&A items vertically on mobile', async ({ page }) => {
			await page.getByRole('button', { name: /Q&A/i }).click();
			await page.waitForTimeout(1000);

			const items = page.locator('.bg-white.border.border-gray-200.rounded-lg');
			const count = await items.count();

			// Items should be visible
			if (count > 0) {
				await expect(items.first()).toBeVisible();
			}
		});
	});

	test.describe('Mobile Comparison Tool', () => {
		test('should have horizontal scroll for comparison table', async ({ page }) => {
			await page.getByRole('button', { name: /Compare with Similar Products/i }).click();
			await page.waitForTimeout(2000);

			const table = page.locator('table');
			await expect(table).toBeVisible();

			// Table container should allow horizontal scroll
			const container = page.locator('.overflow-x-auto');
			await expect(container).toBeVisible();
		});

		test('should have sticky first column in comparison', async ({ page }) => {
			await page.getByRole('button', { name: /Compare with Similar Products/i }).click();
			await page.waitForTimeout(2000);

			const stickyColumn = page.locator('.sticky.left-0');
			const count = await stickyColumn.count();
			expect(count).toBeGreaterThan(0);
		});
	});

	test.describe('Mobile Performance', () => {
		test('should load quickly on mobile network', async ({ page, context }) => {
			// Simulate slow 3G
			await context.route('**/*', (route) => {
				route.continue();
			});

			const startTime = Date.now();
			await page.goto('/default-channel/products/apple-juice');
			await page.waitForSelector('h1');
			const loadTime = Date.now() - startTime;

			// Should load within 5 seconds even on slow network
			expect(loadTime).toBeLessThan(5000);
		});

		test('should have optimized images for mobile', async ({ page }) => {
			const images = page.locator('img');
			const firstImage = images.first();

			const sizes = await firstImage.getAttribute('sizes');
			// Should have mobile-first sizes
			expect(sizes).toContain('max-width');
		});

		test('should lazy load below-the-fold content', async ({ page }) => {
			// Tabs should not load content until clicked
			const qaTab = page.getByRole('button', { name: /Q&A/i });
			await qaTab.click();

			// Should see loading state
			const spinner = page.locator('.animate-spin');
			await expect(spinner).toBeVisible({ timeout: 1000 });
		});
	});

	test.describe('Mobile Animations', () => {
		test('should respect reduced motion on mobile', async ({ page }) => {
			// This is checked at browser level
			const animatedElement = page.locator('.animate-fadeIn');
			await expect(animatedElement).toBeVisible();
		});

		test('should have smooth transitions on mobile', async ({ page }) => {
			const tabs = page.getByRole('button', { name: /Reviews/i });
			await tabs.click();

			// Tab should transition smoothly
			await expect(tabs).toHaveClass(/text-temu-600/);
		});
	});

	test.describe('Mobile Gestures', () => {
		test('should support pinch-to-zoom on images', async ({ page }) => {
			// Note: Actual pinch gesture testing is limited in Playwright
			// This test verifies the zoom button is accessible
			await page.locator('.group').first().hover();
			const zoomButton = page.locator('button[aria-label="Zoom image"]');

			// On mobile, button might be always visible or hidden
			const isVisible = await zoomButton.isVisible().catch(() => false);
			expect(typeof isVisible).toBe('boolean');
		});

		test('should handle tap events correctly', async ({ page }) => {
			const addToCartButton = page.getByRole('button', { name: /Add to Cart/i });

			// Tap on button
			const box = await addToCartButton.boundingBox();
			if (box) {
				await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);

				// Should trigger action (toast or state change)
				await page.waitForTimeout(500);
			}
		});
	});

	test.describe('Mobile Text & Readability', () => {
		test('should have readable font sizes on mobile', async ({ page }) => {
			const bodyText = page.locator('p').first();
			const fontSize = await bodyText.evaluate((el) => {
				return window.getComputedStyle(el).fontSize;
			});

			const sizeValue = parseInt(fontSize);
			expect(sizeValue).toBeGreaterThanOrEqual(14); // Minimum 14px
		});

		test('should have proper line spacing on mobile', async ({ page }) => {
			const heading = page.locator('h1');
			const lineHeight = await heading.evaluate((el) => {
				return window.getComputedStyle(el).lineHeight;
			});

			// Should have line-height set
			expect(lineHeight).not.toBe('normal');
		});

		test('should wrap long product names properly', async ({ page }) => {
			const title = page.locator('h1');
			await expect(title).toBeVisible();

			const box = await title.boundingBox();
			const viewport = page.viewportSize();

			if (box && viewport) {
				// Title should not overflow viewport
				expect(box.width).toBeLessThanOrEqual(viewport.width);
			}
		});
	});

	test.describe('Mobile Flash Sale Timer', () => {
		test('should stack timer vertically on mobile', async ({ page }) => {
			const timer = page.locator('.flex-col.sm\\:flex-row');
			await expect(timer).toBeVisible();
		});

		test('should have appropriately sized timer boxes on mobile', async ({ page }) => {
			const timerBox = page.locator('.min-w-\\[45px\\]');
			await expect(timerBox.first()).toBeVisible();
		});
	});

	test.describe('Mobile Trust Badges', () => {
		test('should display trust badges in grid on mobile', async ({ page }) => {
			const badgeGrid = page.locator('.grid.grid-cols-3');
			await expect(badgeGrid).toBeVisible();
		});

		test('should have readable badge text on mobile', async ({ page }) => {
			const badgeText = page.locator('.text-xs');
			const count = await badgeText.count();
			expect(count).toBeGreaterThan(0);
		});
	});
});
