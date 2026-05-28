/**
 * POST — MES QC defect webhook → dossier QC mirror (Wave 5 #67).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  applyWorkshop2MesQcDefectToDossier,
  formatWorkshop2MesQcChatMessageRu,
  parseWorkshop2MesQcIngestBody,
  verifyWorkshop2MesQcWebhookSecret,
} from '@/lib/production/workshop2-mes-qc-ingest';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';
import { appendWorkshop2ContextualSystemMessage } from '@/lib/server/workshop2-contextual-messages-repository';
import { insertWorkshop2QcDefect } from '@/lib/server/workshop2-qc-defects-repository';
import { listWorkshop2SampleOrders } from '@/lib/server/workshop2-sample-order-repository';
import {
  WORKSHOP2_ARTICLE_CONTEXT_TYPE,
  workshop2ArticleContextId,
} from '@/lib/production/workshop2-domain-event-types';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

async function postMesQcIngest(req: NextRequest, ctx: RouteCtx) {
  const verify = verifyWorkshop2MesQcWebhookSecret({
    authorizationHeader: req.headers.get('authorization'),
    secretHeader: req.headers.get('x-workshop2-mes-qc-secret'),
  });
  if (!verify.ok) {
    return NextResponse.json(
      { ok: false, error: 'unauthorized', messageRu: verify.messageRu },
      { status: verify.status ?? 401 }
    );
  }

  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const defect = parseWorkshop2MesQcIngestBody(body);
  if (!defect) {
    return jsonWorkshop2ErrorRu(400, 'invalid_mes_qc_payload', {
      messageRu: 'Укажите defectCode в теле запроса.',
    });
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'dossier_not_found');
  }

  const orders = await listWorkshop2SampleOrders({ collectionId: cid, articleId: aid });
  const activeOrder = orders[0];

  const nextDossier = applyWorkshop2MesQcDefectToDossier({ dossier: record.dossier, defect });
  const saved = await putWorkshop2ServerDossierRecord({
    collectionId: cid,
    articleId: aid,
    dossier: nextDossier,
    baseVersion: record.version,
    updatedBy: 'mes-qc-ingest',
    txMeta: { eventType: 'workshop2_mes_qc_ingest' },
  });
  if (!saved.ok) {
    return jsonWorkshop2ErrorRu(409, String(saved.error));
  }

  void insertWorkshop2QcDefect({
    collectionId: cid,
    articleId: aid,
    sampleOrderId: activeOrder?.id,
    defectCode: defect.defectCode,
    defectLabel: defect.defectLabel,
    severity: defect.severity ?? 'minor',
    qtyAffected: defect.qtyAffected,
    source: 'mes',
    mesEventId: defect.mesEventId,
  }).catch(() => {});

  const chatMessage = formatWorkshop2MesQcChatMessageRu(defect);
  void appendWorkshop2ContextualSystemMessage({
    contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
    contextId: workshop2ArticleContextId(cid, aid),
    message: chatMessage,
  }).catch(() => {
    /* best-effort */
  });

  void enqueueWorkshop2DomainEvent({
    type: 'qc.mes_defect.ingested',
    collectionId: cid,
    articleId: aid,
    payload: {
      defectCode: defect.defectCode,
      severity: defect.severity,
      batchId: defect.batchId,
      mesEventId: defect.mesEventId,
      messageRu: chatMessage,
    },
    dispatchNow: true,
  }).catch(() => {
    /* best-effort */
  });

  return NextResponse.json({
    ok: true,
    defect,
    qcPanelMirror: nextDossier.qcPanelMirror,
    messageRu: `MES QC defect записан в досье · ${defect.defectCode}.`,
  });
}

export const POST = withWorkshop2ApiErrorRu(postMesQcIngest);
