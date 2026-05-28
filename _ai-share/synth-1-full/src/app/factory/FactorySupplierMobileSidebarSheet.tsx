'use client';

import { Warehouse } from 'lucide-react';
import { HubMobileSidebarSheet } from '@/components/layout/HubMobileSidebarSheet';
import { HubSidebarHeader } from '@/components/hub/HubSidebarHeader';
import { FactorySupplierLayoutSidebarPanel } from '@/app/factory/supplier/FactorySupplierLayoutSidebarPanel';
import { ROUTES } from '@/lib/routes';

type FactorySupplierMobileSidebarSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FactorySupplierMobileSidebarSheet({
  open,
  onOpenChange,
}: FactorySupplierMobileSidebarSheetProps) {
  const header = (
    <HubSidebarHeader
      href={ROUTES.factory.supplier}
      icon={Warehouse}
      title="Кабинет поставщика"
      badge="Поставщик"
      badgeClass="bg-emerald-50 text-emerald-600"
      iconBgClass="bg-emerald-900"
    />
  );

  return (
    <HubMobileSidebarSheet
      open={open}
      onOpenChange={onOpenChange}
      srTitle="Меню кабинета поставщика"
      header={header}
    >
      <FactorySupplierLayoutSidebarPanel onNavigate={() => onOpenChange(false)} />
    </HubMobileSidebarSheet>
  );
}
