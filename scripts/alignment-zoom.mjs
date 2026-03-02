#!/usr/bin/env node
/**
 * High-resolution alignment zoom: takes large crops of radio and SSN areas
 * with enough context to see the PDF background clearly.
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const APP = 'http://localhost:3000';
const OUT = '/tmp/align-zoom';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
// Use deviceScaleFactor=2 for higher resolution screenshots
const ctx = await browser.newContext({
  viewport: { width: 1800, height: 1200 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

// Auth
const email = `zoom-${Date.now()}@test.dev`;
const pw = 'zoomCheck1234';
await fetch(`${APP}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: pw }),
});
await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2000);
await page.fill('input#email', email);
await page.fill('input#password', pw);
await page.click('button[type="submit"]');
for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (!page.url().includes('/login')) break; }

await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
await page.click('button:has-text("Create Form")');
for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (page.url().includes('/identification/section1')) break; }
const subId = page.url().split('/')[3];
console.log(`Form: ${subId}`);

async function setupPdfLayout() {
  const pdfBtn = page.locator('button:has-text("PDF Layout")');
  if (await pdfBtn.count() > 0) { await pdfBtn.click(); await page.waitForTimeout(2000); }
  await page.evaluate(() => {
    const s = document.querySelector('input[type="range"]');
    if (s) {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, '100');
      s.dispatchEvent(new Event('input', { bubbles: true }));
      s.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
  if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
  const sf = page.locator('label:has-text("Show fields") input[type="checkbox"]');
  if (await sf.count() > 0 && !(await sf.isChecked())) await sf.check();
  await page.waitForTimeout(3000);
  // Wait for all images to load
  await page.evaluate(async () => {
    const imgs = document.querySelectorAll('.relative.shadow-md img');
    await Promise.all(Array.from(imgs).map(img =>
      img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
    ));
  });
  await page.waitForTimeout(1000);
}

// Helper: get the page frame bounding box by finding the nth .relative.shadow-md
async function getFrameBox(frameIdx) {
  return await page.evaluate((idx) => {
    const frames = document.querySelectorAll('.relative.shadow-md');
    if (idx >= frames.length) return null;
    const box = frames[idx].getBoundingClientRect();
    return { x: box.x, y: box.y, w: box.width, h: box.height };
  }, frameIdx);
}

// Helper: crop a region of a PDF page frame
async function cropFrameRegion(frameIdx, pdfX, pdfY, pdfW, pdfH, filename) {
  const frame = await getFrameBox(frameIdx);
  if (!frame) { console.log(`  Frame ${frameIdx} not found`); return; }
  const scale = frame.w / 612;

  // First scroll the frame into view
  await page.evaluate((idx) => {
    const frames = document.querySelectorAll('.relative.shadow-md');
    if (frames[idx]) frames[idx].scrollIntoView({ behavior: 'instant', block: 'start' });
  }, frameIdx);
  await page.waitForTimeout(500);

  // Re-measure after scroll
  const f2 = await getFrameBox(frameIdx);
  if (!f2) return;

  const clip = {
    x: Math.max(0, f2.x + pdfX * scale),
    y: Math.max(0, f2.y + pdfY * scale),
    width: Math.min(pdfW * scale, 1800),
    height: Math.min(pdfH * scale, 1200),
  };
  await page.screenshot({ path: `${OUT}/${filename}`, clip });
  console.log(`  ${filename}: frame ${frameIdx} region (${pdfX},${pdfY}) ${pdfW}x${pdfH}`);
}

// ================================================================
// SECTION 8 — U.S. Passport (radios on page 6)
// ================================================================
console.log('\n=== Section 8 — U.S. Passport ===');
await page.goto(`${APP}/${subId}/citizenship/section8`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(6000); // Extra for first section compile
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayout();

// Radios are around y=430-440 on section8's page
// Full top half of page (radio + text area)
await cropFrameRegion(0, 0, 300, 612, 400, 's8-radio-area.png');
// Just the radio row
await cropFrameRegion(0, 15, 420, 200, 40, 's8-radio-closeup.png');
// Text fields area (passport number, dates)
await cropFrameRegion(0, 0, 460, 612, 200, 's8-text-area.png');
// Bottom of page for SSN headers
await cropFrameRegion(0, 0, 700, 612, 92, 's8-page-bottom.png');

// ================================================================
// SECTION 9 — Citizenship Status (many radios)
// ================================================================
console.log('\n=== Section 9 — Citizenship ===');
await page.goto(`${APP}/${subId}/citizenship/section9`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayout();

// Section 9 has radios scattered across multiple pages
// Page 0: main radio group (citizenshipInfo.RadioButtonList_1) at y≈337
await cropFrameRegion(0, 0, 250, 612, 400, 's9-p0-radio-area.png');
await cropFrameRegion(0, 15, 325, 200, 120, 's9-p0-radio-closeup.png');
await cropFrameRegion(0, 0, 700, 612, 92, 's9-p0-bottom.png');

// Page 1: more radios
await cropFrameRegion(1, 0, 0, 612, 400, 's9-p1-top.png');
await cropFrameRegion(1, 0, 700, 612, 92, 's9-p1-bottom.png');

// ================================================================
// SECTION 1 — Full Name (SSN at bottom of page 5)
// ================================================================
console.log('\n=== Section 1 — Full Name ===');
await page.goto(`${APP}/${subId}/identification/section1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayout();

// Text fields at top of page
await cropFrameRegion(0, 0, 0, 612, 400, 's1-p0-top.png');
// SSN at bottom (y=739, h=13.67)
await cropFrameRegion(0, 0, 680, 612, 112, 's1-p0-bottom-ssn.png');
// Full text field area
await cropFrameRegion(0, 0, 300, 612, 400, 's1-p0-fields.png');

// ================================================================
// SECTION 10 — Dual Citizenship (radios + text + dates)
// ================================================================
console.log('\n=== Section 10 — Dual Citizenship ===');
await page.goto(`${APP}/${subId}/citizenship/section10`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayout();

await cropFrameRegion(0, 0, 0, 612, 400, 's10-p0-top.png');
await cropFrameRegion(0, 0, 300, 612, 400, 's10-p0-mid.png');
await cropFrameRegion(0, 0, 700, 612, 92, 's10-p0-bottom.png');
await cropFrameRegion(1, 0, 0, 612, 400, 's10-p1-top.png');

await browser.close();
console.log(`\nAll screenshots saved to ${OUT}/`);
