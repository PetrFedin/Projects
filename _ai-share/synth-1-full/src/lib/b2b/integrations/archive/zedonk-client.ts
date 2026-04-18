/**
 * Zedonk — приём заказов (в т.ч. из JOOR/NuOrder через Zedonk), multi-brand/agent.
 * Multi-brand / agent: сводные заказы и список брендов — при появлении API.
 * Docs: api-docs.jooraccess.com (Zedonk ERP). Конфиг через env.
 */

export interface ZedonkConfig {
  apiBase?: string;
  accessToken?: string;
}

export interface ZedonkOrderLine {
  sku?: string;
  styleId?: string;
  quantity?: number;
  unitPrice?: number;
  [key: string]: unknown;
}

/** Заказ, полученный из Zedonk (и при необходимости из JOOR/NuOrder через него). */
export interface ZedonkOrder {
  id: string;
  orderNumber?: string;
  status?: string;
  source?: 'zedonk' | 'joor' | 'nuorder';
  brandId?: string;
  customerId?: string;
  customerName?: string;
  total?: number;
  currency?: string;
  lines?: ZedonkOrderLine[];
  createdAt?: string;
  [key: string]: unknown;
}

/** Импортированный заказ для раздела B2B заказов. */
export interface ZedonkOrderImported {
  id: string;
  source: 'zedonk';
  orderNumber: string;
  status: string;
  brandId?: string;
  partnerName?: string;
  createdAt: string;
  total?: number;
  currency?: string;
  lineCount?: number;
  raw?: ZedonkOrder;
}

/** Бренд в агентском кабинете (при появлении API). */
export interface ZedonkBrand {
  id: string;
  name?: string;
  [key: string]: unknown;
}

/** Сводный заказ агента по нескольким брендам (при появлении API). */
export interface ZedonkConsolidatedOrder {
  id: string;
  brandOrders?: Array<{ brandId: string; orderId: string; total?: number }>;
  total?: number;
  [key: string]: unknown;
}

/** Конфиг из env (сервер). */
export function getZedonkConfigFromEnv(): ZedonkConfig | null {
  if (typeof process === 'undefined') return null;
  const base = process.env.ZEDONK_API_BASE || process.env.NEXT_PUBLIC_ZEDONK_API_BASE;
  const token = process.env.ZEDONK_ACCESS_TOKEN;
  if (!base || !token) return null;
  return { apiBase: base.replace(/\/$/, ''), accessToken: token };
}

export function isZedonkConfigured(): boolean {
  return getZedonkConfigFromEnv() !== null;
}

/** Приём заказов из Zedonk (GET orders). При отсутствии конфига — пустой массив. */
export async function zedonkFetchOrders(
  config?: ZedonkConfig | null,
  options?: { since?: string; until?: string; status?: string; limit?: number }
): Promise<ZedonkOrderImported[]> {
  const cfg = config ?? getZedonkConfigFromEnv();
  if (!cfg?.apiBase || !cfg.accessToken) return [];
  try {
    const params = new URLSearchParams();
    if (options?.since) params.set('created_after', options.since);
    if (options?.until) params.set('created_before', options.until);
    if (options?.status) params.set('status', options.status);
    if (options?.limit) params.set('limit', String(options.limit));
    const url = `${cfg.apiBase}/orders${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${cfg.accessToken}`, Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { data?: ZedonkOrder[]; orders?: ZedonkOrder[] };
    const orders: ZedonkOrder[] = Array.isArray(data) ? data : (data.data ?? data.orders ?? []);
    return orders.map((o) => ({
      id: String(o.id),
      source: 'zedonk' as const,
      orderNumber: String(o.orderNumber ?? o.id),
      status: String(o.status ?? 'unknown'),
      brandId: o.brandId as string | undefined,
      partnerName: o.customerName as string | undefined,
      createdAt: (o.createdAt as string) ?? new Date().toISOString(),
      total: typeof o.total === 'number' ? o.total : undefined,
      currency: o.currency as string | undefined,
      lineCount: Array.isArray(o.lines) ? o.lines.length : 0,
      raw: o,
    }));
  } catch {
    return [];
  }
}

/** Список брендов (multi-brand / agent). При появлении API. */
export async function zedonkGetBrands(config?: ZedonkConfig | null): Promise<ZedonkBrand[]> {
  const cfg = config ?? getZedonkConfigFromEnv();
  if (!cfg?.apiBase || !cfg.accessToken) return [];
  try {
    const res = await fetch(`${cfg.apiBase}/brands`, {
      headers: { Authorization: `Bearer ${cfg.accessToken}`, Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as
      | ZedonkBrand[]
      | { data?: ZedonkBrand[]; brands?: ZedonkBrand[] };
    if (Array.isArray(data)) return data;
    return data.data ?? data.brands ?? [];
  } catch {
    return [];
  }
}

/** Сводные заказы агента (multi-brand). При появлении API. */
export async function zedonkGetConsolidatedOrders(
  config?: ZedonkConfig | null,
  _options?: { since?: string; limit?: number }
): Promise<ZedonkConsolidatedOrder[]> {
  const cfg = config ?? getZedonkConfigFromEnv();
  if (!cfg?.apiBase || !cfg.accessToken) return [];
  try {
    const res = await fetch(`${cfg.apiBase}/agent/orders`, {
      headers: { Authorization: `Bearer ${cfg.accessToken}`, Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as
      | ZedonkConsolidatedOrder[]
      | { data?: ZedonkConsolidatedOrder[] };
    if (Array.isArray(data)) return data;
    return data.data ?? [];
  } catch {
    return [];
  }
}
