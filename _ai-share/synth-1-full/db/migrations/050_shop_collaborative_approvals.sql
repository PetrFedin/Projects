-- P3 · Shop collaborative order approval workflow (buyer + order scope).

CREATE TABLE IF NOT EXISTS shop_collaborative_approvals (
  buyer_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  matrix_done BOOLEAN NOT NULL DEFAULT FALSE,
  margin_done BOOLEAN NOT NULL DEFAULT FALSE,
  submit_done BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (buyer_id, order_id)
);

CREATE INDEX IF NOT EXISTS idx_shop_collaborative_approvals_updated
  ON shop_collaborative_approvals (updated_at DESC);
