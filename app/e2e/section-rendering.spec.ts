/**
 * Section Rendering — All 39 sections navigate and render correctly.
 *
 * For each section: navigate to its URL, verify the heading matches
 * SECTION_META, and verify at least one form input or Jotai store exists.
 */

import { test, expect } from '@playwright/test';
import {
  createSubmission,
  ALL_SECTIONS,
  SECTION_META,
  sectionToGroup,
  waitForJotaiStore,
} from './helpers/test-fixtures';
import type { SF86Section } from '../src/lib/field-registry/types';

let submissionId: string;

test.beforeAll(async ({ request }) => {
  submissionId = await createSubmission(request);
});

test.describe('All 39 sections render', () => {
  for (const section of ALL_SECTIONS) {
    const meta = SECTION_META[section];
    if (!meta) continue;

    test(`${section} renders with heading "${meta.title}"`, async ({ page }) => {
      const group = sectionToGroup(section);
      await page.goto(`/${submissionId}/${group}/${section}`);

      // Wait for the page to be interactive
      await waitForJotaiStore(page);

      // Verify heading
      const heading = page.getByRole('heading', { name: meta.title });
      await expect(heading).toBeVisible({ timeout: 15_000 });

      // Verify at least one form element exists
      const hasInput = await page.locator('input, select, textarea, [role="radio"], [role="checkbox"]').count();
      expect(hasInput).toBeGreaterThan(0);
    });
  }
});
