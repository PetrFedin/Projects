'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { loadW2AttrCommentsMap } from '@/lib/production/workshop2-attr-comments-storage';
import type { Workshop2AttrComment } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';

/** Загрузка карты комментариев по атрибутам и сброс полей диалога при смене артикула / гидратации. */
export function useWorkshop2Phase1DossierAttrCommentsHydrate(input: {
  collectionId: string;
  articleId: string;
  dossierHydrateKey: number;
  setAttrCommentsById: Dispatch<SetStateAction<Record<string, Workshop2AttrComment[]>>>;
  setAttrCommentDialogAttrId: Dispatch<SetStateAction<string | null>>;
  setAttrCommentDraft: Dispatch<SetStateAction<string>>;
  setAttrCommentDraftSeverity: Dispatch<SetStateAction<'normal' | 'critical'>>;
  setAttrCommentDraftAssignee: Dispatch<SetStateAction<string>>;
  setAttrCommentDraftDueAt: Dispatch<SetStateAction<string>>;
  setAttrCommentOnlyOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    collectionId,
    articleId,
    dossierHydrateKey,
    setAttrCommentsById,
    setAttrCommentDialogAttrId,
    setAttrCommentDraft,
    setAttrCommentDraftSeverity,
    setAttrCommentDraftAssignee,
    setAttrCommentDraftDueAt,
    setAttrCommentOnlyOpen,
  } = input;

  useEffect(() => {
    setAttrCommentsById(loadW2AttrCommentsMap(collectionId, articleId));
    setAttrCommentDialogAttrId(null);
    setAttrCommentDraft('');
    setAttrCommentDraftSeverity('normal');
    setAttrCommentDraftAssignee('');
    setAttrCommentDraftDueAt('');
    setAttrCommentOnlyOpen(true);
  }, [
    articleId,
    collectionId,
    dossierHydrateKey,
    setAttrCommentDialogAttrId,
    setAttrCommentDraft,
    setAttrCommentDraftAssignee,
    setAttrCommentDraftDueAt,
    setAttrCommentDraftSeverity,
    setAttrCommentOnlyOpen,
    setAttrCommentsById,
  ]);
}
