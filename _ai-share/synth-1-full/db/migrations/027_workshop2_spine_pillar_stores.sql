-- ADR-002 · pillar 3–4 stores: allocation, working order, production WIP, wholesale export.

CREATE TABLE IF NOT EXISTS spine_allocation_queue (
  wholesale_order_id TEXT PRIMARY KEY,
  record_json JSONB NOT NULL,
  queue_position INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spine_allocation_queue_position
  ON spine_allocation_queue (queue_position DESC);

CREATE TABLE IF NOT EXISTS spine_working_order_versions (
  version_id TEXT PRIMARY KEY,
  wholesale_order_id TEXT NOT NULL,
  version_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spine_working_order_versions_order
  ON spine_working_order_versions (wholesale_order_id, created_at ASC);

CREATE TABLE IF NOT EXISTS spine_production_wip (
  production_order_id TEXT PRIMARY KEY,
  b2b_order_id TEXT NOT NULL,
  record_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spine_production_wip_b2b
  ON spine_production_wip (b2b_order_id);

CREATE TABLE IF NOT EXISTS spine_wholesale_export (
  wholesale_order_id TEXT PRIMARY KEY,
  record_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
