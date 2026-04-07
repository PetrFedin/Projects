/**
 * Buyer Onboarding (JOOR-style).
 * Заявка байера на партнёрство → верификация брендом → доступ к каталогу и заказам.
 * Связи: Retailers, B2B Orders, Showroom, Territory, Credit Risk.
 */

export type BuyerApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface BuyerApplication {
  id: string;
  /** Название компании (ритейлер) */
  companyName: string;
  /** Контактное лицо */
  contactName: string;
  email: string;
  phone?: string;
  /** Страна / регион */
  country: string;
  city?: string;
  /** Тип: ритейлер, дистрибьютор, байер */
  applicantType: 'retailer' | 'distributor' | 'buyer';
  status: BuyerApplicationStatus;
  /** ID созданного партнёра после апрува (retailerId) */
  retailerId?: string;
  /** Комментарий бренда при апруве/отказе */
  brandComment?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export const BUYER_ONBOARDING_API = {
  list: '/api/v1/b2b/buyer-applications',
  get: '/api/v1/b2b/buyer-applications/:id',
  approve: '/api/v1/b2b/buyer-applications/:id/approve',
  reject: '/api/v1/b2b/buyer-applications/:id/reject',
  /** Байер отправляет заявку (с Shop/публичной стороны) */
  submit: '/api/v1/b2b/buyer-applications/submit',
} as const;
