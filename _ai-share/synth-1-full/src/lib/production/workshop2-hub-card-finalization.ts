import type { ArticleWorkspaceBundle } from '@/lib/production/article-workspace/types';
import { loadArticleWorkspaceBundle } from '@/lib/production/article-workspace/local-bundle';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { workshop2Phase1DossierStorageKey } from '@/lib/production/workshop2-phase1-dossier-storage';

export type Workshop2HubCardFinalization = {
  finalized: boolean;
  /** Максимум из ISO-дат подписей и приёмки сэмпла (для подсказки). */
  finalizedAtIso?: string;
};

/**
 * Карточка в хабе «финализирована»: сэмпл принят в коллекцию и три глобальные отметки ТЗ проставлены.
 */
export function getWorkshop2HubCardFinalization(
  collectionId: string,
  articleId: string,
  dossierMap: Record<string, Workshop2DossierPhase1>,
  bundle?: ArticleWorkspaceBundle
): Workshop2HubCardFinalization {
  if (typeof window === 'undefined') return { finalized: false };
  const d = dossierMap[workshop2Phase1DossierStorageKey(collectionId, articleId)];
  const b = bundle ?? loadArticleWorkspaceBundle({ collectionId, articleId });
  const gold = Boolean(b?.fitGold?.goldApproved);
  const allVerified =
    Boolean(d?.isVerifiedByDesigner) &&
    Boolean(d?.isVerifiedByTechnologist) &&
    Boolean(d?.isVerifiedByManager);
  if (!gold || !allVerified) return { finalized: false };
  const times: string[] = [];
  if (d?.designerSignoff?.at) times.push(d.designerSignoff.at);
  if (d?.technologistSignoff?.at) times.push(d.technologistSignoff.at);
  if (d?.managerSignoff?.at) times.push(d.managerSignoff.at);
  if (b?.fitGold?.approvedAt) times.push(b.fitGold.approvedAt);
  const finalizedAtIso = times.length ? times.reduce((a, c) => (a > c ? a : c)) : undefined;
  return { finalized: true, finalizedAtIso };
}
