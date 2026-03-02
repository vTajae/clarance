#!/usr/bin/env node
/**
 * Section 26 diagnostic — auth via API cookies, bypass login form.
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const APP = 'http://localhost:3000';

// Step 1: Auth via fetch (not browser form)
const email = `s26d4-${Date.now()}@test.dev`;
const pw = 'TestPass1234';

await fetch(`${APP}/api/auth/register`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: pw }),
});

// Get CSRF
const csrfResp = await fetch(`${APP}/api/auth/csrf`);
const csrfCookies = csrfResp.headers.getSetCookie?.() || [];
const { csrfToken } = await csrfResp.json();

// Login via callback — get session cookies
const loginResp = await fetch(`${APP}/api/auth/callback/credentials`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Cookie: csrfCookies.map(c => c.split(';')[0]).join('; '),
  },
  body: new URLSearchParams({
    email, password: pw, csrfToken,
    redirect: 'false', callbackUrl: APP + '/', json: 'true',
  }),
  redirect: 'manual', // Don't follow 302
});

// Collect all cookies
const allSetCookies = loginResp.headers.getSetCookie?.() || [];
const cookieJar = [...csrfCookies, ...allSetCookies];
console.log(`Auth cookies: ${cookieJar.length}`);

// Parse cookies for Playwright
const playwrightCookies = cookieJar.map(raw => {
  const parts = raw.split(';')[0].split('=');
  const name = parts[0].trim();
  const value = parts.slice(1).join('=').trim();
  return { name, value, domain: 'localhost', path: '/', httpOnly: false, secure: false, sameSite: 'Lax' };
});

// Verify session
const sessResp = await fetch(`${APP}/api/auth/session`, {
  headers: { Cookie: cookieJar.map(c => c.split(';')[0]).join('; ') },
});
const sess = await sessResp.json();
console.log(`Session: ${JSON.stringify(sess)}`);

// Step 2: Launch browser with session cookies
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 2 });
await ctx.addCookies(playwrightCookies);
const page = await ctx.newPage();

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', err => errors.push('PAGE: ' + err.message));

// Create form
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(3000);
console.log(`New page URL: ${page.url()}`);

const btn = page.locator('button').filter({ hasText: /create|start/i }).first();
if (await btn.count() > 0) {
  console.log(`Clicking: ${await btn.textContent()}`);
  await btn.click();
}
await page.waitForTimeout(4000);
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(500);
  if (page.url().match(/\/[0-9a-f-]{36}\//)) break;
}

const subId = page.url().match(/\/([0-9a-f-]{36})\//)?.[1];
if (!subId) {
  console.error(`No form created. URL: ${page.url()}`);
  await page.screenshot({ path: '/tmp/s26-no-form.png' });
  await browser.close();
  process.exit(1);
}
console.log(`Form: ${subId}\n`);

// Navigate to section 26
console.log('=== Section 26 ===');
await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(5000);
console.log(`URL: ${page.url()}`);

// Wait for Jotai
try {
  await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 10000 });
  console.log('Jotai: OK');
} catch { console.log('Jotai: MISSING'); }

// Switch to PDF Layout
const pdfBtn = page.locator('button:has-text("PDF Layout")');
if (await pdfBtn.count() > 0) {
  await pdfBtn.click();
  await page.waitForTimeout(3000);
  console.log('Switched to PDF Layout');
}

// Check frames and images
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
  console.log('Image timeout - checking individual status:');
  const imgStatus = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.relative.shadow-md img')).map((img, i) => ({
      i, complete: img.complete, natW: img.naturalWidth, natH: img.naturalHeight,
      src: img.src.substring(img.src.indexOf('/api/')),
    }))
  );
  for (const img of imgStatus) console.log(`  [${img.i}] complete=${img.complete} ${img.natW}x${img.natH}`);

  // Try fetching an image from page context
  if (imgStatus.length > 0) {
    const fetchTest = await page.evaluate(async () => {
      const r = await fetch('/api/pdf/render-page/sf861/117?dpi=72');
      return { status: r.status, type: r.headers.get('content-type'), redirected: r.redirected, finalUrl: r.url };
    });
    console.log(`  Fetch test: ${JSON.stringify(fetchTest)}`);
  }
}

// Show All + Show fields
const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
const sf = page.locator('label:has-text("Show fields") input[type="checkbox"]');
if (await sf.count() > 0 && !(await sf.isChecked())) await sf.check();
await page.waitForTimeout(2000);

const fieldCount = await page.locator('[data-field-key]').count();
console.log(`\nFields after Show All: ${fieldCount} (expected ~237-267)`);

// Screenshot
await page.screenshot({ path: '/tmp/s26-pdf-layout.png', fullPage: true });
console.log('Screenshot: /tmp/s26-pdf-layout.png');

// Crop first frame
if (state.frames > 0) {
  const frame = page.locator('.relative.shadow-md').first();
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const box = await frame.boundingBox();
  if (box) {
    await page.screenshot({
      path: '/tmp/s26-page0.png',
      clip: { x: box.x, y: box.y, width: box.width, height: box.height },
    });
    console.log(`Page 0 crop: ${box.width.toFixed(0)}x${box.height.toFixed(0)} → /tmp/s26-page0.png`);
  }
}

// Errors
if (errors.length > 0) {
  console.log(`\nConsole errors (${errors.length}):`);
  for (const e of errors.slice(0, 15)) console.log(`  ${e.substring(0, 200)}`);
}

await browser.close();
console.log('\nDone!');
