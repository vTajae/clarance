#!/usr/bin/env node
/**
 * Take precise SSN field crops within the PDF page frame at 3x resolution.
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
const ctx = await browser.newContext({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 3 });
const page = await ctx.newPage();

// Auth
const email = `ssncrop-${Date.now()}@test.dev`;
const pw = 'ssnCrop1234';
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

await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
await page.click('button:has-text("Create Form")');
for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (page.url().includes('/identification/section1')) break; }
const subId = page.url().split('/')[3];
console.log(`Form: ${subId}`);

async function setup() {
  const btn = page.locator('button:has-text("PDF Layout")');
  if (await btn.count() > 0) { await btn.click(); await page.waitForTimeout(2000); }
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
  await page.evaluate(async () => {
    const imgs = document.querySelectorAll('.relative.shadow-md img');
    await Promise.all(Array.from(imgs).map(img =>
      img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
    ));
  });
  await page.waitForTimeout(1000);
}

// Section 1
await page.goto(`${APP}/${subId}/identification/section1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setup();

// Scroll to bottom of first PDF page frame
await page.evaluate(() => {
  const frame = document.querySelectorAll('.relative.shadow-md')[0];
  if (frame) {
    // Scroll so the bottom of the frame is visible
    const rect = frame.getBoundingClientRect();
    window.scrollBy(0, rect.y + rect.height - window.innerHeight + 50);
  }
});
await page.waitForTimeout(500);

// Get frame position after scroll
const frameInfo = await page.evaluate(() => {
  const frame = document.querySelectorAll('.relative.shadow-md')[0];
  if (!frame) return null;
  const r = frame.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});

if (frameInfo) {
  // Crop the bottom 100pt of the PDF page (SSN at y=739, page height=792)
  const cropStart = frameInfo.y + 680; // Start from y=680 in PDF coords
  const cropH = 112; // 680 to 792
  await page.screenshot({
    path: '/tmp/ssn_page_bottom.png',
    clip: {
      x: Math.max(0, frameInfo.x),
      y: Math.max(0, cropStart),
      width: Math.min(frameInfo.w, 1800),
      height: cropH,
    },
  });
  console.log('SSN page bottom: /tmp/ssn_page_bottom.png');

  // Also crop a wider view showing more of the page
  const widerStart = frameInfo.y + 600;
  await page.screenshot({
    path: '/tmp/ssn_wider.png',
    clip: {
      x: Math.max(0, frameInfo.x),
      y: Math.max(0, widerStart),
      width: Math.min(frameInfo.w, 1800),
      height: 192,
    },
  });
  console.log('SSN wider: /tmp/ssn_wider.png');
}

// Also take crops from a section with more content (section 9) to verify radio fix
console.log('\n=== Section 9 — Citizenship (verify radio fix) ===');
await page.goto(`${APP}/${subId}/citizenship/section9`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setup();

// Crop radio area
const radioKeys = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('[data-field-key*="radio"]'))
    .map(el => el.getAttribute('data-field-key'));
});
console.log(`Radios: ${radioKeys.length}`);

if (radioKeys.length >= 2) {
  const el0 = page.locator(`[data-field-key="${radioKeys[0]}"]`).first();
  const el1 = page.locator(`[data-field-key="${radioKeys[1]}"]`).first();
  await el0.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const b0 = await el0.boundingBox();
  const b1 = await el1.boundingBox();
  if (b0 && b1) {
    const mx = Math.min(b0.x, b1.x);
    const my = Math.min(b0.y, b1.y);
    const mxr = Math.max(b0.x + b0.width, b1.x + b1.width);
    const myr = Math.max(b0.y + b0.height, b1.y + b1.height);
    await page.screenshot({
      path: '/tmp/s9_radio_fixed.png',
      clip: { x: Math.max(0, mx - 25), y: Math.max(0, my - 20), width: mxr - mx + 50, height: myr - my + 40 },
    });
    console.log('Radio pair (fixed): /tmp/s9_radio_fixed.png');
  }
}

// Crop a row of 3 radios
if (radioKeys.length >= 3) {
  const boxes = [];
  for (let i = 0; i < 3; i++) {
    const el = page.locator(`[data-field-key="${radioKeys[i]}"]`).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const box = await el.boundingBox();
    if (box) boxes.push(box);
  }
  if (boxes.length >= 3) {
    const mx = Math.min(...boxes.map(b => b.x));
    const my = Math.min(...boxes.map(b => b.y));
    const mxr = Math.max(...boxes.map(b => b.x + b.width));
    const myr = Math.max(...boxes.map(b => b.y + b.height));
    await page.screenshot({
      path: '/tmp/s9_radio_row_fixed.png',
      clip: { x: Math.max(0, mx - 20), y: Math.max(0, my - 15), width: mxr - mx + 40, height: myr - my + 30 },
    });
    console.log('Radio row (fixed): /tmp/s9_radio_row_fixed.png');
  }
}

// Section 8 — U.S. Passport
console.log('\n=== Section 8 ===');
await page.goto(`${APP}/${subId}/citizenship/section8`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setup();

const s8Radios = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('[data-field-key*="radio"]'))
    .map(el => el.getAttribute('data-field-key'));
});
console.log(`S8 Radios: ${s8Radios.length}`);

if (s8Radios.length >= 2) {
  const el0 = page.locator(`[data-field-key="${s8Radios[0]}"]`).first();
  const el1 = page.locator(`[data-field-key="${s8Radios[1]}"]`).first();
  await el0.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const b0 = await el0.boundingBox();
  const b1 = await el1.boundingBox();
  if (b0 && b1) {
    const mx = Math.min(b0.x, b1.x);
    const my = Math.min(b0.y, b1.y);
    const mxr = Math.max(b0.x + b0.width, b1.x + b1.width);
    const myr = Math.max(b0.y + b0.height, b1.y + b1.height);
    await page.screenshot({
      path: '/tmp/s8_radio_fixed.png',
      clip: { x: Math.max(0, mx - 25), y: Math.max(0, my - 20), width: mxr - mx + 50, height: myr - my + 40 },
    });
    console.log('S8 Radio pair (fixed): /tmp/s8_radio_fixed.png');
  }
}

await browser.close();
console.log('\nAll crops saved!');
