#!/usr/bin/env node
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const APP = 'http://localhost:3000';
const OUT = '/tmp/s26';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', err => errors.push('PAGE: ' + err.message));

// Auth
const email = `s26-${Date.now()}@test.dev`;
await fetch(`${APP}/api/auth/register`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: 's26Test1234' }),
});
await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2000);
await page.fill('input#email', email);
await page.fill('input#password', 's26Test1234');
await page.click('button[type="submit"]');
for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (!page.url().includes('/login')) break; }

// Create form
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
await page.click('button:has-text("Create Form")');
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(500);
  if (page.url().match(/\/[0-9a-f-]{36}\//)) break;
}
const subId = page.url().match(/\/([0-9a-f-]{36})\//)?.[1];
if (!subId) { console.error('Failed to create form. URL:', page.url()); await browser.close(); process.exit(1); }
console.log(`Form: ${subId}`);

// Section 26
console.log('\n=== Section 26 ===');
await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
console.log(`URL: ${page.url()}`);
try { await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 15000 }); console.log('Jotai: OK'); } catch { console.log('Jotai: timeout'); }

// PDF Layout
const pdfBtn = page.locator('button:has-text("PDF Layout")');
if (await pdfBtn.count() > 0) {
  await pdfBtn.click();
  await page.waitForTimeout(2000);
  console.log('Switched to PDF Layout');
} else {
  console.log('NO PDF Layout button!');
}

// Controls
const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
const sf = page.locator('label:has-text("Show fields") input[type="checkbox"]');
if (await sf.count() > 0 && !(await sf.isChecked())) await sf.check();
await page.evaluate(() => {
  const s = document.querySelector('input[type="range"]');
  if (s) {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, '50');
    s.dispatchEvent(new Event('input', { bubbles: true }));
    s.dispatchEvent(new Event('change', { bubbles: true }));
  }
});
await page.waitForTimeout(4000);
await page.evaluate(async () => {
  const imgs = document.querySelectorAll('.relative.shadow-md img');
  await Promise.all(Array.from(imgs).map(img =>
    img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
  ));
});
await page.waitForTimeout(1000);

// Diagnostics
const frames = await page.locator('.relative.shadow-md').count();
console.log(`PDF frames: ${frames} (expected: 7)`);
const fieldCount = await page.locator('[data-field-key]').count();
console.log(`Fields in DOM: ${fieldCount} (expected: ~237 with Show All)`);

const imgInfo = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.relative.shadow-md img')).map((img, i) => ({
    i, src: img.src.split('/').slice(-3).join('/'),
    ok: img.complete && img.naturalWidth > 0,
    w: img.naturalWidth, h: img.naturalHeight,
  }));
});
for (const img of imgInfo) console.log(`  img[${img.i}] ${img.src} ${img.ok ? 'OK' : 'FAIL'} ${img.w}x${img.h}`);

// Screenshots
await page.screenshot({ path: `${OUT}/full.png`, fullPage: true });
for (let i = 0; i < Math.min(frames, 3); i++) {
  const el = page.locator('.relative.shadow-md').nth(i);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await el.boundingBox();
  if (box) {
    await page.screenshot({ path: `${OUT}/page${i}.png`, clip: { x: box.x, y: box.y, width: box.width, height: box.height } });
    console.log(`Page ${i}: ${box.width.toFixed(0)}x${box.height.toFixed(0)}`);
  }
}

if (errors.length > 0) {
  console.log(`\nConsole errors (${errors.length}):`);
  for (const e of errors.slice(0, 20)) console.log(`  ${e.substring(0, 300)}`);
} else {
  console.log('\nNo console errors');
}

await browser.close();
console.log('\nDone!');
