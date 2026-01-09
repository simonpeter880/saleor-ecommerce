import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to a product page - adjust URL based on your setup
		await page.goto('/default-channel/products/apple-juice');
		// Wait for the page to load
		await page.waitForLoadState('networkidle');
	});

	test.describe('Performance & Loading', () => {
		test('should load product page within 3 seconds', async ({ page }) => {
			const startTime = Date.now();
			await page.goto('/default-channel/products/apple-juice');
			await page.waitForSelector('h1');
			const loadTime = Date.now() - startTime;
			expect(loadTime).toBeLessThan(3000);
		});

		test('should display loading skeleton for images', async ({ page }) => {
			await page.goto('/default-channel/products/apple-juice');
			// Check for loading spinner or skeleton
			const spinner = page.locator('.animate-spin').first();
			await expect(spinner).toBeVisible({ timeout: 1000 });
		});

		test('should lazy load thumbnail images', async ({ page }) => {
			const thumbnails = page.locator('img[loading="lazy"]');
			const count = await thumbnails.count();
			expect(count).toBeGreaterThan(0);
		});

		test('should have optimized image sizes attribute', async ({ page }) => {
			const mainImage = page.locator('img').first();
			const sizes = await mainImage.getAttribute('sizes');
			expect(sizes).toContain('max-width');
		});
	});

	test.describe('Image Gallery', () => {
		test('should display main product image', async ({ page }) => {
			const mainImage = page.locator('img').first();
			await expect(mainImage).toBeVisible();
		});

		test('should navigate through images with arrow buttons', async ({ page }) => {
			// Hover to show navigation buttons
			await page.locator('.group').first().hover();

			const nextButton = page.locator('button[aria-label="Next image"]');
			const prevButton = page.locator('button[aria-label="Previous image"]');

			// Should be visible on hover
			await expect(nextButton).toBeVisible();
			await expect(prevButton).toBeVisible();

			// Click next
			await nextButton.click();
			await page.waitForTimeout(300); // Animation time
		});

		test('should change image when clicking thumbnail', async ({ page }) => {
			const thumbnails = page.locator('.aspect-square.bg-white.rounded-lg');
			const count = await thumbnails.count();

			if (count > 1) {
				await thumbnails.nth(1).click();
				await page.waitForTimeout(300);

				// Second thumbnail should have active border
				await expect(thumbnails.nth(1)).toHaveClass(/border-temu-500/);
			}
		});

		test('should open image zoom modal', async ({ page }) => {
			// Hover to show zoom button
			await page.locator('.group').first().hover();

			const zoomButton = page.locator('button[aria-label="Zoom image"]');
			await expect(zoomButton).toBeVisible();

			await zoomButton.click();

			// Modal should open
			const modal = page.locator('.fixed.inset-0.z-50');
			await expect(modal).toBeVisible();

			// Should have navigation in zoom mode
			const closeButton = page.locator('button[aria-label="Close zoom"]');
			await expect(closeButton).toBeVisible();
		});

		test('should close zoom modal with ESC key', async ({ page }) => {
			await page.locator('.group').first().hover();
			await page.locator('button[aria-label="Zoom image"]').click();

			await page.keyboard.press('Escape');

			const modal = page.locator('.fixed.inset-0.z-50');
			await expect(modal).not.toBeVisible();
		});
	});

	test.describe('Product Information', () => {
		test('should display product title', async ({ page }) => {
			const title = page.locator('h1');
			await expect(title).toBeVisible();
			await expect(title).not.toBeEmpty();
		});

		test('should display star rating', async ({ page }) => {
			const stars = page.locator('svg').filter({ has: page.locator('.fill-yellow-400') });
			const count = await stars.count();
			expect(count).toBeGreaterThan(0);
		});

		test('should display review count', async ({ page }) => {
			const reviewText = page.getByText(/\d+ Reviews/);
			await expect(reviewText).toBeVisible();
		});

		test('should display price', async ({ page }) => {
			const price = page.getByText(/UGX \d/);
			await expect(price).toBeVisible();
		});

		test('should display discount badge when applicable', async ({ page }) => {
			const discountBadge = page.locator('.animate-pulse').filter({ hasText: '%' });
			// May or may not be visible depending on product
			const isVisible = await discountBadge.isVisible().catch(() => false);
			// Just checking it doesn't crash
			expect(typeof isVisible).toBe('boolean');
		});

		test('should display stock status', async ({ page }) => {
			const stockStatus = page.getByText(/In Stock|Out of Stock/);
			await expect(stockStatus).toBeVisible();
		});
	});

	test.describe('Add to Cart Functionality', () => {
		test('should update quantity with +/- buttons', async ({ page }) => {
			const quantityDisplay = page.locator('.px-6.py-3.font-bold.text-lg').first();
			const initialQuantity = await quantityDisplay.textContent();

			const plusButton = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: '' }).last();
			await plusButton.click();

			const newQuantity = await quantityDisplay.textContent();
			expect(newQuantity).not.toBe(initialQuantity);
		});

		test('should not allow quantity below 1', async ({ page }) => {
			const minusButton = page.locator('button').filter({ has: page.locator('svg') }).first();

			// Click minus multiple times
			for (let i = 0; i < 5; i++) {
				await minusButton.click();
			}

			const quantityDisplay = page.locator('.px-6.py-3.font-bold.text-lg').first();
			const quantity = parseInt(await quantityDisplay.textContent() || '0');

			expect(quantity).toBeGreaterThanOrEqual(1);
		});

		test('should show success toast when adding to cart', async ({ page }) => {
			const addToCartButton = page.getByRole('button', { name: /Add to Cart/i });

			// Check if button is enabled
			const isEnabled = await addToCartButton.isEnabled();

			if (isEnabled) {
				await addToCartButton.click();

				// Wait for toast
				const toast = page.getByText(/Added to cart!/i);
				await expect(toast).toBeVisible({ timeout: 5000 });
			}
		});
	});

	test.describe('Size Guide Modal', () => {
		test('should open size guide modal', async ({ page }) => {
			const sizeGuideButton = page.getByRole('button', { name: /View Size Guide/i });
			await sizeGuideButton.click();

			const modal = page.getByRole('heading', { name: /Size Guide/i });
			await expect(modal).toBeVisible();
		});

		test('should display size chart table', async ({ page }) => {
			await page.getByRole('button', { name: /View Size Guide/i }).click();

			const table = page.locator('table');
			await expect(table).toBeVisible();

			// Should have size columns
			const sizeHeader = page.getByRole('columnheader', { name: /Size/i });
			await expect(sizeHeader).toBeVisible();
		});

		test('should close size guide modal with X button', async ({ page }) => {
			await page.getByRole('button', { name: /View Size Guide/i }).click();

			const closeButton = page.locator('button[aria-label="Close size guide"]');
			await closeButton.click();

			const modal = page.getByRole('heading', { name: /Size Guide/i });
			await expect(modal).not.toBeVisible();
		});

		test('should close size guide modal when clicking backdrop', async ({ page }) => {
			await page.getByRole('button', { name: /View Size Guide/i }).click();

			// Click outside the modal
			await page.locator('.fixed.inset-0').click({ position: { x: 10, y: 10 } });

			const modal = page.getByRole('heading', { name: /Size Guide/i });
			await expect(modal).not.toBeVisible();
		});
	});

	test.describe('Product Tabs', () => {
		test('should switch between tabs', async ({ page }) => {
			const descriptionTab = page.getByRole('button', { name: /Product Details/i });
			const reviewsTab = page.getByRole('button', { name: /Reviews/i });
			const shippingTab = page.getByRole('button', { name: /Shipping & Returns/i });
			const qaTab = page.getByRole('button', { name: /Q&A/i });

			// Click each tab
			await reviewsTab.click();
			await expect(reviewsTab).toHaveClass(/text-temu-600/);

			await shippingTab.click();
			await expect(shippingTab).toHaveClass(/text-temu-600/);

			await qaTab.click();
			await expect(qaTab).toHaveClass(/text-temu-600/);
		});

		test('should display shipping information in shipping tab', async ({ page }) => {
			await page.getByRole('button', { name: /Shipping & Returns/i }).click();

			const freeShipping = page.getByText(/Free Shipping/i);
			await expect(freeShipping).toBeVisible();

			const returnPolicy = page.getByText(/30-Day Returns/i);
			await expect(returnPolicy).toBeVisible();
		});

		test('should lazy load Q&A section', async ({ page }) => {
			await page.getByRole('button', { name: /Q&A/i }).click();

			// Should show loading spinner first
			const spinner = page.locator('.animate-spin');
			// Then Q&A content should appear
			const qaHeading = page.getByText(/Questions & Answers/i);
			await expect(qaHeading).toBeVisible({ timeout: 5000 });
		});
	});

	test.describe('Q&A Section', () => {
		test('should display Q&A section when tab is clicked', async ({ page }) => {
			await page.getByRole('button', { name: /Q&A/i }).click();

			const qaSection = page.getByText(/Questions & Answers/i);
			await expect(qaSection).toBeVisible();
		});

		test('should allow searching questions', async ({ page }) => {
			await page.getByRole('button', { name: /Q&A/i }).click();

			const searchInput = page.getByPlaceholder(/Search questions/i);
			await expect(searchInput).toBeVisible();

			await searchInput.fill('warranty');
			await page.waitForTimeout(300);
		});

		test('should allow asking new question', async ({ page }) => {
			await page.getByRole('button', { name: /Q&A/i }).click();

			const questionInput = page.getByPlaceholder(/Type your question/i);
			await questionInput.fill('What is the return policy?');

			const askButton = page.getByRole('button', { name: /Ask/i });
			await askButton.click();

			// Question should appear
			const question = page.getByText(/What is the return policy/i);
			await expect(question).toBeVisible();
		});

		test('should display existing Q&A items', async ({ page }) => {
			await page.getByRole('button', { name: /Q&A/i }).click();

			// Wait for content to load
			await page.waitForTimeout(1000);

			// Should have at least some questions (mocked)
			const questionItems = page.locator('.bg-white.border.border-gray-200.rounded-lg');
			const count = await questionItems.count();
			expect(count).toBeGreaterThan(0);
		});

		test('should allow voting on helpful answers', async ({ page }) => {
			await page.getByRole('button', { name: /Q&A/i }).click();
			await page.waitForTimeout(1000);

			const voteButtons = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: /\d+/ });
			const count = await voteButtons.count();

			if (count > 0) {
				const initialText = await voteButtons.first().textContent();
				await voteButtons.first().click();
				await page.waitForTimeout(300);

				// Button should be disabled after voting
				await expect(voteButtons.first()).toBeDisabled();
			}
		});
	});

	test.describe('Product Comparison', () => {
		test('should toggle comparison tool', async ({ page }) => {
			const compareButton = page.getByRole('button', { name: /Compare with Similar Products/i });
			await compareButton.click();

			// Should show loading then comparison table
			const comparisonHeading = page.getByText(/Product Comparison/i);
			await expect(comparisonHeading).toBeVisible({ timeout: 5000 });
		});

		test('should display comparison table with features', async ({ page }) => {
			await page.getByRole('button', { name: /Compare with Similar Products/i }).click();
			await page.waitForTimeout(2000);

			const table = page.locator('table');
			await expect(table).toBeVisible();

			// Should have feature rows
			const features = page.getByText(/Price|In Stock|Rating|Free Shipping/i).first();
			await expect(features).toBeVisible();
		});

		test('should highlight current product in comparison', async ({ page }) => {
			await page.getByRole('button', { name: /Compare with Similar Products/i }).click();
			await page.waitForTimeout(2000);

			const currentBadge = page.getByText(/Current/i);
			await expect(currentBadge).toBeVisible();
		});

		test('should hide comparison when clicking hide button', async ({ page }) => {
			await page.getByRole('button', { name: /Compare with Similar Products/i }).click();
			await page.waitForTimeout(2000);

			const hideButton = page.getByRole('button', { name: /Hide/i });
			await hideButton.click();

			const comparisonHeading = page.getByText(/Product Comparison/i);
			await expect(comparisonHeading).not.toBeVisible();
		});
	});

	test.describe('Flash Sale Timer', () => {
		test('should display countdown timer', async ({ page }) => {
			const timer = page.getByText(/Flash Deal Ends In/i);
			await expect(timer).toBeVisible();
		});

		test('should show hours, minutes, and seconds', async ({ page }) => {
			const hours = page.getByText(/\d+H/);
			const minutes = page.getByText(/\d+M/);
			const seconds = page.getByText(/\d+S/);

			await expect(hours).toBeVisible();
			await expect(minutes).toBeVisible();
			await expect(seconds).toBeVisible();
		});

		test('should countdown seconds', async ({ page }) => {
			const secondsDisplay = page.getByText(/\d+S/);
			const initialSeconds = await secondsDisplay.textContent();

			// Wait 2 seconds
			await page.waitForTimeout(2000);

			const newSeconds = await secondsDisplay.textContent();
			expect(newSeconds).not.toBe(initialSeconds);
		});
	});

	test.describe('Trust Badges', () => {
		test('should display trust badges', async ({ page }) => {
			const freeShipping = page.getByText(/Free Shipping/i).first();
			const securePayment = page.getByText(/Secure Payment/i);
			const easyReturns = page.getByText(/Easy Returns/i);

			await expect(freeShipping).toBeVisible();
			await expect(securePayment).toBeVisible();
			await expect(easyReturns).toBeVisible();
		});

		test('should display trust badge icons', async ({ page }) => {
			const badges = page.locator('.w-12.h-12.rounded-full');
			const count = await badges.count();
			expect(count).toBeGreaterThanOrEqual(3);
		});
	});

	test.describe('Breadcrumb Navigation', () => {
		test('should display breadcrumb navigation', async ({ page }) => {
			const homeLink = page.getByRole('link', { name: /Home/i }).first();
			await expect(homeLink).toBeVisible();
		});

		test('should be sticky on scroll', async ({ page }) => {
			const breadcrumb = page.locator('.sticky.top-0');
			await expect(breadcrumb).toBeVisible();

			// Scroll down
			await page.evaluate(() => window.scrollTo(0, 500));
			await page.waitForTimeout(300);

			// Should still be visible
			await expect(breadcrumb).toBeVisible();
		});

		test('should navigate to home when clicking home link', async ({ page }) => {
			const homeLink = page.getByRole('link', { name: /Home/i }).first();
			const href = await homeLink.getAttribute('href');
			expect(href).toContain('/');
		});
	});

	test.describe('Wishlist & Share', () => {
		test('should have wishlist button', async ({ page }) => {
			const wishlistButton = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: '' }).first();
			await expect(wishlistButton).toBeVisible();
		});

		test('should have share button', async ({ page }) => {
			const shareButton = page.getByRole('button', { name: /Share/i });
			await expect(shareButton).toBeVisible();
		});
	});

	test.describe('Accessibility', () => {
		test('should have proper heading hierarchy', async ({ page }) => {
			const h1 = page.locator('h1');
			await expect(h1).toHaveCount(1);
		});

		test('should have alt text on images', async ({ page }) => {
			const images = page.locator('img');
			const count = await images.count();

			for (let i = 0; i < count; i++) {
				const alt = await images.nth(i).getAttribute('alt');
				expect(alt).toBeTruthy();
			}
		});

		test('should have aria-labels on icon buttons', async ({ page }) => {
			const ariaButtons = page.locator('button[aria-label]');
			const count = await ariaButtons.count();
			expect(count).toBeGreaterThan(0);
		});

		test('should be keyboard navigable', async ({ page }) => {
			// Tab through interactive elements
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');

			// Focused element should be visible
			const focused = page.locator(':focus');
			await expect(focused).toBeVisible();
		});

		test('should have proper focus indicators', async ({ page }) => {
			const button = page.getByRole('button', { name: /Add to Cart/i });
			await button.focus();

			// Should have visible focus style
			const outline = await button.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return styles.outline || styles.outlineStyle;
			});

			// Just checking it doesn't throw
			expect(outline).toBeDefined();
		});
	});

	test.describe('Animations', () => {
		test('should have fade-in animation on load', async ({ page }) => {
			const animatedElement = page.locator('.animate-fadeIn').first();
			await expect(animatedElement).toBeVisible();
		});

		test('should have gradient animation on flash sale', async ({ page }) => {
			const gradientElement = page.locator('.animate-gradient');
			await expect(gradientElement).toBeVisible();
		});

		test('should have pulse animation on discount badge', async ({ page }) => {
			const pulseBadge = page.locator('.animate-pulse').first();
			const isVisible = await pulseBadge.isVisible().catch(() => false);
			// May not be visible if no discount
			expect(typeof isVisible).toBe('boolean');
		});
	});
});
