// ---------------------------------------------------------------------------
// SF-86 Field Registry -- Barrel Export
// ---------------------------------------------------------------------------

// Core types and constants
export type {
  PdfFieldType,
  UiFieldType,
  SF86Section,
  SF86SectionGroup,
  PdfRect,
  FieldDefinition,
  SectionMeta,
} from './types';

export {
  SECTION_GROUPS,
  SECTION_META,
  ALL_SECTIONS,
  ALL_SECTION_GROUPS,
  sectionToGroup,
} from './types';

// Registry loader
export { FieldRegistry, loadRegistry } from './registry-loader';

// Value transformers
export {
  pdfToUi,
  uiToPdf,
  dateTransformers,
  checkboxTransformers,
  ssnTransformers,
  phoneTransformers,
  heightTransformers,
} from './value-transformers';
