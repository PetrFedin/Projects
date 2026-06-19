-- Wave 21: native B2B orders (JOOR/NuOrder parity, RU market).

CREATE TABLE IF NOT EXISTS workshop2_b2b_orders (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  collection_id TEXT,
  article_id TEXT,
  buyer_id TEXT,
  rep_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  tier TEXT NOT NULL DEFAULT 'standard',
  total_rub NUMERIC(14, 2) NOT NULL DEFAULT 0,
  lines JSONB NOT NULL DEFAULT '[]'::jsonb,
  commission_preview JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_b2b_orders_org_status
  ON workshop2_b2b_orders (organization_id, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_workshop2_b2b_orders_collection
  ON workshop2_b2b_orders (organization_id, collection_id, updated_at DESC);

ALTER TABLE workshop2_showroom_campaigns
  ADD COLUMN IF NOT EXISTS visibility_tier TEXT NOT NULL DEFAULT 'standard';

ALTER TABLE workshop2_showroom_campaigns
  ADD COLUMN IF NOT EXISTS article_ids JSONB NOT NULL DEFAULT '[]'::jsonb;
