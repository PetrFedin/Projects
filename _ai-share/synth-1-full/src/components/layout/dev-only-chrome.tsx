'use client';

import { ChunkLoadRecovery } from '@/components/layout/chunk-load-recovery';
import { DevSessionBanner } from '@/components/layout/dev-session-banner';

/** Один dev-only chunk вместо двух параллельных dynamic() на старте. */
export function DevOnlyChrome() {
  return (
    <>
      <ChunkLoadRecovery />
      <DevSessionBanner />
    </>
  );
}
