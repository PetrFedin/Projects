/**
 * API-слой Sub-Agent Commission по контракту SUB_AGENT_COMMISSION_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import { SUB_AGENT_COMMISSION_API } from '@/lib/distributor/sub-agent-commission';
import type { CommissionRecord, SubAgent } from '@/lib/distributor/sub-agent-commission';

const MOCK_RECORDS: CommissionRecord[] = [
  { id: 'c1', subAgentId: 'sa1', subAgentName: 'Иванов П.С.', period: '2026-03', orderIds: ['ORD-101', 'ORD-102'], revenueRub: 450_000, commissionRub: 22_500, status: 'approved', commissionType: 'per_order' },
  { id: 'c2', subAgentId: 'sa2', subAgentName: 'Петрова А.В.', period: '2026-03', orderIds: ['ORD-103'], revenueRub: 180_000, commissionRub: 9_000, status: 'pending', commissionType: 'per_line' },
];

const MOCK_AGENTS: SubAgent[] = [
  { id: 'sa1', name: 'Иванов П.С.', region: 'ЦФО', commissionRate: 5 },
  { id: 'sa2', name: 'Петрова А.В.', region: 'СЗФО', commissionRate: 5 },
];

export async function listRecords(): Promise<CommissionRecord[]> {
  try {
    return await get<CommissionRecord[]>(SUB_AGENT_COMMISSION_API.listRecords);
  } catch {
    return MOCK_RECORDS;
  }
}

export async function listAgents(): Promise<SubAgent[]> {
  try {
    return await get<SubAgent[]>(SUB_AGENT_COMMISSION_API.listAgents);
  } catch {
    return MOCK_AGENTS;
  }
}
