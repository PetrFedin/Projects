'use client';

import { useMemo } from 'react';
import { buildWorkshop2ProductionPreflightSnapshot } from '@/lib/production/workshop2-production-preflight';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2TzGateCommentLike } from '@/lib/production/workshop2-tz-gates';
import {
  buildWorkshop2TzPreflightReport,
  buildWorkshop2TzTraceRows,
} from '@/lib/production/workshop2-tz-trace';
import type { Workshop2AttrComment } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';

type CommentsMap = Record<string, Workshop2AttrComment[]>;

const asGateComments = (m: CommentsMap) => m as Record<string, Workshop2TzGateCommentLike[]>;

/** Трассировка ТЗ, pre-flight ТЗ и production pre-flight — один кластер зависимостей от досье и сессий. */
export function useWorkshop2Phase1DossierTzTraceAndPreflight(input: {
  dossier: Workshop2DossierPhase1;
  techPackSessionBlobById: Record<string, string>;
  attrCommentsById: CommentsMap;
  articleSkuDraft?: string;
  articleNameDraft?: string;
}) {
  const { dossier, techPackSessionBlobById, attrCommentsById, articleSkuDraft, articleNameDraft } =
    input;

  const tzTraceRows = useMemo(
    () =>
      buildWorkshop2TzTraceRows(dossier, {
        sessionBlobById: techPackSessionBlobById,
        commentsById: asGateComments(attrCommentsById),
      }),
    [dossier, techPackSessionBlobById, attrCommentsById]
  );

  const tzPreflight = useMemo(
    () =>
      buildWorkshop2TzPreflightReport(dossier, {
        sessionBlobById: techPackSessionBlobById,
        commentsById: asGateComments(attrCommentsById),
      }),
    [dossier, techPackSessionBlobById, attrCommentsById]
  );

  const productionPreflight = useMemo(
    () =>
      buildWorkshop2ProductionPreflightSnapshot(dossier, {
        articleSkuDraft,
        articleNameDraft,
      }),
    [dossier, articleSkuDraft, articleNameDraft]
  );

  const handoffBlockedByProduction = productionPreflight.blockers.length > 0;

  return { tzTraceRows, tzPreflight, productionPreflight, handoffBlockedByProduction };
}
