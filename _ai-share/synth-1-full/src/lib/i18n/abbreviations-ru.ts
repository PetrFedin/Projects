export type AbbreviationKey =
  | 'ROI'
  | 'CLV'
  | 'SKU'
  | 'PO'
  | 'RFM'
  | 'KPI'
  | 'GMV'
  | 'LTV'
  | 'AOV'
  | 'ASN'
  | 'PIM'
  | 'ERP'
  | 'PLM'
  | 'SSO'
  | 'VMI'
  | 'BOM'
  | 'QC'
  | 'MTK'
  | 'KIZ'
  | 'RFID'
  | 'LCA'
  | 'ESG'
  | 'DPP'
  | 'API';

export const ABBREVIATIONS_RU: Record<
  AbbreviationKey,
  { titleRu: string; descriptionRu?: string }
> = {
  ROI: { titleRu: 'Возврат на инвестиции' },
  CLV: { titleRu: 'Пожизненная ценность клиента', descriptionRu: 'Customer Lifetime Value' },
  SKU: { titleRu: 'Складская единица товара' },
  PO: { titleRu: 'Заказ на закупку', descriptionRu: 'Purchase Order' },
  RFM: { titleRu: 'Давность, частота и сумма покупок' },
  KPI: { titleRu: 'Ключевой показатель эффективности' },
  GMV: { titleRu: 'Валовый объём продаж', descriptionRu: 'Gross Merchandise Value' },
  LTV: { titleRu: 'Пожизненная ценность клиента' },
  AOV: { titleRu: 'Средний чек', descriptionRu: 'Average Order Value' },
  ASN: { titleRu: 'Уведомление об отгрузке', descriptionRu: 'Advanced Shipping Notice' },
  PIM: { titleRu: 'Система управления информацией о товарах' },
  ERP: { titleRu: 'Система планирования ресурсов предприятия' },
  PLM: { titleRu: 'Управление жизненным циклом продукта' },
  SSO: { titleRu: 'Единый вход в систему' },
  VMI: { titleRu: 'Управление запасами поставщиком' },
  BOM: { titleRu: 'Ведомость материалов' },
  QC: { titleRu: 'Контроль качества' },
  MTK: { titleRu: 'Маркировка товарного кода' },
  KIZ: { titleRu: 'Код идентификации изделия' },
  RFID: { titleRu: 'Радиочастотная идентификация' },
  LCA: { titleRu: 'Оценка жизненного цикла продукта' },
  ESG: { titleRu: 'Экологические, социальные и управленческие критерии' },
  DPP: { titleRu: 'Цифровой паспорт продукта' },
  API: { titleRu: 'Интерфейс программирования приложений' },
};
