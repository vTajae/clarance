/**
 * SF-86 Field Registry -- Round-Trip Validation Script
 *
 * Validates that the field registry mappings are correct by:
 *   1. Loading all 6,197 field definitions from field-registry.json
 *   2. Generating deterministic sentinel values for each field
 *   3. Filling a PDF via the Python PDF service with those sentinels
 *   4. Extracting the values back from the filled PDF
 *   5. Comparing sent vs extracted values field-by-field
 *   6. Producing a detailed validation report
 *
 * Usage:
 *   npx tsx scripts/validate-round-trip.ts [--template <path>] [--service <url>]
 *
 * Requires the Python PDF service to be running at http://localhost:8001
 * (or the URL specified by --service).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Path resolution
// ---------------------------------------------------------------------------

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = resolve(SCRIPT_DIR, '..');
const REGISTRY_PATH = resolve(APP_DIR, 'src/lib/field-registry/field-registry.json');
const REPORT_PATH = resolve(SCRIPT_DIR, 'validation-report.json');

// Default values (overridden by CLI args)
const DEFAULT_SERVICE_URL = 'http://localhost:8001';
const DEFAULT_TEMPLATE_PATH = 'sf86.pdf';

// ---------------------------------------------------------------------------
// Types (mirrored from registry types to avoid import path issues)
// ---------------------------------------------------------------------------

interface FieldDefinition {
  pdfFieldName: string;
  pdfObjectRef: string;
  pdfFieldType: 'PDFTextField' | 'PDFCheckBox' | 'PDFRadioGroup' | 'PDFDropdown';
  pdfPage: number;
  semanticKey: string;
  section: string;
  label: string;
  uiFieldType: string;
  required: boolean;
  classificationConfidence: number;
  manuallyVerified: boolean;
  maxLength?: number;
  options?: string[];
  valueMap?: Record<string, string>;
  repeatGroup?: string;
  repeatIndex?: number;
  sectionGroup?: string;
  sf86SectionId?: number;
  sf86SectionName?: string;
  referenceValue?: string;
}

interface MismatchEntry {
  pdfFieldName: string;
  semanticKey: string;
  section: string;
  label: string;
  pdfFieldType: string;
  expected: string;
  actual: string;
  confidence: number;
}

interface MissingEntry {
  pdfFieldName: string;
  semanticKey: string;
  section: string;
  label: string;
  pdfFieldType: string;
  confidence: number;
}

interface ExtraEntry {
  pdfFieldName: string;
  extractedValue: string;
}

interface SectionStats {
  total: number;
  matched: number;
  mismatched: number;
  missing: number;
}

interface ConfidenceStats {
  total: number;
  matched: number;
  mismatched: number;
  missing: number;
  matchRate: string;
}

interface ValidationReport {
  timestamp: string;
  templatePath: string;
  serviceUrl: string;
  summary: {
    total: number;
    matched: number;
    mismatched: number;
    missing: number;
    extra: number;
    matchRate: string;
  };
  mismatches: MismatchEntry[];
  missing: MissingEntry[];
  extra: ExtraEntry[];
  bySection: Record<string, SectionStats>;
  byConfidence: {
    high: ConfidenceStats;
    medium: ConfidenceStats;
    low: ConfidenceStats;
  };
  byFieldType: Record<string, SectionStats>;
}

// ---------------------------------------------------------------------------
// ANSI color helpers
// ---------------------------------------------------------------------------

const color = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
};

function greenText(s: string): string { return `${color.green}${s}${color.reset}`; }
function redText(s: string): string { return `${color.red}${s}${color.reset}`; }
function yellowText(s: string): string { return `${color.yellow}${s}${color.reset}`; }
function cyanText(s: string): string { return `${color.cyan}${s}${color.reset}`; }
function boldText(s: string): string { return `${color.bold}${s}${color.reset}`; }
function dimText(s: string): string { return `${color.dim}${s}${color.reset}`; }

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(): { serviceUrl: string; templatePath: string } {
  const args = process.argv.slice(2);
  let serviceUrl = DEFAULT_SERVICE_URL;
  let templatePath = DEFAULT_TEMPLATE_PATH;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--service' && args[i + 1]) {
      serviceUrl = args[++i];
    } else if (args[i] === '--template' && args[i + 1]) {
      templatePath = args[++i];
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: npx tsx scripts/validate-round-trip.ts [options]

Options:
  --service <url>      PDF service URL (default: ${DEFAULT_SERVICE_URL})
  --template <path>    Template PDF path for fill-pdf (default: ${DEFAULT_TEMPLATE_PATH})
  --help, -h           Show this help message
`);
      process.exit(0);
    }
  }

  return { serviceUrl, templatePath };
}

// ---------------------------------------------------------------------------
// Sentinel value generation
// ---------------------------------------------------------------------------

/**
 * Generate a deterministic sentinel value for a field based on its type,
 * index, and semantic key. The sentinel must be recognizable so that any
 * corruption or mapping error is immediately obvious.
 */
function generateSentinel(field: FieldDefinition, index: number): string {
  switch (field.pdfFieldType) {
    case 'PDFTextField': {
      // Build a readable sentinel that encodes the index and a truncated key
      const keyPart = field.semanticKey
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 20);
      const raw = `F${index}_${keyPart}`;
      const maxLen = field.maxLength ?? 30;
      return raw.substring(0, maxLen);
    }

    case 'PDFCheckBox': {
      // Cycle between Yes and No based on index parity
      return index % 2 === 0 ? 'Yes' : 'No';
    }

    case 'PDFDropdown': {
      // Pick the first available option, or fall back to a default
      if (field.options && field.options.length > 0) {
        // Cycle through available options based on index
        return field.options[index % field.options.length];
      }
      return 'Option1';
    }

    case 'PDFRadioGroup': {
      // Radio buttons in XFA-converted PDFs use numeric indices internally.
      // PyMuPDF sets/extracts radio values as "1", "2", etc.
      // Use numeric index sentinels so the round-trip comparison works.
      if (field.options && field.options.length > 0) {
        const optionIndex = (index % field.options.length) + 1;
        return String(optionIndex);
      }
      return '1';
    }

    default:
      return `SENTINEL_${index}`;
  }
}

// ---------------------------------------------------------------------------
// PDF service interaction
// ---------------------------------------------------------------------------

/**
 * Check whether the PDF service is reachable.
 */
async function checkServiceHealth(serviceUrl: string): Promise<boolean> {
  try {
    const resp = await fetch(`${serviceUrl}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) return false;
    const body = await resp.json() as { status: string };
    return body.status === 'healthy';
  } catch {
    return false;
  }
}

/**
 * Fill a PDF template with the provided field values via the PDF service.
 * Returns the filled PDF as a Buffer.
 */
async function fillPdf(
  serviceUrl: string,
  templatePath: string,
  fieldValues: Record<string, string>,
): Promise<Buffer> {
  const resp = await fetch(`${serviceUrl}/fill-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template_path: templatePath,
      field_values: fieldValues,
    }),
    signal: AbortSignal.timeout(600_000), // 10min for large PDF (6,197 fields with widget updates)
  });

  if (!resp.ok) {
    const detail = await resp.text().catch(() => 'unknown error');
    throw new Error(`fill-pdf failed (${resp.status}): ${detail}`);
  }

  const arrayBuf = await resp.arrayBuffer();
  return Buffer.from(arrayBuf);
}

/**
 * Extract all field values from a filled PDF via the PDF service.
 * Returns a map of pdfFieldName -> extracted value.
 */
async function extractFields(
  serviceUrl: string,
  pdfBuffer: Buffer,
): Promise<Record<string, string>> {
  // Build multipart/form-data manually using the Blob API
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' });
  formData.append('file', blob, 'roundtrip_test.pdf');

  const resp = await fetch(`${serviceUrl}/extract-fields`, {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(600_000), // 10min for large PDF extraction
  });

  if (!resp.ok) {
    const detail = await resp.text().catch(() => 'unknown error');
    throw new Error(`extract-fields failed (${resp.status}): ${detail}`);
  }

  const body = await resp.json() as { field_count: number; fields: Record<string, string> };
  return body.fields;
}

// ---------------------------------------------------------------------------
// Confidence band classification
// ---------------------------------------------------------------------------

function confidenceBand(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 0.9) return 'high';
  if (confidence >= 0.7) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// Comparison logic
// ---------------------------------------------------------------------------

/**
 * Normalize values for comparison.
 *
 * The PDF service may return checkbox values differently from what we sent
 * (e.g. "Off" instead of "No", or boolean-like strings). We normalize both
 * sides to allow fair comparison.
 */
function normalizeForComparison(
  value: string,
  pdfFieldType: string,
): string {
  if (pdfFieldType === 'PDFCheckBox') {
    const lower = String(value).toLowerCase().trim();
    if (['yes', 'on', 'true', '1'].includes(lower)) return 'YES';
    return 'NO';
  }
  if (pdfFieldType === 'PDFRadioGroup') {
    // Radio buttons may extract as 'Off' when not selected, or as a
    // numeric index. Normalize 'Off' to '0' for comparison.
    const trimmed = String(value).trim();
    if (trimmed.toLowerCase() === 'off') return '0';
    return trimmed;
  }
  // For text, dropdown: exact string comparison
  return String(value);
}

// ---------------------------------------------------------------------------
// Main validation flow
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const startTime = Date.now();
  const { serviceUrl, templatePath } = parseArgs();

  console.log('');
  console.log(boldText('=== SF-86 Round-Trip Validation ==='));
  console.log('');

  // ---- Step 0: Load registry ----
  console.log(cyanText('[1/5]'), 'Loading field registry...');
  let registry: FieldDefinition[];
  try {
    const raw = readFileSync(REGISTRY_PATH, 'utf-8');
    registry = JSON.parse(raw) as FieldDefinition[];
  } catch (err) {
    console.error(redText('ERROR:'), `Failed to load field registry at ${REGISTRY_PATH}`);
    console.error('  ', (err as Error).message);
    process.exit(1);
  }
  console.log(`  Loaded ${boldText(String(registry.length))} field definitions`);

  // ---- Step 1: Check service health ----
  console.log(cyanText('[2/5]'), `Checking PDF service at ${serviceUrl}...`);
  const healthy = await checkServiceHealth(serviceUrl);
  if (!healthy) {
    console.error('');
    console.error(redText('ERROR: PDF service is not reachable.'));
    console.error('');
    console.error('  Make sure the Python FastAPI PDF service is running:');
    console.error(`    cd pdf-service && uvicorn main:app --port 8001`);
    console.error('');
    console.error(`  Tried: ${serviceUrl}/health`);
    process.exit(1);
  }
  console.log(greenText('  Service is healthy'));

  // ---- Step 2: Generate sentinel values ----
  console.log(cyanText('[3/5]'), 'Generating sentinel values...');
  const sentinels: Record<string, string> = {};
  const fieldByPdfName = new Map<string, FieldDefinition>();

  for (let i = 0; i < registry.length; i++) {
    const field = registry[i];
    const sentinel = generateSentinel(field, i);
    sentinels[field.pdfFieldName] = sentinel;
    fieldByPdfName.set(field.pdfFieldName, field);
  }

  const typeCounts: Record<string, number> = {};
  for (const field of registry) {
    typeCounts[field.pdfFieldType] = (typeCounts[field.pdfFieldType] || 0) + 1;
  }
  console.log('  Sentinel breakdown:');
  for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${type}: ${count}`);
  }

  // ---- Step 3: Fill PDF ----
  console.log(cyanText('[4/5]'), `Filling PDF (template: ${templatePath}, ${Object.keys(sentinels).length} fields)...`);
  let filledPdf: Buffer;
  try {
    filledPdf = await fillPdf(serviceUrl, templatePath, sentinels);
  } catch (err) {
    console.error(redText('ERROR:'), 'Failed to fill PDF');
    console.error('  ', (err as Error).message);
    process.exit(1);
  }
  console.log(`  Filled PDF: ${(filledPdf.length / 1024 / 1024).toFixed(1)} MB`);

  // ---- Step 4: Extract fields ----
  console.log(cyanText('[5/5]'), 'Extracting fields from filled PDF...');
  let extracted: Record<string, string>;
  try {
    extracted = await extractFields(serviceUrl, filledPdf);
  } catch (err) {
    console.error(redText('ERROR:'), 'Failed to extract fields');
    console.error('  ', (err as Error).message);
    process.exit(1);
  }
  console.log(`  Extracted ${Object.keys(extracted).length} field values`);

  // ---- Step 5: Compare ----
  console.log('');
  console.log(boldText('--- Comparing sent vs extracted ---'));
  console.log('');

  const mismatches: MismatchEntry[] = [];
  const missing: MissingEntry[] = [];
  const extra: ExtraEntry[] = [];
  let matched = 0;

  const bySection: Record<string, SectionStats> = {};
  const byConfidenceAccum: Record<string, { total: number; matched: number; mismatched: number; missing: number }> = {
    high: { total: 0, matched: 0, mismatched: 0, missing: 0 },
    medium: { total: 0, matched: 0, mismatched: 0, missing: 0 },
    low: { total: 0, matched: 0, mismatched: 0, missing: 0 },
  };
  const byFieldType: Record<string, SectionStats> = {};

  // Track which extracted fields we have accounted for
  const accountedExtracted = new Set<string>();

  for (const field of registry) {
    const sent = sentinels[field.pdfFieldName];
    const section = field.section;
    const band = confidenceBand(field.classificationConfidence);
    const fType = field.pdfFieldType;

    // Initialize accumulators
    if (!bySection[section]) {
      bySection[section] = { total: 0, matched: 0, mismatched: 0, missing: 0 };
    }
    if (!byFieldType[fType]) {
      byFieldType[fType] = { total: 0, matched: 0, mismatched: 0, missing: 0 };
    }

    bySection[section].total++;
    byConfidenceAccum[band].total++;
    byFieldType[fType].total++;

    if (!(field.pdfFieldName in extracted)) {
      // --- Missing: we sent a value but it was not extracted back ---
      //
      // Important nuance: the extraction function only returns fields with
      // non-empty values. For checkboxes, it always returns a value ("Yes"
      // or "No"). For text/dropdown/radio, it skips empty/falsy values.
      //
      // A checkbox sentinel of "No" gets written as "Off" by the fill logic.
      // During extraction, the extract function normalizes "Off" to "No" and
      // always returns it. So checkboxes should never be missing.
      //
      // For radio groups, if the sentinel doesn't match any valid appearance
      // state (export value), PyMuPDF may not persist it, causing a miss.

      missing.push({
        pdfFieldName: field.pdfFieldName,
        semanticKey: field.semanticKey,
        section: field.section,
        label: field.label,
        pdfFieldType: field.pdfFieldType,
        confidence: field.classificationConfidence,
      });
      bySection[section].missing++;
      byConfidenceAccum[band].missing++;
      byFieldType[fType].missing++;
    } else {
      accountedExtracted.add(field.pdfFieldName);
      const extractedValue = extracted[field.pdfFieldName];

      const normSent = normalizeForComparison(sent, field.pdfFieldType);
      const normExtracted = normalizeForComparison(extractedValue, field.pdfFieldType);

      if (normSent === normExtracted) {
        matched++;
        bySection[section].matched++;
        byConfidenceAccum[band].matched++;
        byFieldType[fType].matched++;
      } else {
        mismatches.push({
          pdfFieldName: field.pdfFieldName,
          semanticKey: field.semanticKey,
          section: field.section,
          label: field.label,
          pdfFieldType: field.pdfFieldType,
          expected: sent,
          actual: extractedValue,
          confidence: field.classificationConfidence,
        });
        bySection[section].mismatched++;
        byConfidenceAccum[band].mismatched++;
        byFieldType[fType].mismatched++;
      }
    }
  }

  // Detect extra fields (in extraction but not in our registry)
  for (const [name, value] of Object.entries(extracted)) {
    if (!accountedExtracted.has(name) && !fieldByPdfName.has(name)) {
      extra.push({
        pdfFieldName: name,
        extractedValue: String(value),
      });
    }
  }

  // ---- Build report ----
  const total = registry.length;
  const matchRate = total > 0 ? ((matched / total) * 100).toFixed(2) : '0.00';

  const byConfidenceReport = {
    high: {
      ...byConfidenceAccum.high,
      matchRate: byConfidenceAccum.high.total > 0
        ? ((byConfidenceAccum.high.matched / byConfidenceAccum.high.total) * 100).toFixed(2) + '%'
        : 'N/A',
    },
    medium: {
      ...byConfidenceAccum.medium,
      matchRate: byConfidenceAccum.medium.total > 0
        ? ((byConfidenceAccum.medium.matched / byConfidenceAccum.medium.total) * 100).toFixed(2) + '%'
        : 'N/A',
    },
    low: {
      ...byConfidenceAccum.low,
      matchRate: byConfidenceAccum.low.total > 0
        ? ((byConfidenceAccum.low.matched / byConfidenceAccum.low.total) * 100).toFixed(2) + '%'
        : 'N/A',
    },
  };

  const report: ValidationReport = {
    timestamp: new Date().toISOString(),
    templatePath,
    serviceUrl,
    summary: {
      total,
      matched,
      mismatched: mismatches.length,
      missing: missing.length,
      extra: extra.length,
      matchRate: matchRate + '%',
    },
    mismatches,
    missing,
    extra,
    bySection,
    byConfidence: byConfidenceReport,
    byFieldType,
  };

  // ---- Write report to disk ----
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  // ---- Print console summary ----
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(boldText('============================================'));
  console.log(boldText('         ROUND-TRIP VALIDATION REPORT'));
  console.log(boldText('============================================'));
  console.log('');

  // Overall summary
  const matchRateNum = parseFloat(matchRate);
  const rateColor = matchRateNum >= 95 ? greenText : matchRateNum >= 80 ? yellowText : redText;
  console.log(`  Total fields:    ${boldText(String(total))}`);
  console.log(`  Matched:         ${greenText(String(matched))}`);
  console.log(`  Mismatched:      ${mismatches.length > 0 ? redText(String(mismatches.length)) : greenText('0')}`);
  console.log(`  Missing:         ${missing.length > 0 ? yellowText(String(missing.length)) : greenText('0')}`);
  console.log(`  Extra:           ${extra.length > 0 ? yellowText(String(extra.length)) : dimText('0')}`);
  console.log(`  Match rate:      ${rateColor(matchRate + '%')}`);
  console.log('');

  // By field type
  console.log(boldText('  By Field Type:'));
  for (const [fType, stats] of Object.entries(byFieldType).sort((a, b) => b[1].total - a[1].total)) {
    const rate = stats.total > 0 ? ((stats.matched / stats.total) * 100).toFixed(1) : '0.0';
    const rateCol = parseFloat(rate) >= 95 ? greenText : parseFloat(rate) >= 80 ? yellowText : redText;
    console.log(
      `    ${fType.padEnd(16)} ` +
      `${String(stats.total).padStart(5)} total  ` +
      `${greenText(String(stats.matched).padStart(5))} match  ` +
      `${stats.mismatched > 0 ? redText(String(stats.mismatched).padStart(5)) : dimText('    0')} mismatch  ` +
      `${stats.missing > 0 ? yellowText(String(stats.missing).padStart(5)) : dimText('    0')} missing  ` +
      `${rateCol(rate + '%')}`
    );
  }
  console.log('');

  // By confidence
  console.log(boldText('  By Confidence Band:'));
  for (const [band, stats] of Object.entries(byConfidenceReport)) {
    if (stats.total === 0) continue;
    const label = band === 'high' ? '>=0.9' : band === 'medium' ? '0.7-0.9' : '<0.7';
    console.log(
      `    ${(band + ' (' + label + ')').padEnd(22)} ` +
      `${String(stats.total).padStart(5)} total  ` +
      `${greenText(String(stats.matched).padStart(5))} match  ` +
      `${stats.mismatched > 0 ? redText(String(stats.mismatched).padStart(5)) : dimText('    0')} mismatch  ` +
      `${stats.missing > 0 ? yellowText(String(stats.missing).padStart(5)) : dimText('    0')} missing  ` +
      `${stats.matchRate}`
    );
  }
  console.log('');

  // By section (top 10 worst sections)
  const sectionEntries = Object.entries(bySection)
    .map(([section, stats]) => ({
      section,
      ...stats,
      rate: stats.total > 0 ? (stats.matched / stats.total) * 100 : 100,
    }))
    .sort((a, b) => a.rate - b.rate);

  const worstSections = sectionEntries.filter(s => s.rate < 100).slice(0, 10);
  if (worstSections.length > 0) {
    console.log(boldText('  Sections with Issues (worst first):'));
    for (const s of worstSections) {
      const rateStr = s.rate.toFixed(1);
      const rCol = s.rate >= 95 ? greenText : s.rate >= 80 ? yellowText : redText;
      console.log(
        `    ${s.section.padEnd(24)} ` +
        `${String(s.total).padStart(4)} total  ` +
        `${s.mismatched > 0 ? redText(String(s.mismatched).padStart(3)) : dimText('  0')} mismatch  ` +
        `${s.missing > 0 ? yellowText(String(s.missing).padStart(3)) : dimText('  0')} missing  ` +
        `${rCol(rateStr + '%')}`
      );
    }
    console.log('');
  }

  // Sample mismatches (first 10)
  if (mismatches.length > 0) {
    const sample = mismatches.slice(0, 10);
    console.log(redText(boldText(`  First ${sample.length} of ${mismatches.length} mismatches:`)));
    for (const m of sample) {
      console.log(`    ${dimText(m.pdfFieldType.padEnd(14))} ${m.pdfFieldName}`);
      console.log(`      semantic: ${cyanText(m.semanticKey)}`);
      console.log(`      expected: ${greenText(JSON.stringify(m.expected))}`);
      console.log(`      actual:   ${redText(JSON.stringify(m.actual))}`);
    }
    if (mismatches.length > 10) {
      console.log(dimText(`    ... and ${mismatches.length - 10} more (see validation-report.json)`));
    }
    console.log('');
  }

  // Sample missing (first 10)
  if (missing.length > 0) {
    const sample = missing.slice(0, 10);
    console.log(yellowText(boldText(`  First ${sample.length} of ${missing.length} missing fields:`)));
    for (const m of sample) {
      console.log(`    ${dimText(m.pdfFieldType.padEnd(14))} ${m.pdfFieldName}`);
      console.log(`      semantic: ${cyanText(m.semanticKey)}`);
    }
    if (missing.length > 10) {
      console.log(dimText(`    ... and ${missing.length - 10} more (see validation-report.json)`));
    }
    console.log('');
  }

  // Extra fields
  if (extra.length > 0) {
    const sample = extra.slice(0, 5);
    console.log(yellowText(boldText(`  ${extra.length} extra fields (in PDF but not in registry):`)));
    for (const e of sample) {
      console.log(`    ${e.pdfFieldName} = ${JSON.stringify(e.extractedValue)}`);
    }
    if (extra.length > 5) {
      console.log(dimText(`    ... and ${extra.length - 5} more (see validation-report.json)`));
    }
    console.log('');
  }

  console.log(dimText(`  Report saved to: ${REPORT_PATH}`));
  console.log(dimText(`  Elapsed: ${elapsed}s`));
  console.log('');

  // Exit code: 0 if match rate >= 80%, otherwise 1
  if (matchRateNum < 80) {
    console.log(redText(boldText('  FAIL: Match rate below 80% threshold.')));
    console.log('');
    process.exit(1);
  } else if (matchRateNum < 95) {
    console.log(yellowText(boldText('  WARN: Match rate below 95%. Review mismatches.')));
    console.log('');
    process.exit(0);
  } else {
    console.log(greenText(boldText('  PASS: Match rate is above 95%.')));
    console.log('');
    process.exit(0);
  }
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

main().catch((err) => {
  console.error('');
  console.error(redText('FATAL:'), (err as Error).message);
  console.error((err as Error).stack);
  process.exit(1);
});
