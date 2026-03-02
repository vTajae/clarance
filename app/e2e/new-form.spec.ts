import { test, expect } from '@playwright/test';

test.describe('New form page', () => {
  test('renders form creation UI', async ({ page }) => {
    await page.goto('/new');

    await expect(
      page.getByRole('heading', { name: 'New SF-86 Form' }),
    ).toBeVisible();
    await expect(page.getByLabel('PDF Version')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Create Form' }),
    ).toBeVisible();
  });

  test('has PDF version selector with default', async ({ page }) => {
    await page.goto('/new');

    const select = page.getByLabel('PDF Version');
    await expect(select).toHaveValue('sf861');

    // Check both options exist
    const options = select.locator('option');
    await expect(options).toHaveCount(2);
    await expect(options.nth(0)).toHaveText('SF-86 (Standard)');
    await expect(options.nth(1)).toHaveText('SF-86 (Revised)');
  });

  test('clicking Create Form redirects to login with form URL as callback', async ({
    page,
  }) => {
    await page.goto('/new');
    await page.getByRole('button', { name: 'Create Form' }).click();

    // Form pages require auth — user is redirected to login with the form URL
    // as callbackUrl so they return to the form after logging in
    await expect(page).toHaveURL(/\/login\?callbackUrl=/);
    await expect(page.url()).toContain('identification%2FpersonalInfo');
  });
});
