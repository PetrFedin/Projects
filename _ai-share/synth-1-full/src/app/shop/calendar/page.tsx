'use client';

import StyleCalendar from '@/components/user/style-calendar';
import { RegistryPageShell } from '@/components/design-system';

export default function ShopCalendarPage() {
  return (
    <RegistryPageShell className="space-y-4">
      <StyleCalendar initialRole="shop" />
    </RegistryPageShell>
  );
}
