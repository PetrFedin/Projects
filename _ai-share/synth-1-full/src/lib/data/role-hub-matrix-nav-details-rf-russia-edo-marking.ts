/**
 * Российский контур: темы `rf_edo_accounting`, `rf_marking` (ROLE_HUB_MATRIX).
 */
import type { NavInventoryLine, NavSubsectionEntry } from './role-hub-matrix-nav-details';

function invCore(text: string): NavInventoryLine {
  return { text, core: true };
}

export const RF_EDO_ACCOUNTING_NAV_ADMIN: readonly NavSubsectionEntry[] = [
  {
    label: 'Платформа · учёт и ЭДО',
    detailsBrief: ['Организации', 'Интеграции', 'Операторы ЭДО'],
    detailsInventory: [
      [
        invCore('Реестр кабинетов и потоков ЭДО; маршрутизация между учётными контурами'),
        'Политики КЭП и доверенностей на уровне платформы',
      ],
      ['Мониторинг обмена с учётными системами и очередей документов'],
    ],
  },
];

export const RF_EDO_ACCOUNTING_NAV_BRAND: readonly NavSubsectionEntry[] = [
  {
    label: 'Управление · финансы',
    detailsBrief: ['Учёт РФ', 'ЭДО · КЭП', 'Синхронизация'],
    detailsInventory: [
      [
        invCore('Интеграция с 1С / «МойСклад» / др.: номенклатура, контрагенты, первичка'),
        'Согласование счетов, УПД, исправлений',
      ],
      [
        'Подключение к оператору ЭДО; квалифицированная подпись; роуминг',
      ],
      [
        'Маппинг статей и регламентов закрытия периода под РФ',
      ],
    ],
  },
];

const RF_EDO_SHOP_DIST: readonly NavSubsectionEntry[] = [
  {
    label: 'Управление · финансы',
    detailsBrief: ['Учёт', 'ЭДО', 'Розница · опт'],
    detailsInventory: [
      [
        invCore('Сверка с учётом сети/опта: остатки, себестоимость, НДС'),
        'ЭДО с поставщиками и брендами: УПД, корректировки',
      ],
      ['КЭП и маршруты согласования документов'],
    ],
  },
];

export const RF_EDO_ACCOUNTING_NAV_SHOP = RF_EDO_SHOP_DIST;
export const RF_EDO_ACCOUNTING_NAV_DISTRIBUTOR = RF_EDO_SHOP_DIST;

const RF_EDO_MFG_SUP: readonly NavSubsectionEntry[] = [
  {
    label: 'Управление · финансы',
    detailsBrief: ['Производственный учёт', 'ЭДО', 'Контрагенты'],
    detailsInventory: [
      [
        invCore('Связь выпуска с учётом РФ: номенклатура, партии, УПД'),
        'ЭДО входящее/исходящее с брендом и поставщиками сырья',
      ],
      ['КЭП, доверенности, ответственные за подпись'],
    ],
  },
];

export const RF_EDO_ACCOUNTING_NAV_MANUFACTURER = RF_EDO_MFG_SUP;
export const RF_EDO_ACCOUNTING_NAV_SUPPLIER = RF_EDO_MFG_SUP;

export const RF_MARKING_NAV_ADMIN: readonly NavSubsectionEntry[] = [
  {
    label: 'Каталог · модерация',
    detailsBrief: ['Справочники маркировки', 'Политики'],
    detailsInventory: [
      [
        invCore('Справочники категорий Честный ЗНАК и обязательных атрибутов для кабинетов'),
        'Контроль выгрузок в ГИС МТ на уровне платформы (если применимо)',
      ],
    ],
  },
];

export const RF_MARKING_NAV_BRAND: readonly NavSubsectionEntry[] = [
  {
    label: 'Продукт · ОТК',
    detailsBrief: ['КМ и коды', 'Выгрузки', 'Статусы'],
    detailsInventory: [
      [
        invCore('Привязка SKU к требованиям маркировки: КИ, упаковки, агрегаты'),
        'Выгрузки и статусы кодов в обороте / выбытии',
      ],
      [
        invCore('Согласование этикеток и состава с требованиями ЕАЭС и ЗНАК'),
      ],
    ],
  },
];

export const RF_MARKING_NAV_SHOP: readonly NavSubsectionEntry[] = [
  {
    label: 'Продукт · розница',
    detailsBrief: ['Касса · маркировка', 'Сканирование', 'Списания'],
    detailsInventory: [
      [
        invCore('Продажа маркированного товара: проверка КИ, пробитие чека'),
        'Списания и возвраты в контур ЗНАК',
      ],
    ],
  },
];

export const RF_MARKING_NAV_DISTRIBUTOR: readonly NavSubsectionEntry[] = [
  {
    label: 'Продукт · опт',
    detailsBrief: ['Коды на коробах', 'Транзит', 'Регионы'],
    detailsInventory: [
      [
        invCore('Учёт маркированных остатков на РЦ и у оптовых клиентов'),
        'Передача кодов при отгрузке между хабами',
      ],
    ],
  },
];

export const RF_MARKING_NAV_MANUFACTURER: readonly NavSubsectionEntry[] = [
  {
    label: 'ОТК · производство',
    detailsBrief: ['Выпуск', 'Нанесение КИ', 'Акты'],
    detailsInventory: [
      [
        invCore('Ввод в оборот и эмиссия КИ на производственной линии'),
        'Акты нанесения и брака в контуре ЗНАК',
      ],
    ],
  },
];

export const RF_MARKING_NAV_SUPPLIER: readonly NavSubsectionEntry[] = [
  {
    label: 'Материалы · ОТК',
    detailsBrief: ['Партии', 'Коды', 'Документы'],
    detailsInventory: [
      [
        invCore('Маркировка упаковок и партий под требования бренда и ЗНАК'),
        'Сопроводительные документы для таможни и склада',
      ],
    ],
  },
];
