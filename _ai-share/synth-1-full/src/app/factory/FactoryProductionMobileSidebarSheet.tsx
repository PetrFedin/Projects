'use client';

import { Factory } from 'lucide-react';
import { HubMobileSidebarSheet } from '@/components/layout/HubMobileSidebarSheet';
import { HubSidebarHeader } from '@/components/hub/HubSidebarHeader';
import { FactoryProductionLayoutSidebarPanel } from '@/app/factory/production/FactoryProductionLayoutSidebarPanel';
import { ROUTES } from '@/lib/routes';

type FactoryProductionMobileSidebarSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FactoryProductionMobileSidebarSheet({
  open,
  onOpenChange,
}: FactoryProductionMobileSidebarSheetProps) {
  const header = (
    <HubSidebarHeader
      href={ROUTES.factory.production}
      icon={Factory}
      title="Кабинет производства"
      badge="Производство"
      badgeClass="bg-emerald-50 text-emerald-600"
      iconBgClass="bg-emerald-900"
    />
  );

  return (
    <HubMobileSidebarSheet
      open={open}
      onOpenChange={onOpenChange}
      srTitle="Меню кабинета производства"
      header={header}
    >
      <FactoryProductionLayoutSidebarPanel onNavigate={() => onOpenChange(false)} />
    </HubMobileSidebarSheet>
  );
}
