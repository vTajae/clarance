/**
 * generate-wizard-steps.mjs
 *
 * Reads field-registry.json and generates wizard-steps.json.
 * Each section is partitioned into wizard steps of 1-8 fields,
 * grouped by gates, repeat groups, and semantic affinity.
 *
 * Run: node scripts/generate-wizard-steps.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const registryPath = resolve(ROOT, 'src/lib/field-registry/field-registry.json');
const outputPath = resolve(ROOT, 'src/lib/wizard/wizard-steps.json');

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

// ---------------------------------------------------------------------------
// Section metadata for title/guidance generation
// ---------------------------------------------------------------------------

const SECTION_META = {
  section1:  { title: 'Full Name',                    topic: 'your full legal name' },
  section2:  { title: 'Date of Birth',                topic: 'your date of birth' },
  section3:  { title: 'Place of Birth',               topic: 'your place of birth' },
  section4:  { title: 'Social Security Number',        topic: 'your Social Security Number' },
  section5:  { title: 'Other Names Used',              topic: 'other names you have used' },
  section6:  { title: 'Identifying Information',       topic: 'your physical identifying information' },
  section7:  { title: 'Contact Information',           topic: 'your contact information' },
  section8:  { title: 'U.S. Passport',                 topic: 'your U.S. passport information' },
  section9:  { title: 'Citizenship',                   topic: 'your U.S. citizenship status' },
  section10: { title: 'Dual/Multiple Citizenship',     topic: 'dual or multiple citizenship' },
  section11: { title: 'Where You Have Lived',          topic: 'your residence history' },
  section12: { title: 'Where You Went to School',      topic: 'your education history' },
  section13A:{ title: 'Employment Activities',          topic: 'your employment history' },
  section13B:{ title: 'Former Federal Service',         topic: 'your former federal service' },
  section13C:{ title: 'Employment Record',              topic: 'your employment record' },
  section14: { title: 'Selective Service Record',       topic: 'your Selective Service registration' },
  section15: { title: 'Military History',               topic: 'your military service history' },
  section16: { title: 'People Who Know You Well',       topic: 'people who can verify your activities' },
  section17: { title: 'Marital/Relationship Status',    topic: 'your marital and relationship history' },
  section18: { title: 'Relatives',                      topic: 'your relatives' },
  section19: { title: 'Foreign Contacts',               topic: 'your foreign contacts' },
  section20A:{ title: 'Foreign Activities',              topic: 'foreign financial interests' },
  section20B:{ title: 'Foreign Business & Government',   topic: 'foreign business and government contacts' },
  section20C:{ title: 'Foreign Travel',                  topic: 'your foreign travel' },
  section21: { title: 'Psychological & Emotional Health',topic: 'psychological and emotional health' },
  section21A:{ title: 'Court-Ordered Counseling',        topic: 'court-ordered counseling or treatment' },
  section21B:{ title: 'Adjudicated Incompetent',         topic: 'adjudication of mental incompetence' },
  section21C:{ title: 'Hospitalization',                 topic: 'hospitalization for mental health' },
  section21D:{ title: 'Health Care Professional',        topic: 'health care professional consultations' },
  section21E:{ title: 'Other Counseling',                topic: 'other mental health counseling' },
  section22: { title: 'Police Record',                   topic: 'your police record' },
  section23: { title: 'Illegal Drug Use & Activity',     topic: 'illegal drug use and activity' },
  section24: { title: 'Use of Alcohol',                  topic: 'alcohol use and related incidents' },
  section25: { title: 'Investigations & Clearance',      topic: 'your investigation and clearance history' },
  section26: { title: 'Financial Record',                topic: 'your financial record' },
  section27: { title: 'Information Technology',           topic: 'use of information technology systems' },
  section28: { title: 'Civil Court Actions',              topic: 'civil court actions' },
  section29: { title: 'Association Record',               topic: 'your association record' },
  section30: { title: 'Signature & Certification',        topic: 'your signature and certification' },
};

// Human-readable names for repeat group IDs
const REPEAT_GROUP_NAMES = {
  residency: 'Residence',
  section10_2: 'Additional Citizenship',
  section11_2: 'Residence',
  section11_3: 'Residence',
  section11_4: 'Residence',
  section_12_2: 'School',
  section_12_3: 'School',
  section_13_1: 'Employment',
  section_13_1_2: 'Employment',
  section13_2: 'Employment',
  section13_2_2: 'Employment',
  section13_3: 'Employment Verifier',
  section13_3_2: 'Employment Verifier',
  section13_4: 'Other Employment',
  section13_5: 'Federal Service',
  section14_1: 'Selective Service',
  section15_2: 'Military Service',
  section15_3: 'Military History',
  section16_1: 'Military Contact',
  section16_3: 'Personal Reference',
  section17_1: 'Spouse/Partner',
  section17_1_2: 'Former Spouse',
  section17_2: 'Former Spouse',
  section17_2_2: 'Former Spouse',
  section17_3: 'Cohabitant',
  section17_3_2: 'Former Cohabitant',
  section18_1: 'Relative',
  section18_1_1: 'Relative',
  section18_2: 'Relative Address',
  section18_3: 'Relative Citizenship',
  section19_1: 'Foreign Contact',
  section19_2: 'Foreign Contact',
  section19_3: 'Foreign Contact',
  section19_4: 'Foreign Contact',
  section22_1: 'Police Record',
  section22_2: 'Police Record',
  section22_3: 'Police Record',
  section22_3_1: 'Police Record',
  section22_4: 'Police Record',
  section22_5: 'Police Record',
  section22_6: 'Police Record',
  section23_1: 'Drug Activity',
  section23_2: 'Drug Activity',
  section_23_3: 'Drug Activity',
  section_23_4: 'Drug Activity',
  section_23_5: 'Drug Activity',
  section_23_6: 'Drug Treatment',
  section_23_6_1: 'Drug Treatment',
  section24_2: 'Alcohol Treatment',
  section24_3: 'Alcohol Incident',
  section24_4: 'Alcohol Counseling',
  section25_2: 'Clearance Record',
  section26_2: 'Bankruptcy',
  section26_3: 'Wage Garnishment',
  section26_6: 'Delinquent Account',
  section26_7: 'Delinquent Account',
  section26_8: 'Delinquent Account',
  section26_9: 'Delinquent Account',
  section27_2: 'IT Incident',
  section29_2: 'Association',
  section29_3: 'Association',
  section29_4: 'Association',
  section29_5: 'Association',
};

// ---------------------------------------------------------------------------
// Build lookup structures
// ---------------------------------------------------------------------------

// Identify gate fields: fields that other fields depend on
const gateKeys = new Set();
for (const f of registry) {
  if (f.dependsOn) gateKeys.add(f.dependsOn);
}

// Group fields by section (excluding ssnPageHeader)
const fieldsBySection = {};
for (const f of registry) {
  if (f.section === 'ssnPageHeader') continue;
  if (!fieldsBySection[f.section]) fieldsBySection[f.section] = [];
  fieldsBySection[f.section].push(f);
}

// ---------------------------------------------------------------------------
// Semantic grouping patterns
// ---------------------------------------------------------------------------

const SEMANTIC_PATTERNS = {
  address: /(?:street|city|state|country|zipCode|zip|address|apt|provideTheAddress|provideTheStreet|provideTheCurrent)/i,
  dates: /(?:date|Date|monthdayyear|isEstimate|isPresent|from|to.*month)/i,
  contact: /(?:phone|telephone|email|ext|extension|internationalOrDSN|cellmobile|mobilecell|daytime|evening|night|day$|day_)/i,
  name: /(?:Name|firstName|middleName|lastName|suffix|maiden)/i,
  citizenship: /(?:country.*citizen|citizenship|countryies|born|naturali)/i,
};

/**
 * Detect the semantic category of a field based on its semanticKey and label.
 */
function semanticCategory(field) {
  const key = field.semanticKey;
  const label = field.label || '';
  const combined = key + ' ' + label;

  // Check against known patterns
  if (SEMANTIC_PATTERNS.name.test(combined) && !SEMANTIC_PATTERNS.address.test(combined)) return 'name';
  if (SEMANTIC_PATTERNS.address.test(combined) && !SEMANTIC_PATTERNS.contact.test(combined)) return 'address';
  if (SEMANTIC_PATTERNS.contact.test(combined)) return 'contact';
  if (SEMANTIC_PATTERNS.dates.test(combined)) return 'dates';
  if (SEMANTIC_PATTERNS.citizenship.test(combined)) return 'citizenship';
  return 'other';
}

// ---------------------------------------------------------------------------
// Title and guidance generation
// ---------------------------------------------------------------------------

/**
 * Generate a human-readable title for a step based on its fields.
 */
function generateTitle(fields, sectionKey, opts = {}) {
  if (opts.isGate) {
    // Gate step: derive topic from label or section
    const gateField = fields[0];
    const topic = inferGateTopic(gateField, sectionKey);
    return topic;
  }

  if (opts.repeatGroup) {
    const groupName = REPEAT_GROUP_NAMES[opts.repeatGroup] || humanize(opts.repeatGroup);
    const entryNum = (opts.repeatIndex ?? 0) + 1;
    if (opts.subGroupLabel) {
      return `${groupName} ${entryNum} - ${opts.subGroupLabel}`;
    }
    return `${groupName} ${entryNum}`;
  }

  // Detect dominant category
  const categories = fields.map(f => semanticCategory(f));
  const catCounts = {};
  for (const c of categories) catCounts[c] = (catCounts[c] || 0) + 1;
  const dominant = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0][0];

  const secMeta = SECTION_META[sectionKey];
  const secTitle = secMeta ? secMeta.title : sectionKey;

  switch (dominant) {
    case 'name': return 'Name Information';
    case 'address': return 'Address';
    case 'contact': return 'Contact Information';
    case 'dates': return 'Dates';
    case 'citizenship': return 'Citizenship Details';
    default: {
      // Try to derive from labels
      const firstField = fields[0];
      if (firstField && firstField.label) {
        const label = firstField.label;
        // If the label starts with a section instruction, use a shorter form
        if (label.startsWith('Section ') || label.length > 60) {
          return secTitle;
        }
        return cleanTitle(label);
      }
      return secTitle;
    }
  }
}

/**
 * Infer the topic of a gate question from its context.
 */
function inferGateTopic(gateField, sectionKey) {
  // Look at the fields that depend on this gate to understand the topic
  const dependentFields = registry.filter(f => f.dependsOn === gateField.semanticKey);
  const secMeta = SECTION_META[sectionKey];

  // Use the gate's label if it's descriptive
  if (gateField.label && gateField.label !== 'RadioButtonList') {
    return cleanTitle(gateField.label);
  }

  // Derive from dependent fields or section
  if (dependentFields.length > 0) {
    const firstDep = dependentFields[0];
    if (firstDep.label && firstDep.label.startsWith('Complete the following')) {
      // Extract the topic from "Complete the following if you responded 'Yes' to..."
      const match = firstDep.label.match(/responded.*?to\s+(.*?)(?:\.|$)/i);
      if (match) {
        const topic = match[1].substring(0, 60);
        return `Do you have ${topic.toLowerCase()}?`;
      }
    }
  }

  if (secMeta) {
    return `Have you had ${secMeta.topic}?`;
  }

  return `${sectionKey} - Qualifying Question`;
}

/**
 * Generate guidance text for a step.
 */
function generateGuidance(fields, sectionKey, opts = {}) {
  const secMeta = SECTION_META[sectionKey];

  if (opts.isGate) {
    return `Answer whether you need to provide information about ${secMeta ? secMeta.topic : 'this topic'}. If you answer Yes, additional fields will appear.`;
  }

  if (opts.isConditional) {
    return `Provide the details requested. These fields are shown because you answered Yes to the qualifying question.`;
  }

  // Detect dominant category for guidance
  const categories = fields.map(f => semanticCategory(f));
  const catCounts = {};
  for (const c of categories) catCounts[c] = (catCounts[c] || 0) + 1;
  const dominant = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0][0];

  switch (dominant) {
    case 'name':
      return 'Enter all name fields as they appear on official documents.';
    case 'address':
      return 'Provide the complete address. For locations outside the United States, provide City and Country.';
    case 'contact':
      return 'Provide your telephone numbers and any extensions. Check the appropriate boxes for international or DSN numbers.';
    case 'dates':
      return 'Provide the requested dates. Check Estimate if the date is approximate, or Present if the period is ongoing.';
    default: {
      if (opts.repeatGroup) {
        const groupName = REPEAT_GROUP_NAMES[opts.repeatGroup] || humanize(opts.repeatGroup);
        return `Provide the requested information for this ${groupName.toLowerCase()} entry.`;
      }
      if (secMeta) {
        return `Provide ${secMeta.topic} as accurately as possible.`;
      }
      return 'Provide the requested information for this step.';
    }
  }
}

/**
 * Clean a label into a short title.
 */
function cleanTitle(label) {
  // Remove common prefixes
  let title = label
    .replace(/^Section \d+[A-Z]?\.\s*/i, '')
    .replace(/^Provide (the )?/i, '')
    .replace(/^Complete the following.*?[.]\s*/i, '')
    .replace(/^Enter\s+/i, '')
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .trim();

  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1);

  // Truncate to reasonable length
  if (title.length > 50) {
    const words = title.split(/\s+/);
    title = '';
    for (const w of words) {
      if ((title + ' ' + w).length > 45) break;
      title = title ? title + ' ' + w : w;
    }
  }

  return title || 'Details';
}

/**
 * Convert a camelCase or snake_case string to human-readable form.
 */
function humanize(str) {
  return str
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Step splitting logic
// ---------------------------------------------------------------------------

const MAX_STEP_SIZE = 8;
const TARGET_STEP_SIZE = 6;

/**
 * Split an array of fields into steps of appropriate size,
 * grouping by semantic affinity.
 */
function splitBySemantics(fields, sectionKey, opts = {}) {
  if (fields.length === 0) return [];
  if (fields.length <= MAX_STEP_SIZE) {
    return [fields];
  }

  // Tag each field with its semantic category
  const tagged = fields.map(f => ({ field: f, cat: semanticCategory(f) }));

  // Group consecutive fields of the same category
  const groups = [];
  let currentGroup = [tagged[0]];

  for (let i = 1; i < tagged.length; i++) {
    const prev = tagged[i - 1];
    const curr = tagged[i];
    if (curr.cat === prev.cat && currentGroup.length < MAX_STEP_SIZE) {
      currentGroup.push(curr);
    } else {
      groups.push(currentGroup);
      currentGroup = [curr];
    }
  }
  groups.push(currentGroup);

  // Merge small groups with their neighbors if they fit within limits
  const merged = [];
  let buffer = [];

  for (const group of groups) {
    if (buffer.length + group.length <= MAX_STEP_SIZE) {
      buffer.push(...group);
    } else {
      if (buffer.length > 0) merged.push(buffer);
      if (group.length > MAX_STEP_SIZE) {
        // Split oversized group into chunks
        for (let i = 0; i < group.length; i += TARGET_STEP_SIZE) {
          merged.push(group.slice(i, i + TARGET_STEP_SIZE));
        }
        buffer = [];
      } else {
        buffer = [...group];
      }
    }
  }
  if (buffer.length > 0) merged.push(buffer);

  return merged.map(g => g.map(t => t.field));
}

/**
 * Generate a step ID.
 */
function makeStepId(sectionKey, parts) {
  return [sectionKey, ...parts].join('.');
}

let stepCounter = 0;

/**
 * Generate a unique step suffix.
 */
function uniqueSuffix() {
  return String(++stepCounter);
}

// ---------------------------------------------------------------------------
// Per-section step generation
// ---------------------------------------------------------------------------

/**
 * Process a single section and return its WizardSteps.
 */
function processSection(sectionKey, fields) {
  stepCounter = 0;
  const steps = [];

  // Separate gate fields, repeat groups, and plain fields
  const gates = fields.filter(f => gateKeys.has(f.semanticKey));
  const gateKeySet = new Set(gates.map(f => f.semanticKey));

  // Build a map: gateKey -> dependents
  const gateDependents = {};
  for (const g of gates) {
    gateDependents[g.semanticKey] = fields.filter(f => f.dependsOn === g.semanticKey);
  }

  // Fields NOT in a gate chain and NOT a gate themselves
  const independentFields = fields.filter(f => !gateKeySet.has(f.semanticKey) && !f.dependsOn);

  // Fields dependent on a gate but NOT the gate itself
  const conditionalFields = fields.filter(f => f.dependsOn && !gateKeySet.has(f.semanticKey));

  // -----------------------------------------------------------------------
  // Small section shortcut
  // -----------------------------------------------------------------------
  if (fields.length <= 10 && gates.length === 0) {
    const hasRepeat = fields.some(f => f.repeatGroup);

    if (!hasRepeat) {
      // Single step for small, simple sections
      steps.push({
        id: makeStepId(sectionKey, ['main']),
        title: SECTION_META[sectionKey]?.title || sectionKey,
        guidance: generateGuidance(fields, sectionKey),
        fieldKeys: fields.map(f => f.semanticKey),
      });
      return steps;
    }
  }

  // -----------------------------------------------------------------------
  // Process independent (non-conditional, non-gate) fields
  // -----------------------------------------------------------------------

  // Separate into repeat-group instances and non-repeat
  const nonRepeatIndependent = independentFields.filter(f => !f.repeatGroup);
  const repeatIndependent = independentFields.filter(f => f.repeatGroup);

  // Non-repeat independent fields
  if (nonRepeatIndependent.length > 0) {
    const chunks = splitBySemantics(nonRepeatIndependent, sectionKey);
    for (const chunk of chunks) {
      const title = generateTitle(chunk, sectionKey);
      steps.push({
        id: makeStepId(sectionKey, ['info', uniqueSuffix()]),
        title,
        guidance: generateGuidance(chunk, sectionKey),
        fieldKeys: chunk.map(f => f.semanticKey),
      });
    }
  }

  // Repeat-group independent fields
  const repeatGroupInstances = groupByRepeatInstance(repeatIndependent);
  for (const [rgKey, instanceFields] of repeatGroupInstances) {
    const [repeatGroup, repeatIndex] = parseRepeatKey(rgKey);
    processRepeatGroupInstance(steps, sectionKey, instanceFields, repeatGroup, repeatIndex);
  }

  // -----------------------------------------------------------------------
  // Process gates and their conditional blocks
  // -----------------------------------------------------------------------

  for (const gate of gates) {
    const gateStep = {
      id: makeStepId(sectionKey, ['gate', uniqueSuffix()]),
      title: generateTitle([gate], sectionKey, { isGate: true }),
      guidance: generateGuidance([gate], sectionKey, { isGate: true }),
      fieldKeys: [gate.semanticKey],
      gateFieldKey: gate.semanticKey,
    };

    // If the gate is in a repeat group, attach that info
    if (gate.repeatGroup) {
      gateStep.repeatGroup = gate.repeatGroup;
      gateStep.repeatIndex = gate.repeatIndex;
    }

    steps.push(gateStep);

    // Process dependents of this gate
    const dependents = gateDependents[gate.semanticKey] || [];
    if (dependents.length > 0) {
      // Separate dependents into repeat/non-repeat
      const depNonRepeat = dependents.filter(f => !f.repeatGroup);
      const depRepeat = dependents.filter(f => f.repeatGroup);

      // Non-repeat conditional fields
      if (depNonRepeat.length > 0) {
        const chunks = splitBySemantics(depNonRepeat, sectionKey);
        for (const chunk of chunks) {
          const title = generateTitle(chunk, sectionKey);
          steps.push({
            id: makeStepId(sectionKey, ['cond', uniqueSuffix()]),
            title,
            guidance: generateGuidance(chunk, sectionKey, { isConditional: true }),
            fieldKeys: chunk.map(f => f.semanticKey),
            gateFieldKey: gate.semanticKey,
            isConditionalBlock: true,
          });
        }
      }

      // Repeat conditional fields
      const repeatInstances = groupByRepeatInstance(depRepeat);
      for (const [rgKey, instanceFields] of repeatInstances) {
        const [repeatGroup, repeatIndex] = parseRepeatKey(rgKey);
        processRepeatGroupInstance(steps, sectionKey, instanceFields, repeatGroup, repeatIndex, {
          gateFieldKey: gate.semanticKey,
          isConditional: true,
        });
      }
    }
  }

  // -----------------------------------------------------------------------
  // Process conditional fields NOT handled via gates above
  // (fields that dependsOn a field that is NOT in gateKeySet for this section --
  //  e.g. nested conditionals or cross-section gates)
  // -----------------------------------------------------------------------
  const handledConditionalKeys = new Set();
  for (const deps of Object.values(gateDependents)) {
    for (const d of deps) handledConditionalKeys.add(d.semanticKey);
  }

  const unhandledConditional = conditionalFields.filter(f => !handledConditionalKeys.has(f.semanticKey));
  if (unhandledConditional.length > 0) {
    // Group by their dependsOn field
    const byGate = {};
    for (const f of unhandledConditional) {
      if (!byGate[f.dependsOn]) byGate[f.dependsOn] = [];
      byGate[f.dependsOn].push(f);
    }

    for (const [depKey, deps] of Object.entries(byGate)) {
      const chunks = splitBySemantics(deps, sectionKey);
      for (const chunk of chunks) {
        const title = generateTitle(chunk, sectionKey);
        steps.push({
          id: makeStepId(sectionKey, ['nested', uniqueSuffix()]),
          title,
          guidance: generateGuidance(chunk, sectionKey, { isConditional: true }),
          fieldKeys: chunk.map(f => f.semanticKey),
          gateFieldKey: depKey,
          isConditionalBlock: true,
        });
      }
    }
  }

  return steps;
}

/**
 * Group fields by repeat group instance (repeatGroup:repeatIndex).
 */
function groupByRepeatInstance(fields) {
  const map = new Map();
  for (const f of fields) {
    if (!f.repeatGroup) continue;
    const key = `${f.repeatGroup}:${f.repeatIndex ?? 0}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(f);
  }
  return map;
}

function parseRepeatKey(key) {
  const [rg, ri] = key.split(':');
  return [rg, parseInt(ri, 10)];
}

/**
 * Process a single repeat group instance, generating multiple sub-steps.
 */
function processRepeatGroupInstance(steps, sectionKey, fields, repeatGroup, repeatIndex, opts = {}) {
  const groupName = REPEAT_GROUP_NAMES[repeatGroup] || humanize(repeatGroup);
  const entryNum = repeatIndex + 1;

  // Within a repeat group, look for sub-gates
  const subGates = fields.filter(f => gateKeys.has(f.semanticKey));
  const subGateKeySet = new Set(subGates.map(f => f.semanticKey));

  // Non-gate, non-conditional fields within this instance
  const plainFields = fields.filter(f => !subGateKeySet.has(f.semanticKey) && !f.dependsOn);
  // Conditional fields within this instance (dependsOn something in this instance)
  const condFields = fields.filter(f => f.dependsOn && !subGateKeySet.has(f.semanticKey));

  // Split plain fields into sub-steps by semantic affinity
  if (plainFields.length > 0) {
    const chunks = splitBySemantics(plainFields, sectionKey);
    let subIdx = 0;
    for (const chunk of chunks) {
      subIdx++;
      const subLabel = inferSubGroupLabel(chunk);
      const title = chunks.length === 1
        ? `${groupName} ${entryNum}`
        : `${groupName} ${entryNum} - ${subLabel}`;

      const step = {
        id: makeStepId(sectionKey, [repeatGroup, String(repeatIndex), 'sub' + subIdx]),
        title,
        guidance: generateGuidance(chunk, sectionKey, { repeatGroup }),
        fieldKeys: chunk.map(f => f.semanticKey),
        repeatGroup,
        repeatIndex,
      };

      if (opts.gateFieldKey) {
        step.gateFieldKey = opts.gateFieldKey;
        step.isConditionalBlock = true;
      }

      steps.push(step);
    }
  }

  // Sub-gates within repeat group
  for (const gate of subGates) {
    const gateStep = {
      id: makeStepId(sectionKey, [repeatGroup, String(repeatIndex), 'gate', uniqueSuffix()]),
      title: generateTitle([gate], sectionKey, { isGate: true }),
      guidance: generateGuidance([gate], sectionKey, { isGate: true }),
      fieldKeys: [gate.semanticKey],
      gateFieldKey: gate.semanticKey,
      repeatGroup,
      repeatIndex,
    };

    if (opts.gateFieldKey) {
      // This gate itself is conditional on a parent gate
      gateStep.isConditionalBlock = true;
    }

    steps.push(gateStep);

    // Dependents of this sub-gate
    const deps = fields.filter(f => f.dependsOn === gate.semanticKey);
    if (deps.length > 0) {
      const chunks = splitBySemantics(deps, sectionKey);
      let subIdx = 0;
      for (const chunk of chunks) {
        subIdx++;
        const subLabel = inferSubGroupLabel(chunk);
        steps.push({
          id: makeStepId(sectionKey, [repeatGroup, String(repeatIndex), 'cond', uniqueSuffix()]),
          title: `${groupName} ${entryNum} - ${subLabel}`,
          guidance: generateGuidance(chunk, sectionKey, { isConditional: true, repeatGroup }),
          fieldKeys: chunk.map(f => f.semanticKey),
          gateFieldKey: gate.semanticKey,
          isConditionalBlock: true,
          repeatGroup,
          repeatIndex,
        });
      }
    }
  }

  // Conditional fields not handled by sub-gates
  const handledBySubGates = new Set();
  for (const g of subGates) {
    for (const f of fields) {
      if (f.dependsOn === g.semanticKey) handledBySubGates.add(f.semanticKey);
    }
  }

  const unhandled = condFields.filter(f => !handledBySubGates.has(f.semanticKey));
  if (unhandled.length > 0) {
    const byGate = {};
    for (const f of unhandled) {
      if (!byGate[f.dependsOn]) byGate[f.dependsOn] = [];
      byGate[f.dependsOn].push(f);
    }

    for (const [depKey, deps] of Object.entries(byGate)) {
      const chunks = splitBySemantics(deps, sectionKey);
      for (const chunk of chunks) {
        const subLabel = inferSubGroupLabel(chunk);
        steps.push({
          id: makeStepId(sectionKey, [repeatGroup, String(repeatIndex), 'nested', uniqueSuffix()]),
          title: `${groupName} ${entryNum} - ${subLabel}`,
          guidance: generateGuidance(chunk, sectionKey, { isConditional: true, repeatGroup }),
          fieldKeys: chunk.map(f => f.semanticKey),
          gateFieldKey: depKey,
          isConditionalBlock: true,
          repeatGroup,
          repeatIndex,
        });
      }
    }
  }
}

/**
 * Infer a short label for a sub-group of fields based on their dominant category.
 */
function inferSubGroupLabel(fields) {
  const categories = fields.map(f => semanticCategory(f));
  const catCounts = {};
  for (const c of categories) catCounts[c] = (catCounts[c] || 0) + 1;
  const dominant = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0][0];

  switch (dominant) {
    case 'name': return 'Name';
    case 'address': return 'Address';
    case 'contact': return 'Contact';
    case 'dates': return 'Dates';
    case 'citizenship': return 'Citizenship';
    default: {
      // Try to get a label from the first field
      const first = fields[0];
      if (first && first.label && first.label !== 'RadioButtonList') {
        const shortLabel = cleanTitle(first.label);
        if (shortLabel.length <= 40) return shortLabel;
      }
      return 'Details';
    }
  }
}

// ---------------------------------------------------------------------------
// Post-processing: disambiguate consecutive duplicate titles
// ---------------------------------------------------------------------------

/**
 * When consecutive steps share the same title, append "(1/N)", "(2/N)" etc.
 * so users can distinguish between them in the step indicator and review panel.
 */
function disambiguateTitles(steps) {
  let i = 0;
  while (i < steps.length) {
    // Find a run of consecutive steps with the same title
    let j = i + 1;
    while (j < steps.length && steps[j].title === steps[i].title) {
      j++;
    }
    const runLength = j - i;
    if (runLength > 1) {
      for (let k = 0; k < runLength; k++) {
        steps[i + k].title = `${steps[i + k].title} (${k + 1}/${runLength})`;
      }
    }
    i = j;
  }
  return steps;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const allSections = Object.keys(fieldsBySection).sort((a, b) => {
    // Sort by section number, handling subsections like 13A, 21E
    const parseNum = s => {
      const m = s.match(/section(\d+)([A-E])?/);
      if (!m) return [999, ''];
      return [parseInt(m[1], 10), m[2] || ''];
    };
    const [na, sa] = parseNum(a);
    const [nb, sb] = parseNum(b);
    if (na !== nb) return na - nb;
    return sa.localeCompare(sb);
  });

  const output = {};
  let totalSteps = 0;
  let totalFields = 0;

  for (const sectionKey of allSections) {
    const fields = fieldsBySection[sectionKey];
    const steps = processSection(sectionKey, fields);
    disambiguateTitles(steps);

    output[sectionKey] = {
      sectionKey,
      steps,
    };

    totalSteps += steps.length;

    // Count all unique field keys in steps
    const allFieldKeys = new Set();
    for (const step of steps) {
      for (const k of step.fieldKeys) allFieldKeys.add(k);
    }
    totalFields += allFieldKeys.size;
  }

  // Validate: every field should appear in exactly one step
  const allStepFieldKeys = new Set();
  const duplicates = [];
  for (const [sec, config] of Object.entries(output)) {
    for (const step of config.steps) {
      for (const k of step.fieldKeys) {
        if (allStepFieldKeys.has(k)) {
          duplicates.push(k);
        }
        allStepFieldKeys.add(k);
      }
    }
  }

  // Count fields in the registry (excluding ssnPageHeader)
  const registryFieldCount = registry.filter(f => f.section !== 'ssnPageHeader').length;
  const missing = registry
    .filter(f => f.section !== 'ssnPageHeader' && !allStepFieldKeys.has(f.semanticKey))
    .map(f => f.semanticKey);

  console.log(`Generated wizard steps for ${allSections.length} sections`);
  console.log(`Total steps: ${totalSteps}`);
  console.log(`Total unique fields in steps: ${allStepFieldKeys.size}`);
  console.log(`Registry field count (excl. ssnPageHeader): ${registryFieldCount}`);
  if (duplicates.length > 0) {
    console.warn(`WARNING: ${duplicates.length} duplicate field keys in steps`);
    console.warn('First 10:', duplicates.slice(0, 10));
  }
  if (missing.length > 0) {
    console.warn(`WARNING: ${missing.length} fields not assigned to any step`);
    console.warn('First 10:', missing.slice(0, 10));
  }
  if (duplicates.length === 0 && missing.length === 0) {
    console.log('Validation: PASS - every field appears in exactly one step');
  }

  writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n');
  console.log(`Written to: ${outputPath}`);
}

main();
