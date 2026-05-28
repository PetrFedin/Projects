'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { isBrandProductionPathname } from '@/lib/layout/brand-production-route';

const GlobalPulse = dynamic(
  () => import('@/components/global/global-pulse').then((m) => ({ default: m.GlobalPulse })),
  { ssr: false }
);

/** framer-motion + ticker — только production brand, после idle. */
export function BrandDeferredGlobalPulse() {
  const pathname = usePathname();
  const isProductionHub = isBrandProductionPathname(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isProductionHub || typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMounted(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(() => setMounted(true), 1500);
    return () => window.clearTimeout(timer);
  }, [isProductionHub]);

  if (!isProductionHub || !mounted) return null;
  return <GlobalPulse />;
}
