'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import StyleCalendar from '@/components/user/style-calendar';
import { ShopB2bToolHeader } from '@/components/shop/ShopB2bToolHeader';

export default function B2BOrdersCalendarPage() {
  return (
    <CabinetPageContent maxWidth="5xl" className="space-y-6 px-4 py-6 pb-24 sm:px-6">
      <ShopB2bToolHeader
        title="Календарь закупок и поставок"
        description="Контроль B2B-заказов и дат отгрузки в едином интерфейсе."
      />
      <StyleCalendar initialRole="shop" />
    </CabinetPageContent>
  );
}
