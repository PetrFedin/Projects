'use client';

import { WidgetCard } from '@/components/ui/widget-card';
import { SectionHeader } from '@/components/ui/section-header';
import { RecentOrders } from '@/components/shop';
import { ShoppingBag } from 'lucide-react';
<<<<<<< HEAD

export default function OrdersPage() {
  return (
    <div className="space-y-6">
=======
import { RegistryPageShell } from '@/components/design-system';

export default function OrdersPage() {
  return (
    <RegistryPageShell className="space-y-6">
>>>>>>> recover/cabinet-wip-from-stash
      <SectionHeader
        icon={ShoppingBag}
        title="Розничные заказы"
        description="Все заказы, поступившие от клиентов через платформу Syntha."
      />
      <WidgetCard title="Заказы" description="Список заказов">
        <RecentOrders />
      </WidgetCard>
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
