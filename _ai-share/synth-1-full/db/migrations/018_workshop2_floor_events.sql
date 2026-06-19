-- Workshop2 M4: журнал событий пол ↔ sample order (floor bridge sync).
-- Apply: npm run db:apply:workshop2-migrations

CREATE TABLE IF NOT EXISTS workshop2_floor_events (
  id BIGSERIAL PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  order_id TEXT,
  floor_tab TEXT,
  order_status TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'floor_api',
  actor TEXT,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_workshop2_floor_events_room
  ON workshop2_floor_events (collection_id, article_id, synced_at DESC);

COMMENT ON TABLE workshop2_floor_events IS
  'Аудит синхронизации статуса образца с полом цеха (M4 Floor Bridge 2.0).';
