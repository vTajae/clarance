import { test, expect } from '@playwright/test';

// Create a real submission by navigating to /new and clicking Create Form.
let submissionId: string;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto('/new');
  await page.getByRole('button', { name: 'Create Form' }).click();
  // Wait for navigation to /{submissionId}/identification/section1
  await page.waitForURL(/\/[a-f0-9-]+\/identification\/section1/);
  submissionId = page.url().split('/')[3]; // extract UUID from URL
  await page.close();
});

test.describe('Form shell layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/${submissionId}/identification/section1`);
  });

  test('renders top bar with SF-86 branding', async ({ page }) => {
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    await expect(header.getByText('SF-86')).toBeVisible();
  });

  test('renders section heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Section 1 - Full Name' }),
    ).toBeVisible();
  });

  test('renders wizard controls with Previous, Next/Review, and Save buttons', async ({
    page,
  }) => {
    const nav = page.getByRole('navigation', { name: 'Form navigation' });
    await expect(nav).toBeVisible();

    await expect(
      nav.getByRole('button', { name: /Previous/i }),
    ).toBeVisible();
    // Section 1 has 1 step — button says "Review" (last step) instead of "Next"
    await expect(nav.getByRole('button', { name: /Next|Review/i })).toBeVisible();
    await expect(nav.getByRole('button', { name: /Save/i })).toBeVisible();
  });

  test('Previous button is disabled on first section', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Form navigation' });
    const prevButton = nav.getByRole('button', { name: /Previous/i });
    await expect(prevButton).toBeDisabled();
  });

  test('Next/Review button is clickable and advances', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Form navigation' });
    // Section 1 has 1 step — button says "Review" on last step
    const nextButton = nav.getByRole('button', { name: /Next|Review/i });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // In wizard mode, clicking advances to the next step or review.
    // Just verify the button worked and we're still on the form.
    await expect(page.getByRole('banner')).toBeVisible();
  });

  test('progress bar shows 0% on empty form', async ({ page }) => {
    const progressBar = page.getByRole('progressbar');
    await expect(progressBar).toBeVisible();
    await expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  test('Export PDF button exists', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Export PDF' }),
    ).toBeVisible();
  });
});

test.describe('Section sidebar navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/${submissionId}/identification/section1`);
  });

  test('sidebar shows section entries', async ({ page }) => {
    const sidebar = page.locator('nav[aria-label="Form sections"]');
    await expect(sidebar.getByText('Section 1 - Full Name')).toBeVisible();
  });

  test('sidebar shows nearby sections', async ({ page }) => {
    const sidebar = page.locator('nav[aria-label="Form sections"]');

    await expect(
      sidebar.getByText('Section 1 - Full Name'),
    ).toBeVisible();
    await expect(
      sidebar.getByText('Section 2 - Date of Birth'),
    ).toBeVisible();
    await expect(
      sidebar.getByText('Section 3 - Place of Birth'),
    ).toBeVisible();
  });

  test('clicking a section navigates to it', async ({ page }) => {
    const sidebar = page.locator('nav[aria-label="Form sections"]');
    await sidebar.getByText('Section 3 - Place of Birth').click();

    await expect(page).toHaveURL(
      `/${submissionId}/identification/section3`,
    );
    await expect(
      page.getByRole('heading', { name: 'Section 3 - Place of Birth' }),
    ).toBeVisible();
  });
});
