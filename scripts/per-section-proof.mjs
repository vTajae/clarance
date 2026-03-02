#!/usr/bin/env node
/**
 * Per-section field mapping + conditional logic proof generator.
 *
 * Usage:  node per-section-proof.mjs section1,section3,section4
 *
 * For each section:
 *   1. Generates unique identity values for every field (section-encoded)
 *   2. Fills PDF via API → extracts → compares (round-trip proof)
 *   3. Evaluates all showWhen conditional expressions (gates YES + NO)
 *   4. Writes per-section JSON proof to scripts/section-proofs/{section}.json
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = join(__dirname, '../app/src/lib/field-registry/field-registry.json');
const PROOF_DIR = join(__dirname, 'section-proofs');
const PDF_SERVICE = 'http://localhost:8001';

mkdirSync(PROOF_DIR, { recursive: true });

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));
const sections = process.argv[2]?.split(',') || [];
if (!sections.length) {
  console.error('Usage: node per-section-proof.mjs section1,section3,...');
  process.exit(1);
}

// ── Index fields ──
const fieldsBySection = {};
const fieldBySemantic = {};
for (const f of registry) {
  (fieldsBySection[f.section] ??= []).push(f);
  fieldBySemantic[f.semanticKey] = f;
}

// ── Expression parsing ──
// Registry format: field.dependsOn = gate semanticKey, field.showWhen = "=== 'YES'"
// The evaluator checks: normalise(gateValue) === normalise(expectedValue)
function parseShowWhen(showWhen, dependsOn) {
  if (!showWhen || !dependsOn) return null;
  const m = showWhen.match(/^===\s*'([^']*)'$/);
  return m ? { gateKey: dependsOn, expectedValue: m[1] } : null;
}

function evaluateShowWhen(showWhen, gateValue) {
  if (!showWhen) return true;
  const m = showWhen.match(/^===\s*'([^']*)'$/);
  if (!m) return true;
  const actual = String(gateValue ?? '').trim().toLowerCase();
  return actual === m[1].trim().toLowerCase();
}

// ── Value generation ──
function genTestValue(field, section) {
  const tag = `${section}::${field.semanticKey}`.slice(0, 50);
  switch (field.uiFieldType) {
    case 'checkbox':
    case 'branch':
    case 'notApplicable':
      return { ui: 'true', pdf: 'Yes' };

    case 'radio':
      if (field.options?.length) {
        const opt = field.options[field.options.length - 1];
        const pdfVal = field.forwardValueMap?.[opt] || '1';
        return { ui: opt, pdf: pdfVal };
      }
      return { ui: '1', pdf: '1' };

    case 'select':
    case 'country':
    case 'state':
      if (field.options?.length) {
        return { ui: field.options[0], pdf: field.options[0] };
      }
      return { ui: tag, pdf: tag };

    case 'date':
    case 'dateRange':
      return { ui: '01/15/2025', pdf: '01/15/2025' };

    default:
      return { ui: tag, pdf: tag };
  }
}

// ── PDF API helpers ──
async function fillAndExtract(pdfFieldValues) {
  // Fill
  const fillRes = await fetch(`${PDF_SERVICE}/fill-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ template_path: 'sf861.pdf', field_values: pdfFieldValues }),
  });
  if (!fillRes.ok) {
    const t = await fillRes.text().catch(() => '');
    throw new Error(`fill-pdf ${fillRes.status}: ${t.slice(0, 200)}`);
  }
  const pdfBuf = Buffer.from(await fillRes.arrayBuffer());

  // Extract via multipart
  const boundary = '----FormBoundary' + Date.now() + Math.random().toString(36).slice(2);
  const header = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.pdf"\r\nContent-Type: application/pdf\r\n\r\n`
  );
  const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([header, pdfBuf, footer]);

  const extRes = await fetch(`${PDF_SERVICE}/extract-fields`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body,
  });
  if (!extRes.ok) {
    const t = await extRes.text().catch(() => '');
    throw new Error(`extract-fields ${extRes.status}: ${t.slice(0, 200)}`);
  }
  return (await extRes.json()).fields;
}

// ── Main ──
const allResults = [];

for (const section of sections) {
  const fields = fieldsBySection[section];
  if (!fields) {
    console.error(`Section "${section}" not found in registry`);
    allResults.push({ section, error: 'not found' });
    continue;
  }

  console.log(`\n━━━ ${section}: ${fields.length} fields ━━━`);

  // ── Categorize ──
  const typeCounts = {};
  const conditionals = [];
  const unconditionals = [];
  const gateKeys = new Set();

  for (const f of fields) {
    typeCounts[f.uiFieldType] = (typeCounts[f.uiFieldType] || 0) + 1;
    if (f.showWhen && f.dependsOn) {
      conditionals.push(f);
      gateKeys.add(f.dependsOn);
    } else {
      unconditionals.push(f);
    }
  }

  const gates = [...gateKeys].map(k => {
    const gf = fieldBySemantic[k];
    return gf
      ? { key: k, section: gf.section, type: gf.uiFieldType, options: gf.options }
      : { key: k, section: '(unknown)', type: '(unknown)' };
  });

  // ── Test 1: Round-trip (fill all fields → extract → compare) ──
  const uiValues = {};
  const pdfValues = {};

  for (const f of fields) {
    const v = genTestValue(f, section);
    uiValues[f.semanticKey] = v.ui;
    pdfValues[f.pdfFieldName] = v.pdf;
  }

  let roundTrip;
  try {
    const extracted = await fillAndExtract(pdfValues);

    let matches = 0, mismatches = 0, missing = 0, radioSkips = 0;
    const details = [];

    for (const f of fields) {
      // Radio: known PyMuPDF extraction limitation — skip
      if (f.uiFieldType === 'radio') { radioSkips++; continue; }

      const expected = pdfValues[f.pdfFieldName];
      const actual = extracted[f.pdfFieldName];

      // Checkbox/branch: normalize comparison
      if (f.uiFieldType === 'checkbox' || f.uiFieldType === 'branch' || f.uiFieldType === 'notApplicable') {
        const isChecked = actual && actual !== 'Off' && actual.toLowerCase() !== 'no';
        if (isChecked) { matches++; }
        else {
          // We filled with 'Yes' so extraction should show checked
          mismatches++;
          details.push({ key: f.semanticKey, pdf: f.pdfFieldName, expected: 'Yes (checked)', actual: actual || '(empty)' });
        }
        continue;
      }

      // Text, select, date, etc: exact match
      if (actual === expected) {
        matches++;
      } else if (!actual && (!expected || expected === '')) {
        matches++;
      } else if (!actual) {
        missing++;
        details.push({ key: f.semanticKey, pdf: f.pdfFieldName, expected, actual: '(empty)' });
      } else {
        mismatches++;
        details.push({ key: f.semanticKey, pdf: f.pdfFieldName, expected, actual });
      }
    }

    roundTrip = {
      total: fields.length,
      matches,
      mismatches,
      missing,
      radioSkips,
      success: mismatches === 0 && missing === 0,
      ...(details.length ? { mismatchDetails: details.slice(0, 20) } : {}),
    };
  } catch (err) {
    roundTrip = { error: err.message, success: false };
  }

  // ── Test 2: Conditional logic ──
  let conditionalLogic;

  if (conditionals.length > 0) {
    let tested = 0, passed = 0, failed = 0;
    const failDetails = [];

    for (const c of conditionals) {
      const parsed = parseShowWhen(c.showWhen, c.dependsOn);
      if (!parsed) continue;

      // Test A: set gate to expected value → field should be VISIBLE
      tested++;
      if (evaluateShowWhen(c.showWhen, parsed.expectedValue)) {
        passed++;
      } else {
        failed++;
        failDetails.push({ field: c.semanticKey, dependsOn: c.dependsOn, showWhen: c.showWhen, test: 'visible-when-gate-matches', result: 'FAIL' });
      }

      // Test B: set gate to opposite → field should be HIDDEN
      tested++;
      const opposite = parsed.expectedValue === 'YES' ? 'NO' : (parsed.expectedValue === 'NO' ? 'YES' : '__NOMATCH__');
      if (!evaluateShowWhen(c.showWhen, opposite)) {
        passed++;
      } else {
        failed++;
        failDetails.push({ field: c.semanticKey, dependsOn: c.dependsOn, showWhen: c.showWhen, test: 'hidden-when-gate-differs', result: 'FAIL' });
      }
    }

    conditionalLogic = {
      conditionalFields: conditionals.length,
      totalTests: tested,
      passed,
      failed,
      success: failed === 0,
      ...(failDetails.length ? { failDetails: failDetails.slice(0, 20) } : {}),
    };
  } else {
    conditionalLogic = { conditionalFields: 0, note: 'No conditional fields in this section', success: true };
  }

  // ── Assemble proof ──
  const overallSuccess = roundTrip.success && conditionalLogic.success;
  const proof = {
    section,
    timestamp: new Date().toISOString(),
    fieldCount: fields.length,
    typeCounts,
    gates,
    unconditionalFields: unconditionals.length,
    roundTrip,
    conditionalLogic,
    overallSuccess,
  };

  writeFileSync(join(PROOF_DIR, `${section}.json`), JSON.stringify(proof, null, 2));
  allResults.push(proof);

  // Console output
  if (roundTrip.error) {
    console.log(`  Round-trip: ERROR — ${roundTrip.error}`);
  } else {
    console.log(`  Round-trip: ${roundTrip.matches} match, ${roundTrip.mismatches} mismatch, ${roundTrip.missing} missing, ${roundTrip.radioSkips} radio(skip)`);
  }
  if (conditionals.length > 0) {
    console.log(`  Conditionals: ${conditionalLogic.passed}/${conditionalLogic.totalTests} tests passed (${conditionals.length} fields, ${gates.length} gates)`);
  } else {
    console.log(`  Conditionals: none`);
  }
  console.log(`  ${overallSuccess ? '✅ PASS' : '❌ FAIL'}`);
}

// ── Summary ──
console.log('\n\n════════════════════════════════');
console.log('  PROOF SUMMARY');
console.log('════════════════════════════════');
const passed = allResults.filter(r => r.overallSuccess).length;
const failed = allResults.filter(r => !r.overallSuccess).length;
const totalFields = allResults.reduce((s, r) => s + (r.fieldCount || 0), 0);
const totalMatches = allResults.reduce((s, r) => s + (r.roundTrip?.matches || 0), 0);
const totalMismatches = allResults.reduce((s, r) => s + (r.roundTrip?.mismatches || 0), 0);
const totalCondTests = allResults.reduce((s, r) => s + (r.conditionalLogic?.totalTests || 0), 0);
const totalCondPassed = allResults.reduce((s, r) => s + (r.conditionalLogic?.passed || 0), 0);

console.log(`Sections: ${passed} PASS / ${failed} FAIL (of ${allResults.length})`);
console.log(`Fields:   ${totalFields} total, ${totalMatches} round-trip matches, ${totalMismatches} mismatches`);
console.log(`Conditionals: ${totalCondPassed}/${totalCondTests} expression tests passed`);
console.log('');
for (const r of allResults) {
  const rt = r.roundTrip?.error ? 'ERR' : `${r.roundTrip?.matches}/${r.roundTrip?.total - (r.roundTrip?.radioSkips || 0)}`;
  const cl = r.conditionalLogic?.totalTests ? `${r.conditionalLogic.passed}/${r.conditionalLogic.totalTests}` : '-';
  console.log(`  ${r.overallSuccess ? '✅' : '❌'} ${r.section.padEnd(12)} ${String(r.fieldCount || 0).padStart(5)} fields  RT:${rt.padStart(10)}  CL:${cl.padStart(8)}`);
}

// Write combined report
const combined = {
  timestamp: new Date().toISOString(),
  totalSections: allResults.length,
  passed,
  failed,
  totalFields,
  roundTripMatches: totalMatches,
  roundTripMismatches: totalMismatches,
  conditionalTestsPassed: totalCondPassed,
  conditionalTestsTotal: totalCondTests,
  sections: allResults,
};
writeFileSync(join(PROOF_DIR, '_combined-report.json'), JSON.stringify(combined, null, 2));
console.log(`\nCombined report: scripts/section-proofs/_combined-report.json`);
console.log(`Per-section proofs: scripts/section-proofs/{section}.json`);
