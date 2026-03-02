#!/usr/bin/env node
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium, request } = require('playwright');

const APP = 'http://localhost:3000';
const email = `vfy-${Date.now()}@test.dev`;
const pw = 'TestPass1234';

await fetch(`${APP}/api/auth/register`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: pw }),
});
const reqCtx = await request.newContext({ baseURL: APP });
const { csrfToken } = await (await reqCtx.get('/api/auth/csrf')).json();
await reqCtx.post('/api/auth/callback/credentials', {
  form: { email, password: pw, csrfToken, redirect: 'false', callbackUrl: `${APP}/`, json: 'true' },
});
const storageState = await reqCtx.storageState();

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, storageState });
const page = await ctx.newPage();

// Create form
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(3000);
const btn = page.locator('button').filter({ hasText: /create|start/i }).first();
if (await btn.count() > 0) await btn.click();
await page.waitForTimeout(4000);
for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (page.url().match(/\/[0-9a-f-]{36}\//)) break; }
const subId = page.url().match(/\/([0-9a-f-]{36})\//)?.[1];
if (!subId) { console.error('No form'); await browser.close(); await reqCtx.dispose(); process.exit(1); }
console.log(`Form: ${subId}`);

// Section 26
await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 10000 }); } catch {}

const pdfBtn = page.locator('button:has-text("PDF Layout")');
if (await pdfBtn.count() > 0) await pdfBtn.click();

// Monitor images loading WITHOUT scrolling (test that eager loading works)
for (let t = 0; t < 15; t++) {
  await page.waitForTimeout(2000);
  const sec = (t + 1) * 2;
  const imgs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.relative.shadow-md img')).map(img => ({
      complete: img.complete, natW: img.naturalWidth,
    }))
  );
  const loaded = imgs.filter(i => i.complete && i.natW > 0).length;
  console.log(`${sec}s: ${loaded}/${imgs.length} images loaded (no scrolling)`);
  if (loaded === imgs.length && imgs.length > 0) break;
}

// Show All + Show fields
const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
const sf = page.locator('label:has-text("Show fields") input[type="checkbox"]');
if (await sf.count() > 0 && !(await sf.isChecked())) await sf.check();

// Set 50% opacity
await page.evaluate(() => {
  const s = document.querySelector('input[type="range"]');
  if (s) {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, '50');
    s.dispatchEvent(new Event('input', { bubbles: true }));
    s.dispatchEvent(new Event('change', { bubbles: true }));
  }
});
await page.waitForTimeout(2000);

const fields = await page.locator('[data-field-key]').count();
console.log(`\nFields with Show All: ${fields}`);

// Full page screenshot
await page.screenshot({ path: '/tmp/s26-fixed-full.png', fullPage: true });
console.log('Full screenshot: /tmp/s26-fixed-full.png');

// Crop first 3 pages
for (let i = 0; i < 3; i++) {
  const frame = page.locator('.relative.shadow-md').nth(i);
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await frame.boundingBox();
  if (box) {
    await page.screenshot({
      path: `/tmp/s26-page${i}.png`,
      clip: { x: box.x, y: box.y, width: box.width, height: box.height },
    });
    console.log(`Page ${i}: ${box.width.toFixed(0)}x${box.height.toFixed(0)}`);
  }
}

await browser.close();
await reqCtx.dispose();
console.log('\nDone!');
