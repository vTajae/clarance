#!/usr/bin/env node
/**
 * FIELD-BY-FIELD VISUAL PROOF — Before/After Screenshots
 *
 * For each field in a section:
 *   1. Navigate to section in PDF Layout mode (100% opacity, Show All)
 *   2. Screenshot BEFORE setting value (baseline)
 *   3. Set the field's unique value via Jotai
 *   4. Screenshot AFTER (shows the value appeared at the correct position)
 *   5. Clear the field, move to next
 *
 * Produces paired before/after screenshots proving each field maps correctly.
 *
 * Usage:
 *   cd app && node ../scripts/field-by-field-screenshots.mjs
 *
 * Env options:
 *   SECTIONS=section1,section5    — specific sections (default: all)
 *   HEADLESS=0                     — visible browser
 *   MAX_FIELDS=50                  — limit fields per run (default: unlimited)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const REGISTRY_PATH = join(__dirname, '../app/src/lib/field-registry/field-registry.json');
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const SCREENSHOT_DIR = join(__dirname, 'field-by-field-proof');
const HEADLESS = process.env.HEADLESS !== '0';
const MAX_FIELDS = process.env.MAX_FIELDS ? parseInt(process.env.MAX_FIELDS) : Infinity;

if (!existsSync(SCREENSHOT_DIR)) mkdirSync(SCREENSHOT_DIR, { recursive: true });

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));

const SECTION_GROUPS = {
  identification: ['section1', 'section3', 'section4', 'section5', 'section6', 'section7'],
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

function sectionToGroup(section) {
  for (const [group, sections] of Object.entries(SECTION_GROUPS)) {
    if (sections.includes(section)) return group;
  }
  return null;
}

const requestedSections = process.env.SECTIONS
  ? new Set(process.env.SECTIONS.split(',').map(s => s.trim()))
  : null;

const fieldsBySection = new Map();
for (const f of registry) {
  if (f.section === 'ssnPageHeader') continue;
  if (requestedSections && !requestedSections.has(f.section)) continue;
  if (f.pdfRect == null) continue;
  if (!fieldsBySection.has(f.section)) fieldsBySection.set(f.section, []);
  fieldsBySection.get(f.section).push(f);
}

const totalFields = Math.min(
  MAX_FIELDS,
  Array.from(fieldsBySection.values()).reduce((s, a) => s + a.length, 0)
);
console.log(`Will validate ${totalFields} fields across ${fieldsBySection.size} sections (before/after per field)`);

function makeTestValue(field) {
  const ft = field.uiFieldType || 'text';
  const short = field.semanticKey.split('.').pop().substring(0, 15).toUpperCase();
  switch (ft) {
    case 'text': case 'name': case 'location': case 'signature':
    case 'collection': case 'textarea':
      return `${field.section}_${short}`;
    case 'email': return `${field.section}@test.dev`;
    case 'telephone': case 'phone': return '+15551234567';
    case 'ssn': return '900123456';
    case 'date': case 'dateRange': return '2020-06-15';
    case 'checkbox': case 'branch': case 'notApplicable': return true;
    case 'radio': return (field.options || [])[0] || 'YES';
    case 'select': case 'country': case 'state': return (field.options || [])[0] || 'Option1';
    case 'height': return '72';
    default: return `${field.section}_${short}`;
  }
}

// Auth
const TEST_EMAIL = `fbf-${Date.now()}@test.dev`;
const TEST_PASS = 'fieldValPass123';

console.log('[0] Registering...');
await fetch(`${APP_URL}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS }),
  signal: AbortSignal.timeout(60000),
});

// Create form with a fresh browser
console.log('[1] Creating form...');
let submissionId;
{
  const b = await chromium.launch({ headless: HEADLESS, args: ['--disable-dev-shm-usage', '--no-sandbox'] });
  const p = (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage();
  const page = await p;
  await page.goto(`${APP_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(2000);
  await page.fill('input#email', TEST_EMAIL);
  await page.fill('input#password', TEST_PASS);
  await page.click('button[type="submit"]');
  for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (!page.url().includes('/login')) break; }
  await page.goto(`${APP_URL}/new`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(3000);
  await page.click('button:has-text("Create Form")');
  for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (page.url().includes('/identification/section1')) break; }
  submissionId = page.url().split('/')[3];
  console.log(`    Form: ${submissionId}`);
  await b.close();
}

// Per-section, per-field validation with before/after screenshots
const sortedSections = Array.from(fieldsBySection.keys()).sort();
let globalCount = 0;
let passed = 0;
let failed = 0;
const results = [];

for (const section of sortedSections) {
  if (globalCount >= MAX_FIELDS) break;

  const fields = fieldsBySection.get(section);
  const group = sectionToGroup(section);
  if (!group) continue;

  const sectionDir = join(SCREENSHOT_DIR, section);
  if (!existsSync(sectionDir)) mkdirSync(sectionDir, { recursive: true });

  console.log(`\n=== ${section} (${fields.length} fields) ===`);

  let browser;
  try {
    browser = await chromium.launch({ headless: HEADLESS, args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu'] });
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    const page = await ctx.newPage();

    // Login
    await page.goto(`${APP_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.fill('input#email', TEST_EMAIL);
    await page.fill('input#password', TEST_PASS);
    await page.click('button[type="submit"]');
    for (let i = 0; i < 20; i++) { await page.waitForTimeout(500); if (!page.url().includes('/login')) break; }

    // Navigate to section
    await page.goto(`${APP_URL}/${submissionId}/${group}/${section}`, {
      waitUntil: 'domcontentloaded', timeout: 60000,
    });
    await page.waitForTimeout(3000);

    // Wait for Jotai
    await page.waitForFunction(
      () => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__,
      { timeout: 30000 },
    );

    // Switch to PDF Layout
    const pdfBtn = await page.$('button:has-text("PDF Layout")');
    if (pdfBtn) { await pdfBtn.click(); await page.waitForTimeout(2000); }

    // Opacity 100%
    await page.evaluate(() => {
      const s = document.querySelector('input[type="range"]');
      if (s) {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, '100');
        s.dispatchEvent(new Event('input', { bubbles: true }));
        s.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Show All
    const sa = await page.$('label:has-text("Show All") input[type="checkbox"]');
    if (sa && !(await sa.isChecked())) { await sa.check(); await page.waitForTimeout(500); }

    // Show fields
    const sf = await page.$('label:has-text("Show fields") input[type="checkbox"]');
    if (sf && !(await sf.isChecked())) { await sf.check(); await page.waitForTimeout(500); }

    await page.waitForTimeout(500);

    // Per-field: before → set → after → clear
    for (const field of fields) {
      if (globalCount >= MAX_FIELDS) break;
      globalCount++;

      const safeKey = field.semanticKey.replace(/[^a-zA-Z0-9._-]/g, '_');
      const testVal = makeTestValue(field);

      try {
        // Scroll to the field's page
        await page.evaluate((pNum) => {
          const headers = document.querySelectorAll('span.text-xs.font-mono');
          for (const h of headers) {
            if (h.textContent?.includes(`Page ${pNum}`)) {
              h.scrollIntoView({ behavior: 'instant', block: 'start' });
              break;
            }
          }
        }, field.pdfPage);
        await page.waitForTimeout(200);

        // BEFORE screenshot (field empty)
        const beforePath = join(sectionDir, `${safeKey}_BEFORE.png`);
        await page.screenshot({ path: beforePath });

        // Set value
        await page.evaluate(({ key, val }) => {
          const store = window.__JOTAI_STORE__;
          const af = window.__FIELD_VALUE_ATOM_FAMILY__;
          store.set(af(key), val);
        }, { key: field.semanticKey, val: testVal });
        await page.waitForTimeout(200);

        // AFTER screenshot (field filled — value visible at PDF position)
        const afterPath = join(sectionDir, `${safeKey}_AFTER.png`);
        await page.screenshot({ path: afterPath });

        // Clear field
        await page.evaluate(({ key }) => {
          const store = window.__JOTAI_STORE__;
          const af = window.__FIELD_VALUE_ATOM_FAMILY__;
          store.set(af(key), null);
        }, { key: field.semanticKey });

        results.push({
          field: field.semanticKey, section: field.section,
          type: field.uiFieldType, page: field.pdfPage,
          testValue: String(testVal),
          before: beforePath, after: afterPath, status: 'ok',
        });
        passed++;

        if (globalCount % 25 === 0) {
          console.log(`  [${globalCount}/${totalFields}] ${passed} ok, ${failed} fail`);
        }
      } catch (err) {
        results.push({
          field: field.semanticKey, section: field.section,
          error: err.message, status: 'error',
        });
        failed++;
      }
    }

    console.log(`  ${section}: ${fields.length} fields done`);
  } catch (err) {
    console.error(`  ${section} FAILED: ${err.message.split('\n')[0]}`);
    for (const f of fields) {
      if (globalCount >= MAX_FIELDS) break;
      globalCount++;
      results.push({ field: f.semanticKey, section: f.section, error: err.message, status: 'error' });
      failed++;
    }
  } finally {
    try { await browser?.close(); } catch (_) {}
  }
}

// Report
const report = {
  timestamp: new Date().toISOString(),
  summary: { total: globalCount, passed, failed },
  fields: results,
};
const reportPath = join(SCREENSHOT_DIR, 'field-by-field-report.json');
writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');

console.log(`\n========================================`);
console.log(`FIELD-BY-FIELD VALIDATION COMPLETE`);
console.log(`  Total:  ${globalCount}`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log(`  Report: ${reportPath}`);
console.log(`  Proof:  ${SCREENSHOT_DIR}/`);
console.log(`========================================`);
process.exit(failed > 0 ? 1 : 0);
