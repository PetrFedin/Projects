'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { RunwayAnalyticsProvider } from '@/components/layout/ClientLayoutLazyParts';
import { shouldMountNuqsProvider } from '@/lib/layout/nuqs-provider-route';

/** Runway analytics — после idle на public shell, не блокирует first paint. */
export function RunwayAnalyticsGate() {
  const pathname = usePathname();
  const isPublicShell = shouldMountNuqsProvider(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isPublicShell) return;
    if (typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMounted(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(() => setMounted(true), 1500);
    return () => window.clearTimeout(timer);
  }, [isPublicShell]);

  if (!isPublicShell || !mounted) return null;
  return <RunwayAnalyticsProvider />;
}
