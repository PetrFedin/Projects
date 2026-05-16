'use client';

import { useCallback, useEffect, type MutableRefObject } from 'react';

type BridgeRef = MutableRefObject<{ open: (attributeId: string) => void } | null> | undefined;

/**
 * Открытие диалога комментариев по атрибуту + синхронизация с внешним ref-мостом (пульс / другие панели).
 */
export function useWorkshop2Phase1DossierAttrCommentsOpenBridge(
  dossierCommentsBridgeRef: BridgeRef,
  setAttrCommentDialogAttrId: (id: string) => void,
  setAttrCommentDraft: (s: string) => void,
  setAttrCommentDraftSeverity: (s: 'normal' | 'critical') => void,
  setAttrCommentDraftAssignee: (s: string) => void,
  setAttrCommentDraftDueAt: (s: string) => void,
  setAttrCommentDraftVisibility: (s: 'internal' | 'factory') => void,
  setAttrCommentOnlyOpen: (v: boolean) => void
) {
  const openAttrComments = useCallback(
    (attributeId: string) => {
      setAttrCommentDialogAttrId(attributeId);
      setAttrCommentDraft('');
      setAttrCommentDraftSeverity('normal');
      setAttrCommentDraftAssignee('');
      setAttrCommentDraftDueAt('');
      setAttrCommentDraftVisibility('internal');
      setAttrCommentOnlyOpen(true);
    },
    [
      setAttrCommentDialogAttrId,
      setAttrCommentDraft,
      setAttrCommentDraftSeverity,
      setAttrCommentDraftAssignee,
      setAttrCommentDraftDueAt,
      setAttrCommentDraftVisibility,
      setAttrCommentOnlyOpen,
    ]
  );

  useEffect(() => {
    const br = dossierCommentsBridgeRef;
    if (!br) return;
    br.current = { open: openAttrComments };
    return () => {
      if (br.current?.open === openAttrComments) br.current = null;
    };
  }, [dossierCommentsBridgeRef, openAttrComments]);

  return { openAttrComments };
}
