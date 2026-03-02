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

/** All 29 SF-86 raw sections. */
export type SF86Section =
  | 'personalInfo'
  | 'namesInfo'
  | 'birthInfo'
  | 'physicalAttributes'
  | 'contactInfo'
  | 'passportInfo'
  | 'citizenshipInfo'
  | 'dualCitizenshipInfo'
  | 'residencyInfo'
  | 'employmentInfo'
  | 'schoolInfo'
  | 'serviceInfo'
  | 'militaryHistoryInfo'
  | 'peopleThatKnow'
  | 'relationshipInfo'
  | 'relativesInfo'
  | 'foreignContacts'
  | 'foreignActivities'
  | 'mentalHealth'
  | 'policeRecord'
  | 'drugActivity'
  | 'alcoholUse'
  | 'investigationsInfo'
  | 'finances'
  | 'technology'
  | 'civil'
  | 'association'
  | 'acknowledgement'
  | 'signature';

/** 11 logical groups that organize the 29 sections for wizard navigation. */
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
  /** Bounding rectangle on the page (PDF coordinate space). */
  pdfRect: PdfRect;

  // -- Semantic identifiers --------------------------------------------------
  /** Unique, human-readable key (e.g. "personalInfo.lastName"). */
  semanticKey: string;
  /** Which of the 29 sections this field belongs to. */
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
  pdfVersion: 'sf861' | 'sf862';
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
    'personalInfo',
    'birthInfo',
    'namesInfo',
    'physicalAttributes',
    'contactInfo',
  ],
  citizenship: ['passportInfo', 'citizenshipInfo', 'dualCitizenshipInfo'],
  history: ['residencyInfo', 'employmentInfo', 'schoolInfo', 'serviceInfo'],
  military: ['militaryHistoryInfo'],
  relationships: ['relationshipInfo', 'relativesInfo', 'peopleThatKnow'],
  foreign: ['foreignContacts', 'foreignActivities'],
  financial: ['finances'],
  substance: ['drugActivity', 'alcoholUse'],
  legal: ['policeRecord', 'investigationsInfo', 'civil'],
  psychological: ['mentalHealth'],
  review: ['technology', 'association', 'acknowledgement', 'signature'],
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
export const SECTION_META: Record<SF86Section, SectionMeta> = {
  personalInfo: {
    key: 'personalInfo',
    group: 'identification',
    title: 'Personal Information',
    description:
      'Full legal name, date of birth, Social Security Number, and other personal identifiers.',
    order: 1,
    hasRepeatingGroups: false,
  },
  birthInfo: {
    key: 'birthInfo',
    group: 'identification',
    title: 'Place of Birth',
    description:
      'City, county, state, and country of birth along with citizenship at birth.',
    order: 2,
    hasRepeatingGroups: false,
  },
  namesInfo: {
    key: 'namesInfo',
    group: 'identification',
    title: 'Other Names Used',
    description:
      'Maiden name, aliases, nicknames, or any other names you have used.',
    order: 3,
    hasRepeatingGroups: true,
  },
  physicalAttributes: {
    key: 'physicalAttributes',
    group: 'identification',
    title: 'Physical Attributes',
    description: 'Height, weight, hair color, eye color, and sex.',
    order: 4,
    hasRepeatingGroups: false,
  },
  contactInfo: {
    key: 'contactInfo',
    group: 'identification',
    title: 'Contact Information',
    description: 'Phone numbers and email addresses.',
    order: 5,
    hasRepeatingGroups: true,
  },
  passportInfo: {
    key: 'passportInfo',
    group: 'citizenship',
    title: 'U.S. Passport',
    description: 'U.S. passport number, issue date, and expiration date.',
    order: 6,
    hasRepeatingGroups: true,
  },
  citizenshipInfo: {
    key: 'citizenshipInfo',
    group: 'citizenship',
    title: 'U.S. Citizenship',
    description:
      'Citizenship status: born in the U.S., naturalized, or derived.',
    order: 7,
    hasRepeatingGroups: false,
  },
  dualCitizenshipInfo: {
    key: 'dualCitizenshipInfo',
    group: 'citizenship',
    title: 'Dual / Foreign Citizenship',
    description:
      'Any citizenship held in addition to U.S. citizenship, including foreign passports.',
    order: 8,
    hasRepeatingGroups: true,
  },
  residencyInfo: {
    key: 'residencyInfo',
    group: 'history',
    title: 'Where You Have Lived',
    description:
      'Complete 10-year residence history with no gaps exceeding 30 days.',
    order: 9,
    hasRepeatingGroups: true,
  },
  employmentInfo: {
    key: 'employmentInfo',
    group: 'history',
    title: 'Employment Activities',
    description:
      'Complete 10-year employment history including unemployment and self-employment.',
    order: 10,
    hasRepeatingGroups: true,
  },
  schoolInfo: {
    key: 'schoolInfo',
    group: 'history',
    title: 'Education',
    description:
      'Schools attended in the last 10 years (high school and above).',
    order: 11,
    hasRepeatingGroups: true,
  },
  serviceInfo: {
    key: 'serviceInfo',
    group: 'history',
    title: 'Former Federal Service',
    description:
      'Previous employment with the federal government or military service.',
    order: 12,
    hasRepeatingGroups: true,
  },
  militaryHistoryInfo: {
    key: 'militaryHistoryInfo',
    group: 'military',
    title: 'Military History',
    description:
      'Branches served, dates of service, discharge type, and service number.',
    order: 13,
    hasRepeatingGroups: true,
  },
  relationshipInfo: {
    key: 'relationshipInfo',
    group: 'relationships',
    title: 'Marital Status',
    description:
      'Current marital status and history of marriages, divorces, separations.',
    order: 14,
    hasRepeatingGroups: true,
  },
  relativesInfo: {
    key: 'relativesInfo',
    group: 'relationships',
    title: 'Relatives',
    description:
      'Mother, father, stepparents, foster parents, siblings, half-siblings, and children.',
    order: 15,
    hasRepeatingGroups: true,
  },
  peopleThatKnow: {
    key: 'peopleThatKnow',
    group: 'relationships',
    title: 'People Who Know You Well',
    description:
      'Three people who know you well and can verify your activities (non-relatives, non-cohabitants).',
    order: 16,
    hasRepeatingGroups: true,
  },
  foreignContacts: {
    key: 'foreignContacts',
    group: 'foreign',
    title: 'Foreign Contacts',
    description:
      'Close or continuing contact with foreign nationals, including family members abroad.',
    order: 17,
    hasRepeatingGroups: true,
  },
  foreignActivities: {
    key: 'foreignActivities',
    group: 'foreign',
    title: 'Foreign Activities',
    description:
      'Foreign financial interests, real estate, business ventures, and government contacts.',
    order: 18,
    hasRepeatingGroups: true,
  },
  finances: {
    key: 'finances',
    group: 'financial',
    title: 'Financial Record',
    description:
      'Bankruptcies, delinquencies, garnishments, liens, repossessions, and financial counseling.',
    order: 19,
    hasRepeatingGroups: true,
  },
  drugActivity: {
    key: 'drugActivity',
    group: 'substance',
    title: 'Illegal Drug Use',
    description:
      'Use, possession, purchase, manufacture, or trafficking of illegal drugs or controlled substances.',
    order: 20,
    hasRepeatingGroups: true,
  },
  alcoholUse: {
    key: 'alcoholUse',
    group: 'substance',
    title: 'Alcohol Use',
    description:
      'Negative impacts from alcohol use including treatment, counseling, and incidents.',
    order: 21,
    hasRepeatingGroups: true,
  },
  policeRecord: {
    key: 'policeRecord',
    group: 'legal',
    title: 'Police Record',
    description:
      'Arrests, charges, convictions, and any interactions with law enforcement.',
    order: 22,
    hasRepeatingGroups: true,
  },
  investigationsInfo: {
    key: 'investigationsInfo',
    group: 'legal',
    title: 'Investigations Record',
    description:
      'Previous background investigations, security clearances, and clearance actions.',
    order: 23,
    hasRepeatingGroups: true,
  },
  civil: {
    key: 'civil',
    group: 'legal',
    title: 'Civil Court Actions',
    description:
      'Civil court actions in the last 10 years including lawsuits and judgments.',
    order: 24,
    hasRepeatingGroups: true,
  },
  mentalHealth: {
    key: 'mentalHealth',
    group: 'psychological',
    title: 'Psychological & Emotional Health',
    description:
      'Mental health consultations, hospitalizations, and court-ordered evaluations.',
    order: 25,
    hasRepeatingGroups: true,
  },
  technology: {
    key: 'technology',
    group: 'review',
    title: 'Information Technology',
    description:
      'Unauthorized access, modifications, or misuse of information technology systems.',
    order: 26,
    hasRepeatingGroups: true,
  },
  association: {
    key: 'association',
    group: 'review',
    title: 'Association Record',
    description:
      'Membership in or association with organizations dedicated to terrorism or force.',
    order: 27,
    hasRepeatingGroups: true,
  },
  acknowledgement: {
    key: 'acknowledgement',
    group: 'review',
    title: 'Acknowledgements',
    description:
      'Certification that the information provided is true, complete, and correct.',
    order: 28,
    hasRepeatingGroups: false,
  },
  signature: {
    key: 'signature',
    group: 'review',
    title: 'Signature',
    description:
      'Your signature, date, and any additional remarks or clarifications.',
    order: 29,
    hasRepeatingGroups: false,
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
    const orderA = SECTION_META[a[1][0]].order;
    const orderB = SECTION_META[b[1][0]].order;
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
