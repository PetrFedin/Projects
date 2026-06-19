-- Workshop2 phase-7: purchase orders (снабжение + план) + связь с sample orders

CREATE TABLE IF NOT EXISTS workshop2_purchase_orders (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  line_ref TEXT,
  supplier_id TEXT,
  qty NUMERIC(12, 3) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  erp_external_id TEXT,
  synced_at TIMESTAMPTZ,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_po_room
  ON workshop2_purchase_orders (collection_id, article_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_workshop2_po_erp
  ON workshop2_purchase_orders (erp_external_id)
  WHERE erp_external_id IS NOT NULL;

ALTER TABLE workshop2_sample_orders
  ADD COLUMN IF NOT EXISTS purchase_order_ids JSONB NOT NULL DEFAULT '[]'::jsonb;
