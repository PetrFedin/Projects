'use client';

import { useCallback, useState } from 'react';
import { useWorkshop2Phase1DossierJumpToTzSectionAnchor } from '@/components/brand/production/use-workshop2-phase1-dossier-jump-to-tz-section-anchor';
import { useWorkshop2Phase1DossierTzFocusAndHashScrollEffects } from '@/components/brand/production/use-workshop2-phase1-dossier-tz-focus-and-hash-scroll-effects';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

type NavigateToTabFn = (
  tab: 'overview' | 'tz' | 'supply' | 'fit' | 'plan' | 'release' | 'qc' | 'stock',
  opts?: { dossierSection?: DossierSection; scrollDomId?: string }
) => void;

export type UseWorkshop2Phase1DossierTzActiveSectionZoneInput = {
  tzScrollBehavior: ScrollBehavior;
  onNavigateToTab?: NavigateToTabFn;
  isPhase1: boolean;
  focusDossierSection?: DossierSection | null;
  dossierHydrateKey: number;
};

/** Активная секция ТЗ, выбор вкладки, jump-to-anchor, focus/hash sync. */
export function useWorkshop2Phase1DossierTzActiveSectionZone({
  tzScrollBehavior,
  onNavigateToTab,
  isPhase1,
  focusDossierSection,
  dossierHydrateKey,
}: UseWorkshop2Phase1DossierTzActiveSectionZoneInput) {
  const [activeSection, setActiveSection] = useState<Workshop2TzSignoffSectionKey>('general');

  const handleSelectTzSection = useCallback(
    (section: Workshop2TzSignoffSectionKey) => {
      setActiveSection(section);
      onNavigateToTab?.('tz', { dossierSection: section as DossierSection });
    },
    [onNavigateToTab]
  );

  const jumpToTzSectionAnchor = useWorkshop2Phase1DossierJumpToTzSectionAnchor(
    tzScrollBehavior,
    onNavigateToTab,
    setActiveSection
  );

  useWorkshop2Phase1DossierTzFocusAndHashScrollEffects({
    isPhase1,
    focusDossierSection,
    setActiveSection,
    activeSection,
    dossierHydrateKey,
    tzScrollBehavior,
  });

  const jumpToBrandNotesAttribute = useCallback(() => {
    setActiveSection('general');
    queueMicrotask(() => {
      document.getElementById('w2-attr-brandNotes')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, []);

  return {
    activeSection,
    setActiveSection,
    handleSelectTzSection,
    jumpToTzSectionAnchor,
    jumpToBrandNotesAttribute,
  };
}
