import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('landing page has skip-to-content link', async ({ page }) => {
    await page.goto('/');

    // Skip link exists and is focusable
    const skipLink = page.getByText('Skip to main content');
    await expect(skipLink).toBeAttached();

    // Focus the skip link (it's sr-only, becomes visible on focus)
    await skipLink.focus();
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('new form page has proper semantics', async ({ page }) => {
    await page.goto('/new');

    // Heading hierarchy
    await expect(
      page.getByRole('heading', { name: 'New SF-86 Form' }),
    ).toBeVisible();

    // Descriptive text is present
    await expect(
      page.getByText('Start a new SF-86 questionnaire'),
    ).toBeVisible();

    // Create Form button has proper role
    await expect(
      page.getByRole('button', { name: 'Create Form' }),
    ).toBeVisible();
  });

  test('import page has proper file input label', async ({ page }) => {
    await page.goto('/import');

    const fileInput = page.getByLabel('SF-86 PDF File');
    await expect(fileInput).toBeVisible();
    await expect(fileInput).toHaveAttribute('accept', '.pdf,application/pdf');
  });
});
