-- P1 agent rep: one commission row per B2B order (upsert on submit)

CREATE UNIQUE INDEX IF NOT EXISTS idx_workshop2_b2b_commissions_org_order
  ON workshop2_b2b_commissions (organization_id, order_id);
