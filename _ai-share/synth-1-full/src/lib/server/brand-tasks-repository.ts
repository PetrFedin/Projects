import 'server-only';

import type { BrandTaskRecord, BrandTaskStatus } from '@/lib/production-data/port';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { isWorkshop2PgOnlyMode } from '@/lib/production/workshop2-hub-pg-only-policy';
import { isPlatformCoreSpinePgPrimary } from '@/lib/server/platform-core-spine-pg.server';

const DEFAULT_ORG = 'org-brand-001';

const SEED: BrandTaskRecord[] = [
  {
    id: 'seed-1',
    title: 'Утвердить сэмпл SS26-001',
    status: 'todo',
    assignee: 'Анна',
    due: 'Сегодня',
    project: 'Production',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    title: 'Согласовать договор с ЦУМ',
    status: 'in_progress',
    assignee: 'Максим',
    due: 'Завтра',
    project: 'B2B',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function rowToTask(row: {
  id: string;
  title: string;
  status: string;
  assignee: string;
  due: string;
  project: string;
  collection_id: string | null;
  article_sku: string | null;
  created_at: Date;
  updated_at: Date;
}): BrandTaskRecord {
  const status = row.status as BrandTaskStatus;
  return {
    id: row.id,
    title: row.title,
    status,
    assignee: row.assignee,
    due: row.due,
    project: row.project,
    collectionId: row.collection_id ?? undefined,
    articleSku: row.article_sku ?? undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listBrandTasksKanban(
  organizationId = DEFAULT_ORG
): Promise<BrandTaskRecord[]> {
  if (!isWorkshop2PostgresEnabled()) {
    if (isWorkshop2PgOnlyMode()) return [];
    return SEED;
  }

  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query(
    `SELECT id, title, status, assignee, due, project, collection_id, article_sku, created_at, updated_at
     FROM brand_tasks_kanban
     WHERE organization_id = $1
     ORDER BY updated_at DESC
     LIMIT 500`,
    [organizationId]
  );
  if (res.rows.length === 0) {
    if (isPlatformCoreSpinePgPrimary() || isWorkshop2PgOnlyMode()) return [];
    return SEED;
  }
  return res.rows.map(rowToTask);
}

export async function replaceBrandTasksKanban(input: {
  tasks: BrandTaskRecord[];
  organizationId?: string;
}): Promise<{ ok: boolean; mode: 'postgres' | 'pg_only_blocked' | 'seed_only' }> {
  const org = input.organizationId ?? DEFAULT_ORG;

  if (!isWorkshop2PostgresEnabled()) {
    if (isWorkshop2PgOnlyMode()) {
      return { ok: false, mode: 'pg_only_blocked' };
    }
    return { ok: false, mode: 'seed_only' };
  }

  await ensureWorkshop2PgSchema();
  const pool = getWorkshop2PgPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM brand_tasks_kanban WHERE organization_id = $1`, [org]);
    for (const task of input.tasks) {
      await client.query(
        `INSERT INTO brand_tasks_kanban
           (id, organization_id, title, status, assignee, due, project, collection_id, article_sku, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::timestamptz, $11::timestamptz)`,
        [
          task.id,
          org,
          task.title,
          task.status,
          task.assignee,
          task.due,
          task.project,
          task.collectionId ?? null,
          task.articleSku ?? null,
          task.createdAt,
          task.updatedAt,
        ]
      );
    }
    await client.query('COMMIT');
    return { ok: true, mode: 'postgres' };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export function isBrandTasksPgConfigured(): boolean {
  return isWorkshop2PostgresEnabled();
}
