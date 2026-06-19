-- P3 · Material passport rollup rows (composition SoT for release/export).

CREATE TABLE IF NOT EXISTS brand_material_passport_rollup (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  collection_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  slug TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '',
  season TEXT NOT NULL DEFAULT '',
  composition_text TEXT NOT NULL DEFAULT '',
  care_ids TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'catalog',
  rollup_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_material_passport_rollup_org_collection_sku
  ON brand_material_passport_rollup (organization_id, collection_id, sku);

CREATE INDEX IF NOT EXISTS idx_brand_material_passport_rollup_collection
  ON brand_material_passport_rollup (organization_id, collection_id);
