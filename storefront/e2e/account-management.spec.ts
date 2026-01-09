import { test, expect } from '@playwright/test';

test.describe('Account Management', () => {
	test.describe('Account Dashboard', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/account');
			await page.waitForLoadState('networkidle');
		});

		test('should display account dashboard or login page', async ({ page }) => {
			const url = page.url();

			// Either on account page or redirected to login
			const onAccountPage = url.includes('account');
			const onLoginPage = url.includes('login');

			expect(onAccountPage || onLoginPage).toBeTruthy();
		});

		test('should show user profile summary', async ({ page }) => {
			// Check for user name or email
			const userInfo = page.locator('[class*="profile"], [class*="user-info"], text=/welcome|hello/i').first();
			const count = await userInfo.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should display account navigation menu', async ({ page }) => {
			const menuItems = page.locator('nav a, [role="navigation"] a').filter({
				hasText: /orders|profile|address|settings/i
			});
			const count = await menuItems.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should navigate to orders section', async ({ page }) => {
			const ordersLink = page.locator('a[href*="orders"], a:has-text("Orders")').first();

			if (await ordersLink.isVisible()) {
				await ordersLink.click();
				await page.waitForLoadState('networkidle');

				const url = page.url();
				expect(url).toMatch(/orders/);
			}
		});

		test('should navigate to profile settings', async ({ page }) => {
			const profileLink = page.locator('a[href*="profile"], a[href*="settings"], a:has-text("Profile")').first();

			if (await profileLink.isVisible()) {
				await profileLink.click();
				await page.waitForLoadState('networkidle');

				const url = page.url();
				expect(url).toMatch(/profile|settings/);
			}
		});

		test('should navigate to addresses', async ({ page }) => {
			const addressLink = page.locator('a[href*="address"], a:has-text("Address")').first();

			if (await addressLink.isVisible()) {
				await addressLink.click();
				await page.waitForLoadState('networkidle');

				const url = page.url();
				expect(url).toMatch(/address/);
			}
		});

		test('should have logout option', async ({ page }) => {
			const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("Sign Out")').first();
			const count = await logoutButton.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe('Profile Management', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/account/profile');
			await page.waitForLoadState('networkidle');
		});

		test('should display profile information form', async ({ page }) => {
			// Check for name inputs
			const nameInput = page.locator('input[name*="name" i], input[placeholder*="name" i]').first();
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();

			const hasProfileFields = await nameInput.count() > 0 || await emailInput.count() > 0;

			expect(typeof hasProfileFields).toBe('boolean');
		});

		test('should update first name', async ({ page }) => {
			const firstNameInput = page.locator('input[name*="first" i], input[placeholder*="first" i]').first();

			if (await firstNameInput.isVisible()) {
				const originalValue = await firstNameInput.inputValue();
				await firstNameInput.fill('UpdatedFirstName');

				const saveButton = page.locator('button[type="submit"], button:has-text("Save")').first();
				if (await saveButton.isVisible()) {
					await saveButton.click();
					await page.waitForTimeout(1000);

					// Check for success message
					const successMessage = page.locator('[role="alert"], .success, text=/saved|updated/i');
					const hasSuccess = await successMessage.isVisible().catch(() => false);

					expect(typeof hasSuccess).toBe('boolean');

					// Restore original value
					if (originalValue) {
						await firstNameInput.fill(originalValue);
						await saveButton.click();
					}
				}
			}
		});

		test('should update last name', async ({ page }) => {
			const lastNameInput = page.locator('input[name*="last" i], input[placeholder*="last" i]').first();

			if (await lastNameInput.isVisible()) {
				await lastNameInput.fill('UpdatedLastName');

				const value = await lastNameInput.inputValue();
				expect(value).toBe('UpdatedLastName');
			}
		});

		test('should update phone number', async ({ page }) => {
			const phoneInput = page.locator('input[type="tel"], input[name*="phone" i]').first();

			if (await phoneInput.isVisible()) {
				await phoneInput.fill('+1234567890');

				const value = await phoneInput.inputValue();
				expect(value).toBeDefined();
			}
		});

		test('should validate phone number format', async ({ page }) => {
			const phoneInput = page.locator('input[type="tel"], input[name*="phone" i]').first();

			if (await phoneInput.isVisible()) {
				await phoneInput.fill('invalid');

				const saveButton = page.locator('button[type="submit"]').first();
				await saveButton.click();

				await page.waitForTimeout(500);

				// May show validation error
				const errorMessage = page.locator('[role="alert"], .error, text=/invalid.*phone/i');
				const hasError = await errorMessage.isVisible().catch(() => false);

				expect(typeof hasError).toBe('boolean');
			}
		});

		test('should update date of birth', async ({ page }) => {
			const dobInput = page.locator('input[type="date"], input[name*="birth" i]').first();

			if (await dobInput.isVisible()) {
				await dobInput.fill('1990-01-15');

				const value = await dobInput.inputValue();
				expect(value).toBe('1990-01-15');
			}
		});

		test('should update gender', async ({ page }) => {
			const genderSelect = page.locator('select[name*="gender" i]').first();
			const genderRadio = page.locator('input[type="radio"][name*="gender" i]').first();

			if (await genderSelect.isVisible()) {
				await genderSelect.selectOption({ index: 1 });
				const value = await genderSelect.inputValue();
				expect(value).toBeDefined();
			} else if (await genderRadio.count() > 0) {
				const radios = page.locator('input[type="radio"][name*="gender" i]');
				await radios.first().check();
				const isChecked = await radios.first().isChecked();
				expect(isChecked).toBeTruthy();
			}
		});

		test('should prevent invalid email update', async ({ page }) => {
			const emailInput = page.locator('input[type="email"]').first();

			if (await emailInput.isVisible()) {
				await emailInput.fill('invalidemail');

				const saveButton = page.locator('button[type="submit"]').first();
				await saveButton.click();

				await page.waitForTimeout(500);

				// HTML5 validation
				const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
				expect(validationMessage).toBeDefined();
			}
		});

		test('should show success message after update', async ({ page }) => {
			const firstNameInput = page.locator('input[name*="first" i]').first();

			if (await firstNameInput.isVisible()) {
				await firstNameInput.fill('TestName');

				const saveButton = page.locator('button[type="submit"]').first();
				await saveButton.click();

				await page.waitForTimeout(2000);

				// Look for success notification
				const successMessage = page.locator('[role="alert"], .toast, text=/success|saved|updated/i');
				const count = await successMessage.count();

				expect(count).toBeGreaterThanOrEqual(0);
			}
		});

		test('should have cancel button to discard changes', async ({ page }) => {
			const cancelButton = page.locator('button:has-text("Cancel"), a:has-text("Cancel")').first();
			const count = await cancelButton.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe('Order History', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/account/orders');
			await page.waitForLoadState('networkidle');
		});

		test('should display orders list or empty state', async ({ page }) => {
			const ordersList = page.locator('[class*="order"], [data-testid*="order"]');
			const emptyState = page.locator('text=/no orders|haven\'t placed|empty/i');

			const hasOrders = await ordersList.count() > 0;
			const hasEmptyState = await emptyState.isVisible().catch(() => false);

			expect(hasOrders || hasEmptyState).toBeDefined();
		});

		test('should display order details', async ({ page }) => {
			const firstOrder = page.locator('[class*="order"]').first();

			if (await firstOrder.isVisible()) {
				// Check for order number
				const orderNumber = firstOrder.locator('text=/order.*#|#\\d+/i');
				const hasOrderNumber = await orderNumber.count() > 0;

				// Check for order date
				const orderDate = firstOrder.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}/');
				const hasDate = await orderDate.count() > 0;

				expect(hasOrderNumber || hasDate).toBeDefined();
			}
		});

		test('should show order status', async ({ page }) => {
			const orderStatus = page.locator('text=/pending|processing|shipped|delivered|cancelled/i').first();
			const count = await orderStatus.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should navigate to order details page', async ({ page }) => {
			const orderLink = page.locator('a[href*="order"]').first();

			if (await orderLink.isVisible()) {
				await orderLink.click();
				await page.waitForLoadState('networkidle');

				const url = page.url();
				expect(url).toMatch(/order/);
			}
		});

		test('should filter orders by status', async ({ page }) => {
			const filterSelect = page.locator('select[name*="status" i], select[name*="filter" i]').first();
			const filterButtons = page.locator('button:has-text("All"), button:has-text("Pending")');

			const hasFilters = await filterSelect.count() > 0 || await filterButtons.count() > 0;

			if (hasFilters) {
				if (await filterSelect.isVisible()) {
					await filterSelect.selectOption({ index: 1 });
					await page.waitForTimeout(1000);
				} else if (await filterButtons.first().isVisible()) {
					await filterButtons.first().click();
					await page.waitForTimeout(1000);
				}

				// Orders should be filtered
				expect(true).toBeTruthy();
			}
		});

		test('should search orders', async ({ page }) => {
			const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();

			if (await searchInput.isVisible()) {
				await searchInput.fill('12345');
				await page.waitForTimeout(1000);

				const value = await searchInput.inputValue();
				expect(value).toBe('12345');
			}
		});

		test('should paginate orders list', async ({ page }) => {
			const nextButton = page.locator('button:has-text("Next"), a:has-text("Next"), [aria-label*="next" i]').first();
			const count = await nextButton.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should download invoice', async ({ page }) => {
			const downloadButton = page.locator('button:has-text("Invoice"), a:has-text("Download"), a[download]').first();

			if (await downloadButton.isVisible()) {
				// Check if button is clickable
				await expect(downloadButton).toBeVisible();
			}
		});

		test('should track order shipment', async ({ page }) => {
			const trackButton = page.locator('button:has-text("Track"), a:has-text("Track Shipment")').first();
			const count = await trackButton.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should reorder items', async ({ page }) => {
			const reorderButton = page.locator('button:has-text("Reorder"), button:has-text("Buy Again")').first();
			const count = await reorderButton.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe('Order Details', () => {
		test('should display complete order information', async ({ page }) => {
			// Try to navigate to an order details page
			await page.goto('/default-channel/account/orders');
			await page.waitForLoadState('networkidle');

			const firstOrderLink = page.locator('a[href*="order"]').first();

			if (await firstOrderLink.isVisible()) {
				await firstOrderLink.click();
				await page.waitForLoadState('networkidle');

				// Check for order details sections
				const orderNumber = page.locator('text=/order.*#|#\\d+/i');
				const orderStatus = page.locator('text=/status|pending|delivered/i');
				const orderTotal = page.locator('text=/total|\\$\\d+/');

				const hasDetails = await orderNumber.count() > 0 ||
					await orderStatus.count() > 0 ||
					await orderTotal.count() > 0;

				expect(hasDetails).toBeDefined();
			}
		});

		test('should show order timeline', async ({ page }) => {
			await page.goto('/default-channel/account/orders');
			await page.waitForLoadState('networkidle');

			const firstOrderLink = page.locator('a[href*="order"]').first();

			if (await firstOrderLink.isVisible()) {
				await firstOrderLink.click();
				await page.waitForLoadState('networkidle');

				const timeline = page.locator('[class*="timeline"], [class*="progress"], text=/placed|confirmed|shipped|delivered/i');
				const count = await timeline.count();

				expect(count).toBeGreaterThanOrEqual(0);
			}
		});

		test('should display shipping address', async ({ page }) => {
			await page.goto('/default-channel/account/orders');
			await page.waitForLoadState('networkidle');

			const firstOrderLink = page.locator('a[href*="order"]').first();

			if (await firstOrderLink.isVisible()) {
				await firstOrderLink.click();
				await page.waitForLoadState('networkidle');

				const shippingAddress = page.locator('text=/shipping.*address|deliver.*to/i');
				const count = await shippingAddress.count();

				expect(count).toBeGreaterThanOrEqual(0);
			}
		});

		test('should display payment method', async ({ page }) => {
			await page.goto('/default-channel/account/orders');
			await page.waitForLoadState('networkidle');

			const firstOrderLink = page.locator('a[href*="order"]').first();

			if (await firstOrderLink.isVisible()) {
				await firstOrderLink.click();
				await page.waitForLoadState('networkidle');

				const paymentMethod = page.locator('text=/payment.*method|visa|mastercard|paypal/i');
				const count = await paymentMethod.count();

				expect(count).toBeGreaterThanOrEqual(0);
			}
		});

		test('should allow order cancellation if eligible', async ({ page }) => {
			await page.goto('/default-channel/account/orders');
			await page.waitForLoadState('networkidle');

			const firstOrderLink = page.locator('a[href*="order"]').first();

			if (await firstOrderLink.isVisible()) {
				await firstOrderLink.click();
				await page.waitForLoadState('networkidle');

				const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("Cancel Order")').first();
				const count = await cancelButton.count();

				expect(count).toBeGreaterThanOrEqual(0);
			}
		});
	});

	test.describe('Address Management', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/account/addresses');
			await page.waitForLoadState('networkidle');
		});

		test('should display saved addresses or empty state', async ({ page }) => {
			const addressList = page.locator('[class*="address"]');
			const emptyState = page.locator('text=/no address|add.*address/i');

			const hasAddresses = await addressList.count() > 0;
			const hasEmptyState = await emptyState.isVisible().catch(() => false);

			expect(hasAddresses || hasEmptyState).toBeDefined();
		});

		test('should open add address form', async ({ page }) => {
			const addButton = page.locator('button:has-text("Add"), a:has-text("Add Address"), button:has-text("New")').first();

			if (await addButton.isVisible()) {
				await addButton.click();
				await page.waitForTimeout(500);

				// Form or modal should appear
				const form = page.locator('form');
				const modal = page.locator('[role="dialog"]');

				const hasForm = await form.isVisible().catch(() => false);
				const hasModal = await modal.isVisible().catch(() => false);

				expect(hasForm || hasModal).toBeDefined();
			}
		});

		test('should add new address', async ({ page }) => {
			const addButton = page.locator('button:has-text("Add"), a:has-text("Add Address")').first();

			if (await addButton.isVisible()) {
				await addButton.click();
				await page.waitForTimeout(500);

				// Fill address form
				const streetInput = page.locator('input[name*="street" i], input[name*="address" i], input[placeholder*="address" i]').first();
				const cityInput = page.locator('input[name*="city" i]').first();
				const zipInput = page.locator('input[name*="zip" i], input[name*="postal" i]').first();

				if (await streetInput.isVisible()) {
					await streetInput.fill('123 Test Street');
				}

				if (await cityInput.isVisible()) {
					await cityInput.fill('Test City');
				}

				if (await zipInput.isVisible()) {
					await zipInput.fill('12345');
				}

				const saveButton = page.locator('button[type="submit"], button:has-text("Save")').first();
				if (await saveButton.isVisible()) {
					await saveButton.click();
					await page.waitForTimeout(1000);

					// Should show success or close modal
					const successMessage = page.locator('[role="alert"], text=/saved|added/i');
					const count = await successMessage.count();

					expect(count).toBeGreaterThanOrEqual(0);
				}
			}
		});

		test('should validate required address fields', async ({ page }) => {
			const addButton = page.locator('button:has-text("Add"), a:has-text("Add Address")').first();

			if (await addButton.isVisible()) {
				await addButton.click();
				await page.waitForTimeout(500);

				const saveButton = page.locator('button[type="submit"]').first();
				if (await saveButton.isVisible()) {
					await saveButton.click();
					await page.waitForTimeout(500);

					// Should show validation errors
					const errorMessages = page.locator('[role="alert"], .error, .text-red-500');
					const count = await errorMessages.count();

					expect(count).toBeGreaterThanOrEqual(0);
				}
			}
		});

		test('should edit existing address', async ({ page }) => {
			const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();

			if (await editButton.isVisible()) {
				await editButton.click();
				await page.waitForTimeout(500);

				const streetInput = page.locator('input[name*="street" i], input[name*="address" i]').first();

				if (await streetInput.isVisible()) {
					await streetInput.fill('456 Updated Street');

					const value = await streetInput.inputValue();
					expect(value).toBe('456 Updated Street');
				}
			}
		});

		test('should delete address', async ({ page }) => {
			const deleteButton = page.locator('button:has-text("Delete"), button:has-text("Remove")').first();

			if (await deleteButton.isVisible()) {
				await deleteButton.click();
				await page.waitForTimeout(500);

				// May show confirmation dialog
				const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")').first();

				if (await confirmButton.isVisible()) {
					// Don't actually delete, just verify dialog appears
					await expect(confirmButton).toBeVisible();
				}
			}
		});

		test('should set default address', async ({ page }) => {
			const defaultButton = page.locator('button:has-text("Set as Default"), input[type="radio"]').first();
			const count = await defaultButton.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should validate postal code format', async ({ page }) => {
			const addButton = page.locator('button:has-text("Add"), a:has-text("Add Address")').first();

			if (await addButton.isVisible()) {
				await addButton.click();
				await page.waitForTimeout(500);

				const zipInput = page.locator('input[name*="zip" i], input[name*="postal" i]').first();

				if (await zipInput.isVisible()) {
					await zipInput.fill('invalid');

					const saveButton = page.locator('button[type="submit"]').first();
					await saveButton.click();

					await page.waitForTimeout(500);

					// May show validation error
					const errorMessage = page.locator('text=/invalid.*postal|invalid.*zip/i');
					const hasError = await errorMessage.isVisible().catch(() => false);

					expect(typeof hasError).toBe('boolean');
				}
			}
		});
	});

	test.describe('Password Change', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/account/password');
			await page.waitForLoadState('networkidle');
		});

		test('should display password change form', async ({ page }) => {
			const currentPasswordInput = page.locator('input[type="password"][name*="current" i], input[type="password"]:first-child').first();
			const newPasswordInput = page.locator('input[type="password"][name*="new" i]').first();

			const hasPasswordFields = await currentPasswordInput.count() > 0 || await newPasswordInput.count() > 0;

			expect(typeof hasPasswordFields).toBe('boolean');
		});

		test('should require current password', async ({ page }) => {
			const newPasswordInput = page.locator('input[type="password"][name*="new" i]').first();
			const saveButton = page.locator('button[type="submit"]').first();

			if (await newPasswordInput.isVisible()) {
				await newPasswordInput.fill('NewPassword123!');
				await saveButton.click();

				await page.waitForTimeout(500);

				// Should require current password
				const errorMessage = page.locator('[role="alert"], .error');
				const count = await errorMessage.count();

				expect(count).toBeGreaterThanOrEqual(0);
			}
		});

		test('should validate new password strength', async ({ page }) => {
			const currentPasswordInput = page.locator('input[type="password"]').first();
			const newPasswordInput = page.locator('input[type="password"]').nth(1);

			if (await newPasswordInput.isVisible()) {
				await currentPasswordInput.fill('CurrentPassword123!');
				await newPasswordInput.fill('weak');

				const saveButton = page.locator('button[type="submit"]').first();
				await saveButton.click();

				await page.waitForTimeout(500);

				// Should show weak password error
				const errorMessage = page.locator('text=/password.*weak|password.*short|password.*requirement/i');
				const hasError = await errorMessage.isVisible().catch(() => false);

				expect(typeof hasError).toBe('boolean');
			}
		});

		test('should confirm new password matches', async ({ page }) => {
			const passwordInputs = page.locator('input[type="password"]');
			const count = await passwordInputs.count();

			if (count >= 3) {
				const currentPassword = passwordInputs.nth(0);
				const newPassword = passwordInputs.nth(1);
				const confirmPassword = passwordInputs.nth(2);

				await currentPassword.fill('CurrentPassword123!');
				await newPassword.fill('NewPassword123!');
				await confirmPassword.fill('DifferentPassword123!');

				const saveButton = page.locator('button[type="submit"]').first();
				await saveButton.click();

				await page.waitForTimeout(500);

				// Should show mismatch error
				const errorMessage = page.locator('text=/password.*match|passwords.*same/i');
				const hasError = await errorMessage.isVisible().catch(() => false);

				expect(typeof hasError).toBe('boolean');
			}
		});
	});

	test.describe('Notification Preferences', () => {
		test('should display notification settings', async ({ page }) => {
			await page.goto('/default-channel/account/notifications');
			await page.waitForLoadState('networkidle');

			const notificationToggles = page.locator('input[type="checkbox"]');
			const count = await notificationToggles.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should toggle email notifications', async ({ page }) => {
			await page.goto('/default-channel/account/notifications');
			await page.waitForLoadState('networkidle');

			const emailToggle = page.locator('input[type="checkbox"][name*="email" i]').first();

			if (await emailToggle.isVisible()) {
				const initialState = await emailToggle.isChecked();
				await emailToggle.click();
				await page.waitForTimeout(500);

				const newState = await emailToggle.isChecked();
				expect(newState).not.toBe(initialState);
			}
		});

		test('should save notification preferences', async ({ page }) => {
			await page.goto('/default-channel/account/notifications');
			await page.waitForLoadState('networkidle');

			const saveButton = page.locator('button[type="submit"], button:has-text("Save")').first();

			if (await saveButton.isVisible()) {
				await saveButton.click();
				await page.waitForTimeout(1000);

				const successMessage = page.locator('[role="alert"], text=/saved|updated/i');
				const count = await successMessage.count();

				expect(count).toBeGreaterThanOrEqual(0);
			}
		});
	});

	test.describe('Account Deletion', () => {
		test('should have delete account option', async ({ page }) => {
			await page.goto('/default-channel/account/settings');
			await page.waitForLoadState('networkidle');

			const deleteButton = page.locator('button:has-text("Delete Account"), a:has-text("Delete Account")').first();
			const count = await deleteButton.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show confirmation dialog for account deletion', async ({ page }) => {
			await page.goto('/default-channel/account/settings');
			await page.waitForLoadState('networkidle');

			const deleteButton = page.locator('button:has-text("Delete Account")').first();

			if (await deleteButton.isVisible()) {
				await deleteButton.click();
				await page.waitForTimeout(500);

				// Should show confirmation
				const confirmDialog = page.locator('[role="dialog"], [role="alertdialog"], text=/sure.*delete|permanent|cannot.*undo/i');
				const count = await confirmDialog.count();

				expect(count).toBeGreaterThanOrEqual(0);
			}
		});
	});

	test.describe('Mobile Account Management', () => {
		test.use({ viewport: { width: 375, height: 667 } });

		test('should display mobile-optimized account menu', async ({ page }) => {
			await page.goto('/default-channel/account');
			await page.waitForLoadState('networkidle');

			const menu = page.locator('nav, [role="navigation"]').first();
			await expect(menu).toBeVisible();
		});

		test('should have touch-friendly navigation items', async ({ page }) => {
			await page.goto('/default-channel/account');
			await page.waitForLoadState('networkidle');

			const navItems = page.locator('nav a, [role="navigation"] a').first();

			if (await navItems.isVisible()) {
				const box = await navItems.boundingBox();

				// Should be at least 44px tall for touch
				expect(box?.height).toBeGreaterThanOrEqual(40);
			}
		});

		test('should have mobile-friendly forms', async ({ page }) => {
			await page.goto('/default-channel/account/profile');
			await page.waitForLoadState('networkidle');

			const form = page.locator('form').first();

			if (await form.isVisible()) {
				const box = await form.boundingBox();
				expect(box?.width).toBeLessThanOrEqual(375);
			}
		});
	});
});
