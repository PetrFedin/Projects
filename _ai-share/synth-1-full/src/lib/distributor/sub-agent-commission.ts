/**
 * Sub-Agent Commission Dash — расчёт комиссий торговых представителей.
 * Связи: партнёры, финансы, дистрибуция. Инфра под API.
 */

export type CommissionStatus = 'pending' | 'approved' | 'paid';

export interface SubAgent {
  id: string;
  name: string;
  region?: string;
  /** Процент или формула */
  commissionRate?: number;
}

/** Zedonk: комиссия по заказу или по строке */
export type CommissionType = 'per_order' | 'per_line';

export interface CommissionRecord {
  id: string;
  subAgentId: string;
  subAgentName: string;
  period: string;         // "2026-03", "2026-Q1"
  orderIds: string[];
  revenueRub: number;
  commissionRub: number;
  status: CommissionStatus;
  paidAt?: string;
  /** Zedonk: расчёт по заказу целиком или по строке заказа */
  commissionType?: CommissionType;
}

export const SUB_AGENT_COMMISSION_API = {
  listAgents: '/api/v1/distributor/commissions/agents',
  listRecords: '/api/v1/distributor/commissions/records',
  approve: '/api/v1/distributor/commissions/records/:id/approve',
  markPaid: '/api/v1/distributor/commissions/records/:id/paid',
} as const;

/** Список записей комиссий. При API — GET SUB_AGENT_COMMISSION_API.listRecords */
export async function listCommissionRecords(): Promise<CommissionRecord[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [
    { id: 'cr1', subAgentId: 'sa1', subAgentName: 'Иванов И.', period: '2026-03', orderIds: ['B2B-0010', 'B2B-0011'], revenueRub: 1_200_000, commissionRub: 36_000, status: 'approved', commissionType: 'per_order' },
    { id: 'cr2', subAgentId: 'sa2', subAgentName: 'Петрова А.', period: '2026-03', orderIds: ['B2B-0012'], revenueRub: 750_000, commissionRub: 22_500, status: 'pending', commissionType: 'per_line' },
    { id: 'cr3', subAgentId: 'sa1', subAgentName: 'Иванов И.', period: '2026-Q1', orderIds: ['B2B-0008', 'B2B-0009'], revenueRub: 2_100_000, commissionRub: 63_000, status: 'paid', paidAt: '2026-04-05', commissionType: 'per_order' },
  ];
}
