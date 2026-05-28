'use client';

import { HubSidebarLazy } from '@/components/hub/HubSidebarLazy';
import { clientNavGroups } from '@/lib/data/client-navigation';
import { ROUTES } from '@/lib/routes';

type ClientCabinetSidebarPanelProps = {
  accentClass: string;
  activeBgClass: string;
  onNavigate?: () => void;
};

/** clientNavGroups + HubSidebar — отдельный chunk от client cabinet shell. */
export function ClientCabinetSidebarPanel({
  accentClass,
  activeBgClass,
  onNavigate,
}: ClientCabinetSidebarPanelProps) {
  return (
    <HubSidebarLazy
      groups={clientNavGroups}
      basePath={ROUTES.client.home}
      ariaLabel="Клиентское меню"
      accentClass={accentClass}
      activeBgClass={activeBgClass}
      onNavigate={onNavigate}
    />
  );
}
