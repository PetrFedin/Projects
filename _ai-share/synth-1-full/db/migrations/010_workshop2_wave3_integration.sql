-- Workshop2 Wave 3: cut tickets, EDO signoff audit, color master extensions

CREATE TABLE IF NOT EXISTS workshop2_cut_tickets (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  ticket_no TEXT NOT NULL,
  fabric_roll_ref TEXT,
  qty INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_cut_tickets_article
  ON workshop2_cut_tickets (collection_id, article_id, created_at DESC);

CREATE TABLE IF NOT EXISTS workshop2_edo_signoff_requests (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  provider TEXT NOT NULL,
  edo_status TEXT NOT NULL DEFAULT 'pending',
  external_request_id TEXT,
  signed_at TIMESTAMPTZ,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_edo_signoff_article
  ON workshop2_edo_signoff_requests (collection_id, article_id, updated_at DESC);

-- Runtime color master (код использует workshop2_colors; 002 создаёт workshop2_ref_colors)
CREATE TABLE IF NOT EXISTS workshop2_colors (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hex TEXT NOT NULL,
  pantone TEXT,
  season_id TEXT NOT NULL DEFAULT 'SS27',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO workshop2_colors (code, name, hex, pantone, season_id, updated_at)
SELECT code, name, hex, pantone, 'SS27', NOW()
FROM workshop2_ref_colors
ON CONFLICT (code) DO NOTHING;

ALTER TABLE workshop2_colors
  ADD COLUMN IF NOT EXISTS lab_dip_linked BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_workshop2_colors_lab_dip
  ON workshop2_colors (season_id, lab_dip_linked);
