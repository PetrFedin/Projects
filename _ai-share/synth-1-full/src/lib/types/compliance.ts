/**
 * Russian Compliance Layer Types
 * Includes Chestny ZNAK (Marking) and EDO (Electronic Document Flow).
 */

export type EDOStatus = 'draft' | 'sent' | 'received' | 'signed' | 'rejected' | 'archived';

export interface EDODocument {
  id: string;
  type: 'UPD' | 'UKD' | 'Torg12' | 'Invoice'; // УПД, УКД, Торг-12, Счет-фактура
  number: string;
  date: string;
  senderId: string;
  receiverId: string;
  totalAmount: number;
  vatAmount: number;
  currency: 'RUB';
  status: EDOStatus;
  xmlUrl: string; // Ссылка на оригинальный XML (формат ФНС)
  pdfUrl?: string; // Визуальное представление
  items: EDODocumentItem[];
  markingCodes?: string[]; // Список КИЗов, переданных в документе
  externalId?: string; // ID в системе оператора (Диадок, СБИС)
  operator: 'diadoc' | 'sbis' | 'kaluga_astral' | 'other';
}

export interface EDODocumentItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  vatRate: 0 | 10 | 20;
  total: number;
  tnvedCode?: string; // Код ТН ВЭД
}

/**
 * Chestny ZNAK (KIZ - Код Идентификации Заказа)
 */
export type KIZStatus = 'emitted' | 'applied' | 'in_circulation' | 'withdrawn' | 'sold';

export interface ChestnyZNAKCode {
  id: string;
  gtin: string;
  serialNumber: string;
  fullCode: string; // Полный код с криптохвостом
  status: KIZStatus;
  productId: string;
  batchId: string;
  producedAt: string;
  expiryDate?: string;
  ownerId: string; // Текущий владелец (ИНН)
}

export interface MarkingOrder {
  id: string;
  brandId: string;
  factoryId: string;
  productId: string;
  quantity: number;
  gtin: string;
  status: 'pending' | 'processing' | 'ready' | 'downloaded' | 'failed';
  codes: ChestnyZNAKCode[];
  orderedAt: string;
  completedAt?: string;
}

export interface ComplianceConfig {
  inn: string;
  kpp: string;
  ogrn?: string;
  edoProvider: 'diadoc' | 'sbis';
  edoApiKey?: string;
  czToken?: string; // Токен доступа к ЦРПТ
}
