import type { ArticleRef, ArticleWorkspaceBundle } from './types';
import {
  emptyFitGold,
  emptyNesting,
  emptyPlanPo,
  emptyQc,
  emptyRelease,
  emptyStock,
  emptySupply,
} from './default-snapshots';

export function normalizeArticleWorkspaceBundle(
  ref: ArticleRef,
  raw: ArticleWorkspaceBundle
): ArticleWorkspaceBundle {
  return {
    schemaVersion: 1,
    updatedAt: raw.updatedAt,
    supply: raw.supply ?? emptySupply(ref),
    fitGold: raw.fitGold ?? emptyFitGold(ref),
    planPo: raw.planPo ?? emptyPlanPo(ref),
    nesting: raw.nesting ?? emptyNesting(ref),
    release: raw.release ?? emptyRelease(ref),
    qc: raw.qc ?? emptyQc(ref),
    stock: raw.stock ?? emptyStock(ref),
  };
}
