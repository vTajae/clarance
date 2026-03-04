-- ===========================================================
-- SF-86 Database Schema — Cloudflare D1 (SQLite)
-- ===========================================================
-- Lightweight: only users + terms acceptance.
-- All form data lives client-side (IndexedDB + Jotai).
--
-- Apply with:
--   wrangler d1 execute clarance --remote --file=db/d1-init.sql
-- ===========================================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  terms_accepted INTEGER DEFAULT 0,
  terms_accepted_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
