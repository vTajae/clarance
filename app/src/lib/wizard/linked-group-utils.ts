// ---------------------------------------------------------------------------
// Linked Group Utilities
// ---------------------------------------------------------------------------
//
// Handles multi-group entities where repeat groups across sections form
// a single logical entity (e.g. one employment entry spans 13A/B/C groups,
// one relative spans 4 groups in section 18).
// ---------------------------------------------------------------------------

import type { SF86Section } from '@/lib/field-registry/types';
import type { WizardStep } from './types';
import linkedGroupsData from './linked-groups.json';

export interface LinkedGroupConfig {
  entityLabel: string;
  sections: SF86Section[];
  groupsBySection: Record<string, string[]>;
}

const linkedGroups = linkedGroupsData as Record<string, LinkedGroupConfig>;

/**
 * Get the linked group config for a section, if it participates in a
 * multi-group entity.
 */
export function getLinkedGroupConfig(
  sectionKey: SF86Section,
): LinkedGroupConfig | null {
  for (const config of Object.values(linkedGroups)) {
    if (config.sections.includes(sectionKey)) {
      return config;
    }
  }
  return null;
}

/**
 * Get all linked group names for a specific section.
 */
export function getLinkedGroupNames(sectionKey: SF86Section): string[] {
  const config = getLinkedGroupConfig(sectionKey);
  if (!config) return [];
  return config.groupsBySection[sectionKey] ?? [];
}

/**
 * Given all wizard steps for a section, merge steps across linked repeat
 * groups into unified entity entries.
 *
 * Returns entries indexed by repeat index, each containing steps from
 * ALL linked groups at that index.
 */
export function getEntityEntries(
  config: LinkedGroupConfig,
  sectionKey: SF86Section,
  steps: WizardStep[],
): Array<{ index: number; steps: WizardStep[] }> {
  const linkedNames = new Set(config.groupsBySection[sectionKey] ?? []);
  if (linkedNames.size === 0) return [];

  // Collect steps by repeat index across all linked groups
  const byIndex = new Map<number, WizardStep[]>();

  for (const step of steps) {
    if (!step.repeatGroup || !linkedNames.has(step.repeatGroup)) continue;
    const idx = step.repeatIndex ?? 0;
    const arr = byIndex.get(idx);
    if (arr) arr.push(step);
    else byIndex.set(idx, [step]);
  }

  return Array.from(byIndex.entries())
    .sort(([a], [b]) => a - b)
    .map(([index, entitySteps]) => ({ index, steps: entitySteps }));
}

/**
 * Check if a section has a linked group configuration.
 */
export function isLinkedGroupSection(sectionKey: SF86Section): boolean {
  return getLinkedGroupConfig(sectionKey) !== null;
}

/**
 * Get the global step index range for a single entity at a given repeat index.
 * Returns the indices of the first and last steps in `allSteps` that belong
 * to any linked sub-group at `repeatIndex`, so callers can navigate through
 * the full entity.
 */
export function getEntityStepRange(
  config: LinkedGroupConfig,
  sectionKey: SF86Section,
  allSteps: WizardStep[],
  repeatIndex: number,
): { startIdx: number; endIdx: number } | null {
  const linkedNames = new Set(config.groupsBySection[sectionKey] ?? []);
  if (linkedNames.size === 0) return null;

  let startIdx = -1;
  let endIdx = -1;

  for (let i = 0; i < allSteps.length; i++) {
    const step = allSteps[i];
    if (
      step.repeatGroup &&
      linkedNames.has(step.repeatGroup) &&
      step.repeatIndex === repeatIndex
    ) {
      if (startIdx === -1) startIdx = i;
      endIdx = i;
    }
  }

  return startIdx >= 0 ? { startIdx, endIdx } : null;
}
