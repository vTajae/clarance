import type { SF86Section } from '@/lib/field-registry/types';

export interface WizardStep {
  id: string;                    // e.g. "section11.residency-0.address"
  title: string;                 // "Residence Address"
  guidance: string;              // "Provide the street address..."
  fieldKeys: string[];           // ordered semanticKeys for this step
  gateFieldKey?: string;         // if step starts with a gate radio
  isConditionalBlock?: boolean;  // all fields depend on a gate
  repeatGroup?: string;
  repeatIndex?: number;
}

export interface SectionWizardConfig {
  sectionKey: SF86Section;
  steps: WizardStep[];
}

export type WizardStepsData = Record<string, SectionWizardConfig>;
