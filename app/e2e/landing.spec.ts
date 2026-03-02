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
    const startLink = page.getByRole('link', { name: 'Start New Form' });
    await expect(startLink).toBeVisible();
    await expect(startLink).toHaveAttribute('href', '/new');

    const importLink = page.getByRole('link', { name: 'Import from PDF' });
    await expect(importLink).toBeVisible();
    await expect(importLink).toHaveAttribute('href', '/import');
  });

  test('navigates to new form page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Start New Form' }).click();
    await page.waitForURL('/new', { timeout: 15_000 });
    await expect(
      page.getByRole('heading', { name: 'New SF-86 Form' }),
    ).toBeVisible();
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
