/**
 * Лёгкий path-index brand layout — breadcrumbs / recent без lucide в initial chunk.
 * Синхронизация: npm run brand-nav:sync-path-index
 */

import type { CabinetNavPathCandidate } from '@/lib/ui/cabinet-nav-active';

export type BrandNavPathCandidate = CabinetNavPathCandidate & {
  value: string;
  description?: string;
};

export const brandNavPathCandidates: readonly BrandNavPathCandidate[] = [
  {
    href: '/brand/team',
    value: 'team',
    label: 'Команда',
    description: 'Участники проекта, задачи, права и орг. структура бренда.',
  },
  {
    href: '/brand/profile?group=profile&tab=brand',
    value: 'profile',
    label: 'Профиль',
    description: 'Профиль бренда, юр. данные, контакты',
  },
  {
    href: '/brand/integrations',
    value: 'integrations',
    label: 'Интеграции',
    description: 'Маркетплейсы, ERP, PLM, 1С, Webhooks, SSO',
  },
  {
    href: '/brand/documents',
    value: 'documents',
    label: 'Документооборот и ЭДО',
    description: 'Договоры, счета, ЭДО, Честный ЗНАК. Шаблоны, интеграции Диадок/СБИС, склад КИЗ.',
  },
  {
    href: '/brand/settings',
    value: 'settings',
    label: 'Настройки',
    description: 'Общие, безопасность, подписка',
  },
  {
    href: '/brand/control-center',
    value: 'dashboard',
    label: 'Центр управления',
    description:
      'Стратегический хаб: все модули организации, логистики, продуктов, B2B, производства, маркетинга, аналитики, финансов, арбитража, устойчивости, коммуникаций. Обзор и быстрые переходы.',
  },
  {
    href: '/brand/products',
    value: 'pim',
    label: 'Товары',
    description:
      'Единый источник правды по карточке артикула: полный каталог и архив, сезонность, цены, медиа, статусы. Матрица и выпуск в цеху — в «Производство».',
  },
  {
    href: '/brand/collections',
    value: 'collections',
    label: 'Коллекции',
    description:
      'Собранные подборки сезонов, фотосессии и контекст для B2B; не дублирует полный каталог в «Товары».',
  },
  {
    href: '/brand/showroom',
    value: 'showroom',
    label: 'B2B Шоурум',
    description:
      'Phygital-витрина для байеров; лайншиты доступны внутри модуля, отдельной строки в навигации нет.',
  },
  {
    href: '/brand/b2b/linesheets',
    value: 'showroom',
    label: 'B2B Шоурум',
    description:
      'Phygital-витрина для байеров; лайншиты доступны внутри модуля, отдельной строки в навигации нет.',
  },
  {
    href: '/brand/production/workshop2',
    value: 'workshop2',
    label: 'Разработка артикулов',
    description: 'Коллекции и артикулы: ТЗ, сэмплы, выпуск.',
  },
  {
    href: '/brand/production',
    value: 'shop-floor',
    label: 'Производство',
    description:
      'Исполнение B2B-заказов и серий: этапы, снабжение, выпуск, ОТК. Матрица SKU — внутри модуля; данные карточки — в «Товар» → «Товары».',
  },
  {
    href: '/brand/products/matrix',
    value: 'shop-floor',
    label: 'Производство',
    description:
      'Исполнение B2B-заказов и серий: этапы, снабжение, выпуск, ОТК. Матрица SKU — внутри модуля; данные карточки — в «Товар» → «Товары».',
  },
  {
    href: '/brand/process/production/live',
    value: 'live-production',
    label: 'LIVE: от идеи до склада',
    description:
      'Поэтапная схема процесса коллекции (бриф → ассортимент → материалы → сэмплы → PO → QC → склад). Контекст коллекции, сетка этапов, Kanban и Gantt. Дополняет вкладки цеха, не заменяет их.',
  },
  {
    href: '/brand/logistics',
    value: 'logistics-hub',
    label: 'Логистика и склад',
    description:
      'Единая точка: перевозчики, документы, склад готовой продукции и материалов, КИЗ. Детальные экраны — через быстрые действия и deep link (без второй строки в сайдбаре).',
  },
  {
    href: '/brand/warehouse',
    value: 'logistics-hub',
    label: 'Логистика и склад',
    description:
      'Единая точка: перевозчики, документы, склад готовой продукции и материалов, КИЗ. Детальные экраны — через быстрые действия и deep link (без второй строки в сайдбаре).',
  },
  {
    href: '/brand/materials',
    value: 'logistics-hub',
    label: 'Логистика и склад',
    description:
      'Единая точка: перевозчики, документы, склад готовой продукции и материалов, КИЗ. Детальные экраны — через быстрые действия и deep link (без второй строки в сайдбаре).',
  },
  {
    href: '/brand/compliance/stock',
    value: 'logistics-hub',
    label: 'Логистика и склад',
    description:
      'Единая точка: перевозчики, документы, склад готовой продукции и материалов, КИЗ. Детальные экраны — через быстрые действия и deep link (без второй строки в сайдбаре).',
  },
  {
    href: '/brand/b2b-orders',
    value: 'orders',
    label: 'Заказы B2B',
    description:
      'Заказы, PO, отгрузки, согласование. Лайншиты и витрина — в «Товар» → «B2B Шоурум».',
  },
  {
    href: '/shop/b2b/workspace-map',
    value: 'retail-b2b-map',
    label: 'Карта B2B (ритейл)',
    description:
      'Сквозная визуализация модулей закупок в кабинете магазина: где шоурум, заказы и финансы стыкуются с вашим контуром.',
  },
  {
    href: '/brand/b2b/trade-shows',
    value: 'brand-trade-shows',
    label: 'Выставки и события (бренд)',
    description:
      'Календарь и стенды бренда; связь с заявками байеров и витриной в кабинете магазина.',
  },
  {
    href: '/brand/messages',
    value: 'messages',
    label: 'Сообщения',
    description:
      'Переписка по заказам B2B, производству и сопутствующим процессам; участники сети бренда.',
  },
  {
    href: '/brand/calendar?layers=tasks,orders,production',
    value: 'calendar',
    label: 'Календарь',
    description:
      'Единая временная шкала: задачи, дедлайны по заказам B2B и этапам производства. События ритейла (выставки, слоты встреч) смотрите в архиве «Витрина байера» — там же ссылки на сторону магазина.',
  },
  {
    href: '/shop',
    value: 'shop-home',
    label: 'Кабинет магазина',
    description:
      'Тот же хаб ритейла, что видит байер: сверка UX с шоурумом, лайншитами и B2B-заказами.',
  },
  {
    href: '/shop/b2b/trade-shows',
    value: 'shop-b2b-trade-shows',
    label: 'Выставки (ритейл)',
    description:
      'Календарь событий и стендов в кабинете магазина (раньше — быстрые ссылки у календаря бренда).',
  },
  {
    href: '/shop/b2b/trade-shows/appointments',
    value: 'shop-b2b-trade-appointments',
    label: 'Запись на встречи (ритейл)',
    description: 'Слоты встреч с брендами — интерфейс байера.',
  },
  {
    href: '/shop/b2b/discover',
    value: 'shop-discover',
    label: 'Подбор брендов (маркетплейс)',
    description: 'Поиск брендов и запрос доступа — зеркало байерского подбора.',
  },
  {
    href: '/shop/b2b/workspace-map',
    value: 'shop-b2b-map',
    label: 'Карта процессов B2B',
    description: 'Сквозная схема модулей закупок в кабинете магазина.',
  },
  {
    href: '/shop/b2b/payment',
    value: 'shop-b2b-payment',
    label: 'Оплата заказов (ритейл)',
    description: 'JOOR Pay и этапы оплаты в интерфейсе байера.',
  },
  {
    href: '/shop/b2b/apply',
    value: 'shop-b2b-apply',
    label: 'Подать заявку (сторона байера)',
    description: 'Онбординг байера к бренду — сопоставьте с заявками в бренд-кабинете.',
  },
  {
    href: '/shop/b2b/passport',
    value: 'shop-passport',
    label: 'Passport выставки (ритейл)',
    description: 'Портал события в интерфейсе байера.',
  },
  {
    href: '/brand/b2b/buyer-applications',
    value: 'buyer-applications',
    label: 'Заявки байеров (бренд)',
    description: 'Входящие заявки и статусы — пара к «Подать заявку» в ритейле.',
  },
  {
    href: '/shop/b2b/fulfillment-dashboard',
    value: 'shop-fulfillment',
    label: 'Fulfillment (ритейл)',
    description: 'SLA и каналы исполнения в кабинете магазина (наблюдение для бренда).',
  },
  {
    href: '/shop/b2b/rfq',
    value: 'shop-rfq',
    label: 'RFQ на площадке',
    description: 'Запросы котировок байеров; связь с RFQ материалов у бренда.',
  },
  {
    href: '/shop/b2b/tenders',
    value: 'shop-tenders',
    label: 'Тендеры (площадка)',
    description: 'Конкурентные закупки на стороне ритейла.',
  },
  {
    href: '/shop/b2b/supplier-discovery',
    value: 'shop-supplier-discovery',
    label: 'Поиск поставщиков (площадка)',
    description: 'Реестр поставщиков в контуре магазина; дополняет реестр бренда.',
  },
  {
    href: '/brand/suppliers/rfq',
    value: 'brand-suppliers-rfq',
    label: 'RFQ материалов (бренд)',
    description: 'Ваши запросы к поставщикам материалов — параллельно витрине RFQ ритейла.',
  },
  {
    href: '/brand/bopis',
    value: 'bopis',
    label: 'BOPIS Hub',
    description:
      'Выдача и возврат интернет-заказов в магазине (Buy Online, Pick Up In Store). Статусы заказов на выдачу, приём возвратов в точке, отчётность по магазинам.',
  },
  {
    href: '/brand/retailers',
    value: 'retailers',
    label: 'Партнёры',
    description:
      'Единый контур партнёров бренда: ритейлеры (список по умолчанию), поставщики и фабрики — из быстрых действий; отдельных строк в меню нет.',
  },
  {
    href: '/brand/suppliers',
    value: 'retailers',
    label: 'Партнёры',
    description:
      'Единый контур партнёров бренда: ритейлеры (список по умолчанию), поставщики и фабрики — из быстрых действий; отдельных строк в меню нет.',
  },
  {
    href: '/brand/factories',
    value: 'retailers',
    label: 'Партнёры',
    description:
      'Единый контур партнёров бренда: ритейлеры (список по умолчанию), поставщики и фабрики — из быстрых действий; отдельных строк в меню нет.',
  },
  {
    href: '/brand/customer-intelligence',
    value: 'customer-intelligence',
    label: 'CRM и лояльность',
    description:
      'Аналитика аудитории, RFM, сегменты. Связь с Customers, Analytics, Reviews и B2B (байеры).',
  },
  {
    href: '/brand/kickstarter',
    value: 'campaigns',
    label: 'Кампании и промо',
    description:
      'AI кампании, краудфандинг, предзаказы, скидки, акции. Связи: Pre-orders, Production, B2B Orders, Finance.',
  },
  {
    href: '/brand/marketing/samples',
    value: 'samples',
    label: 'PR-образцы',
    description:
      'Учёт образцов коллекции для съёмок, редакций и стилистов. Связь с Production (сэмплы, артикулы) и маркетингом (кампании). ROI кампаний — в Аналитике.',
  },
  {
    href: '/brand/media',
    value: 'media',
    label: 'Медиа и контент',
    description: 'DAM, трансляции, AI-видео. Связь с Products, Showroom и Marketing.',
  },
  {
    href: '/brand/analytics-360',
    value: 'analytics-360',
    label: 'Аналитика 360',
    description: 'Сквозная стратегическая аналитика',
  },
  {
    href: '/brand/analytics-bi',
    value: 'analytics-bi',
    label: 'BI и отчёты',
    description:
      'Полная статистика бренда: продажи (B2B, дистрибуторы, маркетплейс, аутлет), производство, остатки, клиенты, коллекции. План vs Факт, Phase 2 закупки, дашборды. Интеграция: 1С, Excel, Мой Склад.',
  },
  {
    href: '/brand/analytics',
    value: 'ai-analytics',
    label: 'AI Прогнозы',
    description:
      'Анализ SKU, промо, A/B-тесты. Связи: Analytics 360, BI, Products, Promotions, Finance.',
  },
  {
    href: '/brand/pricing',
    value: 'ai-pricing',
    label: 'Ценообразование',
    description: 'AI инструмент для настройки цен и маржи',
  },
  {
    href: '/brand/analytics/budget-actual',
    value: 'budget-actual',
    label: 'План vs Факт',
    description:
      'Бюджеты закупок, производства, маркетинга и логистики. РФ: рубли, контрагенты, статьи. Инфраструктура под API: ETL в fact_* / snapshot_*, импорт 1С/Мой Склад.',
  },
  {
    href: '/brand/finance',
    value: 'finance',
    label: 'Финансовый хаб',
    description:
      'P&L, факторинг, бюджеты и кассовый контроль. Landed Cost — расчёт полной себестоимости (ткань + CMT + логистика + пошлины). Escrow — безопасные сделки B2B.',
  },
  {
    href: '/brand/disputes',
    value: 'disputes',
    label: 'Арбитраж и споры',
    description:
      'B2B-претензии, арбитраж. Escrow — безопасные сделки. Связь с Production, B2B Orders и Finance.',
  },
  {
    href: '/brand/esg',
    value: 'esg',
    label: 'ESG-мониторинг',
    description:
      'Сертификаты, отчёты GRI/CDP, углеродный след. Связь с Production (BOM, материалы), Compliance и Quality.',
  },
  {
    href: '/brand/ai-design',
    value: 'ai-tools',
    label: 'AI Инструменты',
    description:
      'Генерация дизайна по описанию, техпакеты. Связь с Production (Tech Pack), Products и Planning.',
  },
  {
    href: '/brand/academy',
    value: 'academy',
    label: 'Академия',
    description: 'Курсы, база знаний, материалы',
  },
  {
    href: '/brand/hr-hub',
    value: 'hr-hub',
    label: 'HR-центр',
    description:
      'Единый центр: вакансии, резюме, онбординг, обучение. Связь с Командой, Академией, Career.',
  },
] as const;

export const brandNavMetaByValue: Readonly<
  Record<string, { label: string; description?: string }>
> = {
  team: {
    label: 'Команда',
    description: 'Участники проекта, задачи, права и орг. структура бренда.',
  },
  profile: {
    label: 'Профиль',
    description: 'Профиль бренда, юр. данные, контакты',
  },
  integrations: {
    label: 'Интеграции',
    description: 'Маркетплейсы, ERP, PLM, 1С, Webhooks, SSO',
  },
  documents: {
    label: 'Документооборот и ЭДО',
    description: 'Договоры, счета, ЭДО, Честный ЗНАК. Шаблоны, интеграции Диадок/СБИС, склад КИЗ.',
  },
  settings: {
    label: 'Настройки',
    description: 'Общие, безопасность, подписка',
  },
  dashboard: {
    label: 'Центр управления',
    description:
      'Стратегический хаб: все модули организации, логистики, продуктов, B2B, производства, маркетинга, аналитики, финансов, арбитража, устойчивости, коммуникаций. Обзор и быстрые переходы.',
  },
  pim: {
    label: 'Товары',
    description:
      'Единый источник правды по карточке артикула: полный каталог и архив, сезонность, цены, медиа, статусы. Матрица и выпуск в цеху — в «Производство».',
  },
  collections: {
    label: 'Коллекции',
    description:
      'Собранные подборки сезонов, фотосессии и контекст для B2B; не дублирует полный каталог в «Товары».',
  },
  showroom: {
    label: 'B2B Шоурум',
    description:
      'Phygital-витрина для байеров; лайншиты доступны внутри модуля, отдельной строки в навигации нет.',
  },
  workshop2: {
    label: 'Разработка артикулов',
    description: 'Коллекции и артикулы: ТЗ, сэмплы, выпуск.',
  },
  'shop-floor': {
    label: 'Производство',
    description:
      'Исполнение B2B-заказов и серий: этапы, снабжение, выпуск, ОТК. Матрица SKU — внутри модуля; данные карточки — в «Товар» → «Товары».',
  },
  'live-production': {
    label: 'LIVE: от идеи до склада',
    description:
      'Поэтапная схема процесса коллекции (бриф → ассортимент → материалы → сэмплы → PO → QC → склад). Контекст коллекции, сетка этапов, Kanban и Gantt. Дополняет вкладки цеха, не заменяет их.',
  },
  'logistics-hub': {
    label: 'Логистика и склад',
    description:
      'Единая точка: перевозчики, документы, склад готовой продукции и материалов, КИЗ. Детальные экраны — через быстрые действия и deep link (без второй строки в сайдбаре).',
  },
  orders: {
    label: 'Заказы B2B',
    description:
      'Заказы, PO, отгрузки, согласование. Лайншиты и витрина — в «Товар» → «B2B Шоурум».',
  },
  'retail-b2b-map': {
    label: 'Карта B2B (ритейл)',
    description:
      'Сквозная визуализация модулей закупок в кабинете магазина: где шоурум, заказы и финансы стыкуются с вашим контуром.',
  },
  'brand-trade-shows': {
    label: 'Выставки и события (бренд)',
    description:
      'Календарь и стенды бренда; связь с заявками байеров и витриной в кабинете магазина.',
  },
  messages: {
    label: 'Сообщения',
    description:
      'Переписка по заказам B2B, производству и сопутствующим процессам; участники сети бренда.',
  },
  calendar: {
    label: 'Календарь',
    description:
      'Единая временная шкала: задачи, дедлайны по заказам B2B и этапам производства. События ритейла (выставки, слоты встреч) смотрите в архиве «Витрина байера» — там же ссылки на сторону магазина.',
  },
  'shop-home': {
    label: 'Кабинет магазина',
    description:
      'Тот же хаб ритейла, что видит байер: сверка UX с шоурумом, лайншитами и B2B-заказами.',
  },
  'shop-b2b-trade-shows': {
    label: 'Выставки (ритейл)',
    description:
      'Календарь событий и стендов в кабинете магазина (раньше — быстрые ссылки у календаря бренда).',
  },
  'shop-b2b-trade-appointments': {
    label: 'Запись на встречи (ритейл)',
    description: 'Слоты встреч с брендами — интерфейс байера.',
  },
  'shop-discover': {
    label: 'Подбор брендов (маркетплейс)',
    description: 'Поиск брендов и запрос доступа — зеркало байерского подбора.',
  },
  'shop-b2b-map': {
    label: 'Карта процессов B2B',
    description: 'Сквозная схема модулей закупок в кабинете магазина.',
  },
  'shop-b2b-payment': {
    label: 'Оплата заказов (ритейл)',
    description: 'JOOR Pay и этапы оплаты в интерфейсе байера.',
  },
  'shop-b2b-apply': {
    label: 'Подать заявку (сторона байера)',
    description: 'Онбординг байера к бренду — сопоставьте с заявками в бренд-кабинете.',
  },
  'shop-passport': {
    label: 'Passport выставки (ритейл)',
    description: 'Портал события в интерфейсе байера.',
  },
  'buyer-applications': {
    label: 'Заявки байеров (бренд)',
    description: 'Входящие заявки и статусы — пара к «Подать заявку» в ритейле.',
  },
  'shop-fulfillment': {
    label: 'Fulfillment (ритейл)',
    description: 'SLA и каналы исполнения в кабинете магазина (наблюдение для бренда).',
  },
  'shop-rfq': {
    label: 'RFQ на площадке',
    description: 'Запросы котировок байеров; связь с RFQ материалов у бренда.',
  },
  'shop-tenders': {
    label: 'Тендеры (площадка)',
    description: 'Конкурентные закупки на стороне ритейла.',
  },
  'shop-supplier-discovery': {
    label: 'Поиск поставщиков (площадка)',
    description: 'Реестр поставщиков в контуре магазина; дополняет реестр бренда.',
  },
  'brand-suppliers-rfq': {
    label: 'RFQ материалов (бренд)',
    description: 'Ваши запросы к поставщикам материалов — параллельно витрине RFQ ритейла.',
  },
  bopis: {
    label: 'BOPIS Hub',
    description:
      'Выдача и возврат интернет-заказов в магазине (Buy Online, Pick Up In Store). Статусы заказов на выдачу, приём возвратов в точке, отчётность по магазинам.',
  },
  retailers: {
    label: 'Партнёры',
    description:
      'Единый контур партнёров бренда: ритейлеры (список по умолчанию), поставщики и фабрики — из быстрых действий; отдельных строк в меню нет.',
  },
  'customer-intelligence': {
    label: 'CRM и лояльность',
    description:
      'Аналитика аудитории, RFM, сегменты. Связь с Customers, Analytics, Reviews и B2B (байеры).',
  },
  campaigns: {
    label: 'Кампании и промо',
    description:
      'AI кампании, краудфандинг, предзаказы, скидки, акции. Связи: Pre-orders, Production, B2B Orders, Finance.',
  },
  samples: {
    label: 'PR-образцы',
    description:
      'Учёт образцов коллекции для съёмок, редакций и стилистов. Связь с Production (сэмплы, артикулы) и маркетингом (кампании). ROI кампаний — в Аналитике.',
  },
  media: {
    label: 'Медиа и контент',
    description: 'DAM, трансляции, AI-видео. Связь с Products, Showroom и Marketing.',
  },
  'analytics-360': {
    label: 'Аналитика 360',
    description: 'Сквозная стратегическая аналитика',
  },
  'analytics-bi': {
    label: 'BI и отчёты',
    description:
      'Полная статистика бренда: продажи (B2B, дистрибуторы, маркетплейс, аутлет), производство, остатки, клиенты, коллекции. План vs Факт, Phase 2 закупки, дашборды. Интеграция: 1С, Excel, Мой Склад.',
  },
  'ai-analytics': {
    label: 'AI Прогнозы',
    description:
      'Анализ SKU, промо, A/B-тесты. Связи: Analytics 360, BI, Products, Promotions, Finance.',
  },
  'ai-pricing': {
    label: 'Ценообразование',
    description: 'AI инструмент для настройки цен и маржи',
  },
  'budget-actual': {
    label: 'План vs Факт',
    description:
      'Бюджеты закупок, производства, маркетинга и логистики. РФ: рубли, контрагенты, статьи. Инфраструктура под API: ETL в fact_* / snapshot_*, импорт 1С/Мой Склад.',
  },
  finance: {
    label: 'Финансовый хаб',
    description:
      'P&L, факторинг, бюджеты и кассовый контроль. Landed Cost — расчёт полной себестоимости (ткань + CMT + логистика + пошлины). Escrow — безопасные сделки B2B.',
  },
  disputes: {
    label: 'Арбитраж и споры',
    description:
      'B2B-претензии, арбитраж. Escrow — безопасные сделки. Связь с Production, B2B Orders и Finance.',
  },
  esg: {
    label: 'ESG-мониторинг',
    description:
      'Сертификаты, отчёты GRI/CDP, углеродный след. Связь с Production (BOM, материалы), Compliance и Quality.',
  },
  'ai-tools': {
    label: 'AI Инструменты',
    description:
      'Генерация дизайна по описанию, техпакеты. Связь с Production (Tech Pack), Products и Planning.',
  },
  academy: {
    label: 'Академия',
    description: 'Курсы, база знаний, материалы',
  },
  'hr-hub': {
    label: 'HR-центр',
    description:
      'Единый центр: вакансии, резюме, онбординг, обучение. Связь с Командой, Академией, Career.',
  },
};
