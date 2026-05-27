'use client';

import type { ReactNode } from 'react';
import { User } from 'lucide-react';
import { ClientCabinetSidebarPanel } from '@/components/layout/ClientLayoutLazyChrome';
import { HubSidebarHeaderGate } from '@/components/hub/HubSidebarHeaderGate';
import { ROUTES } from '@/lib/routes';
import { nuOrderDeskShell } from '@/lib/ui/nuorder-desk-shell';

export type ClientDesktopSidebarProps = {
  clientNuOrderHub: boolean;
  profileName: string;
  initials: string;
  photo?: string;
  publicHandle: string;
  academyProfileFooter?: ReactNode;
  accentClass: string;
  activeBgClass: string;
};

/** Desktop client aside — profile header + nav в одном chunk (только ≥ lg). */
export function ClientDesktopSidebar({
  clientNuOrderHub,
  profileName,
  initials,
  photo,
  publicHandle,
  academyProfileFooter,
  accentClass,
  activeBgClass,
}: ClientDesktopSidebarProps) {
  return (
    <>
      <HubSidebarHeaderGate
        href={ROUTES.client.profile}
        icon={User}
        title="Личный кабинет"
        showRole={false}
        profile={{
          name: profileName,
          initials,
          photoURL: photo,
          clientId: publicHandle,
          profileFooter: academyProfileFooter,
        }}
        badgeClass={
          clientNuOrderHub
            ? 'bg-[#4a5fc8]/12 text-[#4a5fc8] border border-[#4a5fc8]/25'
            : 'bg-accent-primary/10 text-accent-primary'
        }
        iconBgClass={
          clientNuOrderHub ? nuOrderDeskShell.clientCabinetHubIconTile : 'bg-accent-primary'
        }
      />
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
        <ClientCabinetSidebarPanel accentClass={accentClass} activeBgClass={activeBgClass} />
      </div>
    </>
  );
}

export function ClientDesktopSidebarPlaceholder() {
  return (
    <div className="flex min-h-0 flex-1 flex-col" aria-hidden>
      <div className="border-border-subtle mx-2 mb-2 h-[72px] animate-pulse rounded-md bg-muted/40" />
      <div className="mx-3 my-4 h-24 animate-pulse rounded-md bg-muted/40" />
    </div>
  );
}
