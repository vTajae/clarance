#!/usr/bin/env node
/**
 * CRITICAL AUDIT: SF-86 Field Registry Data Integrity Check
 *
 * Checks:
 * 1. Duplicate semanticKeys
 * 2. Duplicate pdfFieldNames
 * 3. Missing required fields
 * 4. Invalid uiFieldType values
 * 5. Orphaned dependsOn references
 * 6. ValueMap consistency (radio fields)
 * 7. Empty/null/generic labels
 * 8. Section coverage (fields per section)
 * 9. Option arrays for radio/select fields
 * 10. pdfPage coverage
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const REGISTRY_PATH = resolve(
  '/home/watery/Desktop/clear-rents/app/src/lib/field-registry/field-registry.json'
);

const VALID_UI_TYPES = new Set([
  'text', 'email', 'telephone', 'ssn', 'date',
  'checkbox', 'radio', 'select', 'country', 'state',
  'branch', 'notApplicable'
]);

const REQUIRED_FIELDS = ['semanticKey', 'pdfFieldName', 'section', 'uiFieldType', 'label'];

const GENERIC_LABEL_PATTERNS = [
  /^TextField\d+$/i,
  /^#field\[?\d*\]?$/i,
  /^CheckBox\d+$/i,
  /^RadioButton\d+$/i,
  /^DropDownList\d+$/i,
  /^Dropdown\d+$/i,
  /^#area\d*$/i,
  /^field\d+$/i,
  /^#subform/i,
];

// ---------- Load ----------
console.log('Loading field registry...');
const raw = readFileSync(REGISTRY_PATH, 'utf-8');
const registry = JSON.parse(raw);
console.log(`Loaded ${registry.length} entries.\n`);

const issues = [];
function issue(check, severity, index, detail) {
  issues.push({ check, severity, index, detail });
}

// Build lookup of all semanticKeys for reference checks
const allSemanticKeys = new Set(registry.map(f => f.semanticKey).filter(Boolean));

// ========== CHECK 1: Duplicate semanticKeys ==========
console.log('CHECK 1: Duplicate semanticKeys...');
const semKeyMap = new Map();
for (let i = 0; i < registry.length; i++) {
  const sk = registry[i].semanticKey;
  if (!sk) continue;
  if (!semKeyMap.has(sk)) {
    semKeyMap.set(sk, []);
  }
  semKeyMap.get(sk).push(i);
}
let dupSemCount = 0;
for (const [key, indices] of semKeyMap) {
  if (indices.length > 1) {
    dupSemCount++;
    issue(1, 'CRITICAL', indices[0],
      `Duplicate semanticKey "${key}" at indices [${indices.join(', ')}] ` +
      `(pdfFieldNames: ${indices.map(i => registry[i].pdfFieldName).join(' | ')})`
    );
  }
}
console.log(`  Found ${dupSemCount} duplicated semanticKeys.\n`);

// ========== CHECK 2: Duplicate pdfFieldNames ==========
console.log('CHECK 2: Duplicate pdfFieldNames...');
const pdfNameMap = new Map();
for (let i = 0; i < registry.length; i++) {
  const pn = registry[i].pdfFieldName;
  if (!pn) continue;
  if (!pdfNameMap.has(pn)) {
    pdfNameMap.set(pn, []);
  }
  pdfNameMap.get(pn).push(i);
}
let dupPdfCount = 0;
for (const [key, indices] of pdfNameMap) {
  if (indices.length > 1) {
    dupPdfCount++;
    issue(2, 'CRITICAL', indices[0],
      `Duplicate pdfFieldName "${key}" at indices [${indices.join(', ')}] ` +
      `(semanticKeys: ${indices.map(i => registry[i].semanticKey).join(' | ')})`
    );
  }
}
console.log(`  Found ${dupPdfCount} duplicated pdfFieldNames.\n`);

// ========== CHECK 3: Missing required fields ==========
console.log('CHECK 3: Missing required fields...');
let missingCount = 0;
for (let i = 0; i < registry.length; i++) {
  const entry = registry[i];
  for (const field of REQUIRED_FIELDS) {
    const val = entry[field];
    if (val === undefined || val === null) {
      missingCount++;
      issue(3, 'CRITICAL', i,
        `Missing required field "${field}" — pdfFieldName: "${entry.pdfFieldName || '(none)'}", semanticKey: "${entry.semanticKey || '(none)'}"`
      );
    }
  }
}
console.log(`  Found ${missingCount} missing required fields.\n`);

// ========== CHECK 4: Invalid uiFieldType values ==========
console.log('CHECK 4: Invalid uiFieldType values...');
const typeDistribution = new Map();
let invalidTypeCount = 0;
for (let i = 0; i < registry.length; i++) {
  const t = registry[i].uiFieldType;
  typeDistribution.set(t, (typeDistribution.get(t) || 0) + 1);
  if (!VALID_UI_TYPES.has(t)) {
    invalidTypeCount++;
    issue(4, 'ERROR', i,
      `Invalid uiFieldType "${t}" — semanticKey: "${registry[i].semanticKey}", pdfFieldName: "${registry[i].pdfFieldName}"`
    );
  }
}
console.log(`  Type distribution:`);
for (const [t, c] of [...typeDistribution].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${t}: ${c}`);
}
console.log(`  Found ${invalidTypeCount} invalid uiFieldType values.\n`);

// ========== CHECK 5: Orphaned dependsOn references ==========
console.log('CHECK 5: Orphaned dependsOn references...');
let orphanCount = 0;
for (let i = 0; i < registry.length; i++) {
  const dep = registry[i].dependsOn;
  if (!dep) continue;

  // dependsOn can be a string or an object with a "field" key, or an array
  const refs = [];
  if (typeof dep === 'string') {
    refs.push(dep);
  } else if (Array.isArray(dep)) {
    for (const d of dep) {
      if (typeof d === 'string') refs.push(d);
      else if (d && d.field) refs.push(d.field);
      else if (d && d.semanticKey) refs.push(d.semanticKey);
    }
  } else if (dep.field) {
    refs.push(dep.field);
  } else if (dep.semanticKey) {
    refs.push(dep.semanticKey);
  }

  for (const ref of refs) {
    if (!allSemanticKeys.has(ref)) {
      orphanCount++;
      issue(5, 'ERROR', i,
        `Orphaned dependsOn reference "${ref}" — semanticKey: "${registry[i].semanticKey}", section: "${registry[i].section}"`
      );
    }
  }
}
console.log(`  Found ${orphanCount} orphaned dependsOn references.\n`);

// ========== CHECK 6: ValueMap consistency ==========
console.log('CHECK 6: ValueMap consistency for radio fields...');
let vmIssueCount = 0;
let radioWithoutValueMap = 0;
let radioWithValueMap = 0;
for (let i = 0; i < registry.length; i++) {
  const entry = registry[i];
  if (entry.uiFieldType !== 'radio') continue;

  if (!entry.valueMap || typeof entry.valueMap !== 'object' || Object.keys(entry.valueMap).length === 0) {
    radioWithoutValueMap++;
    // Check if it has options instead
    if (!entry.options || entry.options.length === 0) {
      vmIssueCount++;
      issue(6, 'WARNING', i,
        `Radio field without valueMap AND without options — semanticKey: "${entry.semanticKey}", pdfFieldName: "${entry.pdfFieldName}"`
      );
    }
  } else {
    radioWithValueMap++;
    // Verify valueMap values are sequential numeric strings
    const values = Object.values(entry.valueMap);
    const numericValues = values.map(Number).filter(n => !isNaN(n));
    if (numericValues.length !== values.length) {
      vmIssueCount++;
      issue(6, 'WARNING', i,
        `Radio valueMap has non-numeric values: ${JSON.stringify(entry.valueMap)} — semanticKey: "${entry.semanticKey}"`
      );
    }

    // Check for duplicate values in valueMap
    const uniqueVals = new Set(values);
    if (uniqueVals.size !== values.length) {
      vmIssueCount++;
      issue(6, 'ERROR', i,
        `Radio valueMap has duplicate values: ${JSON.stringify(entry.valueMap)} — semanticKey: "${entry.semanticKey}"`
      );
    }

    // Check if options array matches valueMap keys
    if (entry.options && entry.options.length > 0) {
      const vmKeys = new Set(Object.keys(entry.valueMap));
      const optSet = new Set(entry.options.map(o => typeof o === 'string' ? o : o.value || o.label));
      for (const opt of optSet) {
        if (!vmKeys.has(opt)) {
          vmIssueCount++;
          issue(6, 'WARNING', i,
            `Option "${opt}" not in valueMap keys — semanticKey: "${entry.semanticKey}", valueMap keys: [${[...vmKeys].join(', ')}]`
          );
        }
      }
      for (const vk of vmKeys) {
        if (!optSet.has(vk)) {
          vmIssueCount++;
          issue(6, 'WARNING', i,
            `ValueMap key "${vk}" not in options — semanticKey: "${entry.semanticKey}", options: [${[...optSet].join(', ')}]`
          );
        }
      }
    }
  }
}
console.log(`  Radio fields with valueMap: ${radioWithValueMap}`);
console.log(`  Radio fields without valueMap: ${radioWithoutValueMap}`);
console.log(`  Found ${vmIssueCount} valueMap issues.\n`);

// ========== CHECK 7: Empty/null/generic labels ==========
console.log('CHECK 7: Empty/null/generic labels...');
let labelIssueCount = 0;
for (let i = 0; i < registry.length; i++) {
  const entry = registry[i];
  const label = entry.label;

  // Null or undefined
  if (label === null || label === undefined) {
    labelIssueCount++;
    issue(7, 'CRITICAL', i,
      `Null/undefined label — semanticKey: "${entry.semanticKey}", pdfFieldName: "${entry.pdfFieldName}"`
    );
    continue;
  }

  // Empty string
  if (typeof label === 'string' && label.trim() === '') {
    labelIssueCount++;
    issue(7, 'CRITICAL', i,
      `Empty label — semanticKey: "${entry.semanticKey}", pdfFieldName: "${entry.pdfFieldName}"`
    );
    continue;
  }

  // Generic pattern
  for (const pattern of GENERIC_LABEL_PATTERNS) {
    if (pattern.test(label.trim())) {
      labelIssueCount++;
      issue(7, 'ERROR', i,
        `Generic label "${label}" — semanticKey: "${entry.semanticKey}", pdfFieldName: "${entry.pdfFieldName}"`
      );
      break;
    }
  }

  // Suspiciously short labels (1-2 chars, excluding known abbreviations)
  if (typeof label === 'string' && label.trim().length <= 2 && !['No', 'NA', 'ID', 'Jr', 'Sr', 'II', 'IV'].includes(label.trim())) {
    labelIssueCount++;
    issue(7, 'WARNING', i,
      `Suspiciously short label "${label}" (${label.trim().length} chars) — semanticKey: "${entry.semanticKey}", section: "${entry.section}"`
    );
  }
}
console.log(`  Found ${labelIssueCount} label issues.\n`);

// ========== CHECK 8: Section coverage ==========
console.log('CHECK 8: Section coverage...');
const sectionCounts = new Map();
for (const entry of registry) {
  const s = entry.section || '(none)';
  sectionCounts.set(s, (sectionCounts.get(s) || 0) + 1);
}

// Sort by section name
const sortedSections = [...sectionCounts].sort((a, b) => {
  // Extract numeric parts for natural sort
  const numA = a[0].match(/\d+/);
  const numB = b[0].match(/\d+/);
  if (numA && numB) return parseInt(numA[0]) - parseInt(numB[0]);
  return a[0].localeCompare(b[0]);
});

console.log('  Fields per section:');
let totalFields = 0;
for (const [section, count] of sortedSections) {
  const flag = count < 3 ? ' *** SUSPICIOUS (< 3 fields)' : '';
  console.log(`    ${section}: ${count}${flag}`);
  totalFields += count;
  if (count < 3) {
    issue(8, 'WARNING', -1,
      `Section "${section}" has only ${count} field(s) — suspiciously low`
    );
  }
}
console.log(`  Total: ${totalFields}`);
console.log(`  Sections: ${sectionCounts.size}\n`);

// ========== CHECK 9: Option arrays for radio/select ==========
console.log('CHECK 9: Option arrays for radio/select fields...');
let optIssueCount = 0;
let radioCount = 0;
let selectCount = 0;
for (let i = 0; i < registry.length; i++) {
  const entry = registry[i];
  if (entry.uiFieldType === 'radio') {
    radioCount++;
    if (!entry.options || !Array.isArray(entry.options)) {
      optIssueCount++;
      issue(9, 'WARNING', i,
        `Radio field missing options array — semanticKey: "${entry.semanticKey}", has valueMap: ${!!entry.valueMap}`
      );
    } else if (entry.options.length < 2) {
      optIssueCount++;
      issue(9, 'ERROR', i,
        `Radio field has ${entry.options.length} option(s) (need >= 2) — semanticKey: "${entry.semanticKey}", options: ${JSON.stringify(entry.options)}`
      );
    }
  }
  if (entry.uiFieldType === 'select' || entry.uiFieldType === 'country' || entry.uiFieldType === 'state') {
    selectCount++;
    if (!entry.options || !Array.isArray(entry.options)) {
      // country and state may derive options from a shared list — only flag select
      if (entry.uiFieldType === 'select') {
        optIssueCount++;
        issue(9, 'WARNING', i,
          `Select field missing options array — semanticKey: "${entry.semanticKey}", pdfFieldName: "${entry.pdfFieldName}"`
        );
      }
    } else if (entry.options.length < 2) {
      optIssueCount++;
      issue(9, 'ERROR', i,
        `Select/country/state field has ${entry.options.length} option(s) (need >= 2) — semanticKey: "${entry.semanticKey}"`
      );
    }
  }
}
console.log(`  Radio fields total: ${radioCount}`);
console.log(`  Select/country/state fields total: ${selectCount}`);
console.log(`  Found ${optIssueCount} option array issues.\n`);

// ========== CHECK 10: pdfPage coverage ==========
console.log('CHECK 10: pdfPage coverage...');
let pageIssueCount = 0;
const pageDistribution = new Map();
for (let i = 0; i < registry.length; i++) {
  const entry = registry[i];
  const page = entry.pdfPage;

  if (page === undefined || page === null) {
    pageIssueCount++;
    issue(10, 'ERROR', i,
      `Missing pdfPage — semanticKey: "${entry.semanticKey}", pdfFieldName: "${entry.pdfFieldName}"`
    );
    continue;
  }

  if (typeof page !== 'number' || !Number.isInteger(page) || page < 1) {
    pageIssueCount++;
    issue(10, 'ERROR', i,
      `Invalid pdfPage "${page}" (type: ${typeof page}) — semanticKey: "${entry.semanticKey}"`
    );
    continue;
  }

  // SF-86 is 127 pages
  if (page > 127) {
    pageIssueCount++;
    issue(10, 'WARNING', i,
      `pdfPage ${page} exceeds expected 127 pages — semanticKey: "${entry.semanticKey}"`
    );
  }

  pageDistribution.set(page, (pageDistribution.get(page) || 0) + 1);
}

console.log('  Fields per page (sorted):');
const sortedPages = [...pageDistribution].sort((a, b) => a[0] - b[0]);
for (const [page, count] of sortedPages) {
  console.log(`    Page ${page}: ${count}`);
}
console.log(`  Total pages with fields: ${pageDistribution.size}`);
console.log(`  Found ${pageIssueCount} pdfPage issues.\n`);

// ========== BONUS CHECKS ==========
console.log('BONUS CHECK A: pdfRect coverage...');
let rectMissing = 0;
let rectInvalid = 0;
for (let i = 0; i < registry.length; i++) {
  const entry = registry[i];
  if (!entry.pdfRect) {
    rectMissing++;
    if (rectMissing <= 5) {
      issue('A', 'INFO', i,
        `Missing pdfRect — semanticKey: "${entry.semanticKey}"`
      );
    }
    continue;
  }
  const { x, y, width, height } = entry.pdfRect;
  if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
    rectInvalid++;
    issue('A', 'WARNING', i,
      `Invalid pdfRect values — semanticKey: "${entry.semanticKey}", rect: ${JSON.stringify(entry.pdfRect)}`
    );
  } else if (width <= 0 || height <= 0) {
    rectInvalid++;
    issue('A', 'WARNING', i,
      `pdfRect has non-positive dimensions (w:${width}, h:${height}) — semanticKey: "${entry.semanticKey}"`
    );
  }
}
console.log(`  Missing pdfRect: ${rectMissing}`);
console.log(`  Invalid pdfRect: ${rectInvalid}\n`);

console.log('BONUS CHECK B: semanticKey naming convention...');
let namingIssues = 0;
// Check for semanticKeys that look like they might be auto-generated or inconsistent
const skPrefixes = new Map();
for (let i = 0; i < registry.length; i++) {
  const sk = registry[i].semanticKey;
  if (!sk) continue;
  const prefix = sk.split('.')[0];
  skPrefixes.set(prefix, (skPrefixes.get(prefix) || 0) + 1);

  // Check for spaces in semanticKey
  if (sk.includes(' ')) {
    namingIssues++;
    issue('B', 'ERROR', i,
      `semanticKey contains spaces: "${sk}"`
    );
  }

  // Check for special chars (only allow alphanumeric, dots, underscores, hyphens, brackets)
  if (/[^a-zA-Z0-9._\-\[\]]/.test(sk)) {
    namingIssues++;
    issue('B', 'WARNING', i,
      `semanticKey contains unusual characters: "${sk}"`
    );
  }
}
console.log('  semanticKey prefixes:');
for (const [prefix, count] of [...skPrefixes].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${prefix}: ${count}`);
}
console.log(`  Found ${namingIssues} naming issues.\n`);

console.log('BONUS CHECK C: Section-to-sectionGroup consistency...');
const sectionGroupMap = new Map();
let groupInconsistencies = 0;
for (let i = 0; i < registry.length; i++) {
  const entry = registry[i];
  const key = `${entry.section}`;
  if (!sectionGroupMap.has(key)) {
    sectionGroupMap.set(key, new Set());
  }
  sectionGroupMap.get(key).add(entry.sectionGroup || '(none)');
}
for (const [section, groups] of sectionGroupMap) {
  if (groups.size > 1) {
    groupInconsistencies++;
    issue('C', 'ERROR', -1,
      `Section "${section}" maps to multiple sectionGroups: [${[...groups].join(', ')}]`
    );
  }
}
console.log(`  Found ${groupInconsistencies} section-to-sectionGroup inconsistencies.\n`);

console.log('BONUS CHECK D: Cross-reference section with sf86SectionId...');
let sectionIdMismatches = 0;
for (let i = 0; i < registry.length; i++) {
  const entry = registry[i];
  if (!entry.section || entry.sf86SectionId === undefined) continue;

  // Extract numeric part from section name
  const sectionNum = entry.section.match(/section(\d+)/)?.[1];
  if (sectionNum && parseInt(sectionNum) !== entry.sf86SectionId) {
    // Some sections like 13A, 20A map differently — only flag clear mismatches
    const sectionLetter = entry.section.match(/section\d+([A-E])/)?.[1];
    if (!sectionLetter) {
      sectionIdMismatches++;
      if (sectionIdMismatches <= 20) {
        issue('D', 'INFO', i,
          `section "${entry.section}" vs sf86SectionId ${entry.sf86SectionId} — semanticKey: "${entry.semanticKey}"`
        );
      }
    }
  }
}
console.log(`  Found ${sectionIdMismatches} section/sf86SectionId mismatches.\n`);


// ========== SUMMARY ==========
console.log('='.repeat(80));
console.log('AUDIT SUMMARY');
console.log('='.repeat(80));
console.log(`Total entries: ${registry.length}`);
console.log(`Unique semanticKeys: ${semKeyMap.size}`);
console.log(`Unique pdfFieldNames: ${pdfNameMap.size}`);
console.log();

const severityCounts = { CRITICAL: 0, ERROR: 0, WARNING: 0, INFO: 0 };
for (const i of issues) {
  severityCounts[i.severity] = (severityCounts[i.severity] || 0) + 1;
}

console.log('Issue counts by severity:');
console.log(`  CRITICAL: ${severityCounts.CRITICAL}`);
console.log(`  ERROR:    ${severityCounts.ERROR}`);
console.log(`  WARNING:  ${severityCounts.WARNING}`);
console.log(`  INFO:     ${severityCounts.INFO}`);
console.log(`  TOTAL:    ${issues.length}`);
console.log();

console.log('Issue counts by check:');
const checkCounts = new Map();
for (const i of issues) {
  const key = `Check ${i.check}`;
  checkCounts.set(key, (checkCounts.get(key) || 0) + 1);
}
for (const [check, count] of [...checkCounts].sort()) {
  console.log(`  ${check}: ${count}`);
}
console.log();

// Print all issues grouped by severity
for (const severity of ['CRITICAL', 'ERROR', 'WARNING', 'INFO']) {
  const sevIssues = issues.filter(i => i.severity === severity);
  if (sevIssues.length === 0) continue;

  console.log(`\n${'='.repeat(80)}`);
  console.log(`${severity} ISSUES (${sevIssues.length})`);
  console.log('='.repeat(80));
  for (const i of sevIssues) {
    const idx = i.index >= 0 ? ` [index ${i.index}]` : '';
    console.log(`  [Check ${i.check}]${idx} ${i.detail}`);
  }
}

// Final verdict
console.log(`\n${'='.repeat(80)}`);
if (severityCounts.CRITICAL > 0) {
  console.log('VERDICT: FAIL — CRITICAL issues found that must be resolved.');
} else if (severityCounts.ERROR > 0) {
  console.log('VERDICT: CONDITIONAL PASS — ERROR-level issues should be reviewed.');
} else {
  console.log('VERDICT: PASS — No critical or error-level issues found.');
}
console.log('='.repeat(80));
