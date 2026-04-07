/**
 * B2B-Center: Тендеры / аукционы — закупки через торги.
 * РФ-рынок: публикация заявок, подача предложений, выбор победителя.
 */

export type TenderStatus = 'draft' | 'published' | 'bidding' | 'closed' | 'cancelled';

export interface TenderLot {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  /** Ожидаемая цена за единицу (ориентир) */
  estimatedPrice?: number;
  currency: string;
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  organizerName: string;
  status: TenderStatus;
  /** Категория закупки: ткани, фурнитура, готовая одежда, услуги */
  category: string;
  /** География: регион поставки или «вся РФ» */
  region?: string;
  lots: TenderLot[];
  currency: string;
  /** Дедлайн подачи заявок (ISO) */
  bidDeadline: string;
  /** Дата вскрытия конвертов / подведения итогов */
  resultDate?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenderBid {
  id: string;
  tenderId: string;
  supplierId: string;
  supplierName: string;
  lotBids: { lotId: string; price: number; quantity: number; comment?: string }[];
  totalAmount: number;
  currency: string;
  validityDays: number;
  submittedAt: string;
  status: 'submitted' | 'winner' | 'rejected';
}
