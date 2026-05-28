import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';

import {
  appendWorkshop2FitCommentToDossier,
  resolveWorkshop2FitCommentInDossier,
} from '@/lib/production/workshop2-fit-comments-log';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { putWorkshop2DossierToPg } from '@/lib/server/workshop2-dossier-repository';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';

type RouteParams = {
  params: Promise<{ collectionId: string; articleId: string }>;
};

/** POST fit comment / PATCH resolve → dossier PG + fit.comment.added event. */
async function postFitComment(req: NextRequest, ctx: RouteParams) {
  const { collectionId, articleId } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }
  const b = body as {
    action?: 'add' | 'resolve';
    text?: string;
    author?: string;
    vaultAttachmentId?: string;
    pin?: { xPct: number; yPct: number; sketchAttachmentId?: string };
    commentId?: string;
    resolvedBy?: string;
  };

  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record?.dossier) {
    return jsonWorkshop2ErrorRu(404, 'invalid_request', { messageRu: 'Досье не найдено.' });
  }

  let dossier = record.dossier;
  if (b.action === 'resolve' && b.commentId) {
    dossier = resolveWorkshop2FitCommentInDossier({
      dossier,
      commentId: b.commentId,
      resolvedBy: b.resolvedBy ?? 'brand',
    });
  } else {
    if (!b.text?.trim()) {
      return jsonWorkshop2ErrorRu(400, 'invalid_request', { messageRu: 'text обязателен.' });
    }
    dossier = appendWorkshop2FitCommentToDossier({
      dossier,
      text: b.text,
      author: b.author ?? 'technologist',
      vaultAttachmentId: b.vaultAttachmentId,
      pin: b.pin,
    });
    const added = dossier.fitComments?.[dossier.fitComments.length - 1];
    void enqueueWorkshop2DomainEvent({
      type: 'fit.comment.added',
      collectionId,
      articleId,
      payload: {
        commentId: added?.commentId,
        text: added?.text,
        author: added?.author,
        vaultAttachmentId: added?.vaultAttachmentId,
      },
    }).catch(() => {
      /* best-effort */
    });
  }

  const put = await putWorkshop2DossierToPg({
    collectionId,
    articleId,
    dossier,
    baseVersion: record.version,
  });
  if (!put.ok) {
    return jsonWorkshop2ErrorRu(409, 'version_conflict');
  }

  return NextResponse.json({
    ok: true,
    fitComments: dossier.fitComments ?? [],
    mirror: dossier.fitCommentsMirror,
  });
}

export const POST = withWorkshop2ApiErrorRu(postFitComment);
