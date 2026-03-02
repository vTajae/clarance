import { test, expect } from '@playwright/test';

test.describe('New form page', () => {
  test('renders form creation UI', async ({ page }) => {
    await page.goto('/new');

    await expect(
      page.getByRole('heading', { name: 'New SF-86 Form' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Create Form' }),
    ).toBeVisible();
  });

  test('shows error when creating form without auth', async ({ page }) => {
    await page.goto('/new');
    await page.getByRole('button', { name: 'Create Form' }).click();

    // API returns 401 without auth — page shows error
    await expect(page.locator('p.text-red-600')).toBeVisible({ timeout: 10000 });
  });
});
