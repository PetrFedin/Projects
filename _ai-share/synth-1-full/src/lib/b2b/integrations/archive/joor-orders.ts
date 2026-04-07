/**
 * JOOR API v4 — импорт заказов (GET orders).
 * Docs: https://api-docs.jooraccess.com/reference/get-orders-1
 */

import type { JoorConfig } from './joor-api';

export interface JoorOrderLine {
  sku?: string;
  style_id?: string;
  quantity?: number;
  unit_price?: number;
  total?: number;
  [key: string]: unknown;
}

export interface JoorOrderRaw {
  id: string;
  order_number?: string;
  status?: string;
  customer_id?: string;
  customer_name?: string;
  created_at?: string;
  updated_at?: string;
  total?: number;
  currency?: string;
  lines?: JoorOrderLine[];
  shipping_address?: Record<string, unknown>;
  [key: string]: unknown;
}

/** Заказ в формате платформы (для раздела B2B заказов). */
export interface JoorOrderImported {
  id: string;
  source: 'joor';
  orderNumber: string;
  status: string;
  partnerName?: string;
  createdAt: string;
  total?: number;
  currency?: string;
  lineCount?: number;
  raw?: JoorOrderRaw;
}

/** Загрузить заказы из JOOR (GET /v4/orders). Параметры: дата от/до, статус, лимит. */
export async function joorFetchOrders(
  config?: JoorConfig | null,
  options?: { since?: string; until?: string; status?: string; limit?: number }
): Promise<JoorOrderImported[]> {
  if (!config?.apiBase || !config.accessToken) return [];
  const base = config.apiBase.replace(/\/$/, '');
  const v4 = base.includes('/v4') ? base : `${base}/v4`;
  try {
    const params = new URLSearchParams();
    if (options?.since) params.set('created_after', options.since);
    if (options?.until) params.set('created_before', options.until);
    if (options?.status) params.set('status', options.status);
    if (options?.limit) params.set('limit', String(options.limit));
    const url = `${v4}/orders${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${config.accessToken}` },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { data?: JoorOrderRaw[]; orders?: JoorOrderRaw[] };
    const orders: JoorOrderRaw[] = Array.isArray(data) ? data : data.data ?? data.orders ?? [];
    return orders.map((o) => ({
      id: String(o.id),
      source: 'joor' as const,
      orderNumber: String(o.order_number ?? o.id),
      status: String(o.status ?? 'unknown'),
      partnerName: o.customer_name as string | undefined,
      createdAt: (o.created_at as string) ?? new Date().toISOString(),
      total: typeof o.total === 'number' ? o.total : undefined,
      currency: o.currency as string | undefined,
      lineCount: Array.isArray(o.lines) ? o.lines.length : 0,
      raw: o,
    }));
  } catch {
    return [];
  }
}
