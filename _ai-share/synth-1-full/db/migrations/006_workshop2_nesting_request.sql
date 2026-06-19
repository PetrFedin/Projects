-- Workshop2: заявка на раскладку (nesting) привязана к заказу образца
ALTER TABLE workshop2_sample_orders
  ADD COLUMN IF NOT EXISTS nesting_request JSONB NOT NULL DEFAULT '{}'::jsonb;
