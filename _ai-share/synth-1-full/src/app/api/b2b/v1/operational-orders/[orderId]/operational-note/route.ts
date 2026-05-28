import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import { findOperationalOrderForRequest } from '@/lib/order/b2b-operational-api-server';
import { mergeOperationalNotesPersisted } from '@/lib/order/b2b-operational-notes-persistence.file';

/**
 * PATCH /api/b2b/v1/operational-orders/:orderId/operational-note
 * Тело: `{ "note"?: string, "internalNote"?: string }` — хотя бы одно поле.
 * Заголовок: `Idempotency-Key` (обязателен).
 *
 * - `note` — операционная заметка (контракт/ритейлер).
 * - `internalNote` — внутренняя заметка бренда (JOOR), не показывать ритейлеру в UI.
 */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await ctx.params;
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();
  const decoded = decodeURIComponent(orderId);

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
  const note = 'note' in b ? b.note : undefined;
  const internalNote = 'internalNote' in b ? b.internalNote : undefined;
  const noteStr = typeof note === 'string' ? note : undefined;
  const internalStr = typeof internalNote === 'string' ? internalNote : undefined;

  if (noteStr === undefined && internalStr === undefined) {
    return NextResponse.json(
      {
        ok: false as const,
        error: {
          code: 'BAD_REQUEST',
          message: 'Body must include at least one string field: "note", "internalNote"',
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

  const result = mergeOperationalNotesPersisted({
    wholesaleOrderId: row.order,
    idempotencyKey,
    note: noteStr,
    internalNote: internalStr,
  });

  if (!result.ok) {
    const status = result.code === 'BAD_REQUEST' ? 400 : 409;
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: result.code, message: result.message },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status, headers: { 'x-request-id': requestId } }
    );
  }

  return NextResponse.json(
    {
      ok: true as const,
      data: {
        wholesaleOrderId: result.wholesaleOrderId,
        note: result.note,
        updatedAt: result.updatedAt,
        internalNote: result.internalNote,
        internalUpdatedAt: result.internalUpdatedAt,
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
