import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import { importJoorShipmentInbound } from '@/lib/integrations/spine/joor-shipment-inbound.service';
import { enqueueSyncJob } from '@/lib/integrations/spine/sync-jobs-persistence.file';

/** POST /api/integrations/v1/joor/tracking/import · Wave C2 inbound F-TRACKING */
export async function POST(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const wholesaleOrderId = String(
    body.wholesaleOrderId ?? body.orderId ?? body.b2bOrderId ?? ''
  ).trim();
  const externalOrderId = String(body.externalOrderId ?? body.order_id ?? '').trim();

  if (!wholesaleOrderId && !externalOrderId) {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'BAD_REQUEST', message: 'wholesaleOrderId or externalOrderId required' },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 400, headers: { 'x-request-id': requestId } }
    );
  }

  const result = await importJoorShipmentInbound({
    wholesaleOrderId: wholesaleOrderId || undefined,
    externalOrderId: externalOrderId || undefined,
  });

  if (!result) {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'NOT_FOUND', message: 'JOOR wholesale order not found' },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 404, headers: { 'x-request-id': requestId } }
    );
  }

  enqueueSyncJob({ platform: 'joor', kind: 'tracking_sync', resultCount: 1 });

  return NextResponse.json(
    {
      ok: true as const,
      data: result,
      meta: { requestId, mode, apiVersion: 'v1' as const },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
