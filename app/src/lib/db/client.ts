/**
 * PostgreSQL Connection Pool — Server-Side Only
 *
 * Provides a singleton connection pool and a typed `query` helper.
 * All queries use parameterised placeholders ($1, $2, ...) to prevent
 * SQL injection. The pool is created lazily on first use and reused
 * across hot-reloads in development via a global reference.
 */

import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

// ---------------------------------------------------------------------------
// Singleton pool (survives Next.js hot-reload in dev)
// ---------------------------------------------------------------------------

const globalForPg = globalThis as typeof globalThis & {
  __pgPool?: Pool;
};

function getPool(): Pool {
  if (!globalForPg.__pgPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL environment variable is not set. " +
          "Add it to .env.local for local development."
      );
    }

    globalForPg.__pgPool = new Pool({
      connectionString,
      // Conservative defaults — tune per deployment.
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });

    // Surface connection errors instead of silently swallowing them.
    globalForPg.__pgPool.on("error", (err) => {
      console.error("[pg] Unexpected error on idle client:", err);
    });
  }

  return globalForPg.__pgPool;
}

export const pool: Pool = getPool();

// ---------------------------------------------------------------------------
// Typed query helper
// ---------------------------------------------------------------------------

/**
 * Execute a parameterised SQL query against the pool.
 *
 * @example
 *   const { rows } = await query<User>(
 *     "SELECT * FROM users WHERE id = $1",
 *     [userId]
 *   );
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

// ---------------------------------------------------------------------------
// Transaction helper
// ---------------------------------------------------------------------------

/**
 * Run `fn` inside a database transaction. Commits on success, rolls back
 * on any thrown error, and always releases the client back to the pool.
 *
 * @example
 *   const user = await withTransaction(async (client) => {
 *     const { rows } = await client.query("INSERT INTO users ...");
 *     await client.query("INSERT INTO audit_log ...");
 *     return rows[0];
 *   });
 */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
