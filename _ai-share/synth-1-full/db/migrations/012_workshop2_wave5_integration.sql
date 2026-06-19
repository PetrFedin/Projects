-- Wave 5: дополнительные индексы EDI / commission journal

CREATE INDEX IF NOT EXISTS idx_workshop2_edi_inbound_journal_org_received
  ON workshop2_edi_inbound_journal (organization_id, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_workshop2_b2b_commissions_order
  ON workshop2_b2b_commissions (organization_id, order_id);
