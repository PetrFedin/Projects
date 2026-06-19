-- ADR-002 · sync jobs registry + external entity refs (PG mirror for file stores).

CREATE TABLE IF NOT EXISTS spine_integration_sync_jobs (
  job_id TEXT PRIMARY KEY,
  job_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spine_integration_sync_jobs_created
  ON spine_integration_sync_jobs (created_at DESC);

CREATE TABLE IF NOT EXISTS spine_integration_external_refs (
  ref_key TEXT PRIMARY KEY,
  ref_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spine_integration_external_refs_entity
  ON spine_integration_external_refs ((ref_json->>'synthaEntityType'), (ref_json->>'synthaEntityId'));
