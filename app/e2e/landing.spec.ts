import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test('shows SF-86 branding and action links', async ({ page }) => {
    await page.goto('/');

    // Title visible
    await expect(page.getByRole('heading', { name: 'SF-86' })).toBeVisible();

    // Descriptive text
    await expect(
      page.getByText('Questionnaire for National Security Positions'),
    ).toBeVisible();

    // Primary CTAs
    const startBtn = page.getByRole('button', { name: 'Start New Form' });
    await expect(startBtn).toBeVisible();

    const importLink = page.getByRole('link', { name: 'Import from PDF' });
    await expect(importLink).toBeVisible();
    await expect(importLink).toHaveAttribute('href', '/import');
  });

  test('creates form directly from home page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start New Form' }).click();
    // Should navigate directly to form (section1)
    await page.waitForURL('**/identification/section1', { timeout: 15_000 });
  });

  test('navigates to import page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Import from PDF' }).click();
    await page.waitForURL('/import', { timeout: 15_000 });
    await expect(
      page.getByRole('heading', { name: 'Import from PDF' }),
    ).toBeVisible();
  });
});
