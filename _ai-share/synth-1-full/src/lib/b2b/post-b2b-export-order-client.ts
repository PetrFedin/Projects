/**
 * Единая точка вызова `POST /api/b2b/export-order` из браузера.
 * Серверная бизнес-логика — `exportOrderToProvider` и `src/app/api/b2b/export-order/route.ts`.
 */

export type B2bExportOrderResponseJson = {
  success?: boolean;
  provider?: string;
  orderId?: string;
  exportJobId?: string;
  status?: 'accepted' | 'rejected';
  error?: string;
};

export type PostB2bExportOrderInput = {
  provider: string;
  payload: unknown;
  /** Проброс в тело запроса (тесты / симуляция отказа провайдера). */
  simulateReject?: boolean;
  /** Заголовок Idempotency-Key. */
  idempotencyKey?: string;
};

export async function postB2bExportOrder(
  input: PostB2bExportOrderInput
): Promise<{ httpStatus: number; body: B2bExportOrderResponseJson }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const key = input.idempotencyKey?.trim();
  if (key) {
    headers['Idempotency-Key'] = key;
  }

  const res = await fetch('/api/b2b/export-order', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      provider: input.provider,
      payload: input.payload,
      ...(input.simulateReject === true ? { simulateReject: true } : {}),
    }),
  });

  const body = (await res.json()) as B2bExportOrderResponseJson;
  return { httpStatus: res.status, body };
}
