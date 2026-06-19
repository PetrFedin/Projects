-- Shop inventory ledger grains (ATP read-model for replenishment workspace).

CREATE TABLE IF NOT EXISTS shop_inventory_ledger_grains (
  grain_id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT,
  location_id TEXT NOT NULL DEFAULT 'shop-main',
  state TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  season_tag TEXT,
  collection_id TEXT,
  channel_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shop_inv_grains_shop_sku
  ON shop_inventory_ledger_grains (shop_id, sku);

CREATE INDEX IF NOT EXISTS idx_shop_inv_grains_shop_collection
  ON shop_inventory_ledger_grains (shop_id, collection_id);
