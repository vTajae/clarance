#!/usr/bin/env node
/**
 * Section 26 diagnostic — use Playwright's own requestContext for auth.
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium, request } = require('playwright');

const APP = 'http://localhost:3000';
const email = `s26d5-${Date.now()}@test.dev`;
const pw = 'TestPass1234';

// Register via fetch
await fetch(`${APP}/api/auth/register`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: pw }),
});
console.log(`Registered: ${email}`);

// Use Playwright's request context (handles cookies properly)
const reqCtx = await request.newContext({ baseURL: APP });

// Get CSRF
const csrfResp = await reqCtx.get('/api/auth/csrf');
const { csrfToken } = await csrfResp.json();
console.log(`CSRF: ${csrfToken}`);

// Login
const loginResp = await reqCtx.post('/api/auth/callback/credentials', {
  form: { email, password: pw, csrfToken, redirect: 'false', callbackUrl: `${APP}/`, json: 'true' },
});
console.log(`Login status: ${loginResp.status()}`);

// Verify session
const sessResp = await reqCtx.get('/api/auth/session');
const sess = await sessResp.json();
console.log(`Session: ${JSON.stringify(sess)}`);

// Get the storageState from the request context (includes cookies)
const storageState = await reqCtx.storageState();
console.log(`Cookies in storage: ${storageState.cookies.length}`);
for (const c of storageState.cookies) {
  console.log(`  ${c.name} = ${c.value.substring(0, 20)}... (domain=${c.domain})`);
}

// Launch browser with the auth state
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({
  viewport: { width: 1800, height: 1200 },
  deviceScaleFactor: 2,
  storageState,
});
const page = await ctx.newPage();

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', err => errors.push('PAGE: ' + err.message));

// Verify auth works in browser
await page.goto(`${APP}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2000);
console.log(`\nHome URL: ${page.url()}`);

// Create form
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(3000);
const btn = page.locator('button').filter({ hasText: /create|start/i }).first();
if (await btn.count() > 0) {
  await btn.click();
  await page.waitForTimeout(4000);
}
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(500);
  if (page.url().match(/\/[0-9a-f-]{36}\//)) break;
}
const subId = page.url().match(/\/([0-9a-f-]{36})\//)?.[1];
if (!subId) {
  console.error(`No form. URL: ${page.url()}`);
  await page.screenshot({ path: '/tmp/s26-noform.png' });
  await browser.close(); await reqCtx.dispose(); process.exit(1);
}
console.log(`Form: ${subId}`);

// Navigate to section 26
console.log('\n=== Section 26 ===');
await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(5000);
console.log(`URL: ${page.url()}`);

try {
  await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 10000 });
  console.log('Jotai: OK');
} catch { console.log('Jotai: MISSING'); }

// Switch to PDF Layout
const pdfBtn = page.locator('button:has-text("PDF Layout")');
if (await pdfBtn.count() > 0) {
  await pdfBtn.click();
  await page.waitForTimeout(4000);
  console.log('Switched to PDF Layout');
}

// Check state
const state = await page.evaluate(() => {
  const frames = document.querySelectorAll('.relative.shadow-md');
  const imgs = document.querySelectorAll('.relative.shadow-md img');
  return {
    frames: frames.length,
    imgs: Array.from(imgs).map((img, i) => ({
      i, src: img.src.substring(img.src.indexOf('/api/')),
      complete: img.complete, natW: img.naturalWidth, natH: img.naturalHeight,
    })),
    fields: document.querySelectorAll('[data-field-key]').length,
  };
});
console.log(`\nFrames: ${state.frames}`);
console.log(`Fields: ${state.fields}`);
for (const img of state.imgs) {
  console.log(`  img[${img.i}] complete=${img.complete} ${img.natW}x${img.natH} ${img.src}`);
}

// Wait for images
console.log('\nWaiting for images (20s max)...');
try {
  await page.waitForFunction(() => {
    const imgs = document.querySelectorAll('.relative.shadow-md img');
    return imgs.length > 0 && Array.from(imgs).every(img => img.complete && img.naturalWidth > 0);
  }, { timeout: 20000 });
  console.log('All images loaded!');
} catch {
  console.log('Image timeout');
  const imgStatus = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.relative.shadow-md img')).map((img, i) => ({
      i, complete: img.complete, natW: img.naturalWidth, natH: img.naturalHeight,
    }))
  );
  for (const img of imgStatus) console.log(`  [${img.i}] complete=${img.complete} ${img.natW}x${img.natH}`);

  // Fetch test from browser context
  const fetchTest = await page.evaluate(async () => {
    try {
      const r = await fetch('/api/pdf/render-page/sf861/117?dpi=72');
      return { status: r.status, type: r.headers.get('content-type'), redirected: r.redirected };
    } catch (e) {
      return { error: e.message };
    }
  });
  console.log(`  Browser fetch test: ${JSON.stringify(fetchTest)}`);
}

// Show All
const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
const sf = page.locator('label:has-text("Show fields") input[type="checkbox"]');
if (await sf.count() > 0 && !(await sf.isChecked())) await sf.check();
await page.waitForTimeout(2000);

console.log(`Fields after Show All: ${await page.locator('[data-field-key]').count()}`);

// Screenshot
await page.screenshot({ path: '/tmp/s26-pdf-layout.png', fullPage: true });
console.log('\nScreenshot: /tmp/s26-pdf-layout.png');

// Crop first 3 frames
for (let i = 0; i < Math.min(state.frames, 3); i++) {
  const frame = page.locator('.relative.shadow-md').nth(i);
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await frame.boundingBox();
  if (box) {
    await page.screenshot({
      path: `/tmp/s26-page${i}.png`,
      clip: { x: box.x, y: box.y, width: box.width, height: box.height },
    });
    console.log(`Page ${i}: ${box.width.toFixed(0)}x${box.height.toFixed(0)} → /tmp/s26-page${i}.png`);
  }
}

if (errors.length > 0) {
  console.log(`\nConsole errors (${errors.length}):`);
  for (const e of errors.slice(0, 15)) console.log(`  ${e.substring(0, 200)}`);
}

await browser.close();
await reqCtx.dispose();
console.log('\nDone!');
