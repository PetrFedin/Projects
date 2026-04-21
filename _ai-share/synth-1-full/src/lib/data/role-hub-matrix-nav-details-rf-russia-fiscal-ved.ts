/**
 * Российский контур: темы `rf_cash_fiscal`, `rf_customs`, `rf_regulatory_reporting` (ROLE_HUB_MATRIX).
 */
import type { NavInventoryLine, NavSubsectionEntry } from './role-hub-matrix-nav-details';

function invCore(text: string): NavInventoryLine {
  return { text, core: true };
}

export const RF_CASH_FISCAL_NAV_ADMIN: readonly NavSubsectionEntry[] = [
  {
    label: 'Коммерция',
    detailsBrief: ['Кассовые сценарии', 'Эквайринг'],
    detailsInventory: [
      [
        invCore('Интеграции с фискальными провайдерами и ОФД (агрегировано по платформе)'),
        'Мониторинг фискализации транзакций кабинетов',
      ],
    ],
  },
];

export const RF_CASH_FISCAL_NAV_BRAND: readonly NavSubsectionEntry[] = [
  {
    label: 'Заказы · финансы',
    detailsBrief: ['DTC · касса', 'Эквайринг', 'Отчёты'],
    detailsInventory: [
      [
        invCore('Пробитие чеков по B2C-заказам; 54-ФЗ; онлайн-касса'),
        'Сверка эквайринга и выручки',
      ],
    ],
  },
];

export const RF_CASH_FISCAL_NAV_SHOP: readonly NavSubsectionEntry[] = [
  {
    label: 'Розница · финансы',
    detailsBrief: ['ККТ', 'Эквайринг', 'Смены'],
    detailsInventory: [
      [
        invCore('ФР и ККТ: регистрация, смены, Z-отчёты; передача в ОФД'),
        'Интеграция с эквайрингом НСПК / банков РФ',
      ],
      ['Контроль расхождений кассы и инкассации'],
    ],
  },
];

const RF_CASH_DIST_MFG_SUP: readonly NavSubsectionEntry[] = [
  {
    label: 'Финансы · заказы',
    detailsBrief: ['Оплаты', 'Счета-фактуры', 'Контроль'],
    detailsInventory: [
      [
        invCore('Фискальные и нефискальные оплаты по договорам; УПД и чеки при необходимости'),
        'Сверка с учётом и кассовым планом',
      ],
    ],
  },
];

export const RF_CASH_FISCAL_NAV_DISTRIBUTOR = RF_CASH_DIST_MFG_SUP;
export const RF_CASH_FISCAL_NAV_MANUFACTURER = RF_CASH_DIST_MFG_SUP;
export const RF_CASH_FISCAL_NAV_SUPPLIER = RF_CASH_DIST_MFG_SUP;

export const RF_CUSTOMS_NAV_ADMIN: readonly NavSubsectionEntry[] = [
  {
    label: 'Справочники',
    detailsBrief: ['ТН ВЭД', 'Страны', 'Лицензии'],
    detailsInventory: [
      [
        invCore('Справочники для таможенной классификации и ограничений по категориям'),
      ],
    ],
  },
];

export const RF_CUSTOMS_NAV_BRAND: readonly NavSubsectionEntry[] = [
  {
    label: 'Логистика · заказы',
    detailsBrief: ['Импорт', 'Декларации', 'Поставки'],
    detailsInventory: [
      [
        invCore('Импортные заказы: инвойсы, контракты, ГТД, сроки выпуска'),
        'Связь таможенного статуса с логистикой и оплатой',
      ],
    ],
  },
];

export const RF_CUSTOMS_NAV_SHOP: readonly NavSubsectionEntry[] = [
  {
    label: 'Закупки · B2B',
    detailsBrief: ['Импорт', 'Поставки', 'Документы'],
    detailsInventory: [
      [
        invCore('Импортные поставки в сеть: таможня, РЦ, сроки'),
        'Документы для списания и учёта',
      ],
    ],
  },
];

export const RF_CUSTOMS_NAV_DISTRIBUTOR: readonly NavSubsectionEntry[] = [
  {
    label: 'Логистика · заказы',
    detailsBrief: ['ВЭД', 'Таможня', 'Отгрузки'],
    detailsInventory: [
      [
        invCore('Оптовый импорт: ГТД, транзит, ответственность за коды и партии'),
        'Связь с логистикой и складом РФ',
      ],
    ],
  },
];

export const RF_CUSTOMS_NAV_MANUFACTURER: readonly NavSubsectionEntry[] = [
  {
    label: 'Материалы · заказы',
    detailsBrief: ['Импорт сырья', 'Декларации', 'Поставки'],
    detailsInventory: [
      [
        invCore('Ввоз материалов и комплектующих: таможенные платежи, сроки, сертификаты'),
        'Связь партий с производственным заказом',
      ],
    ],
  },
];

export const RF_CUSTOMS_NAV_SUPPLIER: readonly NavSubsectionEntry[] = [
  {
    label: 'Поставки · заказы',
    detailsBrief: ['Экспорт · импорт', 'Документы'],
    detailsInventory: [
      [
        invCore('Поставки через границу: инвойсы, упаковки, соответствие ТН ВЭД'),
        'Сопровождение клиента при ввозе сырья',
      ],
    ],
  },
];

export const RF_REGULATORY_REPORTING_NAV_ADMIN: readonly NavSubsectionEntry[] = [
  {
    label: 'Коммерция · система',
    detailsBrief: ['Реготчётность', 'Налоговый мониторинг', 'Аудит'],
    detailsInventory: [
      [
        invCore('Агрегированные регламентированные отчёты по кабинетам (по политике доступа)'),
        'Журналы для налогового и операционного аудита',
      ],
    ],
  },
];

const RF_REG_BRAND_SHOP_DIST: readonly NavSubsectionEntry[] = [
  {
    label: 'Аналитика · финансы',
    detailsBrief: ['Реготчётность', 'НДС', 'Контроль'],
    detailsInventory: [
      [
        invCore('Выгрузки в форматах учёта РФ: книги покупок/продаж, декларации (интеграция)'),
        'Сверка управленческой и регламентированной отчётности',
      ],
      [
        'Контрольные соотношения и замечания перед сдачей отчётности',
      ],
    ],
  },
];

export const RF_REGULATORY_REPORTING_NAV_BRAND = RF_REG_BRAND_SHOP_DIST;
export const RF_REGULATORY_REPORTING_NAV_SHOP = RF_REG_BRAND_SHOP_DIST;
export const RF_REGULATORY_REPORTING_NAV_DISTRIBUTOR = RF_REG_BRAND_SHOP_DIST;

const RF_REG_MFG_SUP: readonly NavSubsectionEntry[] = [
  {
    label: 'Аналитика · финансы',
    detailsBrief: ['Производственный учёт', 'НДС', 'Реготчётность'],
    detailsInventory: [
      [
        invCore('Распределение затрат и НДС по производственным заказам под РФ'),
        'Выгрузки для бухгалтерии и налоговой отчётности',
      ],
    ],
  },
];

export const RF_REGULATORY_REPORTING_NAV_MANUFACTURER = RF_REG_MFG_SUP;
export const RF_REGULATORY_REPORTING_NAV_SUPPLIER = RF_REG_MFG_SUP;
