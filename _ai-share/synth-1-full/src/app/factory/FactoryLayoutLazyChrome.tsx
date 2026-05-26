'use client';

import dynamic from 'next/dynamic';
import { Factory, Warehouse } from 'lucide-react';

export { Factory as FactoryProductionHubIcon, Warehouse as FactorySupplierHubIcon };

function SidebarSkeleton() {
  return (
    <div className="mx-3 my-4 h-24 animate-pulse rounded-md bg-muted/40" aria-hidden />
  );
}

export const FactoryProductionLayoutSidebarPanel = dynamic(
  () =>
    import('./production/FactoryProductionLayoutSidebarPanel').then((m) => ({
      default: m.FactoryProductionLayoutSidebarPanel,
    })),
  { ssr: false, loading: SidebarSkeleton }
);

export const FactorySupplierLayoutSidebarPanel = dynamic(
  () =>
    import('./supplier/FactorySupplierLayoutSidebarPanel').then((m) => ({
      default: m.FactorySupplierLayoutSidebarPanel,
    })),
  { ssr: false, loading: SidebarSkeleton }
);

export const FactoryProductionMobileSidebarSheet = dynamic(
  () =>
    import('./FactoryProductionMobileSidebarSheet').then((m) => ({
      default: m.FactoryProductionMobileSidebarSheet,
    })),
  { ssr: false }
);

export const FactorySupplierMobileSidebarSheet = dynamic(
  () =>
    import('./FactorySupplierMobileSidebarSheet').then((m) => ({
      default: m.FactorySupplierMobileSidebarSheet,
    })),
  { ssr: false }
);
