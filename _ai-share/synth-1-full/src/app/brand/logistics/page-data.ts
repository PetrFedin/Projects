/**
 * Данные для раздела «Логистика» бренда.
 * Оформление как в разделе «Организация»: секции, карточки, метрики.
 * Контент для российского бизнеса: склады, перевозчики, доставка, таможня, документы, маркировка.
 */

import {
  Truck,
  Package,
  Warehouse,
  FileText,
  MapPin,
  Globe,
  Ship,
  ClipboardList,
  RefreshCw,
  Zap,
  ShieldCheck,
  BarChart3,
  Calculator,
  Route,
} from 'lucide-react';
import type { SectionMeta } from '@/components/brand/SectionBlock';

export const SECTION_META: Record<string, SectionMeta> = {
  overview: {
    description:
      'Ключевые показатели логистики бренда: отгрузки, грузы в пути, склады, подключённые перевозчики.',
    purpose: 'Быстро оценить объём и статус логистических операций.',
    functionality: [
      'Отгрузки за период',
      'Грузы в пути',
      'Склады и остатки',
      'Перевозчики и службы доставки',
    ],
    importance: 9,
  },
  warehouses: {
    description:
      'Складской учёт, остатки, приёмка и отгрузка. Интеграция с маркировкой (Честный ЗНАК, КИЗ).',
    purpose: 'Контроль остатков по складам и корректность отгрузок с учётом маркировки.',
    functionality: [
      'Остатки по складам и SKU',
      'Приёмка и отгрузка',
      'КИЗ и маркировка при отгрузке',
      'Резервы и доступность',
    ],
    importance: 9,
  },
  carriers: {
    description:
      'Перевозчики и службы доставки: СДЭК, Боксберри, ПЭК, ДПД, Почта России, международные.',
    purpose:
      'Управление договорами, тарифами и интеграциями с курьерскими службами и транспортными компаниями.',
    functionality: [
      'Подключённые СДЭК, Боксберри, ПЭК',
      'Тарифы и зоны доставки',
      'Забор и доставка до двери',
      'Международные перевозки',
    ],
    importance: 8,
  },
  documents: {
    description: 'Транспортные и товаросопроводительные документы: ТТН, CMR, накладные, ЭТрН, УПД.',
    purpose: 'Формирование и хранение документов для перевозок и приёмки у партнёров.',
    functionality: [
      'ТТН (товарно-транспортная накладная)',
      'CMR (международная перевозка)',
      'ЭТрН (электронная ТрН)',
      'УПД и накладные для ЭДО',
    ],
    importance: 8,
  },
  customs: {
    description:
      'Таможня и пошлины: ЕАЭС, декларации, расчёт полной себестоимости (DDP, landed cost).',
    purpose: 'Корректное таможенное оформление и учёт пошлин при импорте/экспорте.',
    functionality: [
      'Расчёт пошлин и налогов (DDP)',
      'Декларации ЕАЭС',
      'Landed cost и полная себестоимость',
      'Сертификаты и разрешения',
    ],
    importance: 8,
  },
  tracking: {
    description: 'Отслеживание отправлений и трекинг в реальном времени по всем перевозчикам.',
    purpose: 'Видеть статус каждой отправки и информировать клиентов и партнёров.',
    functionality: [
      'Трекинг по трек-номерам',
      'Статусы СДЭК, Боксберри, ПЭК',
      'Уведомления о доставке',
      'История перемещений',
    ],
    importance: 7,
  },
  regions: {
    description: 'Регионы доставки, сроки и условия: РФ, СНГ, зоны и тарифы перевозчиков.',
    purpose: 'Прозрачные сроки и стоимость доставки по регионам для B2B и B2C.',
    functionality: [
      'Регионы РФ и СНГ',
      'Сроки доставки по зонам',
      'Условия Ex-Works, DDP, до двери',
      'Ограничения и особая логистика',
    ],
    importance: 7,
  },
  returns: {
    description: 'Обратная логистика: возвраты от клиентов и ретейлеров, рекламации, брак.',
    purpose: 'Учёт возвратов, вывоз и приёмка на склад с учётом маркировки и документов.',
    functionality: [
      'Заявки на возврат',
      'Вывоз от партнёров',
      'Приёмка и оприходование КИЗ',
      'Рекламации и брак',
    ],
    importance: 7,
  },
  thirdParty: {
    description: '3PL и аутсорсинг складов: партнёрские склады, фулфилмент, консолидация грузов.',
    purpose: 'Работа с внешними складами и логистическими операторами.',
    functionality: [
      'Подключённые 3PL-склады',
      'Консолидация грузов',
      'Shadow Inventory (товар в пути)',
      'Фулфилмент маркетплейсов',
    ],
    importance: 7,
  },
  integrations: {
    description: 'Интеграции логистики: 1С, маркетплейсы (WB, Ozon), ЭДО, API перевозчиков.',
    purpose: 'Синхронизация остатков, заказов и документов с учётными системами и партнёрами.',
    functionality: [
      '1С: склад, отгрузки',
      'WB, Ozon: остатки и доставка',
      'ЭДО: накладные, УПД',
      'API СДЭК, Боксберри и др.',
    ],
    importance: 8,
  },
  modules: {
    description:
      'Все подразделы логистики: склады, перевозчики, документы, таможня, трекинг, регионы, возвраты, 3PL.',
    purpose: 'Быстрый переход к нужному модулю управления логистикой бренда.',
    functionality: [
      'Складской учёт и Inventory',
      'Перевозчики (СДЭК, Боксберри, ПЭК и др.)',
      'Документы ТТН, CMR, ЭТрН',
      'Таможня и пошлины',
      'Отслеживание и регионы',
      'Возвраты, консолидация, Shadow Inventory',
      'ЭДО и маркировка, интеграции',
    ],
    importance: 9,
  },
};

export const LOGISTICS_KPI = {
  shipmentsPeriod: 1247,
  inTransit: 89,
  warehousesCount: 4,
  carriersConnected: 5,
};

export const LOGISTICS_NAV_CARDS = [
  {
    title: 'Складской учёт',
    description: 'Остатки по складам, приёмка, отгрузка, КИЗ и маркировка Честный ЗНАК.',
    icon: Warehouse,
    href: '/brand/warehouse',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    badge: 'Склады',
    stats: { label: 'Складов', value: '4', status: 'success' as const },
  },
  {
    title: 'Inventory',
    description: 'Управление остатками, резервы, архив и доступность для продаж.',
    icon: Package,
    href: '/brand/inventory',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    badge: 'Остатки',
    stats: { label: 'SKU', value: '2 840', status: 'active' as const },
  },
  {
    title: 'Перевозчики и доставка',
    description: 'СДЭК, Боксберри, ПЭК, ДПД, Почта России. Тарифы и интеграции.',
    icon: Truck,
    href: '/brand/logistics/carriers',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    badge: 'Доставка',
    stats: { label: 'Подключено', value: '5', status: 'success' as const },
  },
  {
    title: 'Документы (ТТН, CMR, ЭТрН)',
    description: 'Товарно-транспортные накладные, CMR, электронная ТрН, УПД для ЭДО.',
    icon: FileText,
    href: '/brand/documents',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    badge: 'Документы',
    stats: { label: 'За месяц', value: '312', status: 'success' as const },
  },
  {
    title: 'Таможня и пошлины',
    description: 'Расчёт пошлин и налогов (DDP), ЕАЭС, landed cost, декларации.',
    icon: Calculator,
    href: '/brand/logistics/duty-calculator',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    badge: 'Duty',
    stats: { label: 'Расчётов', value: '24', status: 'active' as const },
  },
  {
    title: 'Отслеживание',
    description: 'Трекинг отправлений по всем перевозчикам в реальном времени.',
    icon: Route,
    href: '/brand/logistics/tracking',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    badge: 'Трекинг',
    stats: { label: 'В пути', value: '89', status: 'warning' as const },
  },
  {
    title: 'Регионы и сроки',
    description: 'Зоны доставки РФ и СНГ, сроки, условия Ex-Works, DDP, до двери.',
    icon: MapPin,
    href: '/brand/logistics/regions',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    badge: 'Регионы',
    stats: { label: 'Регионов', value: '85', status: 'success' as const },
  },
  {
    title: 'Возвраты',
    description: 'Обратная логистика: возвраты от клиентов и ретейлеров, рекламации.',
    icon: RefreshCw,
    href: '/brand/returns-claims',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    badge: 'Returns',
    stats: { label: 'За месяц', value: '42', status: 'warning' as const },
  },
  {
    title: 'Консолидация грузов',
    description: 'Группировка партий разных брендов для снижения расходов на перевозку.',
    icon: Ship,
    href: '/brand/logistics/consolidation',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    badge: '3PL',
    stats: { label: 'Заявок', value: '12', status: 'active' as const },
  },
  {
    title: 'Shadow Inventory',
    description: 'Продажа товаров в пути: учёт и резервирование до поступления на склад.',
    icon: Package,
    href: '/brand/logistics/shadow-inventory',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    badge: 'В пути',
    stats: { label: 'Позиций', value: '156', status: 'active' as const },
  },
  {
    title: 'ЭДО и маркировка',
    description: 'Честный ЗНАК, синхронизация КИЗ при отгрузке, ЭДО для накладных.',
    icon: ShieldCheck,
    href: '/brand/compliance',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    badge: 'Compliance',
    stats: { label: 'Статус', value: 'OK', status: 'success' as const },
  },
  {
    title: 'Интеграции',
    description: '1С, маркетплейсы (WB, Ozon), ЭДО, API перевозчиков.',
    icon: Zap,
    href: '/brand/integrations',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    badge: 'API',
    stats: { label: 'Активно', value: '3/9', status: 'warning' as const },
  },
];
