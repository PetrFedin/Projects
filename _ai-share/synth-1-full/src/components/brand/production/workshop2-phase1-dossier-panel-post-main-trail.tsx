'use client';

import {
  Workshop2AttrCommentsDialog,
  type Workshop2AttrComment,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';
import { Workshop2FinalTzWizardDialog } from '@/components/brand/production/workshop2-phase1-dossier-panel-final-tz-wizard-dialog';
import { Workshop2DossierPanelFooterActions } from '@/components/brand/production/workshop2-phase1-dossier-panel-footer-actions';
import { Workshop2DossierPersistStatusFooter } from '@/components/brand/production/workshop2-phase1-dossier-panel-persist-status-footer';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2DossierPanelPostMainTrailProps = {
  persist: {
    updatedAtIso?: string | null;
    savedHint: string | null;
    saveError: string | null;
    metricsFooterLine: string | null;
  };
  footer: {
    onBack?: () => void;
    onPreviousStep?: () => void;
    isPhase1: boolean;
    isPhase3: boolean;
    activeSection: Workshop2TzSignoffSectionKey;
    saveDraft: () => void;
    runHandbookCheck: () => void;
    handbookCheckClean: boolean;
    showFooterTzSignoffShortcut: boolean;
    allSectionSignoffPairsDone: boolean;
    allTzDigitalSignoffsDone: boolean;
    jumpToTzSignoffsAreaFooter: () => void;
    handleContinue: () => void;
  };
  finalWizard: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    exportLanguage: 'ru' | 'ru_en' | 'ru_zh';
    onExportLanguageChange: (lang: 'ru' | 'ru_en' | 'ru_zh') => void;
    finalTzSpecDocumentHtml: string;
    phase1DossierJsonUtf8Bytes: number;
    tzWriteDisabled: boolean;
    onDownloadHtml: () => void;
    onPrintPdf: () => void;
  };
  attrComments: {
    openAttrId: string | null;
    onOpenChange: (open: boolean) => void;
    commentsById: Record<string, Workshop2AttrComment[]>;
    draft: string;
    draftSeverity: 'normal' | 'critical';
    draftAssignee: string;
    draftDueAt: string;
    draftVisibility: 'internal' | 'factory';
    onlyOpen: boolean;
    onDraftChange: (v: string) => void;
    onDraftSeverityChange: (v: 'normal' | 'critical') => void;
    onDraftAssigneeChange: (v: string) => void;
    onDraftDueAtChange: (v: string) => void;
    onDraftVisibilityChange: (v: 'internal' | 'factory') => void;
    onOnlyOpenChange: (v: boolean) => void;
    onToggleCommentStatus: (commentId: string) => void;
    onSend: () => void;
  };
};

/** Подвал досье: статус сохранения, действия, итоговое ТЗ, диалог комментариев по атрибутам. */
export function Workshop2DossierPanelPostMainTrail({
  persist,
  footer,
  finalWizard,
  attrComments,
}: Workshop2DossierPanelPostMainTrailProps) {
  return (
    <>
      <Workshop2DossierPersistStatusFooter
        updatedAtIso={persist.updatedAtIso}
        savedHint={persist.savedHint}
        saveError={persist.saveError}
        metricsFooterLine={persist.metricsFooterLine}
      />
      <Workshop2DossierPanelFooterActions {...footer} />
      <Workshop2FinalTzWizardDialog {...finalWizard} />
      <Workshop2AttrCommentsDialog {...attrComments} />
    </>
  );
}
