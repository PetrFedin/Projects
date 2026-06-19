'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { shouldMountBrandSectionHeader } from '@/lib/layout/brand-hub-secondary-route';

const BrandSectionHeaderBlock = dynamic(
  () =>
    import('@/components/brand/BrandSectionHeaderBlock').then((m) => ({
      default: m.BrandSectionHeaderBlock,
    })),
  { ssr: false }
);

/** Section header (brand-navigation meta) — idle + skip home/academy. */
export function BrandSectionHeaderBlockGate() {
  const pathname = usePathname();
  const shouldMount = shouldMountBrandSectionHeader(pathname);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!shouldMount || typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timer);
  }, [shouldMount]);

  if (!shouldMount || !ready) return null;
  return <BrandSectionHeaderBlock />;
}
