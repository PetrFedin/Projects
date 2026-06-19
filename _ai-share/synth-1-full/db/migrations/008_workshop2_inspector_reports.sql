-- Workshop2: persist mobile inspector checklist (PG primary, not localStorage-only)

CREATE TABLE IF NOT EXISTS workshop2_inspector_reports (
  sample_order_id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  checked_item_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_inspector_reports_room
  ON workshop2_inspector_reports (collection_id, article_id, updated_at DESC);
