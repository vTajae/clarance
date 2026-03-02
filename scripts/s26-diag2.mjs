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
const netFails = [];
page.on('response', resp => {
  if (resp.status() >= 400 || resp.status() === 307) {
    netFails.push(`${resp.status()} ${resp.url().substring(0, 120)}`);
  }
});

// Login with existing user
await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2000);
await page.fill('input#email', 'beendiglies3432@proton.me');
await page.fill('input#password', 'Password123');
await page.click('button[type="submit"]');
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(500);
  if (!page.url().includes('/login')) break;
}
console.log(`Auth: ${page.url()}`);

// Check cookies
const cookies = await ctx.cookies();
console.log(`Cookies: ${cookies.map(c => c.name).join(', ')}`);

// Find or create a form
let subId;
// Check if there's already a form on the homepage
const links = await page.evaluate(() =>
  Array.from(document.querySelectorAll('a[href]'))
    .map(a => a.getAttribute('href'))
    .filter(h => h?.match(/\/[0-9a-f-]{36}\//))
);
if (links.length > 0) {
  subId = links[0].match(/\/([0-9a-f-]{36})\//)?.[1];
  console.log(`Using existing form: ${subId}`);
} else {
  // Create new
  await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  const btn = page.locator('button').filter({ hasText: /create|start/i }).first();
  if (await btn.count() > 0) await btn.click();
  await page.waitForTimeout(3000);
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(500);
    if (page.url().match(/\/[0-9a-f-]{36}\//)) break;
  }
  subId = page.url().match(/\/([0-9a-f-]{36})\//)?.[1];
}
if (!subId) { console.error('No form'); await browser.close(); process.exit(1); }
console.log(`Form: ${subId}\n`);

// Navigate to section 26
console.log('=== Section 26 ===');
await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(5000);
console.log(`URL: ${page.url()}`);

// Check Jotai
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
} else {
  console.log('NO PDF Layout button!');
}

// Check frames and images
const state1 = await page.evaluate(() => {
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
console.log(`\nFrames: ${state1.frames}`);
console.log(`Fields: ${state1.fields}`);
for (const img of state1.imgs) {
  console.log(`  img[${img.i}] ${img.src} complete=${img.complete} ${img.natW}x${img.natH}`);
}

// Wait for images with timeout
console.log('\nWaiting for images (15s max)...');
try {
  await page.waitForFunction(() => {
    const imgs = document.querySelectorAll('.relative.shadow-md img');
    return imgs.length > 0 && Array.from(imgs).every(img => img.complete);
  }, { timeout: 15000 });
  console.log('All images loaded!');
} catch {
  console.log('Image loading timed out');
  // Check which ones loaded
  const imgStatus = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.relative.shadow-md img')).map((img, i) => ({
      i, complete: img.complete, natW: img.naturalWidth, natH: img.naturalHeight,
      src: img.src.substring(img.src.indexOf('/api/')),
    }))
  );
  for (const img of imgStatus) {
    console.log(`  img[${img.i}] complete=${img.complete} ${img.natW}x${img.natH} ${img.src}`);
  }
}

// Enable Show All
const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
if (await sa.count() > 0 && !(await sa.isChecked())) {
  await sa.check();
  await page.waitForTimeout(1000);
}
const showFields = page.locator('label:has-text("Show fields") input[type="checkbox"]');
if (await showFields.count() > 0 && !(await showFields.isChecked())) {
  await showFields.check();
  await page.waitForTimeout(1000);
}

const state2 = await page.evaluate(() => ({
  fields: document.querySelectorAll('[data-field-key]').length,
  frames: document.querySelectorAll('.relative.shadow-md').length,
}));
console.log(`\nAfter Show All + Show fields: ${state2.fields} fields, ${state2.frames} frames`);

// Screenshot
try {
  await page.screenshot({ path: '/tmp/s26-diag2.png', fullPage: true });
  console.log('Screenshot: /tmp/s26-diag2.png');
} catch (e) {
  console.log(`Screenshot error: ${e.message}`);
}

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
