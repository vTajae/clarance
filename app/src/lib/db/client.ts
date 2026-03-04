/**
 * Cloudflare D1 Database Client
 *
 * Thin wrapper around D1 accessed via @opennextjs/cloudflare's
 * getCloudflareContext(). Exposes the same query<T>() and
 * withTransaction() signatures so call-sites don't change.
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';

// Extend the global CloudflareEnv with our D1 binding
declare global {
  interface CloudflareEnv {
    DB: D1Database;
  }
}

/** Get the D1 database binding from the Cloudflare context. */
async function getDB(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.DB) {
    throw new Error('D1 database binding "DB" is not configured in wrangler.jsonc');
  }
  return env.DB;
}

// ---------------------------------------------------------------------------
// Typed query helper
// ---------------------------------------------------------------------------

export interface QueryResult<T> {
  rows: T[];
}

/**
 * Execute a parameterised SQL query against D1.
 * Uses `?` placeholders (SQLite style).
 */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  const db = await getDB();
  const stmt = db.prepare(sql);
  const bound = params && params.length > 0 ? stmt.bind(...params) : stmt;
  const result = await bound.all<T>();
  return { rows: result.results ?? [] };
}

/**
 * Execute a SQL statement that doesn't return rows (INSERT/UPDATE/DELETE).
 * Returns D1 run metadata (last_row_id, changes, etc.).
 */
export async function run(
  sql: string,
  params?: unknown[],
): Promise<D1Result> {
  const db = await getDB();
  const stmt = db.prepare(sql);
  const bound = params && params.length > 0 ? stmt.bind(...params) : stmt;
  return bound.run();
}

// ---------------------------------------------------------------------------
// Transaction helper — D1 batch()
// ---------------------------------------------------------------------------

/**
 * Execute multiple statements atomically using D1's batch() API.
 * All statements succeed or all fail together.
 */
export async function batch(
  statements: D1PreparedStatement[],
): Promise<D1Result[]> {
  const db = await getDB();
  return db.batch(statements);
}

/** Get a raw D1 prepared statement for use with batch(). */
export async function prepare(sql: string): Promise<{
  db: D1Database;
  stmt: D1PreparedStatement;
}> {
  const db = await getDB();
  return { db, stmt: db.prepare(sql) };
}
