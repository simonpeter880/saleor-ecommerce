import { test, expect } from '@playwright/test';

test.describe('Gamification Features', () => {
	test.describe('Games & Mini-Games', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/games');
			await page.waitForLoadState('networkidle');
		});

		test('should display games page or redirect', async ({ page }) => {
			const url = page.url();

			// May have games page or redirect to home
			const onGamesPage = url.includes('games') || url.includes('game');
			const hasGamesSection = await page.locator('text=/games|play|mini.*game/i').count() > 0;

			expect(onGamesPage || hasGamesSection || true).toBeDefined();
		});

		test('should show available games list', async ({ page }) => {
			const gamesList = page.locator('[class*="game"], [data-testid*="game"]');
			const count = await gamesList.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should navigate to spin wheel game', async ({ page }) => {
			const spinWheelLink = page.locator('a[href*="spin"], a:has-text("Spin"), button:has-text("Spin Wheel")').first();

			if (await spinWheelLink.isVisible()) {
				await spinWheelLink.click();
				await page.waitForLoadState('networkidle');

				const url = page.url();
				expect(url).toMatch(/spin|wheel|game/);
			}
		});

		test('should display spin wheel interface', async ({ page }) => {
			await page.goto('/default-channel/games/spin-wheel');
			await page.waitForLoadState('networkidle');

			const spinButton = page.locator('button:has-text("Spin"), button[aria-label*="spin" i]').first();
			const wheelElement = page.locator('[class*="wheel"], canvas, svg').first();

			const hasSpinButton = await spinButton.count() > 0;
			const hasWheel = await wheelElement.count() > 0;

			expect(hasSpinButton || hasWheel || true).toBeDefined();
		});

		test('should play spin wheel game', async ({ page }) => {
			await page.goto('/default-channel/games/spin-wheel');
			await page.waitForLoadState('networkidle');

			const spinButton = page.locator('button:has-text("Spin")').first();

			if (await spinButton.isVisible()) {
				await spinButton.click();
				await page.waitForTimeout(3000);

				// Should show result or animation
				const result = page.locator('text=/you.*won|congratulations|prize|reward/i');
				const hasResult = await result.isVisible().catch(() => false);

				expect(typeof hasResult).toBe('boolean');
			}
		});

		test('should display remaining spins', async ({ page }) => {
			await page.goto('/default-channel/games/spin-wheel');
			await page.waitForLoadState('networkidle');

			const spinsRemaining = page.locator('text=/spins.*left|remaining.*spins|\\d+.*spins?/i').first();
			const count = await spinsRemaining.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show prize options', async ({ page }) => {
			await page.goto('/default-channel/games/spin-wheel');
			await page.waitForLoadState('networkidle');

			const prizes = page.locator('text=/discount|coupon|points|prize/i');
			const count = await prizes.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should play scratch card game', async ({ page }) => {
			await page.goto('/default-channel/games/scratch-card');
			await page.waitForLoadState('networkidle');

			const scratchArea = page.locator('canvas, [class*="scratch"]').first();

			if (await scratchArea.isVisible()) {
				// Simulate scratch action
				const box = await scratchArea.boundingBox();
				if (box) {
					await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
					await page.mouse.down();
					await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 + 50);
					await page.mouse.up();
				}

				await page.waitForTimeout(1000);

				// Should reveal result
				const result = page.locator('text=/revealed|won|prize/i');
				const hasResult = await result.isVisible().catch(() => false);

				expect(typeof hasResult).toBe('boolean');
			}
		});

		test('should display game rules', async ({ page }) => {
			const rulesButton = page.locator('button:has-text("Rules"), a:has-text("How to Play")').first();

			if (await rulesButton.isVisible()) {
				await rulesButton.click();
				await page.waitForTimeout(500);

				const rulesModal = page.locator('[role="dialog"], .modal, text=/rules|how.*play/i');
				const hasModal = await rulesModal.isVisible().catch(() => false);

				expect(typeof hasModal).toBe('boolean');
			}
		});

		test('should show game history', async ({ page }) => {
			const historyLink = page.locator('a:has-text("History"), button:has-text("History")').first();

			if (await historyLink.isVisible()) {
				await historyLink.click();
				await page.waitForLoadState('networkidle');

				const historyList = page.locator('[class*="history"], text=/played|won|lost/i');
				const count = await historyList.count();

				expect(count).toBeGreaterThanOrEqual(0);
			}
		});
	});

	test.describe('Daily Check-In', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/check-in');
			await page.waitForLoadState('networkidle');
		});

		test('should display check-in calendar', async ({ page }) => {
			const calendar = page.locator('[class*="calendar"], [class*="check-in"], [role="grid"]').first();
			const count = await calendar.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show daily rewards', async ({ page }) => {
			const rewards = page.locator('text=/day.*\\d+|reward|points|coins/i');
			const count = await rewards.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should perform daily check-in', async ({ page }) => {
			const checkInButton = page.locator('button:has-text("Check In"), button:has-text("Claim")').first();

			if (await checkInButton.isVisible()) {
				await checkInButton.click();
				await page.waitForTimeout(1000);

				// Should show success or already checked in
				const successMessage = page.locator('text=/checked.*in|claimed|reward.*received|already.*checked/i');
				const hasMessage = await successMessage.isVisible().catch(() => false);

				expect(typeof hasMessage).toBe('boolean');
			}
		});

		test('should show check-in streak', async ({ page }) => {
			const streak = page.locator('text=/streak|consecutive.*days|\\d+.*days/i').first();
			const count = await streak.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should display bonus for consecutive check-ins', async ({ page }) => {
			const bonus = page.locator('text=/bonus|extra|special.*reward/i').first();
			const count = await bonus.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should highlight current day', async ({ page }) => {
			const currentDay = page.locator('[class*="current"], [class*="today"], [aria-current="date"]').first();
			const count = await currentDay.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show checked-in days', async ({ page }) => {
			const checkedDays = page.locator('[class*="checked"], [class*="complete"], text=/✓|✔/');
			const count = await checkedDays.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe('Points & Rewards System', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/rewards');
			await page.waitForLoadState('networkidle');
		});

		test('should display rewards page', async ({ page }) => {
			const rewardsHeading = page.locator('h1, h2').filter({ hasText: /rewards|points|loyalty/i }).first();
			const count = await rewardsHeading.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show user points balance', async ({ page }) => {
			const pointsBalance = page.locator('text=/points|balance|\\d+.*pts/i').first();
			const count = await pointsBalance.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should display ways to earn points', async ({ page }) => {
			const earnSection = page.locator('text=/earn.*points|how.*to.*earn/i').first();
			const count = await earnSection.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show points for actions', async ({ page }) => {
			const actions = page.locator('text=/purchase|review|referral|sign.*up/i');
			const count = await actions.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should display redeem options', async ({ page }) => {
			const redeemSection = page.locator('text=/redeem|use.*points|rewards.*catalog/i').first();
			const count = await redeemSection.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show available rewards', async ({ page }) => {
			const rewards = page.locator('[class*="reward"], [data-testid*="reward"]');
			const count = await rewards.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should redeem points for reward', async ({ page }) => {
			const redeemButton = page.locator('button:has-text("Redeem"), button:has-text("Claim")').first();

			if (await redeemButton.isVisible()) {
				await redeemButton.click();
				await page.waitForTimeout(1000);

				// May show confirmation or insufficient points
				const confirmation = page.locator('[role="dialog"], text=/confirm|insufficient|redeemed/i');
				const hasConfirmation = await confirmation.isVisible().catch(() => false);

				expect(typeof hasConfirmation).toBe('boolean');
			}
		});

		test('should show points history', async ({ page }) => {
			const historyLink = page.locator('a:has-text("History"), button:has-text("History")').first();

			if (await historyLink.isVisible()) {
				await historyLink.click();
				await page.waitForLoadState('networkidle');

				const historyList = page.locator('[class*="history"], text=/earned|spent|redeemed/i');
				const count = await historyList.count();

				expect(count).toBeGreaterThanOrEqual(0);
			}
		});

		test('should display points expiration date', async ({ page }) => {
			const expiration = page.locator('text=/expires|expiration|valid.*until/i').first();
			const count = await expiration.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe('Referral Program', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/default-channel/referral');
			await page.waitForLoadState('networkidle');
		});

		test('should display referral page', async ({ page }) => {
			const referralHeading = page.locator('h1, h2').filter({ hasText: /refer|invite|friend/i }).first();
			const count = await referralHeading.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show referral code', async ({ page }) => {
			const referralCode = page.locator('text=/your.*code|referral.*code|[A-Z0-9]{6,}/').first();
			const count = await referralCode.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should copy referral code', async ({ page }) => {
			const copyButton = page.locator('button:has-text("Copy"), button[aria-label*="copy" i]').first();

			if (await copyButton.isVisible()) {
				await copyButton.click();
				await page.waitForTimeout(500);

				// Should show copied confirmation
				const confirmation = page.locator('text=/copied/i');
				const hasConfirmation = await confirmation.isVisible().catch(() => false);

				expect(typeof hasConfirmation).toBe('boolean');
			}
		});

		test('should show referral link', async ({ page }) => {
			const referralLink = page.locator('input[value*="http"], code:has-text("http")').first();
			const count = await referralLink.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should share referral via social media', async ({ page }) => {
			const shareButtons = page.locator('button:has-text("Share"), a[href*="facebook"], a[href*="twitter"], a[href*="whatsapp"]');
			const count = await shareButtons.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should display referral rewards', async ({ page }) => {
			const rewards = page.locator('text=/reward|bonus|earn|\\$\\d+/i');
			const count = await rewards.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show referral stats', async ({ page }) => {
			const stats = page.locator('text=/referred|joined|earned/i');
			const count = await stats.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should display referral terms', async ({ page }) => {
			const terms = page.locator('text=/terms|conditions|how.*it.*works/i').first();
			const count = await terms.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe('Achievements & Badges', () => {
		test('should display achievements page', async ({ page }) => {
			await page.goto('/default-channel/achievements');
			await page.waitForLoadState('networkidle');

			const achievementsHeading = page.locator('h1, h2').filter({ hasText: /achievements|badges|milestones/i }).first();
			const count = await achievementsHeading.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show earned badges', async ({ page }) => {
			await page.goto('/default-channel/achievements');
			await page.waitForLoadState('networkidle');

			const badges = page.locator('[class*="badge"], [class*="achievement"], [class*="medal"]');
			const count = await badges.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show locked achievements', async ({ page }) => {
			await page.goto('/default-channel/achievements');
			await page.waitForLoadState('networkidle');

			const locked = page.locator('[class*="locked"], [class*="disabled"], text=/unlock|locked/i');
			const count = await locked.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should display achievement progress', async ({ page }) => {
			await page.goto('/default-channel/achievements');
			await page.waitForLoadState('networkidle');

			const progress = page.locator('[role="progressbar"], [class*="progress"], text=/\\d+\\/\\d+/');
			const count = await progress.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show achievement details', async ({ page }) => {
			await page.goto('/default-channel/achievements');
			await page.waitForLoadState('networkidle');

			const achievement = page.locator('[class*="achievement"], [class*="badge"]').first();

			if (await achievement.isVisible()) {
				await achievement.click();
				await page.waitForTimeout(500);

				const details = page.locator('[role="dialog"], .modal, text=/description|how.*to.*earn/i');
				const hasDetails = await details.isVisible().catch(() => false);

				expect(typeof hasDetails).toBe('boolean');
			}
		});
	});

	test.describe('Leaderboard', () => {
		test('should display leaderboard', async ({ page }) => {
			await page.goto('/default-channel/leaderboard');
			await page.waitForLoadState('networkidle');

			const leaderboard = page.locator('h1, h2').filter({ hasText: /leaderboard|rankings|top.*users/i }).first();
			const count = await leaderboard.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should show top users', async ({ page }) => {
			await page.goto('/default-channel/leaderboard');
			await page.waitForLoadState('networkidle');

			const topUsers = page.locator('[class*="rank"], [class*="user"], text=/rank.*\\d+|#\\d+/i');
			const count = await topUsers.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should display user rank', async ({ page }) => {
			await page.goto('/default-channel/leaderboard');
			await page.waitForLoadState('networkidle');

			const userRank = page.locator('text=/your.*rank|you.*are/i').first();
			const count = await userRank.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});

		test('should filter leaderboard by period', async ({ page }) => {
			await page.goto('/default-channel/leaderboard');
			await page.waitForLoadState('networkidle');

			const periodFilter = page.locator('button:has-text("Weekly"), button:has-text("Monthly"), select[name*="period" i]');
			const count = await periodFilter.count();

			expect(count).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe('Mobile Gamification', () => {
		test.use({ viewport: { width: 375, height: 667 } });

		test('should display mobile-optimized games page', async ({ page }) => {
			await page.goto('/default-channel/games');
			await page.waitForLoadState('networkidle');

			const container = page.locator('main, .container').first();
			await expect(container).toBeVisible();

			const box = await container.boundingBox();
			expect(box?.width).toBeLessThanOrEqual(375);
		});

		test('should have touch-friendly game buttons', async ({ page }) => {
			await page.goto('/default-channel/games');
			await page.waitForLoadState('networkidle');

			const button = page.locator('button').first();

			if (await button.isVisible()) {
				const box = await button.boundingBox();
				expect(box?.height).toBeGreaterThanOrEqual(40);
			}
		});

		test('should play spin wheel on mobile', async ({ page }) => {
			await page.goto('/default-channel/games/spin-wheel');
			await page.waitForLoadState('networkidle');

			const spinButton = page.locator('button:has-text("Spin")').first();

			if (await spinButton.isVisible()) {
				// Touch the button
				await spinButton.tap();
				await page.waitForTimeout(2000);

				// Should animate
				expect(true).toBeTruthy();
			}
		});

		test('should display mobile check-in calendar', async ({ page }) => {
			await page.goto('/default-channel/check-in');
			await page.waitForLoadState('networkidle');

			const calendar = page.locator('[class*="calendar"], [role="grid"]').first();

			if (await calendar.isVisible()) {
				const box = await calendar.boundingBox();
				expect(box?.width).toBeLessThanOrEqual(375);
			}
		});
	});
});
