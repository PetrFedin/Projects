'use client';

/** Контекст `w2view`. Дорожная карта, отложенные задачи и матрица UI-флагов — в `workshop2-dossier-view-infrastructure.ts`. */

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Workshop2DossierViewProfile } from '@/lib/production/workshop2-dossier-view-infrastructure';

export type Workshop2DossierViewContextValue = {
  profile: Workshop2DossierViewProfile;
  setProfile: (next: Workshop2DossierViewProfile) => void;
};

const Workshop2DossierViewContext = createContext<Workshop2DossierViewContextValue | null>(null);

export function Workshop2DossierViewProvider({
  profile,
  setProfile,
  children,
}: {
  profile: Workshop2DossierViewProfile;
  setProfile: (next: Workshop2DossierViewProfile) => void;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ profile, setProfile }), [profile, setProfile]);
  return <Workshop2DossierViewContext.Provider value={value}>{children}</Workshop2DossierViewContext.Provider>;
}

export function useWorkshop2DossierView(): Workshop2DossierViewContextValue {
  const ctx = useContext(Workshop2DossierViewContext);
  if (!ctx) {
    return {
      profile: 'full',
      setProfile: () => {},
    };
  }
  return ctx;
}
