-- Workshop2: логистика образца (movement_status + журнал)

ALTER TABLE workshop2_sample_orders
  ADD COLUMN IF NOT EXISTS movement_status TEXT NOT NULL DEFAULT 'created';

ALTER TABLE workshop2_sample_orders
  ADD COLUMN IF NOT EXISTS movement_log JSONB NOT NULL DEFAULT '[]'::jsonb;
