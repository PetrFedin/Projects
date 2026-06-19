-- Platform Core MES: этапы выпуска PO (cut / sew / qc / released)

ALTER TABLE workshop2_purchase_orders
  ADD COLUMN IF NOT EXISTS mes_release_stage TEXT NOT NULL DEFAULT 'queued';

COMMENT ON COLUMN workshop2_purchase_orders.mes_release_stage IS
  'MES выпуск серии: queued | cut | sew | qc | released';

UPDATE workshop2_purchase_orders
SET mes_release_stage = 'cut'
WHERE status = 'synced'
  AND payload->>'source' = 'b2b_production_handoff'
  AND mes_release_stage = 'queued';

CREATE INDEX IF NOT EXISTS idx_workshop2_po_mes_release_handoff
  ON workshop2_purchase_orders (mes_release_stage, updated_at DESC)
  WHERE payload->>'source' = 'b2b_production_handoff';
