/**
 * Full PDF Export + Extract + Compare — Per Section.
 *
 * For each section:
 * 1. Inject values (gates=YES, all fields)
 * 2. POST /api/pdf/export → get PDF buffer
 * 3. POST /extract-fields → get extracted fields
 * 4. Compare extracted vs expected (skip radio fields)
 * 5. test.skip() if PDF service is down
 */

import { test, expect } from '@playwright/test';
import {
  createSubmission,
  navigateToSection,
  waitForJotaiStore,
  injectValues,
  getFieldsBySection,
  makeAllGatesYes,
  buildPdfNameMap,
  ALL_SECTIONS,
  SECTION_META,
} from './helpers/test-fixtures';
import {
  makeSectionValues,
  resetFieldIndex,
  computeExpectedPdfValue,
} from './helpers/field-value-generators';
import { checkPdfServiceHealth, exportPdf, extractFields } from './helpers/pdf-helpers';
import type { SF86Section } from '../src/lib/field-registry/types';

// Large sections need more time
const LARGE_SECTION_TIMEOUT = 180_000;
const NORMAL_TIMEOUT = 90_000;
const LARGE_SECTIONS = new Set<SF86Section>([
  'section13A',
  'section18',
  'section20A',
  'section17',
  'section20B',
]);

let submissionId: string;
let pdfServiceAvailable = false;

test.beforeAll(async ({ browser, request }) => {
  const page = await browser.newPage();
  submissionId = await createSubmission(page);
  await page.close();
  pdfServiceAvailable = await checkPdfServiceHealth(request);
});

test.describe('PDF roundtrip per section', () => {
  for (const section of ALL_SECTIONS) {
    const meta = SECTION_META[section];
    if (!meta) continue;

    test(`${section}: export + extract matches injected values`, async ({
      page,
      request,
    }) => {
      test.skip(!pdfServiceAvailable, 'PDF service at localhost:8001 is not running');

      const isLarge = LARGE_SECTIONS.has(section);
      test.setTimeout(isLarge ? LARGE_SECTION_TIMEOUT : NORMAL_TIMEOUT);

      const fields = getFieldsBySection(section);
      if (fields.length === 0) {
        test.skip();
        return;
      }

      await navigateToSection(page, submissionId, section);
      await waitForJotaiStore(page);

      // Set all gates to YES
      const gateValues = makeAllGatesYes();
      await injectValues(page, gateValues);
      await page.waitForTimeout(500);

      // Inject section values
      resetFieldIndex();
      const values = makeSectionValues(fields);
      await injectValues(page, values);

      // Merge all values for export
      const allValues: Record<string, unknown> = { ...gateValues, ...values };

      // Export PDF via Next.js API
      const pdfBuffer = await exportPdf(request, allValues);
      expect(pdfBuffer.length).toBeGreaterThan(0);

      // Extract fields from the PDF
      const extracted = await extractFields(request, pdfBuffer);

      // Compare per field
      let matched = 0;
      let mismatched = 0;
      let skippedRadio = 0;
      let skippedEmpty = 0;
      let total = 0;

      for (const field of fields) {
        const uiValue = values[field.semanticKey];

        // Skip empty values
        if (uiValue === '' || uiValue == null) {
          skippedEmpty++;
          continue;
        }

        // Skip radio fields — PyMuPDF extraction limitation
        if (field.uiFieldType === 'radio') {
          skippedRadio++;
          continue;
        }

        total++;
        const expectedPdf = computeExpectedPdfValue(field, uiValue);
        const actualPdf = extracted[field.pdfFieldName] ?? '';

        if (actualPdf === expectedPdf) {
          matched++;
        } else {
          mismatched++;
        }
      }

      console.log(
        `${section}: ${matched}/${total} matched, ${mismatched} mismatched, ` +
        `${skippedRadio} radio skipped, ${skippedEmpty} empty skipped`,
      );

      // Assert high match rate
      if (total > 0) {
        expect(matched / total).toBeGreaterThanOrEqual(0.95);
      }
    });
  }
});
