'use client';

import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

type NavigateToTabFn = (
  tab: 'overview' | 'tz' | 'supply' | 'fit' | 'plan' | 'release' | 'qc' | 'stock',
  opts?: { dossierSection?: DossierSection; scrollDomId?: string }
) => void;

/** Переключение вкладки ТЗ и скролл к якорю (in-app или через `onNavigateToTab`). */
export function useWorkshop2Phase1DossierJumpToTzSectionAnchor(
  tzScrollBehavior: ScrollBehavior,
  onNavigateToTab: NavigateToTabFn | undefined,
  setActiveSection: Dispatch<SetStateAction<Workshop2TzSignoffSectionKey>>
) {
  return useCallback(
    (section: Workshop2TzSignoffSectionKey, anchorId: string) => {
      const id = anchorId.replace(/^#/, '');
      setActiveSection(section);
      if (onNavigateToTab) {
        onNavigateToTab('tz', { dossierSection: section, scrollDomId: id });
        return;
      }
      const scroll = () => {
        document.getElementById(id)?.scrollIntoView({ behavior: tzScrollBehavior, block: 'start' });
        if (typeof window !== 'undefined') {
          const { pathname, search } = window.location;
          window.history.replaceState(null, '', `${pathname}${search}#${id}`);
        }
      };
      if (typeof window === 'undefined') return;
      // Allow React to mount the new section DOM
      setTimeout(scroll, 50);
    },
    [tzScrollBehavior, onNavigateToTab, setActiveSection]
  );
}
