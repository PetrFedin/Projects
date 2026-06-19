-- Wave 36: PG store for shop↔brand partnership onboarding (discover → connected).
CREATE TABLE IF NOT EXISTS shop_b2b_partnerships (
  id TEXT PRIMARY KEY,
  buyer_id TEXT NOT NULL,
  brand_id TEXT NOT NULL,
  brand_slug TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('requested', 'connected')),
  collection_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  connected_at TIMESTAMPTZ,
  UNIQUE (buyer_id, brand_id)
);

CREATE INDEX IF NOT EXISTS idx_shop_b2b_partnerships_buyer
  ON shop_b2b_partnerships (buyer_id, status);
