-- M6/M7: QC defects persisted (raw SQL, complements dossier mirrors)

CREATE TABLE IF NOT EXISTS workshop2_qc_defects (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  sample_order_id TEXT,
  defect_code TEXT NOT NULL,
  defect_label TEXT,
  severity TEXT NOT NULL DEFAULT 'minor',
  qty_affected INTEGER,
  source TEXT NOT NULL DEFAULT 'mes',
  mes_event_id TEXT,
  pin_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_qc_defects_room
  ON workshop2_qc_defects (collection_id, article_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_workshop2_qc_defects_order
  ON workshop2_qc_defects (sample_order_id)
  WHERE sample_order_id IS NOT NULL;
