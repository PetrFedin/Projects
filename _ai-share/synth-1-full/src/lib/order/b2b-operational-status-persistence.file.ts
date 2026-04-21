/**
 * Серверное хранилище статуса B2B-заказа (v1): файл JSON.
 * PATCH `/api/b2b/v1/operational-orders/:id/status` (только бренд); GET list/detail подмешивают в DTO.
 */
import 'server-only';

import fs from 'fs';
import path from 'path';

export type OperationalStatusEntryV1 = {
  status: string;
  updatedAt: string;
};

export type B2BOperationalStatusFileV1 = {
  schemaVersion: 1;
  statuses: Record<string, OperationalStatusEntryV1>;
  idempotency: Record<
    string,
    {
      wholesaleOrderId: string;
      status: string;
      updatedAt: string;
    }
  >;
};

const EMPTY: B2BOperationalStatusFileV1 = {
  schemaVersion: 1,
  statuses: {},
  idempotency: {},
};

export function getB2BOperationalStatusFilePath(): string {
  const fromEnv = process.env.B2B_OPERATIONAL_STATUS_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'b2b-operational-status.json');
}

function load(): B2BOperationalStatusFileV1 {
  try {
    const p = getB2BOperationalStatusFilePath();
    const raw = fs.readFileSync(p, 'utf8');
    const j = JSON.parse(raw) as B2BOperationalStatusFileV1;
    if (
      j?.schemaVersion !== 1 ||
      typeof j.statuses !== 'object' ||
      j.statuses === null ||
      typeof j.idempotency !== 'object' ||
      j.idempotency === null
    ) {
      return { ...EMPTY };
    }
    return j;
  } catch {
    return { ...EMPTY };
  }
}

function save(data: B2BOperationalStatusFileV1): void {
  const p = getB2BOperationalStatusFilePath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function getOperationalStatusRecord(orderId: string): OperationalStatusEntryV1 | undefined {
  return load().statuses[orderId];
}

export type MergeOperationalStatusResult =
  | {
      ok: true;
      wholesaleOrderId: string;
      status: string;
      updatedAt: string;
      idempotentReplay: boolean;
    }
  | { ok: false; code: 'IDEMPOTENCY_CONFLICT' | 'BAD_REQUEST'; message: string };

export function mergeOperationalStatusPersisted(params: {
  wholesaleOrderId: string;
  idempotencyKey: string;
  status: string;
}): MergeOperationalStatusResult {
  const trimmed = params.status.trim();
  if (!trimmed) {
    return { ok: false, code: 'BAD_REQUEST', message: 'status must be a non-empty string' };
  }
  if (trimmed.length > 500) {
    return { ok: false, code: 'BAD_REQUEST', message: 'status too long (max 500)' };
  }

  const data = load();
  const prev = data.idempotency[params.idempotencyKey];
  if (prev) {
    if (prev.wholesaleOrderId !== params.wholesaleOrderId) {
      return {
        ok: false,
        code: 'IDEMPOTENCY_CONFLICT',
        message: 'Idempotency-Key already used for a different order',
      };
    }
    return {
      ok: true,
      wholesaleOrderId: prev.wholesaleOrderId,
      status: prev.status,
      updatedAt: prev.updatedAt,
      idempotentReplay: true,
    };
  }

  const now = new Date().toISOString();
  const entry: OperationalStatusEntryV1 = { status: trimmed, updatedAt: now };
  data.statuses[params.wholesaleOrderId] = entry;
  data.idempotency[params.idempotencyKey] = {
    wholesaleOrderId: params.wholesaleOrderId,
    status: trimmed,
    updatedAt: now,
  };
  save(data);

  return {
    ok: true,
    wholesaleOrderId: params.wholesaleOrderId,
    status: trimmed,
    updatedAt: now,
    idempotentReplay: false,
  };
}
