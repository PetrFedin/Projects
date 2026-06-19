-- P3 · Brand attribute schema + size-chart grade feed (per collection / SKU).

CREATE TABLE IF NOT EXISTS brand_attribute_schema_feed (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  collection_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  row_kind TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_attribute_schema_feed_scope
  ON brand_attribute_schema_feed (organization_id, collection_id, sku, row_kind);

CREATE INDEX IF NOT EXISTS idx_brand_attribute_schema_feed_collection
  ON brand_attribute_schema_feed (organization_id, collection_id, row_kind);
