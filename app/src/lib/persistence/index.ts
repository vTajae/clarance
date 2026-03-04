// ---------------------------------------------------------------------------
// SF-86 Persistence Layer -- Barrel Export (IndexedDB only, no server sync)
// ---------------------------------------------------------------------------

export {
  getDB,
  saveSectionData,
  loadSectionData,
  loadAllSections,
  saveMetadata,
  loadMetadata,
  listSubmissions,
  deleteSubmission,
  clearAllData,
} from './indexeddb-client';

export type {
  SectionRow,
  MetadataRow,
} from './indexeddb-client';
