/**
 * Демо: бренд подтверждает B2B-DEMO и передаёт на fact-1 (идемпотентно, PG).
 * npm run db:seed:workshop2-b2b-production-handoff
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

const org = 'org-brand-001';
const orderId = process.env.WORKSHOP2_B2B_DEMO_ORDER_ID?.trim() || 'B2B-DEMO-SHOP1-SS27';
const factoryId = 'fact-1';
const productionOrderId = `PO-B2B-${orderId}`;
const collectionId = 'SS27';
const articleId = 'demo-ss27-01';
const now = new Date().toISOString();

async function main() {
  const skip = ['1', 'true', 'yes', 'on'].includes(
    String(process.env.CORE_BOOTSTRAP_SKIP_HANDOFF ?? '').trim().toLowerCase()
  );
  if (skip) {
    console.log('skip: CORE_BOOTSTRAP_SKIP_HANDOFF — handoff seed не выполняется (интерактивное демо)');
    return;
  }

  const pool = new pg.Pool({ connectionString: url });
  try {
    const orderRes = await pool.query(
      `SELECT status, buyer_id, total_rub, lines, collection_id, article_id
       FROM workshop2_b2b_orders WHERE id = $1 AND organization_id = $2`,
      [orderId, org]
    );
    const row = orderRes.rows[0];
    if (!row) {
      console.error(`FAIL: order ${orderId} not found — run db:seed:workshop2-b2b-demo-order first`);
      process.exit(1);
    }

    if (row.status === 'submitted') {
      await pool.query(
        `UPDATE workshop2_b2b_orders SET status = 'confirmed', updated_at = $3::timestamptz
         WHERE id = $1 AND organization_id = $2`,
        [orderId, org, now]
      );
    }

    const lines = Array.isArray(row.lines) ? row.lines : [];
    const primary = (lines[0] ?? {}) as { qty?: number; articleId?: string };
    const qty = Number(primary.qty ?? 12);
    const resolvedArticleId = primary.articleId ?? articleId;
    const dossierRes = await pool.query<{ version: number }>(
      `SELECT version FROM workshop2_dossiers
       WHERE collection_id = $1 AND article_id = $2
       LIMIT 1`,
      [collectionId, resolvedArticleId]
    );
    const dossierVersionAtHandoff = dossierRes.rows[0]?.version ?? 1;
    const payload = {
      source: 'b2b_production_handoff',
      b2bOrderId: orderId,
      buyerId: row.buyer_id,
      factoryId,
      totalRub: Number(row.total_rub ?? 0),
      lines,
      dossierRefs: [{ collectionId, articleId: resolvedArticleId }],
      handoffAt: now,
      dossierVersionAtHandoff,
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
        primary.articleId ?? articleId,
        org,
        `b2b:${orderId}`,
        factoryId,
        qty,
        'pending_erp',
        JSON.stringify(payload),
      ]
    );

    const messages = [
      {
        id: 'cccchandoff-demo-b2b-01',
        contextType: 'b2b_order',
        contextId: orderId,
        message: `Бренд подтвердил заказ · передан на производство ${factoryId} · ${productionOrderId} · ${qty} шт. · досье: ${articleId}.`,
      },
      {
        id: 'cccchandoff-demo-b2b-02',
        contextType: 'workshop2_article',
        contextId: `${collectionId}:${articleId}`,
        message: `Серия по B2B ${orderId} запущена на ${factoryId} (${productionOrderId}) с контекстом ТЗ ${articleId}.`,
      },
    ];

    for (const m of messages) {
      await pool.query(
        `INSERT INTO workshop2_contextual_messages
           (id, organization_id, context_type, context_id, message, sender, is_system, created_at)
         VALUES ($1,$2,$3,$4,$5,'Система',true,$6::timestamptz)
         ON CONFLICT (id) DO UPDATE SET message = EXCLUDED.message, created_at = EXCLUDED.created_at`,
        [m.id, org, m.contextType, m.contextId, m.message, now]
      );
    }

    console.log(`ok: ${orderId} · confirmed · ${productionOrderId} · ${factoryId}`);

    /** Wave 31/101: inventoryReserve в PO.payload для chain-status e2e (без server-only в tsx). */
    const wmsEnabled = ['1', 'true', 'yes', 'on'].includes(
      String(process.env.WORKSHOP2_INTERNAL_WMS ?? '').trim().toLowerCase()
    );
    const inventoryReserve = wmsEnabled
      ? { reserved: true, reservedQty: qty, reason: 'seed_bootstrap' }
      : { reserved: false, reason: 'internal_wms_disabled' as const };
    await pool.query(
      `UPDATE workshop2_purchase_orders
       SET payload = COALESCE(payload, '{}'::jsonb) || $3::jsonb,
           status = CASE WHEN $4::boolean THEN 'allocated' ELSE status END,
           updated_at = NOW()
       WHERE id = $1 AND organization_id = $2`,
      [
        productionOrderId,
        org,
        JSON.stringify({ inventoryReserve, dossierVersionAtHandoff }),
        inventoryReserve.reserved,
      ]
    );
    if (inventoryReserve.reserved) {
      await pool.query(
        `UPDATE workshop2_b2b_orders SET status = 'allocated', updated_at = $3::timestamptz
         WHERE id = $1 AND organization_id = $2 AND status = 'confirmed'`,
        [orderId, org, now]
      );
    }
    console.log(
      `wms: reserved=${inventoryReserve.reserved} qty=${inventoryReserve.reservedQty ?? '—'} reason=${inventoryReserve.reason ?? '—'}`
    );
  } finally {
    await pool.end();
  }
}

void main();
