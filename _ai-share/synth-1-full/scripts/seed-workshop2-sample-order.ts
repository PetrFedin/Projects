/**
 * Demo sample orders для factory portal (contractor fact-1).
 * npm run db:seed:workshop2-sample-order
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
const dueSoon = new Date();
dueSoon.setDate(dueSoon.getDate() + 14);
const dueDate = dueSoon.toISOString().slice(0, 10);

const orders = [
  {
    id: 'SAMPLE-DEMO-SS27-01',
    collectionId: 'SS27',
    articleId: 'demo-ss27-01',
    status: 'sent',
    movementStatus: 'in_transit',
    contractorId: 'fact-1',
    quantity: 2,
    sizes: { M: 1, L: 1 },
    notes: 'Core demo: пальто SS27 → цех fact-1',
  },
  {
    id: 'SAMPLE-DEMO-SS27-02',
    collectionId: 'SS27',
    articleId: 'demo-ss27-02',
    status: 'in_progress',
    movementStatus: 'in_production',
    contractorId: 'fact-1',
    quantity: 1,
    sizes: { S: 1 },
    notes: 'Core demo: платье SS27',
  },
] as const;

async function main() {
  const pool = new pg.Pool({ connectionString: url });
  try {
    for (const o of orders) {
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
           due_date = EXCLUDED.due_date,
           sizes = EXCLUDED.sizes,
           quantity = EXCLUDED.quantity,
           notes = EXCLUDED.notes,
           updated_at = EXCLUDED.updated_at`,
        [
          o.id,
          o.collectionId,
          o.articleId,
          'org-brand-001',
          o.status,
          o.movementStatus,
          JSON.stringify([]),
          JSON.stringify([]),
          o.contractorId,
          dueDate,
          JSON.stringify(o.sizes),
          o.quantity,
          o.notes,
          'core-demo-seed',
          JSON.stringify({}),
          now,
        ]
      );
      console.log(`ok: ${o.id} · ${o.articleId} · ${o.status} · ${o.contractorId}`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
