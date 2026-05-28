/**
 * API-слой Trade Show (JOOR-style) по контракту TRADE_SHOW_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import { TRADE_SHOW_API } from '@/lib/b2b/trade-show';
import type { TradeShow } from '@/lib/b2b/trade-show';

const MOCK_SHOWS: TradeShow[] = [
  {
    id: 'ts1',
    title: 'SS26 Wholesale Preview',
    season: 'SS26',
    startAt: '2026-03-15T09:00:00Z',
    endAt: '2026-03-22T18:00:00Z',
    status: 'live',
    invitedCount: 24,
    ordersFromShowCount: 12,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-11T08:00:00Z',
  },
  {
    id: 'ts2',
    title: 'FW26 Early Bird',
    season: 'FW26',
    startAt: '2026-06-01T09:00:00Z',
    endAt: '2026-06-14T18:00:00Z',
    status: 'published',
    invitedCount: 0,
    createdAt: '2026-03-10T12:00:00Z',
    updatedAt: '2026-03-10T12:00:00Z',
  },
];

export async function listTradeShows(): Promise<TradeShow[]> {
  try {
    return await get<TradeShow[]>(TRADE_SHOW_API.list);
  } catch {
    return MOCK_SHOWS;
  }
}

export async function getTradeShow(id: string): Promise<TradeShow | null> {
  try {
    return await get<TradeShow>(TRADE_SHOW_API.get.replace(':id', id));
  } catch {
    return MOCK_SHOWS.find((s) => s.id === id) ?? null;
  }
}
