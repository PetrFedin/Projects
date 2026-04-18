/**
 * Post-Purchase "Style-Me" Upsell — персональные подборки в мессенджер через 2 дня после покупки.
 * Связи: CRM, заказы, контент. Инфра под API.
 */

export type StyleMeChannel = 'telegram' | 'whatsapp' | 'email' | 'push';

export type StyleMeCampaignStatus = 'draft' | 'active' | 'paused' | 'archived';

export interface StyleMeCampaign {
  id: string;
  name: string;
  /** Дней после покупки для отправки */
  daysAfterPurchase: number;
  channel: StyleMeChannel;
  status: StyleMeCampaignStatus;
  /** Шаблон подборки (productIds или правило) */
  templateId?: string;
  createdAt: string;
}

export interface StyleMeSendLog {
  orderId: string;
  customerId: string;
  campaignId: string;
  sentAt: string;
  opened?: boolean;
}

export const STYLE_ME_UPSELL_API = {
  listCampaigns: '/api/v1/marketing/style-me/campaigns',
  createCampaign: '/api/v1/marketing/style-me/campaigns',
  getStats: '/api/v1/marketing/style-me/stats',
} as const;

/** Список кампаний Style-Me. При API — GET STYLE_ME_UPSELL_API.listCampaigns */
export async function listCampaigns(): Promise<StyleMeCampaign[]> {
  await new Promise((r) => setTimeout(r, 200));
  const now = new Date().toISOString();
  return [
    {
      id: 'sm1',
      name: 'Подборка через 2 дня',
      daysAfterPurchase: 2,
      channel: 'telegram',
      status: 'active',
      createdAt: now,
    },
    {
      id: 'sm2',
      name: 'WhatsApp через 5 дней',
      daysAfterPurchase: 5,
      channel: 'whatsapp',
      status: 'draft',
      createdAt: now,
    },
  ];
}
