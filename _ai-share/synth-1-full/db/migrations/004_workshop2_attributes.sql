-- Workshop2: переопределения каталога атрибутов (label, requiredForPhase1) поверх JSON-инстанса.
-- Apply: npm run db:apply:workshop2-migrations

CREATE TABLE IF NOT EXISTS workshop2_attribute_overrides (
  attribute_id TEXT PRIMARY KEY,
  label TEXT,
  required_for_phase1 BOOLEAN,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_attribute_overrides_updated
  ON workshop2_attribute_overrides (updated_at DESC);
