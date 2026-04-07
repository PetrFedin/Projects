/**
 * JOOR API — Styles/Products и Customers (синхрон контактов и правил).
 * Docs: styles — create/update/delete styles, linesheets; customers — bulk create/update, sales rep, warehouses, discounts.
 */

import type { JoorConfig } from './joor-api';

/** Стиль/продукт для синхронизации в JOOR. */
export interface JoorStyleItem {
  style_id?: string;
  style_identifier?: string;
  name?: string;
  category?: string;
  season?: string;
  colors?: Array<{ color_code?: string; name?: string }>;
  sizes?: string[];
  image_url?: string;
  [key: string]: unknown;
}

/** Клиент/партнёр для синхронизации в JOOR. */
export interface JoorCustomerItem {
  customer_id?: string;
  name?: string;
  email?: string;
  sales_rep_id?: string;
  warehouse_id?: string;
  discount_percent?: number;
  [key: string]: unknown;
}

export interface JoorSyncStylesPayload {
  styles: JoorStyleItem[];
  /** Удалить из лайншита (drop from linesheet). */
  drop_style_ids?: string[];
}

export interface JoorSyncCustomersPayload {
  customers: JoorCustomerItem[];
}

/** Синхрон стилей/продуктов в JOOR. При отсутствии конфига — мок. */
export async function joorSyncStyles(
  payload: JoorSyncStylesPayload,
  config?: JoorConfig | null
): Promise<{ success: boolean; synced?: number; error?: string }> {
  if (!config?.apiBase || !config.accessToken) {
    return { success: true, synced: payload.styles?.length ?? 0 };
  }
  const base = config.apiBase.replace(/\/$/, '');
  const v4 = base.includes('/v4') ? base : `${base}/v4`;
  try {
    const res = await fetch(`${v4}/styles/bulk`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        styles: payload.styles,
        drop_style_ids: payload.drop_style_ids,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text || `HTTP ${res.status}` };
    }
    return { success: true, synced: payload.styles.length };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'JOOR styles sync failed',
    };
  }
}

/** Синхрон клиентов/партнёров в JOOR (bulk create/update). */
export async function joorSyncCustomers(
  payload: JoorSyncCustomersPayload,
  config?: JoorConfig | null
): Promise<{ success: boolean; synced?: number; error?: string }> {
  if (!config?.apiBase || !config.accessToken) {
    return { success: true, synced: payload.customers?.length ?? 0 };
  }
  const base = config.apiBase.replace(/\/$/, '');
  const v4 = base.includes('/v4') ? base : `${base}/v4`;
  try {
    const res = await fetch(`${v4}/customers/bulk`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customers: payload.customers }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text || `HTTP ${res.status}` };
    }
    return { success: true, synced: payload.customers.length };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'JOOR customers sync failed',
    };
  }
}
