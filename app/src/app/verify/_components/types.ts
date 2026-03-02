// ---------------------------------------------------------------------------
// Verification Dashboard -- Shared Types
// ---------------------------------------------------------------------------

import type { FieldDefinition, SF86Section, SF86SectionGroup } from '@/lib/field-registry/types';

export type ConfidenceLevel = 'all' | 'high' | 'medium' | 'low';
export type SortMode = 'confidence' | 'page' | 'section';

export interface FilterState {
  section: SF86Section | 'all';
  confidence: ConfidenceLevel;
  unverifiedOnly: boolean;
  search: string;
}

export interface StatsData {
  total: number;
  verified: number;
  verifiedPct: number;
  highConfidence: number;
  mediumConfidence: number;
  lowConfidence: number;
  sectionsComplete: number;
  totalSections: number;
}

/** Mutable copy of FieldDefinition used for edits in the dashboard. */
export type EditableField = FieldDefinition & {
  sectionGroup?: SF86SectionGroup;
  sf86SectionId?: number;
  sf86SectionName?: string;
  referenceValue?: string;
};
