// ---------------------------------------------------------------------------
// SF-86 Database Queries — Typed Functions for All Tables
// ---------------------------------------------------------------------------

import { query, withTransaction } from './client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  mfa_secret: string | null;
  mfa_enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DbSubmission {
  id: string;
  user_id: string;
  pdf_version: string;
  status: string;
  completion_pct: number;
  created_at: Date;
  updated_at: Date;
}

export interface DbSectionData {
  section_key: string;
  data: Record<string, unknown>;
  version: number;
  updated_at: Date;
}

export interface DbAuditEntry {
  id: number;
  user_id: string | null;
  submission_id: string | null;
  action: string;
  section_key: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: Date;
}

export interface DbPdfExport {
  id: string;
  submission_id: string;
  file_hash: string | null;
  file_size_bytes: number | null;
  has_continuation: boolean;
  continuation_pages: number;
  created_at: Date;
}

// ---------------------------------------------------------------------------
// Encryption key helper
// ---------------------------------------------------------------------------

function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set.');
  }
  return key;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function createUser(
  email: string,
  passwordHash: string,
): Promise<DbUser> {
  const { rows } = await query<DbUser>(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING *`,
    [email, passwordHash],
  );
  return rows[0];
}

export async function getUserByEmail(
  email: string,
): Promise<DbUser | null> {
  const { rows } = await query<DbUser>(
    'SELECT * FROM users WHERE email = $1',
    [email],
  );
  return rows[0] ?? null;
}

export async function getUserById(id: string): Promise<DbUser | null> {
  const { rows } = await query<DbUser>(
    'SELECT * FROM users WHERE id = $1',
    [id],
  );
  return rows[0] ?? null;
}

export async function updateUserMfa(
  userId: string,
  mfaSecret: string | null,
  mfaEnabled: boolean,
): Promise<void> {
  await query(
    'UPDATE users SET mfa_secret = $1, mfa_enabled = $2 WHERE id = $3',
    [mfaSecret, mfaEnabled, userId],
  );
}

// ---------------------------------------------------------------------------
// Form Submissions
// ---------------------------------------------------------------------------

export async function createSubmission(
  userId: string,
  pdfVersion = 'sf861',
): Promise<DbSubmission> {
  const { rows } = await query<DbSubmission>(
    `INSERT INTO form_submissions (user_id, pdf_version)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, pdfVersion],
  );
  return rows[0];
}

export async function getSubmission(
  submissionId: string,
): Promise<DbSubmission | null> {
  const { rows } = await query<DbSubmission>(
    'SELECT * FROM form_submissions WHERE id = $1',
    [submissionId],
  );
  return rows[0] ?? null;
}

export async function getSubmissionsByUser(
  userId: string,
): Promise<DbSubmission[]> {
  const { rows } = await query<DbSubmission>(
    'SELECT * FROM form_submissions WHERE user_id = $1 ORDER BY updated_at DESC',
    [userId],
  );
  return rows;
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: string,
): Promise<void> {
  await query(
    'UPDATE form_submissions SET status = $1 WHERE id = $2',
    [status, submissionId],
  );
}

export async function updateSubmissionCompletion(
  submissionId: string,
  completionPct: number,
): Promise<void> {
  await query(
    'UPDATE form_submissions SET completion_pct = $1 WHERE id = $2',
    [completionPct, submissionId],
  );
}

export async function deleteServerSubmission(
  submissionId: string,
): Promise<void> {
  await query(
    'DELETE FROM form_submissions WHERE id = $1',
    [submissionId],
  );
}

// ---------------------------------------------------------------------------
// Section Data (encrypted)
// ---------------------------------------------------------------------------

/**
 * Upsert a section's field data with AES-256 encryption.
 *
 * If `expectedVersion` is provided, performs an optimistic concurrency
 * check — the write only succeeds if the current DB version matches.
 */
export async function saveSectionToDb(
  submissionId: string,
  sectionKey: string,
  data: Record<string, unknown>,
  expectedVersion?: number,
): Promise<{ version: number; updatedAt: Date }> {
  const encKey = getEncryptionKey();
  const jsonData = JSON.stringify(data);

  if (expectedVersion !== undefined) {
    // Optimistic concurrency: only update if version matches
    return withTransaction(async (client) => {
      const { rows: existing } = await client.query<{ version: number }>(
        `SELECT version FROM section_data
         WHERE submission_id = $1 AND section_key = $2`,
        [submissionId, sectionKey],
      );

      if (existing.length > 0 && existing[0].version !== expectedVersion) {
        throw new Error(
          `Version conflict: expected ${expectedVersion}, found ${existing[0].version}`,
        );
      }

      const nextVersion = existing.length > 0 ? existing[0].version + 1 : 1;

      const { rows } = await client.query<{ version: number; updated_at: Date }>(
        `INSERT INTO section_data (submission_id, section_key, data_encrypted, version)
         VALUES ($1, $2, encrypt_section_data($3, $4), $5)
         ON CONFLICT (submission_id, section_key)
         DO UPDATE SET
           data_encrypted = encrypt_section_data($3, $4),
           version = $5
         RETURNING version, updated_at`,
        [submissionId, sectionKey, jsonData, encKey, nextVersion],
      );

      return { version: rows[0].version, updatedAt: rows[0].updated_at };
    });
  }

  // No version check — simple upsert, auto-increment version
  const { rows } = await query<{ version: number; updated_at: Date }>(
    `INSERT INTO section_data (submission_id, section_key, data_encrypted, version)
     VALUES ($1, $2, encrypt_section_data($3, $4), 1)
     ON CONFLICT (submission_id, section_key)
     DO UPDATE SET
       data_encrypted = encrypt_section_data($3, $4),
       version = section_data.version + 1
     RETURNING version, updated_at`,
    [submissionId, sectionKey, jsonData, encKey],
  );

  return { version: rows[0].version, updatedAt: rows[0].updated_at };
}

/**
 * Load and decrypt a single section's data.
 */
export async function loadSectionFromDb(
  submissionId: string,
  sectionKey: string,
): Promise<DbSectionData | null> {
  const encKey = getEncryptionKey();

  const { rows } = await query<{
    section_key: string;
    decrypted: string;
    version: number;
    updated_at: Date;
  }>(
    `SELECT section_key,
            decrypt_section_data(data_encrypted, $3) AS decrypted,
            version,
            updated_at
     FROM section_data
     WHERE submission_id = $1 AND section_key = $2`,
    [submissionId, sectionKey, encKey],
  );

  if (rows.length === 0) return null;

  return {
    section_key: rows[0].section_key,
    data: JSON.parse(rows[0].decrypted) as Record<string, unknown>,
    version: rows[0].version,
    updated_at: rows[0].updated_at,
  };
}

/**
 * Load metadata (without decrypted data) for all sections of a submission.
 */
export async function loadAllSectionsFromDb(
  submissionId: string,
): Promise<Array<{ section_key: string; version: number; updated_at: Date }>> {
  const { rows } = await query<{
    section_key: string;
    version: number;
    updated_at: Date;
  }>(
    `SELECT section_key, version, updated_at
     FROM section_data
     WHERE submission_id = $1
     ORDER BY section_key`,
    [submissionId],
  );
  return rows;
}

// ---------------------------------------------------------------------------
// Audit Log
// ---------------------------------------------------------------------------

export async function logAudit(
  userId: string | null,
  submissionId: string | null,
  action: string,
  sectionKey?: string,
  metadata?: Record<string, unknown>,
  ipAddress?: string,
): Promise<void> {
  await query(
    `INSERT INTO audit_log (user_id, submission_id, action, section_key, metadata, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      userId,
      submissionId,
      action,
      sectionKey ?? null,
      metadata ? JSON.stringify(metadata) : null,
      ipAddress ?? null,
    ],
  );
}

export async function getAuditLog(
  submissionId: string,
  limit = 100,
): Promise<DbAuditEntry[]> {
  const { rows } = await query<DbAuditEntry>(
    `SELECT * FROM audit_log
     WHERE submission_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [submissionId, limit],
  );
  return rows;
}

// ---------------------------------------------------------------------------
// PDF Exports
// ---------------------------------------------------------------------------

export async function recordPdfExport(
  submissionId: string,
  fileHash: string | null,
  fileSize: number | null,
  hasContinuation: boolean,
  continuationPages = 0,
): Promise<void> {
  await query(
    `INSERT INTO pdf_exports (submission_id, file_hash, file_size_bytes, has_continuation, continuation_pages)
     VALUES ($1, $2, $3, $4, $5)`,
    [submissionId, fileHash, fileSize, hasContinuation, continuationPages],
  );
}

export async function getPdfExports(
  submissionId: string,
): Promise<DbPdfExport[]> {
  const { rows } = await query<DbPdfExport>(
    `SELECT * FROM pdf_exports
     WHERE submission_id = $1
     ORDER BY created_at DESC`,
    [submissionId],
  );
  return rows;
}
