import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const EMAIL = 'screenshot-test@example.com';
const PASSWORD = 'TestPassword123';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 2400 },
});
const page = await context.newPage();

// Login
await page.goto(`${BASE}/login`, { timeout: 120000, waitUntil: 'load' });
await page.waitForSelector('input#email', { timeout: 120000 });
await page.getByLabel('Email').fill(EMAIL);
await page.getByLabel('Password').fill(PASSWORD);
await page.getByRole('button', { name: 'Sign In' }).click();
await page.waitForURL((url) => !url.toString().includes('/login'), { timeout: 15000 });

// Create a submission
const resp = await page.request.post(`${BASE}/api/form/new`, {
  data: { pdfVersion: 'sf861' },
});
const { submissionId } = await resp.json();

// Navigate to section 1
await page.goto(`${BASE}/${submissionId}/identification/section1`, { timeout: 120000, waitUntil: 'load' });
await page.waitForSelector('h1', { timeout: 60000 });
await new Promise(r => setTimeout(r, 3000));

// Use JavaScript to click all collapsed group buttons and subsection chevrons
await page.evaluate(() => {
  // Expand all group headers
  document.querySelectorAll('nav[aria-label="Form sections"] > ul > li > button[aria-expanded="false"]')
    .forEach(btn => btn.click());
});
await new Promise(r => setTimeout(r, 500));

// Now expand subsection chevrons (they appear after groups expand)
await page.evaluate(() => {
  document.querySelectorAll('button[aria-label*="subsections"][aria-expanded="false"]')
    .forEach(btn => btn.click());
});
await new Promise(r => setTimeout(r, 500));

// Screenshot just the sidebar nav element
const sidebar = page.locator('nav[aria-label="Form sections"]').first();
const box = await sidebar.boundingBox();
if (box) {
  await page.screenshot({
    path: '/tmp/sidebar_full.png',
    clip: { x: 0, y: box.y, width: 280, height: box.height },
  });
  console.log(`Sidebar screenshot saved (${Math.round(box.height)}px tall)`);
} else {
  // Fallback: full page
  await page.screenshot({ path: '/tmp/sidebar_full.png', fullPage: true });
  console.log('Full page screenshot saved (sidebar not found)');
}

await browser.close();
console.log('Done!');
