// ---------------------------------------------------------------------------
// SF-86 Database Layer -- Barrel Export
// ---------------------------------------------------------------------------

export { pool, query, withTransaction } from './client';

export {
  // Users
  createUser,
  getUserByEmail,
  getUserById,
  updateUserMfa,
  // Submissions
  createSubmission,
  getSubmission,
  getSubmissionsByUser,
  updateSubmissionStatus,
  updateSubmissionCompletion,
  deleteServerSubmission,
  // Section data (encrypted)
  saveSectionToDb,
  loadSectionFromDb,
  loadAllSectionsFromDb,
  // Audit
  logAudit,
  getAuditLog,
  // PDF exports
  recordPdfExport,
  getPdfExports,
} from './queries';

export type {
  DbUser,
  DbSubmission,
  DbSectionData,
  DbAuditEntry,
  DbPdfExport,
} from './queries';
