/**
 * RepSpark: Custom Assortments — персональный ассортимент под ритейлера.
 * Бренд формирует подборку SKU/коллекций для конкретного партнёра.
 */

export interface CustomAssortment {
  id: string;
  retailerId: string;
  retailerName: string;
  brandId: string;
  /** Название подборки */
  name: string;
  /** productIds или styleIds */
  productIds: string[];
  /** Коллекции (Early Bird, VIP и т.д.) — фильтр вместо явного списка */
  collectionIds?: string[];
  /** Доп. скидки/условия для этой подборки */
  discountPercent?: number;
  /** Срок действия подборки */
  validFrom: string;
  validTo: string;
  /** Заметки для байера */
  notes?: string;
  updatedAt: string;
}

export interface AssortmentAssignment {
  retailerId: string;
  assortmentId: string;
  assignedBy: string;
  assignedAt: string;
}
