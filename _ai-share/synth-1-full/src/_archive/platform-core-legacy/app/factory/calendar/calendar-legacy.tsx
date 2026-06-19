'use client';

import { useSearchParams } from 'next/navigation';
import StyleCalendar from '@/components/user/style-calendar';

export function FactoryCalendarLegacyPage() {
  const searchParams = useSearchParams();
  const activeRole = (searchParams.get('role') as 'manufacturer' | 'supplier') || 'manufacturer';
  return <StyleCalendar initialRole={activeRole} />;
}
