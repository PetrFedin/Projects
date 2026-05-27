/**
 * GET — iCal feed Workshop2 T&A + gate blockers для подписки в календаре.
 */
import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2BrandCalendarIcalFeed } from '@/lib/production/workshop2-brand-calendar-ical';
import {
  listAllWorkshop2BrandCalendarEvents,
  listWorkshop2BrandCalendarEventsForCollection,
} from '@/lib/server/workshop2-brand-calendar-repository';

export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim();
  const events = collectionId
    ? await listWorkshop2BrandCalendarEventsForCollection({ collectionId })
    : await listAllWorkshop2BrandCalendarEvents();

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.VERCEL_URL?.trim()?.replace(/^/, 'https://') ||
    '';

  const ical = buildWorkshop2BrandCalendarIcalFeed({
    events,
    calendarName: collectionId ? `Workshop2 T&A · ${collectionId}` : 'Workshop2 Brand Calendar',
    baseUrl: baseUrl || undefined,
  });

  return new NextResponse(ical, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="workshop2-w2-events.ics"',
      'Cache-Control': 'private, max-age=300',
    },
  });
}
