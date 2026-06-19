-- Wave 1: cross-module domain events, contextual chat, brand calendar sync
-- Apply: npm run db:apply:workshop2-migrations

CREATE TABLE IF NOT EXISTS workshop2_domain_event_outbox (
  id BIGSERIAL PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  event_type TEXT NOT NULL,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dispatched_at TIMESTAMPTZ,
  last_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_workshop2_domain_event_outbox_status
  ON workshop2_domain_event_outbox (status, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_workshop2_domain_event_outbox_article
  ON workshop2_domain_event_outbox (collection_id, article_id, created_at DESC);

CREATE TABLE IF NOT EXISTS workshop2_contextual_messages (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  context_type TEXT NOT NULL,
  context_id TEXT NOT NULL,
  message TEXT NOT NULL,
  sender TEXT NOT NULL DEFAULT 'system',
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_contextual_messages_context
  ON workshop2_contextual_messages (context_type, context_id, created_at ASC);

CREATE TABLE IF NOT EXISTS workshop2_brand_calendar_events (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL DEFAULT 'org-brand-001',
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  source_kind TEXT NOT NULL DEFAULT 'ta_milestone',
  title TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  is_blocker BOOLEAN NOT NULL DEFAULT false,
  blocker_kind TEXT,
  linked_milestone_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop2_brand_calendar_article
  ON workshop2_brand_calendar_events (collection_id, article_id, start_at ASC);
