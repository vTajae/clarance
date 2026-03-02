// ---------------------------------------------------------------------------
// SF-86 IndexedDB Client -- Section-Level Persistence
// ---------------------------------------------------------------------------
//
// Uses the `idb` package (v8) for a typed, promise-based wrapper over
// IndexedDB.  The database stores form data at section granularity so that
// saving one section writes ~50-300 fields, never all 6,197.
//
// Three object stores:
//   sections     -- field data keyed by "submissionId:sectionKey"
//   metadata     -- per-submission bookkeeping (completion %, sync status)
//   pendingSync  -- write-ahead log for offline-first server sync
// ---------------------------------------------------------------------------

import { openDB, deleteDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

/** Row shape for a single section's saved field data. */
export interface SectionRow {
  submissionId: string;
  sectionKey: string;
  data: Record<string, unknown>; // semanticKey -> value
  version: number;
  updatedAt: string; // ISO-8601
}

/** Row shape for per-submission metadata. */
export interface MetadataRow {
  submissionId: string;
  pdfVersion: string;
  completionPct: number;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Row shape for the write-ahead sync queue. */
export interface PendingSyncRow {
  id?: number; // auto-incremented by IDB
  submissionId: string;
  sectionKey: string;
  data: Record<string, unknown>;
  timestamp: string; // ISO-8601
  retryCount: number;
}

/** Typed schema consumed by `idb`'s `openDB`. */
interface SF86DBSchema extends DBSchema {
  sections: {
    key: string; // "submissionId:sectionKey"
    value: SectionRow;
    indexes: {
      'by-submission': string;
      'by-section': string;
      'by-updated': string;
    };
  };
  metadata: {
    key: string; // submissionId
    value: MetadataRow;
  };
  pendingSync: {
    key: number; // auto-increment
    value: PendingSyncRow;
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DB_NAME = 'sf86-form-data';
const DB_VERSION = 1;

// ---------------------------------------------------------------------------
// Singleton connection
// ---------------------------------------------------------------------------

let dbPromise: Promise<IDBPDatabase<SF86DBSchema>> | null = null;

const DB_OPEN_TIMEOUT_MS = 5000;

/**
 * Return (or lazily create) a singleton database connection.
 *
 * The connection is cached as a module-level promise so that multiple
 * concurrent callers share the same upgrade transaction.  If the browser
 * tab is terminated and the connection drops, calling `getDB()` again
 * will re-open it.
 *
 * Includes a timeout to prevent permanent hangs from stale HMR connections
 * or blocked upgrades.
 */
export function getDB(): Promise<IDBPDatabase<SF86DBSchema>> {
  if (dbPromise) return dbPromise;

  const openPromise = openDB<SF86DBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // -- sections store ---------------------------------------------------
      // Out-of-line key: we supply "submissionId:sectionKey" at put() time.
      if (oldVersion < 1) {
        const sections = db.createObjectStore('sections');
        sections.createIndex('by-submission', 'submissionId');
        sections.createIndex('by-section', 'sectionKey');
        sections.createIndex('by-updated', 'updatedAt');

        // -- metadata store -------------------------------------------------
        db.createObjectStore('metadata', { keyPath: 'submissionId' });

        // -- pendingSync store ----------------------------------------------
        db.createObjectStore('pendingSync', {
          autoIncrement: true,
        });
      }
    },
    blocked() {
      console.warn(
        '[SF86-IDB] Database upgrade blocked -- close other tabs using this app.',
      );
    },
    blocking() {
      console.warn(
        '[SF86-IDB] This tab is blocking a database upgrade in another tab.',
      );
    },
    terminated() {
      console.warn('[SF86-IDB] Database connection was abnormally terminated.');
      // Clear the singleton so the next call re-opens.
      dbPromise = null;
    },
  });

  // Race against a timeout so a stale/blocked open never hangs forever.
  dbPromise = Promise.race([
    openPromise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('[SF86-IDB] openDB timed out — clearing singleton for retry')),
        DB_OPEN_TIMEOUT_MS,
      ),
    ),
  ]).catch((err) => {
    // Clear the singleton so the next call retries with a fresh open.
    dbPromise = null;
    throw err;
  });

  return dbPromise;
}

// ---------------------------------------------------------------------------
// Composite key helper
// ---------------------------------------------------------------------------

function compositeKey(submissionId: string, sectionKey: string): string {
  return `${submissionId}:${sectionKey}`;
}

// ---------------------------------------------------------------------------
// Section CRUD
// ---------------------------------------------------------------------------

/**
 * Save (upsert) a section's field data.
 *
 * Automatically increments the `version` counter if the row already exists,
 * or starts at version 1 for new rows.
 */
export async function saveSectionData(
  submissionId: string,
  sectionKey: string,
  data: Record<string, unknown>,
): Promise<SectionRow> {
  const db = await getDB();
  const key = compositeKey(submissionId, sectionKey);

  const existing = await db.get('sections', key);
  const nextVersion = existing ? existing.version + 1 : 1;
  const now = new Date().toISOString();

  const row: SectionRow = {
    submissionId,
    sectionKey,
    data,
    version: nextVersion,
    updatedAt: now,
  };

  await db.put('sections', row, key);
  return row;
}

/**
 * Load a single section's field data.
 * Returns `null` if no data has been saved for this section yet.
 */
export async function loadSectionData(
  submissionId: string,
  sectionKey: string,
): Promise<SectionRow | null> {
  const db = await getDB();
  const key = compositeKey(submissionId, sectionKey);
  const row = await db.get('sections', key);
  return row ?? null;
}

/**
 * Load all sections belonging to a submission.
 *
 * Uses the `by-submission` index for an efficient range scan rather than
 * loading every row in the store.
 */
export async function loadAllSections(
  submissionId: string,
): Promise<SectionRow[]> {
  const db = await getDB();
  return db.getAllFromIndex('sections', 'by-submission', submissionId);
}

// ---------------------------------------------------------------------------
// Metadata CRUD
// ---------------------------------------------------------------------------

/**
 * Save (upsert) submission-level metadata.
 *
 * The caller supplies partial metadata; `updatedAt` is set automatically.
 * On first save `createdAt` is also set.
 */
export async function saveMetadata(
  submissionId: string,
  partial: Partial<Omit<MetadataRow, 'submissionId' | 'createdAt' | 'updatedAt'>>,
): Promise<MetadataRow> {
  const db = await getDB();
  const now = new Date().toISOString();
  const existing = await db.get('metadata', submissionId);

  const row: MetadataRow = {
    submissionId,
    pdfVersion: partial.pdfVersion ?? existing?.pdfVersion ?? 'sf861',
    completionPct: partial.completionPct ?? existing?.completionPct ?? 0,
    lastSyncedAt:
      partial.lastSyncedAt !== undefined
        ? partial.lastSyncedAt
        : existing?.lastSyncedAt ?? null,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await db.put('metadata', row);
  return row;
}

/**
 * Load submission metadata.
 * Returns `null` if no metadata exists for this submission.
 */
export async function loadMetadata(
  submissionId: string,
): Promise<MetadataRow | null> {
  const db = await getDB();
  const row = await db.get('metadata', submissionId);
  return row ?? null;
}

/**
 * List all locally stored submissions (metadata rows).
 *
 * Useful for a "continue where you left off" screen or multi-submission
 * management.
 */
export async function listSubmissions(): Promise<MetadataRow[]> {
  const db = await getDB();
  return db.getAll('metadata');
}

// ---------------------------------------------------------------------------
// Submission deletion
// ---------------------------------------------------------------------------

/**
 * Delete all data for a submission: sections, metadata, and pending syncs.
 *
 * Runs inside a single readwrite transaction spanning all three stores so
 * the deletion is atomic.
 */
export async function deleteSubmission(submissionId: string): Promise<void> {
  const db = await getDB();

  const tx = db.transaction(
    ['sections', 'metadata', 'pendingSync'],
    'readwrite',
  );

  const sectionsStore = tx.objectStore('sections');
  const metadataStore = tx.objectStore('metadata');
  const pendingSyncStore = tx.objectStore('pendingSync');

  // Delete all section rows for this submission via index cursor.
  const sectionIndex = sectionsStore.index('by-submission');
  let sectionCursor = await sectionIndex.openCursor(submissionId);
  while (sectionCursor) {
    await sectionCursor.delete();
    sectionCursor = await sectionCursor.continue();
  }

  // Delete metadata row (single key).
  await metadataStore.delete(submissionId);

  // Delete pending syncs for this submission via full scan (no index on submissionId).
  let syncCursor = await pendingSyncStore.openCursor();
  while (syncCursor) {
    if (syncCursor.value.submissionId === submissionId) {
      await syncCursor.delete();
    }
    syncCursor = await syncCursor.continue();
  }

  await tx.done;
}

// ---------------------------------------------------------------------------
// Pending sync queue
// ---------------------------------------------------------------------------

/**
 * Enqueue a section change for eventual server sync.
 *
 * This is the write-ahead log for offline-first operation. The SyncEngine
 * drains this queue periodically or on demand.
 */
export async function addPendingSync(
  submissionId: string,
  sectionKey: string,
  data: Record<string, unknown>,
): Promise<number> {
  const db = await getDB();
  const row: PendingSyncRow = {
    submissionId,
    sectionKey,
    data,
    timestamp: new Date().toISOString(),
    retryCount: 0,
  };
  // add() returns the auto-generated key (number).
  const id = await db.add('pendingSync', row);
  return id;
}

/**
 * Retrieve all pending sync entries, ordered by their auto-increment key
 * (which preserves insertion / chronological order).
 *
 * Each returned row includes its `id` so the caller can remove it after
 * a successful sync.
 */
export async function getPendingSyncs(): Promise<
  (PendingSyncRow & { id: number })[]
> {
  const db = await getDB();
  const tx = db.transaction('pendingSync', 'readonly');
  const store = tx.objectStore('pendingSync');

  const results: (PendingSyncRow & { id: number })[] = [];
  let cursor = await store.openCursor();
  while (cursor) {
    results.push({ ...cursor.value, id: cursor.key });
    cursor = await cursor.continue();
  }

  return results;
}

/**
 * Remove a pending sync entry after it has been successfully sent to the
 * server.
 */
export async function removePendingSync(id: number): Promise<void> {
  const db = await getDB();
  await db.delete('pendingSync', id);
}

/**
 * Increment the retry count for a failed sync entry.
 *
 * Returns the updated row, or `null` if the entry no longer exists (e.g.
 * the submission was deleted concurrently).
 */
export async function incrementSyncRetry(
  id: number,
): Promise<PendingSyncRow | null> {
  const db = await getDB();
  const tx = db.transaction('pendingSync', 'readwrite');
  const store = tx.objectStore('pendingSync');

  const cursor = await store.openCursor(id);
  if (!cursor) return null;

  const updated: PendingSyncRow = {
    ...cursor.value,
    retryCount: cursor.value.retryCount + 1,
  };
  await cursor.update(updated);
  await tx.done;
  return updated;
}

// ---------------------------------------------------------------------------
// Nuclear option
// ---------------------------------------------------------------------------

/**
 * Delete the entire database.  Intended for development / debugging only.
 *
 * Closes the singleton connection first so the delete is not blocked.
 */
export async function clearAllData(): Promise<void> {
  if (dbPromise) {
    try {
      const db = await dbPromise;
      db.close();
    } catch {
      // Connection may already be closed or broken -- that is fine.
    }
    dbPromise = null;
  }

  await deleteDB(DB_NAME, {
    blocked() {
      console.warn(
        '[SF86-IDB] clearAllData blocked -- other tabs may hold a connection.',
      );
    },
  });
}
