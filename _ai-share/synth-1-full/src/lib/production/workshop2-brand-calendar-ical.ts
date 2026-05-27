/**
 * Wave 2 #K4: iCal feed из Workshop2 brand calendar events.
 */
import type { Workshop2BrandCalendarSyncEvent } from '@/lib/production/workshop2-brand-calendar-sync';

function escapeIcalText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function toIcalDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '19700101T090000Z';
  return d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

export function buildWorkshop2BrandCalendarIcalFeed(input: {
  events: Workshop2BrandCalendarSyncEvent[];
  calendarName?: string;
  baseUrl?: string;
}): string {
  const name = input.calendarName ?? 'Workshop2 T&A';
  const base = (input.baseUrl ?? '').replace(/\/$/, '');
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Synth-1//Workshop2 Brand Calendar//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcalText(name)}`,
  ];

  for (const e of input.events) {
    const uid = `${e.id}@workshop2.synth-1`;
    const summary = escapeIcalText(e.title);
    const descParts = [
      `collection=${e.collectionId}`,
      `article=${e.articleId}`,
      e.blockerKind ? `blocker=${e.blockerKind}` : '',
      e.linkedMilestoneId ? `dependsOn=${e.linkedMilestoneId}` : '',
    ].filter(Boolean);
    const description = escapeIcalText(descParts.join(' · '));
    const url = e.href && base ? `${base}${e.href.startsWith('/') ? '' : '/'}${e.href}` : e.href;
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${toIcalDate(new Date().toISOString())}`);
    lines.push(`DTSTART:${toIcalDate(e.startAt)}`);
    lines.push(`DTEND:${toIcalDate(e.endAt)}`);
    lines.push(`SUMMARY:${summary}`);
    if (description) lines.push(`DESCRIPTION:${description}`);
    if (url) lines.push(`URL:${escapeIcalText(url)}`);
    if (e.isBlocker) lines.push('CATEGORIES:Gate blocker');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}
