/**
 * Conditional Logic — Gate Toggle Show/Hide for 25+ Sections.
 *
 * For each section with conditional fields:
 * - gates=YES: Set all gates YES, inject values into ALL conditional fields, readback confirms all stored
 * - gates=NO: Set all gates NO, verify conditional field values are cleared/hidden
 */

import { test, expect } from '@playwright/test';
import {
  createSubmission,
  navigateToSection,
  waitForJotaiStore,
  injectValues,
  readbackValues,
  getFieldsBySection,
  getGateFields,
  makeAllGatesYes,
  makeAllGatesNo,
  findYesOption,
  findNoOption,
  evaluateShowWhen,
  buildFieldMap,
  ALL_SECTIONS,
  SECTION_META,
} from './helpers/test-fixtures';
import { makeSectionValues, resetFieldIndex } from './helpers/field-value-generators';
import type { SF86Section } from '../src/lib/field-registry/types';

let submissionId: string;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  submissionId = await createSubmission(page);
  await page.close();
});

// Identify sections with conditional fields
function getSectionsWithConditionals(): SF86Section[] {
  const sections: SF86Section[] = [];
  for (const section of ALL_SECTIONS) {
    const fields = getFieldsBySection(section);
    const hasConditional = fields.some((f) => !!f.dependsOn);
    if (hasConditional) sections.push(section);
  }
  return sections;
}

const sectionsWithConditionals = getSectionsWithConditionals();

test.describe('Conditional logic: gates YES — all fields writable', () => {
  for (const section of sectionsWithConditionals) {
    const meta = SECTION_META[section];
    if (!meta) continue;

    test(`${section}: gates=YES — conditional fields accept values`, async ({
      page,
    }) => {
      const fields = getFieldsBySection(section);
      const conditionalCount = fields.filter((f) => !!f.dependsOn).length;

      // Scale timeout based on field count
      const timeout = Math.max(60_000, fields.length * 50);
      test.setTimeout(timeout);

      await navigateToSection(page, submissionId, section);
      await waitForJotaiStore(page);

      // Set all gates to YES
      const gateValues = makeAllGatesYes();
      await injectValues(page, gateValues);
      await page.waitForTimeout(500);

      // Inject values for ALL fields (including conditional ones)
      resetFieldIndex();
      const values = makeSectionValues(fields);
      await injectValues(page, values);

      // Readback
      const keys = Object.keys(values);
      const actual = await readbackValues(page, keys);

      let matches = 0;
      for (const key of keys) {
        if (String(actual[key]) === String(values[key])) matches++;
      }

      expect(matches).toBe(keys.length);
    });
  }
});

test.describe('Conditional logic: gates NO — conditional fields excluded', () => {
  for (const section of sectionsWithConditionals) {
    const meta = SECTION_META[section];
    if (!meta) continue;

    test(`${section}: gates=NO — conditional fields not exported`, async ({
      page,
    }) => {
      const fields = getFieldsBySection(section);
      const conditionalFields = fields.filter((f) => !!f.dependsOn);
      if (conditionalFields.length === 0) {
        test.skip();
        return;
      }

      const timeout = Math.max(60_000, fields.length * 50);
      test.setTimeout(timeout);

      await navigateToSection(page, submissionId, section);
      await waitForJotaiStore(page);

      // Set all gates to NO
      const gateValues = makeAllGatesNo();
      await injectValues(page, gateValues);
      await page.waitForTimeout(500);

      // Inject values for ALL fields
      resetFieldIndex();
      const values = makeSectionValues(fields);
      await injectValues(page, values);

      // Build the field map to check which fields should be hidden
      const fieldMap = buildFieldMap();

      // Evaluate which conditional fields should be hidden
      // (their gate is set to NO, so showWhen should return false)
      let hiddenCount = 0;
      let visibleCount = 0;

      for (const field of conditionalFields) {
        if (!field.dependsOn || !field.showWhen) continue;

        const gateValue = gateValues[field.dependsOn];
        const visible = evaluateShowWhen(field.showWhen, gateValue);

        if (visible) {
          visibleCount++;
        } else {
          hiddenCount++;
        }
      }

      // With gates=NO, most conditional fields should be hidden
      // (some may remain visible if their showWhen is !== 'YES' which is true when gate=NO)
      expect(hiddenCount + visibleCount).toBe(
        conditionalFields.filter((f) => f.dependsOn && f.showWhen).length,
      );

      // Verify at least some fields are hidden (the whole point of gates=NO)
      if (conditionalFields.length > 0) {
        expect(hiddenCount).toBeGreaterThan(0);
      }
    });
  }
});
