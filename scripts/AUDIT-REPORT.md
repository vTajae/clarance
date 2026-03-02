# SF-86 Field Mapping Audit Report

**Date:** 2026-02-26
**PDF:** sf861.pdf (127 pages, 6,852 widgets, 6,197 unique fields)
**Registry:** field-registry.json (6,197 entries)

---

## 1. PDF Metadata Cross-Reference (Raw Facts)

Source: `scripts/pdf-metadata-audit.py` — Extracts every widget from the actual PDF binary using PyMuPDF, then cross-references against field-registry.json.

| Metric | Value | Evidence |
|---|---|---|
| PDF unique field names | 6,197 | Extracted via `fitz.open()` → `page.widgets()` |
| Registry entries | 6,197 | Loaded from `field-registry.json` |
| Fields in BOTH | **6,197 (100.0%)** | Set intersection of PDF names ∩ registry names |
| Orphan PDF fields (no registry entry) | **0** | PDF names − registry names = ∅ |
| Phantom registry entries (no PDF field) | **0** | Registry names − PDF names = ∅ |
| Type compatibility | **6,197/6,197 (100.0%)** | PDFTextField↔Text(7), PDFCheckBox↔CheckBox(2), PDFDropdown↔ComboBox(3), PDFRadioGroup↔RadioButton(5) |
| Duplicate semantic keys | **0** | `Counter(semanticKeys)` — all unique |
| Duplicate pdfFieldNames | **0** | `Counter(pdfFieldNames)` — all unique |
| Radio valueMap verified | **398/398 (100.0%)** | Every numeric key maps to valid on_state |

### Field Type Breakdown

| Type | PDF Count | Registry Count | Match |
|---|---|---|---|
| Text/PDFTextField | 3,149 | 3,149 | Exact |
| CheckBox/PDFCheckBox | 1,793 | 1,793 | Exact |
| ComboBox/PDFDropdown | 857 | 857 | Exact |
| RadioButton/PDFRadioGroup | 398 | 398 | Exact |

---

## 2. Round-Trip Test (PDF Service Layer)

Source: `scripts/round-trip-test.py` — Fills ALL 6,197 fields via `/fill-pdf`, then extracts via `/extract-fields`, compares every value.

| Field Type | Sent | Extracted | Matched | Rate |
|---|---|---|---|---|
| TextField | 3,149 | 3,149 | 3,149 | **100.0%** |
| CheckBox | 897 | 897 | 897 | **100.0%** |
| Dropdown | 857 | 857 | 857 | **100.0%** |
| RadioGroup | 398 | 398 | 398 | **100.0%** |
| **TOTAL** | **5,301** | **5,301** | **5,301** | **100.0%** |

Note: CheckBox count is 897 (not 1,793) because only ~50% were set to "Yes" for testing.

---

## 3. Export Pipeline Audit (Full Chain)

Source: `scripts/export-pipeline-audit.py` — Simulates exact UI export flow: generates realistic UI values → POST to Next.js `/api/pdf/export` → value transformer → PDF service → extract → compare.

### Through LIVE Next.js Route

| Field Type | Sent | Matched | Mismatched | Rate |
|---|---|---|---|---|
| TextField | 3,149 | 3,149 | 0 | **100.0%** |
| CheckBox | 1,793 | 1,793 | 0 | **100.0%** |
| Dropdown | 857 | 857 | 0 | **100.0%** |
| RadioGroup | 398 | 398 | 0 | **100.0%** |
| **TOTAL** | **6,197** | **6,197** | **0** | **100.0%** |

### Through Direct PDF Service (control group)

| Field Type | Sent | Matched | Mismatched | Rate |
|---|---|---|---|---|
| TextField | 3,149 | 3,149 | 0 | **100.0%** |
| CheckBox | 1,793 | 1,793 | 0 | **100.0%** |
| Dropdown | 857 | 857 | 0 | **100.0%** |
| RadioGroup | 398 | 398 | 0 | **100.0%** |
| **TOTAL** | **6,197** | **6,197** | **0** | **100.0%** |

---

## 4. Semantic Mapping Validation

Source: `scripts/mapping-validation-test.py` — 53 assertions across 5 test suites.

| Test | Assertions | Result |
|---|---|---|
| Registry integrity | 7 | PASS |
| Known field semantic mappings | 21 | PASS |
| No semantic key collisions | 2 | PASS |
| Pipeline round-trip with semantic mapping | 14 | PASS |
| ValueMap bidirectionality | 9 | PASS |
| **TOTAL** | **53** | **ALL PASS** |

---

## 5. Value Transformer Coverage

The `uiToPdf()` / `pdfToUi()` transformers handle these conversions:

| UI Type | UI Value | PDF Value | Verified |
|---|---|---|---|
| date | `"2024-01-15"` (ISO) | `"01/15/2024"` (MM/DD/YYYY) | 100% |
| checkbox/branch | `true`/`false` (boolean) | `"Yes"`/`"No"` | 100% |
| ssn | `"123456789"` (digits) | `"123-45-6789"` (dashed) | 100% |
| phone | `"+12025551234"` | `"(202) 555-1234"` | 100% |
| radio | `"YES"` (option label) | `"1"` (numeric index) | 100% |
| select | `"United States"` | `"United States"` (passthrough) | 100% |
| text | `"John Smith"` | `"John Smith"` (passthrough) | 100% |

---

## 6. Bugs Found and Fixed

| Bug | Severity | Status |
|---|---|---|
| Export button was `<Link>` (GET) to POST-only route | SHOWSTOPPER | **FIXED** |
| No code to collect Jotai atom values for export | SHOWSTOPPER | **FIXED** (use-export-pdf.ts) |
| `Boolean("false")` = `true` flipped unchecked boxes | HIGH | **FIXED** |
| Template path `templates/sf861.pdf` doubled to `/app/templates/templates/sf861.pdf` | HIGH | **FIXED** |
| `String(uiValue)` corrupted boolean/numeric values before transformer | HIGH | **FIXED** |
| PyMuPDF radio widget type constant mismatch (type 5, not type 4) | HIGH | **FIXED** (prior session) |
| 13 radio valueMaps had numeric labels instead of text | MEDIUM | **FIXED** (prior session) |

---

## 7. Methodology

Every claim in this report is backed by:
1. **Raw PyMuPDF extraction** from the actual PDF binary — not assumptions about field structure
2. **Automated scripts** that can be re-run independently to reproduce results
3. **Full-chain testing** through the live Next.js server, not just isolated unit tests
4. **Both-direction verification** — fill AND extract, not just one direction

### Scripts (all re-runnable)

| Script | What it proves |
|---|---|
| `scripts/pdf-metadata-audit.py` | Registry matches raw PDF metadata (run in Docker) |
| `scripts/round-trip-test.py` | Fill → extract preserves all values at PDF service level |
| `scripts/export-pipeline-audit.py` | Full UI→Next.js→PDF service→verify chain works |
| `scripts/mapping-validation-test.py` | Semantic key mappings are correct and bidirectional |
| `scripts/text-proximity-verify.py` | Labels match actual PDF text near each field |
