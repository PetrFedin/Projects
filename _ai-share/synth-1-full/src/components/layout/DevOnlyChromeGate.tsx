'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { scheduleIdleMount } from '@/lib/wait-for-idle';

const LazyDevOnlyChrome = dynamic(
  () =>
    import('@/components/layout/dev-only-chrome').then((m) => ({
      default: m.DevOnlyChrome,
    })),
  { ssr: false }
);

function DevOnlyChromeGateInner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const cancel = scheduleIdleMount(() => setMounted(true), 2000, 600);
    return () => cancel?.();
  }, []);

  if (!mounted) return null;
  return <LazyDevOnlyChrome />;
}

/**
 * Dev-only UI (chunk recovery + session banner) — один lazy chunk после idle,
 * не конкурирует с cold-compile главной / кабинетов.
 */
export function DevOnlyChromeGate() {
  if (process.env.NODE_ENV === 'production') return null;
  return <DevOnlyChromeGateInner />;
}
