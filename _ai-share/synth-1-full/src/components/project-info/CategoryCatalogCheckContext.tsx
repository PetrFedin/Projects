'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  buildDefaultFlagMap,
  loadCatalogAudienceFlagMap,
  saveCatalogAudienceFlagMap,
  type CatalogAudienceFlags,
  type CatalogAudienceKey,
} from '@/lib/project-info/category-catalog-audience-flags';

type CategoryCatalogCheckContextValue = {
  flagByLeafId: Record<string, CatalogAudienceFlags>;
  getFlags: (leafId: string) => CatalogAudienceFlags;
  setAudienceFlag: (leafId: string, key: CatalogAudienceKey, value: boolean) => void;
  resetAllToHandbookDefaults: () => void;
};

const CategoryCatalogCheckContext = createContext<CategoryCatalogCheckContextValue | null>(null);

export function CategoryCatalogCheckProvider({ children }: { children: ReactNode }) {
  const [flagByLeafId, setFlagByLeafId] = useState<Record<string, CatalogAudienceFlags>>(() =>
    loadCatalogAudienceFlagMap()
  );

  const getFlags = useCallback(
    (leafId: string): CatalogAudienceFlags => {
      return flagByLeafId[leafId] ?? buildDefaultFlagMap()[leafId]!;
    },
    [flagByLeafId]
  );

  const setAudienceFlag = useCallback((leafId: string, key: CatalogAudienceKey, value: boolean) => {
    setFlagByLeafId((prev) => {
      const defaults = buildDefaultFlagMap();
      const cur = prev[leafId] ?? defaults[leafId];
      if (!cur) return prev;
      const next = { ...prev, [leafId]: { ...cur, [key]: value } };
      saveCatalogAudienceFlagMap(next);
      return next;
    });
  }, []);

  const resetAllToHandbookDefaults = useCallback(() => {
    const next = buildDefaultFlagMap();
    saveCatalogAudienceFlagMap(next);
    setFlagByLeafId(next);
  }, []);

  const value = useMemo<CategoryCatalogCheckContextValue>(
    () => ({
      flagByLeafId,
      getFlags,
      setAudienceFlag,
      resetAllToHandbookDefaults,
    }),
    [flagByLeafId, getFlags, setAudienceFlag, resetAllToHandbookDefaults]
  );

  return (
    <CategoryCatalogCheckContext.Provider value={value}>{children}</CategoryCatalogCheckContext.Provider>
  );
}

export function useCategoryCatalogChecks(): CategoryCatalogCheckContextValue {
  const ctx = useContext(CategoryCatalogCheckContext);
  if (!ctx) {
    throw new Error('useCategoryCatalogChecks must be used within CategoryCatalogCheckProvider');
  }
  return ctx;
}
