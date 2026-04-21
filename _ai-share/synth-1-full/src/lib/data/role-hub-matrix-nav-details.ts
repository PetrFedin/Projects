/**
 * Пункты второго уровня для таблицы «Темы покрытия».
 * Дополняет ROLE_HUB_MATRIX: там кластеры сайдбара (`clustersByRole`), здесь — **крупные продуктовые области**.
 *
 * Контракт:
 * - Каждый пункт — **осмысленный функциональный блок** (что делает пользователь в процессе), а не список каждого экрана.
 * - Привязка по паре **тема (`rowId`) + роль** (`RoleHubId`).
 * - Не дублировать то же самое в другой теме у той же роли.
 * - Имена кластеров сайдбара — `role-hub-matrix.ts` (`CABINET_SIDEBAR_CLUSTERS_FULL`).
 * - Подраздел — строка или `{ label, detailsBrief?, detailsInventory?, details? }`: кратко → по каждой строке краткого списка основной перечень → опционально плоский `details` (см. таблицу тем).
 * - Строка в `detailsInventory` может быть помечена как «ядровая» (`invCore`) — **синяя** подсветка сильных фич в шаге 3; **без явной продуктовой фичи не помечать**.
 * - Строка может быть помечена как **низкая актуальность для России** (`invNotRfRu`) или попасть в реестр `ROLE_HUB_INVENTORY_LINE_TEXT_LOW_RF_RU` — **красная** подсветка: для типичного РФ-MVP можно не тратить ресурсы и не перегружать продукт; явная пометка или полное совпадение текста в реестре.
 *
 * Канон — только этот каталог (`_ai-share/synth-1-full`).
 *
 * Где у ролей совпадает смысл блока — **одинаковые подписи и индекс** (напр. «Материалы для производства» у бренда и поставщика
 * в «production»; «Посадка и соответствие изделия» у бренда и производства в «qc»). В теме «org» текст уровня 3 **разный по кабинетам**
 * (см. `ORG_SUBSECTIONS_BY_ROLE`); фаза «Материалы, продукт (PIM) и B2B» — `role-hub-matrix-nav-details-product-supply.ts`;
 * фаза «Производство и качество» — `role-hub-matrix-nav-details-production-quality.ts`;
 * логистика, партнёры, маркетинг, аналитика, ИИ, коммуникации — см. `role-hub-matrix-nav-details-logistics.ts`,
 * `role-hub-matrix-nav-details-partners-marketing.ts`, `role-hub-matrix-nav-details-analytics.ts`,
 * `role-hub-matrix-nav-details-ai.ts`, `role-hub-matrix-nav-details-comms.ts`;
 * российский контур (`rf_*`) — `role-hub-matrix-nav-details-rf-russia-edo-marking.ts`,
 * `role-hub-matrix-nav-details-rf-russia-fiscal-ved.ts`, `role-hub-matrix-nav-details-rf-russia-pdn.ts`,
 * `role-hub-matrix-nav-details-rf-russia-egais.ts`.
 */

import type { RoleHubId } from './role-hub-matrix';
import {
  ROLE_HUB_INVENTORY_LINE_TEXT_LOW_RF_RU,
  ROLE_HUB_ORG_DETAIL_LINES_NOT_TYPICAL_RF_RU,
} from './role-hub-matrix-nav-details-low-rf-ru';

export { ROLE_HUB_INVENTORY_LINE_TEXT_LOW_RF_RU } from './role-hub-matrix-nav-details-low-rf-ru';
import {
  AI_NAV_ADMIN,
  AI_NAV_BRAND,
  AI_NAV_DISTRIBUTOR,
  AI_NAV_SHOP,
} from './role-hub-matrix-nav-details-ai';
import {
  ANALYTICS_NAV_ADMIN,
  ANALYTICS_NAV_BRAND,
  ANALYTICS_NAV_DISTRIBUTOR,
  ANALYTICS_NAV_MANUFACTURER,
  ANALYTICS_NAV_SHOP,
  ANALYTICS_NAV_SUPPLIER,
} from './role-hub-matrix-nav-details-analytics';
import {
  COMMS_NAV_ADMIN,
  COMMS_NAV_BRAND,
  COMMS_NAV_DISTRIBUTOR,
  COMMS_NAV_MANUFACTURER,
  COMMS_NAV_SHOP,
  COMMS_NAV_SUPPLIER,
} from './role-hub-matrix-nav-details-comms';
import {
  LOGISTICS_NAV_BRAND,
  LOGISTICS_NAV_DISTRIBUTOR,
  LOGISTICS_NAV_MANUFACTURER,
  LOGISTICS_NAV_SHOP,
} from './role-hub-matrix-nav-details-logistics';
import {
  MARKETING_NAV_ADMIN,
  MARKETING_NAV_BRAND,
  MARKETING_NAV_DISTRIBUTOR,
  MARKETING_NAV_SHOP,
  PARTNERS_NAV_BRAND,
  PARTNERS_NAV_DISTRIBUTOR,
  PARTNERS_NAV_SHOP,
} from './role-hub-matrix-nav-details-partners-marketing';
import {
  PRODUCTION_NAV_BRAND,
  PRODUCTION_NAV_MANUFACTURER,
  PRODUCTION_NAV_SUPPLIER,
  QC_NAV_BRAND,
  QC_NAV_MANUFACTURER,
  QC_NAV_SUPPLIER,
} from './role-hub-matrix-nav-details-production-quality';
import {
  B2B_NAV_BRAND,
  B2B_NAV_DISTRIBUTOR,
  B2B_NAV_MANUFACTURER,
  B2B_NAV_SHOP,
  MATERIALS_NAV_BRAND,
  MATERIALS_NAV_DISTRIBUTOR,
  MATERIALS_NAV_MANUFACTURER,
  MATERIALS_NAV_SHOP,
  MATERIALS_NAV_SUPPLIER,
  PRODUCT_NAV_BRAND,
  PRODUCT_NAV_DISTRIBUTOR,
  PRODUCT_NAV_MANUFACTURER,
  PRODUCT_NAV_SHOP,
} from './role-hub-matrix-nav-details-product-supply';
import {
  RF_EDO_ACCOUNTING_NAV_ADMIN,
  RF_EDO_ACCOUNTING_NAV_BRAND,
  RF_EDO_ACCOUNTING_NAV_DISTRIBUTOR,
  RF_EDO_ACCOUNTING_NAV_MANUFACTURER,
  RF_EDO_ACCOUNTING_NAV_SHOP,
  RF_EDO_ACCOUNTING_NAV_SUPPLIER,
  RF_MARKING_NAV_ADMIN,
  RF_MARKING_NAV_BRAND,
  RF_MARKING_NAV_DISTRIBUTOR,
  RF_MARKING_NAV_MANUFACTURER,
  RF_MARKING_NAV_SHOP,
  RF_MARKING_NAV_SUPPLIER,
} from './role-hub-matrix-nav-details-rf-russia-edo-marking';
import {
  RF_CASH_FISCAL_NAV_ADMIN,
  RF_CASH_FISCAL_NAV_BRAND,
  RF_CASH_FISCAL_NAV_DISTRIBUTOR,
  RF_CASH_FISCAL_NAV_MANUFACTURER,
  RF_CASH_FISCAL_NAV_SHOP,
  RF_CASH_FISCAL_NAV_SUPPLIER,
  RF_CUSTOMS_NAV_ADMIN,
  RF_CUSTOMS_NAV_BRAND,
  RF_CUSTOMS_NAV_DISTRIBUTOR,
  RF_CUSTOMS_NAV_MANUFACTURER,
  RF_CUSTOMS_NAV_SHOP,
  RF_CUSTOMS_NAV_SUPPLIER,
  RF_REGULATORY_REPORTING_NAV_ADMIN,
  RF_REGULATORY_REPORTING_NAV_BRAND,
  RF_REGULATORY_REPORTING_NAV_DISTRIBUTOR,
  RF_REGULATORY_REPORTING_NAV_MANUFACTURER,
  RF_REGULATORY_REPORTING_NAV_SHOP,
  RF_REGULATORY_REPORTING_NAV_SUPPLIER,
} from './role-hub-matrix-nav-details-rf-russia-fiscal-ved';
import {
  RF_PERSONAL_DATA_NAV_ADMIN,
  RF_PERSONAL_DATA_NAV_BRAND,
  RF_PERSONAL_DATA_NAV_DISTRIBUTOR,
  RF_PERSONAL_DATA_NAV_MANUFACTURER,
  RF_PERSONAL_DATA_NAV_SHOP,
  RF_PERSONAL_DATA_NAV_SUPPLIER,
} from './role-hub-matrix-nav-details-rf-russia-pdn';
import {
  RF_EGAIS_ALCOHOL_NAV_ADMIN,
  RF_EGAIS_ALCOHOL_NAV_BRAND,
  RF_EGAIS_ALCOHOL_NAV_DISTRIBUTOR,
  RF_EGAIS_ALCOHOL_NAV_MANUFACTURER,
  RF_EGAIS_ALCOHOL_NAV_SHOP,
  RF_EGAIS_ALCOHOL_NAV_SUPPLIER,
} from './role-hub-matrix-nav-details-rf-russia-egais';

/**
 * Строка инвентаря уровня 3: обычный текст, «ядровая» фича (`core` — синяя подсветка)
 * или низкая актуальность для РФ (`notRfRu` — красная подсветка; см. `isNavInventoryLineLowRfRu`).
 */
export type NavInventoryLine =
  | string
  | { readonly text: string; readonly core: true }
  | { readonly text: string; readonly notRfRu: true };

export function navInventoryLineText(line: NavInventoryLine): string {
  return typeof line === 'string' ? line : line.text;
}

export function navInventoryLineIsCore(line: NavInventoryLine): boolean {
  return typeof line === 'object' && line !== null && 'core' in line && line.core === true;
}

export function navInventoryLineIsNotRfRu(line: NavInventoryLine): boolean {
  return typeof line === 'object' && line !== null && 'notRfRu' in line && line.notRfRu === true;
}

function invCore(text: string): NavInventoryLine {
  return { text, core: true };
}

/** Красная подсветка в таблице тем: для РФ не актуально / не работает в типичной модели / не нужно. */
export function invNotRfRu(text: string): NavInventoryLine {
  return { text, notRfRu: true };
}

/**
 * Подраздел в навигации: строка или объект с двумя уровнями детализации (русский текст).
 * `detailsBrief` — шаг «Детализация подразделов»; `detailsInventory[i]` — шаг «Информация, метрики и функции» под строкой `detailsBrief[i]`; `details` — плоский список, если инвентаря по строкам нет.
 */
export type NavSubsectionEntry =
  | string
  | {
      label: string;
      /** Уровень 2: короткие обозначения блоков (не полные фразы). */
      detailsBrief?: readonly string[];
      /**
       * Уровень 3: для каждой строки `detailsBrief` — основной перечень данных, метрик и функций в этом блоке.
       * Индекс совпадает с `detailsBrief` (`detailsInventory[i]` относится к `detailsBrief[i]`).
       */
      detailsInventory?: readonly (readonly NavInventoryLine[])[];
      /** Уровень 3: один общий список (если нет `detailsInventory`). */
      details?: readonly string[];
    };

/**
 * Кабинеты B2B с отдельным текстом уровня 3 в теме org.
 * Подписи колонок — как в `ROLE_HUB_COLUMNS`: Бренд / Дизайн-дом, Магазин / Ритейл / закупки, …
 */
export type OrgCabinetRole = 'brand' | 'shop' | 'distributor' | 'manufacturer' | 'supplier';

const ORG_BRIEF_PROFILE = [
  'Реквизиты · регистрация',
  'Контакты · ЭДО',
  'Витрина · медиа',
  'Регион · локаль',
  'Метрики · карточка',
] as const;

const ORG_BRIEF_OVERVIEW = [
  'KPI · дашборд',
  'Задачи · события',
  'Тариф · оплата · интеграции',
  'Инциденты · быстрые ссылки',
] as const;

const ORG_BRIEF_TEAM = [
  'Пользователи · роли · RBAC',
  'Приглашения · доступ',
  'Вход · MFA · SSO',
  'Аудит',
] as const;

const ORG_BRIEF_SETTINGS = [
  'API · вебхуки · окружения',
  'Уведомления',
  'Локаль · форматы · единицы',
  'ПДн · выгрузки',
] as const;

function orgNavBlocks(
  profile: readonly (readonly NavInventoryLine[])[],
  overview: readonly (readonly NavInventoryLine[])[],
  team: readonly (readonly NavInventoryLine[])[],
  settings: readonly (readonly NavInventoryLine[])[]
): readonly NavSubsectionEntry[] {
  return [
    { label: 'Профиль организации', detailsBrief: ORG_BRIEF_PROFILE, detailsInventory: profile },
    { label: 'Обзор кабинета', detailsBrief: ORG_BRIEF_OVERVIEW, detailsInventory: overview },
    { label: 'Команда и доступы', detailsBrief: ORG_BRIEF_TEAM, detailsInventory: team },
    { label: 'Настройки', detailsBrief: ORG_BRIEF_SETTINGS, detailsInventory: settings },
  ];
}

/** Тема org: уровень 3 («Информация, метрики и функции») зависит от кабинета. */
const ORG_SUBSECTIONS_BY_ROLE: Record<OrgCabinetRole, readonly NavSubsectionEntry[]> = {
  brand: orgNavBlocks(
    [
      [
        'Наименование полное/краткое, ОГРН или ОГРНИП, статус юрлица',
        'ИНН, КПП, налоговый режим (если применимо)',
        'Банк, БИК, расчётный и корреспондентский счёт',
        'Юридический и почтовый адрес',
      ],
      [
        'Контакты для ЭДО, договоров и претензий (телефон, email)',
        'Ответственные лица по направлениям (дизайн, продукт, B2B, маркетинг)',
      ],
      [
        'Публичное описание бренда / дизайн-дома, отрасль, сегмент, теги для витрины',
        'Логотип, обложка, медиакит карточки организации',
      ],
      ['Страна, валюта по умолчанию, часовой пояс, локаль форматов'],
      [
        'Заполненность профиля (%), контрольные даты документов/доверенностей',
        'Редактирование карточки, проверка реквизитов, предпросмотр витрины, история изменений',
      ],
    ],
    [
      [
        invCore(
          'KPI кабинета бренда / дизайн-дома (Бренд · Дизайн-дом): коллекции, заказы B2B, отгрузки партнёрам, маржа по каналам, конверсии в опте'
        ),
        'Задачи в работе, просроченные согласования, SLA по процессам',
      ],
      [invCore('Лента событий, алерты, назначенные действия')],
      [
        'Данные: тариф SaaS, подписка, лимиты, дата продления',
        'Статус оплаты, блокировки, задолженность (если есть)',
        'Статус интеграций (PIM, B2B-портал), ошибки синхронизации, очереди обмена',
      ],
      [
        'Счётчики инцидентов (ЭДО, оплата, критичные ошибки API)',
        'Быстрые переходы в разделы, поиск по сущностям, персональные виджеты',
      ],
    ],
    [
      [
        'Список пользователей (ФИО, email), роли, статус (активен, приглашён, заблокирован)',
        invCore(
          'Матрица прав по разделам и операциям (коллекции, B2B, маркетинг, контент, RBAC)'
        ),
        'Активные сессии, последняя активность, неуспешные попытки входа',
      ],
      ['Приглашение, смена роли, отзыв доступа, блокировка, сброс пароля/MFA'],
      ['Функции: вход через SSO/SAML, политика MFA'],
      ['Аудит: журнал критичных операций и смены прав'],
    ],
    [
      [
        'Подключённые интеграции (каналы, PIM, B2B), API-ключи, ротация секретов',
        'Вебхуки, подпись запросов, allowlist IP, песочница / prod',
      ],
      [
        'Каналы уведомлений (email, мессенджеры, in-app)',
        'Подписки на типы событий, эскалации, тихие часы',
      ],
      ['Язык UI, форматы дат/чисел/валют, единицы измерения (рост, вес и т.д.)'],
      [
        'Отчётность: выгрузки реестров, переносимость данных (GDPR-like)',
        'Комплаенс: учёт согласий и сроков хранения ПДн (вне РФ — GDPR-like; в РФ — 152-ФЗ)',
      ],
    ]
  ),

  shop: orgNavBlocks(
    [
      [
        'Наименование полное/краткое, ОГРН или ОГРНИП, статус юрлица',
        'ИНН, КПП, налоговый режим (если применимо)',
        'Банк, БИК, расчётный и корреспондентский счёт',
        'Юридический и почтовый адрес; при сети — перечень юрлиц/точек (если применимо)',
      ],
      [
        'Контакты для ЭДО с брендами и поставщиками, претензии по магазинам и сети',
        'Ответственные лица по закупкам, мерчендайзингу и операциям',
      ],
      [
        'Описание сети/магазина (Магазин · Ритейл / закупки), витрина для покупателя, теги для витрины',
        'Логотип, обложка, медиа точек продаж',
      ],
      ['Страна, валюта по умолчанию, часовой пояс, локаль форматов (в т.ч. по каналам продаж)'],
      [
        'Заполненность профиля (%), контрольные даты договоров и доверенностей',
        'Редактирование карточки, проверка реквизитов, предпросмотр витрины, история изменений',
      ],
    ],
    [
      [
        invCore(
          'KPI ритейла и закупок (Магазин · Ритейл / закупки): продажи, омниканал, корзина, остатки в каналах, маржа по точкам/категориям'
        ),
        'Задачи закупок и мерчендайзинга, просроченные согласования, SLA по промо и поставкам',
      ],
      [invCore('Лента событий: алерты по остаткам, кассе, интеграциям POS/e-com')],
      [
        'Данные: тариф SaaS, подписка, лимиты, дата продления',
        'Статус оплаты, блокировки, задолженность (если есть)',
        'Статус интеграций (POS, маркетплейсы, склад), ошибки синхронизации, очереди обмена',
      ],
      [
        'Счётчики инцидентов (касса, ОФД, оплата, критичные ошибки API)',
        'Быстрые переходы в разделы, поиск по сущностям, персональные виджеты',
      ],
    ],
    [
      [
        'Список пользователей (ФИО, email), роли, статус (активен, приглашён, заблокирован)',
        invCore(
          'Матрица прав по разделам и операциям (ритейл, закупки, склады, e-com/POS, RBAC)'
        ),
        'Активные сессии, последняя активность, неуспешные попытки входа',
      ],
      ['Приглашение, смена роли, отзыв доступа, блокировка, сброс пароля/MFA'],
      ['Функции: вход через SSO/SAML, политика MFA'],
      ['Аудит: журнал критичных операций и смены прав'],
    ],
    [
      [
        'Интеграции: POS, e-com, касса, маркетплейсы; API-ключи, ротация секретов',
        'Вебхуки, подпись запросов, allowlist IP, песочница / prod',
      ],
      [
        'Каналы уведомлений (email, мессенджеры, in-app)',
        'Подписки на типы событий, эскалации, тихие часы',
      ],
      ['Язык UI, форматы дат/чисел/валют, единицы измерения (рост, вес и т.д.)'],
      [
        'Отчётность: выгрузки реестров, переносимость данных (GDPR-like)',
        'Комплаенс: учёт согласий и сроков хранения ПДн (вне РФ — GDPR-like; в РФ — 152-ФЗ)',
      ],
    ]
  ),

  distributor: orgNavBlocks(
    [
      [
        'Наименование полное/краткое, ОГРН или ОГРНИП, статус юрлица',
        'ИНН, КПП, налоговый режим (если применимо)',
        'Банк, БИК, расчётный и корреспондентский счёт',
        'Юридический и почтовый адрес; филиалы/представительства (если есть)',
      ],
      [
        'Контакты для ЭДО с брендами и ритейлом, претензии по оптовым сделкам',
        'Ответственные лица по территориям и ключевым клиентам',
      ],
      [
        'Описание оптовой сети (Дистрибьютор · Опт / сеть), территории покрытия, теги для витрины B2B',
        'Логотип, обложка, медиакит дистрибьютора',
      ],
      ['Страна, валюта по умолчанию, часовой пояс, локаль форматов'],
      [
        'Заполненность профиля (%), контрольные даты документов/доверенностей',
        'Редактирование карточки, проверка реквизитов, предпросмотр витрины, история изменений',
      ],
    ],
    [
      [
        invCore(
          'KPI опта и сети (Дистрибьютор · Опт / сеть): отгрузки партнёрам, дебиторка, покрытие территории, маржа по опту'
        ),
        'Задачи по согласованиям с сетью, просроченные согласования, SLA по поставкам',
      ],
      [invCore('Лента событий: алерты по отгрузкам, дебиторке, лимитам кредита')],
      [
        'Данные: тариф SaaS, подписка, лимиты, дата продления',
        'Статус оплаты, блокировки, задолженность (если есть)',
        'Статус интеграций (EDI, TMS, склад), ошибки синхронизации, очереди обмена',
      ],
      [
        'Счётчики инцидентов (ЭДО, оплата, критичные ошибки API)',
        'Быстрые переходы в разделы, поиск по сущностям, персональные виджеты',
      ],
    ],
    [
      [
        'Список пользователей (ФИО, email), роли, статус (активен, приглашён, заблокирован)',
        invCore(
          'Матрица прав по разделам и операциям (опт, территории, дебиторка, RBAC)'
        ),
        'Активные сессии, последняя активность, неуспешные попытки входа',
      ],
      ['Приглашение, смена роли, отзыв доступа, блокировка, сброс пароля/MFA'],
      ['Функции: вход через SSO/SAML, политика MFA'],
      ['Аудит: журнал критичных операций и смены прав'],
    ],
    [
      [
        'Интеграции: EDI, оптовые каналы, TMS; API-ключи, ротация секретов',
        'Вебхуки, подпись запросов, allowlist IP, песочница / prod',
      ],
      [
        'Каналы уведомлений (email, мессенджеры, in-app)',
        'Подписки на типы событий, эскалации, тихие часы',
      ],
      ['Язык UI, форматы дат/чисел/валют, единицы измерения (рост, вес и т.д.)'],
      [
        'Отчётность: выгрузки реестров, переносимость данных (GDPR-like)',
        'Комплаенс: учёт согласий и сроков хранения ПДн (вне РФ — GDPR-like; в РФ — 152-ФЗ)',
      ],
    ]
  ),

  manufacturer: orgNavBlocks(
    [
      [
        'Наименование полное/краткое, ОГРН или ОГРНИП, статус юрлица',
        'ИНН, КПП, налоговый режим (если применимо)',
        'Банк, БИК, расчётный и корреспондентский счёт',
        'Юридический и почтовый адрес производственной площадки',
      ],
      [
        'Контакты для ЭДО с брендами и поставщиками сырья',
        'Ответственные лица по производству, снабжению и качеству',
      ],
      [
        invCore(
          'Описание производства (Производство · Цех), площадки, фото/медиа цеха, сертификаты (при необходимости)'
        ),
        'Логотип, обложка, медиакит организации',
      ],
      ['Страна, валюта по умолчанию, часовой пояс смен/производства, локаль форматов'],
      [
        'Заполненность профиля (%), контрольные даты документов/доверенностей',
        'Редактирование карточки, проверка реквизитов, предпросмотр витрины, история изменений',
      ],
    ],
    [
      [
        invCore(
          'KPI производства (Производство · Цех): выпуск, WIP, загрузка мощностей, сырьё, субподряд, брак и переделки'
        ),
        'Задачи цеха и согласования, SLA по производственным заказам',
      ],
      [invCore('Лента событий: простои, срывы поставок сырья, алерты ОТК')],
      [
        'Данные: тариф SaaS, подписка, лимиты, дата продления',
        'Статус оплаты, блокировки, задолженность (если есть)',
        'Статус интеграций (MES/ERP, склад сырья), ошибки синхронизации, очереди обмена',
      ],
      [
        'Счётчики инцидентов (производство, оплата, критичные ошибки API)',
        'Быстрые переходы в разделы, поиск по сущностям, персональные виджеты',
      ],
    ],
    [
      [
        'Список пользователей (ФИО, email), роли, статус (активен, приглашён, заблокирован)',
        invCore(
          'Матрица прав по разделам и операциям (цех, производственные заказы, сырьё, субподряд, RBAC)'
        ),
        'Активные сессии, последняя активность, неуспешные попытки входа',
      ],
      ['Приглашение, смена роли, отзыв доступа, блокировка, сброс пароля/MFA'],
      ['Функции: вход через SSO/SAML, политика MFA'],
      ['Аудит: журнал критичных операций и смены прав'],
    ],
    [
      [
        'Интеграции: MES/ERP цеха, производственные API; API-ключи, ротация секретов',
        'Вебхуки, подпись запросов, allowlist IP, песочница / prod',
      ],
      [
        'Каналы уведомлений (email, мессенджеры, in-app)',
        'Подписки на типы событий, эскалации, тихие часы',
      ],
      ['Язык UI, форматы дат/чисел/валют, единицы измерения (рост, вес и т.д.)'],
      [
        'Отчётность: выгрузки реестров, переносимость данных (GDPR-like)',
        'Комплаенс: учёт согласий и сроков хранения ПДн (вне РФ — GDPR-like; в РФ — 152-ФЗ)',
      ],
    ]
  ),

  supplier: orgNavBlocks(
    [
      [
        'Наименование полное/краткое, ОГРН или ОГРНИП, статус юрлица',
        'ИНН, КПП, налоговый режим (если применимо)',
        'Банк, БИК, расчётный и корреспондентский счёт',
        'Юридический и почтовый адрес',
      ],
      [
        'Контакты для ЭДО с брендами и производствами, претензии по поставкам материалов',
        'Ответственные лица по продажам, логистике и качеству',
      ],
      [
        invCore(
          'Каталог материалов на витрине (Поставщик · Материалы): TDS, образцы, соответствие, теги для поиска'
        ),
        'Логотип, обложка, медиакит поставщика',
      ],
      ['Страна, валюта по умолчанию, часовой пояс, локаль форматов'],
      [
        'Заполненность профиля (%), контрольные даты документов/доверенностей',
        'Редактирование карточки, проверка реквизитов, предпросмотр витрины, история изменений',
      ],
    ],
    [
      [
        invCore(
          'KPI поставок материалов (Поставщик · Материалы): отгрузки сырья, RFQ, SLA, возвраты и претензии по качеству'
        ),
        'Задачи по контрактам, согласованиям цен и отгрузок',
      ],
      [invCore('Лента событий: срывы поставок, претензии по партиям, алерты по срокам')],
      [
        'Данные: тариф SaaS, подписка, лимиты, дата продления',
        'Статус оплаты, блокировки, задолженность (если есть)',
        'Статус интеграций (каталог, производственные клиенты), ошибки синхронизации, очереди обмена',
      ],
      [
        'Счётчики инцидентов (ЭДО, оплата, критичные ошибки API)',
        'Быстрые переходы в разделы, поиск по сущностям, персональные виджеты',
      ],
    ],
    [
      [
        'Список пользователей (ФИО, email), роли, статус (активен, приглашён, заблокирован)',
        invCore(
          'Матрица прав по разделам и операциям (каталог материалов, отгрузки, RFQ, цены, RBAC)'
        ),
        'Активные сессии, последняя активность, неуспешные попытки входа',
      ],
      ['Приглашение, смена роли, отзыв доступа, блокировка, сброс пароля/MFA'],
      ['Функции: вход через SSO/SAML, политика MFA'],
      ['Аудит: журнал критичных операций и смены прав'],
    ],
    [
      [
        'Интеграции: каталог материалов, производственные клиенты; API-ключи, ротация секретов',
        'Вебхуки, подпись запросов, allowlist IP, песочница / prod',
      ],
      [
        'Каналы уведомлений (email, мессенджеры, in-app)',
        'Подписки на типы событий, эскалации, тихие часы',
      ],
      ['Язык UI, форматы дат/чисел/валют, единицы измерения (рост, вес и т.д.)'],
      [
        'Отчётность: выгрузки реестров, переносимость данных (GDPR-like)',
        'Комплаенс: учёт согласий и сроков хранения ПДн (вне РФ — GDPR-like; в РФ — 152-ФЗ)',
      ],
    ]
  ),
};

function mapOrgSubsectionsToBreakdown(
  subsections: readonly NavSubsectionEntry[]
): readonly { subsection: string; details: readonly string[] }[] {
  return subsections.map((e) =>
    typeof e === 'string'
      ? { subsection: e, details: [] as const }
      : {
          subsection: e.label,
          details: e.detailsInventory?.length
            ? e.detailsInventory.flat().map(navInventoryLineText)
            : (e.details ?? []),
        }
  );
}

/** Реэкспорт для скриптов и внешних ссылок на канон org. */
export { ROLE_HUB_ORG_DETAIL_LINES_NOT_TYPICAL_RF_RU };

export function isOrgDetailLineNotTypicalRfRu(line: string): boolean {
  return ROLE_HUB_ORG_DETAIL_LINES_NOT_TYPICAL_RF_RU.has(line);
}

/**
 * Красная подсветка: явная пометка `notRfRu` **или** полное совпадение текста с реестром
 * (`ROLE_HUB_INVENTORY_LINE_TEXT_LOW_RF_RU`, включает строки org и прочие темы).
 */
export function isNavInventoryLineLowRfRu(_rowId: string, line: NavInventoryLine): boolean {
  if (navInventoryLineIsNotRfRu(line)) return true;
  const text = navInventoryLineText(line);
  return ROLE_HUB_INVENTORY_LINE_TEXT_LOW_RF_RU.has(text);
}

/**
 * Сводка уровня 3 для темы `org` по кабинетам (текст различается — см. `ORG_SUBSECTIONS_BY_ROLE`).
 * Экспорт по умолчанию — колонка «Бренд» (для обратной совместимости и черновых сводок).
 */
export const ROLE_HUB_ORG_NAV_DETAIL_BREAKDOWN_RU = mapOrgSubsectionsToBreakdown(
  ORG_SUBSECTIONS_BY_ROLE.brand
);

/** Полная сводка уровня 3 для темы `org` по каждому кабинету B2B. */
export const ROLE_HUB_ORG_NAV_DETAIL_BREAKDOWN_RU_BY_ROLE: {
  readonly [K in OrgCabinetRole]: ReturnType<typeof mapOrgSubsectionsToBreakdown>;
} = {
  brand: mapOrgSubsectionsToBreakdown(ORG_SUBSECTIONS_BY_ROLE.brand),
  shop: mapOrgSubsectionsToBreakdown(ORG_SUBSECTIONS_BY_ROLE.shop),
  distributor: mapOrgSubsectionsToBreakdown(ORG_SUBSECTIONS_BY_ROLE.distributor),
  manufacturer: mapOrgSubsectionsToBreakdown(ORG_SUBSECTIONS_BY_ROLE.manufacturer),
  supplier: mapOrgSubsectionsToBreakdown(ORG_SUBSECTIONS_BY_ROLE.supplier),
};

/** rowId из ROLE_HUB_MATRIX → для роли → крупные подразделы (продуктовый смысл). */
export const ROLE_HUB_NAV_DETAILS: Partial<
  Record<string, Partial<Record<RoleHubId, readonly NavSubsectionEntry[]>>>
> = {
  org: {
    brand: ORG_SUBSECTIONS_BY_ROLE.brand,
    shop: ORG_SUBSECTIONS_BY_ROLE.shop,
    distributor: ORG_SUBSECTIONS_BY_ROLE.distributor,
    manufacturer: ORG_SUBSECTIONS_BY_ROLE.manufacturer,
    supplier: ORG_SUBSECTIONS_BY_ROLE.supplier,
  },

  /**
   * Материалы / закупки / VMI — одна цепочка из четырёх блоков (см. `area` строки materials в role-hub-matrix).
   *
   * Общая логика VMI: запасы физически у контрагента до вызова (call-off) / отгрузки; право собственности и учёт — по договору.
   * 1) Входящие заказы и заявки. 2) План, лимиты, сезоны (в т.ч. прогноз от клиента при VMI).
   * 3) Модель запасов: у покупателя — резервы/видимость пула у поставщика; у поставщика материалов — ведение пулов у себя.
   * 4) Физическое движение и документы: отгрузка, приёмка, ASN, ЭДО; call-off и списание с пула — в этом же контуре, не в «product».
   *
   * Роли-покупатели материалов: уровень 3 в данных — **разный по ролям** (`MATERIALS_NAV_*` в `role-hub-matrix-nav-details-product-supply.ts`).
   * Бренд / производство: сырьё под коллекцию и цех; магазин / дистрибьютор: закупка под сеть и опт соответственно.
   * Поставщик (материалы): зеркальная сторона VMI и отгрузок.
   */
  materials: {
    brand: MATERIALS_NAV_BRAND,
    shop: MATERIALS_NAV_SHOP,
    distributor: MATERIALS_NAV_DISTRIBUTOR,
    manufacturer: MATERIALS_NAV_MANUFACTURER,
    supplier: MATERIALS_NAV_SUPPLIER,
  },

  /**
   * PIM / ассортимент (без materials). Оптовый B2B — тема `b2b` в той же фазе, что materials и product; отгрузки — logistics.
   * У бренда «Портфель партнёров» — сеть ритейла/дистрибуции под ассортимент (см. также тему partners для коммерции и ЭДО).
   * Лайншиты — в теме `b2b`, не в PIM.
   * У производителя в product: «Производственные заказы» и «Остатки и доступность» (PIM/ATP для выпуска).
   * Сводка намерений по колонке «Производство» в UI таблицы тем: `ROLE_HUB_ROLE_TABLE_NOTES.manufacturer` в `role-hub-matrix.ts`.
   * У поставщика материалов подразделов в product нет — каталог материалов и TDS см. production (контур сырья под цех).
   * Медиа каталога (SKU) — в `product`; креативы кампаний — в `marketing`, без дубля по смыслу.
   */
  product: {
    brand: PRODUCT_NAV_BRAND,
    shop: PRODUCT_NAV_SHOP,
    distributor: PRODUCT_NAV_DISTRIBUTOR,
    manufacturer: PRODUCT_NAV_MANUFACTURER,
  },

  /**
   * Производство и качество — фаза `production_quality`: уровни 2–3 см. `role-hub-matrix-nav-details-production-quality.ts`.
   */
  production: {
    brand: PRODUCTION_NAV_BRAND,
    manufacturer: PRODUCTION_NAV_MANUFACTURER,
    supplier: PRODUCTION_NAV_SUPPLIER,
  },

  qc: {
    brand: QC_NAV_BRAND,
    manufacturer: QC_NAV_MANUFACTURER,
    supplier: QC_NAV_SUPPLIER,
  },

  /**
   * Фаза fulfillment — только тема logistics (B2B — в фазе «Материалы, продукт (PIM) и B2B», строка b2b после product).
   * logistics: у бренда, магазина и дистрибьютора второй подраздел общий — omnichannel, трекинг, автопополнение; у производителя — только «Логистика и склады» (остатки — в product).
   * Физический поток и склад (не закупка сырья — materials; не PIM — product).
   * Поставщик материалов: подразделов в logistics нет — отгрузки в materials и production.
   */
  logistics: {
    brand: LOGISTICS_NAV_BRAND,
    shop: LOGISTICS_NAV_SHOP,
    distributor: LOGISTICS_NAV_DISTRIBUTOR,
    manufacturer: LOGISTICS_NAV_MANUFACTURER,
  },

  /**
   * Та же фаза цепочки, что и `product` (product_supply), строка следует за «Продукт и PIM» в матрице.
   * Не дублирует PIM: там мастер-данные; здесь оптовые сделки (шоурум, лайншиты как носитель заказа, контракты).
   * «Заказы B2B» — у бренда, магазина и дистрибьютора; у производителя — «Карта процессов».
   */
  b2b: {
    brand: B2B_NAV_BRAND,
    shop: B2B_NAV_SHOP,
    distributor: B2B_NAV_DISTRIBUTOR,
    manufacturer: B2B_NAV_MANUFACTURER,
  },

  partners: {
    brand: PARTNERS_NAV_BRAND,
    shop: PARTNERS_NAV_SHOP,
    distributor: PARTNERS_NAV_DISTRIBUTOR,
  },

  marketing: {
    admin: MARKETING_NAV_ADMIN,
    brand: MARKETING_NAV_BRAND,
    shop: MARKETING_NAV_SHOP,
    distributor: MARKETING_NAV_DISTRIBUTOR,
  },

  analytics: {
    admin: ANALYTICS_NAV_ADMIN,
    brand: ANALYTICS_NAV_BRAND,
    shop: ANALYTICS_NAV_SHOP,
    distributor: ANALYTICS_NAV_DISTRIBUTOR,
    manufacturer: ANALYTICS_NAV_MANUFACTURER,
    supplier: ANALYTICS_NAV_SUPPLIER,
  },

  ai: {
    admin: AI_NAV_ADMIN,
    brand: AI_NAV_BRAND,
    shop: AI_NAV_SHOP,
    distributor: AI_NAV_DISTRIBUTOR,
  },

  comms: {
    admin: COMMS_NAV_ADMIN,
    brand: COMMS_NAV_BRAND,
    shop: COMMS_NAV_SHOP,
    distributor: COMMS_NAV_DISTRIBUTOR,
    manufacturer: COMMS_NAV_MANUFACTURER,
    supplier: COMMS_NAV_SUPPLIER,
  },

  rf_edo_accounting: {
    admin: RF_EDO_ACCOUNTING_NAV_ADMIN,
    brand: RF_EDO_ACCOUNTING_NAV_BRAND,
    shop: RF_EDO_ACCOUNTING_NAV_SHOP,
    distributor: RF_EDO_ACCOUNTING_NAV_DISTRIBUTOR,
    manufacturer: RF_EDO_ACCOUNTING_NAV_MANUFACTURER,
    supplier: RF_EDO_ACCOUNTING_NAV_SUPPLIER,
  },
  rf_marking: {
    admin: RF_MARKING_NAV_ADMIN,
    brand: RF_MARKING_NAV_BRAND,
    shop: RF_MARKING_NAV_SHOP,
    distributor: RF_MARKING_NAV_DISTRIBUTOR,
    manufacturer: RF_MARKING_NAV_MANUFACTURER,
    supplier: RF_MARKING_NAV_SUPPLIER,
  },
  rf_cash_fiscal: {
    admin: RF_CASH_FISCAL_NAV_ADMIN,
    brand: RF_CASH_FISCAL_NAV_BRAND,
    shop: RF_CASH_FISCAL_NAV_SHOP,
    distributor: RF_CASH_FISCAL_NAV_DISTRIBUTOR,
    manufacturer: RF_CASH_FISCAL_NAV_MANUFACTURER,
    supplier: RF_CASH_FISCAL_NAV_SUPPLIER,
  },
  rf_customs: {
    admin: RF_CUSTOMS_NAV_ADMIN,
    brand: RF_CUSTOMS_NAV_BRAND,
    shop: RF_CUSTOMS_NAV_SHOP,
    distributor: RF_CUSTOMS_NAV_DISTRIBUTOR,
    manufacturer: RF_CUSTOMS_NAV_MANUFACTURER,
    supplier: RF_CUSTOMS_NAV_SUPPLIER,
  },
  rf_regulatory_reporting: {
    admin: RF_REGULATORY_REPORTING_NAV_ADMIN,
    brand: RF_REGULATORY_REPORTING_NAV_BRAND,
    shop: RF_REGULATORY_REPORTING_NAV_SHOP,
    distributor: RF_REGULATORY_REPORTING_NAV_DISTRIBUTOR,
    manufacturer: RF_REGULATORY_REPORTING_NAV_MANUFACTURER,
    supplier: RF_REGULATORY_REPORTING_NAV_SUPPLIER,
  },
  rf_personal_data: {
    admin: RF_PERSONAL_DATA_NAV_ADMIN,
    brand: RF_PERSONAL_DATA_NAV_BRAND,
    shop: RF_PERSONAL_DATA_NAV_SHOP,
    distributor: RF_PERSONAL_DATA_NAV_DISTRIBUTOR,
    manufacturer: RF_PERSONAL_DATA_NAV_MANUFACTURER,
    supplier: RF_PERSONAL_DATA_NAV_SUPPLIER,
  },
  rf_egais_alcohol: {
    admin: RF_EGAIS_ALCOHOL_NAV_ADMIN,
    brand: RF_EGAIS_ALCOHOL_NAV_BRAND,
    shop: RF_EGAIS_ALCOHOL_NAV_SHOP,
    distributor: RF_EGAIS_ALCOHOL_NAV_DISTRIBUTOR,
    manufacturer: RF_EGAIS_ALCOHOL_NAV_MANUFACTURER,
    supplier: RF_EGAIS_ALCOHOL_NAV_SUPPLIER,
  },
};

export type NavSubsectionItem = {
  label: string;
  detailsBrief?: readonly string[];
  detailsInventory?: readonly (readonly NavInventoryLine[])[];
  details?: readonly string[];
};

export function normalizeNavSubsectionEntry(entry: NavSubsectionEntry): NavSubsectionItem {
  if (typeof entry === 'string') return { label: entry };
  return {
    label: entry.label,
    detailsBrief: entry.detailsBrief?.length ? entry.detailsBrief : undefined,
    detailsInventory: entry.detailsInventory?.length ? entry.detailsInventory : undefined,
    details: entry.details?.length ? entry.details : undefined,
  };
}

/**
 * Подразделы для строки-темы и роли. Показываем только если в ячейке есть хотя бы один кластер.
 */
export function getNavSubsectionsForCell(
  rowId: string,
  roleId: RoleHubId,
  clusterNames?: readonly string[] | null
): readonly NavSubsectionItem[] | undefined {
  if (!clusterNames?.length) return undefined;
  const list = ROLE_HUB_NAV_DETAILS[rowId]?.[roleId];
  if (!list?.length) return undefined;
  return list.map(normalizeNavSubsectionEntry);
}
