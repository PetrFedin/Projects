/**
 * Синхронизация полей паспорта досье при изменении строки артикула в коллекции.
 * Не трогает assignments и прочие разделы ТЗ — только зеркало аудитории/унисекс.
 */

import type { HandbookCategoryLeaf } from '@/lib/production/category-catalog';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { defaultSampleSizeScaleIdForWorkshopLine } from '@/lib/production/workshop2-apparel-audience-domain';
import { applyWorkshop2CategoryLeafToDossier } from '@/lib/production/workshop2-dossier-category-change';

export type Workshop2ArticleLineAudienceMirror = {
  /** Аудитория из формы Workshop2 (women, men, other, …). */
  audienceId?: string;
  /** Отдельный флаг унисекс (не подменяет аудиторию). */
  isUnisex?: boolean;
  leaf?: HandbookCategoryLeaf | null;
};

export function syncWorkshop2DossierFromArticleLine(
  dossier: Workshop2DossierPhase1,
  mirror: Workshop2ArticleLineAudienceMirror,
  updatedBy?: string
): Workshop2DossierPhase1 {
  const audienceId = (mirror.audienceId ?? mirror.leaf?.audienceId ?? '').trim();
  const isUnisex = mirror.isUnisex === true;
  const now = new Date().toISOString();
  const by = updatedBy?.trim().slice(0, 120);
  const scaleId = defaultSampleSizeScaleIdForWorkshopLine(
    mirror.leaf ?? undefined,
    audienceId,
    isUnisex
  );

  return {
    ...dossier,
    ...(audienceId && audienceId !== 'unisex' ? { selectedAudienceId: audienceId } : {}),
    isUnisex,
    ...(scaleId ? { sampleSizeScaleId: scaleId } : {}),
    updatedAt: now,
    ...(by ? { updatedBy: by } : {}),
  };
}

export function syncWorkshop2DossierFromArticleCategory(
  dossier: Workshop2DossierPhase1,
  leaf: HandbookCategoryLeaf,
  updatedBy?: string,
  lineMirror?: Pick<Workshop2ArticleLineAudienceMirror, 'audienceId' | 'isUnisex'>,
  opts?: { clearOrphanAssignments?: boolean }
): Workshop2DossierPhase1 {
  const mirrored = syncWorkshop2DossierFromArticleLine(
    dossier,
    {
      audienceId: lineMirror?.audienceId ?? leaf.audienceId,
      isUnisex: lineMirror?.isUnisex,
      leaf,
    },
    updatedBy
  );
  const { dossier: withOrphans } = applyWorkshop2CategoryLeafToDossier(mirrored, leaf.leafId, {
    clearOrphans: opts?.clearOrphanAssignments === true,
  });
  return withOrphans;
}

/** Сироты при смене categoryLeafId (для toast в форме артикула). */
export {
  findOrphanCanonicalAssignments,
  formatOrphanAssignmentsRuMessage,
} from '@/lib/production/workshop2-dossier-orphan-assignments';
