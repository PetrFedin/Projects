/**
 * PATCH — ответ поставщика на sample-material-request (confirmed | rejected).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  applyWorkshop2MaterialRequisitionStatusToDossier,
  patchWorkshop2MaterialRequisitionSupplierStatus,
  type Workshop2MaterialRequisitionSupplierStatus,
} from '@/lib/server/workshop2-material-requisition-repository';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';
import { appendWorkshop2ContextualSystemMessage } from '@/lib/server/workshop2-contextual-messages-repository';
import {
  WORKSHOP2_ARTICLE_CONTEXT_TYPE,
  workshop2ArticleContextId,
} from '@/lib/production/workshop2-domain-event-types';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';

type RouteCtx = { params: Promise<{ id: string }> };

function parseSupplierStatus(value: unknown): Workshop2MaterialRequisitionSupplierStatus | null {
  const s = String(value ?? '')
    .trim()
    .toLowerCase();
  if (s === 'confirmed' || s === 'rejected') return s;
  return null;
}

export const PATCH = withWorkshop2ApiErrorRu(async function patchSupplierMaterialRequest(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const reqId = decodeURIComponent(id).trim();
  if (!reqId) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const status = parseSupplierStatus(body.status);
  if (!status) {
    return jsonWorkshop2ErrorRu(400, 'invalid_status', {
      messageRu: 'Укажите status: confirmed или rejected.',
    });
  }

  const note = body.note != null ? String(body.note) : undefined;
  const updatedBy = resolveWorkshop2UpdatedBy(req, String(body.updatedBy ?? ''), auth.actor);

  const requisition = await patchWorkshop2MaterialRequisitionSupplierStatus({
    id: reqId,
    status,
    note,
    updatedBy,
  });
  if (!requisition) {
    return jsonWorkshop2ErrorRu(404, 'not_found');
  }

  const record = await getWorkshop2ServerDossierRecord(
    requisition.collectionId,
    requisition.articleId
  );
  if (record) {
    const nextDossier = applyWorkshop2MaterialRequisitionStatusToDossier({
      dossier: record.dossier,
      requisition,
    });
    await putWorkshop2ServerDossierRecord({
      collectionId: requisition.collectionId,
      articleId: requisition.articleId,
      dossier: nextDossier,
      baseVersion: record.version,
      updatedBy: updatedBy || 'supplier-material-request',
      txMeta: { eventType: 'supply_material_request_updated' },
    });
  }

  const statusRu = status === 'confirmed' ? 'подтверждена' : 'отклонена';
  const chatLine = `Поставщик: заявка ${requisition.materialLabel ?? requisition.id} — ${statusRu}.${note ? ` ${note}` : ''}`;

  void enqueueWorkshop2DomainEvent({
    type: 'supply.material_request.updated',
    collectionId: requisition.collectionId,
    articleId: requisition.articleId,
    payload: {
      requisitionId: requisition.id,
      status: requisition.status,
      supplierDecision: status,
      note: note ?? null,
      materialLabel: requisition.materialLabel ?? null,
    },
  }).catch(() => {
    /* best-effort */
  });

  void appendWorkshop2ContextualSystemMessage({
    contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
    contextId: workshop2ArticleContextId(requisition.collectionId, requisition.articleId),
    message: chatLine,
  }).catch(() => {
    /* best-effort */
  });

  return NextResponse.json({
    ok: true,
    requisition,
    messageRu: `Заявка ${statusRu} — зеркало досье и чат обновлены.`,
  });
});
