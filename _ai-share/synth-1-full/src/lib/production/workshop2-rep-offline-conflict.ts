/**
 * Wave 59 starter — rep offline IndexedDB conflict resolution (server-wins).
 * Pure merge logic; wire into B2bRepOfflineSyncClient replay in Wave 59 execute.
 */

export type Workshop2RepOfflineCartLine = {
  skuId: string;
  size?: string;
  qty: number;
  updatedAt?: string;
};

export type Workshop2RepOfflineQueuePayload = {
  skuId?: string;
  size?: string;
  qty?: number;
  [key: string]: unknown;
};

export type Workshop2RepOfflineConflictInput = {
  /** Local qty from IndexedDB queue item payload */
  localQty: number;
  /** When queue item was created on device */
  localCreatedAt: string;
  /** Server cart line if exists */
  serverLine?: Workshop2RepOfflineCartLine | null;
};

export type Workshop2RepOfflineConflictResolution =
  | { action: 'replay_local'; reasonRu: string }
  | { action: 'drop_local_server_wins'; reasonRu: string; serverQty: number };

/**
 * Server-wins when server line exists and is strictly newer than local queue item.
 * If no server line — replay local (first write).
 */
export function resolveWorkshop2RepOfflineConflict(
  input: Workshop2RepOfflineConflictInput
): Workshop2RepOfflineConflictResolution {
  const { localQty, localCreatedAt, serverLine } = input;

  if (!serverLine) {
    return {
      action: 'replay_local',
      reasonRu: 'Серверная строка отсутствует — replay локальной qty.',
    };
  }

  const serverTs = serverLine.updatedAt ? Date.parse(serverLine.updatedAt) : NaN;
  const localTs = Date.parse(localCreatedAt);

  const serverNewer =
    Number.isFinite(serverTs) && Number.isFinite(localTs)
      ? serverTs > localTs
      : Boolean(serverLine.updatedAt);

  const qtyMismatch = (serverLine.qty ?? 0) !== localQty;

  if (serverNewer && qtyMismatch) {
    return {
      action: 'drop_local_server_wins',
      reasonRu: `Конфликт qty: server=${serverLine.qty} local=${localQty} — server-wins.`,
      serverQty: serverLine.qty,
    };
  }

  if (!qtyMismatch) {
    return {
      action: 'drop_local_server_wins',
      reasonRu: 'Qty совпадает — локальный replay не нужен.',
      serverQty: serverLine.qty,
    };
  }

  return {
    action: 'replay_local',
    reasonRu: 'Локальная правка новее — replay на cart API.',
  };
}

/** Extract sku/size/qty from queue payload for conflict check. */
export function parseWorkshop2RepOfflineQueuePayload(
  payload: Workshop2RepOfflineQueuePayload
): { skuId: string; size?: string; qty: number } | null {
  const skuId = typeof payload.skuId === 'string' ? payload.skuId.trim() : '';
  const qty = typeof payload.qty === 'number' ? payload.qty : Number(payload.qty);
  if (!skuId || !Number.isFinite(qty)) return null;
  const size = typeof payload.size === 'string' ? payload.size : undefined;
  return { skuId, size, qty };
}
