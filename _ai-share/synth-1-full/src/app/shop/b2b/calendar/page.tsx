'use client';

import StyleCalendar from '@/components/user/style-calendar';
<<<<<<< HEAD
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function B2BOrdersCalendarPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-base font-black uppercase tracking-tighter text-slate-800">
          Календарь закупок и поставок
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Контроль B2B-заказов и дат отгрузки в едином интерфейсе.
        </p>
      </header>
      <StyleCalendar initialRole="shop" />
    </div>
=======
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
>>>>>>> recover/cabinet-wip-from-stash
  );
}
