'use client';

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { CmsHomeConfig } from '@/data/cms.home.default';
import { useHomeCmsConfig } from '@/components/home/hooks/use-home-cms-config';

const HomeCmsCarouselsContext = createContext<CmsHomeConfig['carousels'] | null>(null);
const HomeCmsLiveContext = createContext<CmsHomeConfig['live'] | null>(null);

export function useHomeCmsCarousels() {
  const ctx = useContext(HomeCmsCarouselsContext);
  if (!ctx) {
    throw new Error('useHomeCmsCarousels must be used within HomeCmsProvider');
  }
  return ctx;
}

export function useHomeCmsLive() {
  const ctx = useContext(HomeCmsLiveContext);
  if (!ctx) {
    throw new Error('useHomeCmsLive must be used within HomeCmsProvider');
  }
  return ctx;
}

type HomeCmsProviderProps = {
  children: ReactNode;
  /** Server baseline с `/` — без client fetch на first paint. */
  initialCms?: CmsHomeConfig;
};

/**
 * Один fetch CMS — split contexts: mid-fold (carousels) и below-fold (live)
 * подписываются точечно; shell HomePageClient не держит cfg state.
 */
export function HomeCmsProvider({ children, initialCms }: HomeCmsProviderProps) {
  const cfg = useHomeCmsConfig(initialCms);

  const carouselsValue = useMemo(() => cfg.carousels, [cfg.carousels]);
  const liveValue = useMemo(() => cfg.live, [cfg.live]);

  return (
    <HomeCmsCarouselsContext.Provider value={carouselsValue}>
      <HomeCmsLiveContext.Provider value={liveValue}>{children}</HomeCmsLiveContext.Provider>
    </HomeCmsCarouselsContext.Provider>
  );
}
