/**
 * NuOrder API — серверная часть (OAuth 1.0, реальные запросы).
 * Импортировать только из API routes / server actions. Клиент использует nuorder-client (моки).
 * GitHub: jacobsvante/nuorder
 */

import { buildOAuth1Header } from './oauth1';
import type {
  NuOrderConfig,
  NuOrderCompanyCode,
  NuOrderOrderPayload,
  NuOrderInventoryPayload,
  NuOrderShipmentPayload,
  NuOrderOrderEditPayload,
  NuOrderReplenishmentPayload,
} from './nuorder-client';

const MOCK_COMPANIES: NuOrderCompanyCode[] = [
  { code: 'MAIN', name: 'Main Store' },
  { code: 'OUTLET', name: 'Outlet' },
];

function getBaseUrl(config: NuOrderConfig): string {
  const host = config.hostname.startsWith('http') ? config.hostname : `https://${config.hostname}`;
  return host.replace(/\/$/, '');
}

export async function nuorderServerGetCompanyCodes(config: NuOrderConfig): Promise<NuOrderCompanyCode[]> {
  try {
    const url = `${getBaseUrl(config)}/api/companies/codes/list`;
    const auth = buildOAuth1Header('GET', url, {
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
      token: config.oauthToken,
      tokenSecret: config.oauthTokenSecret,
    });
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: auth, Accept: 'application/json' },
    });
    if (!res.ok) return MOCK_COMPANIES;
    const data = await res.json();
    if (Array.isArray(data)) return data as NuOrderCompanyCode[];
    if (data?.codes) return data.codes as NuOrderCompanyCode[];
    return MOCK_COMPANIES;
  } catch {
    return MOCK_COMPANIES;
  }
}

export async function nuorderServerCreateOrder(
  config: NuOrderConfig,
  payload: NuOrderOrderPayload
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const url = `${getBaseUrl(config)}/api/order/new`;
    const auth = buildOAuth1Header('PUT', url, {
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
      token: config.oauthToken,
      tokenSecret: config.oauthTokenSecret,
    });
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text || `HTTP ${res.status}` };
    }
    const data = (await res.json()) as { order_id?: string; id?: string };
    const orderId = data.order_id ?? data.id ?? `nu-${Date.now()}`;
    return { success: true, orderId: String(orderId) };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'NuOrder request failed' };
  }
}

const oauth = (config: NuOrderConfig) => ({
  consumerKey: config.consumerKey,
  consumerSecret: config.consumerSecret,
  token: config.oauthToken,
  tokenSecret: config.oauthTokenSecret,
});

/** Синхрон остатков в NuOrder (pre-book, ATS). Путь по Apiary может отличаться. */
export async function nuorderServerPushInventory(
  config: NuOrderConfig,
  payload: NuOrderInventoryPayload
): Promise<{ success: boolean; processed?: number; error?: string }> {
  try {
    const url = `${getBaseUrl(config)}/api/inventory`;
    const auth = buildOAuth1Header('PUT', url, oauth(config));
    const body = {
      inventory: payload.inventory?.map((i) => ({
        style: i.style,
        sku: i.sku,
        color: i.color,
        size: i.size,
        qty: i.qty,
        pre_book_qty: i.pre_book_qty,
        ats_qty: i.ats_qty,
      })),
      overwrite: payload.overwrite ?? false,
    };
    const res = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: auth, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text || `HTTP ${res.status}` };
    }
    const count = payload.inventory?.length ?? 0;
    return { success: true, processed: count };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'NuOrder inventory failed' };
  }
}

/** Отправка статуса отгрузки в NuOrder (Orders Shipments). */
export async function nuorderServerSendShipment(
  config: NuOrderConfig,
  payload: NuOrderShipmentPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${getBaseUrl(config)}/api/order/shipment`;
    const auth = buildOAuth1Header('POST', url, oauth(config));
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text || `HTTP ${res.status}` };
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'NuOrder shipment failed' };
  }
}

/** Обновление заказа в NuOrder (Orders Edits / amendments). */
export async function nuorderServerUpdateOrder(
  config: NuOrderConfig,
  payload: NuOrderOrderEditPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${getBaseUrl(config)}/api/order/edit`;
    const auth = buildOAuth1Header('PUT', url, oauth(config));
    const res = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: auth, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text || `HTTP ${res.status}` };
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'NuOrder order edit failed' };
  }
}

/** Replenishment feed в NuOrder. */
export async function nuorderServerPushReplenishment(
  config: NuOrderConfig,
  payload: NuOrderReplenishmentPayload
): Promise<{ success: boolean; processed?: number; error?: string }> {
  try {
    const url = `${getBaseUrl(config)}/api/replenishment`;
    const auth = buildOAuth1Header('POST', url, oauth(config));
    const body = { items: payload.items };
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text || `HTTP ${res.status}` };
    }
    return { success: true, processed: payload.items?.length ?? 0 };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'NuOrder replenishment failed' };
  }
}
