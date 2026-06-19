-- P3 · Brand pricelist version rows (collection-scoped SoT).

CREATE TABLE IF NOT EXISTS brand_pricelist_versions (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  collection_id TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  channel TEXT NOT NULL DEFAULT 'retail_a',
  valid_from TEXT NOT NULL DEFAULT '',
  valid_to TEXT NOT NULL DEFAULT '',
  list_type TEXT NOT NULL DEFAULT 'multiplier',
  multiplier NUMERIC,
  customer_group_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  overrides_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  list_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_pricelist_versions_org_collection_id
  ON brand_pricelist_versions (organization_id, collection_id, id);

CREATE INDEX IF NOT EXISTS idx_brand_pricelist_versions_collection_channel
  ON brand_pricelist_versions (organization_id, collection_id, channel);
