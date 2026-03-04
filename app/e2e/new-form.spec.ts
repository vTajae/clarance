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

  test('creates form and redirects to section 1', async ({ page }) => {
    await page.goto('/new');
    await page.getByRole('button', { name: 'Create Form' }).click();
    await expect(page).toHaveURL(/\/identification\/section1/);
  });
});
