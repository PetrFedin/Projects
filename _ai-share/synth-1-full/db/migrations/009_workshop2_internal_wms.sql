-- Workshop2 internal WMS (in-platform balances, reserves, movements)
-- Apply: npm run db:apply:workshop2-migrations

CREATE TABLE IF NOT EXISTS workshop2_wms_items (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  label TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'ед.',
  material_ref TEXT,
  external_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (collection_id, sku)
);

CREATE INDEX IF NOT EXISTS idx_workshop2_wms_items_collection
  ON workshop2_wms_items (collection_id);

-- Legacy Wave Y used column "location" — rename for PG repository (location_code).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'workshop2_wms_balances'
      AND column_name = 'location'
  ) THEN
    ALTER TABLE workshop2_wms_balances RENAME COLUMN location TO location_code;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS workshop2_wms_balances (
  item_id TEXT NOT NULL REFERENCES workshop2_wms_items (id) ON DELETE CASCADE,
  location_code TEXT NOT NULL DEFAULT 'WORKSHOP2-WH',
  qty_on_hand NUMERIC NOT NULL DEFAULT 0,
  qty_reserved NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (item_id, location_code)
);

CREATE INDEX IF NOT EXISTS idx_workshop2_wms_balances_location
  ON workshop2_wms_balances (location_code);

CREATE TABLE IF NOT EXISTS workshop2_wms_movements (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('reserve', 'release', 'receipt', 'issue')),
  qty NUMERIC NOT NULL,
  bom_line_ref TEXT,
  supply_line_ref TEXT,
  item_id TEXT REFERENCES workshop2_wms_items (id) ON DELETE SET NULL,
  location_code TEXT NOT NULL DEFAULT 'WORKSHOP2-WH',
  actor TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_wms_movements_article
  ON workshop2_wms_movements (collection_id, article_id, created_at DESC);
