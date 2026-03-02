#!/usr/bin/env node
/**
 * Test section 26 PDF layout rendering.
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
const OUT = '/tmp/s26-test';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

// Collect console errors
const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', err => errors.push(`PAGE ERROR: ${err.message}`));

// Auth
const email = `s26-${Date.now()}@test.dev`;
const pw = 's26Test1234';
await fetch(`${APP}/api/auth/register`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: pw }),
});
await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2000);
await page.fill('input#email', email);
await page.fill('input#password', pw);
await page.click('button[type="submit"]');
for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (!page.url().includes('/login')) break; }

// Create form
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
const createBtn = page.locator('button').filter({ hasText: /create|start/i }).first();
if (await createBtn.count() > 0) await createBtn.click();
await page.waitForTimeout(3000);
const match = page.url().match(/\/([0-9a-f-]{36})\//);
const subId = match ? match[1] : null;
if (!subId) { console.error('Failed to create form'); await browser.close(); process.exit(1); }
console.log(`Form: ${subId}`);

// Navigate to section 26
console.log('\n=== Navigating to section 26 ===');
await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);

// Check response
console.log(`URL: ${page.url()}`);
const is404 = await page.locator('text=404').count();
const isNotFound = await page.locator('text=not found').count();
console.log(`404 text: ${is404}, not found: ${isNotFound}`);

// Take initial screenshot (Flow mode)
await page.screenshot({ path: `${OUT}/s26-flow-mode.png`, fullPage: true });
console.log('Saved: s26-flow-mode.png');

// Wait for Jotai store
try {
  await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 });
  console.log('Jotai store ready');
} catch {
  console.log('WARNING: Jotai store not found after 15s');
}

// Switch to PDF Layout
console.log('\n=== Switching to PDF Layout ===');
const pdfBtn = page.locator('button:has-text("PDF Layout")');
if (await pdfBtn.count() > 0) {
  await pdfBtn.click();
  await page.waitForTimeout(2000);
  console.log('Clicked PDF Layout button');
} else {
  console.log('WARNING: No PDF Layout button found!');
  // Check what buttons exist
  const allBtns = await page.locator('button').allTextContents();
  console.log(`Available buttons: ${allBtns.join(', ')}`);
}

// Check for PDF page frames
const frameCount = await page.locator('.relative.shadow-md').count();
console.log(`PDF page frames: ${frameCount} (expected: 7 for pages 118-124)`);

if (frameCount === 0) {
  console.log('\n!!! NO PDF FRAMES RENDERED !!!');
  // Check if the section loaded at all
  const body = await page.locator('main').innerHTML();
  console.log(`Main content length: ${body.length} chars`);
  console.log(`First 500 chars: ${body.substring(0, 500)}`);
}

// Set opacity and show all
await page.evaluate(() => {
  const s = document.querySelector('input[type="range"]');
  if (s) {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, '50');
    s.dispatchEvent(new Event('input', { bubbles: true }));
    s.dispatchEvent(new Event('change', { bubbles: true }));
  }
});
const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
const sf = page.locator('label:has-text("Show fields") input[type="checkbox"]');
if (await sf.count() > 0 && !(await sf.isChecked())) await sf.check();
await page.waitForTimeout(3000);

// Wait for images
await page.evaluate(async () => {
  const imgs = document.querySelectorAll('.relative.shadow-md img');
  await Promise.all(Array.from(imgs).map(img =>
    img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
  ));
});
await page.waitForTimeout(1000);

// Check image load status
const imgStatus = await page.evaluate(() => {
  const imgs = document.querySelectorAll('.relative.shadow-md img');
  return Array.from(imgs).map((img, i) => ({
    idx: i,
    src: img.src.substring(img.src.lastIndexOf('/') - 20),
    complete: img.complete,
    naturalW: img.naturalWidth,
    naturalH: img.naturalHeight,
    displayW: img.width,
    displayH: img.height,
  }));
});
console.log(`\n=== Image status ===`);
for (const img of imgStatus) {
  console.log(`  [${img.idx}] ${img.src} complete=${img.complete} natural=${img.naturalW}x${img.naturalH} display=${img.displayW}x${img.displayH}`);
}

// Count rendered fields
const fieldInfo = await page.evaluate(() => {
  const fields = document.querySelectorAll('[data-field-key]');
  const visible = [];
  const hidden = [];
  for (const el of fields) {
    const rect = el.getBoundingClientRect();
    const key = el.getAttribute('data-field-key');
    if (rect.width > 0 && rect.height > 0) {
      visible.push(key);
    } else {
      hidden.push(key);
    }
  }
  return { total: fields.length, visible: visible.length, hidden: hidden.length };
});
console.log(`\n=== Field rendering ===`);
console.log(`  Total DOM elements: ${fieldInfo.total}`);
console.log(`  Visible (has size): ${fieldInfo.visible}`);
console.log(`  Hidden (zero size): ${fieldInfo.hidden}`);

// Take PDF Layout screenshot
await page.screenshot({ path: `${OUT}/s26-pdf-layout.png`, fullPage: true });
console.log('Saved: s26-pdf-layout.png');

// Crop first page
if (frameCount > 0) {
  const frame = page.locator('.relative.shadow-md').first();
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const box = await frame.boundingBox();
  if (box) {
    await page.screenshot({
      path: `${OUT}/s26-page1.png`,
      clip: { x: box.x, y: box.y, width: box.width, height: box.height },
    });
    console.log(`Saved: s26-page1.png (${box.width}x${box.height})`);
  }
}

// Check for any network errors on PDF render requests
const failedReqs = [];
page.on('response', resp => {
  if (resp.url().includes('render-page') && resp.status() !== 200) {
    failedReqs.push({ url: resp.url(), status: resp.status() });
  }
});

// Report errors
if (errors.length > 0) {
  console.log(`\n=== Console errors (${errors.length}) ===`);
  for (const e of errors.slice(0, 10)) console.log(`  ${e}`);
}

if (failedReqs.length > 0) {
  console.log(`\n=== Failed network requests ===`);
  for (const r of failedReqs) console.log(`  ${r.status} ${r.url}`);
}

await browser.close();
console.log('\nDone!');
