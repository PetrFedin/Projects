-- Wave 22: B2B wishlist + rep share journal + order metadata usage.

CREATE TABLE IF NOT EXISTS workshop2_b2b_wishlist (
  buyer_id TEXT NOT NULL,
  campaign_id TEXT NOT NULL,
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (buyer_id, campaign_id)
);

CREATE TABLE IF NOT EXISTS workshop2_b2b_rep_share_journal (
  token TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  rep_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workshop2_b2b_rep_share_campaign
  ON workshop2_b2b_rep_share_journal (campaign_id, rep_id);
