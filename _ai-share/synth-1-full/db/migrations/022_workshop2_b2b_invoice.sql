-- Wave 54: B2B invoice rows (PG mirror for billing export)
CREATE TABLE IF NOT EXISTS workshop2_b2b_invoice (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  brand_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  total_rub NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  pdf_path_placeholder_ru TEXT,
  invoice_html_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_workshop2_b2b_invoice_tenant ON workshop2_b2b_invoice(tenant_id);
-- Wave 56: idempotent add column on existing deployments
ALTER TABLE workshop2_b2b_invoice ADD COLUMN IF NOT EXISTS invoice_html_url TEXT;
