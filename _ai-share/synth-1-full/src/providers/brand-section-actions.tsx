'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type BrandSectionActionsContextValue = {
  actions: ReactNode;
  setActions: (actions: ReactNode) => void;
};

const BrandSectionActionsContext = createContext<BrandSectionActionsContextValue | null>(null);

export function BrandSectionActionsProvider({ children }: { children: ReactNode }) {
  const [actions, setActionsState] = useState<ReactNode>(null);
  const setActions = useCallback((a: ReactNode) => setActionsState(() => a), []);
  return (
    <BrandSectionActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </BrandSectionActionsContext.Provider>
  );
}

export function useBrandSectionActions() {
  const ctx = useContext(BrandSectionActionsContext);
  return ctx ?? { actions: null, setActions: () => {} };
}
