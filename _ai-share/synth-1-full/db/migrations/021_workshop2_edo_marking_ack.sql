-- Wave 45: persistent ACK rows for Kontur ЭДО + Честный ЗНАК (survives restart in PG-only mode)

CREATE TABLE IF NOT EXISTS workshop2_edo_ack (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'journal_only',
  http_status INTEGER,
  external_ref TEXT,
  journal_id TEXT,
  demo_mode BOOLEAN NOT NULL DEFAULT FALSE,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_edo_ack_article
  ON workshop2_edo_ack (collection_id, article_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS workshop2_marking_ack (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'journal_only',
  http_status INTEGER,
  external_ref TEXT,
  journal_id TEXT,
  demo_mode BOOLEAN NOT NULL DEFAULT FALSE,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_marking_ack_article
  ON workshop2_marking_ack (collection_id, article_id, updated_at DESC);
