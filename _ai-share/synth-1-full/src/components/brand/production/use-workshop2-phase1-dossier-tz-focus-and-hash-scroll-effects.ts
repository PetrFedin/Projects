'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_VISUAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-visual-section-warnings';
import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';
import { TZ_TAB_SECTIONS } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';

/**
 * Синхронизация активной секции ТЗ с `focusDossierSection` и догрузочный скролл к якорям визуала по hash.
 */
export function useWorkshop2Phase1DossierTzFocusAndHashScrollEffects(p: {
  isPhase1: boolean;
  focusDossierSection?: DossierSection | null;
  setActiveSection: Dispatch<SetStateAction<Workshop2TzSignoffSectionKey>>;
  activeSection: Workshop2TzSignoffSectionKey;
  dossierHydrateKey: number;
  tzScrollBehavior: ScrollBehavior;
}) {
  const {
    isPhase1,
    focusDossierSection,
    setActiveSection,
    activeSection,
    dossierHydrateKey,
    tzScrollBehavior,
  } = p;

  useEffect(() => {
    if (!isPhase1 || !focusDossierSection) return;
    if (focusDossierSection === 'visuals') {
      setActiveSection('construction');
      return;
    }
    if (TZ_TAB_SECTIONS.some((s) => s.id === focusDossierSection)) {
      setActiveSection(focusDossierSection as Workshop2TzSignoffSectionKey);
    }
  }, [focusDossierSection, isPhase1]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isPhase1 || activeSection !== 'construction') return;
    const raw = window.location.hash.replace(/^#/, '');
    if (!raw) return;
    const jumpIds = new Set<string>([
      W2_VISUALS_SKETCH_ANCHOR_ID,
      W2_VISUAL_SUBPAGE_ANCHORS.sketchTemplates,
    ]);
    if (!jumpIds.has(raw)) return;
    const tid = window.setTimeout(() => {
      document.getElementById(raw)?.scrollIntoView({ behavior: tzScrollBehavior, block: 'start' });
    }, 200);
    return () => window.clearTimeout(tid);
  }, [activeSection, dossierHydrateKey, isPhase1, tzScrollBehavior]);
}
