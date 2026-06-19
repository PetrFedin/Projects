import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import {
  processSpineShipmentWebhook,
  type SpineShipmentWebhookBody,
} from '@/lib/integrations/spine/spine-shipment-webhook.service';
import { verifyIntegrationsSpineWebhookSecret } from '@/lib/integrations/spine/spine-webhook-verify';
import {
  ensureSpineOperationalStoreReady,
  SPINE_SHIPMENT_WEBHOOK_SCOPES,
} from '@/lib/integrations/spine/spine-operational-store';

/** POST /api/integrations/v1/webhooks/shipment · inbound F-TRACKING (B2B-каналы) */
export async function POST(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();

  const verify = verifyIntegrationsSpineWebhookSecret({
    secretHeader: req.headers.get('x-integrations-spine-secret'),
  });
  if (!verify.ok) {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'UNAUTHORIZED', message: verify.messageRu ?? 'Unauthorized' },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: verify.status ?? 401, headers: { 'x-request-id': requestId } }
    );
  }

  let body: SpineShipmentWebhookBody = {};
  try {
    body = (await req.json()) as SpineShipmentWebhookBody;
  } catch {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'INVALID_JSON', message: 'Invalid JSON body' },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 400, headers: { 'x-request-id': requestId } }
    );
  }

  await ensureSpineOperationalStoreReady(SPINE_SHIPMENT_WEBHOOK_SCOPES);
  const result = await processSpineShipmentWebhook(body);
  if (!result) {
    return NextResponse.json(
      {
        ok: false as const,
        error: {
          code: 'NOT_FOUND',
          message: 'platform and resolvable order id required',
        },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 404, headers: { 'x-request-id': requestId } }
    );
  }

  return NextResponse.json(
    {
      ok: true as const,
      data: result,
      meta: { requestId, mode, apiVersion: 'v1' as const },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
