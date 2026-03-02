#!/usr/bin/env node
/**
 * Alignment diagnosis script — measures radio and SSN field positions
 * against expected PDF coordinates in live PDF Layout mode.
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const APP_URL = 'http://localhost:3000';
const registry = JSON.parse(readFileSync(join(appDir, 'src/lib/field-registry/field-registry.json'), 'utf8'));

// PDF constants matching the renderer
const PDF_WIDTH = 612;
const PDF_HEIGHT = 792;

async function run() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  const page = await ctx.newPage();

  // Register + login
  const email = `align-diag-${Date.now()}@test.dev`;
  await fetch(`${APP_URL}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'testPass123' }),
  });

  await page.goto(`${APP_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.fill('input#email', email);
  await page.fill('input#password', 'testPass123');
  await page.click('button[type="submit"]');
  for (let i = 0; i < 20; i++) { await page.waitForTimeout(500); if (!page.url().includes('/login')) break; }

  // Create form
  await page.goto(`${APP_URL}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.click('button:has-text("Create Form")');
  for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (page.url().includes('/identification/section1')) break; }
  const subId = page.url().split('/')[3];
  console.log('Form:', subId);

  // Helper: setup PDF Layout mode
  async function setupPdfLayout() {
    const pdfBtn = await page.$('button:has-text("PDF Layout")');
    if (pdfBtn) { await pdfBtn.click(); await page.waitForTimeout(2000); }

    // Opacity 100%
    await page.evaluate(() => {
      const s = document.querySelector('input[type="range"]');
      if (s) {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, '100');
        s.dispatchEvent(new Event('input', { bubbles: true }));
        s.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    const sa = await page.$('label:has-text("Show All") input[type="checkbox"]');
    if (sa && !(await sa.isChecked())) { await sa.check(); await page.waitForTimeout(500); }
    const sf = await page.$('label:has-text("Show fields") input[type="checkbox"]');
    if (sf && !(await sf.isChecked())) { await sf.check(); await page.waitForTimeout(500); }

    await page.waitForTimeout(500);
  }

  // ================================================================
  // TEST 1: RADIO ALIGNMENT (section8 - has radios on page 7)
  // ================================================================
  console.log('\n=== RADIO ALIGNMENT DIAGNOSIS (section8) ===');

  await page.goto(`${APP_URL}/${subId}/citizenship/section8`, {
    waitUntil: 'domcontentloaded', timeout: 60000,
  });
  await page.waitForTimeout(3000);
  await setupPdfLayout();

  // Get page frame's actual rendered dimensions and position
  const pageFrameInfo = await page.evaluate(() => {
    const frames = document.querySelectorAll('.relative.shadow-md');
    const results = [];
    for (const f of frames) {
      const box = f.getBoundingClientRect();
      results.push({ x: box.x, y: box.y, w: box.width, h: box.height });
    }
    return results;
  });

  if (pageFrameInfo.length > 0) {
    const frame = pageFrameInfo[0];
    const actualScale = frame.w / PDF_WIDTH;
    console.log(`Page frame: ${frame.w.toFixed(1)}x${frame.h.toFixed(1)} at (${frame.x.toFixed(1)}, ${frame.y.toFixed(1)})`);
    console.log(`Actual scale: ${actualScale.toFixed(4)} (expected: 1.0)`);
    console.log(`Page height at scale: ${(PDF_HEIGHT * actualScale).toFixed(1)} vs rendered: ${frame.h.toFixed(1)}`);
  }

  // Get all radio widget positions from the DOM
  const radioWidgets = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-field-key*="radio"]');
    const results = [];
    for (const el of elements) {
      const box = el.getBoundingClientRect();
      const style = el.getAttribute('style') || '';
      results.push({
        key: el.getAttribute('data-field-key'),
        screenX: box.x, screenY: box.y, screenW: box.width, screenH: box.height,
        style,
      });
    }
    return results;
  });

  console.log(`\nRadio widgets in DOM: ${radioWidgets.length}`);

  // Find the parent page frame for each radio to compute offset
  for (const w of radioWidgets.slice(0, 8)) {
    // Parse style to get CSS left/top (these are in scaled PDF coords)
    const leftMatch = w.style.match(/left:\s*([\d.]+)px/);
    const topMatch = w.style.match(/top:\s*([\d.]+)px/);
    const widthMatch = w.style.match(/width:\s*([\d.]+)px/);
    const heightMatch = w.style.match(/height:\s*([\d.]+)px/);

    const cssLeft = leftMatch ? parseFloat(leftMatch[1]) : null;
    const cssTop = topMatch ? parseFloat(topMatch[1]) : null;
    const cssW = widthMatch ? parseFloat(widthMatch[1]) : null;
    const cssH = heightMatch ? parseFloat(heightMatch[1]) : null;

    // Find registry entry
    const baseKey = w.key.replace(/-radio-\d+$/, '');
    const radioIdx = parseInt(w.key.match(/-radio-(\d+)$/)?.[1] || '0');
    const regField = registry.find(f => f.semanticKey === baseKey);
    const regWidget = regField?.radioWidgets?.[radioIdx];

    console.log(`\n  ${w.key}:`);
    if (regWidget) {
      console.log(`    Registry: x=${regWidget.x.toFixed(1)} y=${regWidget.y.toFixed(1)} w=${regWidget.width.toFixed(1)} h=${regWidget.height.toFixed(1)}`);
    }
    console.log(`    CSS:      left=${cssLeft?.toFixed(1)} top=${cssTop?.toFixed(1)} w=${cssW?.toFixed(1)} h=${cssH?.toFixed(1)}`);
    console.log(`    Screen:   x=${w.screenX.toFixed(1)} y=${w.screenY.toFixed(1)} w=${w.screenW.toFixed(1)} h=${w.screenH.toFixed(1)}`);

    if (regWidget && cssLeft !== null) {
      const xDiff = cssLeft - regWidget.x;
      const yDiff = cssTop - regWidget.y;
      console.log(`    OFFSET:   dx=${xDiff.toFixed(2)}px  dy=${yDiff.toFixed(2)}px`);
    }
  }

  // Take screenshot of radio area
  await page.evaluate(() => {
    const headers = document.querySelectorAll('span.text-xs.font-mono');
    for (const h of headers) {
      if (h.textContent?.includes('Page 7')) {
        h.scrollIntoView({ behavior: 'instant', block: 'start' });
        break;
      }
    }
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/diag-section8-radios.png' });
  console.log('\nScreenshot saved: /tmp/diag-section8-radios.png');

  // ================================================================
  // TEST 2: SSN PAGE HEADER ALIGNMENT (section1 - page 5 bottom)
  // ================================================================
  console.log('\n\n=== SSN PAGE HEADER ALIGNMENT DIAGNOSIS (section1) ===');

  await page.goto(`${APP_URL}/${subId}/identification/section1`, {
    waitUntil: 'domcontentloaded', timeout: 60000,
  });
  await page.waitForTimeout(3000);
  await setupPdfLayout();

  // Get page frame dimensions
  const s1PageInfo = await page.evaluate(() => {
    const frame = document.querySelector('.relative.shadow-md');
    if (!frame) return null;
    const box = frame.getBoundingClientRect();
    return { x: box.x, y: box.y, w: box.width, h: box.height };
  });

  if (s1PageInfo) {
    console.log(`Page frame: ${s1PageInfo.w.toFixed(1)}x${s1PageInfo.h.toFixed(1)}`);
    console.log(`Scale: ${(s1PageInfo.w / PDF_WIDTH).toFixed(4)}`);
    console.log(`Expected bottom of page: ${s1PageInfo.h.toFixed(1)}px`);

    // SSN fields are at y=739, height=13.67
    // At scale=1.0: top=739, bottom=752.67
    // Page height at scale=1.0: 792
    const ssnTop = 739 * (s1PageInfo.w / PDF_WIDTH);
    const ssnBottom = (739 + 13.67) * (s1PageInfo.w / PDF_WIDTH);
    console.log(`SSN field expected: top=${ssnTop.toFixed(1)} bottom=${ssnBottom.toFixed(1)} (page bottom at ${s1PageInfo.h.toFixed(1)})`);
  }

  // Get SSN fields from DOM
  const ssnDomFields = await page.evaluate(() => {
    const all = document.querySelectorAll('[data-field-key]');
    const results = [];
    for (const el of all) {
      const key = el.getAttribute('data-field-key');
      if (key?.includes('yourSocialSecurity') || key?.includes('Autofill') || key?.includes('autofill')) {
        const box = el.getBoundingClientRect();
        results.push({
          key,
          style: el.getAttribute('style') || '',
          screenX: box.x, screenY: box.y, screenW: box.width, screenH: box.height,
        });
      }
    }
    return results;
  });

  console.log(`\nSSN header fields in DOM: ${ssnDomFields.length}`);
  for (const f of ssnDomFields.slice(0, 5)) {
    const topMatch = f.style.match(/top:\s*([\d.]+)px/);
    const cssTop = topMatch ? parseFloat(topMatch[1]) : null;
    console.log(`  ${f.key}: cssTop=${cssTop?.toFixed(1)} screenY=${f.screenY.toFixed(1)} h=${f.screenH.toFixed(1)}`);
  }

  // Scroll to bottom of page to see SSN area
  await page.evaluate(() => {
    const frame = document.querySelector('.relative.shadow-md');
    if (frame) {
      const box = frame.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + box.bottom - 100);
    }
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/diag-section1-ssn-bottom.png' });
  console.log('Screenshot saved: /tmp/diag-section1-ssn-bottom.png');

  // ================================================================
  // TEST 3: Compare PyMuPDF widget coordinates with registry
  // ================================================================
  console.log('\n\n=== PyMuPDF vs REGISTRY COORDINATE COMPARISON ===');

  // Check a few radio fields against what PyMuPDF reports
  try {
    const resp = await fetch('http://localhost:8001/extract-widget-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_path: 'sf861.pdf', field_names: [
        'form1[0].Sections7-9[0].RadioButtonList[0]',
        'form1[0].Sections1-6[0].#field[0]',
        'form1[0].Sections1-6[0].#field[1]',
      ]}),
    });
    if (resp.ok) {
      const data = await resp.json();
      console.log('PyMuPDF widget info:', JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.log('(extract-widget-info endpoint not available — using registry data)');
  }

  // Direct comparison: extract ALL radio widget rects from PyMuPDF
  console.log('\nComparing registry radioWidgets with PyMuPDF rects...');
  try {
    const resp = await fetch('http://localhost:8001/debug-radio-rects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_path: 'sf861.pdf' }),
    });
    if (resp.ok) {
      const data = await resp.json();
      console.log('PyMuPDF radio rects:', JSON.stringify(data).slice(0, 500));
    }
  } catch (e) {
    console.log('(debug-radio-rects endpoint not available)');
  }

  // ================================================================
  // TEST 4: Extract actual widget rects from Python for comparison
  // ================================================================
  console.log('\n\n=== DIRECT PYMUPDF WIDGET RECT EXTRACTION ===');

  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });
