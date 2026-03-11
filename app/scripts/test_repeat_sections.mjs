#!/usr/bin/env node
import { chromium } from 'playwright';
const BASE_URL = 'http://localhost:4001';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  try {
    await page.goto(`${BASE_URL}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.locator('button:has-text("Create Form")').click();
    await page.waitForURL(/\/[a-f0-9-]+\//, { timeout: 60000 });
    await page.waitForTimeout(2000);
    const id = page.url().match(/\/([a-f0-9-]+)\//)[1];

    // Check sections that showed 0 inputs (repeat group overview mode)
    const sections = [
      { name: 'S11 Residences', path: 'history/section11' },
      { name: 'S15 Military', path: 'military/section15' },
      { name: 'S17 Relationships', path: 'relationships/section17' },
      { name: 'S18 Relatives', path: 'relationships/section18' },
      { name: 'S24 Alcohol', path: 'substance/section24' },
      { name: 'S29 Associations', path: 'legal/section29' },
    ];

    for (const sec of sections) {
      await page.goto(`${BASE_URL}/${id}/${sec.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2500);

      const mainText = await page.locator('main').first().innerText().catch(() => '');
      const hasEditBtn = await page.locator('button:has-text("Edit")').count();
      const hasCards = mainText.includes('Entry') || mainText.includes('entry');
      const hasWizardSteps = await page.locator('[class*="step"]').count() > 0;
      const lines = mainText.split('\n').filter(l => l.trim().length > 5).slice(0, 8);

      console.log(`\n=== ${sec.name} ===`);
      console.log(`  Edit buttons: ${hasEditBtn}, Cards: ${hasCards}, Steps: ${hasWizardSteps}`);
      console.log(`  Content preview:`);
      for (const l of lines) console.log(`    ${l.trim().slice(0, 70)}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
  await browser.close();
}
main();
