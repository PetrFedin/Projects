'use client';

import {
  LayoutDashboard, Factory, Package, FileCheck, Truck, PackageSearch, Layers,
  FileText, BarChart2, Settings, Calendar, Users, Gavel, Zap, Ruler,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

/** Навигация для роли Manufacturer (производство) */
export const manufacturerNavGroups = [
  {
    id: 'overview',
    label: 'Обзор',
    icon: LayoutDashboard,
    links: [
      { href: '/factory', value: 'dashboard', label: 'Дашборд', icon: LayoutDashboard, description: 'Обзор производства' },
    ],
  },
  {
    id: 'production',
    label: 'Производство',
    icon: Factory,
    links: [
      { href: ROUTES.brand.production, value: 'production', label: 'Производство', icon: Factory, description: 'Операции и заказы' },
      { href: ROUTES.brand.productionOperations, value: 'operations', label: 'Операции', icon: Package, description: 'Коллекции, PO, BOM' },
      { href: ROUTES.brand.factories, value: 'factories', label: 'Фабрики', icon: Factory, description: 'Производственные мощности' },
      { href: ROUTES.brand.productionGantt, value: 'gantt', label: 'Диаграмма Ганта', icon: Calendar, description: 'Планирование' },
      { href: ROUTES.brand.productionDailyOutput, value: 'daily-output', label: 'Дневная выработка', icon: Package, description: 'Объёмы производства' },
      { href: ROUTES.brand.productionWorkerSkills, value: 'worker-skills', label: 'Навыки работников', icon: Users, description: 'Компетенции' },
      { href: ROUTES.brand.productionSubcontractor, value: 'subcontractor', label: 'Субподряд', icon: Factory, description: 'Аутсорсинг' },
      { href: ROUTES.brand.productionReadyMade, value: 'ready-made', label: 'Готовый продукт', icon: Package, description: 'Конфекция' },
      { href: ROUTES.brand.productionNesting, value: 'nesting', label: 'Раскрой (Nesting)', icon: Ruler, description: 'Оптимизация раскроя' },
    ],
  },
  {
    id: 'materials',
    label: 'Материалы',
    icon: Layers,
    links: [
      { href: ROUTES.brand.materials, value: 'materials', label: 'Каталог материалов', icon: Layers, description: 'Материалы' },
      { href: ROUTES.brand.materialsReservation, value: 'reservation', label: 'Резервирование', icon: Package, description: 'Резерв материалов' },
      { href: ROUTES.brand.vmi, value: 'vmi', label: 'VMI', icon: Truck, description: 'Vendor Managed Inventory' },
    ],
  },
  {
    id: 'orders',
    label: 'Заказы',
    icon: Package,
    links: [
      { href: ROUTES.brand.b2bOrders, value: 'orders', label: 'B2B Заказы', icon: Package, description: 'Заказы от брендов' },
    ],
  },
  {
    id: 'qc',
    label: 'QC и Compliance',
    icon: FileCheck,
    links: [
      { href: ROUTES.brand.compliance, value: 'compliance', label: 'QC и Compliance', icon: FileCheck, description: 'Контроль качества' },
      { href: ROUTES.brand.productionQcApp, value: 'qc-app', label: 'QC App', icon: Zap, description: 'Мобильное приложение QC' },
      { href: ROUTES.brand.productionGoldSample, value: 'gold-sample', label: 'Золотой образец', icon: FileCheck, description: 'Эталон качества' },
      { href: ROUTES.brand.productionFitComments, value: 'fit-comments', label: 'Комментарии по посадке', icon: FileText, description: 'Фиды по фиту' },
      { href: ROUTES.brand.productionMilestonesVideo, value: 'milestones-video', label: 'Видео этапов', icon: Package, description: 'Документирование' },
    ],
  },
  {
    id: 'logistics',
    label: 'Логистика',
    icon: Truck,
    links: [
      { href: ROUTES.brand.logistics, value: 'logistics', label: 'Логистика', icon: Truck, description: 'Поставки и склады' },
      { href: ROUTES.brand.warehouse, value: 'warehouse', label: 'Склад', icon: Package, description: 'Складской учёт' },
      { href: ROUTES.brand.inventory, value: 'inventory', label: 'Остатки', icon: Package, description: 'Инвентарь' },
    ],
  },
  {
    id: 'analytics',
    label: 'Аналитика',
    icon: BarChart2,
    links: [
      { href: ROUTES.brand.analytics, value: 'analytics', label: 'Аналитика', icon: BarChart2, description: 'Отчёты' },
    ],
  },
  {
    id: 'management',
    label: 'Управление',
    icon: Settings,
    links: [
      { href: ROUTES.brand.calendar, value: 'calendar', label: 'Календарь', icon: Calendar, description: 'События' },
      { href: ROUTES.brand.messages, value: 'messages', label: 'Сообщения', icon: Users, description: 'Коммуникация' },
    ],
  },
];

/** Навигация для роли Supplier (поставщик материалов) */
export const supplierNavGroups = [
  {
    id: 'overview',
    label: 'Обзор',
    icon: LayoutDashboard,
    links: [
      { href: '/factory?role=supplier', value: 'dashboard', label: 'Дашборд', icon: LayoutDashboard, description: 'Обзор поставок' },
    ],
  },
  {
    id: 'materials',
    label: 'Материалы и поставки',
    icon: Layers,
    links: [
      { href: ROUTES.brand.materials, value: 'materials', label: 'Каталог материалов', icon: Layers, description: 'Материалы для брендов' },
      { href: ROUTES.brand.materialsReservation, value: 'reservation', label: 'Резервирование', icon: Package, description: 'Резерв материалов' },
      { href: ROUTES.brand.suppliersRfq, value: 'rfq', label: 'RFQ и заявки', icon: FileText, description: 'Запросы котировок' },
      { href: ROUTES.brand.suppliers, value: 'suppliers', label: 'Поставщики', icon: PackageSearch, description: 'Сеть поставщиков' },
      { href: ROUTES.brand.vmi, value: 'vmi', label: 'VMI', icon: Truck, description: 'Vendor Managed Inventory' },
    ],
  },
  {
    id: 'orders',
    label: 'Заказы',
    icon: Package,
    links: [
      { href: ROUTES.brand.b2bOrders, value: 'orders', label: 'Заказы', icon: Package, description: 'Заказы на материалы' },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: FileCheck,
    links: [
      { href: ROUTES.brand.compliance, value: 'compliance', label: 'Соответствие', icon: FileCheck, description: 'Сертификаты, стандарты' },
    ],
  },
  {
    id: 'logistics',
    label: 'Логистика',
    icon: Truck,
    links: [
      { href: ROUTES.brand.logistics, value: 'logistics', label: 'Логистика', icon: Truck, description: 'Доставка материалов' },
    ],
  },
  {
    id: 'analytics',
    label: 'Аналитика',
    icon: BarChart2,
    links: [
      { href: ROUTES.brand.analytics, value: 'analytics', label: 'Аналитика', icon: BarChart2, description: 'Отчёты' },
    ],
  },
  {
    id: 'management',
    label: 'Управление',
    icon: Settings,
    links: [
      { href: ROUTES.brand.calendar, value: 'calendar', label: 'Календарь', icon: Calendar, description: 'События' },
      { href: ROUTES.brand.messages, value: 'messages', label: 'Сообщения', icon: Users, description: 'Коммуникация' },
    ],
  },
];
