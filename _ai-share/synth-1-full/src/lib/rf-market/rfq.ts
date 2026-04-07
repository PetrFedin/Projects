/**
 * Alibaba / OroCommerce: RFQ (Request for Quotation) — запрос котировок от поставщиков.
 * Покупатель создаёт запрос, поставщики присылают цены и условия.
 */

export type RfqStatus = 'draft' | 'sent' | 'quotes_received' | 'closed' | 'converted';

export interface RfqLine {
  id: string;
  /** Описание позиции (артикул, название, спецификация) */
  description: string;
  quantity: number;
  unit: string;
  /** Желаемая дата поставки */
  requestedDelivery?: string;
}

export interface RfqRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  title: string;
  lines: RfqLine[];
  /** Список поставщиков, которым отправлен запрос */
  supplierIds: string[];
  status: RfqStatus;
  currency: string;
  /** Срок приёма котировок (ISO) */
  quoteDeadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface RfqQuote {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  lineQuotes: { lineId: string; unitPrice: number; totalPrice: number; leadTimeDays?: number; comment?: string }[];
  totalAmount: number;
  currency: string;
  validityDays: number;
  submittedAt: string;
  status: 'submitted' | 'accepted' | 'rejected';
}
