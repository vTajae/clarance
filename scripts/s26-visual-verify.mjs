#!/usr/bin/env node
/**
 * Section 26 visual verification — scrolls through pages like a real user.
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium, request } = require('playwright');

const APP = 'http://localhost:3000';
const OUT = '/tmp/s26-verify';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// Auth via API
const email = `s26v-${Date.now()}@test.dev`;
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

const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});
const ctx = await browser.newContext({
  viewport: { width: 1200, height: 900 },
  deviceScaleFactor: 1,
  storageState,
});
const page = await ctx.newPage();

page.on('crash', () => console.log('!! CRASH'));
page.on('close', () => console.log('!! CLOSE'));

// Create form (allow long wait for cold Turbopack)
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
const btn = page.locator('button').filter({ hasText: /create/i }).first();
if (await btn.count() > 0) await btn.click();
for (let i = 0; i < 60; i++) { await page.waitForTimeout(1000); if (page.url().match(/\/[0-9a-f-]{36}\//)) break; }
const subId = page.url().match(/\/([0-9a-f-]{36})\//)?.[1];
if (!subId) { console.error('No form'); await browser.close(); await reqCtx.dispose(); process.exit(1); }
console.log(`Form: ${subId}`);

// Navigate to section 26
console.log('\n=== Section 26 ===');
await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(8000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 15000 }); console.log('Jotai: OK'); } catch { console.log('Jotai: timeout'); }

// Click PDF Layout
const pdfBtn = page.locator('button:has-text("PDF Layout")');
if (await pdfBtn.count() > 0) {
  await pdfBtn.click();
  await page.waitForTimeout(3000);
  console.log('Switched to PDF Layout');
}

// Enable Show All
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
await page.waitForTimeout(1000);

// Count frames and fields
const frameCount = await page.locator('.relative.shadow-md').count();
const fieldCount = await page.locator('[data-field-key]').count();
console.log(`Frames: ${frameCount}, Fields: ${fieldCount}`);

// Scroll through EACH page frame to trigger lazy loading, take crop screenshots
for (let i = 0; i < frameCount; i++) {
  const frame = page.locator('.relative.shadow-md').nth(i);
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000); // Wait for lazy-loaded image

  // Check if image loaded
  const imgOk = await page.evaluate((idx) => {
    const img = document.querySelectorAll('.relative.shadow-md img')[idx];
    return img ? { complete: img.complete, w: img.naturalWidth, h: img.naturalHeight } : null;
  }, i);

  // Wait longer if not loaded
  if (imgOk && !imgOk.complete) {
    await page.waitForTimeout(5000);
  }

  const box = await frame.boundingBox();
  if (box) {
    await page.screenshot({
      path: `${OUT}/page${i}.png`,
      clip: { x: box.x, y: box.y, width: box.width, height: box.height },
    });
    const status = imgOk?.complete && imgOk?.w > 0 ? `${imgOk.w}x${imgOk.h}` : 'NO IMAGE';
    console.log(`  Page ${i}: ${box.width.toFixed(0)}x${box.height.toFixed(0)} img=${status}`);
  }
}

// Full page screenshot
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/full.png`, fullPage: true });
console.log(`\nFull: ${OUT}/full.png`);
console.log(`Crops: ${OUT}/page0.png - page${frameCount-1}.png`);

await browser.close();
await reqCtx.dispose();
console.log('\nDone!');
