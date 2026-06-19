-- P2 QC gate: server-side shipment block (Inspectorio / AQL parity).

CREATE TABLE IF NOT EXISTS workshop2_qc_inspections (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  order_id TEXT NOT NULL,
  po_id TEXT,
  collection_id TEXT,
  article_id TEXT,
  result TEXT NOT NULL CHECK (result IN ('pass', 'fail', 'rework', 'pending')),
  blocks_shipment BOOLEAN NOT NULL DEFAULT false,
  inspector_label TEXT,
  inspected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_qc_inspections_order
  ON workshop2_qc_inspections (organization_id, order_id, inspected_at DESC);

CREATE INDEX IF NOT EXISTS idx_workshop2_qc_inspections_collection
  ON workshop2_qc_inspections (organization_id, collection_id, inspected_at DESC);
