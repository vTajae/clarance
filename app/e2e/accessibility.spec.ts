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

  test('login page form labels are associated with inputs', async ({
    page,
  }) => {
    await page.goto('/login');

    // Labels should be correctly associated
    const emailInput = page.getByLabel('Email');
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('required', '');

    const passwordInput = page.getByLabel('Password');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('register form has proper label associations', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByLabel('Email')).toHaveAttribute('type', 'email');
    await expect(
      page.getByLabel('Password', { exact: true }),
    ).toHaveAttribute('type', 'password');
    await expect(page.getByLabel('Confirm Password')).toHaveAttribute(
      'type',
      'password',
    );
  });

  test('new form page has proper semantics', async ({ page }) => {
    await page.goto('/new');

    // Heading hierarchy
    await expect(
      page.getByRole('heading', { name: 'New SF-86 Form' }),
    ).toBeVisible();

    // Select has associated label
    const select = page.getByLabel('PDF Version');
    await expect(select).toBeVisible();
  });

  test('import page has proper file input label', async ({ page }) => {
    await page.goto('/import');

    const fileInput = page.getByLabel('SF-86 PDF File');
    await expect(fileInput).toBeVisible();
    await expect(fileInput).toHaveAttribute('accept', '.pdf,application/pdf');
  });
});
