-- Workshop2 external integrations (PLM ACK, factory ERP, logistics, showroom)

ALTER TABLE workshop2_plm_outbox ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;
ALTER TABLE workshop2_plm_outbox ADD COLUMN IF NOT EXISTS acked_at TIMESTAMPTZ;
ALTER TABLE workshop2_plm_outbox ADD COLUMN IF NOT EXISTS delivery_id TEXT;

CREATE INDEX IF NOT EXISTS idx_workshop2_plm_outbox_delivery
  ON workshop2_plm_outbox (delivery_id)
  WHERE delivery_id IS NOT NULL;

-- Синхронизация read-only с ERP фабрики (статус на артикул)
CREATE TABLE IF NOT EXISTS workshop2_factory_erp_sync (
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  sync_status TEXT NOT NULL DEFAULT 'idle',
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  payload_preview JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection_id, article_id)
);

-- Отгрузка / трекинг (связь с заказом образца опциональна)
CREATE TABLE IF NOT EXISTS workshop2_logistics_shipments (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  sample_order_id TEXT,
  tracking_number TEXT,
  carrier TEXT,
  origin_label TEXT,
  destination_label TEXT,
  current_step TEXT NOT NULL DEFAULT 'factory',
  status TEXT NOT NULL DEFAULT 'in_transit',
  journal JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_logistics_room
  ON workshop2_logistics_shipments (collection_id, article_id, updated_at DESC);

-- Кампания цифрового шоурума / предзаказ B2B
CREATE TABLE IF NOT EXISTS workshop2_showroom_campaigns (
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  campaign_name TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  wholesale_price NUMERIC(12, 2),
  msrp NUMERIC(12, 2),
  moq INTEGER,
  window_start DATE,
  window_end DATE,
  last_sync_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection_id, article_id)
);
