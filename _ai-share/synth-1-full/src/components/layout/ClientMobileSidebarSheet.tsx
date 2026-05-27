'use client';

import type { ReactNode } from 'react';
import { HubMobileSidebarSheet } from '@/components/layout/HubMobileSidebarSheet';
import { HubSidebarHeader } from '@/components/hub/HubSidebarHeader';
import { ClientCabinetSidebarPanel } from '@/components/layout/ClientCabinetSidebarPanel';
import { ROUTES } from '@/lib/routes';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { nuOrderDeskShell } from '@/lib/ui/nuorder-desk-shell';

type ClientMobileSidebarSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientNuOrderHub: boolean;
  profileName: string;
  initials: string;
  photo?: string;
  publicHandle: string;
  academyProfileFooter?: ReactNode;
};

/** Мобильное меню client cabinet — lazy chunk при первом открытии. */
export function ClientMobileSidebarSheet({
  open,
  onOpenChange,
  clientNuOrderHub,
  profileName,
  initials,
  photo,
  publicHandle,
  academyProfileFooter,
}: ClientMobileSidebarSheetProps) {
  const badgeClass = clientNuOrderHub
    ? 'bg-[#4a5fc8]/12 text-[#4a5fc8] border border-[#4a5fc8]/25'
    : 'bg-accent-primary/10 text-accent-primary';
  const iconBgClass = clientNuOrderHub
    ? nuOrderDeskShell.clientCabinetHubIconTile
    : 'bg-accent-primary';

  const header = (
    <HubSidebarHeader
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
      badgeClass={badgeClass}
      iconBgClass={iconBgClass}
    />
  );

  return (
    <HubMobileSidebarSheet
      open={open}
      onOpenChange={onOpenChange}
      srTitle="Меню личного кабинета"
      header={header}
    >
      <div className={cn(clientNuOrderHub && 'border-[#c5ccd6] bg-[#eef0f4]')}>
        <ClientCabinetSidebarPanel
          accentClass={clientNuOrderHub ? 'text-[#4a5fc8]' : 'text-accent-primary'}
          activeBgClass={clientNuOrderHub ? 'bg-[#4a5fc8]' : 'bg-accent-primary'}
          onNavigate={() => onOpenChange(false)}
        />
      </div>
    </HubMobileSidebarSheet>
  );
}
