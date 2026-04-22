/**
 * Перекрёстные ссылки между модулями Brand OS.
 * Используется в RelatedModulesBlock на страницах disputes, compliance, production и др.
 */
import { ROUTES } from '@/lib/routes';

export type EntityLink = { label: string; href: string };

/** Ссылки для Dispute Hub — арбитраж, претензии, Escrow */
export function getArbitrationLinks(): EntityLink[] {
  return [
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Заявки на изменение', href: ROUTES.brand.orderAmendments },
    { label: 'Возвраты', href: ROUTES.brand.returnsClaims },
    { label: 'Escrow', href: ROUTES.brand.financeEscrow },
    { label: 'LIVE QC', href: ROUTES.brand.processLiveQc },
    { label: 'Календарь', href: ROUTES.brand.calendar },
    { label: 'ЭДО и Compliance', href: ROUTES.brand.compliance },
    { label: 'Сообщения', href: ROUTES.brand.messages },
    { label: 'Production', href: ROUTES.brand.production },
    { label: 'Финансы', href: ROUTES.brand.finance },
  ];
}

/** Ссылки для Compliance — ЭДО, маркировка, сертификация */
export function getComplianceLinks(): EntityLink[] {
  return [
    { label: 'Production', href: ROUTES.brand.production },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'LIVE Compliance', href: ROUTES.brand.processLiveCompliance },
    { label: 'Склад', href: ROUTES.brand.warehouse },
    { label: 'Склад КИЗ', href: ROUTES.brand.complianceStock },
    { label: 'Логистика', href: ROUTES.brand.logistics },
    { label: 'Документы', href: ROUTES.brand.documents },
    { label: 'Dispute Hub', href: ROUTES.brand.disputes },
    { label: 'Gold Sample', href: ROUTES.brand.productionGoldSample },
  ];
}

/** Ссылки для Production — цех, сэмплы, PO, QC */
export function getProductionLinks(): EntityLink[] {
  return [
    { label: 'LIVE Production', href: ROUTES.brand.processLiveProduction },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'ЭДО и Compliance', href: ROUTES.brand.compliance },
    { label: 'Gold Sample', href: ROUTES.brand.productionGoldSample },
    { label: 'Склад', href: ROUTES.brand.warehouse },
    { label: 'Календарь', href: ROUTES.brand.calendar },
    { label: 'Фабрики', href: ROUTES.brand.factories },
    { label: 'Рост платформы (демо)', href: ROUTES.brand.growthHub },
  ];
}

/** Ссылки для Академии — курсы, база знаний, клиенты, материалы */
export function getAcademyLinks(): EntityLink[] {
  return [
    { label: 'Курсы', href: ROUTES.brand.academy },
    { label: 'База знаний', href: ROUTES.brand.academyKnowledge },
    { label: 'Команда', href: ROUTES.brand.academyTeam },
    { label: 'Магазины', href: ROUTES.brand.academyStores },
    { label: 'Клиенты', href: ROUTES.brand.academyClients },
    { label: 'Академия платформы', href: ROUTES.brand.academyPlatform },
    { label: 'Команда бренда', href: ROUTES.brand.team },
    { label: 'Compliance', href: ROUTES.brand.compliance },
  ];
}

/** Ссылки для Финансов — P&L, Escrow, факторинг */
export function getFinanceLinks(): EntityLink[] {
  return [
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Escrow', href: ROUTES.brand.financeEscrow },
    { label: 'Landed Cost', href: ROUTES.brand.financeLandedCost },
    { label: 'ЭДО и Compliance', href: ROUTES.brand.compliance },
    { label: 'Production', href: ROUTES.brand.production },
    { label: 'Логистика', href: ROUTES.brand.logistics },
    { label: 'Dispute Hub', href: ROUTES.brand.disputes },
    { label: 'Документы', href: ROUTES.brand.documents },
  ];
}

/** Ссылки для PIM/Products — коллекции, контент, compliance */
export function getProductLinks(): EntityLink[] {
  return [
    { label: 'Коллекции', href: ROUTES.brand.collections },
    { label: 'Матрица ассортимента', href: ROUTES.brand.productsMatrix },
    { label: 'Content Factory', href: ROUTES.brand.marketingContentFactory },
    { label: 'Media & DAM', href: ROUTES.brand.media },
    { label: 'ЭДО и Compliance', href: ROUTES.brand.compliance },
    { label: 'B2B Шоурум', href: ROUTES.brand.showroom },
    { label: 'Лайншиты', href: ROUTES.brand.b2bLinesheets },
    { label: 'Production', href: ROUTES.brand.production },
    { label: 'Поставщики', href: ROUTES.brand.suppliers },
    { label: 'Рост платформы (демо)', href: ROUTES.brand.growthHub },
  ];
}

/** Ссылки для B2B заказов — FEATURE_BENCHMARK: ship windows, price lists, RFQ, credit */
export function getB2BLinks(): EntityLink[] {
  return [
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Предзаказы', href: ROUTES.brand.preOrders },
    { label: 'Прайс-листы', href: ROUTES.brand.priceLists },
    { label: 'RFQ поставщиков', href: ROUTES.brand.suppliersRfq },
    { label: 'Net terms (РФ)', href: ROUTES.brand.financeRf },
    { label: 'Лайншиты', href: ROUTES.brand.b2bLinesheets },
    { label: 'Production', href: ROUTES.brand.production },
    { label: 'LIVE B2B', href: ROUTES.brand.processLiveB2b },
    { label: 'Заявки на изменение', href: ROUTES.brand.orderAmendments },
    { label: 'ЭДО и Compliance', href: ROUTES.brand.compliance },
    { label: 'Склад', href: ROUTES.brand.warehouse },
    { label: 'Логистика', href: ROUTES.brand.logistics },
    { label: 'Финансы', href: ROUTES.brand.finance },
    { label: 'Dispute Hub', href: ROUTES.brand.disputes },
    { label: 'Сообщения', href: ROUTES.brand.messages },
    { label: 'Календарь', href: ROUTES.brand.calendar },
    { label: 'Выставки', href: ROUTES.brand.tradeShows },
    { label: 'Партнёры', href: ROUTES.brand.retailers },
  ];
}

/** Ссылки для Логистики — B2B, склад, compliance */
export function getLogisticsLinks(): EntityLink[] {
  return [
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'ЭДО и маркировка', href: ROUTES.brand.compliance },
    { label: 'Документы', href: ROUTES.brand.documents },
    { label: 'Возвраты', href: ROUTES.brand.returnsClaims },
    { label: 'Production', href: ROUTES.brand.production },
    { label: 'Склад', href: ROUTES.brand.warehouse },
    { label: 'Интеграции', href: ROUTES.brand.integrations },
  ];
}

/** Ссылки для Интеграций — compliance, documents, team */
export function getIntegrationsLinks(): EntityLink[] {
  return [
    { label: 'Compliance', href: ROUTES.brand.compliance },
    { label: 'Документы', href: ROUTES.brand.documents },
    { label: 'Команда', href: ROUTES.brand.team },
    { label: 'Production', href: ROUTES.brand.production },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Логистика', href: ROUTES.brand.logistics },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Тендеры', href: ROUTES.shop.b2bTenders },
    { label: 'Поиск поставщиков', href: ROUTES.shop.b2bSupplierDiscovery },
    { label: 'Рост платформы (демо)', href: ROUTES.brand.growthHub },
  ];
}

/** Перекрёстные ссылки с хаба роста — без дублирования вкладок страницы */
export function getGrowthPlatformCrossLinks(): EntityLink[] {
  return [
    { label: 'Контроль-центр', href: ROUTES.brand.controlCenter },
    { label: 'PIM / товары', href: ROUTES.brand.products },
    { label: 'Состав и уход (CSV)', href: ROUTES.brand.fabricPassportRollup },
    { label: 'Здоровье атрибутов', href: ROUTES.brand.attributeHealth },
    { label: 'Готовность к запуску', href: ROUTES.brand.launchReadiness },
    { label: 'Медиа галерея SKU', href: ROUTES.brand.mediaGalleryHealth },
    { label: 'Микс ассортимента', href: ROUTES.brand.assortmentMix },
    { label: 'MOQ и короба', href: ROUTES.brand.packRules },
    { label: 'Цены по категориям', href: ROUTES.brand.categoryPricing },
    { label: 'Цветовые ряды', href: ROUTES.brand.colorwayCoverage },
    { label: 'ТН ВЭД и ЕАС', href: ROUTES.brand.tradeCodes },
    { label: 'Управление бандлами', href: ROUTES.brand.bundles },
    { label: 'Упущенный спрос (Waitlist)', href: ROUTES.brand.demandForecast },
    { label: 'Оптовый лайншит', href: ROUTES.brand.linesheet },
    { label: 'Скорость продаж', href: ROUTES.brand.salesVelocity },
    { label: 'Эко-след (LCA)', href: ROUTES.brand.lcaReport },
    { label: 'Права и кредиты (DAM)', href: ROUTES.brand.assetRights },
    { label: 'Предзаказ (B2B PO)', href: ROUTES.brand.wholesalePreorder },
    { label: 'Балансировка остатков', href: ROUTES.brand.inventoryBalance },
    { label: 'B2B Финансы и лимиты', href: ROUTES.brand.b2bFinance },
    { label: 'Анализ пересечения SKU', href: ROUTES.brand.assortmentOverlap },
    { label: 'Здоровье ассортимента', href: ROUTES.brand.assortmentHealth },
    { label: 'KPI поставщиков', href: ROUTES.brand.supplierScorecard },
    { label: 'Калькулятор маржи', href: ROUTES.brand.marginSimulator },
    { label: 'Аналитика возвратов', href: ROUTES.brand.returnIntelligence },
    { label: 'Markdown стратегия', href: ROUTES.brand.markdownPredict },
    { label: 'Календарь байеров', href: ROUTES.brand.showroomAppointments },
    { label: 'A/B тесты дизайна', href: ROUTES.brand.digitalTwinTesting },
    { label: 'OTB Планирование', href: ROUTES.brand.assortmentMixPlanner },
    { label: 'План подсортировки', href: ROUTES.brand.replenishment },
    { label: 'QA Контента (МП)', href: ROUTES.brand.assetCompliance },
    { label: 'Версии B2B кампаний', href: ROUTES.brand.campaignVersions },
    { label: 'Сводный LCA-отчет', href: ROUTES.brand.collectionLca },
    { label: 'Анализ пробелов (Gaps)', href: ROUTES.brand.assortmentGaps },
    { label: 'Ценовая лестница', href: ROUTES.brand.priceLadder },
    { label: 'Визуальная сетка (Merch)', href: ROUTES.brand.visualGrid },
    { label: 'Каннибализация (Overlap)', href: ROUTES.brand.assortmentOverlap },
    { label: 'Маркетплейсы (Mapping)', href: ROUTES.brand.marketplaceMapping },
    { label: 'Здоровье карточек (MP)', href: ROUTES.brand.marketplaceHealth },
    { label: 'Шоурум Планировщик', href: ROUTES.brand.showroomPlanner },
    { label: 'Сессия Шоурума (Live)', href: ROUTES.brand.showroomSession('SH-2026-01') },
    { label: 'Карта спроса (Heatmap)', href: ROUTES.brand.regionalDemand },
    { label: 'Генератор Line Sheets', href: ROUTES.brand.lineSheetGenerator },
    { label: 'Здоровье ассортимента', href: ROUTES.brand.assortmentHealth },
    { label: 'Видимость в поиске (SEO)', href: ROUTES.brand.visibilityIndex },
    { label: 'Карта спроса (Heatmap)', href: ROUTES.brand.regionalDemand },
    { label: 'Локальный сорсинг (СНГ)', href: ROUTES.brand.cisSourcing },
    { label: 'B2B Кампании (V-Control)', href: ROUTES.brand.b2bCampaigns },
    { label: 'Комплаенс и ЭДО (РФ)', href: ROUTES.brand.localCompliance },
    { label: 'Трафик и Погода (Ops)', href: ROUTES.brand.weatherTraffic },
    { label: 'Контроль ОТК (Factory)', href: ROUTES.brand.factoryQc },
    { label: 'Цифровой двойник (демо)', href: ROUTES.brand.productsDigitalTwinTesting },
    { label: 'AI-инструменты', href: ROUTES.brand.aiTools },
    { label: 'Интеграции', href: ROUTES.brand.integrations },
  ];
}

/** Ссылки для Команды — сообщения, календарь, задачи */
export function getTeamLinks(): EntityLink[] {
  return [
    { label: 'Сообщения', href: ROUTES.brand.messages },
    { label: 'Календарь', href: ROUTES.brand.calendar },
    { label: 'Задачи', href: ROUTES.brand.tasks },
    { label: 'Документы', href: ROUTES.brand.documents },
    { label: 'Контроль-центр', href: ROUTES.brand.controlCenter },
    { label: 'Настройки', href: ROUTES.brand.settings },
    { label: 'Академия', href: ROUTES.brand.academy },
  ];
}

/** Ссылки для Настроек — документы, безопасность, подписка */
export function getSettingsLinks(): EntityLink[] {
  return [
    { label: 'Документы', href: ROUTES.brand.documents },
    { label: 'Безопасность', href: ROUTES.brand.security },
    { label: 'Подписка', href: ROUTES.brand.subscription },
    { label: 'Интеграции', href: ROUTES.brand.integrations },
    { label: 'Команда', href: ROUTES.brand.team },
  ];
}

/** Ссылки для Подписки — финансы, документы */
export function getSubscriptionLinks(): EntityLink[] {
  return [
    { label: 'Финансы', href: ROUTES.brand.finance },
    { label: 'Документы', href: ROUTES.brand.documents },
    { label: 'Настройки', href: ROUTES.brand.settings },
    { label: 'Команда', href: ROUTES.brand.team },
  ];
}

/** Ссылки для ESG — Production, Compliance, поставщики, Академия */
export function getEsgLinks(): EntityLink[] {
  return [
    { label: 'Production & BOM', href: ROUTES.brand.production },
    { label: 'ЭДО и Compliance', href: ROUTES.brand.compliance },
    { label: 'Поставщики', href: ROUTES.brand.suppliers },
    { label: 'Фабрики', href: ROUTES.brand.factories },
    { label: 'Materials', href: ROUTES.brand.materials },
    { label: 'Gold Sample', href: ROUTES.brand.productionGoldSample },
    { label: 'Академия', href: ROUTES.brand.academy },
    { label: 'Документы', href: ROUTES.brand.documents },
    { label: 'Команда', href: ROUTES.brand.team },
  ];
}

/** Ссылки для аналитики — BI, план/факт, продажи */
export function getAnalyticsLinks(): EntityLink[] {
  return [
    { label: 'B2B Analytics Hub', href: ROUTES.brand.analyticsBi },
    { label: 'План vs Факт', href: ROUTES.brand.budgetActual },
    { label: 'AI Прогнозы', href: ROUTES.brand.analytics },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Production', href: ROUTES.brand.production },
    { label: 'Финансы', href: ROUTES.brand.finance },
    { label: 'Партнёры', href: ROUTES.brand.retailers },
    { label: 'Compliance', href: ROUTES.brand.compliance },
  ];
}

/** Ссылки для Analytics Phase 2 */
export function getAnalyticsPhase2Links(): EntityLink[] {
  return getAnalyticsLinks();
}

/** Ссылки для Budget Actual */
export function getBudgetActualLinks(): EntityLink[] {
  return getAnalyticsLinks();
}

/** Ссылки для аукционов — закупки, поставщики */
export function getAuctionLinks(): EntityLink[] {
  return [
    { label: 'Поставщики', href: ROUTES.brand.suppliers },
    { label: 'Supplier RFQ', href: ROUTES.brand.suppliersRfq },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Тендеры', href: ROUTES.shop.b2bTenders },
    { label: 'Production', href: ROUTES.brand.production },
    { label: 'Финансы', href: ROUTES.brand.finance },
  ];
}

/** Ссылки для BOPIS — склад, заказы */
export function getBopisLinks(): EntityLink[] {
  return [
    { label: 'Склад', href: ROUTES.brand.warehouse },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'ЭДО и Compliance', href: ROUTES.brand.compliance },
    { label: 'Логистика', href: ROUTES.brand.logistics },
    { label: 'Инвентарь', href: ROUTES.brand.inventory },
  ];
}

/** Ссылки для BNPL (рассрочка) */
export function getBnplLinks(): EntityLink[] {
  return [
    { label: 'Финансы', href: ROUTES.brand.finance },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Escrow', href: ROUTES.brand.financeEscrow },
  ];
}

/** Ссылки для Buyer Onboarding */
export function getBuyerOnboardingLinks(): EntityLink[] {
  return [
    { label: 'Партнёры', href: ROUTES.brand.retailers },
    { label: 'Заявки байеров', href: ROUTES.brand.buyerApplications },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Выставки', href: ROUTES.brand.tradeShows },
  ];
}

/** Ссылки для Client Allergy (аллергии клиентов) */
export function getClientAllergyLinks(): EntityLink[] {
  return [
    { label: 'Клиентская база', href: ROUTES.brand.customers },
    { label: 'CRM', href: ROUTES.brand.customerIntelligence },
    { label: 'Digital Wardrobe', href: ROUTES.client.wardrobe },
  ];
}

/** Ссылки для Client Service Booking */
export function getClientServiceBookingLinks(): EntityLink[] {
  return [
    { label: 'Календарь', href: ROUTES.brand.calendar },
    { label: 'Клиентская база', href: ROUTES.brand.customers },
    { label: 'CRM', href: ROUTES.brand.customerIntelligence },
  ];
}

/** Ссылки для коллекций */
export function getCollectionLinks(): EntityLink[] {
  return [
    { label: 'PIM-центр', href: ROUTES.brand.products },
    { label: 'Матрица ассортимента', href: ROUTES.brand.productsMatrix },
    { label: 'Content Hub', href: ROUTES.brand.contentHub },
    { label: 'Лайншиты', href: ROUTES.brand.b2bLinesheets },
    { label: 'Production', href: ROUTES.brand.production },
    { label: 'B2B Шоурум', href: ROUTES.brand.showroom },
  ];
}

/** Ссылки для хаба «Связь» (сообщения / календарь и соседние модули) */
export function getCommLinks(): EntityLink[] {
  return [
    { label: 'Календарь', href: ROUTES.brand.calendar },
    { label: 'Задачи', href: ROUTES.brand.tasks },
    { label: 'Документы', href: ROUTES.brand.documents },
    { label: 'Live', href: ROUTES.brand.live },
    { label: 'Отзывы', href: ROUTES.brand.reviews },
    { label: 'B2B заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Команда', href: ROUTES.brand.team },
  ];
}

/** Ссылки для Cycle Counting */
export function getCycleCountingLinks(): EntityLink[] {
  return [
    { label: 'Склад', href: ROUTES.brand.warehouse },
    { label: 'Инвентарь', href: ROUTES.brand.inventory },
    { label: 'Логистика', href: ROUTES.brand.logistics },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
  ];
}

/** Ссылки для Digital Twin Testing */
export function getDigitalTwinTestingLinks(): EntityLink[] {
  return [
    { label: 'PIM-центр', href: ROUTES.brand.products },
    { label: 'Коллекции', href: ROUTES.brand.collections },
    { label: 'Production', href: ROUTES.brand.production },
    { label: 'Gold Sample', href: ROUTES.brand.productionGoldSample },
  ];
}

/** Ссылки для Digital Wardrobe */
export function getDigitalWardrobeLinks(): EntityLink[] {
  return [
    { label: 'Клиентская база', href: ROUTES.brand.customers },
    { label: 'CRM', href: ROUTES.brand.customerIntelligence },
    { label: 'Try Before You Buy', href: ROUTES.client.tryBeforeYouBuy },
  ];
}

/** Ссылки для дистрибьюторов */
export function getDistributorLinks(): EntityLink[] {
  return [
    { label: 'Territory Protection', href: ROUTES.brand.distributor.territory },
    { label: 'Pre-Order Quota', href: ROUTES.brand.distributor.preOrderQuota },
    { label: 'Sub-Agent Commission', href: ROUTES.brand.distributor.commissions },
    { label: 'Партнёры', href: ROUTES.brand.retailers },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
  ];
}

/** Ссылки для документов */
export function getDocumentsLinks(): EntityLink[] {
  return [
    { label: 'Compliance', href: ROUTES.brand.compliance },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Production', href: ROUTES.brand.production },
    { label: 'Интеграции', href: ROUTES.brand.integrations },
    { label: 'Команда', href: ROUTES.brand.team },
  ];
}

/** Ссылки для Endless Aisle */
export function getEndlessAisleLinks(): EntityLink[] {
  return [
    { label: 'Инвентарь', href: ROUTES.brand.inventory },
    { label: 'Склад', href: ROUTES.brand.warehouse },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Логистика', href: ROUTES.brand.logistics },
  ];
}

/** Ссылки для Endless Stylist */
export function getEndlessStylistLinks(): EntityLink[] {
  return [
    { label: 'PIM-центр', href: ROUTES.brand.products },
    { label: 'Коллекции', href: ROUTES.brand.collections },
    { label: 'CRM', href: ROUTES.brand.customerIntelligence },
  ];
}

/** Ссылки для Gift Registry */
export function getGiftRegistryLinks(): EntityLink[] {
  return [
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Клиентская база', href: ROUTES.brand.customers },
    { label: 'CRM', href: ROUTES.brand.customerIntelligence },
  ];
}

/** Ссылки для HR Hub */
export function getHRHubLinks(): EntityLink[] {
  return [
    { label: 'Команда', href: ROUTES.brand.team },
    { label: 'Академия', href: ROUTES.brand.academy },
    { label: 'Вакансии', href: ROUTES.shop.career },
  ];
}

/** Ссылки для Integrations (alias) */
export function getIntegrationLinks(): EntityLink[] {
  return getIntegrationsLinks();
}

/** Ссылки для LIA (Local Inventory Ads) */
export function getLiaLinks(): EntityLink[] {
  return [
    { label: 'Промо', href: ROUTES.brand.promotions },
    { label: 'Инвентарь', href: ROUTES.brand.inventory },
    { label: 'PIM-центр', href: ROUTES.brand.products },
  ];
}

/** Ссылки для Linesheet Campaigns */
export function getLinesheetCampaignsLinks(): EntityLink[] {
  return [
    { label: 'Лайншиты', href: ROUTES.brand.b2bLinesheets },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Выставки', href: ROUTES.brand.tradeShows },
    { label: 'Партнёры', href: ROUTES.brand.retailers },
  ];
}

/** Ссылки для маркетинга */
export function getMarketingLinks(): EntityLink[] {
  return [
    { label: 'Content Hub', href: ROUTES.brand.contentHub },
    { label: 'Content Factory', href: ROUTES.brand.marketingContentFactory },
    { label: 'Media & DAM', href: ROUTES.brand.media },
    { label: 'Промо', href: ROUTES.brand.promotions },
    { label: 'Коллекции', href: ROUTES.brand.collections },
    { label: 'B2B Шоурум', href: ROUTES.brand.showroom },
  ];
}

/** Ссылки для Маркетрума */
export function getMarketroomLinks(): EntityLink[] {
  return [
    { label: 'Каталог', href: ROUTES.catalog },
    { label: 'Коллекции', href: ROUTES.brand.collections },
    { label: 'PIM-центр', href: ROUTES.brand.products },
  ];
}

/** Ссылки для B2B заказа (детали заказа) */
export function getOrderLinks(): EntityLink[] {
  return getB2BLinks();
}

/** Ссылки для партнёров */
export function getPartnerLinks(): EntityLink[] {
  return [
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Выставки', href: ROUTES.brand.tradeShows },
    { label: 'Заявки байеров', href: ROUTES.brand.buyerApplications },
    { label: 'Дистрибьюторы', href: ROUTES.brand.distributors },
  ];
}

/** Ссылки для Pre-Order Quota */
export function getPreOrderQuotaLinks(): EntityLink[] {
  return getDistributorLinks();
}

/** Ссылки для Ship From Store */
export function getShipFromStoreLinks(): EntityLink[] {
  return [
    { label: 'Склад', href: ROUTES.brand.warehouse },
    { label: 'Инвентарь', href: ROUTES.brand.inventory },
    { label: 'Логистика', href: ROUTES.brand.logistics },
  ];
}

/** Ссылки для Shop B2B Hub — Фазы 1–4: РФ-специфика, коммерция, AI, удобство байеров */
export function getShopB2BHubLinks(): EntityLink[] {
  return [
    { label: 'Каталог', href: ROUTES.shop.b2bCatalog },
    { label: 'Заказы', href: ROUTES.shop.b2bOrders },
    { label: 'Партнёры', href: ROUTES.shop.b2bPartners },
    { label: 'Тендеры B2B', href: ROUTES.shop.b2bTenders },
    { label: 'Поиск поставщиков', href: ROUTES.shop.b2bSupplierDiscovery },
    { label: 'Collaborative Order', href: ROUTES.shop.b2bCollaborativeOrder },
    { label: 'Margin Calculator', href: ROUTES.shop.b2bMarginCalculator },
    { label: 'AI-поиск', href: ROUTES.shop.b2bAiSearch },
    { label: 'Формирование селекции', href: ROUTES.shop.b2bSelectionBuilder },
    { label: 'Sales App', href: ROUTES.shop.b2bScanner },
    { label: 'Личный кабинет дилера', href: ROUTES.shop.b2bDealerCabinet },
    { label: 'Выставки', href: ROUTES.brand.tradeShows },
  ];
}

/** Ссылки для Shop B2B Orders */
export function getShopB2BOrderLinks(): EntityLink[] {
  return getB2BLinks();
}

/** Ссылки для Style-Me Upsell */
export function getStyleMeUpsellLinks(): EntityLink[] {
  return getMarketingLinks();
}

/** Ссылки для Sub-Agent Commission */
export function getSubAgentCommissionLinks(): EntityLink[] {
  return getDistributorLinks();
}

/** Ссылки для поставщиков */
export function getSupplierLinks(): EntityLink[] {
  return [
    { label: 'Supplier RFQ', href: ROUTES.brand.suppliersRfq },
    { label: 'Production', href: ROUTES.brand.production },
    { label: 'Materials', href: ROUTES.brand.materials },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Тендеры', href: ROUTES.shop.b2bTenders },
    { label: 'Поиск поставщиков', href: ROUTES.shop.b2bSupplierDiscovery },
  ];
}

/** Ссылки для задач */
export function getTaskLinks(): EntityLink[] {
  return getTeamLinks();
}

/** Ссылки для Try Before You Buy (B2C) */
export function getTbybB2CLinks(): EntityLink[] {
  return [
    { label: 'Digital Wardrobe', href: ROUTES.client.wardrobe },
    { label: 'Клиентская база', href: ROUTES.brand.customers },
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
  ];
}

/** Ссылки для Territory Protection */
export function getTerritoryProtectionLinks(): EntityLink[] {
  return getDistributorLinks();
}

/** Ссылки для выставок */
export function getTradeShowLinks(): EntityLink[] {
  return [
    { label: 'B2B Заказы', href: ROUTES.brand.b2bOrders },
    { label: 'Шоурум', href: ROUTES.brand.showroom },
    { label: 'Заявки байеров', href: ROUTES.brand.buyerApplications },
    { label: 'Партнёры', href: ROUTES.brand.retailers },
    { label: 'Лайншиты', href: ROUTES.brand.b2bLinesheets },
  ];
}

/** Элемент сетки модулей в Control Center (`/brand/control-center`) */
export type ModuleHub = {
  id: string;
  label: string;
  href: string;
  desc: string;
  /** ключ из MODULE_ICONS на странице control-center */
  icon: string;
};

/** Модульные хабы — сетка «Все модули» */
export const MODULE_HUBS: ModuleHub[] = [
  { id: 'organization', label: 'Профиль бренда', href: `${ROUTES.brand.profile}?group=profile&tab=brand`, desc: 'Контакты, ДНК, пресс-кит', icon: 'Building2' },
  { id: 'dashboard', label: 'Дашборд', href: ROUTES.brand.dashboard, desc: 'Операционный пульс', icon: 'LayoutDashboard' },
  { id: 'team', label: 'Команда', href: ROUTES.brand.team, desc: 'Участники и доступы', icon: 'Users' },
  { id: 'integrations', label: 'Интеграции', href: ROUTES.brand.integrations, desc: '1С, маркетплейсы, API', icon: 'Zap' },
  { id: 'documents', label: 'Документы и ЭДО', href: ROUTES.brand.documents, desc: 'Договоры, ЭДО, КИЗ', icon: 'FileText' },
  { id: 'settings', label: 'Настройки', href: ROUTES.brand.settings, desc: 'Безопасность, подписка', icon: 'Settings' },
  { id: 'collections', label: 'Коллекции', href: ROUTES.brand.collections, desc: 'Сезоны и коллекции', icon: 'Layers' },
  { id: 'products', label: 'PIM-центр', href: ROUTES.brand.products, desc: 'Карточки и данные SKU', icon: 'Box' },
  { id: 'production', label: 'Производство', href: ROUTES.brand.production, desc: 'Цех и выпуск', icon: 'Factory' },
  { id: 'logistics', label: 'Логистика', href: ROUTES.brand.logistics, desc: 'Перевозки и склады', icon: 'Truck' },
  { id: 'b2b', label: 'Заказы B2B', href: ROUTES.brand.b2bOrders, desc: 'PO, отгрузки, согласования', icon: 'ShoppingCart' },
  { id: 'showroom', label: 'B2B Шоурум', href: ROUTES.brand.showroom, desc: 'Витрина для байеров', icon: 'Globe' },
  { id: 'analytics', label: 'Аналитика 360', href: ROUTES.brand.analytics360, desc: 'Сводная аналитика', icon: 'BarChart3' },
  { id: 'finance', label: 'Финансы', href: ROUTES.brand.finance, desc: 'P&L, Cash Flow', icon: 'DollarSign' },
  { id: 'compliance', label: 'ЭДО и маркировка', href: ROUTES.brand.compliance, desc: 'Compliance, Честный ЗНАК', icon: 'ShieldCheck' },
  { id: 'disputes', label: 'Арбитраж', href: ROUTES.brand.disputes, desc: 'Споры и претензии', icon: 'Gavel' },
  { id: 'messages', label: 'Сообщения', href: ROUTES.brand.messages, desc: 'Чаты команды и партнёров', icon: 'MessageSquare' },
  { id: 'academy', label: 'Академия', href: ROUTES.brand.academy, desc: 'Обучение и база знаний', icon: 'GraduationCap' },
  { id: 'esg', label: 'ESG', href: ROUTES.brand.esg, desc: 'Устойчивое развитие', icon: 'TrendingUp' },
  {
    id: 'platform-growth',
    label: 'Рост платформы',
    href: ROUTES.brand.growthHub,
    desc: 'Клиентские фичи, партнёры, демо без API',
    icon: 'Rocket',
  },
];
