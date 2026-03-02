#!/usr/bin/env node
/**
 * Quick diagnostic for section 26 PDF layout - no image waiting.
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const APP = 'http://localhost:3000';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

// Collect errors
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', err => errors.push('PAGE: ' + err.message));

// Collect network failures
const netFails = [];
page.on('response', resp => {
  if (resp.status() >= 400) {
    netFails.push(`${resp.status()} ${resp.url().substring(0, 120)}`);
  }
});

// Auth
const email = `diag-${Date.now()}@test.dev`;
await fetch(`${APP}/api/auth/register`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: 'diag1234Test' }),
});
await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2000);
await page.fill('input#email', email);
await page.fill('input#password', 'diag1234Test');
await page.click('button[type="submit"]');
for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (!page.url().includes('/login')) break; }
console.log(`Auth: ${page.url()}`);

// Create form
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
const createBtn = page.locator('button').filter({ hasText: /create|start/i }).first();
if (await createBtn.count() > 0) await createBtn.click();
await page.waitForTimeout(3000);
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(500);
  if (page.url().match(/\/[0-9a-f-]{36}\//)) break;
}
const subId = page.url().match(/\/([0-9a-f-]{36})\//)?.[1];
if (!subId) { console.error('No form created'); await browser.close(); process.exit(1); }
console.log(`Form: ${subId}`);

// Navigate to section 26
console.log('\n=== Section 26 ===');
await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
console.log(`URL: ${page.url()}`);

// Check Jotai
try {
  await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 10000 });
  console.log('Jotai: OK');
} catch { console.log('Jotai: MISSING'); }

// Check what mode we're in
const modeInfo = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim());
  const frames = document.querySelectorAll('.relative.shadow-md').length;
  const coordFields = document.querySelectorAll('[data-field-key]').length;
  const flowFields = document.querySelectorAll('[class*="space-y"]').length;
  return { btns: btns.filter(b => b), frames, coordFields, flowFields };
});
console.log(`Buttons: ${modeInfo.btns.join(', ')}`);
console.log(`PDF frames (before switch): ${modeInfo.frames}`);
console.log(`Coord fields: ${modeInfo.coordFields}`);

// Switch to PDF Layout
const pdfBtn = page.locator('button:has-text("PDF Layout")');
if (await pdfBtn.count() > 0) {
  await pdfBtn.click();
  await page.waitForTimeout(3000);
  console.log('\nSwitched to PDF Layout');
} else {
  console.log('\nNO PDF Layout button!');
}

// Check PDF layout state
const pdfState = await page.evaluate(() => {
  const frames = document.querySelectorAll('.relative.shadow-md');
  const imgs = document.querySelectorAll('.relative.shadow-md img');
  const coordFields = document.querySelectorAll('[data-field-key]');

  const imgDetails = Array.from(imgs).map((img, i) => ({
    i, src: img.src.substring(img.src.indexOf('/api/')),
    complete: img.complete,
    natW: img.naturalWidth, natH: img.naturalHeight,
    err: img.src.includes('error'),
  }));

  return {
    frameCount: frames.length,
    imgCount: imgs.length,
    fieldCount: coordFields.length,
    imgDetails: imgDetails.slice(0, 10),
  };
});
console.log(`\nPDF frames: ${pdfState.frameCount}`);
console.log(`Images: ${pdfState.imgCount}`);
console.log(`Fields: ${pdfState.fieldCount}`);
for (const img of pdfState.imgDetails) {
  console.log(`  img[${img.i}] ${img.src} complete=${img.complete} ${img.natW}x${img.natH}`);
}

// Enable Show All
const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
if (await sa.count() > 0 && !(await sa.isChecked())) {
  await sa.check();
  console.log('\nShow All: checked');
}
await page.waitForTimeout(2000);

// Recheck field count after Show All
const afterShowAll = await page.evaluate(() => ({
  fields: document.querySelectorAll('[data-field-key]').length,
  frames: document.querySelectorAll('.relative.shadow-md').length,
}));
console.log(`Fields after Show All: ${afterShowAll.fields}`);
console.log(`Frames after Show All: ${afterShowAll.frames}`);

// Screenshot
await page.screenshot({ path: '/tmp/s26-diag.png', fullPage: true });
console.log('\nScreenshot: /tmp/s26-diag.png');

// Errors
if (errors.length > 0) {
  console.log(`\nConsole errors (${errors.length}):`);
  for (const e of errors.slice(0, 15)) console.log(`  ${e.substring(0, 200)}`);
}
if (netFails.length > 0) {
  console.log(`\nNetwork failures (${netFails.length}):`);
  for (const f of netFails.slice(0, 15)) console.log(`  ${f}`);
}

await browser.close();
console.log('\nDone!');
