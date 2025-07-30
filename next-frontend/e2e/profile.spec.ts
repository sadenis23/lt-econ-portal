import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the profile page
    await page.goto('/profile');
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
  });

  test('should display profile information when authenticated', async ({ page }) => {
    // Mock authentication by setting localStorage (for testing purposes)
    await page.addInitScript(() => {
      // Mock user data
      window.localStorage.setItem('mockUser', JSON.stringify({
        username: 'testuser',
        email: 'test@example.com'
      }));
    });

    // Mock API responses
    await page.route('/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          user_id: 1,
          first_name: 'Test',
          role: 'policy_maker',
          language: 'en',
          newsletter: true,
          digest_frequency: 'weekly',
          onboarding_completed: true,
          topic_slugs: ['economy', 'labor'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        })
      });
    });

    await page.goto('/profile');

    // Check if profile information is displayed
    await expect(page.locator('text=testuser')).toBeVisible();
    await expect(page.locator('text=test@example.com')).toBeVisible();
    await expect(page.locator('text=Test')).toBeVisible();
    await expect(page.locator('text=Profile Complete')).toBeVisible();
  });

  test('should show incomplete profile warning', async ({ page }) => {
    // Mock incomplete profile
    await page.route('/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          user_id: 1,
          first_name: 'Test',
          role: 'policy_maker',
          language: 'en',
          newsletter: true,
          digest_frequency: 'weekly',
          onboarding_completed: false,
          topic_slugs: [],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        })
      });
    });

    await page.goto('/profile');

    // Check for incomplete profile warning
    await expect(page.locator('text=Profile Incomplete')).toBeVisible();
    await expect(page.locator('text=Complete Setup')).toBeVisible();
  });

  test('should navigate to onboarding when complete setup is clicked', async ({ page }) => {
    // Mock incomplete profile
    await page.route('/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          user_id: 1,
          first_name: 'Test',
          role: 'policy_maker',
          language: 'en',
          newsletter: true,
          digest_frequency: 'weekly',
          onboarding_completed: false,
          topic_slugs: [],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        })
      });
    });

    await page.goto('/profile');

    // Click complete setup button
    await page.click('text=Complete Setup');
    
    // Should navigate to onboarding page
    await expect(page).toHaveURL('/onboarding');
  });

  test('should complete onboarding and update profile status', async ({ page }) => {
    // Mock incomplete profile initially
    await page.route('/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          user_id: 1,
          first_name: 'Test',
          role: 'policy_maker',
          language: 'en',
          newsletter: true,
          digest_frequency: 'weekly',
          onboarding_completed: false,
          topic_slugs: [],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        })
      });
    });

    // Mock profile update API
    await page.route('/api/profile/update', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Profile updated successfully' })
      });
    });

    await page.goto('/profile');

    // Verify incomplete status
    await expect(page.locator('text=Profile Incomplete')).toBeVisible();
    await expect(page.locator('text=Complete Setup')).toBeVisible();

    // Navigate to onboarding
    await page.click('text=Complete Setup');
    await expect(page).toHaveURL('/onboarding');

    // Mock completed profile after onboarding
    await page.route('/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          user_id: 1,
          first_name: 'Updated Test',
          role: 'policy_maker',
          language: 'en',
          newsletter: true,
          digest_frequency: 'weekly',
          onboarding_completed: true,
          topic_slugs: ['economy', 'labor'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        })
      });
    });

    // Navigate back to profile
    await page.goto('/profile');

    // Verify completed status
    await expect(page.locator('text=Profile Complete')).toBeVisible();
    await expect(page.locator('text=Edit Profile')).toBeVisible();
    
    // Verify banner is not visible
    await expect(page.locator('text=Complete Setup')).not.toBeVisible();
    await expect(page.locator('text=Complete Your Profile')).not.toBeVisible();
  });

  test('should show topics of interest', async ({ page }) => {
    // Mock profile with topics
    await page.route('/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          user_id: 1,
          first_name: 'Test',
          role: 'policy_maker',
          language: 'en',
          newsletter: true,
          digest_frequency: 'weekly',
          onboarding_completed: true,
          topic_slugs: ['economy', 'labor', 'prices'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        })
      });
    });

    await page.goto('/profile');

    // Check for topics section
    await expect(page.locator('text=Topics of Interest')).toBeVisible();
    await expect(page.locator('text=economy')).toBeVisible();
    await expect(page.locator('text=labor')).toBeVisible();
    await expect(page.locator('text=prices')).toBeVisible();
  });

  test('should handle error state with retry functionality', async ({ page }) => {
    // Mock API error
    await page.route('/api/profile/me', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    await page.goto('/profile');

    // Check for error message
    await expect(page.locator('text=Failed to load profile')).toBeVisible();
    await expect(page.locator('text=Try again')).toBeVisible();

    // Mock successful response for retry
    await page.route('/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          user_id: 1,
          first_name: 'Test',
          role: 'policy_maker',
          language: 'en',
          newsletter: true,
          digest_frequency: 'weekly',
          onboarding_completed: true,
          topic_slugs: [],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        })
      });
    });

    // Click retry button
    await page.click('text=Try again');

    // Should show profile information after retry
    await expect(page.locator('text=Test')).toBeVisible();
  });

  test('should show logout confirmation modal', async ({ page }) => {
    // Mock complete profile
    await page.route('/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          user_id: 1,
          first_name: 'Test',
          role: 'policy_maker',
          language: 'en',
          newsletter: true,
          digest_frequency: 'weekly',
          onboarding_completed: true,
          topic_slugs: [],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        })
      });
    });

    await page.goto('/profile');

    // Click sign out button
    await page.click('text=Sign out');

    // Check for confirmation modal
    await expect(page.locator('text=Are you sure you want to sign out of your account?')).toBeVisible();
    await expect(page.locator('text=Yes, sign out')).toBeVisible();
    await expect(page.locator('text=Cancel')).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    // Mock complete profile
    await page.route('/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          user_id: 1,
          first_name: 'Test',
          role: 'policy_maker',
          language: 'en',
          newsletter: true,
          digest_frequency: 'weekly',
          onboarding_completed: true,
          topic_slugs: [],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        })
      });
    });

    await page.goto('/profile');

    // Click back to home link
    await page.click('text=Back to Home');
    
    // Should navigate to home page
    await expect(page).toHaveURL('/');
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mock complete profile
    await page.route('/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          user_id: 1,
          first_name: 'Test',
          role: 'policy_maker',
          language: 'en',
          newsletter: true,
          digest_frequency: 'weekly',
          onboarding_completed: true,
          topic_slugs: ['economy', 'labor'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        })
      });
    });

    await page.goto('/profile');

    // Check if content is visible on mobile
    await expect(page.locator('text=Test')).toBeVisible();
    await expect(page.locator('text=Sign out')).toBeVisible();
    await expect(page.locator('text=Back to Home')).toBeVisible();

    // Check if buttons stack vertically on mobile
    const buttons = page.locator('button, a[href="/"]');
    await expect(buttons).toHaveCount(3); // Edit Profile, Sign out, Back to Home
  });
}); 