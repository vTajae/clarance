import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import os from 'os';

const PDF_SERVICE = 'http://localhost:8001';

// Small set of test field values (Section 1 — personal info on page 1 of SF-86)
const TEST_FIELD_VALUES: Record<string, string> = {
  'form1[0].Sections1-6[0].section5[0].TextField11[2]': 'Smith',
  'form1[0].Sections1-6[0].section5[0].TextField11[1]': 'John',
  'form1[0].Sections1-6[0].section5[0].TextField11[0]': 'Robert',
};

let skipPdfService = false;
let tempPdfPath: string | null = null;

test.describe('Round-trip import', () => {
  test.beforeAll(async ({ request }) => {
    // Check if the PDF service is reachable
    try {
      const health = await request.get(`${PDF_SERVICE}/health`);
      if (!health.ok()) {
        skipPdfService = true;
      }
    } catch {
      skipPdfService = true;
    }
  });

  test.afterAll(async () => {
    if (tempPdfPath && fs.existsSync(tempPdfPath)) {
      fs.unlinkSync(tempPdfPath);
      tempPdfPath = null;
    }
  });

  test('upload filled PDF and see success message', async ({
    page,
    request,
  }) => {
    test.skip(skipPdfService, 'PDF service at localhost:8001 is not running');

    // Step 1: Generate a filled PDF via the PDF service
    const fillResponse = await request.post(`${PDF_SERVICE}/fill-pdf`, {
      data: {
        template_path: 'sf861.pdf',
        field_values: TEST_FIELD_VALUES,
      },
    });

    expect(fillResponse.ok()).toBe(true);

    const pdfBytes = await fillResponse.body();
    expect(pdfBytes.length).toBeGreaterThan(0);

    // Write PDF to a temp file
    tempPdfPath = path.join(os.tmpdir(), `round-trip-test-${Date.now()}.pdf`);
    fs.writeFileSync(tempPdfPath, pdfBytes);

    // Step 2: Navigate to the import page (public route, no auth needed)
    await page.goto('/import');
    await expect(
      page.getByRole('heading', { name: 'Import from PDF' }),
    ).toBeVisible();

    // Step 3: Set the file input to our filled PDF
    const fileInput = page.getByLabel('SF-86 PDF File');
    await fileInput.setInputFiles(tempPdfPath);

    // Step 4: The Import button should now be enabled
    const importButton = page.getByRole('button', { name: 'Import PDF' });
    await expect(importButton).toBeEnabled();

    // Step 5: Click Import and wait for success
    await importButton.click();

    // Wait for "Importing..." state to appear first
    await expect(
      page.getByRole('button', { name: 'Importing...' }),
    ).toBeVisible({ timeout: 5_000 });

    // Wait for the success banner
    await expect(page.getByText('PDF imported successfully!')).toBeVisible({
      timeout: 60_000,
    });

    // Step 6: Verify the stats line shows mapped fields
    await expect(page.getByText(/Mapped \d+ of \d+ extracted fields\./)).toBeVisible();

    // Step 7: After success the app redirects to the form page.
    await page.waitForURL(/\/identification\//, {
      timeout: 30_000,
    });
  });

  test('API-level round-trip: fill then extract preserves values', async ({
    request,
  }) => {
    test.skip(skipPdfService, 'PDF service at localhost:8001 is not running');

    // Fill a PDF via the service
    const fillResponse = await request.post(`${PDF_SERVICE}/fill-pdf`, {
      data: {
        template_path: 'sf861.pdf',
        field_values: TEST_FIELD_VALUES,
      },
    });
    expect(fillResponse.ok()).toBe(true);

    const pdfBytes = await fillResponse.body();

    // Extract fields from the filled PDF
    const extractResponse = await request.post(`${PDF_SERVICE}/extract-fields`, {
      multipart: {
        file: {
          name: 'test.pdf',
          mimeType: 'application/pdf',
          buffer: pdfBytes,
        },
      },
    });
    expect(extractResponse.ok()).toBe(true);

    const extracted = await extractResponse.json();
    const fields = extracted.fields as Record<string, string>;

    // Verify each test value was preserved through fill → extract
    for (const [pdfFieldName, expectedValue] of Object.entries(TEST_FIELD_VALUES)) {
      expect(fields[pdfFieldName]).toBe(expectedValue);
    }
  });
});
