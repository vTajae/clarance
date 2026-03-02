// ---------------------------------------------------------------------------
// SF-86 Field Registry -- Core Type Definitions
// ---------------------------------------------------------------------------

/** PDF AcroForm field types as reported by pdf-lib / PyMuPDF. */
export type PdfFieldType =
  | 'PDFTextField'
  | 'PDFCheckBox'
  | 'PDFRadioGroup'
  | 'PDFDropdown';

/** UI-level field types that drive form component rendering. */
export type UiFieldType =
  | 'text'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'date'
  | 'dateRange'
  | 'phone'
  | 'telephone'
  | 'ssn'
  | 'email'
  | 'name'
  | 'location'
  | 'country'
  | 'state'
  | 'height'
  | 'branch'
  | 'collection'
  | 'notApplicable'
  | 'signature';

/** SF-86 sections mapped to actual form section numbers. */
export type SF86Section =
  | 'section1'       // Full Name (Sec 1)
  | 'section2'       // Date of Birth (Sec 2)
  | 'section3'       // Place of Birth (Sec 3)
  | 'section4'       // Social Security Number (Sec 4)
  | 'section5'       // Other Names Used (Sec 5)
  | 'section6'       // Physical / Identifying Info (Sec 6)
  | 'section7'       // Contact Information (Sec 7)
  | 'section8'       // U.S. Passport (Sec 8)
  | 'section9'       // Citizenship (Sec 9)
  | 'section10'      // Dual/Multiple Citizenship (Sec 10)
  | 'section11'      // Where You Have Lived (Sec 11)
  | 'section12'      // Where You Went to School (Sec 12)
  | 'section13A'     // Employment Activities (Sec 13A)
  | 'section13B'     // Former Federal Service (Sec 13B)
  | 'section13C'     // Employment Record (Sec 13C)
  | 'section14'      // Selective Service Record (Sec 14)
  | 'section15'      // Military History (Sec 15)
  | 'section16'      // People Who Know You Well (Sec 16)
  | 'section17'      // Marital/Relationship Status (Sec 17)
  | 'section18'      // Relatives (Sec 18)
  | 'section19'      // Foreign Contacts (Sec 19)
  | 'section20A'     // Foreign Activities (Sec 20A)
  | 'section20B'     // Foreign Business/Govt Contacts (Sec 20B)
  | 'section20C'     // Foreign Travel (Sec 20C)
  | 'section21'      // Psychological & Emotional Health (Sec 21)
  | 'section21A'     // Psych - Court Orders (Sec 21A)
  | 'section21B'     // Psych - Adjudicated Incompetent (Sec 21B)
  | 'section21C'     // Psych - Hospitalization (Sec 21C)
  | 'section21D'     // Psych - Health Care Professional (Sec 21D)
  | 'section21E'     // Psych - Other Counseling (Sec 21E)
  | 'section22'      // Police Record (Sec 22)
  | 'section23'      // Drug Activity (Sec 23)
  | 'section24'      // Alcohol Use (Sec 24)
  | 'section25'      // Investigations & Clearance (Sec 25)
  | 'section26'      // Financial Record (Sec 26)
  | 'section27'      // Information Technology (Sec 27)
  | 'section28'      // Civil Court Actions (Sec 28)
  | 'section29'      // Association Record (Sec 29)
  | 'section30'      // Signature & Certification (Sec 30)
  | 'ssnPageHeader'; // SSN auto-fill headers (every page)

/** 11 logical groups that organize the 39 sections for wizard navigation. */
export type SF86SectionGroup =
  | 'identification'
  | 'citizenship'
  | 'history'
  | 'military'
  | 'relationships'
  | 'foreign'
  | 'financial'
  | 'substance'
  | 'legal'
  | 'psychological'
  | 'review';

// ---------------------------------------------------------------------------
// Field Definition -- the central registry entry for every PDF field
// ---------------------------------------------------------------------------

/** Bounding rectangle of a field on its PDF page. */
export interface PdfRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * A single entry in the field registry.
 *
 * Each of the 6,197 AcroForm fields in the SF-86 PDF is represented by one
 * `FieldDefinition`. The registry is produced once via LLM-assisted
 * classification and thereafter treated as a static artifact.
 */
export interface FieldDefinition {
  // -- PDF-side identifiers --------------------------------------------------
  /** Raw AcroForm field name (e.g. "TextField11[0]" or "LastName"). */
  pdfFieldName: string;
  /** PDF indirect-object reference for precise addressing. */
  pdfObjectRef: string;
  /** AcroForm field type. */
  pdfFieldType: PdfFieldType;
  /** 1-based page number where the field appears. */
  pdfPage: number;
  /** Bounding rectangle on the page (PDF coordinate space). Optional until extracted by PyMuPDF. */
  pdfRect?: PdfRect;
  /** Individual radio widget positions (one per option in the group). Only present for radio fields. */
  radioWidgets?: Array<PdfRect & { onState: string }>;

  // -- Semantic identifiers --------------------------------------------------
  /** Unique, human-readable key (e.g. "personalInfo.lastName"). */
  semanticKey: string;
  /** Which of the 39 sections this field belongs to. */
  section: SF86Section;
  /** Human-readable label for the field. */
  label: string;
  /** UI component type to render. */
  uiFieldType: UiFieldType;

  // -- Repeating groups ------------------------------------------------------
  /** Identifier for the repeating group (e.g. "residency", "employer"). */
  repeatGroup?: string;
  /** Zero-based index within the repeating group in the PDF. */
  repeatIndex?: number;
  /** Maximum number of repeat entries the PDF natively supports. */
  maxRepeatInPdf?: number;

  // -- Validation ------------------------------------------------------------
  /** Whether the field is required for a complete submission. */
  required: boolean;
  /** Maximum character length (text fields). */
  maxLength?: number;
  /** Regex pattern the value must match. */
  pattern?: string;
  /** Allowed values (dropdowns, radios). */
  options?: string[];

  // -- Conditional visibility ------------------------------------------------
  /** semanticKey of the field this field depends on. */
  dependsOn?: string;
  /**
   * Expression evaluated against the dependsOn field's value.
   * When falsy the field is hidden.  Examples: "=== true", "=== 'Yes'".
   */
  showWhen?: string;

  // -- Value mapping ---------------------------------------------------------
  /**
   * Maps UI values to PDF values (and vice-versa via reverse lookup).
   * Key = UI value, Value = PDF value.
   */
  valueMap?: Record<string, string>;

  // -- Metadata --------------------------------------------------------------
  /** Which revision of the SF-86 PDF this mapping targets. */
  pdfVersion?: 'sf861' | 'sf862';
  /** 0-1 confidence score from the LLM classification pass. */
  classificationConfidence: number;
  /** Whether a human has verified this mapping. */
  manuallyVerified: boolean;
}

// ---------------------------------------------------------------------------
// Section grouping
// ---------------------------------------------------------------------------

/** Maps each logical group to its constituent sections (ordered). */
export const SECTION_GROUPS: Record<SF86SectionGroup, SF86Section[]> = {
  identification: [
    'section1',   // Full Name
    'section2',   // Date of Birth
    'section3',   // Place of Birth
    'section4',   // Social Security Number
    'section5',   // Other Names Used
    'section6',   // Physical / Identifying Info
    'section7',   // Contact Information
  ],
  citizenship: ['section8', 'section9', 'section10'],
  history: ['section11', 'section12', 'section13A', 'section13B', 'section13C'],
  military: ['section14', 'section15'],
  relationships: ['section16', 'section17', 'section18'],
  foreign: ['section19', 'section20A', 'section20B', 'section20C'],
  financial: ['section26'],
  substance: ['section23', 'section24'],
  legal: ['section22', 'section25', 'section28'],
  psychological: ['section21', 'section21A', 'section21B', 'section21C', 'section21D', 'section21E'],
  review: ['section27', 'section29', 'section30'],
};

// ---------------------------------------------------------------------------
// Section metadata
// ---------------------------------------------------------------------------

/** Metadata for a single SF-86 section used by the wizard UI. */
export interface SectionMeta {
  key: SF86Section;
  group: SF86SectionGroup;
  title: string;
  description: string;
  /** Display order (1-based, unique across all 29 sections). */
  order: number;
  /** Whether this section contains repeating entry groups. */
  hasRepeatingGroups: boolean;
}

/**
 * Full metadata for every section. Ordered to match the SF-86 page flow.
 */
export const SECTION_META: Partial<Record<SF86Section, SectionMeta>> & Record<Exclude<SF86Section, 'ssnPageHeader'>, SectionMeta> = {
  section1: {
    key: 'section1', group: 'identification',
    title: 'Section 1 - Full Name',
    description: 'Full legal name: last, first, middle, and suffix.',
    order: 1, hasRepeatingGroups: false,
  },
  section2: {
    key: 'section2', group: 'identification',
    title: 'Section 2 - Date of Birth',
    description: 'Your date of birth.',
    order: 2, hasRepeatingGroups: false,
  },
  section3: {
    key: 'section3', group: 'identification',
    title: 'Section 3 - Place of Birth',
    description: 'City, county, state, and country of birth.',
    order: 3, hasRepeatingGroups: false,
  },
  section4: {
    key: 'section4', group: 'identification',
    title: 'Section 4 - Social Security Number',
    description: 'Your U.S. Social Security Number.',
    order: 4, hasRepeatingGroups: false,
  },
  section5: {
    key: 'section5', group: 'identification',
    title: 'Section 5 - Other Names Used',
    description: 'Maiden name, aliases, nicknames, or any other names you have used.',
    order: 5, hasRepeatingGroups: true,
  },
  section6: {
    key: 'section6', group: 'identification',
    title: 'Section 6 - Identifying Information',
    description: 'Height, weight, hair color, eye color, and sex.',
    order: 6, hasRepeatingGroups: false,
  },
  section7: {
    key: 'section7', group: 'identification',
    title: 'Section 7 - Contact Information',
    description: 'Phone numbers and email addresses.',
    order: 7, hasRepeatingGroups: true,
  },
  section8: {
    key: 'section8', group: 'citizenship',
    title: 'Section 8 - U.S. Passport',
    description: 'U.S. passport number, issue date, and expiration date.',
    order: 8, hasRepeatingGroups: true,
  },
  section9: {
    key: 'section9', group: 'citizenship',
    title: 'Section 9 - Citizenship',
    description: 'Citizenship status: born in the U.S., naturalized, or derived.',
    order: 9, hasRepeatingGroups: false,
  },
  section10: {
    key: 'section10', group: 'citizenship',
    title: 'Section 10 - Dual/Multiple Citizenship',
    description: 'Any citizenship held in addition to U.S. citizenship, including foreign passports.',
    order: 10, hasRepeatingGroups: true,
  },
  section11: {
    key: 'section11', group: 'history',
    title: 'Section 11 - Where You Have Lived',
    description: 'Complete 10-year residence history with no gaps exceeding 30 days.',
    order: 11, hasRepeatingGroups: true,
  },
  section12: {
    key: 'section12', group: 'history',
    title: 'Section 12 - Where You Went to School',
    description: 'Schools attended in the last 10 years (high school and above).',
    order: 12, hasRepeatingGroups: true,
  },
  section13A: {
    key: 'section13A', group: 'history',
    title: 'Section 13A - Employment Activities',
    description: 'Complete 10-year employment history including unemployment and self-employment.',
    order: 13, hasRepeatingGroups: true,
  },
  section13B: {
    key: 'section13B', group: 'history',
    title: 'Section 13B - Former Federal Service',
    description: 'Previous employment with the federal government.',
    order: 14, hasRepeatingGroups: true,
  },
  section13C: {
    key: 'section13C', group: 'history',
    title: 'Section 13C - Employment Record',
    description: 'Employment record questions about unfavorable circumstances.',
    order: 15, hasRepeatingGroups: false,
  },
  section14: {
    key: 'section14', group: 'military',
    title: 'Section 14 - Selective Service Record',
    description: 'Selective Service registration status.',
    order: 16, hasRepeatingGroups: false,
  },
  section15: {
    key: 'section15', group: 'military',
    title: 'Section 15 - Military History',
    description: 'Branches served, dates of service, discharge type, and service number.',
    order: 17, hasRepeatingGroups: true,
  },
  section16: {
    key: 'section16', group: 'relationships',
    title: 'Section 16 - People Who Know You Well',
    description: 'Three people who know you well and can verify your activities.',
    order: 18, hasRepeatingGroups: true,
  },
  section17: {
    key: 'section17', group: 'relationships',
    title: 'Section 17 - Marital/Relationship Status',
    description: 'Current marital status and history of marriages, divorces, separations.',
    order: 19, hasRepeatingGroups: true,
  },
  section18: {
    key: 'section18', group: 'relationships',
    title: 'Section 18 - Relatives',
    description: 'Mother, father, stepparents, foster parents, siblings, half-siblings, and children.',
    order: 20, hasRepeatingGroups: true,
  },
  section19: {
    key: 'section19', group: 'foreign',
    title: 'Section 19 - Foreign Contacts',
    description: 'Close or continuing contact with foreign nationals.',
    order: 21, hasRepeatingGroups: true,
  },
  section20A: {
    key: 'section20A', group: 'foreign',
    title: 'Section 20A - Foreign Activities',
    description: 'Foreign financial interests, real estate, and business ventures.',
    order: 22, hasRepeatingGroups: true,
  },
  section20B: {
    key: 'section20B', group: 'foreign',
    title: 'Section 20B - Foreign Business & Government',
    description: 'Foreign business, professional activities, and government contacts.',
    order: 23, hasRepeatingGroups: true,
  },
  section20C: {
    key: 'section20C', group: 'foreign',
    title: 'Section 20C - Foreign Travel',
    description: 'Foreign travel outside of official government business.',
    order: 24, hasRepeatingGroups: true,
  },
  section21: {
    key: 'section21', group: 'psychological',
    title: 'Section 21 - Psychological & Emotional Health',
    description: 'Overview questions about mental health consultations and court-ordered evaluations.',
    order: 25, hasRepeatingGroups: false,
  },
  section21A: {
    key: 'section21A', group: 'psychological',
    title: 'Section 21A - Court-Ordered Counseling',
    description: 'Court or administrative agency orders for counseling or treatment.',
    order: 26, hasRepeatingGroups: true,
  },
  section21B: {
    key: 'section21B', group: 'psychological',
    title: 'Section 21B - Adjudicated Incompetent',
    description: 'Court or agency declarations of mental incompetence.',
    order: 27, hasRepeatingGroups: true,
  },
  section21C: {
    key: 'section21C', group: 'psychological',
    title: 'Section 21C - Hospitalization',
    description: 'Hospitalization for a mental health condition.',
    order: 28, hasRepeatingGroups: true,
  },
  section21D: {
    key: 'section21D', group: 'psychological',
    title: 'Section 21D - Health Care Professional',
    description: 'Consultations with health care professionals about mental health conditions.',
    order: 29, hasRepeatingGroups: true,
  },
  section21E: {
    key: 'section21E', group: 'psychological',
    title: 'Section 21E - Other Counseling',
    description: 'Other mental health counseling or treatment not previously listed.',
    order: 30, hasRepeatingGroups: true,
  },
  section22: {
    key: 'section22', group: 'legal',
    title: 'Section 22 - Police Record',
    description: 'Arrests, charges, convictions, and any interactions with law enforcement.',
    order: 31, hasRepeatingGroups: true,
  },
  section23: {
    key: 'section23', group: 'substance',
    title: 'Section 23 - Illegal Drug Use & Activity',
    description: 'Use, possession, purchase, manufacture, or trafficking of illegal drugs.',
    order: 32, hasRepeatingGroups: true,
  },
  section24: {
    key: 'section24', group: 'substance',
    title: 'Section 24 - Use of Alcohol',
    description: 'Negative impacts from alcohol use including treatment, counseling, and incidents.',
    order: 33, hasRepeatingGroups: true,
  },
  section25: {
    key: 'section25', group: 'legal',
    title: 'Section 25 - Investigations & Clearance Record',
    description: 'Previous background investigations, security clearances, and clearance actions.',
    order: 34, hasRepeatingGroups: true,
  },
  section26: {
    key: 'section26', group: 'financial',
    title: 'Section 26 - Financial Record',
    description: 'Bankruptcies, delinquencies, garnishments, liens, repossessions.',
    order: 35, hasRepeatingGroups: true,
  },
  section27: {
    key: 'section27', group: 'review',
    title: 'Section 27 - Information Technology',
    description: 'Unauthorized access, modifications, or misuse of information technology systems.',
    order: 36, hasRepeatingGroups: true,
  },
  section28: {
    key: 'section28', group: 'legal',
    title: 'Section 28 - Civil Court Actions',
    description: 'Civil court actions in the last 10 years.',
    order: 37, hasRepeatingGroups: true,
  },
  section29: {
    key: 'section29', group: 'review',
    title: 'Section 29 - Association Record',
    description: 'Membership in or association with organizations dedicated to terrorism or force.',
    order: 38, hasRepeatingGroups: true,
  },
  section30: {
    key: 'section30', group: 'review',
    title: 'Section 30 - Signature & Certification',
    description: 'Your signature, date, and certification.',
    order: 39, hasRepeatingGroups: false,
  },
};

// ---------------------------------------------------------------------------
// Convenience helpers
// ---------------------------------------------------------------------------

/** Ordered list of all sections (by `order`). */
export const ALL_SECTIONS: SF86Section[] = (
  Object.values(SECTION_META) as SectionMeta[]
)
  .sort((a, b) => a.order - b.order)
  .map((m) => m.key);

/** Ordered list of all section groups (by first section order). */
export const ALL_SECTION_GROUPS: SF86SectionGroup[] = (
  Object.entries(SECTION_GROUPS) as [SF86SectionGroup, SF86Section[]][]
)
  .sort((a, b) => {
    const orderA = SECTION_META[a[1][0]]!.order;
    const orderB = SECTION_META[b[1][0]]!.order;
    return orderA - orderB;
  })
  .map(([group]) => group);

/**
 * Look up which group a section belongs to.
 * Returns `undefined` only if the section is not in SECTION_GROUPS
 * (should never happen for valid SF86Section values).
 */
export function sectionToGroup(section: SF86Section): SF86SectionGroup | undefined {
  for (const [group, sections] of Object.entries(SECTION_GROUPS) as [
    SF86SectionGroup,
    SF86Section[],
  ][]) {
    if (sections.includes(section)) return group;
  }
  return undefined;
}
