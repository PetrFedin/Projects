'use client';

import { useEffect, type ReactNode } from 'react';

declare global {
  interface Window {
    __WORKSHOP2_PG_ONLY_ENTERPRISE__?: boolean;
  }
}

/** Wave L/M: PG-only flag без SSR script (hydration-safe). */
export function Workshop2PgOnlyEnterpriseShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.__WORKSHOP2_PG_ONLY_ENTERPRISE__ = true;
  }, []);
  return <>{children}</>;
}
