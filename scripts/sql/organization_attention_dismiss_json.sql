-- Server-side dismiss ids for «Требует внимания» (organization hub), cross-device sync.
-- PostgreSQL / SQLite-friendly JSON column.

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS attention_dismiss_json JSON NULL;
