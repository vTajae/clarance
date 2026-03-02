// ---------------------------------------------------------------------------
// SF-86 State -- Barrel Export
// ---------------------------------------------------------------------------

// Jotai atoms
export type { FieldValue } from './atoms/field-atoms';
export {
  fieldValueAtomFamily,
  fieldMetaAtom,
  dirtyFieldsAtom,
  markFieldDirtyAtom,
  clearDirtyFieldsAtom,
  sectionFieldsAtom,
  sectionCompletionAtom,
  sectionGroupCompletionAtom,
  formCompletionAtom,
  hydrateFieldsAtom,
} from './atoms/field-atoms';

// Zustand app store
export type { SaveStatus, AppState, AppActions } from './stores/app-store';
export { useAppStore } from './stores/app-store';

// Hooks
export { useFieldValue } from './hooks/use-field-value';
