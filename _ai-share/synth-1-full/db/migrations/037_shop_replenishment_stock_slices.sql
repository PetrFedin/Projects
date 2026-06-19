-- Shop replenishment Stock·ATP saved filter slice (Onfinity saved views).

CREATE TABLE IF NOT EXISTS shop_replenishment_stock_slices (
  buyer_id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL DEFAULT 'shop1',
  season_id TEXT NOT NULL DEFAULT 'all',
  collection_id TEXT NOT NULL DEFAULT 'all',
  label_ru TEXT NOT NULL DEFAULT 'Все сезоны',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shop_replenishment_stock_slices_updated
  ON shop_replenishment_stock_slices (updated_at DESC);
