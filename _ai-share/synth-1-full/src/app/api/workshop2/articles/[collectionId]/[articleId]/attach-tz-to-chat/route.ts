import { NextRequest, NextResponse } from 'next/server';
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import {
  WORKSHOP2_ARTICLE_CONTEXT_TYPE,
  workshop2ArticleContextId,
} from '@/lib/production/workshop2-domain-event-types';
import { appendWorkshop2ContextualMessage } from '@/lib/server/workshop2-contextual-messages-repository';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { resolveWorkshop2ActorFromRequest } from '@/lib/server/workshop2-actor-from-request';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

/** POST — прикрепить ссылку на ZIP-пакет ТЗ в contextual chat артикула. */
export const POST = withWorkshop2ApiErrorRu(async function postAttachTzToChat(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'not_found');
  }

  const actorRes = await resolveWorkshop2ActorFromRequest(req);
  const sender = actorRes.ok ? actorRes.actor.actorLabel : 'Бренд';

  const sku =
    record.dossier.articleFormMirror?.sku?.trim() ||
    record.dossier.finalTzDocumentExportMeta?.articleSkuSnapshot?.trim() ||
    aid;
  const exportUrl = `/api/workshop2/articles/${encodeURIComponent(cid)}/${encodeURIComponent(aid)}/export-tz-bundle`;
  const attachmentName = `ТЗ-${sku}.zip`;

  const message = await appendWorkshop2ContextualMessage({
    contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
    contextId: workshop2ArticleContextId(cid, aid),
    message: 'Пакет технического задания прикреплён к треду артикула.',
    sender,
    attachmentUrl: exportUrl,
    attachmentName,
  });

  return NextResponse.json({
    ok: true,
    messageId: message.id,
    attachmentUrl: exportUrl,
    attachmentName,
  });
});
