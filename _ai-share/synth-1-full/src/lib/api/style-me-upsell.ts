/**
 * API-слой Style-Me Upsell по контракту STYLE_ME_UPSELL_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import { STYLE_ME_UPSELL_API } from '@/lib/marketing/style-me-upsell';
import type { StyleMeCampaign } from '@/lib/marketing/style-me-upsell';

const MOCK_CAMPAIGNS: StyleMeCampaign[] = [
  {
    id: 'c1',
    name: 'Через 2 дня — образ под платье',
    daysAfterPurchase: 2,
    channel: 'telegram',
    status: 'active',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'c2',
    name: 'Через 5 дней — аксессуары',
    daysAfterPurchase: 5,
    channel: 'whatsapp',
    status: 'draft',
    createdAt: '2026-03-05T12:00:00Z',
  },
];

export async function listCampaigns(): Promise<StyleMeCampaign[]> {
  try {
    return await get<StyleMeCampaign[]>(STYLE_ME_UPSELL_API.listCampaigns);
  } catch {
    return MOCK_CAMPAIGNS;
  }
}
