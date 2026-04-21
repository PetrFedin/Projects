/**
 * Канон данных: ведите этот файл только в `_ai-share/synth-1-full` (субмодуля `synth-1/` в монорепо нет).
 *
 * Матрица кластеров сайдбара по ролям (кабинеты B2B-экосистемы).
 * ● — отдельный кластер в навигации; ◑ — часть функций / смежные сценарии; — — нет в типовом сайдбаре.
 *
 * ─── Контракт таблицы «Темы покрытия» (roles-matrix) ───
 *
 * 1) Имена кластеров ↔ разделы сайдбара
 *    Каждая строка в `clustersByRole[role]` — это **точное** совпадение со строкой из
 *    `CABINET_SIDEBAR_CLUSTERS_FULL[role]` (канон верхнего уровня сайдбара). Те же подписи, что
 *    `label` у групп верхнего уровня в: admin-navigation-normalized, brand-navigation,
 *    shop-navigation-normalized, distributor-navigation, manufacturerNavGroups / supplierNavGroups
 *    (factory-navigation). Проверка: `npm run validate:role-hub-matrix`.
 *
 * 2) Заголовок строки (`area`) ↔ кластеры
 *    `area` — сценарий по цепочке ценности (как читать строку слева). Чипы — **точки входа** в
 *    навигации, а не повтор названия темы. Связь «сценарий → кластеры» задаётся вручную при авторинге.
 *
 * 3) Подразделы под чипами
 *    См. `role-hub-matrix-nav-details.ts`: привязка по паре **тема (`row.id`) + роль**, не по каждому
 *    чипу отдельно. Если в ячейке несколько кластеров, список «Подразделы в навигации» описывает тему
 *    в целом и может объединять пункты из разных кластеров (см. комментарии там, напр. org).
 *
 * Единый стиль подписей (где применимо): «Партнёры» с буквой ё; в таблице тем русские подписи кластеров
 * задаются в role-hub-matrix-table-unification (красные чипы и словарь MATRIX_CLUSTER_LABEL_RU).
 *
 * Межролевые сценарии (чаты, заказы, PO, RFQ) и контракт обновлений: `CROSS_ROLE_FLOWS.md`.
 * Сводка фаз цепочки, ядра по профилям и расхождения имён кластеров vs сайдбар: `CORE_OPERATING_CHAIN.md`.
 * После правок навигации: `npm run validate:cabinet-nav`.
 */

export const ROLE_HUB_COLUMNS = [
  { id: 'admin', label: 'Syntha HQ', hint: 'Платформа' },
  { id: 'brand', label: 'Бренд', hint: 'Дизайн-дом' },
  { id: 'shop', label: 'Магазин', hint: 'Ритейл / закупки' },
  { id: 'distributor', label: 'Дистрибьютор', hint: 'Опт / сеть' },
  { id: 'manufacturer', label: 'Производство', hint: 'Цех' },
  { id: 'supplier', label: 'Поставщик', hint: 'Материалы' },
] as const;

/**
 * Только кабинеты B2B — без профиля платформы Syntha HQ (admin).
 * Для страниц, где сравнивают именно «внешние» роли экосистемы.
 */
export const ROLE_HUB_CABINET_COLUMNS = ROLE_HUB_COLUMNS.filter((c) => c.id !== 'admin');

export type RoleHubId = (typeof ROLE_HUB_COLUMNS)[number]['id'];

export type HubMark = '●' | '◑' | '—';

/**
 * Фаза цепочки ценности для строки «Темы покрытия» (группировка в UI).
 * platform_hq — только строки платформы Syntha HQ (в таблице кабинетов обычно скрыты).
 */
export type CoveragePhaseId =
  | 'entry'
  | 'org'
  | 'product_supply'
  | 'production_quality'
  | 'fulfillment'
  | 'partners_market'
  | 'analytics_ai'
  | 'comms'
  | 'platform_hq'
  | 'rf_russia';

/**
 * Порядок групп в таблице «Темы покрытия»: сверху вниз — **операционная цепочка** (закупка и продукт → производство и качество → логистика → партнёры и маркетинг → цифры и ИИ), коммуникации — сквозным слоем в конце.
 */
export const COVERAGE_PHASE_ORDER: readonly CoveragePhaseId[] = [
  'entry',
  'org',
  'product_supply',
  'production_quality',
  'fulfillment',
  'partners_market',
  'analytics_ai',
  'rf_russia',
  'comms',
] as const;

export const COVERAGE_PHASE_META: Record<
  CoveragePhaseId,
  { label: string; hint: string }
> = {
  entry: {
    label: 'Вход и обзор',
    hint: 'Дашборд и точка входа в кабинет',
  },
  org: {
    label: 'Организация и профиль',
    hint: 'Команда, доступы, настройки кабинета',
  },
  comms: {
    label: 'Коммуникации',
    hint: 'Сквозно: календарь и сообщения по всем процессам',
  },
  product_supply: {
    label: 'Материалы, продукт (PIM) и B2B',
    hint: 'Закупка и VMI → ассортимент → оптовые заказы',
  },
  production_quality: {
    label: 'Производство и качество',
    hint: 'План выпуска, цех, ОТК и комплаенс',
  },
  fulfillment: {
    label: 'Логистика и оптовый контур',
    hint: 'Склад, отгрузки, omnichannel',
  },
  partners_market: {
    label: 'Партнёры и маркетинг',
    hint: 'Каналы, контракты, кампании',
  },
  analytics_ai: {
    label: 'Аналитика и ИИ',
    hint: 'Отчёты, финансы, инструменты на базе ИИ',
  },
  rf_russia: {
    label: 'Российский контур',
    hint: 'Учёт и ЭДО, маркировка, касса, ВЭД, реготчётность, ПДн (152-ФЗ)',
  },
  platform_hq: {
    label: 'Платформа Syntha HQ',
    hint: 'Только профиль платформы; в таблице кабинетов не показывается',
  },
};

/** Все кластеры бокового меню по ролям (верхний уровень сайдбара, как в коде). */
export const CABINET_SIDEBAR_CLUSTERS_FULL: Record<RoleHubId, readonly string[]> = {
  admin: [
    'Контроль',
    'Пользователи и организации',
    'Каталог и справочники',
    'Коммерция и транзакции',
    'Маркетинг',
    'Контент и модерация',
    'Коммуникации',
    'Система',
  ],
  brand: [
    'Управление',
    'Продукт',
    'Производство',
    'Логистика',
    'Заказы',
    'Заказы B2B',
    'Партнёры и клиенты',
    'Маркетинг',
    'Аналитика',
    'Финансы',
    'Контроль качества',
    'AI и обучение',
  ],
  shop: [
    'Обзор',
    'Продукт',
    'Розничные продажи (B2C)',
    'Оптовые закупки (B2B)',
    'Заказы B2B',
    'Партнёры-бренды',
    'Аналитика',
    'Финансы',
    'Управление',
  ],
  distributor: [
    'Обзор',
    'Заказы',
    'Заказы B2B',
    'Продукт',
    'Каталог и партнёры',
    'Финансы',
    'Логистика',
    'Аналитика',
    'Управление',
  ],
  manufacturer: [
    'Обзор',
    'Производство',
    'Материалы',
    'Заказы',
    'Контроль качества',
    'Логистика',
    'Аналитика',
    'Финансы',
    'Управление',
  ],
  supplier: [
    'Обзор',
    'Материалы и поставки',
    'Заказы',
    'Контроль качества',
    'Логистика',
    'Аналитика',
    'Финансы',
    'Управление',
  ],
};

export type RoleHubRow = {
  id: string;
  /**
   * Короткий заголовок строки в UI: сценарий цепочки ценности. Не обязан совпадать с названием
   * кластера; чипы в ячейках — отдельно, см. `clustersByRole`.
   */
  area: string;
  /** Фаза цепочки для группировки в таблице «Темы покрытия» */
  coveragePhase: CoveragePhaseId;
  /**
   * Какие кластеры сайдбара (строго имена из `CABINET_SIDEBAR_CLUSTERS_FULL` для роли) относятся к теме.
   * Пустой массив — явно «нет выделенного кластера» для роли. Несколько строк — несколько чипов в ячейке.
   */
  clustersByRole: Record<RoleHubId, readonly string[]>;
  cells: Record<RoleHubId, HubMark>;
};

export const ROLE_HUB_MATRIX: RoleHubRow[] = [
  {
    id: 'overview',
    coveragePhase: 'entry',
    /** В кабинетах «Обзор» перенесён в тему «org» (кластер Управление), без отдельной строки overview в матрице. */
    area: 'Обзор платформы (Syntha HQ); в кабинетах — см. тему «org»',
    clustersByRole: {
      admin: ['Контроль'],
      brand: [],
      shop: [],
      distributor: [],
      manufacturer: [],
      supplier: [],
    },
    cells: {
      admin: '●',
      brand: '—',
      shop: '—',
      distributor: '—',
      manufacturer: '—',
      supplier: '—',
    },
  },
  {
    id: 'platform',
    coveragePhase: 'platform_hq',
    area: 'Платформа Syntha: оргструктура, справочники, биллинг, операционная система',
    clustersByRole: {
      admin: [
        'Пользователи и организации',
        'Каталог и справочники',
        'Коммерция и транзакции',
        'Система',
      ],
      brand: [],
      shop: [],
      distributor: [],
      manufacturer: [],
      supplier: [],
    },
    cells: {
      admin: '●',
      brand: '—',
      shop: '—',
      distributor: '—',
      manufacturer: '—',
      supplier: '—',
    },
  },
  {
    id: 'platform_content',
    coveragePhase: 'platform_hq',
    area: 'Контент и промо платформы',
    clustersByRole: {
      admin: ['Маркетинг', 'Контент и модерация'],
      brand: [],
      shop: [],
      distributor: [],
      manufacturer: [],
      supplier: [],
    },
    cells: {
      admin: '●',
      brand: '—',
      shop: '—',
      distributor: '—',
      manufacturer: '—',
      supplier: '—',
    },
  },
  {
    id: 'org',
    coveragePhase: 'org',
    area: 'Профиль организации, команда, настройки кабинета',
    clustersByRole: {
      admin: ['Пользователи и организации'],
      brand: ['Управление'],
      shop: ['Управление'],
      distributor: ['Управление'],
      manufacturer: ['Управление'],
      supplier: ['Управление'],
    },
    cells: {
      admin: '◑',
      brand: '●',
      shop: '●',
      distributor: '◑',
      manufacturer: '◑',
      supplier: '◑',
    },
  },
  // Календарь и сообщения: у кабинетов — кластер «Управление» (отдельная тема от org, см. ROLE_HUB_NAV_DETAILS).
  // Syntha HQ — отдельный кластер «Коммуникации».
  {
    id: 'comms',
    coveragePhase: 'comms',
    area: 'Коммуникации и календарь',
    clustersByRole: {
      admin: ['Коммуникации'],
      brand: ['Управление'],
      shop: ['Управление'],
      distributor: ['Управление'],
      manufacturer: ['Управление'],
      supplier: ['Управление'],
    },
    cells: {
      admin: '●',
      brand: '●',
      shop: '●',
      distributor: '●',
      manufacturer: '●',
      supplier: '●',
    },
  },
  // Фаза «Материалы, продукт (PIM) и B2B»: materials → product → b2b — см. COVERAGE_PHASE_META.product_supply.
  // VMI здесь: «поставщик» = контрагент закупки (материалы у бренда/производства; готовка у магазина/дистра). Запасы физически у контрагента до call-off/отгрузки; см. ROLE_HUB_NAV_DETAILS.materials.
  {
    id: 'materials',
    coveragePhase: 'product_supply',
    area: 'Материалы, закупки, резервы, поставки по схеме VMI (запасы на стороне поставщика)',
    clustersByRole: {
      admin: [],
      brand: ['Заказы', 'Логистика'],
      shop: ['Оптовые закупки (B2B)'],
      distributor: ['Заказы'],
      manufacturer: ['Материалы'],
      supplier: ['Материалы и поставки'],
    },
    cells: {
      admin: '—',
      brand: '●',
      shop: '●',
      distributor: '●',
      manufacturer: '●',
      supplier: '●',
    },
  },
  // PIM и ассортимент: см. ROLE_HUB_NAV_DETAILS.product. Поставщик материалов в этой строке не покрывается — см. production и materials.
  {
    id: 'product',
    coveragePhase: 'product_supply',
    area: 'Продукт и PIM: коллекции, каталог, медиа',
    clustersByRole: {
      admin: ['Каталог и справочники'],
      brand: ['Продукт'],
      shop: ['Партнёры-бренды'],
      distributor: ['Каталог и партнёры'],
      manufacturer: ['Производство'],
      supplier: [],
    },
    cells: {
      admin: '◑',
      brand: '●',
      shop: '◑',
      distributor: '◑',
      manufacturer: '◑',
      supplier: '—',
    },
  },
  // B2B — вслед за PIM (product), та же фаза product_supply. См. ROLE_HUB_NAV_DETAILS.b2b.
  {
    id: 'b2b',
    coveragePhase: 'product_supply',
    area: 'B2B: оптовые заказы, шоурум, байеры и контракты',
    clustersByRole: {
      admin: ['Коммерция и транзакции'],
      brand: ['Заказы B2B', 'Продукт'],
      shop: ['Заказы B2B', 'Продукт'],
      distributor: ['Заказы B2B', 'Продукт'],
      manufacturer: ['Заказы'],
      supplier: [],
    },
    cells: {
      admin: '◑',
      brand: '●',
      shop: '●',
      distributor: '●',
      manufacturer: '◑',
      supplier: '—',
    },
  },
  {
    id: 'production',
    coveragePhase: 'production_quality',
    area:
      'Производство: цех, операции, фабрики, планирование; сырьё и фурнитура от поставщиков; каталог материалов; TDS, медиа, образцы и соответствие',
    clustersByRole: {
      admin: [],
      brand: ['Производство'],
      shop: [],
      distributor: [],
      manufacturer: ['Производство'],
      /** В контуре выпуска: поставка материалов в бренд и на производство (кластер сайдбара — материалы). */
      supplier: ['Материалы и поставки'],
    },
    cells: {
      admin: '—',
      brand: '●',
      shop: '—',
      distributor: '—',
      manufacturer: '●',
      supplier: '●',
    },
  },
  {
    id: 'qc',
    coveragePhase: 'production_quality',
    area: 'Контроль качества, ОТК и соответствие требованиям',
    clustersByRole: {
      admin: ['Контент и модерация'],
      brand: ['Контроль качества'],
      shop: [],
      distributor: [],
      manufacturer: ['Контроль качества'],
      supplier: ['Контроль качества'],
    },
    cells: {
      admin: '◑',
      brand: '●',
      shop: '—',
      distributor: '—',
      manufacturer: '●',
      supplier: '●',
    },
  },
  // Фаза fulfillment: только logistics — см. ROLE_HUB_NAV_DETAILS.logistics. Поставщик материалов в этой фазе не покрывается.
  {
    id: 'logistics',
    coveragePhase: 'fulfillment',
    area: 'Логистика, склад, отслеживание поставок',
    clustersByRole: {
      admin: [],
      brand: ['Логистика'],
      shop: ['Розничные продажи (B2C)'],
      distributor: ['Логистика'],
      manufacturer: ['Логистика'],
      supplier: [],
    },
    cells: {
      admin: '—',
      brand: '●',
      shop: '●',
      distributor: '●',
      manufacturer: '●',
      supplier: '—',
    },
  },
  {
    id: 'partners',
    coveragePhase: 'partners_market',
    area: 'Работа с клиентами (CRM) и лояльность',
    clustersByRole: {
      admin: ['Пользователи и организации'],
      brand: ['Партнёры и клиенты'],
      shop: ['Партнёры-бренды'],
      distributor: ['Каталог и партнёры'],
      manufacturer: [],
      supplier: [],
    },
    cells: {
      admin: '◑',
      brand: '●',
      shop: '●',
      distributor: '●',
      manufacturer: '—',
      supplier: '—',
    },
  },
  {
    id: 'marketing',
    coveragePhase: 'partners_market',
    area: 'Маркетинг бренда и кампании',
    clustersByRole: {
      admin: ['Маркетинг'],
      brand: ['Маркетинг'],
      shop: ['Партнёры-бренды'],
      distributor: ['Каталог и партнёры'],
      manufacturer: [],
      supplier: [],
    },
    cells: {
      admin: '●',
      brand: '●',
      shop: '◑',
      distributor: '◑',
      manufacturer: '—',
      supplier: '—',
    },
  },
  {
    id: 'analytics',
    coveragePhase: 'analytics_ai',
    area: 'Аналитика, отчётность, цены, финансы',
    clustersByRole: {
      admin: ['Коммерция и транзакции'],
      brand: ['Аналитика', 'Финансы'],
      shop: ['Аналитика', 'Финансы'],
      distributor: ['Аналитика', 'Финансы'],
      manufacturer: ['Аналитика', 'Финансы'],
      supplier: ['Аналитика', 'Финансы'],
    },
    cells: {
      admin: '◑',
      brand: '●',
      shop: '●',
      distributor: '●',
      manufacturer: '●',
      supplier: '◑',
    },
  },
  {
    id: 'ai',
    coveragePhase: 'analytics_ai',
    area: 'Обучение и смарт-инструменты в контуре заказов',
    clustersByRole: {
      admin: ['Система', 'Контент и модерация'],
      brand: ['AI и обучение'],
      /** ИИ и академия в контуре опта / заказов (см. shop/b2b/academy, AI-поиск, SmartOrder). */
      shop: ['Оптовые закупки (B2B)'],
      distributor: ['Заказы'],
      manufacturer: [],
      supplier: [],
    },
    cells: {
      admin: '◑',
      brand: '●',
      shop: '◑',
      distributor: '◑',
      manufacturer: '—',
      supplier: '—',
    },
  },
  {
    id: 'rf_edo_accounting',
    coveragePhase: 'rf_russia',
    area: 'Учёт РФ, ЭДО, КЭП и интеграции с учётными системами (1С и др.)',
    clustersByRole: {
      admin: ['Пользователи и организации', 'Система'],
      brand: ['Управление', 'Финансы'],
      shop: ['Управление', 'Финансы'],
      distributor: ['Управление', 'Финансы'],
      manufacturer: ['Управление', 'Финансы'],
      supplier: ['Управление', 'Финансы'],
    },
    cells: {
      admin: '◑',
      brand: '●',
      shop: '●',
      distributor: '●',
      manufacturer: '●',
      supplier: '●',
    },
  },
  {
    id: 'rf_marking',
    coveragePhase: 'rf_russia',
    area: 'Маркировка и Честный ЗНАК: коды, выгрузки, оборот',
    clustersByRole: {
      admin: ['Каталог и справочники'],
      brand: ['Продукт', 'Контроль качества'],
      shop: ['Продукт', 'Розничные продажи (B2C)'],
      distributor: ['Продукт', 'Каталог и партнёры'],
      manufacturer: ['Контроль качества', 'Производство'],
      supplier: ['Контроль качества', 'Материалы и поставки'],
    },
    cells: {
      admin: '◑',
      brand: '●',
      shop: '●',
      distributor: '●',
      manufacturer: '●',
      supplier: '●',
    },
  },
  {
    id: 'rf_cash_fiscal',
    coveragePhase: 'rf_russia',
    area: 'Касса и фискализация: 54-ФЗ, онлайн-кассы, ОФД',
    clustersByRole: {
      admin: ['Коммерция и транзакции'],
      brand: ['Заказы', 'Финансы'],
      shop: ['Розничные продажи (B2C)', 'Финансы'],
      distributor: ['Финансы', 'Заказы'],
      manufacturer: ['Финансы', 'Заказы'],
      supplier: ['Финансы', 'Заказы'],
    },
    cells: {
      admin: '◑',
      brand: '◑',
      shop: '●',
      distributor: '◑',
      manufacturer: '◑',
      supplier: '◑',
    },
  },
  {
    id: 'rf_customs',
    coveragePhase: 'rf_russia',
    area: 'ВЭД и таможня: импорт, декларации, сопровождение поставок',
    clustersByRole: {
      admin: ['Каталог и справочники'],
      brand: ['Логистика', 'Заказы'],
      shop: ['Оптовые закупки (B2B)', 'Заказы B2B'],
      distributor: ['Логистика', 'Заказы'],
      manufacturer: ['Материалы', 'Заказы'],
      supplier: ['Материалы и поставки', 'Заказы'],
    },
    cells: {
      admin: '◑',
      brand: '◑',
      shop: '◑',
      distributor: '●',
      manufacturer: '●',
      supplier: '●',
    },
  },
  {
    id: 'rf_regulatory_reporting',
    coveragePhase: 'rf_russia',
    area: 'Регламентированная отчётность и налоговый контур РФ',
    clustersByRole: {
      admin: ['Коммерция и транзакции', 'Система'],
      brand: ['Аналитика', 'Финансы'],
      shop: ['Аналитика', 'Финансы'],
      distributor: ['Аналитика', 'Финансы'],
      manufacturer: ['Аналитика', 'Финансы'],
      supplier: ['Аналитика', 'Финансы'],
    },
    cells: {
      admin: '◑',
      brand: '●',
      shop: '●',
      distributor: '●',
      manufacturer: '●',
      supplier: '●',
    },
  },
  {
    id: 'rf_personal_data',
    coveragePhase: 'rf_russia',
    area: 'Персональные данные и согласия (152-ФЗ): политика, учёт, сроки хранения',
    clustersByRole: {
      admin: ['Пользователи и организации', 'Система'],
      brand: ['Управление'],
      shop: ['Управление'],
      distributor: ['Управление'],
      manufacturer: ['Управление'],
      supplier: ['Управление'],
    },
    cells: {
      admin: '●',
      brand: '●',
      shop: '●',
      distributor: '●',
      manufacturer: '●',
      supplier: '●',
    },
  },
  {
    id: 'rf_egais_alcohol',
    coveragePhase: 'rf_russia',
    area: 'ЕГАИС / учёт алкогольной продукции (ниша; при отсутствии категории — не применимо)',
    clustersByRole: {
      admin: ['Коммерция и транзакции', 'Каталог и справочники'],
      brand: ['Контроль качества', 'Заказы', 'Логистика'],
      shop: ['Розничные продажи (B2C)', 'Финансы', 'Управление'],
      distributor: ['Логистика', 'Заказы'],
      manufacturer: ['Контроль качества', 'Производство'],
      supplier: ['Контроль качества', 'Материалы и поставки'],
    },
    cells: {
      admin: '◑',
      brand: '◑',
      shop: '◑',
      distributor: '◑',
      manufacturer: '◑',
      supplier: '◑',
    },
  },
];

/**
 * Значок в UI: если к теме не привязан ни один кластер сайдбара для роли — только «—», без ●/◑
 * (иначе значок дублировал бы смысл при пустом списке чипов).
 */
export function getEffectiveHubMark(row: RoleHubRow, roleId: RoleHubId): HubMark {
  const clusters = row.clustersByRole[roleId];
  if (!clusters?.length) return '—';
  return row.cells[roleId];
}

/**
 * Таблица «Темы покрытия» без колонки Syntha HQ: только строки, где хотя бы у одного кабинета
 * (бренд … поставщик) есть покрытие по эффективному значку (не «—»). Темы только платформы исключены.
 */
export const ROLE_HUB_MATRIX_CABINET_ROWS = ROLE_HUB_MATRIX.filter((row) =>
  ROLE_HUB_CABINET_COLUMNS.some((col) => getEffectiveHubMark(row, col.id) !== '—')
);

/** Группировка строк таблицы «Темы покрытия» по фазам цепочки (порядок фиксирован в COVERAGE_PHASE_ORDER). */
export function groupCabinetRowsByCoveragePhase(rows: RoleHubRow[]): {
  phase: CoveragePhaseId;
  label: string;
  hint: string;
  rows: RoleHubRow[];
}[] {
  const byPhase = new Map<CoveragePhaseId, RoleHubRow[]>();
  for (const id of COVERAGE_PHASE_ORDER) {
    byPhase.set(id, []);
  }
  for (const row of rows) {
    const list = byPhase.get(row.coveragePhase);
    if (list) list.push(row);
  }
  return COVERAGE_PHASE_ORDER.filter((id) => (byPhase.get(id)?.length ?? 0) > 0).map((id) => ({
    phase: id,
    label: COVERAGE_PHASE_META[id].label,
    hint: COVERAGE_PHASE_META[id].hint,
    rows: byPhase.get(id)!,
  }));
}

/** Кластер встречается в нескольких темах для одной роли (осознанное пересечение или к проверке). */
export type ClusterMultiThemeEntry = {
  roleId: RoleHubId;
  cluster: string;
  themes: { id: string; area: string }[];
};

export function findClustersUsedInMultipleThemes(rows: RoleHubRow[]): ClusterMultiThemeEntry[] {
  const roles = ROLE_HUB_CABINET_COLUMNS.map((c) => c.id);
  const out: ClusterMultiThemeEntry[] = [];
  for (const roleId of roles) {
    const clusterToThemes = new Map<string, Map<string, { id: string; area: string }>>();
    for (const row of rows) {
      const names = row.clustersByRole[roleId];
      if (!names?.length) continue;
      for (const c of [...new Set(names)]) {
        if (!clusterToThemes.has(c)) clusterToThemes.set(c, new Map());
        clusterToThemes.get(c)!.set(row.id, { id: row.id, area: row.area });
      }
    }
    for (const [cluster, themesMap] of clusterToThemes) {
      const themes = [...themesMap.values()];
      if (themes.length > 1) {
        out.push({ roleId, cluster, themes });
      }
    }
  }
  return out.sort((a, b) => a.roleId.localeCompare(b.roleId) || a.cluster.localeCompare(b.cluster));
}

/**
 * Короткая подсказка для ◑: какая ещё тема использует тот же кластер сайдбара (если есть в данных).
 */
export function getClusterSharingHintForPartialMark(
  rowId: string,
  roleId: RoleHubId,
  clusterNames: readonly string[] | undefined,
  duplicates: readonly ClusterMultiThemeEntry[]
): string {
  if (!clusterNames?.length) {
    return 'Кластеры в ячейке не заданы.';
  }

  const lines: string[] = [];
  for (const cluster of [...new Set(clusterNames)]) {
    const entry = duplicates.find(
      (d) => d.roleId === roleId && d.cluster === cluster && d.themes.some((t) => t.id === rowId)
    );
    if (!entry || entry.themes.length < 2) continue;
    const others = entry.themes.filter((t) => t.id !== rowId);
    if (others.length === 0) continue;
    const names = others.map((t) => `«${t.area}»`).join(', ');
    lines.push(
      others.length === 1
        ? `Тот же кластер «${cluster}», что и в теме ${names}.`
        : `Кластер «${cluster}» ещё у тем: ${names}.`
    );
  }

  if (lines.length > 0) {
    return lines.join('\n');
  }

  return 'В матрице нет другой темы с тем же кластером для этой роли.';
}

/** Пересечения: где несколько ролей тянут одну и ту же цепочку ценности */
export const ROLE_HUB_OVERLAPS: string[] = [
  'Бренд — Магазин — Дистрибьютор: общий контур оптовых закупок и заказов (B2B), шоурума, каталога и лайншитов (разные права и срезы данных).',
  'Производство — Поставщик: материалы, резервы, заказы на поставку, контроль качества по партиям и отгрузкам.',
  'Бренд: производственный контур (этапы, материалы, контрактное производство) — через заказы B2B и логистику закупок; у фабрики — цех и материалы напрямую.',
  'Магазин — Дистрибьютор: оптовые заказы, финансы, логистика (ритейлер против оптовой сети).',
  'Все кабинеты оптового контура (B2B): сообщения и календарь как сквозные точки согласований.',
];

/**
 * Пояснения к колонке роли в таблице «Темы покрытия» (/project-info/roles-matrix) при фокусе на роли.
 * Не дублируют ячейки — фиксируют намерение авторинга матрицы и ROLE_HUB_NAV_DETAILS.
 */
export const ROLE_HUB_ROLE_TABLE_NOTES: Partial<Record<RoleHubId, readonly string[]>> = {
  manufacturer: [
    'В сайдбаре нет отдельных кластеров «партнёры» и «маркетинг» — строки partners и marketing в матрице для роли пустые.',
    'Фаза «материалы и продукт»: полная цепочка VMI в materials; в product — только производственные заказы и ATP (узкий PIM); в b2b — «карта процессов», без «Заказы B2B» как у бренда/дистра.',
    'Кластер «Производство» в темах product и production разведён по смыслу: product — срез PIM под выпуск и доступность; production — цех, план, субподряд и материалы в контуре выпуска. ◑ на product и b2b — частичное покрытие темы относительно полного сценария бренда.',
    'ОТК и посадка в qc без отдельного блока комплаенса (в отличие от бренда); logistics — склады без omnichannel (остатки готовой продукции — в product).',
    'Аналитика с акцентом на производство и план vs факт выпуска; отдельной строки ИИ нет. Финансы — в общей зоне отчётности (кластер «Аналитика»). Коммуникации — сквозной слой (фаза comms в конце порядка фаз).',
  ],
};
