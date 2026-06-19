/**
 * Demo contextual messages для /brand/messages (PG threads). Идемпотентно.
 * npm run db:seed:workshop2-contextual-demo
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

const seeds = [
  {
    id: 'cccc0001-0000-4000-8000-000000000001',
    contextType: 'workshop2_article',
    contextId: 'SS27:demo-ss27-01',
    sender: 'Технолог',
    message: 'ТЗ SS27-01: согласуйте POM груди до отправки образца на цех.',
    createdAt: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 'cccc0002-0000-4000-8000-000000000002',
    contextType: 'workshop2_article',
    contextId: 'SS27:demo-ss27-01',
    sender: 'Дизайнер',
    message: 'Подтверждаю визуал — можно запускать sample-order для fact-1.',
    createdAt: '2026-06-01T10:05:00.000Z',
  },
  {
    id: 'cccc0003-0000-4000-8000-000000000003',
    contextType: 'workshop2_article',
    contextId: 'SS27:demo-ss27-02',
    sender: 'Менеджер коллекции',
    message: 'demo-ss27-02: уточните ткань подкладки до публикации в showroom.',
    createdAt: '2026-06-01T11:00:00.000Z',
  },
  {
    id: 'cccc0004-0000-4000-8000-000000000004',
    contextType: 'b2b_order',
    contextId: 'B2B-DEMO-SHOP1-SS27',
    sender: 'Система',
    message: 'B2B заказ B2B-DEMO-SHOP1-SS27 от shop1 · 189 000 ₽ · статус submitted.',
    isSystem: true,
    createdAt: '2026-06-02T09:00:00.000Z',
  },
  {
    id: 'cccc0005-0000-4000-8000-000000000005',
    contextType: 'b2b_order',
    contextId: 'B2B-DEMO-SHOP1-SS27',
    sender: 'shop1',
    message: 'Подтверждаем матрицу SS27 — прошу зафиксировать окно отгрузки Drop 1.',
    createdAt: '2026-06-02T09:30:00.000Z',
  },
  {
    id: 'cccc0006-0000-4000-8000-000000000006',
    contextType: 'b2b_order',
    contextId: 'B2B-DEMO-SHOP2-SS27',
    sender: 'Система',
    message: 'B2B заказ B2B-DEMO-SHOP2-SS27 от shop2 · 113 600 ₽ · статус confirmed.',
    isSystem: true,
    createdAt: '2026-06-03T10:00:00.000Z',
  },
] as const;

async function main() {
  const pool = new pg.Pool({ connectionString: url });
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM workshop2_contextual_messages
       WHERE organization_id = $1
         AND (
           (context_type = 'workshop2_article' AND context_id LIKE 'SS27:demo-ss27-%')
           OR context_id IN ('B2B-DEMO-SHOP1-SS27', 'B2B-DEMO-SHOP2-SS27')
         )`,
      [org]
    );
    if (rowCount && rowCount > 0) {
      console.log(`cleared: ${rowCount} old demo message(s)`);
    }
    for (const row of seeds) {
      await pool.query(
        `INSERT INTO workshop2_contextual_messages
           (id, organization_id, context_type, context_id, message, sender, is_system, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8::timestamptz)
         ON CONFLICT (id) DO UPDATE SET
           message = EXCLUDED.message,
           sender = EXCLUDED.sender,
           is_system = EXCLUDED.is_system,
           created_at = EXCLUDED.created_at`,
        [
          row.id,
          org,
          row.contextType,
          row.contextId,
          row.message,
          row.sender,
          row.isSystem ?? false,
          row.createdAt,
        ]
      );
      console.log(`ok: ${row.contextType} · ${row.contextId} · ${row.sender}`);
    }
  } finally {
    await pool.end();
  }
}

void main();
