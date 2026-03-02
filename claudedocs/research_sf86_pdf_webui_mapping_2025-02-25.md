# Research Report: SF-86 PDF-to-Web-UI Bidirectional Mapping

**Date**: 2025-02-25
**Scope**: Deep research on optimal architecture for mapping SF-86 PDF form fields to a web UI and back
**Confidence**: High (based on legacy codebase analysis, library research, and prior art review)

---

## Executive Summary

The SF-86 (Questionnaire for National Security Positions) is a 127-page government form with **6,197 AcroForm fields** (converted from XFA). The core challenge is building a reliable bidirectional pipeline: **PDF fields -> semantic mapping -> web UI -> user input -> PDF output**. The project has 3 legacy attempts (`clarance-b`, `clarance-f`, `clarance-says`) that got close but never perfected the mapping.

**The critical bottleneck** is that 68% of the 6,197 fields have generic names like `TextField11[0]` or `#field[7]`. An LLM will be used **one time only** to classify these fields into semantic labels, producing a static mapping dictionary. Once that mapping exists, the system is pure engineering with no AI dependency at runtime.

### Key Recommendations

1. **Use LLM to generate the field classification mapping once**, producing a `field-registry.json`
2. **Keep pdf-lib for client-side operations** but patch the known performance bug (50x speedup available)
3. **Add a Python microservice (PyMuPDF/fitz)** for heavy PDF operations (extraction, bulk filling, continuation pages)
4. **Schema-driven form generation** from the field registry using Zod + React Hook Form + Jotai
5. **Hybrid UI**: web form for data entry + pdf.js preview pane for visual reference

---

## 1. Current State: Legacy Codebase Analysis

### Project Structure
```
legacy/
  clarance-b/    -- Remix + pdf-lib + IndexedDB (most complete)
  clarance-f/    -- Earlier attempt
  clarance-says/ -- Earlier attempt
```

### What `clarance-b` Does Right
- Uses `pdf-lib` to extract all 6,197 fields with name, ID, type, and value
- TypeScript interfaces for all 29 SF-86 sections (`ApplicantFormValues`)
- `Field<T>` generic with `{ value: T, id: string, type: string }` for bidirectional mapping
- ID-based mapping (`"9502 0 R"`) between web state and PDF fields
- IndexedDB for client-side persistence
- Remix action handlers for PDF generation and JSON export

### What Failed / Remains Incomplete
- **68% of fields are unmapped** — generic names like `TextField11[0]` have no semantic meaning
- **Manual mapping is incomplete** — only partial sections have working UI ↔ PDF mapping
- **No repeating group handling** — the PDF has sections like `section13_2[0]`, `[1]`, `[2]` (3 employment entries) but no overflow strategy when a user has 4+ employers
- **Performance** — pdf-lib is slow with 6,197 fields (known issue #1184, ~32s for 1,000 fields)
- **pdf-lib is abandoned** — last commit May 2023, 250+ unresolved issues
- **FormUtils class is empty** — `app/utils/forms/index.tsx` has no implementation

### PDF Field Statistics

| Field Type | Count | Percentage |
|---|---|---|
| PDFTextField | 3,149 | 50.8% |
| PDFCheckBox | 1,793 | 28.9% |
| PDFDropdown | 857 | 13.8% |
| PDFRadioGroup | 398 | 6.4% |
| **Total** | **6,197** | **100%** |

| Name Quality | Count | Percentage |
|---|---|---|
| Semantic (e.g., `suffix[0]`, `From_Datefield_Name_2`) | 1,954 | 31% |
| Generic (e.g., `TextField11[0]`, `#field[7]`) | 4,243 | 68% |

### Section Distribution (Top 20 by field count)

| Section | Fields | SF-86 Mapping |
|---|---|---|
| Section16_3 | 109 | Foreign Activities (Financial) |
| section13_2-2 | 90 | Employment (overflow) |
| section13_2[0-2] | 90 each | Employment (3 entries) |
| Section17_1 | 83 | Foreign Contacts |
| Section18_1 | 81 | Mental Health |
| Section17_3 | 76 | Foreign Travel |
| Section10 | 74 | Residency |
| Section19_1-4 | 70 each | Police Record (4 sub-sections) |
| Section18_3[0-5] | 68 each | Mental Health (6 entries) |
| Section11[0-3] | 64 each | Schools (4 entries) |
| Sections1-6 | 65 | Personal Info / Names / Birth / Citizenship |

**120+ distinct section identifiers** in the PDF, with many having repeating instances (`[0]`, `[1]`, `[2]`, etc.).

---

## 2. PDF Library Analysis

### pdf-lib (Current Choice)

| Attribute | Status |
|---|---|
| Maintenance | **Abandoned** — last commit May 2023 |
| GitHub Stars | ~7,600 |
| XFA Support | **None** — AcroForm only |
| Performance | **Poor at scale** — 32s for 1,000 fields (Issue #1184) |
| Known Bugs | Checkbox `enableReadOnly()` broken, flattening causes Adobe Error 14 |
| Workaround | Community 50x performance fix exists (replace `font.layout()` with `font.glyphsForString()`) |

**Verdict**: Keep for lightweight client-side operations (preview, small updates) but fork and patch the performance bug. Do NOT rely on it for bulk operations with 6,197 fields.

### pdf.js (Mozilla)

| Attribute | Status |
|---|---|
| Maintenance | Active (Mozilla) |
| XFA Rendering | Partial (buggy) |
| Form Writing | **Not designed for this** |
| Best Use | Client-side PDF rendering/preview |

**Verdict**: Use for the PDF preview pane only. Not a form-filling library.

### PyMuPDF / fitz (Python) — **Recommended for Server-Side**

| Attribute | Status |
|---|---|
| Maintenance | Active, v1.25.5 |
| GitHub Stars | ~5,600 |
| Performance | **Excellent** — C engine, sub-second for 6,197 fields |
| Form Support | Full read/write via Widget class |
| Coordinates | Yes — `field.rect` gives exact position |
| License | AGPL or Commercial |

**Key advantage**: The `Widget` class provides `field_name`, `field_type_string`, `field_value`, AND `rect` (coordinates). The coordinates are critical for:
- Building the visual mapping tool (LLM classification assist)
- Overlay-based preview rendering
- Validating field positions across PDF versions

**Verdict**: Primary PDF engine. Run as a Python microservice called from Node.js.

### pikepdf (Python, wraps QPDF)

| Attribute | Status |
|---|---|
| Maintenance | Active, v10.4.0 |
| Performance | Excellent (C++ QPDF engine) |
| Form API | New `pikepdf.form.Form` module |
| XFA | No high-level support |

**Verdict**: Strong alternative to PyMuPDF. Slightly less feature-rich for forms but MPL-2.0 licensed (more permissive than PyMuPDF's AGPL).

### Other Libraries (Not Recommended)

| Library | Why Not |
|---|---|
| jsPDF | Creates new PDFs only, cannot modify existing |
| PDFKit | Same — creation only, no form support |
| HummusJS/muhammara | Abandoned, native deps, no form abstraction |
| pdfme | Uses pdf-lib internally, inherits all limitations |
| iText (Java) | AGPL or expensive commercial, overkill |
| Apryse/PDFTron | Commercial only, $$$, but best XFA support |

---

## 3. The LLM Classification Strategy

### Problem
4,243 fields have names like `TextField11[0]` that tell you nothing about their purpose.

### Solution: One-Time LLM-Powered Field Classification

**Input** (per field):
```json
{
  "name": "form1[0].section13_2[0].TextField11[5]",
  "id": "9487 0 R",
  "type": "PDFTextField",
  "section": "section13_2[0]",
  "position": { "page": 42, "x": 120, "y": 340, "w": 200, "h": 18 }
}
```

**Context provided to LLM**:
- The official SF-86 form layout (page images or text extraction)
- The section number → SF-86 section name mapping (Section 13 = Employment)
- Field coordinates relative to visible labels on the PDF page
- Surrounding fields for context

**Output** (the mapping):
```json
{
  "pdfFieldName": "form1[0].section13_2[0].TextField11[5]",
  "pdfObjectRef": "9487 0 R",
  "semanticKey": "employment[0].supervisor.firstName",
  "section": "employment",
  "label": "Supervisor First Name",
  "fieldType": "text",
  "repeatGroup": "employment",
  "repeatIndex": 0,
  "page": 42,
  "validation": { "type": "string", "maxLength": 50 }
}
```

### Classification Pipeline

```
Step 1: Extract all 6,197 fields with coordinates (PyMuPDF)
Step 2: Extract PDF page text/labels near each field (PyMuPDF)
Step 3: Group fields by section pattern (regex on field names)
Step 4: Feed section groups + surrounding labels to LLM
Step 5: LLM outputs semantic classification for each field
Step 6: Human review + correction (visual mapping tool)
Step 7: Output: field-registry.json (the static mapping dictionary)
```

### Why This Works
- The SF-86 is a **known, fixed form** — the structure doesn't change often
- Field coordinates + nearby text labels give the LLM strong context
- Section patterns in field names (`section13_2` = Employment Section 13) narrow the classification space
- The 1,954 already-semantic fields serve as training anchors
- Human review catches the ~5-10% the LLM gets wrong
- This is a **one-time cost** that produces a reusable artifact

### Estimated Effort
- Automated extraction: 1 day
- LLM classification: ~$5-20 in API costs (6,197 fields in batches)
- Human review/correction: 3-5 days (with a visual tool)
- Total: ~1 week to produce a production-quality `field-registry.json`

---

## 4. Prior Art: How Others Solved This

### 18F/Culper (US Government's Own SF-86 Project)

- **Repo**: github.com/18F/culper (archived September 2021)
- **Stack**: React frontend + Go backend + PostgreSQL
- **Approach**: Built a complete web form from scratch. Did NOT do bidirectional PDF mapping — the web form was the system of record, and PDF generation was a separate export step.
- **Outcome**: Archived. The government moved to NBIS (National Background Investigation Services) instead.
- **Lesson**: Even the US government's own team chose to avoid bidirectional PDF mapping and went pure web form.

### e-QIP (The Official System)

- The current official system for SF-86 submission
- Being replaced by NBIS (expected full transition by 2025-2026)
- e-QIP is a web application — it does NOT interact with PDF files at all
- Users fill out web forms, the system generates the official document internally
- **Lesson**: The government's production system avoids PDF interaction entirely.

### Fillvisa (USCIS Form Filling)

- Commercial product for immigration forms (similar complexity to SF-86)
- **Approach**: Converts XFA PDFs to AcroForm in Adobe Acrobat Pro, then manually rebuilds fields with semantic names
- Uses pdf-lib in-browser for filling
- JSON mapping file between UI fields and PDF field names
- All client-side processing (privacy-first)
- **Lesson**: Manual field remapping in Adobe is viable but extremely labor-intensive.

### Instafill.ai

- Commercial PDF form extraction service
- Uses PyMuPDF for field extraction with coordinates
- AI-powered field classification (similar to your approach)
- **Lesson**: PyMuPDF + AI classification is a proven production pattern.

---

## 5. Recommended Architecture

### System Overview

```
+------------------+     +-------------------+     +------------------+
|                  |     |                   |     |                  |
|  Field Registry  |---->|   Web UI (React)  |---->|  PDF Generator   |
|  (JSON artifact) |     |   Form Engine     |     |  (PyMuPDF)       |
|                  |     |                   |     |                  |
+------------------+     +-------------------+     +------------------+
        ^                        |                        |
        |                        v                        v
+------------------+     +-------------------+     +------------------+
|  LLM Classifier  |     |   State Manager   |     |  Filled SF-86    |
|  (one-time)      |     |   (Jotai/Zustand) |     |  PDF Output      |
+------------------+     +-------------------+     +------------------+
                                 |
                                 v
                         +-------------------+
                         |   PostgreSQL +    |
                         |   IndexedDB      |
                         |   (persistence)   |
                         +-------------------+
```

### Layer 1: Field Registry (The Core Artifact)

The entire system revolves around a single JSON file produced by the LLM classification:

```typescript
// field-registry.ts
interface FieldDefinition {
  // PDF identity
  pdfFieldName: string;        // "form1[0].section13_2[0].TextField11[5]"
  pdfObjectRef: string;        // "9487 0 R"
  pdfFieldType: PdfFieldType;  // "PDFTextField" | "PDFCheckBox" | "PDFRadioGroup" | "PDFDropdown"
  pdfPage: number;             // 42
  pdfRect: { x: number; y: number; w: number; h: number };

  // Semantic identity
  semanticKey: string;         // "employment.0.supervisor.firstName"
  section: SF86Section;        // "employment"
  label: string;               // "Supervisor First Name"
  uiFieldType: UiFieldType;   // "text" | "checkbox" | "radio" | "select" | "date"

  // Repeating group info
  repeatGroup?: string;        // "employment"
  repeatIndex?: number;        // 0
  maxRepeatInPdf?: number;     // 3 (PDF has 3 employment slots)

  // Validation
  validation?: ZodSchema;      // zod schema for this field
  required?: boolean;
  maxLength?: number;
  dependsOn?: string;          // conditional visibility: "employment.0.hasSuprevisor"
}
```

This registry serves as the **single source of truth** for:
- Rendering the web UI (which fields to show, labels, types, validation)
- Reading values from uploaded PDFs (pdfFieldName → semanticKey)
- Writing values back to PDF (semanticKey → pdfFieldName)

### Layer 2: Frontend Stack

| Concern | Technology | Why |
|---|---|---|
| Framework | **Next.js** (App Router) | Server actions, file-based routing, good form handling |
| Form Engine | **React Hook Form** | Performance at scale (uncontrolled inputs), validation integration |
| Field-Level State | **Jotai** | Atomic state per field — only re-renders the field that changed, not all 6,197 |
| Global State | **Zustand** | Session, save status, navigation state |
| Wizard Navigation | **XState** | State machine for 29 sections with guards (validation) and transitions |
| Validation | **Zod** | Type-safe schemas generated from field registry |
| PDF Preview | **pdf.js** | Render filled PDF in a side pane |
| Styling | **Tailwind** (already used) | Consistent with legacy |

**Why Jotai for 6,197 fields**: React Context (the legacy approach, one provider per section) causes re-render storms. When one field in `personalInfo` changes, the entire section re-renders. Jotai gives you one atom per field — surgical re-renders. This is the difference between a sluggish form and a responsive one.

### Layer 3: PDF Processing Pipeline

```
┌─────────────────────────────────────────────────┐
│              Python Microservice                 │
│              (FastAPI + PyMuPDF)                  │
│                                                   │
│  POST /extract-fields                             │
│    Input: uploaded PDF bytes                      │
│    Output: { fieldName: value }[] for all fields  │
│                                                   │
│  POST /fill-pdf                                   │
│    Input: { semanticKey: value }[] + template ref  │
│    Output: filled PDF bytes                       │
│                                                   │
│  POST /generate-continuation                      │
│    Input: overflow data for sections with > max    │
│    Output: continuation page PDF bytes            │
│                                                   │
│  GET /field-coordinates/:pdfVersion               │
│    Output: all fields with page + rect coords     │
└─────────────────────────────────────────────────┘
```

**Why Python instead of Node.js for PDF?**
- PyMuPDF is 10-100x faster than pdf-lib for bulk operations (C engine)
- PyMuPDF provides field coordinates (pdf-lib does not)
- Python has the best PDF ecosystem (PyMuPDF, pikepdf, reportlab, pypdf)
- The microservice boundary keeps the Node.js frontend clean

### Layer 4: Bidirectional Mapping

#### Web UI → PDF (Export)

```
1. Collect all field values from Jotai atoms
2. For each semanticKey, look up FieldDefinition in registry
3. Transform value types (UI date string → PDF date format)
4. Send { pdfFieldName: transformedValue }[] to Python service
5. Python service fills the AcroForm template PDF
6. Handle overflow: if employment[3] exists but PDF only has [0]-[2],
   generate continuation page
7. Return filled PDF bytes to client
```

#### PDF → Web UI (Import / Upload)

```
1. User uploads a pre-filled SF-86 PDF
2. Send PDF bytes to Python service
3. PyMuPDF extracts { pdfFieldName: value }[] for all fields with values
4. For each pdfFieldName, look up FieldDefinition in registry
5. Map to { semanticKey: value }[]
6. Transform value types (PDF format → UI format)
7. Populate Jotai atoms with extracted values
8. User sees their uploaded data pre-filled in the web form
```

### Layer 5: Persistence

| Storage | Purpose |
|---|---|
| **IndexedDB** (client) | Auto-save every field change, offline support, instant load |
| **PostgreSQL** (server) | Authoritative store, encrypted PII columns (pgcrypto AES-256) |

Auto-save strategy:
- Debounced writes to IndexedDB on every field change (100ms)
- Periodic sync to PostgreSQL (every 30 seconds, or on section change)
- On page load: try IndexedDB first (instant), then reconcile with server

---

## 6. Handling Repeating Groups and PDF Overflow

### The Problem

The SF-86 has many "add another" sections:
- **Employment**: 3 slots in PDF (`section13_2[0]`, `[1]`, `[2]`)
- **Schools**: 4 slots (`Section11[0]` through `[3]`)
- **Mental Health Counselors**: 6 slots (`Section18_3[0]` through `[5]`)
- **Foreign Contacts**: 5 slots (`Section18_1_1[0]` through `[4]`)

But users may have 10 employers, 6 schools, etc.

### Solution: Continuation Page System

```
1. Application data model has NO limit on entries
   (employment: EmploymentEntry[] — unbounded array)

2. Field Registry knows maxRepeatInPdf for each repeat group
   (employment: maxRepeatInPdf = 3)

3. At PDF export time:
   a. Fill entries [0] through [maxRepeatInPdf-1] into the main template
   b. For entries [maxRepeatInPdf] and beyond, generate continuation pages
   c. The SF-86 PDF has built-in continuation page templates
      (continuation1[0] through continuation4[0] — 3-14 fields each)
   d. PyMuPDF fills continuation templates and appends to output PDF
```

The PDF already has continuation page sections (`continuation1[0]` through `continuation4[0]`), confirming this is the intended overflow mechanism.

---

## 7. Web UI UX Patterns

### Wizard Navigation (29 Sections)

```
Section 1-6:  Personal Info, Names, Birth, Citizenship, Contact, Passport
Section 7-9:  Physical Attributes
Section 10:   Residency (repeating)
Section 11:   Schools (repeating, 4 slots)
Section 12:   Employment Activities
Section 13:   Employment (repeating, 3+ slots)
Section 14:   Military Service
Section 15:   People Who Know You (repeating)
Section 16:   Foreign Activities
Section 17:   Foreign Contacts / Travel
Section 18:   Mental Health (repeating, 6 slots)
Section 19:   Police Record (4 sub-sections)
Section 20:   Drug Activity
Section 21:   Alcohol Use
Section 22:   Investigations
Section 23:   Finances
Section 24:   Technology
Section 25:   Civil
Section 26:   Association
Section 27-29: Acknowledgements, Signature, Continuation
```

### Recommended UX

1. **Left sidebar**: Section list with completion indicators (checkmark, warning, empty)
2. **Center**: Active section form (scrollable, grouped sub-sections)
3. **Right sidebar** (optional): PDF preview pane showing the current section's page
4. **Top bar**: Progress bar (% complete), Save status, Export button
5. **Section-level validation**: Warn before leaving a section with errors
6. **Auto-save indicator**: "Saved 3 seconds ago" in the top bar
7. **PDF preview mode**: Toggle to see the actual PDF with filled values (using pdf.js)

---

## 8. Security Considerations

The SF-86 contains extremely sensitive PII:
- Social Security Number
- Financial records
- Foreign contacts and activities
- Mental health history
- Police records
- Drug and alcohol use

### Requirements

| Concern | Approach |
|---|---|
| Data at rest | PostgreSQL: pgcrypto AES-256 for PII columns |
| Data in transit | HTTPS everywhere, TLS 1.3 |
| Client-side | IndexedDB is NOT encrypted by default — use a wrapper like `idb-keyval` with encryption |
| PDF processing | Server-side processing keeps PDF bytes off the client where possible |
| Authentication | Multi-factor authentication required |
| Session management | Short-lived sessions, auto-logout after inactivity |
| Audit logging | Log all data access and modifications |
| Local-first option | Consider keeping all processing client-side (IndexedDB + pdf-lib in browser) for maximum privacy |

---

## 9. Implementation Roadmap

### Phase 1: Field Registry (1-2 weeks)
1. Extract all 6,197 fields with coordinates using PyMuPDF
2. Extract PDF page text near each field for context
3. Run LLM classification pipeline (batch by section)
4. Build visual review tool (render PDF page + highlight field + show classification)
5. Human review and correction
6. Output: `field-registry.json`

### Phase 2: Core Infrastructure (2-3 weeks)
1. Set up Next.js project with Tailwind
2. Build Zod schemas from field registry
3. Build Jotai atom factory from field registry
4. Build wizard navigation with XState
5. Build auto-save to IndexedDB
6. Set up Python microservice with FastAPI + PyMuPDF

### Phase 3: Section UI Implementation (4-6 weeks)
1. Build reusable form components (TextInput, Checkbox, RadioGroup, Select, DatePicker)
2. Implement section-by-section, starting with Sections 1-6 (Personal Info)
3. Build repeating group component (add/remove entries)
4. Section-level validation with Zod
5. All 29 sections rendered from field registry (schema-driven)

### Phase 4: PDF Pipeline (2-3 weeks)
1. PDF → Web (import): upload PDF, extract values, populate form
2. Web → PDF (export): collect values, fill template, generate continuation pages
3. PDF preview pane with pdf.js
4. Handle edge cases (different PDF versions, corrupt uploads, field type mismatches)

### Phase 5: Polish and Security (1-2 weeks)
1. Encryption layer for IndexedDB
2. PostgreSQL backend with encrypted columns
3. Authentication and session management
4. Audit logging
5. Performance optimization (lazy load sections, virtualize long lists)

**Total estimated: 10-16 weeks for a production-quality system.**

---

## 10. Key Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| LLM misclassifies fields | Medium | High | Human review step, visual mapping tool, test by round-tripping a filled PDF |
| PDF version changes (OPM updates SF-86) | Low | High | Version registry in field-registry.json, diff tool between versions |
| pdf-lib performance at 6,197 fields | High | Medium | Fork + apply community 50x fix, OR offload to Python service |
| PyMuPDF AGPL license conflict | Medium | Medium | Use pikepdf (MPL-2.0) instead, or purchase PyMuPDF commercial license |
| Continuation page complexity | Medium | Medium | The SF-86 PDF already has continuation templates — leverage those |
| XFA-to-AcroForm conversion fidelity | Low | High | Use Adobe Acrobat Pro for conversion (highest fidelity), test thoroughly |
| User has more entries than PDF supports | High | Medium | Continuation page system (Phase 4) |
| Browser memory with 6,197 Jotai atoms | Low | Medium | Lazy initialize atoms per section, not all at once |

---

## 11. Prior Art Deep Dive: 18F/Culper (Government SF-86 Project)

### Overview
- **Repo**: [github.com/18F/culper](https://github.com/18F/culper) (ARCHIVED September 2021)
- **Stats**: 29 stars, 25 forks, 10,015 commits, 32+ contributors
- **Stack**: JavaScript (82.7%) + Go (14%) + PostgreSQL + Docker + nginx
- **Frontend**: React + Redux + Webpack + Babel + Jest
- **Backend**: Go API server
- **Key Decision**: Pure web form — NO bidirectional PDF mapping

### Architecture Patterns Worth Stealing

**Section Organization** — Culper reorganized the 29 SF-86 sections into 11 logical groupings:
| Culper Section | SF-86 Sections Covered |
|---|---|
| Identification | 1-6 (Name, DOB, Birthplace, SSN, Other Names, Contacts, Physical) |
| History | 10-13 (Residence, Employment, Education, Federal Service) |
| Relationships | 14-15 (Marital Status, People Who Know You) |
| Citizenship | 8-9 (Citizenship, Dual Citizenship, Passport) |
| Military | 12 (Military Service History) |
| Foreign | 16-17 (Foreign Activities, Contacts, Travel) |
| Financial | 26 (Financial Record) |
| SubstanceUse | 23-24 (Drugs, Alcohol) |
| Legal | 19-22 (Police Record, Investigations, Court Actions) |
| Psychological | 18 (Mental Health) |
| Package | 27-29 (Acknowledgement, Signature, Review) |

**Schema-Driven Form Primitives** — Culper built 33 reusable form schema types:
```
alternateaddress, benefit, branch, checkbox, checkboxgroup,
civilunion, clearancelevel, collection, contacts, coowners,
country, datecontrol, daterange, email, employmentactivity,
foreignborndocument, general, height, location, name,
notapplicable, number, physicaladdress, radio, reasonleft,
sentence, signature, ssn, supervisor, telephone, text, textarea, treatment
```

These compose into section-specific forms. Each section config has:
```javascript
{
  key: sections.HISTORY_EMPLOYMENT,
  name: 'employment',
  path: 'employment',
  storeKey: 'Employment',      // Redux store key
  label: i18n.t('history.subsection.employment'),
}
```

**Validation Approach**:
- Real-time field validation on blur
- Timeline validation tools for multi-year event entry (no gaps allowed)
- USPS address validation integration
- Section review pages (validate entire section before proceeding)
- Conditional branching (yes/no questions hide/show subsequent fields)

**UX Patterns**:
- Contextual help text clarifying government jargon
- Conditional branching hides irrelevant sections
- Mobile-responsive design
- Auto-save between sessions
- Section-level completion tracking

### Key Takeaway
Culper proves the section-grouping and schema-driven approach works at SF-86 scale. Their 11 logical groups (vs the raw 29 sections) and 33 form primitives are a blueprint. **The gap**: Culper never solved bidirectional PDF mapping — that's what makes your project unique.

---

## 12. e-QIP → NBIS Transition (Current State)

- **e-QIP is FULLY REPLACED** as of October 1, 2023
- **NBIS eApp** is the new system, managed by DCSA (Defense Counterintelligence and Security Agency)
- 100+ federal agencies and 11,000+ companies with classified contracts have transitioned
- eApp uses "modern, simple design elements" — same questions as e-QIP but better UX
- eApp allows better progress saving and case tracking
- The underlying forms (SF-86, SF-85, SF-85P) remain the same — only the digital interface changed

**Implication for your project**: The SF-86 form structure is stable. OPM hasn't changed the actual form content, just the digital submission system. Your `field-registry.json` mapping won't break due to government system changes — only if OPM revises the SF-86 PDF itself.

---

## 13. Commercial SF-86 Tools Landscape

| Tool | Approach | Notes |
|---|---|---|
| **pdfFiller** | Generic PDF overlay/fill | No SF-86-specific logic, just renders PDF and lets users type in fields |
| **airSlate SignNow** | Generic fillable PDF platform | Same generic approach, no section-aware validation |
| **ClearanceJobs** | Content/guides only | Provides guides on how to fill SF-86, not a filling tool |

**Key finding**: There is NO commercially available SF-86-specific web application with bidirectional PDF mapping. All commercial tools treat the SF-86 as a generic fillable PDF. None offer:
- Section-aware validation
- Timeline gap detection
- Cross-section data reuse
- AI-assisted field population
- Upload + pre-populate from existing PDF

This is a **genuine market gap** — your project would be the first to solve this properly.

---

## 14. SF-86 Validation Rules Summary

### Lookback Periods
| Section | Lookback |
|---|---|
| Residency | 10 years, NO gaps allowed |
| Employment | 10 years, NO gaps allowed (include unemployment) |
| Education | 10 years (7 years for non-SSBI) |
| Financial | 10 years for delinquencies |
| Police Record | 7 years (some questions are lifetime: "Have you EVER...") |
| Drug Use | 7 years |
| Alcohol Use | 7 years |
| Foreign Travel | 7 years |
| Foreign Contacts | Lifetime for close/continuing contact |
| Mental Health | 7 years |

### Cross-Section Validation Rules
- Residency + Employment timelines must have NO GAPS and cover the full 10-year period
- Dates across sections should not contradict (e.g., employment dates at a foreign company should align with foreign travel dates)
- "People Who Know You" verifiers must cover your full residency/employment history
- Names used in any section must match the names declared in Section 5 (Other Names)

### Repeating Group Constraints
| Section | Max in PDF | Typical User Range |
|---|---|---|
| Other Names | 2 entries | 0-5 |
| Residences | 4-5 entries | 3-10+ |
| Employment | 3 entries | 3-15+ |
| Schools | 4 entries | 1-6 |
| Military Service | 1 entry | 0-3 |
| People Who Know You | 3 entries | 3-5 |
| Relatives | 6+ entries | 2-10+ |
| Foreign Contacts | 5 entries | 0-20+ |
| Mental Health Providers | 6 entries | 0-5 |
| Police Records | 4 sub-sections | 0-5+ per sub-section |

---

## Sources

| Source | URL | Notes |
|---|---|---|
| pdf-lib GitHub | github.com/Hopding/pdf-lib | Issues #1184, #1620, #1622 document critical bugs |
| pdf-lib Performance Fix | github.com/Hopding/pdf-lib/issues/1184 | Community 50x speedup patch |
| 18F/Culper (Gov SF-86) | [github.com/18F/culper](https://github.com/18F/culper) | US Government's own SF-86 web app (archived 2021) |
| Culper Wiki | [github.com/18F/culper/wiki](https://github.com/18F/culper/wiki) | Design principles, validation approach, UX patterns |
| DCSA NBIS | [dcsa.mil/NBIS](https://www.dcsa.mil/Systems-Applications/National-Background-Investigation-Services-NBIS/) | e-QIP replacement, fully transitioned Oct 2023 |
| NBIS eApp Transition | [dvidshub.net](https://www.dvidshub.net/news/456298/federal-and-industry-personnel-security-enterprise-transitions-new-nbis-eapp-investigation-process) | 100+ agencies, 11,000 companies transitioned |
| SF-86 Lookback Rules | [nationalsecuritylawfirm.com](http://www.nationalsecuritylawfirm.com/how-far-back-does-the-sf-86-go-what-youre-expected-to-remember/) | 10-year lookback details |
| SF-86 Instructions | [justice.gov](https://www.justice.gov/sites/default/files/usao-ct/legacy/2011/11/23/instructions_sf86.pdf) | Official supplemental instructions |
| DCSA SF-86 Guide | [dcsa.mil](https://www.dcsa.mil/Portals/91/Documents/pv/mbi/standard-form-sf-86-guide-for-applicants.pdf) | Applicant guide |
| PyMuPDF Widget Docs | pymupdf.readthedocs.io/en/latest/widget.html | Form field API with coordinates |
| pikepdf Form Docs | pikepdf.readthedocs.io/en/latest/topics/interactive_forms.html | Alternative Python PDF library |
| Fillvisa Architecture | blog.fillvisa.com/how-fillvisa-works/ | Real-world XFA→AcroForm→Web mapping |
| Instafill.ai | instafill.ai/features/pdf-field-extraction | PyMuPDF-based form extraction |
| iText XFA Docs | kb.itextpdf.com/itext/xfa-examples | XFA filling reference |
| Jotai Documentation | jotai.org | Atomic state management for large forms |
| React Hook Form | react-hook-form.com | Performant form library |

---

## Conclusion

The hardest part of this project is not the code — it's the **6,197-field mapping**. Once the LLM classification produces a reliable `field-registry.json`, the rest is well-understood engineering: schema-driven form rendering, atomic state management, and a Python microservice for PDF operations.

The legacy projects got close by using pdf-lib and TypeScript interfaces, but they hit the wall of manually mapping 4,243 generic field names. The LLM classification approach, combined with a visual review tool and field coordinates from PyMuPDF, collapses that wall from months of manual work to ~1 week.

The recommended stack (Next.js + Jotai + Zod + PyMuPDF microservice) is chosen specifically for the scale problem: 6,197 fields across 29 sections with repeating groups, conditional logic, and bidirectional PDF mapping. Each technology choice addresses a specific scaling pain point that the legacy Context-based architecture encountered.
