import { test, expect } from '@playwright/test';

test.describe('Import page', () => {
  test('renders import UI', async ({ page }) => {
    await page.goto('/import');

    await expect(
      page.getByRole('heading', { name: 'Import from PDF' }),
    ).toBeVisible();
    await expect(page.getByLabel('SF-86 PDF File')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Import PDF' }),
    ).toBeVisible();
  });

  test('import button is disabled without file', async ({ page }) => {
    await page.goto('/import');

    const button = page.getByRole('button', { name: 'Import PDF' });
    await expect(button).toBeDisabled();
  });
});
