import 'server-only';

import { randomUUID } from 'node:crypto';
import type {
  Workshop2SampleOrderSizes,
  Workshop2SampleOrderStatus,
  Workshop2NestingRequest,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { normalizeWorkshop2NestingRequest } from '@/lib/production/workshop2-nesting-request';
import type { Workshop2SampleGoodsMovementStatus } from '@/lib/production/workshop2-sample-goods-movement';
import {
  workshop2SampleOrderStatusToMovementStatus,
  workshop2MovementStatusToSampleOrderStatus,
} from '@/lib/production/workshop2-sample-goods-movement';
import { syncMovementOnSampleOrderStatusChange } from '@/lib/production/workshop2-sample-order-movement-auto';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { buildWorkshop2FileStoreDemoSampleOrder } from '@/lib/server/workshop2-file-store-sample-order-bootstrap';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

export type Workshop2SampleMovementLogEntry = {
  at: string;
  from: Workshop2SampleGoodsMovementStatus;
  to: Workshop2SampleGoodsMovementStatus;
  actor?: string;
};

export type Workshop2SampleOrderStatusHistoryEntry = {
  at: string;
  from: Workshop2SampleOrderStatus;
  to: Workshop2SampleOrderStatus;
  actor?: string;
  note?: string;
};

export type Workshop2SampleOrderRecord = {
  id: string;
  collectionId: string;
  articleId: string;
  status: Workshop2SampleOrderStatus;
  movementStatus: Workshop2SampleGoodsMovementStatus;
  movementLog: Workshop2SampleMovementLogEntry[];
  statusHistory: Workshop2SampleOrderStatusHistoryEntry[];
  contractorId?: string;
  dueDate?: string;
  sizes: Workshop2SampleOrderSizes;
  quantity: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  nestingRequest: Workshop2NestingRequest;
};

const memoryStore = new Map<string, Workshop2SampleOrderRecord>();

/** M2: в production без PG — не подставляем memory/demo silently. */
export function isWorkshop2SampleOrderMemoryStoreAllowed(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return env.NODE_ENV !== 'production';
}

function roomKey(collectionId: string, articleId: string): string {
  return `${collectionId}::${articleId}`;
}

function ensureWorkshop2FileStoreDemoSampleOrderRecord(
  collectionId: string,
  articleId: string
): Workshop2SampleOrderRecord | null {
  const demo = buildWorkshop2FileStoreDemoSampleOrder({ collectionId, articleId });
  if (!demo) return null;
  memoryStore.set(demo.id, demo);
  return demo;
}

export async function listWorkshop2SampleOrders(input: {
  collectionId: string;
  articleId: string;
  organizationId?: string;
}): Promise<Workshop2SampleOrderRecord[]> {
  if (!isWorkshop2PostgresEnabled()) {
    if (!isWorkshop2SampleOrderMemoryStoreAllowed()) {
      return [];
    }
    const orders = [...memoryStore.values()].filter(
      (r) => r.collectionId === input.collectionId && r.articleId === input.articleId
    );
    if (orders.length > 0) return orders;
    const seeded = ensureWorkshop2FileStoreDemoSampleOrderRecord(
      input.collectionId,
      input.articleId
    );
    return seeded ? [seeded] : [];
  }
  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{
    id: string;
    status: string;
    movement_status: string | null;
    movement_log: Workshop2SampleMovementLogEntry[] | null;
    status_history: Workshop2SampleOrderStatusHistoryEntry[] | null;
    contractor_id: string | null;
    due_date: Date | null;
    sizes: Workshop2SampleOrderSizes;
    quantity: number;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
    created_by: string | null;
    nesting_request: Workshop2NestingRequest | null;
  }>(
    `SELECT id, status, movement_status, movement_log, status_history, contractor_id, due_date, sizes, quantity, notes, created_at, updated_at, created_by, nesting_request
     FROM workshop2_sample_orders
     WHERE collection_id = $1 AND article_id = $2
     ORDER BY updated_at DESC`,
    [input.collectionId, input.articleId]
  );
  return res.rows.map((r) => {
    const row = mapRow(r);
    row.collectionId = input.collectionId;
    row.articleId = input.articleId;
    return row;
  });
}

/** Hub rollup 4.5 — все sample-order коллекции (без фильтра article). */
export async function listWorkshop2SampleOrdersByCollection(input: {
  collectionId: string;
  organizationId?: string;
}): Promise<Workshop2SampleOrderRecord[]> {
  if (!isWorkshop2PostgresEnabled()) {
    if (!isWorkshop2SampleOrderMemoryStoreAllowed()) {
      return [...memoryStore.values()].filter((r) => r.collectionId === input.collectionId);
    }
    return [...memoryStore.values()].filter((r) => r.collectionId === input.collectionId);
  }
  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{
    id: string;
    article_id: string;
    status: string;
    movement_status: string | null;
    movement_log: Workshop2SampleMovementLogEntry[] | null;
    status_history: Workshop2SampleOrderStatusHistoryEntry[] | null;
    contractor_id: string | null;
    due_date: Date | null;
    sizes: Workshop2SampleOrderSizes;
    quantity: number;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
    created_by: string | null;
    nesting_request: Workshop2NestingRequest | null;
  }>(
    `SELECT id, article_id, status, movement_status, movement_log, status_history, contractor_id, due_date, sizes, quantity, notes, created_at, updated_at, created_by, nesting_request
     FROM workshop2_sample_orders
     WHERE collection_id = $1
     ORDER BY updated_at DESC`,
    [input.collectionId]
  );
  return res.rows.map((r) => {
    const row = mapRow(r);
    row.collectionId = input.collectionId;
    row.articleId = r.article_id;
    return row;
  });
}

function mapRow(r: {
  id: string;
  status: string;
  movement_status?: string | null;
  movement_log?: Workshop2SampleMovementLogEntry[] | null;
  status_history?: Workshop2SampleOrderStatusHistoryEntry[] | null;
  contractor_id: string | null;
  due_date: Date | null;
  sizes: Workshop2SampleOrderSizes;
  quantity: number;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  created_by: string | null;
  nesting_request?: Workshop2NestingRequest | null;
}): Workshop2SampleOrderRecord {
  const status = r.status as Workshop2SampleOrderStatus;
  const movementStatus =
    (r.movement_status as Workshop2SampleGoodsMovementStatus | undefined) ??
    workshop2SampleOrderStatusToMovementStatus(status);
  return {
    id: r.id,
    collectionId: '',
    articleId: '',
    status,
    movementStatus,
    movementLog: Array.isArray(r.movement_log) ? r.movement_log : [],
    statusHistory: Array.isArray(r.status_history) ? r.status_history : [],
    contractorId: r.contractor_id ?? undefined,
    dueDate: r.due_date ? r.due_date.toISOString().slice(0, 10) : undefined,
    sizes: r.sizes ?? {},
    quantity: r.quantity,
    notes: r.notes ?? undefined,
    createdAt: r.created_at.toISOString(),
    updatedAt: r.updated_at.toISOString(),
    createdBy: r.created_by ?? undefined,
    nestingRequest: normalizeWorkshop2NestingRequest(r.nesting_request ?? {}),
  };
}

export async function createWorkshop2SampleOrder(input: {
  collectionId: string;
  articleId: string;
  organizationId?: string;
  contractorId?: string;
  dueDate?: string;
  sizes?: Workshop2SampleOrderSizes;
  quantity?: number;
  notes?: string;
  status?: Workshop2SampleOrderStatus;
  createdBy?: string;
  nestingRequest?: Workshop2NestingRequest;
}): Promise<Workshop2SampleOrderRecord> {
  const id = randomUUID();
  const now = new Date().toISOString();
  const orderStatus = input.status ?? 'draft';
  const movementStatus = workshop2SampleOrderStatusToMovementStatus(orderStatus);
  const record: Workshop2SampleOrderRecord = {
    id,
    collectionId: input.collectionId,
    articleId: input.articleId,
    status: orderStatus,
    movementStatus,
    movementLog: [],
    statusHistory: [],
    contractorId: input.contractorId,
    dueDate: input.dueDate,
    sizes: input.sizes ?? {},
    quantity: input.quantity ?? 1,
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
    createdBy: input.createdBy,
    nestingRequest: normalizeWorkshop2NestingRequest(input.nestingRequest ?? {}),
  };

  if (!isWorkshop2PostgresEnabled()) {
    if (!isWorkshop2SampleOrderMemoryStoreAllowed()) {
      throw new Error('WORKSHOP2_SAMPLE_ORDER_PG_REQUIRED');
    }
    memoryStore.set(id, record);
    return record;
  }

  await ensureWorkshop2PgSchema();
  const orgId = input.organizationId?.trim() || 'org-brand-001';
  await getWorkshop2PgPool().query(
    `INSERT INTO workshop2_sample_orders
      (id, collection_id, article_id, organization_id, status, movement_status, movement_log, status_history, contractor_id, due_date, sizes, quantity, notes, created_by, nesting_request)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10::date, $11::jsonb, $12, $13, $14, $15::jsonb)`,
    [
      id,
      input.collectionId,
      input.articleId,
      orgId,
      record.status,
      record.movementStatus,
      JSON.stringify(record.movementLog),
      JSON.stringify(record.statusHistory),
      record.contractorId ?? null,
      record.dueDate ?? null,
      JSON.stringify(record.sizes),
      record.quantity,
      record.notes ?? null,
      input.createdBy ?? null,
      JSON.stringify(record.nestingRequest),
    ]
  );
  return record;
}

function appendWorkshop2SampleOrderStatusHistory(
  prev: Workshop2SampleOrderRecord,
  nextStatus: Workshop2SampleOrderStatus,
  actor?: string,
  note?: string
): Workshop2SampleOrderStatusHistoryEntry[] {
  if (prev.status === nextStatus) return prev.statusHistory;
  return [
    ...prev.statusHistory,
    {
      at: new Date().toISOString(),
      from: prev.status,
      to: nextStatus,
      actor,
      ...(note?.trim() ? { note: note.trim().slice(0, 500) } : {}),
    },
  ];
}

/** Активный заказ: по activeSampleOrderId из досье или первый в списке. */
export async function getWorkshop2ActiveSampleOrder(input: {
  collectionId: string;
  articleId: string;
  organizationId?: string;
  activeSampleOrderId?: string | null;
}): Promise<Workshop2SampleOrderRecord | null> {
  const orders = await listWorkshop2SampleOrders({
    collectionId: input.collectionId,
    articleId: input.articleId,
    organizationId: input.organizationId,
  });
  const id = input.activeSampleOrderId?.trim();
  if (id) {
    const hit = orders.find((o) => o.id === id);
    if (hit) return hit;
  }
  return orders[0] ?? null;
}

const TERMINAL_SAMPLE_ORDER_STATUSES = new Set<Workshop2SampleOrderStatus>([
  'approved',
  'cancelled',
]);

/** M9: все заказы образца подрядчика (PG-first). */
export async function listWorkshop2SampleOrdersByContractorId(input: {
  contractorId: string;
  organizationId?: string;
  statusFilter?: Workshop2SampleOrderStatus[];
}): Promise<Workshop2SampleOrderRecord[]> {
  const contractorId = input.contractorId.trim();
  if (!contractorId) return [];

  if (!isWorkshop2PostgresEnabled()) {
    if (!isWorkshop2SampleOrderMemoryStoreAllowed()) {
      return [];
    }
    let orders = [...memoryStore.values()].filter((r) => r.contractorId === contractorId);
    if (orders.length === 0) {
      for (const ref of [
        { collectionId: 'SS27', articleId: 'demo-ss27-01', contractorId: 'fact-1' },
        { collectionId: 'SS27', articleId: 'demo-ss27-02', contractorId: 'fact-1' },
      ]) {
        if (ref.contractorId !== contractorId) continue;
        await listWorkshop2SampleOrders({
          collectionId: ref.collectionId,
          articleId: ref.articleId,
          organizationId: input.organizationId,
        });
      }
      orders = [...memoryStore.values()].filter((r) => r.contractorId === contractorId);
    }
    return sortWorkshop2SampleOrdersForFactoryQueue(orders, input.statusFilter);
  }

  await ensureWorkshop2PgSchema();
  const params: unknown[] = [contractorId];
  let sql = `SELECT id, collection_id, article_id, status, movement_status, movement_log, status_history,
    contractor_id, due_date, sizes, quantity, notes, created_at, updated_at, created_by, nesting_request
    FROM workshop2_sample_orders WHERE contractor_id = $1`;
  if (input.statusFilter?.length) {
    params.push(input.statusFilter);
    sql += ` AND status = ANY($${params.length}::text[])`;
  }
  sql += ` ORDER BY due_date ASC NULLS LAST, updated_at DESC`;

  const res = await getWorkshop2PgPool().query<{
    id: string;
    collection_id: string;
    article_id: string;
    status: string;
    movement_status: string | null;
    movement_log: Workshop2SampleMovementLogEntry[] | null;
    status_history: Workshop2SampleOrderStatusHistoryEntry[] | null;
    contractor_id: string | null;
    due_date: Date | null;
    sizes: Workshop2SampleOrderSizes;
    quantity: number;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
    created_by: string | null;
    nesting_request: Workshop2NestingRequest | null;
  }>(sql, params);

  const mapped = res.rows.map((r) => {
    const row = mapRow(r);
    row.collectionId = r.collection_id;
    row.articleId = r.article_id;
    return row;
  });
  return sortWorkshop2SampleOrdersForFactoryQueue(mapped, input.statusFilter);
}

function sortWorkshop2SampleOrdersForFactoryQueue(
  orders: Workshop2SampleOrderRecord[],
  statusFilter?: Workshop2SampleOrderStatus[]
): Workshop2SampleOrderRecord[] {
  const filtered =
    statusFilter?.length && statusFilter.length > 0
      ? orders.filter((o) => statusFilter.includes(o.status))
      : orders;
  return [...filtered].sort((a, b) => {
    const aTerminal = TERMINAL_SAMPLE_ORDER_STATUSES.has(a.status);
    const bTerminal = TERMINAL_SAMPLE_ORDER_STATUSES.has(b.status);
    if (aTerminal !== bTerminal) return aTerminal ? 1 : -1;
    const dueCmp = (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31');
    if (dueCmp !== 0) return dueCmp;
    return a.status.localeCompare(b.status);
  });
}

export async function transitionWorkshop2SampleOrder(input: {
  id: string;
  collectionId: string;
  articleId: string;
  toStatus: Workshop2SampleOrderStatus;
  actor?: string;
  note?: string;
}): Promise<Workshop2SampleOrderRecord | null> {
  const orders = await listWorkshop2SampleOrders({
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  const prev = orders.find((o) => o.id === input.id);
  if (!prev) return null;
  if (prev.status === input.toStatus) return prev;

  if (!isWorkshop2PostgresEnabled()) {
    if (!isWorkshop2SampleOrderMemoryStoreAllowed()) {
      return null;
    }
    const movementSync = syncMovementOnSampleOrderStatusChange({
      previousStatus: prev.status,
      nextStatus: input.toStatus,
      previousMovement: prev.movementStatus,
      movementLog: prev.movementLog,
    });
    const next: Workshop2SampleOrderRecord = {
      ...prev,
      status: input.toStatus,
      movementStatus: movementSync.movementStatus,
      movementLog: movementSync.movementLog,
      statusHistory: appendWorkshop2SampleOrderStatusHistory(
        prev,
        input.toStatus,
        input.actor,
        input.note
      ),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.set(input.id, next);
    return next;
  }

  await ensureWorkshop2PgSchema();
  const movementSync = syncMovementOnSampleOrderStatusChange({
    previousStatus: prev.status,
    nextStatus: input.toStatus,
    previousMovement: prev.movementStatus,
    movementLog: prev.movementLog,
  });
  const statusHistory = appendWorkshop2SampleOrderStatusHistory(
    prev,
    input.toStatus,
    input.actor,
    input.note
  );
  const res = await getWorkshop2PgPool().query(
    `UPDATE workshop2_sample_orders
     SET status = $4, movement_status = $5, movement_log = $6::jsonb, status_history = $7::jsonb, updated_at = NOW()
     WHERE id = $1 AND collection_id = $2 AND article_id = $3
     RETURNING id, status, movement_status, movement_log, status_history, contractor_id, due_date, sizes, quantity, notes, created_at, updated_at, created_by, nesting_request`,
    [
      input.id,
      input.collectionId,
      input.articleId,
      input.toStatus,
      movementSync.movementStatus,
      JSON.stringify(movementSync.movementLog),
      JSON.stringify(statusHistory),
    ]
  );
  if (!res.rows[0]) return null;
  const row = mapRow(res.rows[0] as Parameters<typeof mapRow>[0]);
  row.collectionId = input.collectionId;
  row.articleId = input.articleId;
  return row;
}

export async function updateWorkshop2SampleOrder(input: {
  id: string;
  collectionId: string;
  articleId: string;
  status?: Workshop2SampleOrderStatus;
  contractorId?: string;
  dueDate?: string;
  sizes?: Workshop2SampleOrderSizes;
  quantity?: number;
  notes?: string;
  nestingRequest?: Workshop2NestingRequest;
}): Promise<Workshop2SampleOrderRecord | null> {
  if (!isWorkshop2PostgresEnabled()) {
    if (!isWorkshop2SampleOrderMemoryStoreAllowed()) {
      return null;
    }
    const prev = memoryStore.get(input.id);
    if (!prev || prev.collectionId !== input.collectionId || prev.articleId !== input.articleId) {
      return null;
    }
    const nextStatus = input.status ?? prev.status;
    const movementSync = input.status
      ? syncMovementOnSampleOrderStatusChange({
          previousStatus: prev.status,
          nextStatus,
          previousMovement: prev.movementStatus,
          movementLog: prev.movementLog,
        })
      : {
          movementStatus: prev.movementStatus,
          movementLog: prev.movementLog,
        };
    const next: Workshop2SampleOrderRecord = {
      ...prev,
      ...(input.status ? { status: input.status } : {}),
      movementStatus: movementSync.movementStatus,
      movementLog: movementSync.movementLog,
      statusHistory: input.status
        ? appendWorkshop2SampleOrderStatusHistory(prev, input.status)
        : prev.statusHistory,
      ...(input.contractorId !== undefined ? { contractorId: input.contractorId } : {}),
      ...(input.dueDate !== undefined ? { dueDate: input.dueDate } : {}),
      ...(input.sizes ? { sizes: input.sizes } : {}),
      ...(input.quantity !== undefined ? { quantity: input.quantity } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      ...(input.nestingRequest !== undefined
        ? { nestingRequest: normalizeWorkshop2NestingRequest(input.nestingRequest) }
        : {}),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.set(input.id, next);
    return next;
  }

  await ensureWorkshop2PgSchema();
  const sets: string[] = ['updated_at = NOW()'];
  const params: unknown[] = [input.id, input.collectionId, input.articleId];
  let idx = 4;
  if (input.status) {
    const prevList = await listWorkshop2SampleOrders({
      collectionId: input.collectionId,
      articleId: input.articleId,
    });
    const prev = prevList.find((o) => o.id === input.id);
    if (prev) {
      const movementSync = syncMovementOnSampleOrderStatusChange({
        previousStatus: prev.status,
        nextStatus: input.status,
        previousMovement: prev.movementStatus,
        movementLog: prev.movementLog,
      });
      sets.push(`status = $${idx++}`);
      params.push(input.status);
      sets.push(`movement_status = $${idx++}`);
      params.push(movementSync.movementStatus);
      sets.push(`movement_log = $${idx++}::jsonb`);
      params.push(JSON.stringify(movementSync.movementLog));
      const statusHistory = appendWorkshop2SampleOrderStatusHistory(prev, input.status);
      sets.push(`status_history = $${idx++}::jsonb`);
      params.push(JSON.stringify(statusHistory));
    } else {
      sets.push(`status = $${idx++}`);
      params.push(input.status);
      sets.push(`movement_status = $${idx++}`);
      params.push(workshop2SampleOrderStatusToMovementStatus(input.status));
    }
  }
  if (input.contractorId !== undefined) {
    sets.push(`contractor_id = $${idx++}`);
    params.push(input.contractorId || null);
  }
  if (input.dueDate !== undefined) {
    sets.push(`due_date = $${idx++}::date`);
    params.push(input.dueDate || null);
  }
  if (input.sizes) {
    sets.push(`sizes = $${idx++}::jsonb`);
    params.push(JSON.stringify(input.sizes));
  }
  if (input.quantity !== undefined) {
    sets.push(`quantity = $${idx++}`);
    params.push(input.quantity);
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${idx++}`);
    params.push(input.notes || null);
  }
  if (input.nestingRequest !== undefined) {
    sets.push(`nesting_request = $${idx++}::jsonb`);
    params.push(JSON.stringify(normalizeWorkshop2NestingRequest(input.nestingRequest)));
  }

  const res = await getWorkshop2PgPool().query(
    `UPDATE workshop2_sample_orders SET ${sets.join(', ')}
     WHERE id = $1 AND collection_id = $2 AND article_id = $3
     RETURNING id, status, movement_status, movement_log, status_history, contractor_id, due_date, sizes, quantity, notes, created_at, updated_at, created_by, nesting_request`,
    params
  );
  if (!res.rows[0]) return null;
  const row = mapRow(res.rows[0] as Parameters<typeof mapRow>[0]);
  row.collectionId = input.collectionId;
  row.articleId = input.articleId;
  return row;
}

export async function advanceWorkshop2SampleOrderMovement(input: {
  id: string;
  collectionId: string;
  articleId: string;
  target: Workshop2SampleGoodsMovementStatus;
  actor?: string;
}): Promise<Workshop2SampleOrderRecord | null> {
  const apply = (prev: Workshop2SampleOrderRecord): Workshop2SampleOrderRecord => {
    const entry: Workshop2SampleMovementLogEntry = {
      at: new Date().toISOString(),
      from: prev.movementStatus,
      to: input.target,
      actor: input.actor,
    };
    const orderStatus = workshop2MovementStatusToSampleOrderStatus(input.target);
    const statusHistory = appendWorkshop2SampleOrderStatusHistory(prev, orderStatus, input.actor);
    return {
      ...prev,
      movementStatus: input.target,
      status: orderStatus,
      movementLog: [...prev.movementLog, entry],
      statusHistory,
      updatedAt: new Date().toISOString(),
    };
  };

  if (!isWorkshop2PostgresEnabled()) {
    if (!isWorkshop2SampleOrderMemoryStoreAllowed()) {
      return null;
    }
    const prev = memoryStore.get(input.id);
    if (!prev || prev.collectionId !== input.collectionId || prev.articleId !== input.articleId) {
      return null;
    }
    const next = apply(prev);
    memoryStore.set(input.id, next);
    return next;
  }

  await ensureWorkshop2PgSchema();
  const prevList = await listWorkshop2SampleOrders({
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  const prev = prevList.find((o) => o.id === input.id);
  if (!prev) return null;
  const next = apply(prev);
  const res = await getWorkshop2PgPool().query(
    `UPDATE workshop2_sample_orders
     SET movement_status = $4, movement_log = $5::jsonb, status = $6, status_history = $7::jsonb, updated_at = NOW()
     WHERE id = $1 AND collection_id = $2 AND article_id = $3
     RETURNING id, status, movement_status, movement_log, status_history, contractor_id, due_date, sizes, quantity, notes, created_at, updated_at, created_by, nesting_request`,
    [
      input.id,
      input.collectionId,
      input.articleId,
      next.movementStatus,
      JSON.stringify(next.movementLog),
      next.status,
      JSON.stringify(next.statusHistory),
    ]
  );
  if (!res.rows[0]) return null;
  const row = mapRow(res.rows[0] as Parameters<typeof mapRow>[0]);
  row.collectionId = input.collectionId;
  row.articleId = input.articleId;
  return row;
}

export function clearWorkshop2SampleOrdersMemoryForTests(): void {
  memoryStore.clear();
}
