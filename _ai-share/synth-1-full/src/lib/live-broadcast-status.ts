import type { CmsLive } from '@/data/cms.home.default';

/** Длина эфира по умолчанию, если endsAtISO не задан (2 ч) */
const DEFAULT_SLOT_MS = 2 * 60 * 60 * 1000;

/**
 * Активен ли слот эфира: ручной флаг CMS или окно [startsAt, ends).
 */
export function isLiveEventOnAir(ev: CmsLive, now = Date.now()): boolean {
  if (ev.isOnAir === true) return true;
  const start = new Date(ev.startsAtISO).getTime();
  if (Number.isNaN(start)) return false;
  const end = ev.endsAtISO
    ? new Date(ev.endsAtISO).getTime()
    : start + DEFAULT_SLOT_MS;
  return now >= start && now < end;
}

export function hasActiveLiveBroadcast(events: CmsLive[], now = Date.now()): boolean {
  if (
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_FORCE_LIVE_NAV === '1'
  ) {
    return true;
  }
  return events.some((e) => isLiveEventOnAir(e, now));
}
