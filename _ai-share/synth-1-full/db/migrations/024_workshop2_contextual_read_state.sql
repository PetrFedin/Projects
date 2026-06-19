-- Wave 33: server read receipts for PG contextual threads (per actor + org).
CREATE TABLE IF NOT EXISTS workshop2_contextual_read_state (
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  actor_id TEXT NOT NULL,
  context_type TEXT NOT NULL,
  context_id TEXT NOT NULL,
  last_seen_message_count INT NOT NULL DEFAULT 0,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (organization_id, actor_id, context_type, context_id)
);

CREATE INDEX IF NOT EXISTS idx_workshop2_contextual_read_state_actor
  ON workshop2_contextual_read_state (organization_id, actor_id, last_read_at DESC);
