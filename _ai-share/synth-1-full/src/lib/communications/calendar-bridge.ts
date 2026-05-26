/**
 * Связь демо-агenda (`calendar-events` / EventSource) с операционным календарём (`StyleCalendar` / Layer).
 */
import type { Layer } from '@/lib/types/calendar';
import type { EventSource } from '@/lib/data/calendar-events';

const ALL_LAYERS: Layer[] = [
  'production',
  'buying',
  'events',
  'drops',
  'content',
  'logistics',
  'orders',
  'communications',
  'market',
  'trends',
  'spam',
];

/** Какие слои StyleCalendar включить при фокусе на источнике из agenda. */
export function layersForAgendaSource(source: EventSource): Layer[] {
  const map: Record<EventSource, Layer[]> = {
    production: ['production', 'logistics'],
    orders: ['orders', 'buying'],
    events: ['events', 'drops'],
    tasks: ['communications', 'content'],
    meetings: ['communications', 'events'],
    marketing: ['market', 'events'],
    content: ['content', 'events'],
    finance: ['orders', 'market'],
  };
  return map[source] ?? ['events'];
}

export function buildLayerFocusFilter(sources: EventSource[]): Record<Layer, boolean> {
  const on = new Set<Layer>();
  for (const s of sources) {
    for (const L of layersForAgendaSource(s)) on.add(L);
  }
  const base: Record<Layer, boolean> = {
    production: false,
    buying: false,
    events: false,
    drops: false,
    content: false,
    logistics: false,
    orders: false,
    communications: false,
    market: false,
    trends: false,
    spam: false,
  };
  for (const L of ALL_LAYERS) {
    if (on.has(L)) base[L] = true;
  }
  if (on.size === 0) {
    for (const L of ALL_LAYERS) base[L] = true;
  }
  return base;
}

export function parseAgendaLayersParam(raw: string | null): EventSource[] {
  if (!raw?.trim()) return [];
  const allowed: EventSource[] = [
    'production',
    'orders',
    'events',
    'tasks',
    'meetings',
    'marketing',
    'content',
    'finance',
  ];
  const out: EventSource[] = [];
  for (const part of raw.split(',')) {
    const p = part.trim() as EventSource;
    if (allowed.includes(p)) out.push(p);
  }
  return out;
}
