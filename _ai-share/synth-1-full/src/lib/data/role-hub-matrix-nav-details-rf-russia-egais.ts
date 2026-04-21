/**
 * Тема `rf_egais_alcohol` — ROLE_HUB_MATRIX, фаза rf_russia.
 */
import type { NavInventoryLine, NavSubsectionEntry } from './role-hub-matrix-nav-details';

function invCore(text: string): NavInventoryLine {
  return { text, core: true };
}

export const RF_EGAIS_ALCOHOL_NAV_ADMIN: readonly NavSubsectionEntry[] = [
  {
    label: 'Коммерция и транзакции',
    detailsBrief: ['ЕГАИС', 'Оборот'],
    detailsInventory: [
      [
        invCore('Политики и флаги для категорий с обязательным учётом в ЕГАИС (при включении)'),
      ],
    ],
  },
  {
    label: 'Каталог и справочники',
    detailsBrief: ['Алкоголь', 'Коды'],
    detailsInventory: [
      [
        'Справочники типов продукции и соответствие кодов для интеграций',
      ],
    ],
  },
];

export const RF_EGAIS_ALCOHOL_NAV_BRAND: readonly NavSubsectionEntry[] = [
  {
    label: 'Контроль качества',
    detailsBrief: ['Сертификаты', 'Партии'],
    detailsInventory: [
      [
        invCore('Прослеживаемость партий и соответствие маркировке алкогольной продукции'),
      ],
    ],
  },
  {
    label: 'Заказы',
    detailsBrief: ['Цепочка'],
    detailsInventory: [
      [
        'Документооборот заказов с учётом требований к алкогольной продукции',
      ],
    ],
  },
  {
    label: 'Логистика',
    detailsBrief: ['Перемещения'],
    detailsInventory: [
      [
        'Отгрузки и перемещения с передачей данных в контур ЕГАИС (интеграция)',
      ],
    ],
  },
];

export const RF_EGAIS_ALCOHOL_NAV_SHOP: readonly NavSubsectionEntry[] = [
  {
    label: 'Розничные продажи (B2C)',
    detailsBrief: ['Розница', 'ЕГАИС'],
    detailsInventory: [
      [
        invCore('Розничный учёт алкоголя: касса, чеки, связка с ЕГАИС при наличии интеграции'),
      ],
    ],
  },
  {
    label: 'Финансы',
    detailsBrief: ['Учёт'],
    detailsInventory: [
      [
        'Финансовый учёт продаж подлежащих категорий',
      ],
    ],
  },
  {
    label: 'Управление',
    detailsBrief: ['Лицензии', 'Доступ'],
    detailsInventory: [
      [
        'Лицензии и ограничения по персоналу и точкам продаж',
      ],
    ],
  },
];

export const RF_EGAIS_ALCOHOL_NAV_DISTRIBUTOR: readonly NavSubsectionEntry[] = [
  {
    label: 'Логистика',
    detailsBrief: ['Перемещения', 'ЕГАИС'],
    detailsInventory: [
      [
        invCore('Оптовые перемещения алкогольной продукции с учётом требований ЕГАИС'),
      ],
    ],
  },
  {
    label: 'Заказы',
    detailsBrief: ['Опт'],
    detailsInventory: [
      [
        'Заказы и отгрузки с корректной передачей в контур учёта',
      ],
    ],
  },
];

export const RF_EGAIS_ALCOHOL_NAV_MANUFACTURER: readonly NavSubsectionEntry[] = [
  {
    label: 'Контроль качества',
    detailsBrief: ['Партии', 'Соответствие'],
    detailsInventory: [
      [
        invCore('Учёт выпуска и партий для ЕГАИС на производстве'),
      ],
    ],
  },
  {
    label: 'Производство',
    detailsBrief: ['Выпуск'],
    detailsInventory: [
      [
        'Связка производственных операций с декларированием и перемещениями',
      ],
    ],
  },
];

export const RF_EGAIS_ALCOHOL_NAV_SUPPLIER: readonly NavSubsectionEntry[] = [
  {
    label: 'Контроль качества',
    detailsBrief: ['Сырьё'],
    detailsInventory: [
      [
        invCore('Документы качества на поставляемые компоненты для алкогольного производства'),
      ],
    ],
  },
  {
    label: 'Материалы и поставки',
    detailsBrief: ['Поставки'],
    detailsInventory: [
      [
        'Поставки сопутствующих материалов в контур лицензируемого производства',
      ],
    ],
  },
];
