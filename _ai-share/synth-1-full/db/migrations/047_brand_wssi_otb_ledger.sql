-- P3 · Brand WSSI OTB ledger (mix + capacity rows per collection).

CREATE TABLE IF NOT EXISTS brand_wssi_otb_ledger (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  collection_id TEXT NOT NULL,
  row_kind TEXT NOT NULL,
  row_key TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_wssi_otb_ledger_scope
  ON brand_wssi_otb_ledger (organization_id, collection_id, row_kind, row_key);

CREATE INDEX IF NOT EXISTS idx_brand_wssi_otb_ledger_collection
  ON brand_wssi_otb_ledger (organization_id, collection_id);
