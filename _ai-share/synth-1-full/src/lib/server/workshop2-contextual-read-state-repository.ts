import 'server-only';

import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

export type Workshop2ContextualReadStateRecord = {
  organizationId: string;
  actorId: string;
  contextType: string;
  contextId: string;
  lastSeenMessageCount: number;
  lastReadAt: string;
};

type MemoryKey = string;

const memoryStore = new Map<MemoryKey, Workshop2ContextualReadStateRecord>();

function memoryKey(
  organizationId: string,
  actorId: string,
  contextType: string,
  contextId: string
): MemoryKey {
  return `${organizationId}::${actorId}::${contextType}::${contextId}`;
}

function threadKey(contextType: string, contextId: string): string {
  return `${contextType}::${contextId}`;
}

export function clearWorkshop2ContextualReadStateMemoryForTests(): void {
  memoryStore.clear();
}

export async function upsertWorkshop2ContextualReadState(input: {
  organizationId?: string;
  actorId: string;
  contextType: string;
  contextId: string;
  lastSeenMessageCount: number;
}): Promise<Workshop2ContextualReadStateRecord> {
  const organizationId = input.organizationId?.trim() || 'org-brand-001';
  const actorId = input.actorId.trim();
  const contextType = input.contextType.trim();
  const contextId = input.contextId.trim();
  const lastSeenMessageCount = Math.max(0, Math.floor(input.lastSeenMessageCount));

  if (!actorId || !contextType || !contextId) {
    throw new Error('actorId, contextType and contextId are required');
  }

  const record: Workshop2ContextualReadStateRecord = {
    organizationId,
    actorId,
    contextType,
    contextId,
    lastSeenMessageCount,
    lastReadAt: new Date().toISOString(),
  };

  if (!isWorkshop2PostgresEnabled()) {
    const key = memoryKey(organizationId, actorId, contextType, contextId);
    const prev = memoryStore.get(key);
    if (prev && prev.lastSeenMessageCount >= lastSeenMessageCount) return prev;
    memoryStore.set(key, record);
    return record;
  }

  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{
    last_seen_message_count: number;
    last_read_at: Date;
  }>(
    `INSERT INTO workshop2_contextual_read_state
       (organization_id, actor_id, context_type, context_id, last_seen_message_count, last_read_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (organization_id, actor_id, context_type, context_id)
     DO UPDATE SET
       last_seen_message_count = GREATEST(
         workshop2_contextual_read_state.last_seen_message_count,
         EXCLUDED.last_seen_message_count
       ),
       last_read_at = CASE
         WHEN EXCLUDED.last_seen_message_count >
           workshop2_contextual_read_state.last_seen_message_count
         THEN NOW()
         ELSE workshop2_contextual_read_state.last_read_at
       END
     RETURNING last_seen_message_count, last_read_at`,
    [organizationId, actorId, contextType, contextId, lastSeenMessageCount]
  );
  const row = res.rows[0];
  return {
    ...record,
    lastSeenMessageCount: row?.last_seen_message_count ?? lastSeenMessageCount,
    lastReadAt: row?.last_read_at?.toISOString() ?? record.lastReadAt,
  };
}

export async function listWorkshop2ContextualReadStateForThreads(input: {
  organizationId?: string;
  actorId: string;
  threads: Array<{ contextType: string; contextId: string }>;
}): Promise<Record<string, number>> {
  const organizationId = input.organizationId?.trim() || 'org-brand-001';
  const actorId = input.actorId.trim();
  const threads = input.threads.filter((t) => t.contextType?.trim() && t.contextId?.trim());
  if (!actorId || threads.length === 0) return {};

  if (!isWorkshop2PostgresEnabled()) {
    const out: Record<string, number> = {};
    for (const t of threads) {
      const key = memoryKey(organizationId, actorId, t.contextType, t.contextId);
      const rec = memoryStore.get(key);
      if (rec) out[threadKey(t.contextType, t.contextId)] = rec.lastSeenMessageCount;
    }
    return out;
  }

  await ensureWorkshop2PgSchema();
  const contextTypes = threads.map((t) => t.contextType);
  const contextIds = threads.map((t) => t.contextId);
  const res = await getWorkshop2PgPool().query<{
    context_type: string;
    context_id: string;
    last_seen_message_count: number;
  }>(
    `SELECT context_type, context_id, last_seen_message_count
     FROM workshop2_contextual_read_state
     WHERE organization_id = $1
       AND actor_id = $2
       AND (context_type, context_id) IN (
         SELECT * FROM UNNEST($3::text[], $4::text[]) AS t(context_type, context_id)
       )`,
    [organizationId, actorId, contextTypes, contextIds]
  );

  const out: Record<string, number> = {};
  for (const row of res.rows) {
    out[threadKey(row.context_type, row.context_id)] = row.last_seen_message_count;
  }
  return out;
}

export const WORKSHOP2_B2B_ORDER_SECTION_CONTEXT_TYPE = 'b2b_order_section';

export async function upsertWorkshop2B2bOrderSectionReadState(input: {
  organizationId?: string;
  actorId: string;
  sectionVisitKey: string;
}): Promise<Workshop2ContextualReadStateRecord> {
  return upsertWorkshop2ContextualReadState({
    organizationId: input.organizationId,
    actorId: input.actorId,
    contextType: WORKSHOP2_B2B_ORDER_SECTION_CONTEXT_TYPE,
    contextId: input.sectionVisitKey.trim(),
    lastSeenMessageCount: 1,
  });
}

export async function listWorkshop2B2bOrderSectionReadKeys(input: {
  organizationId?: string;
  actorId: string;
  orderId: string;
}): Promise<string[]> {
  const organizationId = input.organizationId?.trim() || 'org-brand-001';
  const actorId = input.actorId.trim();
  const orderPrefix = `${input.orderId.trim()}::`;
  if (!actorId || !orderPrefix || orderPrefix === '::') return [];

  if (!isWorkshop2PostgresEnabled()) {
    const out: string[] = [];
    for (const rec of memoryStore.values()) {
      if (
        rec.organizationId === organizationId &&
        rec.actorId === actorId &&
        rec.contextType === WORKSHOP2_B2B_ORDER_SECTION_CONTEXT_TYPE &&
        rec.contextId.startsWith(orderPrefix)
      ) {
        out.push(rec.contextId);
      }
    }
    return out;
  }

  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{ context_id: string }>(
    `SELECT context_id
     FROM workshop2_contextual_read_state
     WHERE organization_id = $1
       AND actor_id = $2
       AND context_type = $3
       AND context_id LIKE $4`,
    [organizationId, actorId, WORKSHOP2_B2B_ORDER_SECTION_CONTEXT_TYPE, `${orderPrefix}%`]
  );
  return res.rows.map((row) => row.context_id);
}
