/**
 * Схема профиля бренда — BRAND_PROFILE_SCHEMA.md.
 * Метаданные подразделов: описание, источник данных, синхронизация.
 */

export interface ProfileSubsectionMeta {
  id: string;
  label: string;
  description: string;
  /** Кто заполняет / откуда данные */
  dataSource: string;
  /** Синхронизация с другими модулями */
  syncTargets?: string[];
}

/** Подразделы таба «Бренд» — порядок и метаданные */
export const BRAND_TAB_SUBSECTIONS: ProfileSubsectionMeta[] = [
  {
    id: 'about',
    label: 'О бренде',
    description: 'Название, лого, год основания, страна. Verified — подтверждение владельца.',
    dataSource: 'Редактирует владелец бренда',
    syncTargets: ['Хедер профиля', 'Юр. данные (название)'],
  },
  {
    id: 'showroom',
    label: 'Шоурум',
    description: 'Адрес, карта, телефон, сайт, график работы. Для B2B-встреч и выставок.',
    dataSource: 'Бренд заполняет',
    syncTargets: ['ROUTES.brand.showroom', 'B2B выставочные события'],
  },
  {
    id: 'site-socials',
    label: 'Сайт и соцсети',
    description: 'Сайт бренда, Instagram, X. Badge «Синхронизировано» — данные проверены.',
    dataSource: 'Бренд + опционально OAuth-синхронизация',
    syncTargets: ['Контент-хаб', 'Маркетинг'],
  },
  {
    id: 'store-addresses',
    label: 'Адреса магазинов',
    description: 'Офлайн-точки продаж. Данные заполняют сами магазины после синхронизации.',
    dataSource: 'Магазины после подключения и подтверждения',
    syncTargets: ['Сток магазина + сток бренда = наличие для примерки'],
  },
  {
    id: 'online-stores',
    label: 'Интернет-магазины',
    description: 'WB, Ozon, Яндекс. Маркет. Парсинг цен, сравнение.',
    dataSource: 'Бренд добавляет ссылки, парсинг — платформа',
    syncTargets: ['Прайсинг', 'Сравнение цен'],
  },
  {
    id: 'contacts',
    label: 'Контакты и доступ',
    description: 'Почта, логин, Telegram, WhatsApp, телефоны. Подпись: Пресса, B2B, Общий.',
    dataSource: 'Бренд',
    syncTargets: ['Юр. реквизиты (b2b@) — отдельный блок в Legal'],
  },
];
