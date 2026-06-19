/**
 * Client helpers: upstream list → POST /api/integrations/v1/:platform/orders/import
 * (столп 3 · brand registry — без автогенерации demo-заказов).
 */
import type { IntegrationPlatform } from './integration-platform';
import { wholesaleImportChannelLabelRu } from './integration-ui-utils';

export type SpineWholesaleImportPlatform = Extract<
  IntegrationPlatform,
  'joor' | 'nuorder' | 'zedonk' | 'apparel_magic'
>;

const UPSTREAM_LIST_URL: Partial<Record<SpineWholesaleImportPlatform, string>> = {
  joor: '/api/integrations/v1/joor/orders?limit=20',
  nuorder: '/api/integrations/v1/nuorder/orders?limit=20',
  zedonk: '/api/b2b/archive/zedonk/orders?limit=20',
  apparel_magic: '/api/b2b/archive/apparel-magic/orders?limit=20',
};

export type SpineWholesaleImportOutcome = {
  ok: boolean;
  results: Array<{ wholesaleOrderId: string; created: boolean }>;
  messageRu: string;
};

function isOrderPayload(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readUpstreamErrorMessage(res: Response, channelLabel: string): Promise<string> {
  try {
    const json = (await res.json()) as {
      error?: { messageRu?: string; message?: string };
      message?: string;
    };
    return (
      json.error?.messageRu ??
      json.error?.message ??
      json.message ??
      `${channelLabel}: upstream вернул ${res.status}`
    );
  } catch {
    return `${channelLabel}: upstream вернул ${res.status}`;
  }
}

/** Загрузить заказы из upstream (live credentials) и импортировать в spine. */
export async function importWholesaleOrdersToSpine(
  platform: SpineWholesaleImportPlatform
): Promise<SpineWholesaleImportOutcome> {
  const channelLabel = wholesaleImportChannelLabelRu(platform);
  const listUrl = UPSTREAM_LIST_URL[platform];
  let upstreamOrders: unknown[] = [];

  if (listUrl) {
    try {
      const listRes = await fetch(listUrl, { cache: 'no-store' });
      if (listRes.status === 503 || listRes.status === 502) {
        return {
          ok: false,
          results: [],
          messageRu: await readUpstreamErrorMessage(listRes, channelLabel),
        };
      }
      if (!listRes.ok) {
        return {
          ok: false,
          results: [],
          messageRu: await readUpstreamErrorMessage(listRes, channelLabel),
        };
      }
      const raw = (await listRes.json()) as unknown;
      if (Array.isArray(raw)) {
        upstreamOrders = raw.filter(isOrderPayload);
      }
    } catch {
      upstreamOrders = [];
    }
  }

  if (upstreamOrders.length === 0) {
    return {
      ok: false,
      results: [],
      messageRu: `${channelLabel}: нет входящих заказов. Настройте credentials канала или дождитесь inbound webhook.`,
    };
  }

  const importRes = await fetch(`/api/integrations/v1/${platform}/orders/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orders: upstreamOrders }),
  });

  const json = (await importRes.json()) as {
    data?: { results?: Array<{ wholesaleOrderId: string; created: boolean }> };
    error?: { message?: string };
  };
  const results = json.data?.results ?? [];
  const created = results.filter((r) => r.created).length;
  const id = results[0]?.wholesaleOrderId;

  if (!importRes.ok) {
    return {
      ok: false,
      results,
      messageRu:
        json.error?.message ??
        `${channelLabel}: импорт не выполнен. Проверьте payload и credentials.`,
    };
  }

  return {
    ok: true,
    results,
    messageRu: `${channelLabel}: ${results.length} заказ(ов), новых ${created}${id ? ` · ${id}` : ''}`,
  };
}
