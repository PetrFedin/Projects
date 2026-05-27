'use client';

import { useEffect } from 'react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { areWorkshop2DossierPersistBodiesEqual } from '@/lib/production/workshop2-dossier-activity-log';
import { useArticleWorkspaceOptional } from '@/components/brand/production/article-workspace-context';

/**
 * Держит `ArticleWorkspaceContext.dossier` в актуальном состоянии с панелью ТЗ.
 * Пульс артикула и лента карточки читают контекст, а правки идут в локальный state панели.
 */
export function useWorkshop2Phase1DossierWorkspaceSync(
  dossier: Workshop2DossierPhase1,
  collectionId: string,
  articleId: string
): void {
  const workspace = useArticleWorkspaceOptional();

  useEffect(() => {
    if (!workspace) return;
    if (workspace.ref.collectionId !== collectionId || workspace.ref.articleId !== articleId) {
      return;
    }
    workspace.setDossier((prev) => {
      if (prev === dossier) return prev;
      if (prev && areWorkshop2DossierPersistBodiesEqual(prev, dossier)) {
        return prev;
      }
      return dossier;
    });
  }, [workspace, dossier, collectionId, articleId]);
}
