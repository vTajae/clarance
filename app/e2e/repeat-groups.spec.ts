/**
 * Repeat Group Structural Integrity + Value Isolation.
 *
 * - Registry repeat groups have contiguous indices
 * - Each instance has consistent field count
 * - Value isolation: different values per repeat instance, no cross-contamination
 */

import { test, expect } from '@playwright/test';
import {
  createSubmission,
  navigateToSection,
  waitForJotaiStore,
  injectValues,
  readbackValues,
  loadRegistry,
  makeAllGatesYes,
} from './helpers/test-fixtures';
import { makeSectionValues } from './helpers/field-value-generators';
import type { FieldDefinition, SF86Section } from '../src/lib/field-registry/types';

let submissionId: string;

test.beforeAll(async ({ request }) => {
  submissionId = await createSubmission(request);
});

// Build repeat group data from registry
function getRepeatGroups(): Map<string, FieldDefinition[]> {
  const registry = loadRegistry();
  const groups = new Map<string, FieldDefinition[]>();
  for (const f of registry) {
    if (f.repeatGroup && f.section !== 'ssnPageHeader') {
      const bucket = groups.get(f.repeatGroup) ?? [];
      bucket.push(f);
      groups.set(f.repeatGroup, bucket);
    }
  }
  return groups;
}

test.describe('Repeat group structural invariants', () => {
  test('all repeat groups have contiguous indices', () => {
    const groups = getRepeatGroups();
    expect(groups.size).toBeGreaterThan(0);

    for (const [groupName, fields] of groups) {
      // Get all unique repeat indices
      const indices = [...new Set(fields.map((f) => f.repeatIndex ?? 0))].sort(
        (a, b) => a - b,
      );

      // Indices should start at 0 and be contiguous
      for (let i = 0; i < indices.length; i++) {
        expect(indices[i]).toBe(i);
      }
    }
  });

  test('each repeat instance has consistent field count', () => {
    const groups = getRepeatGroups();

    for (const [groupName, fields] of groups) {
      // Group by repeat index
      const byIndex = new Map<number, FieldDefinition[]>();
      for (const f of fields) {
        const idx = f.repeatIndex ?? 0;
        const bucket = byIndex.get(idx) ?? [];
        bucket.push(f);
        byIndex.set(idx, bucket);
      }

      // All instances should have the same field count
      const counts = [...byIndex.values()].map((arr) => arr.length);
      const expectedCount = counts[0];
      for (let i = 1; i < counts.length; i++) {
        expect(counts[i]).toBe(expectedCount);
      }
    }
  });
});

// Sections with notable repeat groups for value isolation testing
const ISOLATION_SECTIONS: Array<{
  section: SF86Section;
  description: string;
}> = [
  { section: 'section11', description: 'Where You Have Lived (4 groups)' },
  { section: 'section13A', description: 'Employment Activities (7 groups)' },
  { section: 'section18', description: 'Relatives (4 groups)' },
];

test.describe('Repeat group value isolation', () => {
  for (const { section, description } of ISOLATION_SECTIONS) {
    test(`${section}: ${description} — values isolated per instance`, async ({
      page,
    }) => {
      test.setTimeout(120_000);

      await navigateToSection(page, submissionId, section);
      await waitForJotaiStore(page);

      // Set all gates to YES
      const gateValues = makeAllGatesYes();
      await injectValues(page, gateValues);
      await page.waitForTimeout(500);

      // Get repeat groups in this section
      const registry = loadRegistry();
      const sectionFields = registry.filter(
        (f) => f.section === section && f.section !== 'ssnPageHeader',
      );
      const repeatGroupNames = [
        ...new Set(sectionFields.filter((f) => f.repeatGroup).map((f) => f.repeatGroup!)),
      ];

      expect(repeatGroupNames.length).toBeGreaterThan(0);

      // For each repeat group, inject different values per instance
      const allValues: Record<string, unknown> = {};

      for (const groupName of repeatGroupNames) {
        const groupFields = sectionFields.filter((f) => f.repeatGroup === groupName);
        const byIndex = new Map<number, FieldDefinition[]>();
        for (const f of groupFields) {
          const idx = f.repeatIndex ?? 0;
          const bucket = byIndex.get(idx) ?? [];
          bucket.push(f);
          byIndex.set(idx, bucket);
        }

        // Inject values with different offsets per instance
        for (const [repeatIdx, fields] of byIndex) {
          const offset = repeatIdx * 10000 + repeatGroupNames.indexOf(groupName) * 1000;
          const values = makeSectionValues(fields, offset);
          Object.assign(allValues, values);
        }
      }

      await injectValues(page, allValues);

      // Readback all values
      const keys = Object.keys(allValues);
      const actual = await readbackValues(page, keys);

      // Verify no cross-contamination
      let matches = 0;
      for (const key of keys) {
        if (String(actual[key]) === String(allValues[key])) matches++;
      }

      expect(matches).toBe(keys.length);
    });
  }
});
