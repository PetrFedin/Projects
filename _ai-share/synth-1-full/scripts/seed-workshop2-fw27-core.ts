/**
 * Golden path FW27 для Platform Core — 3 SKU (клоны SS27 demo-ss27-01..03).
 * npm run db:seed:workshop2-fw27-core
 * Требует: db:seed:workshop2-ss27-dossiers (источник досье).
 */
import pg from 'pg';
import { WORKSHOP2_FW27_RANGE_PLANNER_METADATA } from '@/lib/production/workshop2-core-collection-range-planner-metadata';

const url =
  process.env.WORKSHOP2_DATABASE_URL?.trim() ||
  process.env.WORKSHOP2_DOSSIER_DATABASE_URL?.trim() ||
  process.env.DATABASE_URL?.trim();

if (!url) {
  console.error('ERROR: WORKSHOP2_DATABASE_URL is required');
  process.exit(1);
}

const org = 'org-brand-001';
const collectionId = 'FW27';
const sourceCollectionId = 'SS27';
const orderId = 'B2B-DEMO-SHOP1-FW27';
const productionOrderId = `PO-B2B-${orderId}`;
const factoryId = 'fact-1';
const now = new Date().toISOString();
const dueSoon = new Date();
dueSoon.setDate(dueSoon.getDate() + 21);
const dueDate = dueSoon.toISOString().slice(0, 10);

const ARTICLE_SEEDS = [
  {
    id: 'demo-fw27-01',
    sourceId: 'demo-ss27-01',
    wholesale: 16_200,
    msrp: 29_500,
    moq: 4,
    orderQty: 8,
    sampleId: 'SAMPLE-DEMO-FW27-01',
  },
  {
    id: 'demo-fw27-02',
    sourceId: 'demo-ss27-02',
    wholesale: 14_800,
    msrp: 27_200,
    moq: 4,
    orderQty: 6,
    sampleId: 'SAMPLE-DEMO-FW27-02',
  },
  {
    id: 'demo-fw27-03',
    sourceId: 'demo-ss27-03',
    wholesale: 13_400,
    msrp: 24_900,
    moq: 6,
    orderQty: 10,
    sampleId: 'SAMPLE-DEMO-FW27-03',
  },
] as const;

const primaryArticleId = ARTICLE_SEEDS[0].id;

/** Tier-метки Range Planner для FW27 (categoryLeafId в досье). */
const FW27_TIER_CATEGORY_LEAF: Record<string, string> = {
  'demo-fw27-01': 'catalog-apparel-g0-l0',
  'demo-fw27-02': 'catalog-apparel-g1-l0',
  'demo-fw27-03': 'catalog-apparel-g2-l0',
};

function patchFw27DossierTierHints(articleId: string, dossierJson: unknown): unknown {
  const leaf = FW27_TIER_CATEGORY_LEAF[articleId];
  if (!leaf || !dossierJson || typeof dossierJson !== 'object') return dossierJson;
  const d = { ...(dossierJson as Record<string, unknown>) };
  const mirror = { ...((d.articleFormMirror as Record<string, unknown>) ?? {}) };
  mirror.categoryLeafId = leaf;
  d.articleFormMirror = mirror;
  return d;
}

const lines = ARTICLE_SEEDS.map((row) => ({
  collectionId,
  articleId: row.id,
  colorCode: 'default',
  size: 'M',
  qty: row.orderQty,
  wholesalePriceRub: row.wholesale,
  moq: row.moq,
}));

const totalRub = lines.reduce((sum, line) => sum + line.qty * line.wholesalePriceRub, 0);
const totalQty = lines.reduce((sum, line) => sum + line.qty, 0);
const allArticleIds = ARTICLE_SEEDS.map((row) => row.id);

async function main() {
  const pool = new pg.Pool({ connectionString: url });
  try {
    await pool.query(
      `INSERT INTO workshop2_collections (id, organization_id, display_name, metadata)
       VALUES ($1, $2, $3, $4::jsonb)
       ON CONFLICT (id) DO UPDATE SET
         display_name = EXCLUDED.display_name,
         metadata = EXCLUDED.metadata`,
      [collectionId, org, 'FW27 · осень–зима 2027', JSON.stringify(WORKSHOP2_FW27_RANGE_PLANNER_METADATA)]
    );

    for (const row of ARTICLE_SEEDS) {
      const src = await pool.query(
        `SELECT dossier_json FROM workshop2_dossiers
         WHERE collection_id = $1 AND article_id = $2 AND organization_id = $3`,
        [sourceCollectionId, row.sourceId, org]
      );
      if (!src.rows[0]?.dossier_json) {
        console.error(
          `FAIL: source dossier ${sourceCollectionId}/${row.sourceId} not found — run db:seed:workshop2-ss27-dossiers first`
        );
        process.exit(1);
      }

      await pool.query(
        `INSERT INTO workshop2_articles (id, collection_id, organization_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (collection_id, id) DO NOTHING`,
        [row.id, collectionId, org]
      );

      await pool.query(
        `INSERT INTO workshop2_dossiers (collection_id, article_id, organization_id, version, updated_at, updated_by, dossier_json)
         VALUES ($1, $2, $3, 1, NOW(), 'seed-fw27-clone', $4::jsonb)
         ON CONFLICT (collection_id, article_id) DO UPDATE SET
           dossier_json = EXCLUDED.dossier_json,
           version = workshop2_dossiers.version + 1,
           updated_at = NOW(),
           updated_by = EXCLUDED.updated_by`,
        [
          collectionId,
          row.id,
          org,
          JSON.stringify(patchFw27DossierTierHints(row.id, src.rows[0].dossier_json)),
        ]
      );
      console.log(`ok: dossier ${collectionId}/${row.id} (clone ${row.sourceId})`);

      await pool.query(
        `INSERT INTO workshop2_sample_orders
           (id, collection_id, article_id, organization_id, status, movement_status,
            movement_log, status_history, contractor_id, due_date, sizes, quantity, notes,
            created_by, nesting_request, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9,$10::date,$11::jsonb,$12,$13,$14,$15::jsonb,$16::timestamptz,$16::timestamptz)
         ON CONFLICT (id) DO UPDATE SET
           status = EXCLUDED.status,
           movement_status = EXCLUDED.movement_status,
           contractor_id = EXCLUDED.contractor_id,
           updated_at = EXCLUDED.updated_at`,
        [
          row.sampleId,
          collectionId,
          row.id,
          org,
          'sent',
          'in_transit',
          JSON.stringify([]),
          JSON.stringify([]),
          factoryId,
          dueDate,
          JSON.stringify({ M: 1, L: 1 }),
          2,
          `Core demo FW27 · ${row.id} → fact-1`,
          'core-demo-seed',
          JSON.stringify({}),
          now,
        ]
      );
      console.log(`ok: ${row.sampleId} · ${row.id}`);

      await pool.query(
        `INSERT INTO workshop2_showroom_campaigns
           (collection_id, article_id, campaign_name, published, wholesale_price, msrp, moq,
            window_start, window_end, visibility_tier, article_ids, last_sync_at, updated_at)
         VALUES ($1,$2,$3,true,$4,$5,$6,$7::date,$8::date,$9,$10::jsonb,$11::timestamptz,$11::timestamptz)
         ON CONFLICT (collection_id, article_id) DO UPDATE SET
           published = true,
           wholesale_price = EXCLUDED.wholesale_price,
           msrp = EXCLUDED.msrp,
           moq = EXCLUDED.moq,
           article_ids = EXCLUDED.article_ids,
           updated_at = EXCLUDED.updated_at`,
        [
          collectionId,
          row.id,
          `FW27 Showroom · ${row.id}`,
          row.wholesale,
          row.msrp,
          row.moq,
          '2026-09-01',
          '2027-03-31',
          'standard',
          JSON.stringify(allArticleIds),
          now,
        ]
      );
      console.log(`ok: showroom ${collectionId}/${row.id}`);
    }

    await pool.query(
      `INSERT INTO workshop2_b2b_orders
         (id, organization_id, collection_id, article_id, buyer_id, rep_id, status, tier,
          total_rub, lines, commission_preview, metadata, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12::jsonb,$13::timestamptz,$14::timestamptz)
       ON CONFLICT (id) DO UPDATE SET
         collection_id = EXCLUDED.collection_id,
         status = EXCLUDED.status,
         total_rub = EXCLUDED.total_rub,
         lines = EXCLUDED.lines,
         updated_at = EXCLUDED.updated_at`,
      [
        orderId,
        org,
        collectionId,
        primaryArticleId,
        'shop1',
        null,
        'confirmed',
        'standard',
        totalRub,
        JSON.stringify(lines),
        null,
        JSON.stringify({
          requestedDeliveryDate: '2027-01-15',
          paymentTermsRu: 'defer_30',
          skuCount: ARTICLE_SEEDS.length,
        }),
        now,
        now,
      ]
    );
    console.log(`ok: ${orderId} · buyer=shop1 · ${totalRub} ₽ · ${ARTICLE_SEEDS.length} SKU`);

    const payload = {
      source: 'b2b_production_handoff',
      b2bOrderId: orderId,
      buyerId: 'shop1',
      factoryId,
      totalRub,
      lines,
      dossierRefs: ARTICLE_SEEDS.map((row) => ({ collectionId, articleId: row.id })),
      handoffAt: now,
    };

    await pool.query(
      `INSERT INTO workshop2_purchase_orders
         (id, collection_id, article_id, organization_id, line_ref, supplier_id, qty, status, payload)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb)
       ON CONFLICT (id) DO UPDATE SET
         qty = EXCLUDED.qty,
         status = EXCLUDED.status,
         payload = EXCLUDED.payload,
         updated_at = NOW()`,
      [
        productionOrderId,
        collectionId,
        primaryArticleId,
        org,
        `b2b:${orderId}`,
        factoryId,
        totalQty,
        'pending_erp',
        JSON.stringify(payload),
      ]
    );
    console.log(`ok: ${productionOrderId} · handoff · ${totalQty} ед.`);

    await pool.query(
      `INSERT INTO workshop2_contextual_messages
         (id, organization_id, context_type, context_id, message, sender, is_system, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::timestamptz)
       ON CONFLICT (id) DO UPDATE SET message = EXCLUDED.message`,
      [
        'ccccfw27-0001-4000-8000-000000000001',
        org,
        'b2b_order',
        orderId,
        `B2B заказ ${orderId} от shop1 · FW27 · ${ARTICLE_SEEDS.length} SKU · ${totalRub.toLocaleString('ru-RU')} ₽ · confirmed.`,
        'Система',
        true,
        now,
      ]
    );
    console.log(`ok: contextual message · ${orderId}`);
  } finally {
    await pool.end();
  }
}

void main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
