/**
 * Per-Section Jotai Injection + Readback — All 6,060 non-SSN-header fields.
 *
 * For each of the 39 sections:
 * 1. Navigate to the section
 * 2. Set all gates to YES (reveal conditional fields)
 * 3. Inject identity-encoded values for every field
 * 4. Readback all values and assert 100% match
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
  ALL_SECTIONS,
  SECTION_META,
} from './helpers/test-fixtures';
import { makeSectionValues, resetFieldIndex } from './helpers/field-value-generators';

let submissionId: string;

test.beforeAll(async ({ request }) => {
  submissionId = await createSubmission(request);
});

test.describe('Per-section Jotai inject + readback', () => {
  for (const section of ALL_SECTIONS) {
    const meta = SECTION_META[section];
    if (!meta) continue;

    test(`${section}: inject + readback all fields`, async ({ page }) => {
      const fields = getFieldsBySection(section);
      if (fields.length === 0) {
        test.skip();
        return;
      }

      // Scale timeout based on field count
      const timeout = Math.max(60_000, fields.length * 50);
      test.setTimeout(timeout);

      await navigateToSection(page, submissionId, section);
      await waitForJotaiStore(page);

      // Set all gates to YES first to reveal conditional fields
      const gateValues = makeAllGatesYes();
      await injectValues(page, gateValues);

      // Small delay for conditional rendering to settle
      await page.waitForTimeout(500);

      // Generate and inject test values for this section
      resetFieldIndex();
      const values = makeSectionValues(fields);
      await injectValues(page, values);

      // Readback and verify
      const keys = Object.keys(values);
      const actual = await readbackValues(page, keys);

      let matches = 0;
      const mismatches: Array<{ key: string; expected: unknown; got: unknown }> = [];

      for (const key of keys) {
        const expected = values[key];
        const got = actual[key];

        // Compare as strings to handle type coercion (boolean "true" vs true)
        if (String(got) === String(expected)) {
          matches++;
        } else {
          mismatches.push({ key, expected, got });
        }
      }

      // Log mismatches for debugging
      if (mismatches.length > 0 && mismatches.length <= 10) {
        console.log(`${section} mismatches:`, mismatches);
      } else if (mismatches.length > 10) {
        console.log(`${section}: ${mismatches.length} mismatches (showing first 5):`, mismatches.slice(0, 5));
      }

      // Assert 100% match
      expect(matches).toBe(keys.length);
    });
  }
});
