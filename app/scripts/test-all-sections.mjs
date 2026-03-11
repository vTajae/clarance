/**
 * Comprehensive UI test: Navigate all 39 sections, verify wizard renders,
 * test field interactions for every field type.
 *
 * Usage: node scripts/test-all-sections.mjs
 * Requires: dev server on port 3000, DB + PDF service running
 */
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const BASE = 'http://localhost:3000';
const EMAIL = 'ui-test@example.com';
const PASSWORD = 'TestPassword123';

// Section → group mapping (mirrors SECTION_GROUPS from types.ts)
const SECTION_GROUPS = {
  identification: ['section1','section2','section3','section4','section5','section6','section7'],
  citizenship: ['section8','section9','section10'],
  history: ['section11','section12','section13A','section13B','section13C'],
  military: ['section14','section15'],
  relationships: ['section16','section17','section18'],
  foreign: ['section19','section20A','section20B','section20C'],
  financial: ['section26'],
  substance: ['section23','section24'],
  legal: ['section22','section25','section28'],
  psychological: ['section21','section21A','section21B','section21C','section21D','section21E'],
  review: ['section27','section29','section30'],
};

// Load field registry for validation
const registryPath = new URL('../src/lib/field-registry/field-registry.json', import.meta.url);
const registry = JSON.parse(readFileSync(registryPath, 'utf-8'));

// Build section → fields index
const sectionFields = {};
for (const field of registry) {
  if (field.section === 'ssnPageHeader') continue;
  if (!sectionFields[field.section]) sectionFields[field.section] = [];
  sectionFields[field.section].push(field);
}

// Results tracking
const results = {
  totalSections: 0,
  passedSections: 0,
  failedSections: 0,
  sectionResults: [],
  fieldTypesTestedGlobal: new Set(),
  totalFieldsVerified: 0,
  totalFieldsFailed: 0,
  errors: [],
};

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // 1. Register + Login
  console.log('=== Setting up authentication ===');
  try {
    await page.request.post(`${BASE}/api/auth/register`, {
      data: { email: EMAIL, password: PASSWORD },
    });
  } catch {}

  await page.goto(`${BASE}/login`, { timeout: 120000, waitUntil: 'load' });
  await page.waitForSelector('input#email', { timeout: 120000 });
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL((url) => !url.toString().includes('/login'), { timeout: 30000 });
  console.log('Logged in successfully\n');

  // 2. Create submission
  console.log('=== Creating submission ===');
  const createResp = await page.request.post(`${BASE}/api/form/new`, {
    data: { pdfVersion: 'sf861' },
  });
  const { submissionId } = await createResp.json();
  console.log(`Submission: ${submissionId}\n`);

  // 3. Test each section
  console.log('=== Testing all sections ===\n');

  for (const [group, sections] of Object.entries(SECTION_GROUPS)) {
    console.log(`--- Group: ${group} (${sections.length} sections) ---`);

    for (const section of sections) {
      results.totalSections++;
      const sectionResult = {
        section,
        group,
        status: 'pending',
        fieldsExpected: (sectionFields[section] || []).length,
        fieldsRendered: 0,
        fieldTypesFound: [],
        wizardSteps: 0,
        errors: [],
        interactionTests: [],
      };

      try {
        const url = `${BASE}/${submissionId}/${group}/${section}`;
        await page.goto(url, { timeout: 120000, waitUntil: 'load' });

        // Wait for the page to render — look for the section heading or wizard card
        await page.waitForSelector('h1', { timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));

        // Verify URL didn't redirect away
        if (!page.url().includes(section)) {
          sectionResult.errors.push(`Redirected to ${page.url()}`);
          sectionResult.status = 'failed';
          results.failedSections++;
          results.sectionResults.push(sectionResult);
          console.log(`  ${section}: FAILED (redirected to ${page.url()})`);
          continue;
        }

        // Check for section title
        const h1Text = await page.locator('h1').first().textContent().catch(() => '');
        if (!h1Text) {
          sectionResult.errors.push('No h1 heading found');
        }

        // Check wizard step indicator exists
        const stepIndicator = await page.locator('[role="navigation"][aria-label*="step"], .flex.items-center.justify-center.gap-1').count();

        // Count wizard steps (dots or progress bar)
        const stepDots = await page.locator('button[aria-label*="Step"], button[aria-label*="step"]').count();
        sectionResult.wizardSteps = stepDots || 1;

        // Count form fields rendered on the current step
        const fieldCounts = await page.evaluate(() => {
          const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
          const textareas = document.querySelectorAll('textarea');
          const selects = document.querySelectorAll('select');
          const checkboxes = document.querySelectorAll('input[type="checkbox"]');
          const radios = document.querySelectorAll('input[type="radio"]');

          return {
            text: inputs.length,
            textarea: textareas.length,
            select: selects.length,
            checkbox: checkboxes.length,
            radio: radios.length,
            total: inputs.length + textareas.length + selects.length + checkboxes.length + radios.length,
          };
        });

        sectionResult.fieldsRendered = fieldCounts.total;

        // Track field types found
        if (fieldCounts.text > 0) sectionResult.fieldTypesFound.push(`text:${fieldCounts.text}`);
        if (fieldCounts.textarea > 0) sectionResult.fieldTypesFound.push(`textarea:${fieldCounts.textarea}`);
        if (fieldCounts.select > 0) sectionResult.fieldTypesFound.push(`select:${fieldCounts.select}`);
        if (fieldCounts.checkbox > 0) sectionResult.fieldTypesFound.push(`checkbox:${fieldCounts.checkbox}`);
        if (fieldCounts.radio > 0) sectionResult.fieldTypesFound.push(`radio:${fieldCounts.radio}`);

        // --- Test field interactions on current step ---

        // Test text input
        if (fieldCounts.text > 0) {
          try {
            const firstInput = page.locator('input[type="text"]').first();
            await firstInput.scrollIntoViewIfNeeded();
            await firstInput.fill('Test Value 123');
            const val = await firstInput.inputValue();
            const pass = val.length > 0;
            sectionResult.interactionTests.push({ type: 'text-input', pass });
            if (pass) results.fieldTypesTestedGlobal.add('text');
          } catch (e) {
            sectionResult.interactionTests.push({ type: 'text-input', pass: false, error: e.message });
          }
        }

        // Test select dropdown
        if (fieldCounts.select > 0) {
          try {
            const firstSelect = page.locator('select').first();
            await firstSelect.scrollIntoViewIfNeeded();
            const options = await firstSelect.locator('option').allTextContents();
            const hasOptions = options.length > 1; // more than just placeholder
            sectionResult.interactionTests.push({ type: 'select', pass: hasOptions, optionCount: options.length });
            if (hasOptions) results.fieldTypesTestedGlobal.add('select');
          } catch (e) {
            sectionResult.interactionTests.push({ type: 'select', pass: false, error: e.message });
          }
        }

        // Test checkbox
        if (fieldCounts.checkbox > 0) {
          try {
            const firstCb = page.locator('input[type="checkbox"]').first();
            await firstCb.scrollIntoViewIfNeeded();
            const wasBefore = await firstCb.isChecked();
            await firstCb.check({ force: true });
            const isChecked = await firstCb.isChecked();
            // Uncheck it (restore state)
            if (!wasBefore) await firstCb.uncheck({ force: true });
            sectionResult.interactionTests.push({ type: 'checkbox', pass: isChecked });
            if (isChecked) results.fieldTypesTestedGlobal.add('checkbox');
          } catch (e) {
            sectionResult.interactionTests.push({ type: 'checkbox', pass: false, error: e.message });
          }
        }

        // Test radio
        if (fieldCounts.radio > 0) {
          try {
            const firstRadio = page.locator('input[type="radio"]').first();
            await firstRadio.scrollIntoViewIfNeeded();
            await firstRadio.check({ force: true });
            const isChecked = await firstRadio.isChecked();
            sectionResult.interactionTests.push({ type: 'radio', pass: isChecked });
            if (isChecked) results.fieldTypesTestedGlobal.add('radio');
          } catch (e) {
            sectionResult.interactionTests.push({ type: 'radio', pass: false, error: e.message });
          }
        }

        // Test textarea
        if (fieldCounts.textarea > 0) {
          try {
            const firstTA = page.locator('textarea').first();
            await firstTA.scrollIntoViewIfNeeded();
            await firstTA.fill('Test textarea content');
            const val = await firstTA.inputValue();
            sectionResult.interactionTests.push({ type: 'textarea', pass: val.length > 0 });
            if (val.length > 0) results.fieldTypesTestedGlobal.add('textarea');
          } catch (e) {
            sectionResult.interactionTests.push({ type: 'textarea', pass: false, error: e.message });
          }
        }

        // --- Navigate through wizard steps ---
        let stepsNavigated = 1;
        const maxStepsToTry = 20; // safety cap
        for (let i = 0; i < maxStepsToTry; i++) {
          // Check if "Next" or "Review" button exists and is enabled
          const nextBtn = page.locator('button:has-text("Next"), button:has-text("Review")').first();
          const isVisible = await nextBtn.isVisible().catch(() => false);
          if (!isVisible) break;

          const isDisabled = await nextBtn.isDisabled().catch(() => true);
          if (isDisabled) break;

          // Only click if it's a step-level next (not section-level)
          const btnText = await nextBtn.textContent().catch(() => '');
          if (btnText?.includes('Next Section') || btnText?.includes('Submit')) break;

          await nextBtn.click();
          await new Promise(r => setTimeout(r, 1000));
          stepsNavigated++;

          // Count fields on new step
          const newCounts = await page.evaluate(() => {
            const all = document.querySelectorAll(
              'input[type="text"], input[type="email"], input[type="tel"], textarea, select, input[type="checkbox"], input[type="radio"]'
            );
            return all.length;
          });
          sectionResult.fieldsRendered += newCounts;
        }
        sectionResult.wizardSteps = stepsNavigated;

        // Determine pass/fail
        if (sectionResult.fieldsRendered > 0 || sectionResult.fieldsExpected === 0) {
          sectionResult.status = 'passed';
          results.passedSections++;
          results.totalFieldsVerified += sectionResult.fieldsRendered;
        } else {
          sectionResult.status = 'failed';
          sectionResult.errors.push('No fields rendered');
          results.failedSections++;
          results.totalFieldsFailed += sectionResult.fieldsExpected;
        }

        const interactions = sectionResult.interactionTests
          .map(t => `${t.type}:${t.pass ? 'OK' : 'FAIL'}`)
          .join(', ');
        console.log(
          `  ${section}: ${sectionResult.status.toUpperCase()} ` +
          `(${sectionResult.fieldsRendered} fields rendered across ${sectionResult.wizardSteps} steps, ` +
          `expected ${sectionResult.fieldsExpected} total) ` +
          `[${sectionResult.fieldTypesFound.join(', ')}] ` +
          `{${interactions || 'no interactions'}}`
        );

        // Take screenshot for failed sections
        if (sectionResult.status === 'failed') {
          await page.screenshot({ path: `/tmp/test-fail-${section}.png`, fullPage: true });
        }

      } catch (err) {
        sectionResult.status = 'failed';
        sectionResult.errors.push(err.message);
        results.failedSections++;
        results.errors.push({ section, error: err.message });
        console.log(`  ${section}: ERROR — ${err.message}`);
        await page.screenshot({ path: `/tmp/test-error-${section}.png`, fullPage: true }).catch(() => {});
      }

      results.sectionResults.push(sectionResult);
    }
    console.log();
  }

  // 4. Verify Jotai store access
  console.log('=== Verifying Jotai Store Access ===');
  // Navigate to a simple section first
  await page.goto(`${BASE}/${submissionId}/identification/section1`, { timeout: 120000, waitUntil: 'load' });
  await page.waitForSelector('h1', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  const jotaiCheck = await page.evaluate(() => {
    const store = window.__JOTAI_STORE__;
    const family = window.__FIELD_VALUE_ATOM_FAMILY__;
    return {
      storeExists: !!store,
      familyExists: !!family,
      canReadAtom: false,
    };
  });

  if (jotaiCheck.storeExists && jotaiCheck.familyExists) {
    // Try reading an atom
    const canRead = await page.evaluate(() => {
      try {
        const store = window.__JOTAI_STORE__;
        const family = window.__FIELD_VALUE_ATOM_FAMILY__;
        const atom = family('personalInfo.lastName');
        const val = store.get(atom);
        return val !== undefined; // null or string is OK
      } catch {
        return false;
      }
    });
    jotaiCheck.canReadAtom = canRead;
  }

  console.log(`  Jotai store: ${jotaiCheck.storeExists ? 'OK' : 'MISSING'}`);
  console.log(`  Atom family: ${jotaiCheck.familyExists ? 'OK' : 'MISSING'}`);
  console.log(`  Can read atom: ${jotaiCheck.canReadAtom ? 'OK' : 'NO'}`);

  // 5. Test PDF mode toggle
  console.log('\n=== Testing PDF Mode Toggle ===');
  const pdfToggle = page.locator('button:has-text("PDF")');
  const pdfToggleVisible = await pdfToggle.isVisible().catch(() => false);
  if (pdfToggleVisible) {
    await pdfToggle.click();
    await new Promise(r => setTimeout(r, 2000));
    const hasPdfContent = await page.locator('[role="progressbar"], img[alt*="PDF"], canvas').count();
    console.log(`  PDF toggle: ${pdfToggleVisible ? 'OK' : 'MISSING'}`);
    console.log(`  PDF content rendered: ${hasPdfContent > 0 ? 'YES' : 'NO'}`);

    // Switch back to wizard
    const wizardToggle = page.locator('button:has-text("Wizard")');
    await wizardToggle.click().catch(() => {});
    await new Promise(r => setTimeout(r, 1000));
  } else {
    console.log('  PDF toggle: NOT FOUND');
  }

  // 6. Summary
  console.log('\n' + '='.repeat(60));
  console.log('FINAL RESULTS');
  console.log('='.repeat(60));
  console.log(`Sections tested:  ${results.totalSections}`);
  console.log(`Sections passed:  ${results.passedSections}`);
  console.log(`Sections failed:  ${results.failedSections}`);
  console.log(`Total fields rendered across wizard steps: ${results.totalFieldsVerified}`);
  console.log(`Field types interacted: ${[...results.fieldTypesTestedGlobal].join(', ')}`);
  console.log(`Console errors: ${consoleErrors.length}`);

  if (results.failedSections > 0) {
    console.log('\nFailed sections:');
    for (const s of results.sectionResults.filter(r => r.status === 'failed')) {
      console.log(`  ${s.section}: ${s.errors.join(', ')}`);
    }
  }

  if (consoleErrors.length > 0 && consoleErrors.length <= 20) {
    console.log('\nConsole errors (sample):');
    for (const err of consoleErrors.slice(0, 10)) {
      console.log(`  ${err.substring(0, 200)}`);
    }
  }

  const allPassed = results.failedSections === 0;
  console.log(`\n${allPassed ? 'ALL SECTIONS PASSED' : 'SOME SECTIONS FAILED'}`);

  // Write detailed report
  const report = {
    timestamp: new Date().toISOString(),
    submissionId,
    summary: {
      totalSections: results.totalSections,
      passed: results.passedSections,
      failed: results.failedSections,
      fieldsRendered: results.totalFieldsVerified,
      fieldTypesInteracted: [...results.fieldTypesTestedGlobal],
      consoleErrors: consoleErrors.length,
    },
    jotaiStore: jotaiCheck,
    sections: results.sectionResults,
    consoleErrors: consoleErrors.slice(0, 50),
  };

  const { writeFileSync } = await import('fs');
  writeFileSync('scripts/ui-test-report.json', JSON.stringify(report, null, 2));
  console.log('\nDetailed report: scripts/ui-test-report.json');

  await browser.close();
  process.exit(allPassed ? 0 : 1);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
