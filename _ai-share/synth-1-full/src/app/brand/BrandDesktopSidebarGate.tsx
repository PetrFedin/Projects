'use client';

import dynamic from 'next/dynamic';
import { CabinetDesktopOnly } from '@/components/layout/CabinetDesktopOnly';
import type { useRbac } from '@/hooks/useRbac';
import { BrandDesktopSidebarPlaceholder } from '@/app/brand/BrandDesktopSidebar';

const BrandDesktopSidebar = dynamic(
  () =>
    import('./BrandDesktopSidebar').then((m) => ({
      default: m.BrandDesktopSidebar,
    })),
  { ssr: false, loading: BrandDesktopSidebarPlaceholder }
);

type BrandDesktopSidebarGateProps = {
  role: ReturnType<typeof useRbac>['role'];
  can: ReturnType<typeof useRbac>['can'];
};

/** Brand desktop sidebar — только ≥ lg; mobile использует Sheet. */
export function BrandDesktopSidebarGate({ role, can }: BrandDesktopSidebarGateProps) {
  return (
    <CabinetDesktopOnly>
      <BrandDesktopSidebar role={role} can={can} />
    </CabinetDesktopOnly>
  );
}
