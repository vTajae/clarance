import { test, expect } from '@playwright/test';

let submissionId: string;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto('/new');
  await page.getByRole('button', { name: 'Create Form' }).click();
  await page.waitForURL(/\/[a-f0-9-]+\/identification\/section1/);
  submissionId = page.url().split('/')[3];
  await page.close();
});

test.describe('Export PDF', () => {
  test('fills a field and exports PDF', async ({ page }) => {
    // Navigate to section 1 (Full Name)
    await page.goto(`/${submissionId}/identification/section1`);
    await expect(
      page.getByRole('heading', { name: 'Section 1 - Full Name' }),
    ).toBeVisible();

    // Fill in the first visible text input
    const firstInput = page.locator('input[type="text"]').first();
    await firstInput.fill('TestLastName');

    // Wait for auto-save debounce (3 seconds)
    await page.waitForTimeout(3000);

    // Click Export PDF — the validation dialog may appear since form is incomplete
    page.on('dialog', (dialog) => dialog.accept());

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export PDF' }).click(),
    ]);

    // Assert the downloaded file has a .pdf extension
    const filename = download.suggestedFilename();
    expect(filename).toContain('.pdf');
  });
});
