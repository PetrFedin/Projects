/**
 * API-слой Buyer Onboarding (JOOR-style) по контракту BUYER_ONBOARDING_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get, post } from './client';
import { BUYER_ONBOARDING_API } from '@/lib/b2b/buyer-onboarding';
import type { BuyerApplication } from '@/lib/b2b/buyer-onboarding';

export interface SubmitBuyerApplicationPayload {
  brandId?: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  city?: string;
  applicantType: BuyerApplication['applicantType'];
  message?: string;
}

const MOCK_APPLICATIONS: BuyerApplication[] = [
  { id: 'ba1', companyName: 'ООО Ритейл Стиль', contactName: 'Анна Петрова', email: 'anna@retail-style.ru', phone: '+7 495 123-45-67', country: 'Россия', city: 'Москва', applicantType: 'retailer', status: 'pending', submittedAt: '2026-03-10T14:00:00Z' },
  { id: 'ba2', companyName: 'Fashion Boutique SPb', contactName: 'Иван Сидоров', email: 'ivan@fb-spb.ru', country: 'Россия', city: 'Санкт-Петербург', applicantType: 'retailer', status: 'under_review', submittedAt: '2026-03-09T11:00:00Z' },
  { id: 'ba3', companyName: 'Distributor CIS', contactName: 'Мария Козлова', email: 'maria@dist-cis.com', country: 'Казахстан', applicantType: 'distributor', status: 'approved', retailerId: 'ret-003', submittedAt: '2026-03-05T09:00:00Z', reviewedAt: '2026-03-07T16:00:00Z', reviewedBy: 'brand@syntha.ai' },
];

export async function listBuyerApplications(): Promise<BuyerApplication[]> {
  try {
    return await get<BuyerApplication[]>(BUYER_ONBOARDING_API.list);
  } catch {
    return MOCK_APPLICATIONS;
  }
}

export async function getBuyerApplication(id: string): Promise<BuyerApplication | null> {
  try {
    return await get<BuyerApplication>(BUYER_ONBOARDING_API.get.replace(':id', id));
  } catch {
    return MOCK_APPLICATIONS.find((a) => a.id === id) ?? null;
  }
}

export async function submitBuyerApplication(payload: SubmitBuyerApplicationPayload): Promise<BuyerApplication> {
  try {
    return await post<BuyerApplication>(BUYER_ONBOARDING_API.submit, payload);
  } catch {
    return {
      id: `ba-${Date.now()}`,
      ...payload,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
  }
}

/** JOOR/Zedonk: одобрить заявку байера — доступ к каталогу и заказам */
export async function approveBuyerApplication(id: string, brandComment?: string): Promise<BuyerApplication> {
  try {
    return await post<BuyerApplication>(BUYER_ONBOARDING_API.approve.replace(':id', id), { brandComment });
  } catch {
    const app = MOCK_APPLICATIONS.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    return { ...app, status: 'approved', retailerId: app.retailerId ?? `ret-${id}`, reviewedAt: new Date().toISOString(), reviewedBy: 'brand', brandComment };
  }
}

/** JOOR/Zedonk: отклонить заявку с опциональным комментарием */
export async function rejectBuyerApplication(id: string, brandComment?: string): Promise<BuyerApplication> {
  try {
    return await post<BuyerApplication>(BUYER_ONBOARDING_API.reject.replace(':id', id), { brandComment });
  } catch {
    const app = MOCK_APPLICATIONS.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    return { ...app, status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: 'brand', brandComment };
  }
}
