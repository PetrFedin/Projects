/**
 * API-слой Pre-Order Quota по контракту PRE_ORDER_QUOTA_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import { PRE_ORDER_QUOTA_API } from '@/lib/distributor/pre-order-quota';
import type { PreOrderQuotaCampaign } from '@/lib/distributor/pre-order-quota';

const MOCK_CAMPAIGNS: PreOrderQuotaCampaign[] = [
  {
    id: 'q1',
    title: 'SS26 Pre — дефицитные артикулы',
    season: 'SS26',
    status: 'published',
    createdAt: '2026-03-01T10:00:00Z',
    publishedAt: '2026-03-05T09:00:00Z',
    skuQuotas: [
      { skuId: 'SKU-201', skuName: 'Парка Limited', totalUnits: 200, allocated: [{ distributorId: 'D01', units: 80, kpiScore: 92 }, { distributorId: 'D02', units: 60, kpiScore: 78 }, { distributorId: 'D03', units: 60, kpiScore: 65 }] },
      { skuId: 'SKU-202', skuName: 'Куртка Urban', totalUnits: 150, allocated: [{ distributorId: 'D01', units: 70 }, { distributorId: 'D02', units: 80 }] },
    ],
  },
];

export async function listCampaigns(): Promise<PreOrderQuotaCampaign[]> {
  try {
    return await get<PreOrderQuotaCampaign[]>(PRE_ORDER_QUOTA_API.listCampaigns);
  } catch {
    return MOCK_CAMPAIGNS;
  }
}

export async function getCampaign(id: string): Promise<PreOrderQuotaCampaign | null> {
  try {
    return await get<PreOrderQuotaCampaign>(PRE_ORDER_QUOTA_API.getCampaign.replace(':id', id));
  } catch {
    return MOCK_CAMPAIGNS.find((c) => c.id === id) ?? MOCK_CAMPAIGNS[0] ?? null;
  }
}
