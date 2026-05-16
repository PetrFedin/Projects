'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  loadWorkshopAttrGroupUi,
  persistWorkshopAttrGroupUi,
  WORKSHOP_ATTR_GROUP_UI_LS_LEGACY,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-group-storage';

/** Ключи `раздел::подписьГруппыКаталога`. Свернутость без «гвоздика» не пишется в LS. */
export function useWorkshop2Phase1DossierAttrGroupUi(activeSection: Workshop2TzSignoffSectionKey) {
  const [pinnedAttrGroups, setPinnedAttrGroups] = useState<Set<string>>(() => new Set());
  const [collapsedAttrGroups, setCollapsedAttrGroups] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const { pinned, collapsed } = loadWorkshopAttrGroupUi();
    setPinnedAttrGroups(pinned);
    setCollapsedAttrGroups(collapsed);
    try {
      if (localStorage.getItem(WORKSHOP_ATTR_GROUP_UI_LS_LEGACY)) {
        persistWorkshopAttrGroupUi(pinned, collapsed);
        localStorage.removeItem(WORKSHOP_ATTR_GROUP_UI_LS_LEGACY);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleAttrGroupCollapsed = useCallback(
    (groupName: string) => {
      const key = `${activeSection}::${groupName}`;
      setCollapsedAttrGroups((prevCollapsed) => {
        const nextCollapsed = new Set(prevCollapsed);
        if (nextCollapsed.has(key)) nextCollapsed.delete(key);
        else nextCollapsed.add(key);
        setPinnedAttrGroups((prevPinned) => {
          if (prevPinned.has(key)) persistWorkshopAttrGroupUi(prevPinned, nextCollapsed);
          return prevPinned;
        });
        return nextCollapsed;
      });
    },
    [activeSection]
  );

  const toggleAttrGroupPinned = useCallback(
    (groupName: string) => {
      const key = `${activeSection}::${groupName}`;
      setPinnedAttrGroups((prevPinned) => {
        const nextPinned = new Set(prevPinned);
        const wasPinned = nextPinned.has(key);
        if (wasPinned) nextPinned.delete(key);
        else nextPinned.add(key);
        setCollapsedAttrGroups((prevCollapsed) => {
          const nextCollapsed = new Set(prevCollapsed);
          if (wasPinned) nextCollapsed.delete(key);
          persistWorkshopAttrGroupUi(nextPinned, nextCollapsed);
          return nextCollapsed;
        });
        return nextPinned;
      });
    },
    [activeSection]
  );

  return {
    pinnedAttrGroups,
    collapsedAttrGroups,
    toggleAttrGroupPinned,
    toggleAttrGroupCollapsed,
  };
}
