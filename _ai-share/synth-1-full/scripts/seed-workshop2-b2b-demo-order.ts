/**
 * Демо B2B заказы для CRM (shop1 + shop2) — npm run db:seed:workshop2-b2b-demo-order
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

const now = new Date().toISOString();

const DEMO_ORDERS = [
  {
    orderId: 'B2B-DEMO-SHOP1-SS27',
    buyerId: 'shop1',
    collectionId: 'SS27',
    articleId: 'demo-ss27-01',
    status: 'submitted',
    tier: 'standard',
    totalRub: 189_000,
    lines: [
      {
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        colorCode: 'default',
        size: 'M',
        qty: 12,
        wholesalePriceRub: 15_750,
        moq: 6,
      },
    ],
    metadata: { requestedDeliveryDate: '2026-09-01', paymentTermsRu: 'defer_30' },
  },
  {
    orderId: 'B2B-DEMO-SHOP2-SS27',
    buyerId: 'shop2',
    collectionId: 'SS27',
    articleId: 'demo-ss27-02',
    status: 'confirmed',
    tier: 'standard',
    totalRub: 113_600,
    lines: [
      {
        collectionId: 'SS27',
        articleId: 'demo-ss27-02',
        colorCode: 'default',
        size: 'M',
        qty: 8,
        wholesalePriceRub: 14_200,
        moq: 6,
      },
    ],
    metadata: { requestedDeliveryDate: '2026-09-15', paymentTermsRu: 'prepay_50' },
  },
  {
    orderId: 'B2B-DEMO-SHOP1-PREBOOK-SS27',
    buyerId: 'shop1',
    collectionId: 'SS27',
    articleId: 'demo-ss27-01',
    status: 'submitted',
    tier: 'prebook',
    totalRub: 94_500,
    lines: [
      {
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        colorCode: 'default',
        size: 'S',
        qty: 6,
        wholesalePriceRub: 15_750,
        moq: 6,
      },
    ],
    metadata: { requestedDeliveryDate: '2026-10-01', paymentTermsRu: 'prepay_50' },
  },
] as const;

async function main() {
  const pool = new pg.Pool({ connectionString: url });
  try {
    for (const demo of DEMO_ORDERS) {
      await pool.query(
        `INSERT INTO workshop2_b2b_orders
           (id, organization_id, collection_id, article_id, buyer_id, rep_id, status, tier,
            total_rub, lines, commission_preview, metadata, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12::jsonb,$13::timestamptz,$14::timestamptz)
         ON CONFLICT (id) DO UPDATE SET
           buyer_id = EXCLUDED.buyer_id,
           status = EXCLUDED.status,
           tier = EXCLUDED.tier,
           total_rub = EXCLUDED.total_rub,
           lines = EXCLUDED.lines,
           metadata = EXCLUDED.metadata,
           updated_at = EXCLUDED.updated_at`,
        [
          demo.orderId,
          'org-brand-001',
          demo.collectionId,
          demo.articleId,
          demo.buyerId,
          null,
          demo.status,
          demo.tier,
          demo.totalRub,
          JSON.stringify(demo.lines),
          null,
          JSON.stringify(demo.metadata),
          now,
          now,
        ]
      );
      console.log(`ok: ${demo.orderId} · buyer=${demo.buyerId} · ${demo.totalRub} ₽ · ${demo.status}`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
