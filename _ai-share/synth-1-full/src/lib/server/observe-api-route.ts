import { logObservability } from '@/lib/logger';
import { getOrCreateRequestId } from '@/lib/api/response-contract';

/**
 * Оборачивает API route: после ответа пишет одну строку **`api.http`** (latency, status, requestId).
 * Включается в dev или при **`OBSERVABILITY_LOGS` / `NEXT_PUBLIC_OBSERVABILITY_LOGS`** (см. `logObservability`).
 *
 * Подключено кроме прочего к: **`/api/b2b/operational-orders*`**, **`/api/b2b/v1/*`**, **`GET|POST /api/shop/cart`**,
 * **`POST|DELETE /api/shop/session`**, **`GET|POST /api/processes`**, **`GET /api/processes/[processId]/events`**,
 * **`GET|POST /api/shop/orders`**, **`GET|POST /api/shop/inventory/stock-upload`**, **`GET /api/shop/erp-sync-status`**,
 * **`GET /api/realtime/poll`**,
 * **`GET /api/cron/domain-event-outbox-drain`**.
 */
export async function observeApiRoute<R extends Response>(
  request: Request,
  routeId: string,
  handler: () => Promise<R>
): Promise<R> {
  const t0 = performance.now();
  const requestId = getOrCreateRequestId(request);
  try {
    const res = await handler();
    const status = typeof res.status === 'number' ? res.status : 200;
    logObservability('api.http', {
      route: routeId,
      method: request.method,
      status,
      latencyMs: Math.round(performance.now() - t0),
      requestId,
    });
    return res;
  } catch (e) {
    logObservability('api.http.error', {
      route: routeId,
      method: request.method,
      status: 500,
      latencyMs: Math.round(performance.now() - t0),
      requestId,
      error: e instanceof Error ? e.message : String(e),
    });
    throw e;
  }
}
