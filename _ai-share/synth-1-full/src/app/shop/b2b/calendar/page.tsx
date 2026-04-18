'use client';

import StyleCalendar from '@/components/user/style-calendar';
import { RegistryPageShell } from '@/components/design-system';
import { ShopB2bToolHeader } from '@/components/shop/ShopB2bToolHeader';

export default function B2BOrdersCalendarPage() {
  return (
    <RegistryPageShell className="space-y-6">
      <ShopB2bToolHeader
        title="Календарь закупок и поставок"
        description="Контроль B2B-заказов и дат отгрузки в едином интерфейсе."
      />
      <StyleCalendar initialRole="shop" />
    </RegistryPageShell>
  );
}
