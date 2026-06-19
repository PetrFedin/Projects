'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { RunwayAnalyticsProvider } from '@/components/layout/ClientLayoutLazyParts';
import { isPublicShellPathname } from '@/lib/layout/public-shell-route';

/** Runway analytics — после idle на public shell, не блокирует first paint. */
export function RunwayAnalyticsGate() {
  const pathname = usePathname();
  const isPublicShell = isPublicShellPathname(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isPublicShell) return;
    if (typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMounted(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = globalThis.setTimeout(() => setMounted(true), 1500);
    return () => globalThis.clearTimeout(timer);
  }, [isPublicShell]);

  if (!isPublicShell || !mounted) return null;
  return <RunwayAnalyticsProvider />;
}
