/**
 * Публикация SS27 demo артикулов в showroom (B2B matrix / linesheet).
 * npm run db:seed:workshop2-ss27-showroom
 */
import pg from 'pg';

const url =
  process.env.WORKSHOP2_DATABASE_URL?.trim() ||
  process.env.WORKSHOP2_DOSSIER_DATABASE_URL?.trim() ||
  process.env.DATABASE_URL?.trim();

if (!url) {
  console.error('ERROR: WORKSHOP2_DATABASE_URL is required');
  process.exit(1);
}

const collectionId = 'SS27';
const now = new Date().toISOString();

const articles = [
  { articleId: 'demo-ss27-01', wholesale: 15_750, msrp: 28_900, moq: 6 },
  { articleId: 'demo-ss27-02', wholesale: 14_200, msrp: 26_500, moq: 6 },
  { articleId: 'demo-ss27-03', wholesale: 12_800, msrp: 23_900, moq: 8 },
] as const;

async function main() {
  const pool = new pg.Pool({ connectionString: url });
  try {
    for (const row of articles) {
      await pool.query(
        `INSERT INTO workshop2_showroom_campaigns
           (collection_id, article_id, campaign_name, published, wholesale_price, msrp, moq,
            window_start, window_end, visibility_tier, article_ids, last_sync_at, updated_at)
         VALUES ($1,$2,$3,true,$4,$5,$6,$7::date,$8::date,$9,$10::jsonb,$11::timestamptz,$11::timestamptz)
         ON CONFLICT (collection_id, article_id) DO UPDATE SET
           campaign_name = EXCLUDED.campaign_name,
           published = true,
           wholesale_price = EXCLUDED.wholesale_price,
           msrp = EXCLUDED.msrp,
           moq = EXCLUDED.moq,
           window_start = EXCLUDED.window_start,
           window_end = EXCLUDED.window_end,
           visibility_tier = EXCLUDED.visibility_tier,
           article_ids = EXCLUDED.article_ids,
           last_sync_at = EXCLUDED.last_sync_at,
           updated_at = EXCLUDED.updated_at`,
        [
          collectionId,
          row.articleId,
          `SS27 Showroom · ${row.articleId}`,
          row.wholesale,
          row.msrp,
          row.moq,
          '2026-06-01',
          '2026-12-31',
          'standard',
          JSON.stringify([row.articleId]),
          now,
        ]
      );
      console.log(`ok: published ${collectionId}/${row.articleId} · ${row.wholesale} ₽`);
    }
  } finally {
    await pool.end();
  }
}

void main();
