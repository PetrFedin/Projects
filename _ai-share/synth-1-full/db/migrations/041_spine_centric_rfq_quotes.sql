-- P3 · Centric RFQ supplier quote cards (development pillar procurement spine).

CREATE TABLE IF NOT EXISTS spine_centric_rfq_quotes (
  quote_id TEXT PRIMARY KEY,
  rfq_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  supplier_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  amount_rub NUMERIC(14, 2) NOT NULL DEFAULT 0,
  lead_time_days INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'RUB',
  status TEXT NOT NULL DEFAULT 'pending',
  quote_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spine_centric_rfq_quotes_rfq
  ON spine_centric_rfq_quotes (rfq_id, organization_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_spine_centric_rfq_quotes_rfq_supplier
  ON spine_centric_rfq_quotes (rfq_id, organization_id, supplier_id);
