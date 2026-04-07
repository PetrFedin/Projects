/**
 * JOOR API v2 — Inventory (остатки).
 * Docs: https://api-docs.jooraccess.com/docs/inventory
 * Только v2 поддерживает выгрузку остатков: по SKU, складам, датам доступности, режим overwrite или update.
 */

import type { JoorConfig } from './joor-api';

export interface JoorInventoryItem {
  /** Идентификатор стиля (JOOR style_id или style_identifier). */
  styleId?: string;
  /** SKU или артикул (color + size). */
  sku?: string;
  /** Доступное количество. */
  quantity: number;
  /** ID склада в JOOR (при нескольких складах). */
  warehouseId?: string;
  /** Дата доступности (immediate или будущая). ISO date. */
  availableDate?: string;
  /** Case pack size, если передаётся упаковками. */
  casePack?: number;
}

export interface JoorInventoryPayload {
  items: JoorInventoryItem[];
  /** true = полная замена остатков (Overwrite), false = только изменения (Update). */
  overwrite?: boolean;
  /** Вычитать pending JOOR из доступного количества. */
  decPending?: boolean;
}

export interface JoorInventoryResult {
  success: boolean;
  processed?: number;
  error?: string;
}

/** Выгрузка остатков в JOOR (v2). При отсутствии конфига — мок успеха. */
export async function joorPushInventory(
  payload: JoorInventoryPayload,
  config?: JoorConfig | null
): Promise<JoorInventoryResult> {
  if (!config?.apiBase || !config.accessToken) {
    return { success: true, processed: payload.items?.length ?? 0 };
  }
  const base = config.apiBase.replace(/\/v4\/?$/, '').replace(/\/$/, '');
  const v2Base = base.includes('/v2') ? base : `${base}/v2`;
  try {
    const body = {
      inventory: payload.items.map((i) => ({
        style_id: i.styleId,
        sku: i.sku,
        quantity: i.quantity,
        warehouse_id: i.warehouseId,
        available_date: i.availableDate,
        case_pack: i.casePack,
      })),
      overwrite: payload.overwrite ?? false,
      dec_pending: payload.decPending ?? false,
    };
    const res = await fetch(`${v2Base}/inventory`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text || `HTTP ${res.status}` };
    }
    const data = (await res.json()) as { processed?: number };
    return { success: true, processed: data.processed ?? payload.items.length };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'JOOR inventory push failed',
    };
  }
}
