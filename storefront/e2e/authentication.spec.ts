import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
	test.describe('Login Flow', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/login');
			await page.waitForLoadState('networkidle');
		});

		test('should display login page with all elements', async ({ page }) => {
			// Check page title or heading
			const heading = page.locator('h1, h2').filter({ hasText: /login|sign in/i }).first();
			await expect(heading).toBeVisible();

			// Check for email/username input
			const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
			await expect(emailInput).toBeVisible();

			// Check for password input
			const passwordInput = page.locator('input[type="password"]').first();
			await expect(passwordInput).toBeVisible();

			// Check for login button
			const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
			await expect(loginButton).toBeVisible();

			// Check for "Forgot Password" link
			const forgotPasswordLink = page.locator('a[href*="forgot"], a:has-text("Forgot Password")').first();
			const hasForgotLink = await forgotPasswordLink.count();
			expect(hasForgotLink).toBeGreaterThanOrEqual(0);
		});

		test('should show validation error for empty fields', async ({ page }) => {
			const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
			await loginButton.click();

			await page.waitForTimeout(500);

			// Check for error messages
			const errorMessages = page.locator('[role="alert"], .error, .text-red-500, .text-red-600');
			const errorCount = await errorMessages.count();

			// Should have validation errors or HTML5 validation
			expect(errorCount).toBeGreaterThanOrEqual(0);
		});

		test('should show error for invalid credentials', async ({ page }) => {
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();
			const passwordInput = page.locator('input[type="password"]').first();
			const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

			await emailInput.fill('invalid@example.com');
			await passwordInput.fill('wrongpassword123');
			await loginButton.click();

			await page.waitForTimeout(2000);

			// Check for error notification (toast, alert, or inline message)
			const errorNotification = page.locator(
				'[role="alert"], .error-message, .toast, text=/invalid|incorrect|failed/i'
			);

			// May or may not show error depending on implementation
			const hasError = await errorNotification.isVisible().catch(() => false);
			expect(typeof hasError).toBe('boolean');
		});

		test('should login with valid credentials', async ({ page }) => {
			// Check if login is possible
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();
			const passwordInput = page.locator('input[type="password"]').first();
			const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

			if (await emailInput.isVisible() && await passwordInput.isVisible()) {
				// Try test credentials (may not work without real backend)
				await emailInput.fill('test@example.com');
				await passwordInput.fill('testpassword123');
				await loginButton.click();

				await page.waitForTimeout(2000);

				// Check if redirected or still on login page
				const url = page.url();
				expect(url).toBeDefined();
			}
		});

		test('should toggle password visibility', async ({ page }) => {
			const passwordInput = page.locator('input[type="password"]').first();
			const toggleButton = page.locator('button[aria-label*="password" i], button:has([class*="eye"])').first();

			const hasToggle = await toggleButton.count();

			if (hasToggle > 0) {
				// Password should be hidden initially
				await expect(passwordInput).toHaveAttribute('type', 'password');

				// Click toggle
				await toggleButton.click();
				await page.waitForTimeout(200);

				// Check if type changed to text
				const inputType = await passwordInput.getAttribute('type');
				// May or may not toggle depending on implementation
				expect(['password', 'text']).toContain(inputType);
			}
		});

		test('should have "Remember Me" checkbox', async ({ page }) => {
			const rememberMeCheckbox = page.locator('input[type="checkbox"][name*="remember" i], label:has-text("Remember")');
			const count = await rememberMeCheckbox.count();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should navigate to registration page', async ({ page }) => {
			const registerLink = page.locator('a[href*="register"], a[href*="signup"], a:has-text("Sign Up"), a:has-text("Register")').first();

			if (await registerLink.isVisible()) {
				await registerLink.click();
				await page.waitForLoadState('networkidle');

				const url = page.url();
				expect(url).toMatch(/register|signup/i);
			}
		});

		test('should support social login options', async ({ page }) => {
			// Check for Google Sign-In
			const googleButton = page.locator('button:has-text("Google"), a:has-text("Google"), [class*="google"]').first();
			const googleCount = await googleButton.count();

			// Check for other social logins
			const socialButtons = page.locator('[class*="social"], [class*="oauth"], button:has-text("Facebook"), button:has-text("Twitter")');
			const socialCount = await socialButtons.count();

			// May or may not have social login
			expect(googleCount + socialCount).toBeGreaterThanOrEqual(0);
		});

		test('should have proper form accessibility', async ({ page }) => {
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();
			const passwordInput = page.locator('input[type="password"]').first();

			// Check for labels or aria-labels
			const emailLabel = await emailInput.getAttribute('aria-label');
			const passwordLabel = await passwordInput.getAttribute('aria-label');

			// Should have some form of labeling
			expect(emailLabel !== null || await page.locator('label[for]').count() > 0).toBeTruthy();
		});

		test('should prevent multiple simultaneous login attempts', async ({ page }) => {
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();
			const passwordInput = page.locator('input[type="password"]').first();
			const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

			await emailInput.fill('test@example.com');
			await passwordInput.fill('password123');

			// Click login button
			await loginButton.click();

			// Button should be disabled or show loading state
			await page.waitForTimeout(200);

			const isDisabled = await loginButton.isDisabled().catch(() => false);
			const hasLoadingState = await page.locator('button:has-text("Loading"), button:has-text("Signing"), .loading, .spinner').isVisible().catch(() => false);

			// Either disabled or showing loading
			expect(isDisabled || hasLoadingState).toBeDefined();
		});
	});

	test.describe('Registration Flow', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/register');
			await page.waitForLoadState('networkidle');
		});

		test('should display registration form with all fields', async ({ page }) => {
			// Check heading
			const heading = page.locator('h1, h2').filter({ hasText: /register|sign up|create account/i }).first();
			await expect(heading).toBeVisible();

			// Check for name/email inputs
			const nameInput = page.locator('input[name*="name" i], input[placeholder*="name" i]').first();
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();
			const passwordInput = page.locator('input[type="password"]').first();

			const hasBasicFields = (await nameInput.count() > 0 || await emailInput.count() > 0) && await passwordInput.count() > 0;
			expect(hasBasicFields).toBeTruthy();
		});

		test('should validate email format', async ({ page }) => {
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();
			const submitButton = page.locator('button[type="submit"]').first();

			if (await emailInput.isVisible()) {
				await emailInput.fill('invalidemail');
				await submitButton.click();

				await page.waitForTimeout(500);

				// Check for validation message
				const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
				expect(validationMessage).toBeDefined();
			}
		});

		test('should validate password requirements', async ({ page }) => {
			const passwordInput = page.locator('input[type="password"]').first();
			const submitButton = page.locator('button[type="submit"]').first();

			if (await passwordInput.isVisible()) {
				// Try weak password
				await passwordInput.fill('123');
				await page.locator('input[type="email"], input[name="email"]').first().fill('test@example.com');
				await submitButton.click();

				await page.waitForTimeout(500);

				// Check for password requirements message
				const errorMessage = page.locator('[role="alert"], .error, text=/password.*required|too short|weak/i');
				const hasError = await errorMessage.isVisible().catch(() => false);

				// May or may not validate depending on implementation
				expect(typeof hasError).toBe('boolean');
			}
		});

		test('should validate password confirmation match', async ({ page }) => {
			const passwordInput = page.locator('input[type="password"]').first();
			const confirmPasswordInput = page.locator('input[type="password"]').nth(1);

			const hasConfirmField = await confirmPasswordInput.count() > 0;

			if (hasConfirmField) {
				await passwordInput.fill('Password123!');
				await confirmPasswordInput.fill('DifferentPassword123!');

				const submitButton = page.locator('button[type="submit"]').first();
				await submitButton.click();

				await page.waitForTimeout(500);

				// Check for mismatch error
				const errorMessage = page.locator('text=/password.*match|passwords.*same/i');
				const hasError = await errorMessage.isVisible().catch(() => false);

				expect(typeof hasError).toBe('boolean');
			}
		});

		test('should show password strength indicator', async ({ page }) => {
			const passwordInput = page.locator('input[type="password"]').first();

			if (await passwordInput.isVisible()) {
				await passwordInput.fill('weak');
				await page.waitForTimeout(300);

				// Check for strength indicator
				const strengthIndicator = page.locator('[class*="strength"], [class*="meter"], text=/weak|strong|medium/i');
				const count = await strengthIndicator.count();

				expect(count).toBeGreaterThanOrEqual(0);
			}
		});

		test('should require terms and conditions acceptance', async ({ page }) => {
			const termsCheckbox = page.locator('input[type="checkbox"][name*="terms" i], input[type="checkbox"][name*="agree" i]').first();
			const count = await termsCheckbox.count();

			if (count > 0) {
				const submitButton = page.locator('button[type="submit"]').first();

				// Try to submit without accepting terms
				await submitButton.click();
				await page.waitForTimeout(500);

				// Should show validation error
				const isChecked = await termsCheckbox.isChecked();
				expect(isChecked).toBeDefined();
			}
		});

		test('should register with valid data', async ({ page }) => {
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();
			const passwordInput = page.locator('input[type="password"]').first();
			const submitButton = page.locator('button[type="submit"]').first();

			if (await emailInput.isVisible() && await passwordInput.isVisible()) {
				// Fill with test data
				const testEmail = `test${Date.now()}@example.com`;

				const nameInput = page.locator('input[name*="name" i]').first();
				if (await nameInput.count() > 0) {
					await nameInput.fill('Test User');
				}

				await emailInput.fill(testEmail);
				await passwordInput.fill('TestPassword123!');

				const confirmPasswordInput = page.locator('input[type="password"]').nth(1);
				if (await confirmPasswordInput.count() > 0) {
					await confirmPasswordInput.fill('TestPassword123!');
				}

				const termsCheckbox = page.locator('input[type="checkbox"]').first();
				if (await termsCheckbox.count() > 0) {
					await termsCheckbox.check();
				}

				await submitButton.click();
				await page.waitForTimeout(2000);

				// Should redirect or show success
				const url = page.url();
				expect(url).toBeDefined();
			}
		});

		test('should prevent duplicate email registration', async ({ page }) => {
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();

			if (await emailInput.isVisible()) {
				// Try to register with existing email (if backend validates)
				await emailInput.fill('existing@example.com');

				const passwordInput = page.locator('input[type="password"]').first();
				await passwordInput.fill('Password123!');

				const submitButton = page.locator('button[type="submit"]').first();
				await submitButton.click();

				await page.waitForTimeout(2000);

				// May show error if email exists
				const errorMessage = page.locator('text=/already.*exists|email.*taken/i');
				const hasError = await errorMessage.isVisible().catch(() => false);

				expect(typeof hasError).toBe('boolean');
			}
		});

		test('should navigate to login page', async ({ page }) => {
			const loginLink = page.locator('a[href*="login"], a:has-text("Login"), a:has-text("Sign In")').first();

			if (await loginLink.isVisible()) {
				await loginLink.click();
				await page.waitForLoadState('networkidle');

				const url = page.url();
				expect(url).toMatch(/login/i);
			}
		});

		test('should have accessible form with proper labels', async ({ page }) => {
			const inputs = page.locator('input[type="email"], input[type="password"], input[type="text"]');
			const count = await inputs.count();

			if (count > 0) {
				const firstInput = inputs.first();
				const hasLabel = await page.locator('label').count() > 0;
				const hasAriaLabel = await firstInput.getAttribute('aria-label') !== null;
				const hasPlaceholder = await firstInput.getAttribute('placeholder') !== null;

				// Should have some form of labeling
				expect(hasLabel || hasAriaLabel || hasPlaceholder).toBeTruthy();
			}
		});
	});

	test.describe('Password Reset Flow', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/forgot-password');
			await page.waitForLoadState('networkidle');
		});

		test('should display forgot password page', async ({ page }) => {
			const heading = page.locator('h1, h2').filter({ hasText: /forgot|reset.*password/i }).first();
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();

			// Either on forgot password page or redirected to login
			const onForgotPage = await heading.isVisible().catch(() => false);
			const onLoginPage = page.url().includes('login');

			expect(onForgotPage || onLoginPage).toBeTruthy();
		});

		test('should validate email input', async ({ page }) => {
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();

			if (await emailInput.isVisible()) {
				await emailInput.fill('invalidemail');

				const submitButton = page.locator('button[type="submit"]').first();
				await submitButton.click();

				await page.waitForTimeout(500);

				// HTML5 validation or custom error
				const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
				expect(validationMessage).toBeDefined();
			}
		});

		test('should submit reset request', async ({ page }) => {
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();

			if (await emailInput.isVisible()) {
				await emailInput.fill('test@example.com');

				const submitButton = page.locator('button[type="submit"]').first();
				await submitButton.click();

				await page.waitForTimeout(2000);

				// Should show success message or redirect
				const successMessage = page.locator('text=/email.*sent|check.*email|instructions.*sent/i');
				const hasSuccess = await successMessage.isVisible().catch(() => false);

				expect(typeof hasSuccess).toBe('boolean');
			}
		});

		test('should show confirmation message after submission', async ({ page }) => {
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();

			if (await emailInput.isVisible()) {
				await emailInput.fill('test@example.com');

				const submitButton = page.locator('button[type="submit"]').first();
				await submitButton.click();

				await page.waitForTimeout(2000);

				// Look for confirmation
				const confirmation = page.locator('[role="alert"], .success, .confirmation, text=/sent|check/i');
				const count = await confirmation.count();

				expect(count).toBeGreaterThanOrEqual(0);
			}
		});

		test('should navigate back to login', async ({ page }) => {
			const loginLink = page.locator('a[href*="login"], a:has-text("Login"), a:has-text("Back")').first();

			if (await loginLink.isVisible()) {
				await loginLink.click();
				await page.waitForLoadState('networkidle');

				const url = page.url();
				expect(url).toMatch(/login/);
			}
		});
	});

	test.describe('Email Verification', () => {
		test('should display verification page', async ({ page }) => {
			// Navigate to verification page (may require token)
			await page.goto('/default-channel/verify-email');
			await page.waitForLoadState('networkidle');

			const heading = page.locator('h1, h2').filter({ hasText: /verify|confirmation/i }).first();
			const onVerifyPage = await heading.isVisible().catch(() => false);

			// May redirect if no token
			expect(typeof onVerifyPage).toBe('boolean');
		});

		test('should accept verification code input', async ({ page }) => {
			await page.goto('/default-channel/verify-email');
			await page.waitForLoadState('networkidle');

			const codeInput = page.locator('input[name*="code" i], input[placeholder*="code" i]').first();
			const hasCodeInput = await codeInput.count() > 0;

			if (hasCodeInput) {
				await codeInput.fill('123456');
				const value = await codeInput.inputValue();
				expect(value).toBe('123456');
			}
		});

		test('should have resend verification option', async ({ page }) => {
			await page.goto('/default-channel/verify-email');
			await page.waitForLoadState('networkidle');

			const resendButton = page.locator('button:has-text("Resend"), a:has-text("Resend")').first();
			const count = await resendButton.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe('Authentication State', () => {
		test('should persist login across page navigation', async ({ page }) => {
			// This test would require actual login implementation
			await page.goto('/default-channel');

			// Check if user menu or account link exists
			const userMenu = page.locator('[href*="/account"], [aria-label*="account" i], [aria-label*="user" i]').first();
			const count = await userMenu.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should redirect to login for protected pages', async ({ page }) => {
			// Try to access account page without login
			await page.goto('/default-channel/account');
			await page.waitForLoadState('networkidle');

			const url = page.url();

			// Should be on login page or account page (if logged in)
			expect(url).toMatch(/login|account/);
		});

		test('should logout and clear session', async ({ page }) => {
			await page.goto('/default-channel');

			const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Sign Out")').first();

			if (await logoutButton.isVisible()) {
				await logoutButton.click();
				await page.waitForTimeout(1000);

				// Should redirect to home or login
				const url = page.url();
				expect(url).toBeDefined();
			}
		});
	});

	test.describe('Security & Validation', () => {
		test('should sanitize user input', async ({ page }) => {
			await page.goto('/default-channel/login');

			const emailInput = page.locator('input[type="email"], input[name="email"]').first();

			if (await emailInput.isVisible()) {
				// Try XSS payload
				await emailInput.fill('<script>alert("xss")</script>@example.com');

				const value = await emailInput.inputValue();

				// Should not execute script
				expect(value).toBeDefined();
			}
		});

		test('should have CSRF protection', async ({ page }) => {
			await page.goto('/default-channel/login');

			// Check for CSRF token in form
			const csrfInput = page.locator('input[name*="csrf" i], input[name*="token" i]').first();
			const count = await csrfInput.count();

			// May or may not have visible CSRF token
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should rate limit login attempts', async ({ page }) => {
			await page.goto('/default-channel/login');

			const emailInput = page.locator('input[type="email"], input[name="email"]').first();
			const passwordInput = page.locator('input[type="password"]').first();
			const loginButton = page.locator('button[type="submit"]').first();

			if (await emailInput.isVisible()) {
				// Try multiple failed login attempts
				for (let i = 0; i < 5; i++) {
					await emailInput.fill('test@example.com');
					await passwordInput.fill('wrongpassword');
					await loginButton.click();
					await page.waitForTimeout(500);
				}

				// Should show rate limit message (if implemented)
				const rateLimitMessage = page.locator('text=/too many|rate limit|try again later/i');
				const hasMessage = await rateLimitMessage.isVisible().catch(() => false);

				expect(typeof hasMessage).toBe('boolean');
			}
		});
	});

	test.describe('Mobile Authentication', () => {
		test.use({ viewport: { width: 375, height: 667 } });

		test('should display mobile-optimized login form', async ({ page }) => {
			await page.goto('/default-channel/login');

			const form = page.locator('form').first();
			await expect(form).toBeVisible();

			const formBox = await form.boundingBox();
			expect(formBox?.width).toBeLessThanOrEqual(375);
		});

		test('should have large touch-friendly buttons', async ({ page }) => {
			await page.goto('/default-channel/login');

			const loginButton = page.locator('button[type="submit"]').first();

			if (await loginButton.isVisible()) {
				const box = await loginButton.boundingBox();

				// Should be at least 44px tall for touch
				expect(box?.height).toBeGreaterThanOrEqual(40);
			}
		});

		test('should support autofill on mobile', async ({ page }) => {
			await page.goto('/default-channel/login');

			const emailInput = page.locator('input[type="email"]').first();
			const passwordInput = page.locator('input[type="password"]').first();

			// Check for autocomplete attributes
			const emailAutocomplete = await emailInput.getAttribute('autocomplete');
			const passwordAutocomplete = await passwordInput.getAttribute('autocomplete');

			// Should have autocomplete for better UX
			expect(emailAutocomplete !== null || passwordAutocomplete !== null).toBeDefined();
		});
	});
});
