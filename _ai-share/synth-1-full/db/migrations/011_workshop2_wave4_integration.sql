-- Wave 4: commission journal (optional PG), EDI inbound journal

CREATE TABLE IF NOT EXISTS workshop2_b2b_commissions (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  rep_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  order_total_rub NUMERIC(14, 2) NOT NULL DEFAULT 0,
  commission_pct NUMERIC(5, 2) NOT NULL DEFAULT 5,
  commission_rub NUMERIC(14, 2) NOT NULL DEFAULT 0,
  customer_name TEXT,
  attributed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_b2b_commissions_rep
  ON workshop2_b2b_commissions (organization_id, rep_id, attributed_at DESC);

CREATE TABLE IF NOT EXISTS workshop2_edi_inbound_journal (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  document_type TEXT NOT NULL,
  retailer_id TEXT NOT NULL DEFAULT 'unknown',
  purchase_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'journal_only',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_edi_inbound_journal_type
  ON workshop2_edi_inbound_journal (document_type, received_at DESC);
