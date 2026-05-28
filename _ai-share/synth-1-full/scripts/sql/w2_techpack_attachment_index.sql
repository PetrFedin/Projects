-- Индекс вложений Workshop2 tech pack (пилот с фабрикой).
-- Подключается вручную при DATABASE_URL; приложение при старте upsert-запросов тоже вызывает CREATE IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS w2_techpack_attachment_index (
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  attachment_id TEXT NOT NULL,
  object_key TEXT NOT NULL,
  content_sha256_hex TEXT NOT NULL,
  etag TEXT,
  content_type TEXT,
  size_bytes BIGINT,
  uploaded_by TEXT,
  handoff_status TEXT NOT NULL DEFAULT 'none',
  package_revision TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection_id, article_id, attachment_id)
);
CREATE INDEX IF NOT EXISTS w2_techpack_index_article
  ON w2_techpack_attachment_index (collection_id, article_id);
