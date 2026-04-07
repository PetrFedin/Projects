/**
 * Trade Show / Виртуальные выставки (JOOR-style).
 * Сезонные события для байеров: SS26, FW26, инвайты, лимитированный каталог.
 * Связи: Showroom, B2B Orders, Retailers, Linesheets.
 */

export type TradeShowStatus = 'draft' | 'published' | 'live' | 'closed';

export interface TradeShow {
  id: string;
  title: string;
  /** Сезон: SS26, FW26 */
  season: string;
  /** Дата начала и окончания */
  startAt: string;
  endAt: string;
  status: TradeShowStatus;
  /** ID каталога/лайншита, привязанного к выставке */
  linesheetId?: string;
  /** Количество приглашённых байеров */
  invitedCount: number;
  /** Количество заказов, созданных с выставки */
  ordersFromShowCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TradeShowInvite {
  id: string;
  tradeShowId: string;
  retailerId: string;
  retailerName: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined';
  invitedAt: string;
  respondedAt?: string;
}

export const TRADE_SHOW_API = {
  list: '/api/v1/b2b/trade-shows',
  get: '/api/v1/b2b/trade-shows/:id',
  create: '/api/v1/b2b/trade-shows',
  update: '/api/v1/b2b/trade-shows/:id',
  publish: '/api/v1/b2b/trade-shows/:id/publish',
  listInvites: '/api/v1/b2b/trade-shows/:id/invites',
  sendInvites: '/api/v1/b2b/trade-shows/:id/invites/send',
} as const;

/** Список виртуальных выставок. При API — GET TRADE_SHOW_API.list */
export async function listTradeShows(): Promise<TradeShow[]> {
  await new Promise((r) => setTimeout(r, 200));
  const now = new Date().toISOString();
  return [
    {
      id: 'ts-fw26',
      title: 'FW26 Виртуальная выставка',
      season: 'FW26',
      startAt: '2026-01-15T00:00:00Z',
      endAt: '2026-02-15T23:59:59Z',
      status: 'live',
      invitedCount: 42,
      ordersFromShowCount: 18,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ts-ss26',
      title: 'SS26 Виртуальная выставка',
      season: 'SS26',
      startAt: '2026-06-01T00:00:00Z',
      endAt: '2026-06-30T23:59:59Z',
      status: 'published',
      invitedCount: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ts-fw25',
      title: 'FW25 Итоги сезона',
      season: 'FW25',
      startAt: '2025-08-01T00:00:00Z',
      endAt: '2025-09-30T23:59:59Z',
      status: 'closed',
      invitedCount: 28,
      ordersFromShowCount: 12,
      createdAt: now,
      updatedAt: now,
    },
  ];
}
