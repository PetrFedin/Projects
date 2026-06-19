'use client';

import { useSearchParams } from 'next/navigation';
import StyleCalendar from '@/components/user/style-calendar';

export function FactoryProductionCalendarLegacyPage() {
  const searchParams = useSearchParams();
  const activeRole = (searchParams.get('role') as 'manufacturer' | 'supplier') || 'manufacturer';
  return (
    <div className="space-y-4 p-4">
      <StyleCalendar initialRole={activeRole} />
    </div>
  );
}
