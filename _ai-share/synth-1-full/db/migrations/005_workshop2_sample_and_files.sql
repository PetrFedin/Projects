-- Workshop2 Sprint 17: образцы, заявки на материалы, PLM outbox
-- Apply: npm run db:apply:workshop2-migrations

CREATE TABLE IF NOT EXISTS workshop2_sample_orders (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  status TEXT NOT NULL DEFAULT 'draft',
  contractor_id TEXT,
  due_date DATE,
  sizes JSONB NOT NULL DEFAULT '{}'::jsonb,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_workshop2_sample_orders_room
  ON workshop2_sample_orders (collection_id, article_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS workshop2_material_requisitions (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  bom_line_ref TEXT,
  material_label TEXT,
  quantity NUMERIC,
  unit TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_workshop2_material_req_room
  ON workshop2_material_requisitions (collection_id, article_id, created_at DESC);

CREATE TABLE IF NOT EXISTS workshop2_plm_outbox (
  id BIGSERIAL PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  last_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_workshop2_plm_outbox_status
  ON workshop2_plm_outbox (status, created_at ASC);
