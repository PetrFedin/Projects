'use client';

import { WidgetCard } from '@/components/ui/widget-card';
import { SectionHeader } from '@/components/ui/section-header';
import { RecentOrders } from '@/components/shop';
import { ShoppingBag } from 'lucide-react';
import { RegistryPageShell } from '@/components/design-system';

export default function OrdersPage() {
  return (
    <RegistryPageShell className="space-y-6">
      <SectionHeader
        icon={ShoppingBag}
        title="Розничные заказы"
        description="Все заказы, поступившие от клиентов через платформу Syntha."
      />
      <WidgetCard title="Заказы" description="Список заказов">
        <RecentOrders />
      </WidgetCard>
    </RegistryPageShell>
  );
}
