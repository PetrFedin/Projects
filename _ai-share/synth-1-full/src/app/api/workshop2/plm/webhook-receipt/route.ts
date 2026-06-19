/**
 * POST wave 38 #78: PLM webhook receipt stub — journal only, partnerAckRecorded=false.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { recordWorkshop2PlmWebhookReceipt } from '@/lib/production/workshop2-plm-transport-journal';
import { buildWorkshop2PlmWebhookPartnerAckShape } from '@/lib/production/workshop2-live-plm-webhook-contract';
import { verifyWorkshop2PlmInboundWebhook } from '@/lib/production/workshop2-plm-inbound-verify';
import { validateWorkshop2PlmWebhookPayload } from '@/lib/production/workshop2-plm-webhook-payload-schema';
import {
  getWorkshop2ServerDossierRecord,
  getWorkshop2ServerDossierStoreMode,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';

export async function POST(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  let rawBody = '';
  try {
    rawBody = await req.text();
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const inbound = verifyWorkshop2PlmInboundWebhook({
    headers: req.headers,
    rawBody,
  });
  if (!inbound.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: inbound.error,
        messageRu: inbound.messageRu,
      },
      { status: 401 }
    );
  }

  const validated = validateWorkshop2PlmWebhookPayload(body);
  if (!validated.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: validated.error,
        messageRu: validated.messageRu,
        fieldErrors: validated.fieldErrors,
      },
      { status: 400 }
    );
  }

  const { collectionId, articleId, eventId, actor: bodyActor, payload } = validated.data;

  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'dossier_not_found');
  }

  const actor =
    resolveWorkshop2UpdatedBy(req, bodyActor ?? '', auth.actor) ?? 'plm-webhook-receipt';
  const nextDossier = recordWorkshop2PlmWebhookReceipt({
    dossier: record.dossier,
    actor,
    eventId,
    payloadPreview: payload,
  });

  const saved = await putWorkshop2ServerDossierRecord({
    collectionId,
    articleId,
    dossier: nextDossier,
    updatedBy: actor,
    txMeta: { eventType: 'workshop2_plm_webhook_receipt' },
  });
  if (!saved.ok) {
    return jsonWorkshop2ErrorRu(409, String(saved.error));
  }

  const partnerAckShape = buildWorkshop2PlmWebhookPartnerAckShape({
    dossier: nextDossier,
    eventId,
  });

  return NextResponse.json({
    ok: true,
    storeMode: getWorkshop2ServerDossierStoreMode(),
    partnerAckRecorded: partnerAckShape.partnerAckRecorded,
    partnerAckId: partnerAckShape.partnerAckId,
    ackAt: partnerAckShape.ackAt,
    partnerAckShape,
    mirror: nextDossier.plmTransportJournalMirror,
    noteRu: partnerAckShape.hintRu,
  });
}
