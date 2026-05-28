import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import {
  findOperationalOrderForRequest,
  getOperationalApiActorRole,
} from '@/lib/order/b2b-operational-api-server';
import { mergeOperationalStatusPersisted } from '@/lib/order/b2b-operational-status-persistence.file';

/**
 * PATCH /api/b2b/v1/operational-orders/:orderId/status
 * Тело: `{ "status": string }`. Заголовок: `Idempotency-Key` (обязателен).
 * Только **бренд** (`x-syntha-api-actor-role: brand`); ритейлер получает обновлённый статус в GET list/detail.
 */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await ctx.params;
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();
  const decoded = decodeURIComponent(orderId);

  const actor = getOperationalApiActorRole(req);
  if (actor !== 'brand') {
    return NextResponse.json(
      {
        ok: false as const,
        error: {
          code: 'FORBIDDEN',
          message: 'Only brand actor may PATCH operational order status',
        },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 403, headers: { 'x-request-id': requestId } }
    );
  }

  const idempotencyKey = req.headers.get('idempotency-key')?.trim();
  if (!idempotencyKey) {
    return NextResponse.json(
      {
        ok: false as const,
        error: {
          code: 'BAD_REQUEST',
          message: 'Missing Idempotency-Key header',
        },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 400, headers: { 'x-request-id': requestId } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 400, headers: { 'x-request-id': requestId } }
    );
  }

  const b = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
  const statusRaw = b.status;
  const status = typeof statusRaw === 'string' ? statusRaw : undefined;
  if (status === undefined) {
    return NextResponse.json(
      {
        ok: false as const,
        error: {
          code: 'BAD_REQUEST',
          message: 'Body must include string field "status"',
        },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 400, headers: { 'x-request-id': requestId } }
    );
  }

  const row = findOperationalOrderForRequest(req, decoded);
  if (!row) {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'NOT_FOUND', message: 'Order not found' },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 404, headers: { 'x-request-id': requestId } }
    );
  }

  const result = mergeOperationalStatusPersisted({
    wholesaleOrderId: row.order,
    idempotencyKey,
    status,
  });

  if (!result.ok) {
    const statusCode = result.code === 'BAD_REQUEST' ? 400 : 409;
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: result.code, message: result.message },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: statusCode, headers: { 'x-request-id': requestId } }
    );
  }

  return NextResponse.json(
    {
      ok: true as const,
      data: {
        wholesaleOrderId: result.wholesaleOrderId,
        status: result.status,
        updatedAt: result.updatedAt,
      },
      meta: {
        requestId,
        mode,
        apiVersion: 'v1' as const,
        idempotentReplay: result.idempotentReplay,
      },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
