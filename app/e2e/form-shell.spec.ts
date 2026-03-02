import { test, expect } from '@playwright/test';

// These tests use a fixed submission ID and navigate directly.
// They test the form shell layout, sidebar, and wizard controls.
// NOTE: Requires auth to be bypassed or session to exist. These test the
// public-path fallback — the form route may redirect to login in production.
// For CI, mock auth or seed a session cookie.

const SUBMISSION_ID = '00000000-0000-0000-0000-000000000001';
const FIRST_SECTION_URL = `/${SUBMISSION_ID}/identification/personalInfo`;

test.describe('Form shell layout', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a section page. May redirect to login if auth is enforced.
    await page.goto(FIRST_SECTION_URL);
  });

  test('renders top bar with SF-86 branding', async ({ page }) => {
    // If redirected to login, skip shell tests
    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    await expect(header.getByText('SF-86')).toBeVisible();
  });

  test('renders section heading', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    await expect(
      page.getByRole('heading', { name: 'Personal Information' }),
    ).toBeVisible();
  });

  test('renders wizard controls with Previous and Next buttons', async ({
    page,
  }) => {
    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    const nav = page.getByRole('navigation', { name: 'Form navigation' });
    await expect(nav).toBeVisible();

    await expect(
      nav.getByRole('button', { name: /Previous/i }),
    ).toBeVisible();
    await expect(nav.getByRole('button', { name: /Next/i })).toBeVisible();
    await expect(nav.getByRole('button', { name: /Save/i })).toBeVisible();
  });

  test('Previous button is disabled on first section', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    const nav = page.getByRole('navigation', { name: 'Form navigation' });
    const prevButton = nav.getByRole('button', { name: /Previous/i });
    await expect(prevButton).toBeDisabled();
  });

  test('Next button navigates to next section', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    const nav = page.getByRole('navigation', { name: 'Form navigation' });
    await nav.getByRole('button', { name: /Next/i }).click();

    // Second section is birthInfo
    await expect(page).toHaveURL(
      `/${SUBMISSION_ID}/identification/birthInfo`,
    );
  });

  test('progress bar shows 0% on empty form', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    const progressBar = page.getByRole('progressbar');
    await expect(progressBar).toBeVisible();
    await expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  test('Export PDF link exists', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    await expect(
      page.getByRole('link', { name: 'Export PDF' }),
    ).toBeVisible();
  });
});

test.describe('Section sidebar navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FIRST_SECTION_URL);
  });

  test('sidebar shows section groups', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    // Check that key group names are visible in the sidebar
    const sidebar = page.locator('nav[aria-label="Form sections"]');
    await expect(sidebar.getByText('Identification')).toBeVisible();
  });

  test('expanding a group shows its sections', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    const sidebar = page.locator('nav[aria-label="Form sections"]');

    // Identification group should be expanded by default (it's the current group)
    await expect(sidebar.getByText('Personal Information')).toBeVisible();
    await expect(sidebar.getByText('Place of Birth')).toBeVisible();
    await expect(sidebar.getByText('Other Names Used')).toBeVisible();
  });

  test('clicking a section navigates to it', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    const sidebar = page.locator('nav[aria-label="Form sections"]');
    await sidebar.getByText('Place of Birth').click();

    await expect(page).toHaveURL(
      `/${SUBMISSION_ID}/identification/birthInfo`,
    );
    await expect(
      page.getByRole('heading', { name: 'Place of Birth' }),
    ).toBeVisible();
  });
});
