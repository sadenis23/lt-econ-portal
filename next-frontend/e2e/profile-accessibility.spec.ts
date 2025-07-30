import { test, expect } from '@playwright/test';

test.describe('Profile Page Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
      }));
    });

    // Mock profile data
    await page.route('/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          user_id: 1,
          role: 'policy_maker',
          language: 'en',
          newsletter: true,
          digest_frequency: 'weekly',
          onboarding_completed: true,
          topic_slugs: ['economy', 'labor'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }),
      });
    });

    await page.goto('/profile');
  });

  test('should have visible action buttons with proper contrast', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('button[aria-label="Edit your profile information"]');
    await page.waitForSelector('button[aria-label="Sign out of your account"]');

    // Check that buttons are visible
    const editButton = page.locator('button[aria-label="Edit your profile information"]');
    const signOutButton = page.locator('button[aria-label="Sign out of your account"]');
    const backToHomeLink = page.locator('a[aria-label="Return to the home page"]');

    await expect(editButton).toBeVisible();
    await expect(signOutButton).toBeVisible();
    await expect(backToHomeLink).toBeVisible();

    // Check button styling classes
    await expect(editButton).toHaveClass(/bg-brandMint/);
    await expect(editButton).toHaveClass(/text-gray-900/);
    await expect(signOutButton).toHaveClass(/bg-brandRose/);
    await expect(signOutButton).toHaveClass(/text-gray-900/);

    // Check that buttons have proper focus indicators
    await editButton.focus();
    await expect(editButton).toHaveClass(/focus:ring-2/);

    await signOutButton.focus();
    await expect(signOutButton).toHaveClass(/focus:ring-2/);
  });

  test('should have proper responsive layout', async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('.grid.grid-cols-1.md\\:grid-cols-2')).toBeVisible();

    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.grid.grid-cols-1.md\\:grid-cols-2')).toBeVisible();

    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.flex.flex-col.sm\\:flex-row')).toBeVisible();
  });

  test('should have proper ARIA attributes and semantic structure', async ({ page }) => {
    // Check main heading
    await expect(page.locator('h1')).toHaveText('testuser');

    // Check section headings
    await expect(page.locator('#profile-info-heading')).toBeAttached();
    await expect(page.locator('#topics-heading')).toBeAttached();

    // Check button ARIA labels
    await expect(page.locator('button[aria-label="Edit your profile information"]')).toBeAttached();
    await expect(page.locator('button[aria-label="Sign out of your account"]')).toBeAttached();
    await expect(page.locator('a[aria-label="Return to the home page"]')).toBeAttached();
  });

  test('should handle keyboard navigation properly', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('button[aria-label="Edit your profile information"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('button[aria-label="Sign out of your account"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('a[aria-label="Return to the home page"]')).toBeFocused();
  });

  test('should show confirmation modal with accessible buttons', async ({ page }) => {
    // Click sign out button
    await page.click('button[aria-label="Sign out of your account"]');

    // Check modal appears
    await expect(page.locator('text=Are you sure you want to sign out of your account?')).toBeVisible();

    // Check modal buttons have proper styling
    const confirmButton = page.locator('button:has-text("Yes, sign out")');
    const cancelButton = page.locator('button:has-text("Cancel")');

    await expect(confirmButton).toHaveClass(/bg-brandRose/);
    await expect(confirmButton).toHaveClass(/text-gray-900/);
    await expect(cancelButton).toHaveClass(/bg-gray-200/);
  });

  test('should display language information correctly', async ({ page }) => {
    // Check language display
    await expect(page.locator('text=English')).toBeVisible();
  });

  test('should display topics of interest correctly', async ({ page }) => {
    // Check topics display
    await expect(page.locator('text=economy')).toBeVisible();
    await expect(page.locator('text=labor')).toBeVisible();
  });
}); 