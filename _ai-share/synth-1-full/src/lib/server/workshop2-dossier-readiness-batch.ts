import 'server-only';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import { summarizeWorkshop2ArticleDevelopmentStateDisplay } from '@/lib/production/workshop2-article-development-state-display';
import { getWorkshop2ReadinessSnapshot } from '@/lib/production/workshop2-readiness-snapshot';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';

export type Workshop2BatchReadinessItemInput = {
  collectionId: string;
  articleId: string;
  categoryLeafId?: string;
  articleSkuDraft?: string;
  articleNameDraft?: string;
};

export type Workshop2BatchReadinessDevelopmentPath = {
  labelRu: string;
  hintRu: string;
  criticalPathReady: boolean;
  stepsDone: number;
  stepsTotal: number;
};

export type Workshop2BatchReadinessItemResult = {
  collectionId: string;
  articleId: string;
  found: boolean;
  tzOverallPct: number;
  preflightScore: number;
  version?: number;
  updatedAt?: string;
  /** Wave S — critical path chip для hub cards без localStorage drift. */
  developmentPath?: Workshop2BatchReadinessDevelopmentPath;
  goldSampleApproved?: boolean;
};

export function computeWorkshop2DossierReadinessFromPayload(input: {
  dossier: Workshop2DossierPhase1 | null;
  categoryLeafId?: string;
  articleSkuDraft?: string;
  articleNameDraft?: string;
}): { tzOverallPct: number; preflightScore: number } {
  const leaf = input.categoryLeafId ? (findHandbookLeafById(input.categoryLeafId) ?? null) : null;
  const snap = getWorkshop2ReadinessSnapshot({
    dossier: input.dossier,
    leaf,
    articleSkuDraft: input.articleSkuDraft,
    articleNameDraft: input.articleNameDraft,
  });
  return { tzOverallPct: snap.tzOverallPct, preflightScore: snap.preflightScore };
}

function buildBatchDevelopmentPath(input: {
  dossier: Workshop2DossierPhase1 | null;
  categoryLeafId?: string;
}): Workshop2BatchReadinessDevelopmentPath | undefined {
  if (!input.dossier) return undefined;
  const dev = summarizeWorkshop2ArticleDevelopmentStateDisplay({
    dossier: input.dossier,
    categoryLeafId: input.categoryLeafId,
  });
  return {
    labelRu: dev.labelRu,
    hintRu: dev.hintRu,
    criticalPathReady: dev.criticalPathReady,
    stepsDone: dev.stepsDone,
    stepsTotal: dev.stepsTotal,
  };
}

/** Сводка готовности по списку артикулов (PG или file store). */
export async function batchWorkshop2DossierReadiness(
  items: Workshop2BatchReadinessItemInput[]
): Promise<Workshop2BatchReadinessItemResult[]> {
  const capped = items.slice(0, 200);
  const out: Workshop2BatchReadinessItemResult[] = [];
  for (const item of capped) {
    const cid = item.collectionId.trim();
    const aid = item.articleId.trim();
    if (!cid || !aid) continue;
    const record = await getWorkshop2ServerDossierRecord(cid, aid);
    if (!record) {
      const empty = computeWorkshop2DossierReadinessFromPayload({
        dossier: null,
        categoryLeafId: item.categoryLeafId,
        articleSkuDraft: item.articleSkuDraft,
        articleNameDraft: item.articleNameDraft,
      });
      out.push({
        collectionId: cid,
        articleId: aid,
        found: false,
        tzOverallPct: empty.tzOverallPct,
        preflightScore: empty.preflightScore,
        developmentPath: buildBatchDevelopmentPath({
          dossier: null,
          categoryLeafId: item.categoryLeafId,
        }),
        goldSampleApproved: false,
      });
      continue;
    }
    const scores = computeWorkshop2DossierReadinessFromPayload({
      dossier: record.dossier,
      categoryLeafId: item.categoryLeafId,
      articleSkuDraft: item.articleSkuDraft,
      articleNameDraft: item.articleNameDraft,
    });
    out.push({
      collectionId: cid,
      articleId: aid,
      found: true,
      tzOverallPct: scores.tzOverallPct,
      preflightScore: scores.preflightScore,
      version: record.version,
      updatedAt: record.updatedAt,
      developmentPath: buildBatchDevelopmentPath({
        dossier: record.dossier,
        categoryLeafId: item.categoryLeafId,
      }),
      goldSampleApproved: record.dossier.goldSampleStatus?.status === 'approved',
    });
  }
  return out;
}
