#!/usr/bin/env node
/**
 * Visual alignment check: takes zoomed-in screenshots of radio circles and
 * SSN page-bottom fields against the PDF background to verify alignment.
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
const OUT = '/tmp/visual-align';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
// Use a larger viewport for better detail
const ctx = await browser.newContext({ viewport: { width: 1800, height: 1200 } });
const page = await ctx.newPage();

// Auth
const email = `vis-${Date.now()}@test.dev`;
const pw = 'visualCheck123';
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

// Helper: setup PDF Layout + wait for background images to load
async function setupPdfLayoutAndWait() {
  // Switch to PDF Layout mode
  const pdfBtn = page.locator('button:has-text("PDF Layout")');
  if (await pdfBtn.count() > 0) {
    await pdfBtn.click();
    await page.waitForTimeout(2000);
  }

  // Set opacity to 100%
  await page.evaluate(() => {
    const s = document.querySelector('input[type="range"]');
    if (s) {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, '100');
      s.dispatchEvent(new Event('input', { bubbles: true }));
      s.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Enable "Show All" + "Show fields"
  const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
  if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
  const sf = page.locator('label:has-text("Show fields") input[type="checkbox"]');
  if (await sf.count() > 0 && !(await sf.isChecked())) await sf.check();

  // Wait for PDF background images to load
  await page.waitForTimeout(2000);
  const loaded = await page.evaluate(() => {
    const imgs = document.querySelectorAll('.relative.shadow-md img');
    let allLoaded = true;
    for (const img of imgs) {
      if (!img.complete || img.naturalWidth === 0) allLoaded = false;
    }
    return { total: imgs.length, allLoaded };
  });
  console.log(`  PDF images: ${loaded.total} total, allLoaded=${loaded.allLoaded}`);

  // Wait longer if images aren't loaded
  if (!loaded.allLoaded) {
    await page.waitForTimeout(5000);
  }
  await page.waitForTimeout(1000);
}

// Helper: scroll to page N and take a cropped screenshot of a specific region
async function screenshotPageRegion(pageNum, regionPdfX, regionPdfY, regionW, regionH, filename) {
  // Scroll to the page header
  await page.evaluate((pn) => {
    const headers = document.querySelectorAll('span.text-xs.font-mono');
    for (const h of headers) {
      if (h.textContent?.includes(`Page ${pn}`)) {
        h.scrollIntoView({ behavior: 'instant', block: 'start' });
        break;
      }
    }
  }, pageNum);
  await page.waitForTimeout(500);

  // Get the page frame's bounding box
  const frameBox = await page.evaluate((pn) => {
    const headers = document.querySelectorAll('span.text-xs.font-mono');
    for (const h of headers) {
      if (h.textContent?.includes(`Page ${pn}`)) {
        // The frame is the next sibling with class .relative.shadow-md
        const parent = h.closest('div')?.parentElement;
        if (!parent) continue;
        const frame = parent.querySelector('.relative.shadow-md');
        if (frame) {
          const box = frame.getBoundingClientRect();
          return { x: box.x, y: box.y, w: box.width, h: box.height };
        }
      }
    }
    return null;
  }, pageNum);

  if (!frameBox) {
    console.log(`  Could not find frame for page ${pageNum}`);
    return;
  }

  const scale = frameBox.w / 612; // scale factor

  // Compute the clip region in screen coordinates
  const clipX = Math.max(0, frameBox.x + regionPdfX * scale - 10);
  const clipY = Math.max(0, frameBox.y + regionPdfY * scale - 10);
  const clipW = regionW * scale + 20;
  const clipH = regionH * scale + 20;

  await page.screenshot({
    path: `${OUT}/${filename}`,
    clip: { x: clipX, y: clipY, width: clipW, height: clipH },
  });
  console.log(`  Screenshot: ${filename} (page ${pageNum}, region ${regionPdfX},${regionPdfY} ${regionW}x${regionH})`);
}

// ================================================================
// TEST 1: Section 9 — Citizenship Status radios (page 7)
// ================================================================
console.log('\n=== Section 9 — Citizenship radios ===');
await page.goto(`${APP}/${subId}/citizenship/section9`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayoutAndWait();

// Page 7 has radios for citizenship status
// Get actual radio positions from the DOM
const s9RadioInfo = await page.evaluate(() => {
  const els = document.querySelectorAll('[data-field-key*="radio"]');
  if (els.length === 0) return [];
  return Array.from(els).map(el => {
    const box = el.getBoundingClientRect();
    const style = el.getAttribute('style') || '';
    return {
      key: el.getAttribute('data-field-key'),
      screenX: box.x, screenY: box.y,
      screenW: box.width, screenH: box.height,
      cssLeft: parseFloat(style.match(/left:\s*([\d.]+)px/)?.[1] || '0'),
      cssTop: parseFloat(style.match(/top:\s*([\d.]+)px/)?.[1] || '0'),
    };
  });
});
console.log(`  Radios found: ${s9RadioInfo.length}`);

// Take full-page screenshots for each PDF page
await page.screenshot({ path: `${OUT}/s9-full.png`, fullPage: true });

// Take zoomed views of radio areas
if (s9RadioInfo.length > 0) {
  // Get the min/max Y of radio widgets to know which page they're on
  const firstRadio = s9RadioInfo[0];
  const lastRadio = s9RadioInfo[s9RadioInfo.length - 1];
  console.log(`  First radio: key=${firstRadio.key} cssLeft=${firstRadio.cssLeft} cssTop=${firstRadio.cssTop}`);
  console.log(`  Last radio: key=${lastRadio.key} cssLeft=${lastRadio.cssLeft} cssTop=${lastRadio.cssTop}`);

  // Screenshot a region around the first cluster of radios
  // Radios are typically around y=450-600 on their pages
  for (let pageNum = 1; pageNum <= 2; pageNum++) {
    const pageHeader = `Page ${pageNum}`;
    const exists = await page.evaluate((ph) => {
      const headers = document.querySelectorAll('span.text-xs.font-mono');
      return Array.from(headers).some(h => h.textContent?.includes(ph));
    }, pageHeader);

    if (exists) {
      // Full page screenshot
      await screenshotPageRegion(pageNum, 0, 0, 612, 792, `s9-page${pageNum}-full.png`);

      // Radio region (typical area: x=40-150, y=400-700)
      await screenshotPageRegion(pageNum, 30, 350, 200, 300, `s9-page${pageNum}-radio-zone.png`);
    }
  }
}

// ================================================================
// TEST 2: Section 10 — Dual Citizenship radios (pages 8-9)
// ================================================================
console.log('\n=== Section 10 — Dual Citizenship radios ===');
await page.goto(`${APP}/${subId}/citizenship/section10`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayoutAndWait();

await page.screenshot({ path: `${OUT}/s10-full.png`, fullPage: true });

// Crop page 1 (page 8 in PDF) radio area
await screenshotPageRegion(1, 30, 100, 300, 500, `s10-page1-radios.png`);
await screenshotPageRegion(1, 0, 0, 612, 792, `s10-page1-full.png`);

// ================================================================
// TEST 3: Section 1 — SSN bottom-of-page fields
// ================================================================
console.log('\n=== Section 1 — SSN bottom fields ===');
await page.goto(`${APP}/${subId}/identification/section1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayoutAndWait();

await page.screenshot({ path: `${OUT}/s1-full.png`, fullPage: true });

// SSN fields are at y=739, on page 5 (first page of section 1)
// Screenshot the bottom portion of page 1 where SSN would be
await screenshotPageRegion(1, 0, 680, 612, 112, `s1-page1-bottom-ssn.png`);
await screenshotPageRegion(1, 0, 0, 612, 792, `s1-page1-full.png`);

// ================================================================
// TEST 4: Section 8 — U.S. Passport (wait longer for PDF images)
// ================================================================
console.log('\n=== Section 8 — U.S. Passport radios ===');
await page.goto(`${APP}/${subId}/citizenship/section8`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000); // Wait longer for initial compile
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayoutAndWait();

// Wait extra for background images
await page.waitForTimeout(5000);
await page.screenshot({ path: `${OUT}/s8-full.png`, fullPage: true });
await screenshotPageRegion(1, 0, 0, 612, 792, `s8-page1-full.png`);
await screenshotPageRegion(1, 20, 400, 300, 300, `s8-page1-radio-zone.png`);

await browser.close();
console.log(`\nAll screenshots saved to ${OUT}/`);
