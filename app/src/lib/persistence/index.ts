// ---------------------------------------------------------------------------
// SF-86 Persistence Layer -- Barrel Export
// ---------------------------------------------------------------------------

// IndexedDB client (section-level storage)
export {
  getDB,
  saveSectionData,
  loadSectionData,
  loadAllSections,
  saveMetadata,
  loadMetadata,
  listSubmissions,
  deleteSubmission,
  addPendingSync,
  getPendingSyncs,
  removePendingSync,
  incrementSyncRetry,
  clearAllData,
} from './indexeddb-client';

export type {
  SectionRow,
  MetadataRow,
  PendingSyncRow,
} from './indexeddb-client';

// Sync engine (offline-first server sync)
export { SyncEngine, SyncStatusEvent } from './sync-engine';

export type {
  SyncStatus,
  SyncFunction,
  SyncStatusEventDetail,
} from './sync-engine';
