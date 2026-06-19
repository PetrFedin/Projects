-- Workshop2 Sample Shop M3: audit trail статусов заказа образца (синхрон с movement).
-- Apply: npm run db:apply:workshop2-migrations

ALTER TABLE workshop2_sample_orders
  ADD COLUMN IF NOT EXISTS status_history JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN workshop2_sample_orders.status_history IS
  'История переходов status (from/to/at/actor) — дополняет movement_log.';
