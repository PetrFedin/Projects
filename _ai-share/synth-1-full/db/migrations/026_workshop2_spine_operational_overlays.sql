-- ADR-002 · spine operational overlays: integration meta, delivery windows, tracking.

CREATE TABLE IF NOT EXISTS spine_integration_meta (
  wholesale_order_id TEXT PRIMARY KEY,
  meta_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS spine_delivery_windows (
  wholesale_order_id TEXT PRIMARY KEY,
  record_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spine_delivery_windows_updated
  ON spine_delivery_windows (updated_at DESC);

CREATE TABLE IF NOT EXISTS spine_order_tracking (
  wholesale_order_id TEXT PRIMARY KEY,
  shipment_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spine_order_tracking_updated
  ON spine_order_tracking (updated_at DESC);
