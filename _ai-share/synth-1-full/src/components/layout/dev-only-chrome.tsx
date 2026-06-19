'use client';

import { usePathname } from 'next/navigation';
import { ChunkLoadRecovery } from '@/components/layout/chunk-load-recovery';
import { DevSessionBanner } from '@/components/layout/dev-session-banner';
import { SynthaPreviewBridge } from '@/components/layout/SynthaPreviewBridge';
import { isPlatformCoreGoldenPath } from '@/lib/platform-core-cabinet-route';

/** Один dev-only chunk вместо двух параллельных dynamic() на старте. */
export function DevOnlyChrome() {
  const pathname = usePathname();
  if (isPlatformCoreGoldenPath(pathname)) return null;

  return (
    <>
      <ChunkLoadRecovery />
      <DevSessionBanner />
      <SynthaPreviewBridge />
    </>
  );
}
