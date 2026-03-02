#!/usr/bin/env node
/**
 * Visual alignment crop check: takes tight crops around individual radio circles,
 * text fields, and SSN fields using element.boundingBox() for pixel-level inspection.
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { mkdirSync, existsSync, readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const APP = 'http://localhost:3000';
const OUT = '/tmp/visual-crops';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const PADDING = 30; // px padding around each element

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1800, height: 1200 } });
const page = await ctx.newPage();

// Auth
const email = `crop-${Date.now()}@test.dev`;
const pw = 'cropCheck1234';
await fetch(`${APP}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: pw }),
});
await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2000);
await page.fill('input#email', email);
await page.fill('input#password', pw);
await page.click('button[type="submit"]');
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(500);
  if (!page.url().includes('/login')) break;
}

// Create form
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
await page.click('button:has-text("Create Form")');
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(500);
  if (page.url().includes('/identification/section1')) break;
}
const subId = page.url().split('/')[3];
console.log(`Form: ${subId}`);

// Helper: setup PDF Layout + wait for backgrounds
async function setupPdfLayout() {
  const pdfBtn = page.locator('button:has-text("PDF Layout")');
  if (await pdfBtn.count() > 0) {
    await pdfBtn.click();
    await page.waitForTimeout(2000);
  }
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
  // Wait for PDF background images to fully load
  await page.waitForTimeout(3000);
  await page.evaluate(async () => {
    const imgs = document.querySelectorAll('.relative.shadow-md img');
    const promises = Array.from(imgs).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(r => { img.onload = r; img.onerror = r; });
    });
    await Promise.all(promises);
  });
  await page.waitForTimeout(500);
}

// Helper: crop around an element
async function cropElement(selector, filename) {
  const el = page.locator(selector).first();
  if (await el.count() === 0) return false;
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await el.boundingBox();
  if (!box) return false;
  const clip = {
    x: Math.max(0, box.x - PADDING),
    y: Math.max(0, box.y - PADDING),
    width: box.width + PADDING * 2,
    height: box.height + PADDING * 2,
  };
  await page.screenshot({ path: `${OUT}/${filename}`, clip });
  return true;
}

// Helper: crop a group of elements (uses bounding box of all)
async function cropGroup(selectors, filename) {
  let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
  for (const sel of selectors) {
    const el = page.locator(sel).first();
    if (await el.count() === 0) continue;
    const box = await el.boundingBox();
    if (!box) continue;
    minX = Math.min(minX, box.x);
    minY = Math.min(minY, box.y);
    maxX = Math.max(maxX, box.x + box.width);
    maxY = Math.max(maxY, box.y + box.height);
  }
  if (minX === Infinity) return false;

  // Scroll the first element into view
  const first = page.locator(selectors[0]).first();
  await first.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Re-measure after scroll
  minX = Infinity; minY = Infinity; maxX = 0; maxY = 0;
  for (const sel of selectors) {
    const el = page.locator(sel).first();
    if (await el.count() === 0) continue;
    const box = await el.boundingBox();
    if (!box) continue;
    minX = Math.min(minX, box.x);
    minY = Math.min(minY, box.y);
    maxX = Math.max(maxX, box.x + box.width);
    maxY = Math.max(maxY, box.y + box.height);
  }

  const clip = {
    x: Math.max(0, minX - PADDING),
    y: Math.max(0, minY - PADDING),
    width: (maxX - minX) + PADDING * 2,
    height: (maxY - minY) + PADDING * 2,
  };
  await page.screenshot({ path: `${OUT}/${filename}`, clip });
  return true;
}

// ================================================================
// Section 9 — Citizenship Status (has many radios)
// ================================================================
console.log('\n=== Section 9 — Citizenship ===');
await page.goto(`${APP}/${subId}/citizenship/section9`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayout();

// Get all radio element keys
const s9Radios = await page.evaluate(() => {
  const els = document.querySelectorAll('[data-field-key*="radio"]');
  return Array.from(els).map(el => el.getAttribute('data-field-key'));
});
console.log(`  Radios: ${s9Radios.length}`);

// Crop each radio individually (first 8)
for (let i = 0; i < Math.min(s9Radios.length, 8); i++) {
  const key = s9Radios[i];
  const ok = await cropElement(`[data-field-key="${key}"]`, `s9-radio-${i}-${key.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`);
  if (ok) console.log(`  Cropped: ${key}`);
}

// Crop a row of radios together (first 2 options of first field)
if (s9Radios.length >= 2) {
  await cropGroup(
    [
      `[data-field-key="${s9Radios[0]}"]`,
      `[data-field-key="${s9Radios[1]}"]`,
    ],
    's9-radio-pair.png'
  );
  console.log('  Cropped: radio pair');
}

// Get a few text fields too for comparison
const s9TextFields = await page.evaluate(() => {
  const els = document.querySelectorAll('[data-field-key]:not([data-field-key*="radio"])');
  return Array.from(els).slice(0, 5).map(el => el.getAttribute('data-field-key'));
});
for (let i = 0; i < Math.min(s9TextFields.length, 3); i++) {
  const key = s9TextFields[i];
  const ok = await cropElement(`[data-field-key="${key}"]`, `s9-text-${i}-${key.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`);
  if (ok) console.log(`  Cropped text: ${key}`);
}

// Full page screenshot
await page.screenshot({ path: `${OUT}/s9-full.png`, fullPage: true });

// ================================================================
// Section 1 — SSN bottom-of-page
// ================================================================
console.log('\n=== Section 1 — SSN fields ===');
await page.goto(`${APP}/${subId}/identification/section1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayout();

// Get SSN fields
const s1SsnFields = await page.evaluate(() => {
  const els = document.querySelectorAll('[data-field-key]');
  return Array.from(els)
    .filter(el => {
      const k = el.getAttribute('data-field-key') || '';
      return k.includes('yourSocialSecurity') || k.includes('autofill') || k.includes('Autofill');
    })
    .map(el => el.getAttribute('data-field-key'));
});
console.log(`  SSN fields: ${s1SsnFields.length}`);

for (let i = 0; i < Math.min(s1SsnFields.length, 4); i++) {
  const key = s1SsnFields[i];
  const ok = await cropElement(`[data-field-key="${key}"]`, `s1-ssn-${i}-${key.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`);
  if (ok) console.log(`  Cropped: ${key}`);
}

// Also get text fields for comparison
const s1TextFields = await page.evaluate(() => {
  const els = document.querySelectorAll('[data-field-key]:not([data-field-key*="yourSocialSecurity"]):not([data-field-key*="autofill"]):not([data-field-key*="Autofill"])');
  return Array.from(els).slice(0, 5).map(el => el.getAttribute('data-field-key'));
});
for (let i = 0; i < Math.min(s1TextFields.length, 3); i++) {
  const key = s1TextFields[i];
  const ok = await cropElement(`[data-field-key="${key}"]`, `s1-text-${i}-${key.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`);
  if (ok) console.log(`  Cropped text: ${key}`);
}

// Full page
await page.screenshot({ path: `${OUT}/s1-full.png`, fullPage: true });

// ================================================================
// Section 8 — U.S. Passport (radios + text on page 6)
// ================================================================
console.log('\n=== Section 8 — U.S. Passport ===');
await page.goto(`${APP}/${subId}/citizenship/section8`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayout();
await page.waitForTimeout(3000); // Extra wait for PDF images

const s8Radios = await page.evaluate(() => {
  const els = document.querySelectorAll('[data-field-key*="radio"]');
  return Array.from(els).map(el => el.getAttribute('data-field-key'));
});
console.log(`  Radios: ${s8Radios.length}`);

for (let i = 0; i < Math.min(s8Radios.length, 4); i++) {
  const key = s8Radios[i];
  const ok = await cropElement(`[data-field-key="${key}"]`, `s8-radio-${i}-${key.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`);
  if (ok) console.log(`  Cropped: ${key}`);
}

// Radio pair
if (s8Radios.length >= 2) {
  await cropGroup(
    s8Radios.slice(0, 2).map(k => `[data-field-key="${k}"]`),
    's8-radio-pair.png'
  );
}

// Text fields
const s8TextFields = await page.evaluate(() => {
  const els = document.querySelectorAll('[data-field-key]:not([data-field-key*="radio"])');
  return Array.from(els).slice(0, 3).map(el => el.getAttribute('data-field-key'));
});
for (let i = 0; i < s8TextFields.length; i++) {
  const key = s8TextFields[i];
  const ok = await cropElement(`[data-field-key="${key}"]`, `s8-text-${i}-${key.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`);
  if (ok) console.log(`  Cropped text: ${key}`);
}

await page.screenshot({ path: `${OUT}/s8-full.png`, fullPage: true });

await browser.close();
console.log(`\nAll screenshots saved to ${OUT}/`);
