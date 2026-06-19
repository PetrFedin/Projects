-- P1 brand CRM: segment as persisted object (Onfinity BP query + tier terms).

CREATE TABLE IF NOT EXISTS brand_crm_segments (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  segment_key TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  customer_group_id TEXT,
  query JSONB NOT NULL DEFAULT '{}'::jsonb,
  default_price_tier TEXT NOT NULL DEFAULT 'retail_b',
  default_net_term_days INT NOT NULL DEFAULT 30,
  first_order_discount_pct NUMERIC(5, 2),
  vat_exempt BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, segment_key)
);

CREATE INDEX IF NOT EXISTS idx_brand_crm_segments_org
  ON brand_crm_segments (organization_id, updated_at DESC);
