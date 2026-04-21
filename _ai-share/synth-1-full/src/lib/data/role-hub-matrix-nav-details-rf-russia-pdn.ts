/**
 * Тема `rf_personal_data` — персональные данные и 152-ФЗ (ROLE_HUB_MATRIX, фаза rf_russia).
 */
import type { NavInventoryLine, NavSubsectionEntry } from './role-hub-matrix-nav-details';

function invCore(text: string): NavInventoryLine {
  return { text, core: true };
}

export const RF_PERSONAL_DATA_NAV_ADMIN: readonly NavSubsectionEntry[] = [
  {
    label: 'Организации · система',
    detailsBrief: ['Политики ПДн', 'Согласия', 'Аудит'],
    detailsInventory: [
      [
        invCore('Платформенные политики обработки ПДн и шаблоны согласий для кабинетов'),
        'Журналы обращений субъектов и ответов в сроки 152-ФЗ',
      ],
      [
        'Настройки хранения, резервного копирования и локализации данных на территории РФ',
      ],
    ],
  },
];

const RF_PERSONAL_DATA_NAV_CABINET: readonly NavSubsectionEntry[] = [
  {
    label: 'Управление',
    detailsBrief: ['Согласия', 'Цели обработки', 'Сроки'],
    detailsInventory: [
      [
        invCore('Реестр согласий: маркетинг, аналитика, передача третьим лицам'),
        'Уведомление Роскомнадзора при необходимости (процесс и ответственные)',
      ],
      [
        invCore('Сроки хранения ПДн по категориям; удаление и обезличивание'),
        'Запросы субъектов: доступ, исправление, удаление блока данных',
      ],
    ],
  },
];

export const RF_PERSONAL_DATA_NAV_BRAND = RF_PERSONAL_DATA_NAV_CABINET;
export const RF_PERSONAL_DATA_NAV_SHOP = RF_PERSONAL_DATA_NAV_CABINET;
export const RF_PERSONAL_DATA_NAV_DISTRIBUTOR = RF_PERSONAL_DATA_NAV_CABINET;
export const RF_PERSONAL_DATA_NAV_MANUFACTURER = RF_PERSONAL_DATA_NAV_CABINET;
export const RF_PERSONAL_DATA_NAV_SUPPLIER = RF_PERSONAL_DATA_NAV_CABINET;
