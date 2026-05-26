'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { shouldMountBrandCenterProvider } from '@/lib/layout/brand-center-route';

const BrandCenterProviderSync = dynamic(
  () =>
    import('@/providers/brand-center-state').then((m) => ({
      default: m.BrandCenterProvider,
    })),
  { ssr: false, loading: () => null }
);

/** Lazy brand-center localStorage state — только `/brand/*`. */
export function BrandCenterProviderGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!shouldMountBrandCenterProvider(pathname)) {
    return children;
  }
  return <BrandCenterProviderSync>{children}</BrandCenterProviderSync>;
}
