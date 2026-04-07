/**
 * POS BNPL Gateway — оформление рассрочки на кассе. РФ: Тинькофф, Сбер, и др.
 * Связи: Финансы, заказы, Compliance. Инфра под API.
 */

export type BnplProvider = 'tinkoff' | 'sber' | 'other';

export type BnplStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface BnplOffer {
  provider: BnplProvider;
  installments: number;
  amountRub: number;
  monthlyPaymentRub: number;
  approved: boolean;
}

export interface BnplTransaction {
  id: string;
  orderId: string;
  provider: BnplProvider;
  amountRub: number;
  status: BnplStatus;
  createdAt: string;
  externalId?: string;
}

export const BNPL_GATEWAY_API = {
  getOffers: '/api/v1/shop/bnpl/offers',
  createApplication: '/api/v1/shop/bnpl/apply',
  getStatus: '/api/v1/shop/bnpl/transactions/:id',
} as const;
