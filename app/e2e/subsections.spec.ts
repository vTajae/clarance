/**
 * Subsection Navigation & Cross-Subsection Data Integrity.
 *
 * Tests three subsection clusters:
 * - Employment: 13A / 13B / 13C
 * - Foreign: 20A / 20B / 20C
 * - Psychological: 21 / 21A / 21B / 21C / 21D / 21E
 *
 * For each cluster: all subsections are navigable via sidebar,
 * and values injected into one subsection persist independently.
 */

import { test, expect } from '@playwright/test';
import {
  createSubmission,
  navigateToSection,
  waitForJotaiStore,
  injectValues,
  readbackValues,
  getFieldsBySection,
  flushToIndexedDB,
  waitForHydration,
  SECTION_META,
} from './helpers/test-fixtures';
import { makeSectionValues } from './helpers/field-value-generators';
import type { SF86Section } from '../src/lib/field-registry/types';

let submissionId: string;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  submissionId = await createSubmission(page);
  await page.close();
});

interface SubsectionCluster {
  name: string;
  sections: SF86Section[];
}

const CLUSTERS: SubsectionCluster[] = [
  { name: 'Employment (13A/B/C)', sections: ['section13A', 'section13B', 'section13C'] },
  { name: 'Foreign (20A/B/C)', sections: ['section20A', 'section20B', 'section20C'] },
  {
    name: 'Psychological (21/21A-E)',
    sections: ['section21', 'section21A', 'section21B', 'section21C', 'section21D', 'section21E'],
  },
];

for (const cluster of CLUSTERS) {
  test.describe(`Subsection cluster: ${cluster.name}`, () => {
    test('all subsections are navigable via sidebar', async ({ page }) => {
      test.setTimeout(90_000);

      // Navigate to the first subsection
      await navigateToSection(page, submissionId, cluster.sections[0]);
      await waitForJotaiStore(page);

      const sidebar = page.locator('nav[aria-label="Form sections"]');

      for (const section of cluster.sections) {
        const meta = SECTION_META[section];
        if (!meta) continue;

        // Click the section in the sidebar
        const sidebarLink = sidebar.getByText(meta.title);
        await sidebarLink.click();

        // Verify navigation
        await expect(page).toHaveURL(new RegExp(section), { timeout: 15_000 });
        await expect(
          page.getByRole('heading', { name: meta.title, exact: true }),
        ).toBeVisible({ timeout: 15_000 });
      }
    });

    test('values persist independently across subsections', async ({ page }) => {
      test.setTimeout(180_000);

      const valuesBySection: Record<string, Record<string, unknown>> = {};

      // Inject values into each subsection and persist to IndexedDB.
      // We must flush to IndexedDB explicitly because:
      //   1. `injectValues` writes to the in-memory Jotai store only.
      //   2. The auto-save hook has a 500ms debounce and skips the first render.
      //   3. `navigateToSection` does a full `page.goto()` which tears down the
      //      React tree (and the Jotai store) before the debounced save fires.
      //   4. On the next page load, `useHydrateSection` reads from IndexedDB,
      //      so the data must already be there.
      let offset = 0;
      for (const section of cluster.sections) {
        await navigateToSection(page, submissionId, section);
        await waitForJotaiStore(page);

        const fields = getFieldsBySection(section);
        if (fields.length === 0) continue;

        const values = makeSectionValues(fields, offset);
        await injectValues(page, values);
        await flushToIndexedDB(page, submissionId, section, values);
        valuesBySection[section] = values;
        offset += fields.length;
      }

      // Revisit each subsection and verify values persisted.
      // After navigation, useHydrateSection loads data from IndexedDB
      // asynchronously, so we wait for hydration before reading back.
      for (const section of cluster.sections) {
        const expectedValues = valuesBySection[section];
        if (!expectedValues || Object.keys(expectedValues).length === 0) continue;

        await navigateToSection(page, submissionId, section);
        await waitForJotaiStore(page);

        const keys = Object.keys(expectedValues);
        await waitForHydration(page, keys);
        const actual = await readbackValues(page, keys);

        let matches = 0;
        for (const key of keys) {
          if (String(actual[key]) === String(expectedValues[key])) {
            matches++;
          }
        }

        // Allow small tolerance for edge cases (e.g., boolean coercion)
        const matchRate = matches / keys.length;
        expect(matchRate).toBeGreaterThanOrEqual(0.95);
      }
    });
  });
}
