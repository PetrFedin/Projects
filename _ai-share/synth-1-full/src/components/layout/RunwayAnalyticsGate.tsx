'use client';

import { useEffect, useState } from 'react';
import { RunwayAnalyticsProvider } from '@/components/layout/ClientLayoutLazyParts';

/** Runway analytics — после idle на public shell, не блокирует first paint. */
export function RunwayAnalyticsGate() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMounted(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(() => setMounted(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) return null;
  return <RunwayAnalyticsProvider />;
}
