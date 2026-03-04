import { test, expect, type APIRequestContext } from '@playwright/test';

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

    // Click Export PDF and wait for the download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export PDF' }).click(),
    ]);

    // Assert the downloaded file has a .pdf extension
    const filename = download.suggestedFilename();
    expect(filename).toContain('.pdf');
  });
});
