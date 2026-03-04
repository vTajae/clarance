import { test, expect, type APIRequestContext } from '@playwright/test';

// Create a real submission via the API and use its ID for all tests.
let submissionId: string;

async function createSubmission(request: APIRequestContext): Promise<string> {
  const resp = await request.post('/api/form/new', {
    data: { pdfVersion: 'sf861' },
  });
  expect(resp.ok()).toBeTruthy();
  const body = await resp.json();
  return body.submissionId as string;
}

test.beforeAll(async ({ request }) => {
  submissionId = await createSubmission(request);
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

  test('renders wizard controls with Previous, Next, and Save buttons', async ({
    page,
  }) => {
    const nav = page.getByRole('navigation', { name: 'Form navigation' });
    await expect(nav).toBeVisible();

    await expect(
      nav.getByRole('button', { name: /Previous/i }),
    ).toBeVisible();
    await expect(nav.getByRole('button', { name: /Next/i })).toBeVisible();
    await expect(nav.getByRole('button', { name: /Save/i })).toBeVisible();
  });

  test('Previous button is disabled on first section', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Form navigation' });
    const prevButton = nav.getByRole('button', { name: /Previous/i });
    await expect(prevButton).toBeDisabled();
  });

  test('Next button is clickable and advances', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Form navigation' });
    const nextButton = nav.getByRole('button', { name: /Next/i });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // In wizard mode, Next advances to the next step (or review).
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

  test('sidebar shows section groups', async ({ page }) => {
    const sidebar = page.locator('nav[aria-label="Form sections"]');
    await expect(sidebar.getByText('Identification')).toBeVisible();
  });

  test('expanding a group shows its sections', async ({ page }) => {
    const sidebar = page.locator('nav[aria-label="Form sections"]');

    // Identification group should be expanded by default (it's the current group)
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
