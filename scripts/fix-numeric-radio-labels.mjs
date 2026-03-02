#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Fix 33 radio fields that have numeric-only options ("1","2","3","4")
// by replacing with actual descriptive option text from the SF-86 form.
//
// These labels come from the SF-86 form specification and have been verified
// against the PDF page text using PyMuPDF text extraction.
// ---------------------------------------------------------------------------

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const registryPath = join(__dirname, '..', 'app', 'src', 'lib', 'field-registry', 'field-registry.json');

const registry = JSON.parse(readFileSync(registryPath, 'utf-8'));

// Curated option labels from SF-86 form specification + PyMuPDF text extraction
// Key: pdfFieldName → { options: string[], label?: string }
const fixes = {
  // Section 9 — Citizenship document type
  'form1[0].Section9\\.1-9\\.4[0].RadioButtonList[0]': {
    label: 'Type of document issued',
    options: ['I-94', 'U.S. Visa (red foil number)', 'I-20', 'DS-2019', 'Other (Provide explanation)'],
  },

  // Section 11 — Residence type (4 instances)
  'form1[0].Section11[0].RadioButtonList[0]': {
    label: 'Type of residence',
    options: ['Owned by you', 'Rented or leased by you', 'Military housing', 'Other (Provide explanation)'],
  },
  'form1[0].Section11-2[0].RadioButtonList[0]': {
    label: 'Type of residence',
    options: ['Owned by you', 'Rented or leased by you', 'Military housing', 'Other (Provide explanation)'],
  },
  'form1[0].Section11-3[0].RadioButtonList[0]': {
    label: 'Type of residence',
    options: ['Owned by you', 'Rented or leased by you', 'Military housing', 'Other (Provide explanation)'],
  },
  'form1[0].Section11-4[0].RadioButtonList[2]': {
    label: 'Type of residence',
    options: ['Owned by you', 'Rented or leased by you', 'Military housing', 'Other (Provide explanation)'],
  },

  // Section 15 — Military branch of service (first instance)
  'form1[0].Section14_1[0].#area[5].#area[6].RadioButtonList[2]': {
    label: 'Branch of service',
    options: ['Army', 'Army National Guard', 'Navy', 'Air Force', 'Air National Guard', 'Marine Corps', 'Coast Guard'],
  },
  // Section 15 — Military status
  'form1[0].Section14_1[0].#area[7].RadioButtonList[3]': {
    label: 'Status',
    options: ['Enlisted', 'Officer', 'Not Applicable'],
  },
  // Section 15 — Discharge type (first instance)
  'form1[0].Section14_1[0].#area[10].RadioButtonList[5]': {
    label: 'Type of discharge',
    options: ['Honorable', 'Dishonorable', 'General', 'Under Other than Honorable Conditions', 'Bad Conduct', 'Other (provide type)'],
  },
  // Section 15 — Enlistment type
  'form1[0].Section14_1[0].#area[12].RadioButtonList[7]': {
    label: 'Status',
    options: ['Active Duty', 'Active Reserve', 'Inactive Reserve'],
  },
  // Section 15 — Branch (second instance)
  'form1[0].Section14_1[0].#area[13].#area[14].RadioButtonList[8]': {
    label: 'Branch of service',
    options: ['Army', 'Army National Guard', 'Navy', 'Air Force', 'Air National Guard', 'Marine Corps', 'Coast Guard'],
  },
  // Section 15 — Status (second instance)
  'form1[0].Section14_1[0].#area[15].RadioButtonList[9]': {
    label: 'Status',
    options: ['Enlisted', 'Officer', 'Not Applicable'],
  },
  // Section 15 — Discharge type (second instance)
  'form1[0].Section14_1[0].#area[18].RadioButtonList[11]': {
    label: 'Type of discharge',
    options: ['Honorable', 'Dishonorable', 'General', 'Under Other than Honorable Conditions', 'Bad Conduct', 'Other (provide type)'],
  },

  // Section 15.3 — Foreign military service type
  'form1[0].Section15_3[0].RadioButtonList[1]': {
    label: 'Type of foreign military service',
    options: ['Military (Specify Army, Navy, Air Force, Marines, etc.)', 'Intelligence Service', 'Diplomatic Service', 'Security Forces', 'Militia', 'Other Defense Forces', 'Other Government Agency'],
  },

  // Section 16 — People who know you - foreign service type
  'form1[0].Section16_1[0].RadioButtonList[0]': {
    label: 'Type of foreign military service',
    options: ['Military (Specify Army, Navy, Air Force, Marines, etc.)', 'Intelligence Service', 'Diplomatic Service', 'Security Forces', 'Militia', 'Other Defense Forces', 'Other Government Agency'],
  },

  // Section 17 — Marital status (2 instances)
  'form1[0].Section17_2[0].RadioButtonList[1]': {
    label: 'Status',
    options: ['Divorced/Dissolved', 'Widowed', 'Annulled'],
  },
  'form1[0].Section17_2_2[0].RadioButtonList[1]': {
    label: 'Status',
    options: ['Divorced/Dissolved', 'Widowed', 'Annulled'],
  },

  // Section 19 — Frequency of contact (4 instances)
  'form1[0].Section19_1[0].RadioButtonList[1]': {
    label: 'Frequency of contact',
    options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'Other (Provide explanation)'],
  },
  'form1[0].Section19_2[0].RadioButtonList[0]': {
    label: 'Frequency of contact',
    options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'Other (Provide explanation)'],
  },
  'form1[0].Section19_3[0].RadioButtonList[0]': {
    label: 'Frequency of contact',
    options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'Other (Provide explanation)'],
  },
  'form1[0].Section19_4[0].RadioButtonList[0]': {
    label: 'Frequency of contact',
    options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'Other (Provide explanation)'],
  },

  // Section 20A — Benefit type (2 instances)
  'form1[0].#subform[72].RadioButtonList[8]': {
    label: 'Type of benefit',
    options: ['Onetime benefit', 'Future benefit', 'Continuing benefit', 'Other'],
  },
  'form1[0].#subform[74].RadioButtonList[15]': {
    label: 'Type of benefit',
    options: ['Onetime benefit', 'Future benefit', 'Continuing benefit', 'Other'],
  },

  // Section 20A — Benefit frequency (2 instances)
  'form1[0].#subform[72].RadioButtonList[10]': {
    label: 'Frequency of benefit',
    options: ['Annually', 'Quarterly', 'Monthly', 'Weekly', 'Other (Provide explanation)'],
  },
  'form1[0].#subform[74].RadioButtonList[17]': {
    label: 'Frequency of benefit',
    options: ['Annually', 'Quarterly', 'Monthly', 'Weekly', 'Other (Provide explanation)'],
  },

  // Section 20A — Continuing benefit frequency (2 instances)
  'form1[0].#subform[72].RadioButtonList[12]': {
    label: 'Frequency of continuing benefit',
    options: ['Annually', 'Quarterly', 'Monthly', 'Weekly', 'Other (Provide explanation)'],
  },
  'form1[0].#subform[74].RadioButtonList[19]': {
    label: 'Frequency of continuing benefit',
    options: ['Annually', 'Quarterly', 'Monthly', 'Weekly', 'Other (Provide explanation)'],
  },

  // Section 20A — Nature of benefit (2 instances)
  'form1[0].#subform[72].RadioButtonList[13]': {
    label: 'Nature of benefit',
    options: ['Educational', 'Medical', 'Retirement', 'Social Welfare', 'Other (Provide explanation)'],
  },
  'form1[0].#subform[74].RadioButtonList[20]': {
    label: 'Nature of benefit',
    options: ['Educational', 'Medical', 'Retirement', 'Social Welfare', 'Other (Provide explanation)'],
  },

  // Section 20C — Number of days (4 instances)
  'form1[0].#subform[92].RadioButtonList[41]': {
    label: 'Total number of days',
    options: ['1-5', '6-10', '11-20', '21-30', 'More than 30', 'Many short trips'],
  },
  'form1[0].#subform[93].RadioButtonList[49]': {
    label: 'Total number of days',
    options: ['1-5', '6-10', '11-20', '21-30', 'More than 30', 'Many short trips'],
  },
  'form1[0].#subform[94].RadioButtonList[57]': {
    label: 'Total number of days',
    options: ['1-5', '6-10', '11-20', '21-30', 'More than 30', 'Many short trips'],
  },
  'form1[0].#subform[95].RadioButtonList[65]': {
    label: 'Total number of days',
    options: ['1-5', '6-10', '11-20', '21-30', 'More than 30', 'Many short trips'],
  },

  // Section 30 — Continuation agreement
  'form1[0].continuation3[0].RadioButtonList[0]': {
    label: 'Agreement',
    options: ['YES', 'NO'],
  },
};

let fixedCount = 0;
let notFound = 0;

for (const entry of registry) {
  const fix = fixes[entry.pdfFieldName];
  if (!fix) continue;

  // Only fix if options are currently numeric
  if (entry.options && entry.options.every(o => /^\d+$/.test(o))) {
    // Update options with descriptive text
    const oldOptions = [...entry.options];

    // The options array length must match (or we use the fix length)
    if (fix.options.length === entry.options.length) {
      entry.options = fix.options;
    } else {
      // Pad or truncate to match — the registry's option count is authoritative
      // because it matches the number of PyMuPDF radio widgets
      entry.options = fix.options.slice(0, entry.options.length);
      while (entry.options.length < oldOptions.length) {
        entry.options.push(`Option ${entry.options.length + 1}`);
      }
    }

    // Update valueMap: old keys were "1","2","3"... keep same PDF values,
    // but change keys to the new option text
    if (entry.valueMap) {
      const newValueMap = {};
      for (let i = 0; i < entry.options.length; i++) {
        const oldKey = String(i + 1); // "1", "2", "3", ...
        const newKey = entry.options[i];
        if (entry.valueMap[oldKey] !== undefined) {
          newValueMap[newKey] = entry.valueMap[oldKey];
        }
      }
      entry.valueMap = newValueMap;
    }

    // Update label if generic
    if (fix.label && entry.label === 'RadioButtonList') {
      entry.label = fix.label;
    }

    console.log(`Fixed: ${entry.semanticKey}`);
    console.log(`  Old options: ${JSON.stringify(oldOptions)}`);
    console.log(`  New options: ${JSON.stringify(entry.options)}`);
    if (fix.label && entry.label === fix.label) {
      console.log(`  Label: ${fix.label}`);
    }
    console.log();
    fixedCount++;
  }
}

console.log(`\nTotal fixed: ${fixedCount}`);

writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log('Registry saved.');
