/**
 * Снимок B2B-заказов на диске (РФ-контур: правка JSON без деплоя для пилотов).
 * Server-only: не импортировать из client components.
 */
import 'server-only';

import fs from 'fs';
import path from 'path';

import type { B2BOrderSnapshotFileV1 } from '@/lib/order/b2b-order-persistence.types';

export function getB2BOrderSnapshotFilePath(): string {
  const fromEnv = process.env.B2B_ORDERS_SNAPSHOT_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'b2b-orders.snapshot.json');
}

/**
 * Синхронное чтение (малый JSON). При ошибке или невалидной схеме — `null` (fallback на сид).
 */
export function loadB2BOrderSnapshotOrNull(): B2BOrderSnapshotFileV1 | null {
  try {
    const p = getB2BOrderSnapshotFilePath();
    const raw = fs.readFileSync(p, 'utf8');
    const j = JSON.parse(raw) as B2BOrderSnapshotFileV1;
    if (j?.schemaVersion !== 1 || !Array.isArray(j.orders)) return null;
    return j;
  } catch {
    return null;
  }
}
