/**
 * Pre-Order Quota Management — распределение дефицитных артикулов между дилерами по KPI.
 * Связи: Pre-order, B2B заказы, планирование. Инфра под API.
 */

export type QuotaAllocationStatus = 'draft' | 'published' | 'closed';

export interface SkuQuota {
  skuId: string;
  skuName?: string;
  totalUnits: number;
  /** Распределено по дилерам */
  allocated: { distributorId: string; retailerId?: string; units: number; kpiScore?: number }[];
  reservedFor?: string; // "VIP", "Key account"
}

export interface PreOrderQuotaCampaign {
  id: string;
  title: string;
  season?: string; // SS26, FW26
  dropId?: string;
  status: QuotaAllocationStatus;
  skuQuotas: SkuQuota[];
  createdAt: string;
  publishedAt?: string;
}

export const PRE_ORDER_QUOTA_API = {
  listCampaigns: '/api/v1/distributor/pre-order-quota/campaigns',
  getCampaign: '/api/v1/distributor/pre-order-quota/campaigns/:id',
  allocate: '/api/v1/distributor/pre-order-quota/campaigns/:id/allocate',
  publish: '/api/v1/distributor/pre-order-quota/campaigns/:id/publish',
} as const;

/** Список кампаний квот. При API — GET PRE_ORDER_QUOTA_API.listCampaigns */
export async function listPreOrderQuotaCampaigns(): Promise<PreOrderQuotaCampaign[]> {
  await new Promise((r) => setTimeout(r, 200));
  const now = new Date().toISOString();
  return [
    {
      id: 'pq1',
      title: 'FW26 Drop 1 — дефицитные артикулы',
      season: 'FW26',
      dropId: 'drop1',
      status: 'published',
      skuQuotas: [
        {
          skuId: 'SKU-101',
          skuName: 'Куртка FW26',
          totalUnits: 500,
          allocated: [
            { distributorId: 'D1', units: 200, kpiScore: 0.9 },
            { distributorId: 'D2', units: 150, kpiScore: 0.7 },
            { distributorId: 'D3', units: 150 },
          ],
        },
        {
          skuId: 'SKU-102',
          skuName: 'Платье FW26',
          totalUnits: 300,
          allocated: [
            { distributorId: 'D1', units: 120 },
            { distributorId: 'D2', units: 180, kpiScore: 0.85 },
          ],
        },
      ],
      createdAt: now,
      publishedAt: now,
    },
  ];
}
