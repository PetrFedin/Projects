-- ADR-002 · spine imported wholesale orders (INT-*) — PG SoT alongside file mirror.

CREATE TABLE IF NOT EXISTS spine_imported_wholesale_orders (
  wholesale_order_id TEXT PRIMARY KEY,
  external_key TEXT NOT NULL UNIQUE,
  order_json JSONB NOT NULL,
  line_items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spine_imported_wholesale_updated
  ON spine_imported_wholesale_orders (updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_spine_imported_wholesale_external_key
  ON spine_imported_wholesale_orders (external_key);
