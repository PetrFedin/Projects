/**
 * POST — внешний PLM подтверждает доставку события (ERP write-back ACK).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { ackWorkshop2PlmOutboxDelivery } from '@/lib/server/workshop2-plm-outbox';
import { resolveWorkshop2OrganizationId } from '@/lib/server/workshop2-api-context';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }
  const b = body as Record<string, unknown>;
  const deliveryId = String(b.deliveryId ?? '').trim();
  if (!deliveryId) {
    return jsonWorkshop2ErrorRu(400, 'delivery_id_required');
  }

  const secret = process.env.WORKSHOP2_PLM_WEBHOOK_SECRET?.trim();
  if (secret) {
    const header = req.headers.get('x-workshop2-secret');
    if (header !== secret) {
      return jsonWorkshop2ErrorRu(401, 'unauthorized');
    }
  }

  const result = await ackWorkshop2PlmOutboxDelivery({
    deliveryId,
    organizationId: resolveWorkshop2OrganizationId(req),
  });
  return NextResponse.json({
    ok: result.ok,
    updated: result.updated,
    messageRu: result.ok ? 'Событие подтверждено (ACK).' : 'deliveryId не найден или уже ACK.',
  });
}
