/**
 * Wave 4 P2 #10: role filter tabs для brand calendar (design / supply / b2b).
 */
import type { CalendarEvent } from '@/lib/types/calendar';

export type Workshop2BrandCalendarRoleTab = 'all' | 'design' | 'supply' | 'b2b';

const DESIGN_RE = /образец|sample|gold|золот|fit|конструк|sketch|эскиз|grading|пример/i;
const SUPPLY_RE = /cut|roll|fabric|lab dip|снабж|материал|dye|okrask|landed|po\b|закуп/i;
const B2B_RE = /showroom|шоурум|b2b|linesheet|кредит|credit|retail|опт/i;

export function classifyWorkshop2CalendarEventRole(
  event: CalendarEvent
): Exclude<Workshop2BrandCalendarRoleTab, 'all'> | null {
  const hay = `${event.title ?? ''} ${event.description ?? ''}`;
  if (B2B_RE.test(hay)) return 'b2b';
  if (SUPPLY_RE.test(hay)) return 'supply';
  if (DESIGN_RE.test(hay)) return 'design';
  if (event.calendarId === 'workshop2') {
    if (event.description?.includes('handoff')) return 'b2b';
    if (event.description?.includes('Gate blocker')) return 'supply';
  }
  return null;
}

export function filterWorkshop2BrandCalendarByRole(
  events: CalendarEvent[],
  tab: Workshop2BrandCalendarRoleTab
): CalendarEvent[] {
  if (tab === 'all') return events;
  return events.filter((e) => {
    const role = classifyWorkshop2CalendarEventRole(e);
    if (!role) return tab === 'design';
    return role === tab;
  });
}

export const WORKSHOP2_BRAND_CALENDAR_ROLE_TABS: Array<{
  id: Workshop2BrandCalendarRoleTab;
  labelRu: string;
}> = [
  { id: 'all', labelRu: 'Все' },
  { id: 'design', labelRu: 'Design' },
  { id: 'supply', labelRu: 'Supply' },
  { id: 'b2b', labelRu: 'B2B' },
];
