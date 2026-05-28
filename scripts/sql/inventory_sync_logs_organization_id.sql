-- Scope inventory sync logs to organization (same id as brand dashboard path param).
-- PostgreSQL 11+ (IF NOT EXISTS). Adjust dialect if needed.

ALTER TABLE inventory_sync_logs
  ADD COLUMN IF NOT EXISTS organization_id VARCHAR NULL;

CREATE INDEX IF NOT EXISTS ix_inventory_sync_logs_organization_id
  ON inventory_sync_logs (organization_id);
