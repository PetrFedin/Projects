-- P3 · Shop buyer CRM profile (brand segment assignment for greenfield onboarding).

CREATE TABLE IF NOT EXISTS shop_buyer_crm_profiles (
  buyer_id TEXT PRIMARY KEY,
  segment_key TEXT NOT NULL,
  assigned_price_tier TEXT,
  net_term_days INT,
  first_order_discount_pct NUMERIC(5, 2),
  onboarding_note_ru TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shop_buyer_crm_profiles_segment
  ON shop_buyer_crm_profiles (segment_key, updated_at DESC);
