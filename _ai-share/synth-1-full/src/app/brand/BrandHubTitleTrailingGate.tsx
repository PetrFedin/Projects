'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { isBrandAcademyPathname } from '@/lib/layout/brand-academy-route';

const BrandHubTitleTrailing = dynamic(
  () =>
    import('./BrandHubTitleTrailing').then((m) => ({
      default: m.BrandHubTitleTrailing,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="hidden h-7 min-w-[140px] animate-pulse rounded-lg bg-muted/40 sm:block"
        aria-hidden
      />
    ),
  }
);

/** KPI strip + Search — после idle; не на `/brand/academy/*` (свой chrome). */
export function BrandHubTitleTrailingGate() {
  const pathname = usePathname();
  const hideOnAcademy = isBrandAcademyPathname(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (hideOnAcademy || typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMounted(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setMounted(true), 1500);
    return () => clearTimeout(timer);
  }, [hideOnAcademy]);

  if (hideOnAcademy || !mounted) return null;
  return <BrandHubTitleTrailing />;
}
