/**
 * JOOR Brand Integration API (TypeScript).
 * Docs: https://api-docs.jooraccess.com/docs
 * - Orders (receive, mark exported), Customers, Inventory, Style Master, Prices (v4 SKU-level).
 * No public GitHub SDK; this layer matches official API semantics for use in platform.
 */

import { JOOR_DELIVERY_WINDOWS, getMoqForProduct } from '../joor-constants';
import type { B2BDeliveryWindow } from '@/lib/order/b2b-order-payload';

export interface JoorConfig {
  apiBase?: string;
  /** Token from JOOR API management (approved clients only). */
  accessToken?: string;
}

export interface JoorOrderExportStatus {
  orderId: string;
  exported: boolean;
  exportedAt?: string;
}

/** Проверка: настроена ли интеграция JOOR. */
export function isJoorConfigured(): boolean {
  if (typeof process === 'undefined') return false;
  return !!(process.env.NEXT_PUBLIC_JOOR_API_BASE || process.env.JOOR_ACCESS_TOKEN);
}

/** Конфиг из env (сервер). Для вызовов mark exported / re-export. */
export function getJoorConfigFromEnv(): JoorConfig | null {
  if (typeof process === 'undefined') return null;
  const base = process.env.JOOR_API_BASE || process.env.NEXT_PUBLIC_JOOR_API_BASE;
  const token = process.env.JOOR_ACCESS_TOKEN;
  if (!base || !token) return null;
  return { apiBase: base.replace(/\/$/, ''), accessToken: token };
}

/** Окна доставки (дропы) — из констант или API. */
export function joorGetDeliveryWindows(_config?: JoorConfig | null): B2BDeliveryWindow[] {
  return JOOR_DELIVERY_WINDOWS;
}

/** MOQ по продукту — из констант или API. */
export function joorGetMoqForProduct(productId: string, _config?: JoorConfig | null): number {
  return getMoqForProduct(productId);
}

/** Отметить заказ как экспортированный в ERP (JOOR: mark order exported). Мок при отсутствии API. */
export async function joorMarkOrderExported(
  orderId: string,
  config?: JoorConfig | null
): Promise<JoorOrderExportStatus> {
  if (config?.accessToken && config?.apiBase) {
    const res = await fetch(`${config.apiBase}/orders/${encodeURIComponent(orderId)}/export`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ exported: true }),
    });
    if (!res.ok) throw new Error(`JOOR mark exported: ${res.status}`);
    return (await res.json()) as JoorOrderExportStatus;
  }
  return { orderId, exported: true, exportedAt: new Date().toISOString() };
}

/**
 * JOOR: пометить заказ для повторного экспорта (re-export).
 * После обновления заказа — отправить снова в Shopify/ERP. GitHub: batpig61/JoorAPI_Examples.
 */
export async function joorSetOrderReExport(
  orderId: string,
  config?: JoorConfig | null
): Promise<JoorOrderExportStatus> {
  if (config?.accessToken && config?.apiBase) {
    const res = await fetch(`${config.apiBase}/orders/${encodeURIComponent(orderId)}/export`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ exported: false, reExport: true }),
    });
    if (!res.ok) throw new Error(`JOOR re-export: ${res.status}`);
    return (await res.json()) as JoorOrderExportStatus;
  }
  return { orderId, exported: false, exportedAt: undefined };
}

export type JoorInboundShipment = {
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
  status?: string;
  shippedAt?: string;
  estimatedDelivery?: string;
};

/** Inbound · fetch shipment/fulfillment from upstream (no demo stub). */
export async function joorFetchOrderShipments(
  orderId: string,
  config?: JoorConfig | null
): Promise<{ success: boolean; shipments: JoorInboundShipment[]; error?: string }> {
  const oid = orderId.trim();
  if (!oid) return { success: false, shipments: [], error: 'orderId required' };

  if (!config?.accessToken || !config?.apiBase) {
    return { success: false, shipments: [], error: 'channel_not_configured' };
  }

  try {
    const res = await fetch(`${config.apiBase}/orders/${encodeURIComponent(oid)}/shipments`, {
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      return { success: false, shipments: [], error: `HTTP ${res.status}` };
    }
    const data = (await res.json()) as
      | JoorInboundShipment[]
      | { shipments?: JoorInboundShipment[] };
    const shipments = Array.isArray(data) ? data : (data.shipments ?? []);
    return { success: true, shipments };
  } catch (e) {
    return {
      success: false,
      shipments: [],
      error: e instanceof Error ? e.message : 'fetch_failed',
    };
  }
}

/** Outbound · push shipment status to JOOR fulfillment (demo mirror when API unavailable). */
export async function joorPushOrderShipment(
  orderId: string,
  payload: {
    trackingNumber?: string;
    carrier?: string;
    status?: string;
    shippedAt?: string;
  },
  config?: JoorConfig | null
): Promise<{ success: boolean; error?: string }> {
  const oid = orderId.trim();
  if (!oid) return { success: false, error: 'orderId required' };

  if (config?.accessToken && config?.apiBase) {
    try {
      const res = await fetch(`${config.apiBase}/orders/${encodeURIComponent(oid)}/shipments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          tracking_number: payload.trackingNumber,
          carrier: payload.carrier,
          status: payload.status ?? 'shipped',
          shipped_at: payload.shippedAt,
        }),
      });
      if (res.ok) return { success: true };
      return { success: false, error: `HTTP ${res.status}` };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : 'JOOR shipment push failed',
      };
    }
  }

  return { success: true };
}
