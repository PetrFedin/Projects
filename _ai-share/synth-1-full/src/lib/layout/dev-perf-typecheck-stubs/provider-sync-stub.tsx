import type { ReactNode } from 'react';

/** Minimal child wrapper — real chunk loads at runtime via dynamic import. */
export function ProviderSyncStub({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
