-- Collection order · brand pricelist tier sync → shop landed margin / matrix.

CREATE TABLE IF NOT EXISTS brand_pricelist_tier_sync (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  collection_id TEXT NOT NULL,
  tier_id TEXT NOT NULL,
  price_list_id TEXT NOT NULL,
  price_list_name TEXT NOT NULL DEFAULT '',
  multiplier NUMERIC(8, 4) NOT NULL DEFAULT 1,
  shop_synced BOOLEAN NOT NULL DEFAULT false,
  sync_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  synced_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_pricelist_tier_sync_org_collection_tier
  ON brand_pricelist_tier_sync (organization_id, collection_id, tier_id);

CREATE INDEX IF NOT EXISTS idx_brand_pricelist_tier_sync_shop_synced
  ON brand_pricelist_tier_sync (organization_id, collection_id, shop_synced);
