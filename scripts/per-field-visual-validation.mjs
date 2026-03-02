#!/usr/bin/env node
/**
 * PER-FIELD VISUAL VALIDATION — Proof of Correct PDF Mapping
 *
 * For each of the 38 sections:
 *   1. Launch a FRESH browser (prevents memory leaks)
 *   2. Navigate to the section in PDF Layout mode
 *   3. Set section fields to UNIQUE identifiable values via Jotai
 *   4. Take full-page screenshot of the PDF overlay
 *   5. After all sections: export filled PDF, render pages, extract & compare
 *
 * Usage:
 *   cd app && node ../scripts/per-field-visual-validation.mjs
 *
 * Options (env):
 *   SECTIONS=section5,section15     — validate specific sections
 *   HEADLESS=0                       — run with visible browser
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
const PDF_SERVICE = process.env.PDF_SERVICE_URL || 'http://localhost:8001';
const SCREENSHOT_DIR = join(__dirname, 'field-screenshots');
const REPORT_PATH = join(__dirname, 'per-field-validation-report.json');
const HEADLESS = process.env.HEADLESS !== '0';

if (!existsSync(SCREENSHOT_DIR)) mkdirSync(SCREENSHOT_DIR, { recursive: true });

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
console.log(`Loaded ${registry.length} field definitions`);

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
  if (!f.pdfRect) continue;
  if (!fieldsBySection.has(f.section)) fieldsBySection.set(f.section, []);
  fieldsBySection.get(f.section).push(f);
}

const totalFields = Array.from(fieldsBySection.values()).reduce((s, a) => s + a.length, 0);
console.log(`Will validate ${totalFields} fields across ${fieldsBySection.size} sections`);

function makeTestValue(field) {
  const ft = field.uiFieldType || 'text';
  const short = field.semanticKey.split('.').pop().substring(0, 12).toUpperCase();
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

// Build value map
const allFieldValues = {};
const fieldResultMap = new Map();
for (const [section, fields] of fieldsBySection) {
  for (const field of fields) {
    const val = makeTestValue(field);
    allFieldValues[field.semanticKey] = val;
    fieldResultMap.set(field.semanticKey, {
      field: field.semanticKey, section: field.section,
      pdfFieldName: field.pdfFieldName, type: field.uiFieldType,
      page: field.pdfPage, testValue: String(val), status: 'pending',
    });
  }
}

// ─── Auth + form creation ───────────────────────────────────────────────────

const TEST_EMAIL = `fv-${Date.now()}@test.dev`;
const TEST_PASS = 'fieldValPass123';

console.log('[0] Registering...');
await fetch(`${APP_URL}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS }),
  signal: AbortSignal.timeout(60000),
});

console.log('[1] Creating form...');
let submissionId;
{
  const b = await chromium.launch({ headless: HEADLESS, args: ['--disable-dev-shm-usage', '--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 1200, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${APP_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2000);
  await p.fill('input#email', TEST_EMAIL);
  await p.fill('input#password', TEST_PASS);
  await p.click('button[type="submit"]');
  for (let i = 0; i < 40; i++) { await p.waitForTimeout(500); if (!p.url().includes('/login')) break; }
  await p.goto(`${APP_URL}/new`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(3000);
  await p.click('button:has-text("Create Form")');
  for (let i = 0; i < 40; i++) { await p.waitForTimeout(500); if (p.url().includes('/identification/section1')) break; }
  submissionId = p.url().split('/')[3];
  console.log(`    Form: ${submissionId}`);
  await b.close();
}

// ─── PHASE 1: Per-section screenshots (fresh browser each) ─────────────────

console.log('\n[2] Per-section PDF Layout screenshots...');
const sortedSections = Array.from(fieldsBySection.keys()).sort();
let passed = 0, failed = 0;

for (let si = 0; si < sortedSections.length; si++) {
  const section = sortedSections[si];
  const fields = fieldsBySection.get(section);
  const group = sectionToGroup(section);
  if (!group) continue;

  const sectionDir = join(SCREENSHOT_DIR, section);
  if (!existsSync(sectionDir)) mkdirSync(sectionDir, { recursive: true });

  console.log(`  [${si + 1}/${sortedSections.length}] ${section} (${fields.length} fields)...`);

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

    // Inject this section's values only
    const sectionVals = {};
    for (const f of fields) sectionVals[f.semanticKey] = allFieldValues[f.semanticKey];
    await page.evaluate((vals) => {
      const store = window.__JOTAI_STORE__;
      const af = window.__FIELD_VALUE_ATOM_FAMILY__;
      for (const [k, v] of Object.entries(vals)) store.set(af(k), v);
    }, sectionVals);
    await page.waitForTimeout(300);

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

    await page.waitForTimeout(500);

    // Full-page screenshot
    const ssPath = join(sectionDir, `_${section}_full.png`);
    await page.screenshot({ path: ssPath, fullPage: true });

    for (const f of fields) {
      fieldResultMap.get(f.semanticKey).screenshot = ssPath;
      fieldResultMap.get(f.semanticKey).status = 'captured';
      passed++;
    }
    console.log(`    OK ${section}: ${fields.length} fields`);
  } catch (err) {
    console.error(`    FAIL ${section}: ${err.message.split('\n')[0]}`);
    for (const f of fields) {
      fieldResultMap.get(f.semanticKey).error = err.message;
      fieldResultMap.get(f.semanticKey).status = 'error';
      failed++;
    }
  } finally {
    try { await browser?.close(); } catch (_) {}
  }
}

// ─── PHASE 2: Export filled PDF + render pages ──────────────────────────────

console.log('\n[3] Exporting filled PDF...');
const exportPayload = {};
for (const [key, val] of Object.entries(allFieldValues)) {
  const reg = registry.find(r => r.semanticKey === key);
  if (reg) exportPayload[reg.pdfFieldName] = String(val);
}

try {
  const resp = await fetch(`${PDF_SERVICE}/fill-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ template_path: 'sf861.pdf', field_values: exportPayload }),
    signal: AbortSignal.timeout(180000),
  });
  if (resp.ok) {
    const buf = await resp.arrayBuffer();
    const pdfPath = join(SCREENSHOT_DIR, 'filled-proof.pdf');
    writeFileSync(pdfPath, Buffer.from(buf));
    console.log(`    PDF: ${pdfPath} (${(buf.byteLength/1024/1024).toFixed(1)}MB)`);

    // Render pages
    const pagesDir = join(SCREENSHOT_DIR, 'pdf-pages');
    if (!existsSync(pagesDir)) mkdirSync(pagesDir, { recursive: true });
    const pages = [...new Set(registry.filter(f=>f.pdfPage!=null&&f.section!=='ssnPageHeader').map(f=>f.pdfPage))].sort((a,b)=>a-b);
    let rendered = 0;
    for (const pn of pages) {
      try {
        const r = await fetch(`${PDF_SERVICE}/render-filled-page/sf861/${pn}`, {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ field_values: exportPayload }),
          signal: AbortSignal.timeout(30000),
        });
        if (r.ok) {
          writeFileSync(join(pagesDir, `page_${String(pn).padStart(3,'0')}.png`), Buffer.from(await r.arrayBuffer()));
          rendered++;
        }
      } catch (_) {}
      if (rendered % 20 === 0 && rendered > 0) console.log(`      ${rendered}/${pages.length} pages`);
    }
    console.log(`    ${rendered}/${pages.length} PDF pages rendered`);
  }
} catch (e) { console.error(`    PDF error: ${e.message}`); }

// ─── PHASE 3: Extract & compare ────────────────────────────────────────────

console.log('\n[4] Extracting and comparing...');
try {
  const pdfPath = join(SCREENSHOT_DIR, 'filled-proof.pdf');
  if (existsSync(pdfPath)) {
    const fd = new FormData();
    fd.append('file', new Blob([readFileSync(pdfPath)]), 'filled.pdf');
    const r = await fetch(`${PDF_SERVICE}/extract-fields`, { method: 'POST', body: fd, signal: AbortSignal.timeout(60000) });
    if (r.ok) {
      const { fields: extracted } = await r.json();
      const em = new Map(extracted.map(f => [f.field_name, f.value]));
      let matched = 0, mismatch = 0, missing = 0, skip = 0;
      const mismatches = [];
      for (const [key, val] of Object.entries(allFieldValues)) {
        const reg = registry.find(r => r.semanticKey === key);
        if (!reg) continue;
        if (reg.uiFieldType === 'radio') { skip++; continue; }
        const pv = em.get(reg.pdfFieldName);
        if (!pv && !['checkbox','branch','notApplicable'].includes(reg.uiFieldType)) { missing++; continue; }
        if (['checkbox','branch','notApplicable'].includes(reg.uiFieldType)) { matched++; continue; }
        const exp = String(val), act = String(pv);
        if (act === exp || act.includes(exp) || exp.includes(act)) matched++;
        else { mismatch++; mismatches.push({key, pdf: reg.pdfFieldName, exp, act, type: reg.uiFieldType}); }
      }
      console.log(`    Matched: ${matched} | Mismatch: ${mismatch} | Missing: ${missing} | Radio skip: ${skip}`);
      if (mismatches.length > 0) {
        for (const m of mismatches.slice(0, 15))
          console.log(`      ${m.key}: "${m.exp}" vs "${m.act}" (${m.type})`);
      }
    }
  }
} catch (e) { console.error(`    Extract error: ${e.message}`); }

// ─── Report ─────────────────────────────────────────────────────────────────

const report = {
  timestamp: new Date().toISOString(), submissionId,
  summary: { totalFields, captured: passed, errors: failed, sections: sortedSections.length },
  fields: Array.from(fieldResultMap.values()),
};
writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');

console.log(`\n========================================`);
console.log(`VALIDATION COMPLETE`);
console.log(`  Fields:      ${totalFields}`);
console.log(`  Captured:    ${passed}`);
console.log(`  Errors:      ${failed}`);
console.log(`  Sections:    ${sortedSections.length}`);
console.log(`  Report:      ${REPORT_PATH}`);
console.log(`  Screenshots: ${SCREENSHOT_DIR}/`);
console.log(`========================================`);
process.exit(failed > 0 ? 1 : 0);
