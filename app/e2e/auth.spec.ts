import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Sign In' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  });

  test('register page renders correctly', async ({ page }) => {
    await page.goto('/register');

    await expect(
      page.getByRole('heading', { name: 'Create Account' }),
    ).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Create Account' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
  });

  test('register page shows error for mismatched passwords', async ({
    page,
  }) => {
    await page.goto('/register');

    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm Password').fill('differentpassword');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('register page shows error for short password', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel('Email').fill('test@example.com');
    // Use 8+ chars that match (to pass HTML5 minLength) but trigger our JS check
    // by filling password and confirm with matching short values via JS to bypass
    // the HTML5 constraint validation
    const passwordInput = page.getByLabel('Password', { exact: true });
    const confirmInput = page.getByLabel('Confirm Password');

    // Remove minLength attribute so the form can submit with short password
    await passwordInput.evaluate((el: HTMLInputElement) => el.removeAttribute('minLength'));
    await confirmInput.evaluate((el: HTMLInputElement) => el.removeAttribute('minLength'));

    await passwordInput.fill('short');
    await confirmInput.fill('short');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(
      page.getByText('Password must be at least 8 characters'),
    ).toBeVisible();
  });

  test('login page links to register', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL('/register');
  });

  test('register page links to login', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/login');
  });

  test('protected routes redirect to login', async ({ page }) => {
    // A form route should redirect unauthenticated users to /login
    await page.goto('/some-submission-id/identification/personalInfo');

    // Should redirect to login with callbackUrl
    await expect(page).toHaveURL(/\/login/);
  });
});
