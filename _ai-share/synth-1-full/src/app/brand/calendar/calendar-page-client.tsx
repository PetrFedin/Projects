'use client';

import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { BrandCalendarCorePage } from '@/app/brand/calendar/calendar-core';
import type { CalendarEvent } from '@/lib/types/calendar';

const BrandCalendarLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/brand/calendar/calendar-legacy').then(
      (m) => m.BrandCalendarLegacyPage
    ),
  { ssr: false }
);

export function BrandCalendarPageClient({
  initialB2bEvents,
}: {
  initialB2bEvents?: CalendarEvent[];
}) {
  if (isPlatformCoreMode()) {
    return <BrandCalendarCorePage initialB2bEvents={initialB2bEvents} />;
  }
  return <BrandCalendarLegacyPage />;
}
