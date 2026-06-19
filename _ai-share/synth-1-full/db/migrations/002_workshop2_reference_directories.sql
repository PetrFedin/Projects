-- Workshop2 справочники (цвета, ТН ВЭД, материалы, шаблоны POM)
-- Apply: npm run db:apply:workshop2-migrations

CREATE TABLE IF NOT EXISTS workshop2_ref_colors (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hex TEXT NOT NULL,
  pantone TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS workshop2_ref_tnved (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  leaf_id TEXT,
  chapter_hint TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_workshop2_ref_tnved_leaf
  ON workshop2_ref_tnved (leaf_id);

CREATE TABLE IF NOT EXISTS workshop2_ref_materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  supplier TEXT,
  composition TEXT,
  gsm INTEGER
);

CREATE TABLE IF NOT EXISTS workshop2_ref_pom_templates (
  id TEXT PRIMARY KEY,
  leaf_id TEXT NOT NULL,
  label TEXT NOT NULL,
  dimension_labels JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_workshop2_ref_pom_leaf
  ON workshop2_ref_pom_templates (leaf_id);
