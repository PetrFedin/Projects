-- Shop replenishment rules preset (Onfinity Parameters mirror).

CREATE TABLE IF NOT EXISTS shop_replenishment_rules (
  buyer_id TEXT PRIMARY KEY,
  active_preset_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shop_replenishment_rules_updated
  ON shop_replenishment_rules (updated_at DESC);
