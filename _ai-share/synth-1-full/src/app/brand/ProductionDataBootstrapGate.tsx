'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { isBrandProductionPathname } from '@/lib/layout/brand-production-route';

const ProductionDataBootstrap = dynamic(
  () =>
    import('@/providers/production-data-bootstrap').then((m) => ({
      default: m.ProductionDataBootstrap,
    })),
  { ssr: false }
);

/** ProductionDataPort — только `/brand/production/*`, не на всём brand hub. */
export function ProductionDataBootstrapGate() {
  const pathname = usePathname();
  if (!isBrandProductionPathname(pathname)) return null;
  return <ProductionDataBootstrap />;
}
