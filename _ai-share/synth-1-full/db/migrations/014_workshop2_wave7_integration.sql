-- Wave 7: B2B territories (credit hold) + collection signoff stages config

CREATE TABLE IF NOT EXISTS workshop2_b2b_territories (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  territory_id TEXT NOT NULL,
  label_ru TEXT NOT NULL,
  credit_limit_rub BIGINT NOT NULL DEFAULT 0,
  open_orders_rub BIGINT NOT NULL DEFAULT 0,
  customer_name TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_workshop2_b2b_territories_org_territory
  ON workshop2_b2b_territories (organization_id, territory_id);

CREATE TABLE IF NOT EXISTS workshop2_collection_signoff_stages (
  collection_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  stages JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (organization_id, collection_id)
);
