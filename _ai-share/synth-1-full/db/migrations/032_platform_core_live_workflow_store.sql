-- Platform Core · LIVE workflow `/api/processes/*` (definitions + runtime snapshots).
-- Mirrors `.data/workflow-store.json` as a single JSONB row for multi-instance parity.

CREATE TABLE IF NOT EXISTS platform_core_live_workflow_store (
  store_id TEXT PRIMARY KEY DEFAULT 'default',
  store_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
