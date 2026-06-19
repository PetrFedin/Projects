-- Wave 23: PG-primary store for platform-core user calendar tasks (comms pillar).
CREATE TABLE IF NOT EXISTS platform_core_user_calendar_tasks (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  owner_role TEXT NOT NULL DEFAULT 'brand',
  title TEXT NOT NULL,
  description TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  order_id TEXT,
  article_id TEXT,
  event_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_core_user_calendar_tasks_collection
  ON platform_core_user_calendar_tasks (collection_id, start_at DESC);

CREATE INDEX IF NOT EXISTS idx_platform_core_user_calendar_tasks_order
  ON platform_core_user_calendar_tasks (order_id)
  WHERE order_id IS NOT NULL;
