import { test, expect } from '@playwright/test';

test.describe('Onboarding Wizard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
      }));
    });

    await page.goto('/onboarding');
  });

  test('should complete onboarding wizard successfully', async ({ page }) => {
    await page.goto('/onboarding');

    // Step 1: Role & Goals
    await expect(page.locator('text=Step 1 of 4')).toBeVisible();
    await expect(page.locator('text=25% complete')).toBeVisible();
    const roleOption = page.locator('input[value="policy_maker"]');
    await roleOption.check();
    const continueButton = page.locator('button:has-text("Continue")');
    await continueButton.click();

    // Step 2: Topics
    await expect(page.locator('text=Step 2 of 4')).toBeVisible();
    await expect(page.locator('text=50% complete')).toBeVisible();
    const topicOption = page.locator('input[value="economy"]');
    await topicOption.check();
    await continueButton.click();

    // Step 3: Preferences
    await expect(page.locator('text=Step 3 of 4')).toBeVisible();
    await expect(page.locator('text=75% complete')).toBeVisible();
    // Continue with defaults (newsletter enabled, weekly digest)
    await continueButton.click();

    // Step 4: Language
    await expect(page.locator('text=Step 4 of 4')).toBeVisible();
    await expect(page.locator('text=100% complete')).toBeVisible();
    // Language should be pre-selected (English by default), so Complete button should be enabled
    const completeButton = page.locator('button:has-text("Complete")');
    await expect(completeButton).toBeEnabled();

    // Click Complete
    await completeButton.click();

    // Verify completion modal appears
    await expect(page.locator('text=You\'re all set')).toBeVisible();
    await expect(page.locator('text=Your profile is complete')).toBeVisible();
  });

  test('should show language options correctly', async ({ page }) => {
    await page.goto('/onboarding');

    // Navigate to language step
    await page.locator('input[value="policy_maker"]').check();
    await page.locator('button:has-text("Continue")').click();
    await page.locator('input[value="economy"]').check();
    await page.locator('button:has-text("Continue")').click();
    await page.locator('button:has-text("Continue")').click();

    // Check that only Lithuanian and English options are available
    await expect(page.locator('text=Lietuvių')).toBeVisible();
    await expect(page.locator('text=English')).toBeVisible();
    
    // Verify no Russian option exists
    await expect(page.locator('text=Русский')).not.toBeVisible();
  });
}); 