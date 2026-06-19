-- P3 · Material passport cert records (development pillar · Material Exchange).

CREATE TABLE IF NOT EXISTS brand_material_passport_certs (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  collection_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  slug TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  has_composition BOOLEAN NOT NULL DEFAULT false,
  has_care BOOLEAN NOT NULL DEFAULT false,
  sustainability_tags INTEGER NOT NULL DEFAULT 0,
  cert_ready BOOLEAN NOT NULL DEFAULT false,
  gap_ru TEXT NOT NULL DEFAULT '',
  cert_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_material_passport_certs_org_collection_sku
  ON brand_material_passport_certs (organization_id, collection_id, sku);

CREATE INDEX IF NOT EXISTS idx_brand_material_passport_certs_collection_ready
  ON brand_material_passport_certs (organization_id, collection_id, cert_ready);
