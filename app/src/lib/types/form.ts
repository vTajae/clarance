/** Shared type definitions for SF-86 form components. */

/** A single option for select / radio / checkbox groups. */
export interface FieldOption {
  value: string;
  label: string;
}

/** Base props shared by every form primitive. */
export interface BaseFieldProps {
  /** Jotai atom key that uniquely identifies this field. */
  semanticKey: string;
  /** Visible label rendered above or beside the field. */
  label: string;
  /** Mark the field as required (shows asterisk, enables validation). */
  required?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  /** Hint text rendered below the field (before any error). */
  helpText?: string;
  /** External validation error message to display. */
  error?: string;
}

/** Section metadata used by the sidebar. */
export interface SectionInfo {
  id: string;
  title: string;
  /** 0-100 completion percentage. */
  completion: number;
}

/** Section group that contains multiple sections. */
export interface SectionGroup {
  id: string;
  title: string;
  sections: SectionInfo[];
}
