-- M10 / 4.5: daily production metrics rollup (article-scoped aggregates)

CREATE TABLE IF NOT EXISTS workshop2_production_metrics_daily (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  metric_date DATE NOT NULL,
  sample_lead_time_days NUMERIC,
  rework_rate NUMERIC,
  defect_count INTEGER NOT NULL DEFAULT 0,
  operations_progress_pct INTEGER NOT NULL DEFAULT 0,
  routing_variance_pct NUMERIC,
  economics_variance_pct NUMERIC,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_workshop2_prod_metrics_daily_room_date
  ON workshop2_production_metrics_daily (collection_id, article_id, metric_date);

CREATE INDEX IF NOT EXISTS idx_workshop2_prod_metrics_daily_collection
  ON workshop2_production_metrics_daily (collection_id, metric_date DESC);
