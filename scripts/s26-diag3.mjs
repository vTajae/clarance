#!/usr/bin/env node
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

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', err => errors.push('PAGE: ' + err.message));

// First register a NEW user (fresh DB entry)
const email = `diag3-${Date.now()}@test.dev`;
const pw = 'TestPassword123';
console.log(`Registering: ${email}`);
const regResp = await fetch(`${APP}/api/auth/register`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: pw }),
});
console.log(`Register response: ${regResp.status} ${regResp.statusText}`);
const regBody = await regResp.text();
console.log(`Register body: ${regBody.substring(0, 200)}`);

// Now try login via the signIn API directly (bypass form)
console.log('\n=== Trying credentials login via CSRF flow ===');
await page.goto(`${APP}/login`, { waitUntil: 'networkidle', timeout: 30000 });
await page.screenshot({ path: '/tmp/s26-login-before.png' });

// Fill and submit
await page.fill('input#email', email);
await page.fill('input#password', pw);

// Listen for network responses during login
const loginResponses = [];
page.on('response', resp => {
  if (resp.url().includes('auth')) {
    loginResponses.push(`${resp.status()} ${resp.url().substring(0, 100)}`);
  }
});

await page.click('button[type="submit"]');
await page.waitForTimeout(5000);

console.log(`After login URL: ${page.url()}`);
const cookies = await ctx.cookies();
console.log(`Cookies: ${cookies.map(c => `${c.name}=${c.value.substring(0,10)}...`).join(', ')}`);
console.log(`Auth responses: ${loginResponses.join('\n  ')}`);

// Check for error message on page
const errorMsg = await page.locator('.text-red-600').textContent().catch(() => '');
console.log(`Error message: "${errorMsg}"`);

await page.screenshot({ path: '/tmp/s26-login-after.png' });

// If still on login, check console errors
if (page.url().includes('/login')) {
  console.log('\nLogin FAILED - still on /login');
  if (errors.length > 0) {
    console.log(`Console errors:`);
    for (const e of errors) console.log(`  ${e.substring(0, 200)}`);
  }

  // Try the existing user credentials
  console.log('\n=== Trying existing user ===');
  await page.fill('input#email', 'beendiglies3432@proton.me');
  await page.fill('input#password', 'Password123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  console.log(`After 2nd login URL: ${page.url()}`);
  const cookies2 = await ctx.cookies();
  console.log(`Cookies: ${cookies2.map(c => `${c.name}=${c.value.substring(0,10)}...`).join(', ')}`);
  const errorMsg2 = await page.locator('.text-red-600').textContent().catch(() => '');
  console.log(`Error message: "${errorMsg2}"`);
  await page.screenshot({ path: '/tmp/s26-login-after2.png' });
}

// If we got past login, continue with section 26
if (!page.url().includes('/login')) {
  console.log('\n=== Login succeeded! ===');

  // Create form
  await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  const btn = page.locator('button').filter({ hasText: /create|start/i }).first();
  if (await btn.count() > 0) await btn.click();
  await page.waitForTimeout(3000);
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(500);
    if (page.url().match(/\/[0-9a-f-]{36}\//)) break;
  }
  const subId = page.url().match(/\/([0-9a-f-]{36})\//)?.[1];
  if (!subId) { console.error('No form'); await browser.close(); process.exit(1); }
  console.log(`Form: ${subId}`);

  // Section 26
  await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  // PDF Layout
  const pdfBtn = page.locator('button:has-text("PDF Layout")');
  if (await pdfBtn.count() > 0) {
    await pdfBtn.click();
    await page.waitForTimeout(3000);
  }

  // Check images
  const imgState = await page.evaluate(() => {
    const imgs = document.querySelectorAll('.relative.shadow-md img');
    return Array.from(imgs).map((img, i) => ({
      i, src: img.src, complete: img.complete,
      natW: img.naturalWidth, natH: img.naturalHeight,
    }));
  });
  console.log(`\nImages: ${imgState.length}`);
  for (const img of imgState) {
    console.log(`  [${img.i}] complete=${img.complete} ${img.natW}x${img.natH} ${img.src.substring(img.src.indexOf('/api/'))}`);
  }

  // Wait for any image to load
  try {
    await page.waitForFunction(() => {
      const imgs = document.querySelectorAll('.relative.shadow-md img');
      return imgs.length > 0 && Array.from(imgs).some(img => img.complete && img.naturalWidth > 0);
    }, { timeout: 10000 });
    console.log('At least one image loaded');
  } catch {
    console.log('NO images loaded after 10s');
    // Check what the image requests returned
    const testUrl = imgState[0]?.src;
    if (testUrl) {
      // Fetch with cookies
      const fetchCookies = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      const resp = await page.evaluate(async (url) => {
        const r = await fetch(url);
        return { status: r.status, type: r.headers.get('content-type'), redirected: r.redirected, url: r.url };
      }, testUrl);
      console.log(`Fetch test: status=${resp.status} type=${resp.type} redirected=${resp.redirected}`);
    }
  }

  // Show All
  const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
  if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
  await page.waitForTimeout(1000);

  const fieldCount = await page.locator('[data-field-key]').count();
  console.log(`Fields after Show All: ${fieldCount}`);

  await page.screenshot({ path: '/tmp/s26-pdf-layout.png', fullPage: true });
  console.log('Screenshot: /tmp/s26-pdf-layout.png');
}

if (errors.length > 0) {
  console.log(`\nConsole errors (${errors.length}):`);
  for (const e of errors.slice(0, 10)) console.log(`  ${e.substring(0, 200)}`);
}

await browser.close();
console.log('\nDone!');
