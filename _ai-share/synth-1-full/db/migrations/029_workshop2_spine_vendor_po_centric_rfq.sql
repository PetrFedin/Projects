-- ADR-002 · vendor PO + Centric RFQ PG mirror (pillar 4 procurement spine).

CREATE TABLE IF NOT EXISTS spine_vendor_po (
  vendor_po_id TEXT PRIMARY KEY,
  b2b_order_id TEXT NOT NULL,
  record_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spine_vendor_po_b2b_order
  ON spine_vendor_po (b2b_order_id);

CREATE TABLE IF NOT EXISTS spine_centric_rfq (
  rfq_id TEXT PRIMARY KEY,
  b2b_order_id TEXT,
  record_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spine_centric_rfq_b2b_order
  ON spine_centric_rfq (b2b_order_id)
  WHERE b2b_order_id IS NOT NULL;
