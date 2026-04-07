import type {
  PartnerAssortmentMatrixRow,
  PartnerDamPolicyRow,
  PartnerFactorySample,
  PartnerMarkdownHint,
  PartnerMarketplaceIssue,
} from './types';

export const PARTNER_ASSORTMENT_MATRIX_ROWS: PartnerAssortmentMatrixRow[] = [
  { channel: 'Розница RU', sku: 'SYN-K001', color: 'Чёрный', sizes: 'XS–L', status: 'Утверждено', sellThrough: '72%', season: 'SS26', lastSync: '2026-03-28' },
  { channel: 'WB', sku: 'SYN-K001', color: 'Чёрный', sizes: 'S–XL', status: 'На согласовании', sellThrough: '—', season: 'SS26', lastSync: '2026-03-29' },
  { channel: 'Ozon', sku: 'SYN-K001', color: 'Чёрный', sizes: 'S–L', status: 'Утверждено', sellThrough: '61%', season: 'SS26', lastSync: '2026-03-27' },
  { channel: 'Outlet', sku: 'SYN-H005', color: 'Серый', sizes: 'M–XL', status: 'Черновик', sellThrough: '48%', season: 'FW25', lastSync: '2026-03-20' },
  { channel: 'B2B шоурум', sku: 'SYN-A003', color: 'Navy', sizes: 'EU 36–44', status: 'Утверждено', sellThrough: '55%', season: 'SS26', lastSync: '2026-03-29' },
  { channel: 'Дьютти фри', sku: 'SYN-P002', color: 'Белый', sizes: 'S–XL', status: 'Стоп по MOQ', sellThrough: '33%', season: 'SS26', lastSync: '2026-03-25' },
];

export const PARTNER_MARKDOWN_HINTS: PartnerMarkdownHint[] = [
  { sku: 'SYN-A003', reason: 'Остаток > 90 дней', action: 'Скидка −15% или перенос в outlet', confidence: 'rule', region: 'ALL', channel: 'Розница' },
  { sku: 'SYN-P002', reason: 'Низкая оборачиваемость в регионе Ural', action: 'Локальный промокод −10% / 14 дн.', confidence: 'ml_stub', region: 'Ural', channel: 'WB' },
  { sku: 'SYN-K001', reason: 'Перекрытие с маркетинговой акцией конкурента', action: 'Сдвиг промо-окна на неделю', confidence: 'manual', region: 'ЦФО', channel: 'Ozon' },
  { sku: 'SYN-H005', reason: 'Риск сезонного списания FW25', action: 'Bundle 2=−20% в outlet', confidence: 'rule', channel: 'Outlet' },
];

export const PARTNER_FACTORY_SAMPLES: PartnerFactorySample[] = [
  { id: 'S-101', style: 'SS26-JKT-01', status: 'QC фото загружены', issue: '—', dueAt: '2026-04-02', poRef: 'PO-88421' },
  { id: 'S-102', style: 'SS26-PNT-02', status: 'Отклонение', issue: 'Шов шагового метра +2 мм к tech pack', dueAt: '2026-04-05', poRef: 'PO-88422' },
  { id: 'S-103', style: 'SS26-KNT-04', status: 'На проверке', issue: 'Ожидаем образец этикетки состава', dueAt: '2026-04-08', poRef: 'PO-88430' },
  { id: 'S-104', style: 'SS26-ACC-09', status: 'Одобрено', issue: '—', dueAt: '2026-03-30', poRef: 'PO-88399' },
];

export const PARTNER_MARKETPLACE_ISSUES: PartnerMarketplaceIssue[] = [
  { marketplace: 'Wildberries', region: 'ЦФО', sku: 'SYN-K001', problem: 'Пустой TN ВЭД', severity: 'high', fixHint: 'Подтянуть из PIM → выгрузка ночью' },
  { marketplace: 'Ozon', region: 'Урал', sku: 'SYN-P002', problem: 'Несовпадение цвета с PIM', severity: 'med', fixHint: 'Сверить color_hex с карточкой' },
  { marketplace: 'WB', region: 'СЗФО', sku: 'SYN-A003', problem: 'Фото 3:4 урезано — нарушение гайда', severity: 'low', fixHint: 'Перезалить из DAM master' },
  { marketplace: 'Я.Маркет', region: 'Юг', sku: 'SYN-H005', problem: 'Отсутствует сертификат для детской линии', severity: 'high', fixHint: 'Прикрепить PDF из compliance' },
];

export const PARTNER_DAM_POLICIES: PartnerDamPolicyRow[] = [
  { id: 'wm-outlet', label: 'Watermark для аутлет-канала', enabled: true, scope: 'Все lookbook JPEG' },
  { id: 'buyer-dl', label: 'Скачивание только для верифиц. байеров', enabled: true, scope: 'SS26 campaign' },
  { id: 'license-30', label: 'Напоминание об истечении лицензии фото (30 дн.)', enabled: false, scope: 'External photographers' },
  { id: 'mp-derivative', label: 'Запрет кропа для МП без вторичной лицензии', enabled: true, scope: 'WB / Ozon feeds' },
];

/** Единый снимок для копирования в презентацию / будущий import API */
export function buildPartnerDemoSnapshot() {
  return {
    generatedAt: new Date().toISOString(),
    assortmentMatrix: PARTNER_ASSORTMENT_MATRIX_ROWS,
    markdownHints: PARTNER_MARKDOWN_HINTS,
    factorySamples: PARTNER_FACTORY_SAMPLES,
    marketplaceIssues: PARTNER_MARKETPLACE_ISSUES,
    damPolicies: PARTNER_DAM_POLICIES,
  };
}
