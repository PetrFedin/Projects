'use client';

import dynamic from 'next/dynamic';
import { CabinetDesktopOnly } from '@/components/layout/CabinetDesktopOnly';
import type { Resource, Action, PlatformRole } from '@/lib/rbac';
import { ShopDesktopSidebarPlaceholder } from '@/app/shop/ShopDesktopSidebar';

const ShopDesktopSidebar = dynamic(
  () =>
    import('./ShopDesktopSidebar').then((m) => ({
      default: m.ShopDesktopSidebar,
    })),
  { ssr: false, loading: ShopDesktopSidebarPlaceholder }
);

type ShopDesktopSidebarGateProps = {
  role: PlatformRole;
  can: (resource: Resource, action: Action) => boolean;
};

export function ShopDesktopSidebarGate({ role, can }: ShopDesktopSidebarGateProps) {
  return (
    <CabinetDesktopOnly>
      <ShopDesktopSidebar role={role} can={can} />
    </CabinetDesktopOnly>
  );
}
