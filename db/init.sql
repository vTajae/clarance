-- ===========================================================
-- SF-86 Database Schema Initialization
-- ===========================================================
-- This script runs once when the PostgreSQL container is
-- first created. To re-run, delete the pgdata volume:
--   docker compose down -v && docker compose up -d
-- ===========================================================

-- Enable pgcrypto for AES-256 encryption of PII
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------
-- Users
-- -----------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  mfa_secret VARCHAR(255),
  mfa_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------
-- Form Submissions
-- -----------------------------------------------------------
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pdf_version VARCHAR(10) NOT NULL DEFAULT 'sf861',
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_progress', 'review', 'submitted', 'exported')),
  completion_pct NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------
-- Section Data (encrypted PII)
-- -----------------------------------------------------------
-- Each row stores one section's JSON payload encrypted with
-- pgcrypto AES-256. Decryption requires the ENCRYPTION_KEY
-- environment variable passed at query time.
-- -----------------------------------------------------------
CREATE TABLE section_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES form_submissions(id) ON DELETE CASCADE,
  section_key VARCHAR(50) NOT NULL,
  data_encrypted BYTEA NOT NULL,
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(submission_id, section_key)
);

-- -----------------------------------------------------------
-- Audit Log
-- -----------------------------------------------------------
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  submission_id UUID REFERENCES form_submissions(id),
  action VARCHAR(50) NOT NULL,
  section_key VARCHAR(50),
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------
-- PDF Exports Tracking
-- -----------------------------------------------------------
CREATE TABLE pdf_exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES form_submissions(id) ON DELETE CASCADE,
  file_hash VARCHAR(64),
  file_size_bytes BIGINT,
  has_continuation BOOLEAN DEFAULT FALSE,
  continuation_pages INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================================
-- Indexes
-- ===========================================================
CREATE INDEX idx_form_submissions_user ON form_submissions(user_id);
CREATE INDEX idx_section_data_submission ON section_data(submission_id);
CREATE INDEX idx_section_data_lookup ON section_data(submission_id, section_key);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_submission ON audit_log(submission_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);
CREATE INDEX idx_pdf_exports_submission ON pdf_exports(submission_id);

-- ===========================================================
-- Helper Functions for Encryption / Decryption
-- ===========================================================
-- Usage:
--   INSERT INTO section_data (submission_id, section_key, data_encrypted)
--   VALUES ($1, $2, encrypt_section_data($3::text, $4::text));
--
--   SELECT decrypt_section_data(data_encrypted, $1) FROM section_data WHERE ...;
-- ===========================================================

CREATE OR REPLACE FUNCTION encrypt_section_data(data TEXT, key TEXT)
RETURNS BYTEA AS $$
BEGIN
  RETURN pgp_sym_encrypt(data, key);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrypt_section_data(encrypted_data BYTEA, key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_data, key);
END;
$$ LANGUAGE plpgsql;

-- ===========================================================
-- Auto-update updated_at Trigger
-- ===========================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_form_submissions_updated_at
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_section_data_updated_at
  BEFORE UPDATE ON section_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
