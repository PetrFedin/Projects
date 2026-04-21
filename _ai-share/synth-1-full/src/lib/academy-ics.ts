import type { AcademyEvent } from '@/lib/types';

function escapeIcsText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/\n/g, '\\n').replace(/,/g, '\\,');
}

/** Скачивание .ics для добавления события в календарь (локально, без сервера). */
export function downloadAcademyEventIcs(event: AcademyEvent, opts?: { url?: string }): void {
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const uid = `${event.id}@syntha-academy`;
  const summary = escapeIcsText(event.title);
  const description = escapeIcsText(event.description);
  const location = opts?.url ? escapeIcsText(opts.url) : '';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Syntha//Academy//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    location ? `LOCATION:${location}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `syntha-${event.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
