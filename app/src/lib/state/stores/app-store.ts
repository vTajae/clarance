// ---------------------------------------------------------------------------
// SF-86 State -- Zustand Global App Store
// ---------------------------------------------------------------------------
//
// Handles application-level concerns that are **not** per-field:
//   - Wizard navigation (current section / group, history)
//   - Save status tracking
//   - Submission identity
//
// Field values live in Jotai atoms (see field-atoms.ts).
// ---------------------------------------------------------------------------

import { create } from 'zustand';

import type { SF86Section, SF86SectionGroup } from '@/lib/field-registry/types';
import { SECTION_GROUPS, SECTION_META, sectionToGroup } from '@/lib/field-registry/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type LayoutMode = 'wizard' | 'pdf';

export interface AppState {
  /** Currently displayed section in the wizard. */
  currentSection: SF86Section;
  /** Group that contains the current section. */
  currentSectionGroup: SF86SectionGroup;
  /** Server-assigned submission ID (null until first save). */
  submissionId: string | null;
  /** Persistence status indicator. */
  saveStatus: SaveStatus;
  /** Timestamp of the last successful save. */
  lastSaved: Date | null;
  /** Navigation history stack for the back button. */
  wizardHistory: SF86Section[];
  /** Registered save function from the active section's useAutoSave hook. */
  _saveNowFn: (() => Promise<void>) | null;

  // -- Wizard step navigation ------------------------------------------------
  /** 0-based step index within the current section's wizard steps. */
  currentStepIndex: number;
  /** Active layout mode: wizard (guided) or pdf (coordinate overlay). */
  layoutMode: LayoutMode;
  /** Whether the wizard is showing the end-of-section review panel. */
  inReviewMode: boolean;
}

export interface AppActions {
  /** Navigate to a specific section, pushing current onto history. */
  navigateToSection: (section: SF86Section) => void;
  /** Navigate to the first section of a group. */
  navigateToGroup: (group: SF86SectionGroup) => void;
  /** Pop the history stack to return to the previous section. */
  goBack: () => void;
  /** Update the save status indicator. */
  setSaveStatus: (status: SaveStatus) => void;
  /** Record a successful save with the current timestamp. */
  markSaved: () => void;
  /** Set or clear the server submission ID. */
  setSubmissionId: (id: string | null) => void;
  /** Register the active section's save function (called by useAutoSave). */
  registerSaveNow: (fn: (() => Promise<void>) | null) => void;
  /** Trigger an immediate save of the current section. */
  saveNow: () => Promise<void>;

  // -- Wizard step actions ---------------------------------------------------
  /** Advance to the next visible wizard step. */
  nextStep: () => void;
  /** Go back to the previous wizard step. */
  prevStep: () => void;
  /** Jump to a specific step index. */
  goToStep: (index: number) => void;
  /** Switch between wizard, flow, and pdf layout modes. */
  setLayoutMode: (mode: LayoutMode) => void;
  /** Enter the end-of-section review panel. */
  enterReview: () => void;
  /** Exit review mode and return to the last step. */
  exitReview: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAppStore = create<AppState & AppActions>()((set, get) => ({
  // -- Initial state --------------------------------------------------------
  currentSection: 'section1',
  currentSectionGroup: 'identification',
  submissionId: null,
  saveStatus: 'idle',
  lastSaved: null,
  wizardHistory: [],
  _saveNowFn: null,
  currentStepIndex: 0,
  layoutMode: 'wizard',
  inReviewMode: false,

  // -- Actions --------------------------------------------------------------

  navigateToSection(section) {
    const { currentSection } = get();
    if (section === currentSection) return;

    const group = sectionToGroup(section) ?? get().currentSectionGroup;

    set((state) => ({
      currentSection: section,
      currentSectionGroup: group,
      wizardHistory: [...state.wizardHistory, currentSection],
      // Reset step state on section change
      currentStepIndex: 0,
      inReviewMode: false,
    }));
  },

  navigateToGroup(group) {
    // Resolve the group to its first section by order
    const sections: SF86Section[] | undefined = SECTION_GROUPS[group];
    if (!sections || sections.length === 0) return;

    // Pick the section with the lowest `order`
    const first = sections.reduce<SF86Section>((best, s) => {
      const bestOrder = SECTION_META[best]!.order;
      const sOrder = SECTION_META[s]!.order;
      return sOrder < bestOrder ? s : best;
    }, sections[0]);

    get().navigateToSection(first);
  },

  goBack() {
    set((state) => {
      const history = [...state.wizardHistory];
      const previous = history.pop();
      if (!previous) return state; // nothing to go back to

      const group = sectionToGroup(previous) ?? state.currentSectionGroup;
      return {
        currentSection: previous,
        currentSectionGroup: group,
        wizardHistory: history,
      };
    });
  },

  setSaveStatus(status) {
    set({ saveStatus: status });
  },

  markSaved() {
    set({ saveStatus: 'saved', lastSaved: new Date() });
  },

  setSubmissionId(id) {
    set({ submissionId: id });
  },

  registerSaveNow(fn) {
    set({ _saveNowFn: fn });
  },

  async saveNow() {
    const fn = get()._saveNowFn;
    if (fn) {
      await fn();
    }
  },

  // -- Wizard step actions --------------------------------------------------

  nextStep() {
    set((state) => ({
      currentStepIndex: state.currentStepIndex + 1,
      inReviewMode: false,
    }));
  },

  prevStep() {
    const { inReviewMode, currentStepIndex } = get();
    if (inReviewMode) {
      // Exit review → go to whatever the current step index is
      set({ inReviewMode: false });
      return;
    }
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  goToStep(index) {
    set({ currentStepIndex: index, inReviewMode: false });
  },

  setLayoutMode(mode) {
    set({ layoutMode: mode });
  },

  enterReview() {
    set({ inReviewMode: true });
  },

  exitReview() {
    set({ inReviewMode: false });
  },
}));
