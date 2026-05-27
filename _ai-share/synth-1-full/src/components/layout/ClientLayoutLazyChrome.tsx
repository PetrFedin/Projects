'use client';

import dynamic from 'next/dynamic';
import { User } from 'lucide-react';

export { HubSidebarLazy } from '@/components/hub/HubSidebarLazy';

export { User as ClientHubIcon };

export const ClientAcademySidebarFooter = dynamic(
  () =>
    import('./ClientAcademySidebarFooter').then((m) => ({
      default: m.ClientAcademySidebarFooter,
    })),
  {
    ssr: false,
    loading: () => <div className="mx-1 h-16 animate-pulse rounded-md bg-muted/40" aria-hidden />,
  }
);

export const ClientCabinetSidebarPanel = dynamic(
  () =>
    import('./ClientCabinetSidebarPanel').then((m) => ({
      default: m.ClientCabinetSidebarPanel,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="mx-3 my-4 h-24 animate-pulse rounded-md bg-muted/40" aria-hidden />
    ),
  }
);

export const ClientMobileSidebarSheet = dynamic(
  () =>
    import('./ClientMobileSidebarSheet').then((m) => ({
      default: m.ClientMobileSidebarSheet,
    })),
  { ssr: false }
);
