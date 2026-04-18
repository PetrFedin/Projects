/**
 * JOOR API v4 — Prices (цены по SKU, типам, валютам, клиентам).
 * Docs: https://api-docs.jooraccess.com/docs/how-to-create-update-price-data
 * GET /price_types, GET /skus, CREATE /prices, POST /prices/bulk_update
 */

import type { JoorConfig } from './joor-api';

export interface JoorPriceType {
  id: string;
  name?: string;
  currency_code?: string;
  retail_currency_code?: string;
  [key: string]: unknown;
}

export interface JoorPriceItem {
  /** SKU identifier (style+color+size или артикул). */
  sku_identifier: string;
  /** JOOR price type ID ИЛИ пара name + currency. */
  price_type_id?: string;
  price_type_name?: string;
  price_type_currency_code?: string;
  wholesale_value: number;
  retail_value?: number;
  /** JOOR sku_id (если известен). */
  sku_id?: string;
}

export interface JoorPricesBulkUpdatePayload {
  prices: JoorPriceItem[];
}

/** Получить типы цен (GET /price_types). */
export async function joorGetPriceTypes(config?: JoorConfig | null): Promise<JoorPriceType[]> {
  if (!config?.apiBase || !config.accessToken) return [];
  const base = config.apiBase.replace(/\/$/, '');
  const v4 = base.includes('/v4') ? base : `${base}/v4`;
  try {
    const res = await fetch(`${v4}/price_types`, {
      headers: { Authorization: `Bearer ${config.accessToken}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data ?? data.price_types ?? []);
  } catch {
    return [];
  }
}

/** Создать/обновить цены (POST /prices или bulk_update). */
export async function joorUpsertPrices(
  items: JoorPriceItem[],
  config?: JoorConfig | null
): Promise<{ success: boolean; count?: number; error?: string }> {
  if (!config?.apiBase || !config.accessToken) {
    return { success: true, count: items.length };
  }
  const base = config.apiBase.replace(/\/$/, '');
  const v4 = base.includes('/v4') ? base : `${base}/v4`;
  try {
    const res = await fetch(`${v4}/prices/bulk_update`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prices: items }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text || `HTTP ${res.status}` };
    }
    return { success: true, count: items.length };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'JOOR prices update failed',
    };
  }
}
