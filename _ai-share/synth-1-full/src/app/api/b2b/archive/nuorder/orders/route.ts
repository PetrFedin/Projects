/**
 * GET /api/b2b/archive/nuorder/orders — upstream list for spine import.
 * Live NuOrder when credentials configured; spine mirror fallback.
 */
import { getNuOrderConfigFromEnv } from '@/lib/b2b/integrations/archive/nuorder-client';
import { nuorderFetchOrders } from '@/lib/b2b/integrations/archive/nuorder-orders';
import { listImportedOrdersForPlatform } from '@/lib/integrations/spine/imported-orders-persistence.file';
import {
  archiveUpstreamFetchFailedResponse,
  archiveUpstreamNotConfiguredResponse,
  parseArchiveUpstreamQuery,
} from '@/lib/integrations/spine/archive-upstream-orders.server';
import { toSpineImportOrderPayloadList } from '@/lib/integrations/spine/spine-import-payload.utils';

export async function GET(request: Request) {
  const config = getNuOrderConfigFromEnv();
  if (!config) {
    return archiveUpstreamNotConfiguredResponse('B2B-каталог');
  }

  const { status, limit } = parseArchiveUpstreamQuery(request);

  try {
    const upstream = await nuorderFetchOrders(config, {
      status: status ?? 'approved',
      limit,
    });
    if (upstream.length > 0) {
      const payloads = toSpineImportOrderPayloadList(
        upstream.map((o) => ({
          id: o.id,
          ...(o.raw ? (o.raw as Record<string, unknown>) : {}),
        }))
      );
      return Response.json(payloads);
    }

    const mirror = listImportedOrdersForPlatform('nuorder');
    if (mirror.length > 0) {
      return Response.json(toSpineImportOrderPayloadList(mirror));
    }

    return Response.json([]);
  } catch (e) {
    return archiveUpstreamFetchFailedResponse(
      e instanceof Error ? e.message : 'Не удалось загрузить заказы из upstream'
    );
  }
}
