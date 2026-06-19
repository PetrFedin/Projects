import 'server-only';

import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import type { PlatformCoreUserCalendarTask } from '@/lib/server/platform-core-user-calendar-task';

const memoryByCollection = new Map<string, PlatformCoreUserCalendarTask[]>();

export function clearPlatformCoreUserCalendarTaskPgMemoryForTests(): void {
  memoryByCollection.clear();
}

function rowToTask(row: {
  id: string;
  collection_id: string;
  owner_role: string;
  title: string;
  description: string | null;
  start_at: Date;
  end_at: Date;
  order_id: string | null;
  article_id: string | null;
  event_type: string | null;
  created_at: Date;
}): PlatformCoreUserCalendarTask {
  return {
    id: row.id,
    collectionId: row.collection_id,
    ownerRole: row.owner_role,
    title: row.title,
    description: row.description ?? undefined,
    startAt: row.start_at.toISOString(),
    endAt: row.end_at.toISOString(),
    orderId: row.order_id ?? undefined,
    articleId: row.article_id ?? undefined,
    eventType: row.event_type ?? undefined,
    createdAt: row.created_at.toISOString(),
  };
}

export async function upsertPlatformCoreUserCalendarTaskPg(
  task: PlatformCoreUserCalendarTask
): Promise<PlatformCoreUserCalendarTask> {
  if (!isWorkshop2PostgresEnabled()) {
    const existing = memoryByCollection.get(task.collectionId) ?? [];
    const next = [...existing.filter((t) => t.id !== task.id), task];
    memoryByCollection.set(task.collectionId, next);
    return task;
  }

  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query(
    `INSERT INTO platform_core_user_calendar_tasks
       (id, collection_id, owner_role, title, description, start_at, end_at, order_id, article_id, event_type, created_at)
     VALUES ($1, $2, $3, $4, $5, $6::timestamptz, $7::timestamptz, $8, $9, $10, $11::timestamptz)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       description = EXCLUDED.description,
       start_at = EXCLUDED.start_at,
       end_at = EXCLUDED.end_at,
       order_id = EXCLUDED.order_id,
       article_id = EXCLUDED.article_id,
       event_type = EXCLUDED.event_type
     RETURNING *`,
    [
      task.id,
      task.collectionId,
      task.ownerRole,
      task.title,
      task.description ?? null,
      task.startAt,
      task.endAt,
      task.orderId ?? null,
      task.articleId ?? null,
      task.eventType ?? null,
      task.createdAt,
    ]
  );
  return rowToTask(res.rows[0] as Parameters<typeof rowToTask>[0]);
}

export async function listPlatformCoreUserCalendarTasksPg(input: {
  collectionId: string;
  orderId?: string;
}): Promise<PlatformCoreUserCalendarTask[]> {
  const collectionId = input.collectionId.trim();
  const orderId = input.orderId?.trim();

  if (!isWorkshop2PostgresEnabled()) {
    const tasks = memoryByCollection.get(collectionId) ?? [];
    return tasks.filter((t) => !orderId || t.orderId?.trim() === orderId);
  }

  await ensureWorkshop2PgSchema();
  const params: unknown[] = [collectionId];
  let orderFilter = '';
  if (orderId) {
    params.push(orderId);
    orderFilter = ' AND order_id = $2';
  }
  const res = await getWorkshop2PgPool().query(
    `SELECT id, collection_id, owner_role, title, description, start_at, end_at, order_id, article_id, event_type, created_at
     FROM platform_core_user_calendar_tasks
     WHERE collection_id = $1${orderFilter}
     ORDER BY start_at ASC`,
    params
  );
  return res.rows.map((row) => rowToTask(row as Parameters<typeof rowToTask>[0]));
}
