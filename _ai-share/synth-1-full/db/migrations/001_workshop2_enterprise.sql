-- Workshop2 Enterprise schema (PostgreSQL source of truth)
-- Apply: npm run db:apply:workshop2-migrations

-- Коллекции (метаданные; артикулы и досье ссылаются по collection_id)
CREATE TABLE IF NOT EXISTS workshop2_collections (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  display_name TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_collections_org
  ON workshop2_collections (organization_id);

-- Артикулы (метаданные карточки; payload досье — в workshop2_dossiers)
CREATE TABLE IF NOT EXISTS workshop2_articles (
  id TEXT NOT NULL,
  collection_id TEXT NOT NULL REFERENCES workshop2_collections (id) ON DELETE CASCADE,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  internal_code TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection_id, id)
);

CREATE INDEX IF NOT EXISTS idx_workshop2_articles_org
  ON workshop2_articles (organization_id);

-- Текущее состояние досье (jsonb payload + optimistic locking version)
CREATE TABLE IF NOT EXISTS workshop2_dossiers (
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  version INTEGER NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by TEXT,
  dossier_json JSONB NOT NULL,
  PRIMARY KEY (collection_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_workshop2_dossiers_org
  ON workshop2_dossiers (organization_id);

-- История версий досье
CREATE TABLE IF NOT EXISTS workshop2_dossier_versions (
  id BIGSERIAL PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  version INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT,
  dossier_json JSONB NOT NULL,
  UNIQUE (collection_id, article_id, version)
);

-- Audit log доменных событий
CREATE TABLE IF NOT EXISTS workshop2_dossier_events (
  id BIGSERIAL PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  version INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  event_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_workshop2_dossier_events_room
  ON workshop2_dossier_events (collection_id, article_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_workshop2_dossier_events_type
  ON workshop2_dossier_events (event_type);

-- Снимки финального экспорта ТЗ
CREATE TABLE IF NOT EXISTS workshop2_dossier_snapshots (
  id BIGSERIAL PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  snapshot_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dossier_json JSONB NOT NULL,
  UNIQUE (collection_id, article_id, snapshot_id)
);

-- Метаданные документов Vault (бинарники — S3/ blob_path, см. TODO в plan)
CREATE TABLE IF NOT EXISTS workshop2_vault_documents (
  id BIGSERIAL PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  document_id TEXT NOT NULL,
  file_name TEXT,
  mime_type TEXT,
  size_bytes BIGINT,
  storage_path TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT,
  UNIQUE (collection_id, article_id, document_id)
);

CREATE INDEX IF NOT EXISTS idx_workshop2_vault_documents_room
  ON workshop2_vault_documents (collection_id, article_id);

-- Backfill columns for DBs created by legacy ensurePgReady() (CREATE TABLE IF NOT EXISTS без org/actor)
ALTER TABLE workshop2_dossiers ADD COLUMN IF NOT EXISTS organization_id TEXT NOT NULL DEFAULT 'org-brand-001';
ALTER TABLE workshop2_dossiers ADD COLUMN IF NOT EXISTS updated_by TEXT;
ALTER TABLE workshop2_dossier_versions ADD COLUMN IF NOT EXISTS organization_id TEXT NOT NULL DEFAULT 'org-brand-001';
ALTER TABLE workshop2_dossier_versions ADD COLUMN IF NOT EXISTS updated_by TEXT;
ALTER TABLE workshop2_dossier_events ADD COLUMN IF NOT EXISTS organization_id TEXT NOT NULL DEFAULT 'org-brand-001';
ALTER TABLE workshop2_dossier_events ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE workshop2_dossier_snapshots ADD COLUMN IF NOT EXISTS organization_id TEXT NOT NULL DEFAULT 'org-brand-001';
