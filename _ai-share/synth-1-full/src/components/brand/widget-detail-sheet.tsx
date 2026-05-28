'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  Target,
  Clock,
  Zap,
  MousePointer2,
  Download,
  Share2,
  ExternalLink,
  ListOrdered,
  Rocket,
  Globe,
  Factory,
  DollarSign,
  Package,
  Users,
  ShieldCheck,
  Briefcase,
  Monitor,
  Tag,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EXCHANGE_RATES } from '@/lib/constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useUIState } from '@/providers/ui-state';
import Link from 'next/link';

export type WidgetType =
  | 'gmv'
  | 'exposure'
  | 'fill_rate'
  | 'retailers'
  | 'actions'
  | 'pipeline'
  | 'stock'
  | 'sales'
  | 'retailer_matrix'
  | 'sessions'
  | 'production'
  | 'finance_health'
  | 'b2c_momentum'
  | 'esg_score'
  | 'market_demand'
  | 'product_sku'
  | 'nps_loyalty'
  | 'finance_roi'
  | 'trend_prediction'
  | 'customer_profiles'
  | 'customer_score'
  | 'returns_rate'
  | 'clv_analysis'
  | 'behavioral_timeline'
  | 'audience_interests'
  | 'ar_engagement'
  | 'geography_radar'
  | 'ai_strategy_optimizer'
  | 'ai_client_optimizer';

interface WidgetDetailSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  widgetType: WidgetType | null;
  period?: 'week' | 'month' | 'year';
}

const MOCK_CHART_DATA = [
  { name: 'Пн', value: 400, prev: 240 },
  { name: 'Вт', value: 300, prev: 139 },
  { name: 'Ср', value: 600, prev: 980 },
  { name: 'Чт', value: 278, prev: 390 },
  { name: 'Пт', value: 589, prev: 480 },
  { name: 'Сб', value: 239, prev: 380 },
  { name: 'Вс', value: 349, prev: 430 },
];

const CHANNEL_DATA = [
  { name: 'B2B Опт', value: 288000000, color: '#4F46E5' },
  { name: 'B2C Омни', value: 84200000, color: '#EC4899' },
  { name: 'Marketroom', value: 12800000, color: '#8B5CF6' },
  { name: 'Outlet', value: 5600000, color: '#F59E0B' },
];

const WIDGET_DATA: Record<WidgetType, any> = {
  gmv: {
    title: 'GMV Сезона (Оборот)',
    description: 'Анализ общего оборота и динамики продаж по всем каналам.',
    why: 'Рост в рублях обусловлен как увеличением объемов отгрузок, так и валютной переоценкой экспортных контрактов. Основной драйвер — коллекция SS26.',
    metrics: [
      { label: 'Текущий период', value: 388000000, status: 'up' },
      { label: 'Прошлый период', value: 312000000, status: 'neutral' },
    ],
    chartType: 'area',
    chartData: MOCK_CHART_DATA,
    isMoney: true,
    hasChannelBreakdown: true,
    pros: ['Высокая востребованность новинок', 'Увеличение среднего чека в рублях'],
    cons: ['Растущие расходы на логистику', 'Волатильность курсов при закупке сырья'],
    complexity:
      'Высокая из-за необходимости ежедневного пересчета валютных контрактов по курсу ЦБ.',
    actions: [
      { label: 'Финансовый центр', href: '/brand/finance', icon: DollarSign },
      { label: 'Аналитика 360', href: '/brand/analytics-360', icon: BarChart3 },
      { label: 'Экспорт отчета', icon: Download },
    ],
  },
  exposure: {
    title: 'Кредитный риск (Exposure)',
    description: 'Оценка дебиторской задолженности в рублях.',
    why: 'Все лимиты зафиксированы в рублях для минимизации валютных рисков ритейлеров на территории РФ.',
    metrics: [
      { label: 'Занято лимитов', value: 166410000, status: 'up' },
      { label: 'Свободно', value: 295000000, status: 'neutral' },
    ],
    chartType: 'bar',
    chartData: MOCK_CHART_DATA,
    isMoney: true,
    pros: ['Низкий уровень просрочек', 'Страхование сделок через РЭЦ'],
    cons: ['Растущая стоимость заемного капитала (ключевая ставка)'],
    complexity: 'Требует интеграции with системами скоринга и ERP.',
    actions: [
      { label: 'Фин. аналитика', href: '/brand/finance', icon: DollarSign },
      { label: 'Скоринг партнеров', href: '/brand/retailers', icon: Target },
      { label: 'Лимиты кредитования', icon: ExternalLink },
    ],
  },
  pipeline: {
    title: 'Воронка GMV',
    description: 'Движение заказов в рублях от черновика до оплаты.',
    why: '72% конверсия в подтвержденные заказы. Фиксация цены в рублях на этапе подтверждения защищает маржу.',
    metrics: [
      { label: 'Подтверждено', value: 194000000, status: 'up' },
      { label: 'В ожидании', value: 110900000, status: 'neutral' },
    ],
    chartType: 'bar',
    chartData: [
      { name: 'Черновики', value: 78500000 },
      { name: 'Согласование', value: 110900000 },
      { name: 'Подтверждено', value: 194000000 },
    ],
    isMoney: true,
    pros: ['Прозрачность рублевых поступлений', 'Точное планирование кэш-флоу'],
    cons: ['Длительный цикл согласования крупных контрактов'],
    complexity: 'Многоэтапное утверждение скидок и бонусных программ.',
    actions: [
      { label: 'Аналитика 360', href: '/brand/analytics-360', icon: BarChart3 },
      { label: 'Все заказы', href: '/brand/b2b-orders', icon: ListOrdered },
      { label: 'Ускорить воронку', icon: Rocket },
    ],
  },
  sales: {
    title: 'Лидерборд продаж',
    description: 'Эффективность менеджеров в рублях.',
    why: 'Система мотивации привязана к рублевой выручке. Анна Б. перевыполнила план на 12%.',
    metrics: [
      { label: 'Лучший результат', value: 110940000, status: 'up' },
      { label: 'Среднее по отделу', value: 59000000, status: 'neutral' },
    ],
    chartType: 'bar',
    chartData: [
      { name: 'Анна Б.', value: 110940000 },
      { name: 'Марк В.', value: 78580000 },
      { name: 'Елена К.', value: 65400000 },
      { name: 'Иван П.', value: 42000000 },
    ],
    isMoney: true,
    pros: ['Здоровая конкуренция', 'Прозрачные KPI'],
    cons: ['Разрыв в доходности регионов'],
    complexity: 'Сложный расчет бонусов с учетом возвратов.',
    actions: [
      { label: 'Команда', href: '/brand/staff', icon: MousePointer2 },
      { label: 'План продаж', href: '/brand/analytics', icon: Target },
    ],
  },
  retailer_matrix: {
    title: 'ТОП Ритейлеры',
    description: 'Объем закупок ключевых партнеров в рублях.',
    why: 'Крупнейшие сети (ЦУМ, Podium) полностью перешли на расчеты в рублях через российские юрлица.',
    metrics: [
      { label: 'Объем якорных', value: 323500000, status: 'up' },
      { label: 'Health Score (Avg)', value: '91%', status: 'neutral' },
    ],
    chartType: 'area',
    chartData: MOCK_CHART_DATA,
    isMoney: true,
    pros: ['Стабильность выплат', 'Глубокая интеграция'],
    cons: ['Зависимость от политики закупок ТОП-3 сетей'],
    complexity: 'Индивидуальные графики оплат и ретро-бонусы.',
    actions: [
      { label: 'Все партнеры', href: '/brand/retailers', icon: ExternalLink },
      { label: 'Карта ритейла', href: '/brand/retailers', icon: Share2 },
    ],
  },
  fill_rate: {
    title: 'Выполнение заказов (Fill Rate)',
    description: 'Процент отгрузки от заказанного объема.',
    why: '94.2% — результат оптимизации цепочки поставок.',
    metrics: [
      { label: 'Точность отгрузки', value: '94.2%', status: 'up' },
      { label: 'Цель', value: '96%', status: 'neutral' },
    ],
    chartType: 'line',
    chartData: [
      { name: 'Янв', value: 88 },
      { name: 'Фев', value: 90 },
      { name: 'Мар', value: 94 },
      { name: 'Апр', value: 93 },
      { name: 'Май', value: 95 },
    ],
    isMoney: false,
    pros: ['Лояльность байеров'],
    cons: ['Дефицит конкретных SKU'],
    complexity: 'Синхронизация производства.',
    actions: [
      { label: 'Сток и остатки', href: '/brand/inventory', icon: Package },
      { label: 'Все заказы', href: '/brand/b2b-orders', icon: ListOrdered },
      { label: 'План производства', href: '/brand/production', icon: Factory },
    ],
  },
  stock: {
    title: 'Сток vs Спрос',
    description: 'Баланс остатков и прогноза продаж.',
    why: 'Дефицит Outerwear требует срочного дозаказа.',
    metrics: [
      { label: 'Дефицит', value: -450, status: 'down' },
      { label: 'Излишек', value: 820, status: 'neutral' },
    ],
    chartType: 'bar',
    chartData: [
      { name: 'Outerwear', value: -450 },
      { name: 'Pants', value: 820 },
      { name: 'Shirts', value: 300 },
      { name: 'Shoes', value: -120 },
    ],
    isMoney: false,
    pros: ['Быстрое выявление хитов'],
    cons: ['Упущенная выгода'],
    complexity: 'AI прогнозирование.',
    actions: [
      { label: 'VMI Portal', href: '/brand/vmi', icon: Zap },
      { label: 'Инвентарь', href: '/brand/inventory', icon: Package },
      { label: 'Заказать товар', icon: Rocket },
    ],
  },
  actions: {
    title: 'Центр действий AI',
    description: 'Срочные задачи требующие внимания.',
    why: 'Блокировки в PIM и ожидающие подтверждения B2B заказы.',
    metrics: [{ label: 'Срочные задачи', value: 3, status: 'down' }],
    chartType: 'bar',
    chartData: [
      { name: 'PIM', value: 12 },
      { name: 'Orders', value: 5 },
      { name: 'Retail', value: 8 },
    ],
    pros: ['Мгновенная реакция'],
    cons: ['Риск простоя'],
    complexity: 'Real-time мониторинг всех бизнес-процессов.',
    isMoney: false,
    actions: [
      { label: 'Перейти к задачам', href: '/brand/tasks', icon: ListOrdered },
      { label: 'Аналитика 360', href: '/brand/analytics-360', icon: BarChart3 },
    ],
  },
  retailers: {
    title: 'Активные ритейлеры',
    description: 'Кол-во партнеров.',
    why: 'Выставки и CRM.',
    metrics: [{ label: 'Всего', value: 128, status: 'up' }],
    chartType: 'area',
    chartData: MOCK_CHART_DATA,
    pros: ['Рост базы'],
    cons: ['Нагрузка на сервис'],
    complexity: 'Скоринг.',
    isMoney: false,
    actions: [
      { label: 'База партнеров', href: '/brand/retailers', icon: Users },
      { label: 'Клиентский интеллект', href: '/brand/customer-intelligence', icon: Zap },
    ],
  },
  sessions: {
    title: 'Предстоящие сессии',
    description: 'График встреч.',
    why: 'Окно заказов SS26.',
    metrics: [{ label: 'Сессий', value: 14, status: 'up' }],
    chartType: 'bar',
    chartData: MOCK_CHART_DATA,
    pros: ['Контакт'],
    cons: ['Нагрузка'],
    complexity: 'Логистика образцов.',
    isMoney: false,
    actions: [{ label: 'Календарь', href: '/brand/calendar', icon: Calendar }],
  },
  production: {
    title: 'Пульс производства',
    description: 'Текущий статус фабрик и готовность коллекций.',
    why: 'Линия FW26 запущена на 68%. Все фабрики подтвердили график.',
    metrics: [
      { label: 'Готовность', value: 68, status: 'up' },
      { label: 'Фабрик онлайн', value: 12, status: 'neutral' },
    ],
    chartType: 'area',
    chartData: MOCK_CHART_DATA,
    pros: ['Контроль IoT', 'Прямой доступ к камерам'],
    cons: ['Задержки логистики сырья'],
    complexity: 'IoT интеграция with производственными линиями в реальном времени.',
    isMoney: false,
    actions: [
      { label: 'Центр производства', href: '/brand/production', icon: Factory },
      { label: 'Сток сырья', href: '/brand/inventory', icon: Package },
    ],
  },
  finance_health: {
    title: 'Финансовое Здоровье',
    description: 'Ликвидность, кэш-флоу и финансовая устойчивость.',
    why: 'Коэффициент ликвидности 2.4 — выше среднего по отрасли.',
    metrics: [
      { label: 'Ликвидность', value: 2.4, status: 'up' },
      { label: 'Кэш на счету', value: 84200000, status: 'up' },
    ],
    chartType: 'line',
    chartData: MOCK_CHART_DATA,
    pros: ['Высокая устойчивость', 'Низкая долговая нагрузка'],
    cons: ['Высокая стоимость заемного капитала'],
    complexity: 'Автоматическая консолидация данных из 4 банков.',
    isMoney: true,
    actions: [
      { label: 'Фин. аналитика', href: '/brand/finance', icon: DollarSign },
      { label: 'Аналитика 360', href: '/brand/analytics-360', icon: BarChart3 },
    ],
  },
  b2c_momentum: {
    title: 'B2C Импульс',
    description: 'Динамика предзаказов и розничных продаж.',
    why: 'Успешная кампания на Kickstarter и рост прямой розницы.',
    metrics: [
      { label: 'Предзаказы', value: 12400000, status: 'up' },
      { label: 'Бэкеры', value: 840, status: 'up' },
    ],
    chartType: 'area',
    chartData: MOCK_CHART_DATA,
    pros: ['Прямой контакт с аудиторией', 'Быстрые тесты коллекций'],
    cons: ['Зависимость от маркетинговых вложений'],
    complexity: 'Интеграция с Shopify, Kickstarter и внутренним PIM.',
    isMoney: true,
    actions: [
      { label: 'Все предзаказы', href: '/brand/pre-orders', icon: Rocket },
      { label: 'Клиентский интеллект', href: '/brand/customer-intelligence', icon: Zap },
    ],
  },
  esg_score: {
    title: 'ESG Дашборд',
    description: 'Рейтинг устойчивого развития и социальной ответственности.',
    why: 'Рейтинг A+ подтвержден переходом на 80% переработанного нейлона.',
    metrics: [
      { label: 'ESG Рейтинг', value: 'A+', status: 'up' },
      { label: 'CO2 След', value: -12, status: 'down' },
    ],
    chartType: 'bar',
    chartData: MOCK_CHART_DATA,
    pros: ['Привлекательность для фондов', 'Лояльность Gen Z'],
    cons: ['Высокая себестоимость эко-сырья'],
    complexity: 'Аудит всей цепочки поставок от фабрик до упаковки.',
    isMoney: false,
    actions: [
      { label: 'ESG Центр', href: '/brand/esg', icon: Globe },
      { label: 'Аналитика 360', href: '/brand/analytics-360', icon: BarChart3 },
    ],
  },
  market_demand: {
    title: 'Рынок и Спрос',
    description: 'Глобальный анализ интереса к бренду.',
    why: 'Рост на 22% в Скандинавии подтверждает правильность выбора зимней коллекции.',
    metrics: [
      { label: 'Рост спроса', value: '+22%', status: 'up' },
      { label: 'Hot Zone', value: 'Scandinavia', status: 'neutral' },
    ],
    chartType: 'area',
    chartData: MOCK_CHART_DATA,
    pros: ['Высокий виральный потенциал', 'Новые рынки сбыта'],
    cons: ['Логистические барьеры в ОАЭ'],
    complexity: 'Агрегация данных из Google Trends и соцсетей.',
    isMoney: false,
    actions: [{ label: 'Перейти в Шоурум', href: '/brand/showroom', icon: Globe }],
  },
  product_sku: {
    title: 'Продукт и SKU',
    description: 'Здоровье ассортиментной матрицы.',
    why: '84% SKU показывают целевую оборачиваемость. Проблемная зона — аксессуары.',
    metrics: [
      { label: 'Здоровье матрицы', value: '84%', status: 'up' },
      { label: 'Best Seller', value: 'Parka v2', status: 'neutral' },
    ],
    chartType: 'bar',
    chartData: MOCK_CHART_DATA,
    pros: ['Оптимальная глубина стока', 'Высокий Sell-through'],
    cons: ['Неликвид в летней коллекции'],
    complexity: 'Интеграция с PIM и данными продаж.',
    isMoney: false,
    actions: [{ label: 'Управление SKU', href: '/brand/products', icon: Package }],
  },
  nps_loyalty: {
    title: 'Клиенты и NPS',
    description: 'Лояльность и удовлетворенность.',
    why: 'NPS 65 — лидерский показатель в сегменте Premium Techwear.',
    metrics: [
      { label: 'NPS Score', value: '65', status: 'up' },
      { label: 'Удовлетворенность', value: '88%', status: 'up' },
    ],
    chartType: 'line',
    chartData: MOCK_CHART_DATA,
    pros: ['Высокий процент возвратов клиентов', 'Позитивный Sentiment'],
    cons: ['Жалобы на сроки доставки в регионы'],
    complexity: 'Анализ отзывов через NLP-модели AI.',
    isMoney: false,
    actions: [{ label: 'База клиентов', href: '/brand/customers', icon: Users }],
  },
  finance_roi: {
    title: 'Финансы и ROI',
    description: 'Эффективность маркетинговых инвестиций.',
    why: 'ROI 4.2x достигнут за счет оптимизации кампаний в TikTok.',
    metrics: [
      { label: 'ROI', value: '4.2x', status: 'up' },
      { label: 'ROAS', value: '5.2x', status: 'up' },
    ],
    chartType: 'area',
    chartData: MOCK_CHART_DATA,
    pros: ['Эффективная юнит-экономика', 'Низкий CAC'],
    cons: ['Рост стоимости клика в Google Ads'],
    complexity: 'Сквозная аналитика от клика до чека.',
    isMoney: false,
    actions: [{ label: 'Финансовый центр', href: '/brand/finance', icon: DollarSign }],
  },
  trend_prediction: {
    title: 'Прогноз трендов (AI)',
    description: 'Предиктивная аналитика спроса.',
    why: 'AI предсказывает пик спроса на "Techno-Minimalism" через 2 месяца.',
    metrics: [
      { label: 'Точность прогноза', value: '92%', status: 'up' },
      { label: 'Trend Spike', value: '+140%', status: 'up' },
    ],
    chartType: 'area',
    chartData: MOCK_CHART_DATA,
    pros: ['Раннее обнаружение хитов', 'Снижение рисков стока'],
    cons: ['Зависимость от внешних данных'],
    complexity: 'Глубокое обучение на исторических данных платформы.',
    isMoney: false,
    actions: [{ label: 'Аналитика 360', href: '/brand/analytics-360', icon: BarChart3 }],
  },
  customer_profiles: {
    title: 'Профили клиентов',
    description: 'Анализ базы активных пользователей.',
    why: 'Рост на 12% за счет успешной интеграции с рекламными кабинетами и ретаргетинга.',
    metrics: [
      { label: 'Активные профили', value: 12482, status: 'up' },
      { label: 'Новые за период', value: 1420, status: 'up' },
    ],
    chartType: 'area',
    chartData: MOCK_CHART_DATA,
    isMoney: false,
    actions: [
      { label: 'База клиентов', href: '/brand/customers', icon: Users },
      { label: 'Клиентский интеллект', href: '/brand/customer-intelligence', icon: Zap },
    ],
  },
  customer_score: {
    title: 'Качество аудитории',
    description: 'Интегральный показатель здоровья клиентской базы.',
    why: '98/100 — результат высокого вовлечения в AR-примерочные и лояльности к SS26.',
    metrics: [
      { label: 'Customer Score', value: '98/100', status: 'up' },
      { label: 'Engagement Rate', value: '74%', status: 'up' },
    ],
    chartType: 'line',
    chartData: MOCK_CHART_DATA,
    isMoney: false,
    actions: [
      { label: 'Аналитика 360', href: '/brand/analytics-360', icon: BarChart3 },
      { label: 'Клиентский интеллект', href: '/brand/customer-intelligence', icon: Zap },
    ],
  },
  returns_rate: {
    title: 'Возвраты и Лояльность',
    description: 'Мониторинг отказов и удовлетворенности.',
    why: 'Снижение до 4.2% благодаря точному подбору размера в AR-модуле.',
    metrics: [
      { label: 'Доля возвратов', value: '4.2%', status: 'down' },
      { label: 'Экономия на логистике', value: 1240000, status: 'up' },
    ],
    chartType: 'bar',
    chartData: MOCK_CHART_DATA,
    isMoney: false,
    actions: [
      { label: 'Сток и остатки', href: '/brand/inventory', icon: Package },
      { label: 'Центр заказов', href: '/brand/b2b-orders', icon: ListOrdered },
    ],
  },
  clv_analysis: {
    title: 'LTV (Пожизненная ценность)',
    description: 'Прогноз и факт выручки на одного клиента.',
    why: 'Средний чек вырос на 5.4% за счет персональных AI-рекомендаций в корзине.',
    metrics: [
      { label: 'LTV (Avg)', value: 142000, status: 'up' },
      { label: 'ROI на клиента', value: '4.5x', status: 'up' },
    ],
    chartType: 'area',
    chartData: MOCK_CHART_DATA,
    isMoney: true,
    actions: [
      { label: 'Фин. центр', href: '/brand/finance', icon: DollarSign },
      { label: 'Клиентский интеллект', href: '/brand/customer-intelligence', icon: Zap },
    ],
  },
  behavioral_timeline: {
    title: 'Поведенческая активность',
    description: 'Анализ цепочки действий до совершения покупки.',
    why: 'AR-примерочная стала ключевым этапом: 82% покупок совершаются после примерки.',
    metrics: [
      { label: 'AR Конверсия', value: '82%', status: 'up' },
      { label: 'Время сессии', value: '14 мин', status: 'up' },
    ],
    chartType: 'line',
    chartData: MOCK_CHART_DATA,
    isMoney: false,
    actions: [
      { label: 'Клиентский интеллект', href: '/brand/customer-intelligence', icon: Zap },
      { label: 'Продукты', href: '/brand/products', icon: Package },
    ],
  },
  audience_interests: {
    title: 'Матрица интересов',
    description: 'Анализ предпочтений по категориям и стилям.',
    why: 'Рост интереса к Techwear / Urban обусловлен коллаборацией с цифровыми художниками.',
    metrics: [
      { label: 'Affinity Score', value: '92%', status: 'up' },
      { label: 'Top Category', value: 'Outerwear', status: 'neutral' },
    ],
    chartType: 'bar',
    chartData: [
      { name: 'Techwear', value: 92 },
      { name: 'Casual', value: 45 },
      { name: 'Sport', value: 68 },
      { name: 'Eco', value: 78 },
    ],
    isMoney: false,
    actions: [
      { label: 'Аналитика 360', href: '/brand/analytics-360', icon: BarChart3 },
      { label: 'Шоурум', href: '/brand/showroom', icon: Globe },
    ],
  },
  ar_engagement: {
    title: 'AR-активность',
    description: 'Использование технологий дополненной реальности.',
    why: 'Пик активности приходится на вечернее время. AR-примерка снижает Churn на этапе корзины.',
    metrics: [
      { label: 'Использование AR', value: '64%', status: 'up' },
      { label: 'Mobile share', value: '88%', status: 'up' },
    ],
    chartType: 'area',
    chartData: MOCK_CHART_DATA,
    isMoney: false,
    actions: [
      { label: 'Управление SKU', href: '/brand/products', icon: Package },
      { label: 'Продуктовый паспорт', href: '/brand/products', icon: ShieldCheck },
    ],
  },
  geography_radar: {
    title: 'География спроса',
    description: 'Анализ рынков РФ, СНГ и ключевых городов.',
    why: 'Центральный регион РФ (Москва, СПб) и Казахстан (Алматы) лидируют по объему предзаказов.',
    metrics: [
      { label: 'Топ город РФ', value: 'Москва', status: 'up' },
      { label: 'Топ СНГ', value: 'Алматы', status: 'up' },
    ],
    chartType: 'bar',
    chartData: [
      { name: 'Москва', value: 45 },
      { name: 'СПб', value: 28 },
      { name: 'Алматы', value: 22 },
      { name: 'Казань', value: 15 },
    ],
    isMoney: false,
    actions: [
      { label: 'Гео-карта', href: '/brand/showroom', icon: Globe },
      { label: 'Фин. центр', href: '/brand/finance', icon: DollarSign },
    ],
  },
  ai_strategy_optimizer: {
    title: 'AI Оптимизатор стратегии',
    description: 'Автоматические рекомендации по развитию бизнеса.',
    why: 'AI выявил потенциал роста в категории Outerwear на 15% при смещении фокуса на Gen Z.',
    metrics: [
      { label: 'Potential ROI', value: '24%', status: 'up' },
      { label: 'Risk Level', value: 'Low', status: 'neutral' },
    ],
    chartType: 'area',
    chartData: MOCK_CHART_DATA,
    isMoney: false,
    actions: [
      { label: 'Аналитика 360', href: '/brand/analytics-360', icon: BarChart3 },
      { label: 'Задачи и Цели', href: '/brand/tasks', icon: Target },
    ],
  },
  ai_client_optimizer: {
    title: 'AI Клиентский оптимизатор',
    description: 'Индивидуальные рекомендации по работе с базой.',
    why: 'Анализ поведения 12к+ профилей позволил выявить паттерны оттока и вовремя предложить офферы.',
    metrics: [
      { label: 'Retention Boost', value: '+18%', status: 'up' },
      { label: 'LTV Uplift', value: '+5.4%', status: 'up' },
    ],
    chartType: 'bar',
    chartData: MOCK_CHART_DATA,
    isMoney: false,
    actions: [
      { label: 'База клиентов', href: '/brand/customers', icon: Users },
      { label: 'Задачи и Цели', href: '/brand/tasks', icon: Target },
    ],
  },
};

export function WidgetDetailSheet({
  isOpen,
  onOpenChange,
  widgetType,
  period: propPeriod,
}: WidgetDetailSheetProps) {
  const { dashboardPeriod } = useUIState();
  const period = propPeriod || dashboardPeriod;
  if (!widgetType) return null;
  const data = WIDGET_DATA[widgetType];

  const periodMultiplier = period === 'week' ? 0.25 : period === 'year' ? 12 : 1;

  const formatValue = (val: any) => {
    if (typeof val !== 'number') return val;
    if (data.isMoney) {
      const scaled = val * periodMultiplier;
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
      }).format(scaled);
    }
    return val.toLocaleString('ru-RU');
  };

  const getEquiv = (val: any) => {
    if (typeof val !== 'number' || !data.isMoney) return null;
    const scaled = val * periodMultiplier;
    const usd = (scaled / EXCHANGE_RATES.USD).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
    const eur = (scaled / EXCHANGE_RATES.EUR).toLocaleString('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });
    return `${usd} / ${eur}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="bg-bg-surface2 w-full overflow-y-auto border-none p-0 font-sans sm:max-w-[520px]">
        <div className="bg-text-primary sticky top-0 z-20 p-4 text-white shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-accent-primary rounded-xl p-2">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <Badge
                variant="outline"
                className="h-5 border-white/20 px-2 text-[8px] font-black uppercase tracking-widest text-white/60"
              >
                Аналитика: {period === 'week' ? 'Неделя' : period === 'month' ? 'Месяц' : 'Год'}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-white/40 hover:bg-white/10 hover:text-white"
            >
              <ArrowRight className="h-5 w-5 rotate-180" />
            </Button>
          </div>
          <SheetTitle className="text-sm font-black uppercase tracking-tight text-white">
            {data.title}
          </SheetTitle>
          <SheetDescription className="text-text-muted mt-2 text-xs font-medium leading-relaxed">
            {data.description}
          </SheetDescription>
        </div>

        <div className="space-y-4 p-4">
          {/* Main Chart */}
          <div className="border-border-subtle h-[300px] rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                Тренд показателей
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="bg-accent-primary h-1.5 w-1.5 rounded-full" />
                  <span className="text-text-muted text-[7px] font-bold uppercase">Текущий</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="bg-border-subtle h-1.5 w-1.5 rounded-full" />
                  <span className="text-text-muted text-[7px] font-bold uppercase">Прошлый</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              {data.chartType === 'area' ? (
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '10px',
                      fontWeight: 'bold',
                    }}
                    cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="prev"
                    stroke="#e2e8f0"
                    strokeWidth={2}
                    fill="transparent"
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              ) : data.chartType === 'bar' ? (
                <BarChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 8, fontWeight: 800, fill: '#94a3b8' }}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '10px',
                      fontWeight: 'bold',
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {data.chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.value < 0 ? '#f43f5e' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <LineChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '10px',
                      fontWeight: 'bold',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Channel Breakdown (If available) */}
          {data.hasChannelBreakdown && (
            <div className="bg-text-primary space-y-6 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase tracking-tight">Срез по каналам</h4>
                  <p className="text-accent-primary text-[8px] font-bold uppercase tracking-[0.2em]">
                    Omnichannel Distribution
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <Globe className="text-accent-primary h-5 w-5" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-32 w-32 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CHANNEL_DATA}
                        innerRadius={35}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {CHANNEL_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1 space-y-3">
                  {CHANNEL_DATA.map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-black uppercase">
                        <span className="text-text-muted flex items-center gap-1.5">
                          <div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}
                        </span>
                        <span>
                          {new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'RUB',
                            maximumFractionDigits: 0,
                          }).format(item.value * periodMultiplier)}
                        </span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(item.value / 388000000) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {data.metrics.map((m: any, i: number) => (
              <div
                key={i}
                className="border-border-subtle hover:border-accent-primary/20 group rounded-[1.5rem] border bg-white p-3 shadow-sm transition-colors"
              >
                <p className="text-text-muted group-hover:text-accent-primary mb-1 text-[8px] font-black uppercase tracking-widest transition-colors">
                  {m.label}
                </p>
                <div className="space-y-1">
                  <div className="flex items-end justify-between">
                    <span className="text-text-primary text-base font-black tabular-nums leading-none">
                      {formatValue(m.value)}
                    </span>
                    {m.status && m.status !== 'neutral' && (
                      <div
                        className={cn(
                          'flex items-center gap-1 text-[9px] font-black uppercase',
                          m.status === 'up' ? 'text-emerald-500' : 'text-rose-500'
                        )}
                      >
                        {m.status === 'up' ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                      </div>
                    )}
                  </div>
                  {data.isMoney && (
                    <p className="text-text-muted text-[8px] font-bold uppercase tabular-nums">
                      ≈ {getEquiv(m.value)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights & Detailed Analysis */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Zap className="h-4 w-4 text-amber-500" />
              <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
                AI Анализ и Рекомендация
              </h4>
            </div>
            <div className="bg-accent-primary/10 border-accent-primary/20 text-text-primary relative overflow-hidden rounded-xl border p-4 text-[11px] font-medium italic leading-relaxed shadow-inner">
              <div className="absolute right-0 top-0 p-4 opacity-5">
                <Sparkles className="h-12 w-12" />
              </div>
              «{data.why}»
            </div>
          </div>

          {/* Action Hub */}
          <div className="grid grid-cols-2 gap-3">
            {data.actions?.map((action: any, i: number) => (
              <Button
                key={i}
                asChild={!!action.href}
                variant="outline"
                className="border-border-subtle text-text-secondary hover:bg-text-primary/90 h-12 rounded-2xl bg-white text-[9px] font-black uppercase tracking-widest shadow-sm transition-all hover:text-white"
              >
                {action.href ? (
                  <Link href={action.href}>
                    {action.icon && <action.icon className="mr-2 h-3.5 w-3.5" />}
                    {action.label}
                  </Link>
                ) : (
                  <div className="flex items-center">
                    {action.icon && <action.icon className="mr-2 h-3.5 w-3.5" />}
                    {action.label}
                  </div>
                )}
              </Button>
            ))}
          </div>

          {/* Pros & Cons */}
          {data.pros && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="border-border-subtle space-y-4 rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
                    Преимущества
                  </h4>
                </div>
                <ul className="space-y-3">
                  {data.pros.map((p: string, i: number) => (
                    <li
                      key={i}
                      className="text-text-secondary flex items-start gap-2 text-[10px] font-medium leading-relaxed"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-border-subtle space-y-4 rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                  <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
                    Риски и барьеры
                  </h4>
                </div>
                <ul className="space-y-3">
                  {data.cons.map((c: string, i: number) => (
                    <li
                      key={i}
                      className="text-text-secondary flex items-start gap-2 text-[10px] font-medium leading-relaxed"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Complexity Footnote */}
          <div className="bg-bg-surface2 border-border-default flex items-start gap-3 rounded-xl border p-4">
            <div className="rounded-xl bg-white p-2 shadow-sm">
              <Info className="text-text-muted h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-text-muted text-[8px] font-black uppercase">
                Техническое примечание
              </p>
              <p className="text-text-secondary text-[10px] font-medium italic leading-relaxed">
                {data.complexity}
              </p>
            </div>
          </div>

          <div className="pb-12 pt-4">
            <Button className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/10 group h-10 w-full rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl">
              Скачать полный аналитический отчет{' '}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
