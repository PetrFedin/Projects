-- P3 · Brand pack rules (MOQ / case pack) persisted feed.

CREATE TABLE IF NOT EXISTS brand_pack_rules (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  collection_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  slug TEXT NOT NULL DEFAULT '',
  moq INTEGER,
  case_pack INTEGER,
  lead_weeks INTEGER,
  incoterm TEXT NOT NULL DEFAULT '',
  ship_from TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'catalog',
  rules_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_pack_rules_org_collection_sku
  ON brand_pack_rules (organization_id, collection_id, sku);

CREATE INDEX IF NOT EXISTS idx_brand_pack_rules_collection
  ON brand_pack_rules (organization_id, collection_id);
