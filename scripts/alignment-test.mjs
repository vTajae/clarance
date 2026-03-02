#!/usr/bin/env node
/**
 * Alignment diagnosis: measures radio circle and SSN field positions
 * against registry coordinates to detect misalignment in PDF Layout mode.
 *
 * Compares:
 *  1. CSS left/top (from style attr) vs registry x/y (what we expect)
 *  2. Screen bounding box vs page frame (absolute position check)
 *  3. SSN fields at y=739 near page bottom
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const APP = 'http://localhost:3000';
const OUT = '/tmp/alignment-diag';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const registry = JSON.parse(readFileSync(join(appDir, 'src/lib/field-registry/field-registry.json'), 'utf8'));
const PDF_WIDTH = 612;
const PDF_HEIGHT = 792;

// Build lookup maps
const regByKey = new Map();
for (const f of registry) regByKey.set(f.semanticKey, f);

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
const page = await ctx.newPage();

// 1. Register via API + Login via browser (exact match to proven working scripts)
const email = `align-${Date.now()}@test.dev`;
const pw = 'alignTest123';
await fetch(`${APP}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: pw }),
});
console.log(`Registered: ${email}`);

await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2000);
await page.fill('input#email', email);
await page.fill('input#password', pw);
await page.click('button[type="submit"]');
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(500);
  if (!page.url().includes('/login')) break;
}
console.log(`After login: ${page.url()}`);

// 2. Create form
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
await page.click('button:has-text("Create Form")');
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(500);
  if (page.url().includes('/identification/section1')) break;
}
console.log(`Form created: ${page.url()}`);
const subId = page.url().split('/')[3];
if (!subId || subId.length < 30) {
  console.error('No submission ID');
  await page.screenshot({ path: `${OUT}/ERROR.png` });
  await browser.close();
  process.exit(1);
}

// Helper: setup PDF Layout mode
async function setupPdfLayout() {
  const pdfBtn = page.locator('button:has-text("PDF Layout")');
  if (await pdfBtn.count() > 0) {
    await pdfBtn.click();
    await page.waitForTimeout(2000);
  }
  // Set opacity to 100%
  await page.evaluate(() => {
    const s = document.querySelector('input[type="range"]');
    if (s) {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, '100');
      s.dispatchEvent(new Event('input', { bubbles: true }));
      s.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  // Enable "Show All" to bypass conditional visibility
  const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
  if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
  // Enable "Show fields"
  const sf = page.locator('label:has-text("Show fields") input[type="checkbox"]');
  if (await sf.count() > 0 && !(await sf.isChecked())) await sf.check();
  await page.waitForTimeout(500);
}

// Helper: measure all field positions on current page
async function measureFields() {
  return await page.evaluate(() => {
    const results = [];
    // Get all page frames
    const frames = document.querySelectorAll('.relative.shadow-md');
    const frameRects = Array.from(frames).map(f => {
      const box = f.getBoundingClientRect();
      return { x: box.x, y: box.y, w: box.width, h: box.height };
    });

    // Get all fields
    const els = document.querySelectorAll('[data-field-key]');
    for (const el of els) {
      const box = el.getBoundingClientRect();
      const style = el.getAttribute('style') || '';
      const key = el.getAttribute('data-field-key');

      // Parse CSS values from style
      const leftM = style.match(/left:\s*([\d.]+)px/);
      const topM = style.match(/top:\s*([\d.]+)px/);
      const widthM = style.match(/width:\s*([\d.]+)px/);
      const heightM = style.match(/height:\s*([\d.]+)px/);

      // Find which frame this field belongs to (by Y position overlap)
      let frameIdx = -1;
      for (let i = 0; i < frameRects.length; i++) {
        const f = frameRects[i];
        if (box.y >= f.y - 5 && box.y <= f.y + f.h + 5) {
          frameIdx = i;
          break;
        }
      }

      results.push({
        key,
        cssLeft: leftM ? parseFloat(leftM[1]) : null,
        cssTop: topM ? parseFloat(topM[1]) : null,
        cssWidth: widthM ? parseFloat(widthM[1]) : null,
        cssHeight: heightM ? parseFloat(heightM[1]) : null,
        screenX: box.x, screenY: box.y,
        screenW: box.width, screenH: box.height,
        frameIdx,
        frame: frameIdx >= 0 ? frameRects[frameIdx] : null,
        // Position relative to parent frame
        relX: frameIdx >= 0 ? box.x - frameRects[frameIdx].x : null,
        relY: frameIdx >= 0 ? box.y - frameRects[frameIdx].y : null,
      });
    }
    return { fields: results, frames: frameRects };
  });
}

// ================================================================
// Sections with radios to test
// ================================================================
const radioSections = [
  { section: 'section8', group: 'citizenship' },
  { section: 'section9', group: 'citizenship' },
  { section: 'section10', group: 'citizenship' },
  { section: 'section15', group: 'relationships' },
  { section: 'section22', group: 'substance' },
];

const allResults = { radios: [], ssn: [], textFields: [] };

for (const { section, group } of radioSections) {
  console.log(`\n=== ${section} (${group}) — RADIO ALIGNMENT ===`);
  await page.goto(`${APP}/${subId}/${group}/${section}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  try {
    await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 });
  } catch { console.log('  (Jotai timeout, continuing)'); }
  await setupPdfLayout();

  const { fields, frames } = await measureFields();
  const scale = frames.length > 0 ? frames[0].w / PDF_WIDTH : 1.0;
  console.log(`  Scale: ${scale.toFixed(4)}, Frames: ${frames.length}, Fields: ${fields.length}`);

  // Analyze radio widgets
  const radioFields = fields.filter(f => f.key.includes('-radio-'));
  console.log(`  Radio widgets: ${radioFields.length}`);

  for (const r of radioFields) {
    const baseKey = r.key.replace(/-radio-\d+$/, '');
    const radioIdx = parseInt(r.key.match(/-radio-(\d+)$/)?.[1] || '0');
    const regField = regByKey.get(baseKey);
    const regWidget = regField?.radioWidgets?.[radioIdx];

    if (!regWidget || r.cssLeft === null) continue;

    // Expected CSS position = registry coord * scale
    const expectedLeft = regWidget.x * scale;
    const expectedTop = regWidget.y * scale;
    const expectedWidth = regWidget.width * scale;
    const expectedHeight = regWidget.height * scale;

    const dxPx = r.cssLeft - expectedLeft;
    const dyPx = r.cssTop - expectedTop;
    const dwPx = r.cssWidth - expectedWidth;
    const dhPx = r.cssHeight - expectedHeight;

    // Convert pixel offset to PDF points (unscale)
    const dxPt = dxPx / scale;
    const dyPt = dyPx / scale;

    const result = {
      section,
      key: r.key,
      cssLeft: r.cssLeft,
      cssTop: r.cssTop,
      expectedLeft,
      expectedTop,
      dxPx: Math.round(dxPx * 100) / 100,
      dyPx: Math.round(dyPx * 100) / 100,
      dxPt: Math.round(dxPt * 100) / 100,
      dyPt: Math.round(dyPt * 100) / 100,
      registryX: regWidget.x,
      registryY: regWidget.y,
      registryW: regWidget.width,
      registryH: regWidget.height,
    };
    allResults.radios.push(result);

    if (Math.abs(dxPx) > 0.5 || Math.abs(dyPx) > 0.5) {
      console.log(`  MISALIGNED ${r.key}: dx=${dxPx.toFixed(2)}px dy=${dyPx.toFixed(2)}px (${dxPt.toFixed(2)}pt, ${dyPt.toFixed(2)}pt)`);
    }
  }

  // Also measure non-radio fields for comparison
  const nonRadio = fields.filter(f => !f.key.includes('-radio-'));
  for (const f of nonRadio.slice(0, 5)) {
    const regField = regByKey.get(f.key);
    if (!regField?.pdfRect || f.cssLeft === null) continue;

    const expectedLeft = regField.pdfRect.x * scale;
    const expectedTop = regField.pdfRect.y * scale;
    const dxPx = f.cssLeft - expectedLeft;
    const dyPx = f.cssTop - expectedTop;

    allResults.textFields.push({
      section,
      key: f.key,
      dxPx: Math.round(dxPx * 100) / 100,
      dyPx: Math.round(dyPx * 100) / 100,
    });
  }

  // Screenshot
  await page.screenshot({ path: `${OUT}/${section}-radios.png`, fullPage: true });
}

// ================================================================
// SSN HEADER ALIGNMENT — section1 (pages 5)
// ================================================================
console.log('\n\n=== SSN HEADER ALIGNMENT (section1) ===');
await page.goto(`${APP}/${subId}/identification/section1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
try {
  await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 });
} catch { console.log('  (Jotai timeout, continuing)'); }
await setupPdfLayout();

const { fields: s1Fields, frames: s1Frames } = await measureFields();
const s1Scale = s1Frames.length > 0 ? s1Frames[0].w / PDF_WIDTH : 1.0;
console.log(`Scale: ${s1Scale.toFixed(4)}, Frames: ${s1Frames.length}`);

// SSN fields are at y≈739 in PDF coordinates
const ssnFieldKeys = s1Fields.filter(f => {
  const k = f.key;
  return k.includes('yourSocialSecurity') || k.includes('autofill') || k.includes('Autofill') || k.includes('ssnPageHeader');
});

console.log(`SSN-related fields found: ${ssnFieldKeys.length}`);
for (const f of ssnFieldKeys) {
  const regField = regByKey.get(f.key);
  if (!regField?.pdfRect) continue;

  const expectedTop = regField.pdfRect.y * s1Scale;
  const dxPx = f.cssLeft !== null ? f.cssLeft - regField.pdfRect.x * s1Scale : null;
  const dyPx = f.cssTop !== null ? f.cssTop - expectedTop : null;

  // Check if near page bottom (y > 700 in PDF coords)
  const pdfY = regField.pdfRect.y;
  const nearBottom = pdfY > 700;

  const result = {
    key: f.key,
    pdfY,
    cssTop: f.cssTop,
    expectedTop,
    dxPx: dxPx !== null ? Math.round(dxPx * 100) / 100 : null,
    dyPx: dyPx !== null ? Math.round(dyPx * 100) / 100 : null,
    nearPageBottom: nearBottom,
    frameHeight: f.frame?.h,
    expectedFrameHeight: PDF_HEIGHT * s1Scale,
    overflow: f.cssTop > PDF_HEIGHT * s1Scale ? 'YES' : 'no',
  };
  allResults.ssn.push(result);

  console.log(`  ${f.key}: pdfY=${pdfY.toFixed(1)} cssTop=${f.cssTop?.toFixed(1)} expected=${expectedTop.toFixed(1)} dy=${dyPx?.toFixed(2)}px overflow=${result.overflow}`);
}

// Check ALL fields near page bottom across sections
console.log('\n=== BOTTOM-OF-PAGE FIELD CHECK ===');
const bottomFields = registry.filter(f => f.pdfRect && f.pdfRect.y > 720);
console.log(`Fields with pdfY > 720: ${bottomFields.length}`);
for (const f of bottomFields.slice(0, 10)) {
  const yPct = ((f.pdfRect.y + f.pdfRect.height) / PDF_HEIGHT * 100).toFixed(1);
  console.log(`  ${f.semanticKey}: y=${f.pdfRect.y.toFixed(1)} h=${f.pdfRect.height.toFixed(1)} bottom=${(f.pdfRect.y + f.pdfRect.height).toFixed(1)} (${yPct}% of page)`);
}

// Screenshot bottom of page
for (let i = 0; i < Math.min(s1Frames.length, 3); i++) {
  await page.evaluate((idx) => {
    const frames = document.querySelectorAll('.relative.shadow-md');
    if (frames[idx]) {
      const box = frames[idx].getBoundingClientRect();
      window.scrollTo(0, window.scrollY + box.bottom - 200);
    }
  }, i);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/ssn-page${i}-bottom.png` });
}

// Full page screenshot
await page.screenshot({ path: `${OUT}/section1-full.png`, fullPage: true });

// ================================================================
// SUMMARY
// ================================================================
console.log('\n\n========================================');
console.log('ALIGNMENT DIAGNOSIS SUMMARY');
console.log('========================================');

// Radio analysis
if (allResults.radios.length > 0) {
  const avgDx = allResults.radios.reduce((s, r) => s + Math.abs(r.dxPx), 0) / allResults.radios.length;
  const avgDy = allResults.radios.reduce((s, r) => s + Math.abs(r.dyPx), 0) / allResults.radios.length;
  const maxDx = Math.max(...allResults.radios.map(r => Math.abs(r.dxPx)));
  const maxDy = Math.max(...allResults.radios.map(r => Math.abs(r.dyPx)));
  const misaligned = allResults.radios.filter(r => Math.abs(r.dxPx) > 0.5 || Math.abs(r.dyPx) > 0.5);

  console.log(`\nRADIO WIDGETS: ${allResults.radios.length} measured`);
  console.log(`  Average offset: |dx|=${avgDx.toFixed(2)}px |dy|=${avgDy.toFixed(2)}px`);
  console.log(`  Max offset:     |dx|=${maxDx.toFixed(2)}px |dy|=${maxDy.toFixed(2)}px`);
  console.log(`  Misaligned (>0.5px): ${misaligned.length}`);

  // Check for systematic offset
  const meanDx = allResults.radios.reduce((s, r) => s + r.dxPx, 0) / allResults.radios.length;
  const meanDy = allResults.radios.reduce((s, r) => s + r.dyPx, 0) / allResults.radios.length;
  console.log(`  Mean offset (systematic): dx=${meanDx.toFixed(3)}px dy=${meanDy.toFixed(3)}px`);
  if (Math.abs(meanDx) > 0.1 || Math.abs(meanDy) > 0.1) {
    console.log(`  ** SYSTEMATIC OFFSET DETECTED — radios are shifted by ~${meanDx.toFixed(1)}px, ~${meanDy.toFixed(1)}px **`);
  }
}

// Text field comparison
if (allResults.textFields.length > 0) {
  const avgTDx = allResults.textFields.reduce((s, r) => s + Math.abs(r.dxPx), 0) / allResults.textFields.length;
  const avgTDy = allResults.textFields.reduce((s, r) => s + Math.abs(r.dyPx), 0) / allResults.textFields.length;
  console.log(`\nTEXT FIELDS: ${allResults.textFields.length} measured`);
  console.log(`  Average offset: |dx|=${avgTDx.toFixed(2)}px |dy|=${avgTDy.toFixed(2)}px`);
}

// SSN analysis
if (allResults.ssn.length > 0) {
  const overflows = allResults.ssn.filter(s => s.overflow === 'YES');
  const avgDy = allResults.ssn.reduce((s, r) => s + Math.abs(r.dyPx || 0), 0) / allResults.ssn.length;
  console.log(`\nSSN FIELDS: ${allResults.ssn.length} measured`);
  console.log(`  Average |dy|: ${avgDy.toFixed(2)}px`);
  console.log(`  Overflowing page: ${overflows.length}`);
}

// Save detailed report
writeFileSync(`${OUT}/alignment-report.json`, JSON.stringify(allResults, null, 2));
console.log(`\nDetailed report: ${OUT}/alignment-report.json`);
console.log(`Screenshots: ${OUT}/`);

await browser.close();
