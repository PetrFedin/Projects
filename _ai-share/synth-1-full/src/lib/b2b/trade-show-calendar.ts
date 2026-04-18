/**
 * Trade Show Calendar — календарь выставок (CPM, ExpoEcogir и др.).
 */

export interface TradeShowEvent {
  id: string;
  name: string;
  slug?: string;
  startDate: string;
  endDate: string;
  location?: string;
  city?: string;
  /** CPM, ExpoEcogir, Mosshoes и др. */
  type?: string;
  url?: string;
}

const STORAGE_KEY = 'b2b_trade_show_calendar_v1';

const SEED: TradeShowEvent[] = [
  {
    id: 'cpm-2026',
    name: 'CPM Collection Première Moscow',
    startDate: '2026-02-10',
    endDate: '2026-02-13',
    city: 'Москва',
    type: 'CPM',
    slug: 'cpm-feb-2026',
  },
  {
    id: 'expo-2026',
    name: 'ExpoEcogir',
    startDate: '2026-03-15',
    endDate: '2026-03-17',
    city: 'Москва',
    type: 'ExpoEcogir',
    slug: 'expoecogir-2026',
  },
  {
    id: 'mosshoes-2026',
    name: 'Mosshoes',
    startDate: '2026-09-01',
    endDate: '2026-09-04',
    city: 'Москва',
    type: 'Mosshoes',
    slug: 'mosshoes-2026',
  },
];

function load(): TradeShowEvent[] {
  if (typeof window === 'undefined') return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : SEED;
  } catch {
    return SEED;
  }
}

export function getTradeShowEvents(): TradeShowEvent[] {
  return load();
}

export function getTradeShowById(id: string): TradeShowEvent | undefined {
  return load().find((e) => e.id === id);
}

export function getUpcomingEvents(asOfDate?: string): TradeShowEvent[] {
  const date = asOfDate ?? new Date().toISOString().slice(0, 10);
  return load()
    .filter((e) => e.endDate >= date)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}
