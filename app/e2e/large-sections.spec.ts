/**
 * Deep Validation of the 5 Largest Sections.
 *
 * section13A (1036), section18 (964), section20A (361),
 * section17 (329), section20B (315)
 *
 * For each:
 * - Registry field count assertion
 * - Full gate toggle + ALL conditional fields writable (inject + readback 100%)
 * - Full PDF export roundtrip with per-type breakdown
 */

import { test, expect } from '@playwright/test';
import {
  createSubmission,
  navigateToSection,
  waitForJotaiStore,
  injectValues,
  readbackValues,
  getFieldsBySection,
  makeAllGatesYes,
  buildPdfNameMap,
} from './helpers/test-fixtures';
import {
  makeSectionValues,
  resetFieldIndex,
  computeExpectedPdfValue,
} from './helpers/field-value-generators';
import { checkPdfServiceHealth, exportPdf, extractFields } from './helpers/pdf-helpers';

const LARGE_SECTIONS = [
  { section: 'section13A' as const, minFields: 1000 },
  { section: 'section18' as const, minFields: 900 },
  { section: 'section20A' as const, minFields: 350 },
  { section: 'section17' as const, minFields: 320 },
  { section: 'section20B' as const, minFields: 300 },
] as const;

let submissionId: string;
let pdfServiceAvailable = false;

test.beforeAll(async ({ browser, request }) => {
  const page = await browser.newPage();
  submissionId = await createSubmission(page);
  await page.close();
  pdfServiceAvailable = await checkPdfServiceHealth(request);
});

for (const { section, minFields } of LARGE_SECTIONS) {
  test.describe(`Large section: ${section}`, () => {
    test('has expected field count', () => {
      const fields = getFieldsBySection(section);
      expect(fields.length).toBeGreaterThanOrEqual(minFields);
    });

    test('full inject + readback with gates YES', async ({ page }) => {
      test.setTimeout(180_000);

      const fields = getFieldsBySection(section);
      await navigateToSection(page, submissionId, section);
      await waitForJotaiStore(page);

      // Set all gates to YES
      const gateValues = makeAllGatesYes();
      await injectValues(page, gateValues);
      await page.waitForTimeout(500);

      // Inject all field values
      resetFieldIndex();
      const values = makeSectionValues(fields);
      await injectValues(page, values);

      // Readback and verify
      const keys = Object.keys(values);
      const actual = await readbackValues(page, keys);

      let matches = 0;
      for (const key of keys) {
        if (String(actual[key]) === String(values[key])) matches++;
      }
      expect(matches).toBe(keys.length);
    });

    test('PDF export roundtrip', async ({ page, request }) => {
      test.skip(!pdfServiceAvailable, 'PDF service not available');
      test.setTimeout(180_000);

      const fields = getFieldsBySection(section);
      await navigateToSection(page, submissionId, section);
      await waitForJotaiStore(page);

      // Set gates + inject values
      const gateValues = makeAllGatesYes();
      await injectValues(page, gateValues);
      await page.waitForTimeout(500);

      resetFieldIndex();
      const values = makeSectionValues(fields);
      await injectValues(page, values);

      // Merge gate values with field values for export
      const allValues: Record<string, unknown> = { ...gateValues, ...values };

      // Export PDF
      const pdfBuffer = await exportPdf(request, allValues);
      expect(pdfBuffer.length).toBeGreaterThan(0);

      // Extract fields
      const extracted = await extractFields(request, pdfBuffer);
      const pdfNameMap = buildPdfNameMap();

      // Compare per field (skip radios — PyMuPDF extraction limitation)
      let matched = 0;
      let skipped = 0;
      let total = 0;
      const breakdown: Record<string, { matched: number; total: number }> = {};

      for (const field of fields) {
        const uiValue = values[field.semanticKey];
        if (uiValue === '' || uiValue == null) continue;

        // Skip radio fields (PyMuPDF extraction limitation)
        if (field.uiFieldType === 'radio') {
          skipped++;
          continue;
        }

        total++;
        const ft = field.uiFieldType ?? 'text';
        if (!breakdown[ft]) breakdown[ft] = { matched: 0, total: 0 };
        breakdown[ft].total++;

        const expectedPdf = computeExpectedPdfValue(field, uiValue);
        const actualPdf = extracted[field.pdfFieldName] ?? '';

        if (actualPdf === expectedPdf) {
          matched++;
          breakdown[ft].matched++;
        }
      }

      console.log(`${section} PDF roundtrip: ${matched}/${total} matched, ${skipped} radio skipped`);
      console.log(`  Breakdown:`, breakdown);

      // Assert high match rate (allow for edge cases)
      if (total > 0) {
        expect(matched / total).toBeGreaterThanOrEqual(0.95);
      }
    });
  });
}
