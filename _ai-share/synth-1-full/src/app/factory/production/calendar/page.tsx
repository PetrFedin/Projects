'use client';
import StyleCalendar from '@/components/user/style-calendar';
import { useSearchParams } from 'next/navigation';

export default function FactoryCalendarPage() {
  const searchParams = useSearchParams();
  const activeRole = (searchParams.get('role') as 'manufacturer' | 'supplier') || 'manufacturer';

  return <StyleCalendar initialRole={activeRole} />;
}
