-- Runway analytics events (Postgres)
-- Apply before RUNWAY_ANALYTICS_STORE=postgres in production.

CREATE TABLE IF NOT EXISTS runway_analytics_events (
  event_key TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  timestamp_ms BIGINT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS runway_analytics_events_ts_idx
  ON runway_analytics_events (timestamp_ms DESC);
