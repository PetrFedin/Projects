'use client';

import dynamic from 'next/dynamic';
import { CabinetDesktopOnly } from '@/components/layout/CabinetDesktopOnly';
import {
  ClientDesktopSidebarPlaceholder,
  type ClientDesktopSidebarProps,
} from '@/components/layout/ClientDesktopSidebar';

const ClientDesktopSidebar = dynamic(
  () =>
    import('@/components/layout/ClientDesktopSidebar').then((m) => ({
      default: m.ClientDesktopSidebar,
    })),
  { ssr: false, loading: ClientDesktopSidebarPlaceholder }
);

/** Client desktop sidebar — header + nav в одном chunk (только ≥ lg). */
export function ClientDesktopSidebarGate(props: ClientDesktopSidebarProps) {
  return (
    <CabinetDesktopOnly>
      <ClientDesktopSidebar {...props} />
    </CabinetDesktopOnly>
  );
}
