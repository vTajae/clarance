/**
 * Shared test infrastructure for SF-86 E2E tests.
 *
 * Provides submission creation, Jotai store injection/readback,
 * section navigation, and registry loading.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import type { Page, APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';
import type { FieldDefinition, SF86Section, SF86SectionGroup } from '../../src/lib/field-registry/types';

// ---------------------------------------------------------------------------
// Registry loading (from disk, for test setup)
// ---------------------------------------------------------------------------

const REGISTRY_PATH = join(__dirname, '../../src/lib/field-registry/field-registry.json');

let _cachedRegistry: FieldDefinition[] | null = null;

/** Load the full field registry from disk. Cached after first call. */
export function loadRegistry(): FieldDefinition[] {
  if (!_cachedRegistry) {
    _cachedRegistry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
  }
  return _cachedRegistry!;
}

/** Get fields for a specific section (excludes ssnPageHeader). */
export function getFieldsBySection(section: SF86Section): FieldDefinition[] {
  return loadRegistry().filter(
    (f) => f.section === section && f.section !== 'ssnPageHeader',
  );
}

/** Get all gate fields (fields used as dependsOn targets). */
export function getGateFields(): Map<string, FieldDefinition> {
  const registry = loadRegistry();
  const bySemKey = new Map<string, FieldDefinition>();
  for (const f of registry) bySemKey.set(f.semanticKey, f);

  const gates = new Map<string, FieldDefinition>();
  for (const f of registry) {
    if (f.dependsOn && !gates.has(f.dependsOn)) {
      const gate = bySemKey.get(f.dependsOn);
      if (gate) gates.set(f.dependsOn, gate);
    }
  }
  return gates;
}

/** Get all conditional fields (fields with dependsOn). */
export function getConditionalFields(): FieldDefinition[] {
  return loadRegistry().filter((f) => !!f.dependsOn);
}

/** Build a semanticKey → FieldDefinition lookup map. */
export function buildFieldMap(): Map<string, FieldDefinition> {
  const map = new Map<string, FieldDefinition>();
  for (const f of loadRegistry()) map.set(f.semanticKey, f);
  return map;
}

/** Build a pdfFieldName → FieldDefinition lookup map. */
export function buildPdfNameMap(): Map<string, FieldDefinition> {
  const map = new Map<string, FieldDefinition>();
  for (const f of loadRegistry()) map.set(f.pdfFieldName, f);
  return map;
}

// ---------------------------------------------------------------------------
// Section routing (mirrors types.ts)
// ---------------------------------------------------------------------------

export const SECTION_GROUPS: Record<SF86SectionGroup, SF86Section[]> = {
  identification: ['section1', 'section2', 'section3', 'section4', 'section5', 'section6', 'section7'],
  citizenship: ['section8', 'section9', 'section10'],
  history: ['section11', 'section12', 'section13A', 'section13B', 'section13C'],
  military: ['section14', 'section15'],
  relationships: ['section16', 'section17', 'section18'],
  foreign: ['section19', 'section20A', 'section20B', 'section20C'],
  financial: ['section26'],
  substance: ['section23', 'section24'],
  legal: ['section22', 'section25', 'section28'],
  psychological: ['section21', 'section21A', 'section21B', 'section21C', 'section21D', 'section21E'],
  review: ['section27', 'section29', 'section30'],
};

export const SECTION_META: Record<string, { title: string; group: SF86SectionGroup }> = {
  section1:  { title: 'Section 1 - Full Name', group: 'identification' },
  section2:  { title: 'Section 2 - Date of Birth', group: 'identification' },
  section3:  { title: 'Section 3 - Place of Birth', group: 'identification' },
  section4:  { title: 'Section 4 - Social Security Number', group: 'identification' },
  section5:  { title: 'Section 5 - Other Names Used', group: 'identification' },
  section6:  { title: 'Section 6 - Identifying Information', group: 'identification' },
  section7:  { title: 'Section 7 - Contact Information', group: 'identification' },
  section8:  { title: 'Section 8 - U.S. Passport', group: 'citizenship' },
  section9:  { title: 'Section 9 - Citizenship', group: 'citizenship' },
  section10: { title: 'Section 10 - Dual/Multiple Citizenship', group: 'citizenship' },
  section11: { title: 'Section 11 - Where You Have Lived', group: 'history' },
  section12: { title: 'Section 12 - Where You Went to School', group: 'history' },
  section13A: { title: 'Section 13A - Employment Activities', group: 'history' },
  section13B: { title: 'Section 13B - Former Federal Service', group: 'history' },
  section13C: { title: 'Section 13C - Employment Record', group: 'history' },
  section14: { title: 'Section 14 - Selective Service Record', group: 'military' },
  section15: { title: 'Section 15 - Military History', group: 'military' },
  section16: { title: 'Section 16 - People Who Know You Well', group: 'relationships' },
  section17: { title: 'Section 17 - Marital/Relationship Status', group: 'relationships' },
  section18: { title: 'Section 18 - Relatives', group: 'relationships' },
  section19: { title: 'Section 19 - Foreign Contacts', group: 'foreign' },
  section20A: { title: 'Section 20A - Foreign Activities', group: 'foreign' },
  section20B: { title: 'Section 20B - Foreign Business & Government', group: 'foreign' },
  section20C: { title: 'Section 20C - Foreign Travel', group: 'foreign' },
  section21:  { title: 'Section 21 - Psychological & Emotional Health', group: 'psychological' },
  section21A: { title: 'Section 21A - Court-Ordered Counseling', group: 'psychological' },
  section21B: { title: 'Section 21B - Adjudicated Incompetent', group: 'psychological' },
  section21C: { title: 'Section 21C - Hospitalization', group: 'psychological' },
  section21D: { title: 'Section 21D - Health Care Professional', group: 'psychological' },
  section21E: { title: 'Section 21E - Other Counseling', group: 'psychological' },
  section22: { title: 'Section 22 - Police Record', group: 'legal' },
  section23: { title: 'Section 23 - Illegal Drug Use & Activity', group: 'substance' },
  section24: { title: 'Section 24 - Use of Alcohol', group: 'substance' },
  section25: { title: 'Section 25 - Investigations & Clearance Record', group: 'legal' },
  section26: { title: 'Section 26 - Financial Record', group: 'financial' },
  section27: { title: 'Section 27 - Information Technology', group: 'review' },
  section28: { title: 'Section 28 - Civil Court Actions', group: 'legal' },
  section29: { title: 'Section 29 - Association Record', group: 'review' },
  section30: { title: 'Section 30 - Signature & Certification', group: 'review' },
};

/** All 39 sections in display order. */
export const ALL_SECTIONS: SF86Section[] = Object.keys(SECTION_META) as SF86Section[];

/** Resolve which group a section belongs to. */
export function sectionToGroup(section: SF86Section): SF86SectionGroup {
  return SECTION_META[section]?.group ?? 'identification';
}

// ---------------------------------------------------------------------------
// Submission + navigation helpers
// ---------------------------------------------------------------------------

/** Create a new form submission via the API. */
export async function createSubmission(request: APIRequestContext): Promise<string> {
  const resp = await request.post('/api/form/new', {
    data: { pdfVersion: 'sf861' },
  });
  expect(resp.ok()).toBeTruthy();
  const body = await resp.json();
  return body.submissionId as string;
}

/** Wait for the Jotai store to be exposed on window. */
export async function waitForJotaiStore(page: Page, timeout = 30_000): Promise<void> {
  await page.waitForFunction(
    () =>
      !!(window as any).__JOTAI_STORE__ &&
      !!(window as any).__FIELD_VALUE_ATOM_FAMILY__,
    undefined,
    { timeout },
  );
}

/** Bulk-inject values into the Jotai store. */
export async function injectValues(
  page: Page,
  values: Record<string, unknown>,
): Promise<void> {
  await page.evaluate((vals) => {
    const store = (window as any).__JOTAI_STORE__;
    const atomFamily = (window as any).__FIELD_VALUE_ATOM_FAMILY__;
    for (const [key, value] of Object.entries(vals)) {
      store.set(atomFamily(key), value);
    }
  }, values);
}

/** Bulk-readback values from the Jotai store. */
export async function readbackValues(
  page: Page,
  keys: string[],
): Promise<Record<string, unknown>> {
  return page.evaluate((ks) => {
    const store = (window as any).__JOTAI_STORE__;
    const atomFamily = (window as any).__FIELD_VALUE_ATOM_FAMILY__;
    const result: Record<string, unknown> = {};
    for (const key of ks) {
      result[key] = store.get(atomFamily(key));
    }
    return result;
  }, keys);
}

/** Navigate to a specific section and wait for heading. */
export async function navigateToSection(
  page: Page,
  submissionId: string,
  section: SF86Section,
): Promise<void> {
  const group = sectionToGroup(section);
  await page.goto(`/${submissionId}/${group}/${section}`, {
    waitUntil: 'domcontentloaded',
  });
  // Wait for either the heading or Jotai store (whichever comes first means the page loaded)
  await page.waitForFunction(
    () =>
      !!(window as any).__JOTAI_STORE__ ||
      document.querySelector('h1, h2, [role="heading"]'),
    undefined,
    { timeout: 30_000 },
  );
}

// ---------------------------------------------------------------------------
// Conditional logic evaluator (mirrors expression-evaluator.ts)
// ---------------------------------------------------------------------------

function normalise(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim().toLowerCase();
}

/** Evaluate a showWhen expression (pure JS, no React imports). */
export function evaluateShowWhen(expression: string | undefined, value: unknown): boolean {
  if (!expression) return true;
  const trimmed = expression.trim();

  if (trimmed === '!== null' || trimmed === '!= null') {
    return value !== null && value !== undefined && value !== '';
  }
  if (trimmed === '=== null' || trimmed === '== null') {
    return value === null || value === undefined || value === '';
  }

  const eqMatch = trimmed.match(/^===\s*['"](.+?)['"]$/);
  if (eqMatch) return normalise(value) === normalise(eqMatch[1]);

  const neqMatch = trimmed.match(/^!==\s*['"](.+?)['"]$/);
  if (neqMatch) return normalise(value) !== normalise(neqMatch[1]);

  const inMatch = trimmed.match(/^in\s*\[(.+)\]$/);
  if (inMatch) {
    const items = inMatch[1].split(',').map((s) =>
      s.trim().replace(/^['"]|['"]$/g, '').trim().toLowerCase(),
    );
    return items.includes(normalise(value));
  }

  const notInMatch = trimmed.match(/^notIn\s*\[(.+)\]$/);
  if (notInMatch) {
    const items = notInMatch[1].split(',').map((s) =>
      s.trim().replace(/^['"]|['"]$/g, '').trim().toLowerCase(),
    );
    return !items.includes(normalise(value));
  }

  return false;
}

/** Find the YES option for a gate field. */
export function findYesOption(field: FieldDefinition): string {
  const opts = field.options ?? [];
  for (const opt of opts) {
    if (opt.trim().toUpperCase().startsWith('YES')) return opt;
  }
  return opts[0] ?? 'YES';
}

/** Find the NO option for a gate field. */
export function findNoOption(field: FieldDefinition): string {
  const opts = field.options ?? [];
  for (const opt of opts) {
    if (opt.trim().toUpperCase().startsWith('NO')) return opt;
  }
  return opts[1] ?? opts[0] ?? 'NO';
}

/** Build a values map that sets all gates to YES. */
export function makeAllGatesYes(): Record<string, string> {
  const gates = getGateFields();
  const values: Record<string, string> = {};
  for (const [key, field] of gates) {
    values[key] = findYesOption(field);
  }
  return values;
}

/** Build a values map that sets all gates to NO. */
export function makeAllGatesNo(): Record<string, string> {
  const gates = getGateFields();
  const values: Record<string, string> = {};
  for (const [key, field] of gates) {
    values[key] = findNoOption(field);
  }
  return values;
}
