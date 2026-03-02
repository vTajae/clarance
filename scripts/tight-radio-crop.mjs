#!/usr/bin/env node
/**
 * Tight crop of individual radio circles at 2x resolution
 * to check pixel-level alignment against PDF background.
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
const OUT = '/tmp/tight-crops';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

// Auth
const email = `tight-${Date.now()}@test.dev`;
const pw = 'tightCrop1234';
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

const PAD = 10;

async function cropRadios(sectionPath, prefix) {
  await page.goto(`${APP}/${subId}/${sectionPath}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
  await setup();

  // Get all radio elements
  const radioKeys = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-field-key*="radio"]'))
      .map(el => el.getAttribute('data-field-key'));
  });
  console.log(`  ${prefix}: ${radioKeys.length} radios`);

  // Crop each radio
  for (let i = 0; i < Math.min(radioKeys.length, 8); i++) {
    const key = radioKeys[i];
    const el = page.locator(`[data-field-key="${key}"]`).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const box = await el.boundingBox();
    if (!box) continue;

    await page.screenshot({
      path: `${OUT}/${prefix}-radio-${i}.png`,
      clip: {
        x: Math.max(0, box.x - PAD),
        y: Math.max(0, box.y - PAD),
        width: box.width + PAD * 2,
        height: box.height + PAD * 2,
      }
    });
    console.log(`    [${i}] ${key}: ${box.width.toFixed(1)}x${box.height.toFixed(1)}px at (${box.x.toFixed(1)}, ${box.y.toFixed(1)})`);
  }

  // Crop a row of 2-3 radios together for context
  if (radioKeys.length >= 2) {
    const boxes = [];
    for (let i = 0; i < Math.min(radioKeys.length, 3); i++) {
      const el = page.locator(`[data-field-key="${radioKeys[i]}"]`).first();
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      const box = await el.boundingBox();
      if (box) boxes.push(box);
    }
    if (boxes.length >= 2) {
      const minX = Math.min(...boxes.map(b => b.x));
      const minY = Math.min(...boxes.map(b => b.y));
      const maxX = Math.max(...boxes.map(b => b.x + b.width));
      const maxY = Math.max(...boxes.map(b => b.y + b.height));
      await page.screenshot({
        path: `${OUT}/${prefix}-radio-row.png`,
        clip: {
          x: Math.max(0, minX - 20),
          y: Math.max(0, minY - 15),
          width: maxX - minX + 40,
          height: maxY - minY + 30,
        }
      });
    }
  }

  // Also crop a few text fields for comparison
  const textKeys = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-field-key]:not([data-field-key*="radio"])'))
      .slice(0, 3)
      .map(el => el.getAttribute('data-field-key'));
  });
  for (let i = 0; i < textKeys.length; i++) {
    const el = page.locator(`[data-field-key="${textKeys[i]}"]`).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const box = await el.boundingBox();
    if (!box) continue;
    await page.screenshot({
      path: `${OUT}/${prefix}-text-${i}.png`,
      clip: {
        x: Math.max(0, box.x - PAD),
        y: Math.max(0, box.y - PAD),
        width: box.width + PAD * 2,
        height: box.height + PAD * 2,
      }
    });
    console.log(`    text[${i}] ${textKeys[i]}: ${box.width.toFixed(1)}x${box.height.toFixed(1)}px`);
  }

  // Also crop checkboxes for comparison
  const checkKeys = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-field-key]'))
      .filter(el => {
        const s = el.getAttribute('style') || '';
        // Checkboxes tend to be small square (9x9)
        const wm = s.match(/width:\s*([\d.]+)px/);
        const hm = s.match(/height:\s*([\d.]+)px/);
        if (wm && hm) {
          const w = parseFloat(wm[1]);
          const h = parseFloat(hm[1]);
          return w < 15 && h < 15 && !el.getAttribute('data-field-key').includes('radio');
        }
        return false;
      })
      .slice(0, 3)
      .map(el => el.getAttribute('data-field-key'));
  });
  for (let i = 0; i < checkKeys.length; i++) {
    const el = page.locator(`[data-field-key="${checkKeys[i]}"]`).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const box = await el.boundingBox();
    if (!box) continue;
    await page.screenshot({
      path: `${OUT}/${prefix}-check-${i}.png`,
      clip: {
        x: Math.max(0, box.x - PAD),
        y: Math.max(0, box.y - PAD),
        width: box.width + PAD * 2,
        height: box.height + PAD * 2,
      }
    });
    console.log(`    check[${i}] ${checkKeys[i]}: ${box.width.toFixed(1)}x${box.height.toFixed(1)}px`);
  }
}

// Run for key sections
console.log('\n=== Section 9 ===');
await cropRadios('citizenship/section9', 's9');

console.log('\n=== Section 8 ===');
await cropRadios('citizenship/section8', 's8');

console.log('\n=== Section 10 ===');
await cropRadios('citizenship/section10', 's10');

// Section 1 — SSN bottom
console.log('\n=== Section 1 (SSN bottom) ===');
await page.goto(`${APP}/${subId}/identification/section1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setup();

// SSN field
const ssnKeys = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('[data-field-key]'))
    .filter(el => (el.getAttribute('data-field-key') || '').includes('yourSocialSecurity'))
    .map(el => el.getAttribute('data-field-key'));
});
console.log(`  SSN fields: ${ssnKeys.length}`);
for (const key of ssnKeys) {
  const el = page.locator(`[data-field-key="${key}"]`).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await el.boundingBox();
  if (!box) continue;
  // Wider crop for SSN (80px padding)
  await page.screenshot({
    path: `${OUT}/s1-ssn.png`,
    clip: {
      x: Math.max(0, box.x - 80),
      y: Math.max(0, box.y - 40),
      width: box.width + 160,
      height: box.height + 80,
    }
  });
  console.log(`  ${key}: ${box.width.toFixed(1)}x${box.height.toFixed(1)}px at (${box.x.toFixed(1)}, ${box.y.toFixed(1)})`);
}

await browser.close();
console.log(`\nScreenshots saved to ${OUT}/`);
