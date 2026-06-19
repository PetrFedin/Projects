-- P3 · Landed margin feed (shop rollup + brand simulator SoT).

CREATE TABLE IF NOT EXISTS workshop2_landed_margin_feed (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  collection_id TEXT NOT NULL,
  order_id TEXT NOT NULL DEFAULT '',
  line_id TEXT NOT NULL,
  sku TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT '',
  wholesale_rub INTEGER NOT NULL DEFAULT 0,
  landed_rub INTEGER NOT NULL DEFAULT 0,
  retail_rub INTEGER,
  production_rub INTEGER,
  source TEXT NOT NULL DEFAULT 'catalog',
  feed_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_workshop2_landed_margin_feed_scope_line
  ON workshop2_landed_margin_feed (organization_id, collection_id, order_id, line_id);

CREATE INDEX IF NOT EXISTS idx_workshop2_landed_margin_feed_collection_order
  ON workshop2_landed_margin_feed (organization_id, collection_id, order_id);
