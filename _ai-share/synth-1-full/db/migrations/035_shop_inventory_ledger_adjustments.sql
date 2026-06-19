-- Shop inventory reconcile → ledger adjust journal.

CREATE TABLE IF NOT EXISTS shop_inventory_ledger_adjustments (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL DEFAULT 'cycle_count_reconcile',
  adjusted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shop_inv_adj_shop_sku
  ON shop_inventory_ledger_adjustments (shop_id, sku);
