'use client';

// ---------------------------------------------------------------------------
// SF-86 Auto-Save Hook -- Connects Jotai Atoms to IndexedDB Persistence
// ---------------------------------------------------------------------------
//
// Watches all field atoms belonging to a given section via the derived
// `sectionFieldsAtom` and debounces writes to IndexedDB.  Each debounced
// write also enqueues a pending sync entry so the SyncEngine can push the
// change to the server later.
//
// Integrates with the Zustand `appStore` to surface save status in the UI
// ('saving' -> 'saved' -> 'idle') and exposes `saveNow` for manual flush.
//
// Usage:
//   const fields = useMemo(() => sectionFieldsAtom('personalInfo'), []);
//   const { isSaving, lastSaved, saveNow } = useAutoSave(submissionId, 'personalInfo', fields);
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import type { Atom } from 'jotai';

import {
  saveSectionData,
  addPendingSync,
} from '@/lib/persistence/indexeddb-client';
import { useAppStore } from '@/lib/state/stores/app-store';
import {
  sectionFieldsAtom,
  clearDirtyFieldsAtom,
  type FieldValue,
} from '@/lib/state/atoms/field-atoms';
import type { SF86Section } from '@/lib/field-registry/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEBOUNCE_MS = 500;

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface UseAutoSaveReturn {
  /** Whether a debounced save is currently in flight. */
  isSaving: boolean;
  /** ISO timestamp of the last successful IndexedDB write, or `null`. */
  lastSaved: string | null;
  /** Flush the debounce timer and save immediately. Returns when the write completes. */
  saveNow: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Auto-save hook for a single SF-86 section.
 *
 * Subscribes to all field values in the section through a Jotai derived atom.
 * When any field value changes, a debounced save (500 ms) writes the entire
 * section snapshot to IndexedDB and enqueues a pending sync entry.
 *
 * @param submissionId  The active submission UUID.
 * @param sectionKey    Which of the 29 SF-86 sections to persist.
 *
 * @example
 * ```tsx
 * function PersonalInfoSection() {
 *   const submissionId = useAppStore((s) => s.submissionId)!;
 *   const { isSaving, lastSaved, saveNow } = useAutoSave(submissionId, 'personalInfo');
 *   // ...
 * }
 * ```
 */
export function useAutoSave(
  submissionId: string,
  sectionKey: SF86Section,
): UseAutoSaveReturn {
  // -- Zustand integration --------------------------------------------------
  const setSaveStatus = useAppStore((s) => s.setSaveStatus);
  const markSaved = useAppStore((s) => s.markSaved);

  // -- Dirty tracking -------------------------------------------------------
  const clearDirty = useSetAtom(clearDirtyFieldsAtom);

  // -- Derived atom: snapshot of all field values in this section -----------
  //
  // `sectionFieldsAtom` reads the FieldRegistry from `fieldMetaAtom` to
  // determine which semantic keys belong to this section, then reads every
  // field atom.  Jotai re-evaluates only when an underlying atom changes.
  //
  // We memoize the atom instance per section so it is stable across renders.
  const snapshotAtom: Atom<Record<string, FieldValue>> = useMemo(
    () => sectionFieldsAtom(sectionKey),
    [sectionKey],
  );

  const snapshot = useAtomValue(snapshotAtom);

  // -- Local state ----------------------------------------------------------
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // -- Refs for debounce / cleanup ------------------------------------------
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  // We stash the latest snapshot in a ref so `saveNow` always has access
  // to the most current data without needing to be in the React render path.
  const latestSnapshotRef = useRef(snapshot);
  latestSnapshotRef.current = snapshot;

  // -- Persist function (called after debounce) -----------------------------

  const persist = useCallback(
    async (data: Record<string, FieldValue>) => {
      if (!isMountedRef.current) return;

      setIsSaving(true);
      setSaveStatus('saving');

      try {
        // Convert FieldValue types to the generic Record<string, unknown>
        // expected by the IndexedDB client.
        const serializable: Record<string, unknown> = data;

        await saveSectionData(submissionId, sectionKey, serializable);
        await addPendingSync(submissionId, sectionKey, serializable);

        if (isMountedRef.current) {
          const now = new Date().toISOString();
          setLastSaved(now);
          setIsSaving(false);
          markSaved();
          clearDirty();
        }
      } catch (err) {
        console.error(
          `[useAutoSave] Failed to save section "${sectionKey}":`,
          err instanceof Error ? err.message : err,
        );
        if (isMountedRef.current) {
          setIsSaving(false);
          setSaveStatus('error');
        }
      }
    },
    [submissionId, sectionKey, setSaveStatus, markSaved, clearDirty],
  );

  // -- Debounced save on snapshot change ------------------------------------
  //
  // We track the previous snapshot JSON so we do not save on initial mount
  // or when values have not actually changed.

  const prevSnapshotJsonRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Do not save if there are no keys at all (registry not loaded yet).
    const keys = Object.keys(snapshot);
    if (keys.length === 0) return;

    const json = stableStringify(snapshot);

    // Skip the very first render (initial atom state before hydration).
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      prevSnapshotJsonRef.current = json;
      return;
    }

    // No change -> skip.
    if (json === prevSnapshotJsonRef.current) return;
    prevSnapshotJsonRef.current = json;

    // Clear any pending debounce.
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      void persist(snapshot);
    }, DEBOUNCE_MS);

    // eslint-disable-next-line react-hooks/exhaustive-deps -- `persist` is stable
  }, [snapshot, persist]);

  // -- Manual save (flush debounce immediately) -----------------------------

  const saveNow = useCallback(async () => {
    // Cancel any pending debounce so we do not double-save.
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    await persist(latestSnapshotRef.current);
  }, [persist]);

  // -- Cleanup on unmount ---------------------------------------------------
  //
  // If there is a pending debounce when the component unmounts, we flush it
  // synchronously so no user edits are lost.

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;

        // Fire-and-forget save of the last known snapshot.
        const finalData = latestSnapshotRef.current;
        const keys = Object.keys(finalData);
        if (keys.length > 0) {
          void saveSectionData(submissionId, sectionKey, finalData).catch(
            (err) => {
              console.warn(
                `[useAutoSave] Unmount save for "${sectionKey}" failed:`,
                err instanceof Error ? err.message : err,
              );
            },
          );
          void addPendingSync(submissionId, sectionKey, finalData).catch(
            () => {
              // Best-effort; the section data is already in IndexedDB.
            },
          );
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount/unmount
  }, [submissionId, sectionKey]);

  return { isSaving, lastSaved, saveNow };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Deterministic JSON serialisation with sorted keys.
 *
 * Guarantees that two objects with the same key-value pairs produce the
 * same string regardless of insertion order, so our shallow-equality check
 * (`prevJson === nextJson`) is reliable.
 */
function stableStringify(obj: Record<string, unknown>): string {
  const sortedKeys = Object.keys(obj).sort();
  const pairs: string[] = [];
  for (const key of sortedKeys) {
    pairs.push(JSON.stringify(key) + ':' + JSON.stringify(obj[key]));
  }
  return '{' + pairs.join(',') + '}';
}
