'use client';

import { useCallback, useEffect, useMemo } from 'react';
import {
  buildWorkshop2AssignmentHandoffBundle,
  buildWorkshop2AssignmentSendPanelBundle,
  type BuildWorkshop2AssignmentHandoffBundleInput,
  type BuildWorkshop2AssignmentSendPanelBundleInput,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-assignment-body-bundles';
import { runOpenNextAssignmentBlocker } from '@/components/brand/production/workshop2-phase1-dossier-panel-open-next-assignment-blocker';
import { TZ_TAB_SECTIONS } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2TzGateId } from '@/lib/production/workshop2-tz-gates';
import type { Workshop2TzPreflightIssue } from '@/lib/production/workshop2-tz-trace';

type OpenNextBlockerInput = {
  factorySendHubPreview: BuildWorkshop2AssignmentSendPanelBundleInput['factorySendHubPreview'];
  tzPreflight: BuildWorkshop2AssignmentSendPanelBundleInput['tzPreflight'];
  jumpToSketchLineRefs: () => void;
  jumpToTzSectionAnchor: BuildWorkshop2AssignmentSendPanelBundleInput['jumpToTzSectionAnchor'];
  setAttrCommentOnlyOpen: (v: boolean) => void;
  openAttrComments: (anchorId: string) => void;
};

/** Alt+←/→ по вкладкам ТЗ + мемоизированные bundle’ы панели «Задание» / handoff (логика без изменений относительно панели). */
export function useWorkshop2Phase1DossierSendHandoffBundles(input: {
  activeSection: Workshop2TzSignoffSectionKey;
  setActiveSection: (id: Workshop2TzSignoffSectionKey) => void;
  sendInput: BuildWorkshop2AssignmentSendPanelBundleInput;
  handoffInput: BuildWorkshop2AssignmentHandoffBundleInput;
  openNextBlocker: OpenNextBlockerInput;
}) {
  const {
    activeSection,
    setActiveSection,
    sendInput,
    handoffInput,
    openNextBlocker: blocker,
  } = input;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      )
        return;
      if (e.key === 'ArrowRight' && e.altKey) {
        e.preventDefault();
        const idx = TZ_TAB_SECTIONS.findIndex((s) => s.id === activeSection);
        if (idx < TZ_TAB_SECTIONS.length - 1) setActiveSection(TZ_TAB_SECTIONS[idx + 1]!.id);
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        e.preventDefault();
        const idx = TZ_TAB_SECTIONS.findIndex((s) => s.id === activeSection);
        if (idx > 0) setActiveSection(TZ_TAB_SECTIONS[idx - 1]!.id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeSection, setActiveSection]);

  const openNextAssignmentBlocker = useCallback(() => {
    runOpenNextAssignmentBlocker({
      firstUnmetId: blocker.factorySendHubPreview.firstUnmet?.id as Workshop2TzGateId | undefined,
      preflightFirstIssue: blocker.tzPreflight.issues[0] as Workshop2TzPreflightIssue | undefined,
      jumpToSketchLineRefs: blocker.jumpToSketchLineRefs,
      jumpToTzSectionAnchor: blocker.jumpToTzSectionAnchor,
      onFocusCriticalComments: () => {
        blocker.setAttrCommentOnlyOpen(true);
        blocker.openAttrComments('w2-gate-critical-comments');
      },
    });
  }, [
    blocker.factorySendHubPreview.firstUnmet?.id,
    blocker.tzPreflight.issues,
    blocker.jumpToSketchLineRefs,
    blocker.jumpToTzSectionAnchor,
    blocker.setAttrCommentOnlyOpen,
    blocker.openAttrComments,
  ]);

  const assignmentSendPanelBundle = useMemo(
    () => buildWorkshop2AssignmentSendPanelBundle(sendInput),
    [
      sendInput.assignmentChain,
      sendInput.assignmentSendChecklistDetailsRef,
      sendInput.tzWriteDisabled,
      sendInput.lastProductionExportBadge,
      sendInput.factorySendHubPreview,
      sendInput.factorySendSketchPinReadiness,
      sendInput.tzPreflight,
      sendInput.productionPreflight,
      sendInput.tzTraceRows,
      sendInput.jumpToSketchLineRefs,
      sendInput.jumpToTzSectionAnchor,
      sendInput.sketchPinLinkAudit,
      sendInput.onSketchPinFocus,
      sendInput.dossier,
      sendInput.setDossier,
    ]
  );

  const assignmentHandoffBundle = useMemo(
    () => buildWorkshop2AssignmentHandoffBundle(handoffInput),
    [
      handoffInput.dossier,
      handoffInput.setDossier,
      handoffInput.appendTzPulse,
      handoffInput.updatedByLabel,
      handoffInput.tzWriteDisabled,
      handoffInput.fourTzLevelsFullySignedByAll,
      handoffInput.handoffBlockedByProduction,
      handoffInput.productionPreflightBlockerCount,
    ]
  );

  return {
    openNextAssignmentBlocker,
    assignmentSendPanelBundle,
    assignmentHandoffBundle,
  };
}
