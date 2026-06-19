-- Wave 6: Shopify OAuth tokens, B2B marketplace inbound, commission payout status

CREATE TABLE IF NOT EXISTS workshop2_shopify_connections (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  shop TEXT NOT NULL,
  access_token TEXT NOT NULL,
  scopes TEXT,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_workshop2_shopify_connections_org_shop
  ON workshop2_shopify_connections (organization_id, shop);

CREATE TABLE IF NOT EXISTS workshop2_b2b_marketplace_orders (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  external_order_id TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'joor',
  campaign_id TEXT,
  status TEXT NOT NULL DEFAULT 'stub_received',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_b2b_marketplace_orders_ext
  ON workshop2_b2b_marketplace_orders (organization_id, external_order_id, provider);

ALTER TABLE workshop2_b2b_commissions
  ADD COLUMN IF NOT EXISTS payout_status TEXT NOT NULL DEFAULT 'accrued';

CREATE INDEX IF NOT EXISTS idx_workshop2_b2b_commissions_payout
  ON workshop2_b2b_commissions (organization_id, rep_id, payout_status);
