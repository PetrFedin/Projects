-- P3 · Brand supplier BOM lines (collection + article scope).

CREATE TABLE IF NOT EXISTS brand_supplier_bom_lines (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  line_index INTEGER NOT NULL DEFAULT 0,
  material_name TEXT NOT NULL,
  qty NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'm',
  source TEXT NOT NULL DEFAULT 'pg',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_supplier_bom_lines_scope
  ON brand_supplier_bom_lines (organization_id, collection_id, article_id, line_index);

CREATE INDEX IF NOT EXISTS idx_brand_supplier_bom_lines_article
  ON brand_supplier_bom_lines (organization_id, collection_id, article_id);
