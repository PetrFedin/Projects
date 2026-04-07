import { NextResponse } from 'next/server';
import { ALL_CALENDAR_EVENTS } from '@/lib/data/calendar-events';
import type { EventSource } from '@/lib/data/calendar-events';

const LAYERS: EventSource[] = ['production', 'orders', 'events', 'tasks', 'meetings', 'marketing', 'content', 'finance'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const layersParam = searchParams.get('layers');
  const layers = layersParam
    ? layersParam.split(',').filter((s): s is EventSource => LAYERS.includes(s as EventSource))
    : LAYERS;
  const evs = ALL_CALENDAR_EVENTS.filter(e => layers.includes(e.source));
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Brand Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...evs.flatMap(e => {
      const date = `2026-01-${String(e.d).padStart(2, '0')}`;
      const start = e.startTime ? `${date.replace(/-/g, '')}T${e.startTime.replace(':', '')}00` : date.replace(/-/g, '');
      const end = e.endTime ? `${date.replace(/-/g, '')}T${e.endTime.replace(':', '')}00` : date.replace(/-/g, '');
      return [
        'BEGIN:VEVENT',
        `DTSTART:${start.length === 8 ? 'VALUE=DATE:' + start : start}`,
        `DTEND:${end.length === 8 ? 'VALUE=DATE:' + end : end}`,
        `SUMMARY:${(e.t || '').replace(/\n/g, '\\n')}`,
        e.timezone ? `TZID:${e.timezone}` : null,
        'END:VEVENT',
      ].filter(Boolean);
    }),
    'END:VCALENDAR',
  ].join('\r\n');

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="brand-calendar.ics"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
