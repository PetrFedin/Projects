-- Brand Kanban tasks (PG SoT; replaces localStorage brand_tasks_kanban_v1 in core mode).
CREATE TABLE IF NOT EXISTS brand_tasks_kanban (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')),
  assignee TEXT NOT NULL DEFAULT '—',
  due TEXT NOT NULL DEFAULT '—',
  project TEXT NOT NULL DEFAULT 'Production',
  collection_id TEXT,
  article_sku TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brand_tasks_kanban_org_updated
  ON brand_tasks_kanban (organization_id, updated_at DESC);
