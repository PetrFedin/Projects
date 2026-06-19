-- Workshop2 size scales directory (CSV/Excel import → PG)
-- Apply: npm run db:apply:workshop2-migrations

CREATE TABLE IF NOT EXISTS workshop2_size_scales (
  scale_key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  rows JSONB NOT NULL DEFAULT '[]'::jsonb,
  audience TEXT,
  cat_l1 TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_size_scales_cat_l1
  ON workshop2_size_scales (cat_l1);

CREATE INDEX IF NOT EXISTS idx_workshop2_size_scales_audience
  ON workshop2_size_scales (audience);
