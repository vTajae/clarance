#!/usr/bin/env node
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:4001';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  try {
    // Create form
    console.log('Creating form...');
    await page.goto(`${BASE_URL}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.locator('button:has-text("Create Form")').click();
    await page.waitForURL(/\/[a-f0-9-]+\//, { timeout: 60000 });
    await page.waitForTimeout(2000);
    const id = page.url().match(/\/([a-f0-9-]+)\//)[1];
    console.log('Form ID:', id);

    const sections = [
      { name: 'S9 Citizenship', path: 'citizenship/section9', expected: 'citizenship basis' },
      { name: 'S10 Dual Citizenship', path: 'citizenship/section10', expected: 'dual citizen|held' },
      { name: 'S11 Residences', path: 'history/section11', expected: 'residence|address' },
      { name: 'S12 Education', path: 'history/section12', expected: 'school|attended' },
      { name: 'S14 Selective Service', path: 'military/section14', expected: 'registered' },
      { name: 'S15 Military', path: 'military/section15', expected: 'served|military' },
      { name: 'S17 Relationships', path: 'relationships/section17', expected: 'marital|spouse' },
      { name: 'S18 Relatives', path: 'relationships/section18', expected: 'relative|mother|father' },
      { name: 'S19 Foreign Contacts', path: 'foreign/section19', expected: 'foreign' },
      { name: 'S20A Foreign Financial', path: 'foreign/section20A', expected: 'financial|foreign' },
      { name: 'S20C Foreign Travel', path: 'foreign/section20C', expected: 'traveled|travel' },
      { name: 'S22 Police Record', path: 'legal/section22', expected: 'police|EVER' },
      { name: 'S23 Drug Activity', path: 'substance/section23', expected: 'drug' },
      { name: 'S24 Alcohol', path: 'substance/section24', expected: 'alcohol|counseling' },
      { name: 'S25 Investigations', path: 'legal/section25', expected: 'investigat' },
      { name: 'S26 Finances', path: 'financial/section26', expected: 'delinquent|financial|bankrupt' },
      { name: 'S27 IT Access', path: 'legal/section27', expected: 'IT|accessed|modified' },
      { name: 'S28 Civil Court', path: 'legal/section28', expected: 'civil|court' },
      { name: 'S29 Associations', path: 'legal/section29', expected: 'terrorism|engaged' },
    ];

    console.log('\n' + 'Section'.padEnd(25) + 'Inputs'.padEnd(10) + 'First visible Q'.padEnd(60) + 'Match');
    console.log('-'.repeat(100));

    for (const sec of sections) {
      await page.goto(`${BASE_URL}/${id}/${sec.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2500);

      const inputs = await page.locator('input:visible, select:visible, textarea:visible').count();
      const mainText = await page.locator('main, [class*="content"]').first().innerText().catch(() => '');
      const lines = mainText.split('\n').filter(l => l.trim().length > 15);
      const firstQ = (lines[2] || lines[1] || lines[0] || '').trim();

      const re = new RegExp(sec.expected, 'i');
      const found = re.test(mainText);

      console.log(
        `${sec.name.padEnd(25)}${String(inputs).padEnd(10)}${firstQ.slice(0, 58).padEnd(60)}${found ? '✓' : '⚠'}`
      );
    }

    console.log('\n✓ = Expected content visible, ⚠ = Check manually');
    console.log('DONE');
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: '/tmp/gate_test_error.png', fullPage: true }).catch(() => {});
  }

  await browser.close();
}

main();
