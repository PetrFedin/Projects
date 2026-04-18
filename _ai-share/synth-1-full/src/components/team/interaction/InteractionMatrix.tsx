'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  Store,
  Factory,
  Handshake,
  Truck,
  Users,
  User,
  Check,
  Zap,
  Cpu,
  Box,
  ShoppingCart,
  Network,
  Repeat,
  ChevronRight,
  Activity,
  Info,
  Clock,
  Settings,
  FileText,
  ScanBarcode,
  PieChart,
  MessageCircle,
  Smartphone,
  BarChart3,
  Layers,
  Globe,
  ShieldCheck,
  ZapOff,
  RefreshCcw,
  Gem,
  Target,
  Rocket,
  Briefcase,
  TrendingUp,
  Heart,
  Search,
  MousePointer2,
  DollarSign,
  BarChart4,
  Scaling,
  FileSearch,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Filter,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { organizations, activityLogs } from '@/components/team/_fixtures/team-data';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Основные этапы бизнеса в Syntha OS
 */
const BUSINESS_STAGES = [
  {
    id: 'design',
    label: 'Дизайн и разработка (PLM)',
    icon: Box,
    color: 'text-amber-500 bg-amber-50',
  },
  {
    id: 'sourcing',
    label: 'Закупки и сорсинг',
    icon: Handshake,
    color: 'text-green-500 bg-green-50',
  },
  { id: 'production', label: 'Производство', icon: Factory, color: 'text-blue-500 bg-blue-50' },
  {
    id: 'logistics',
    label: 'Логистика и таможня',
    icon: Truck,
<<<<<<< HEAD
    color: 'text-purple-500 bg-purple-50',
=======
    color: 'text-accent-primary bg-accent-primary/10',
>>>>>>> recover/cabinet-wip-from-stash
  },
  {
    id: 'wholesale',
    label: 'Оптовые продажи (B2B)',
    icon: ShoppingCart,
<<<<<<< HEAD
    color: 'text-indigo-500 bg-indigo-50',
=======
    color: 'text-accent-primary bg-accent-primary/10',
>>>>>>> recover/cabinet-wip-from-stash
  },
  { id: 'retail', label: 'Ритейл и лояльность', icon: Store, color: 'text-rose-500 bg-rose-50' },
];

const ROLE_CONFIG: Record<UserRole, { label: string; icon: any; color: string; desc: string }> = {
  admin: {
    label: 'Администратор',
    icon: Shield,
<<<<<<< HEAD
    color: 'text-slate-900 bg-slate-100',
=======
    color: 'text-text-primary bg-bg-surface2',
>>>>>>> recover/cabinet-wip-from-stash
    desc: 'Полный контроль всей экосистемы и прав доступа',
  },
  brand: {
    label: 'Бренд',
    icon: Store,
    color: 'text-amber-600 bg-amber-50',
    desc: 'Владелец продукта, коллекций и интеллектуальной собственности',
  },
  manufacturer: {
    label: 'Фабрика',
    icon: Factory,
    color: 'text-blue-600 bg-blue-50',
    desc: 'Производственная площадка, выполняющая заказы по ТЗ',
  },
  supplier: {
    label: 'Поставщик',
    icon: Handshake,
    color: 'text-green-600 bg-green-50',
    desc: 'Поставщик тканей, фурнитуры и расходных материалов',
  },
  distributor: {
    label: 'Дистрибьютор',
    icon: Truck,
<<<<<<< HEAD
    color: 'text-purple-600 bg-purple-50',
=======
    color: 'text-accent-primary bg-accent-primary/10',
>>>>>>> recover/cabinet-wip-from-stash
    desc: 'Оптовый посредник, управляющий стоками и логистикой',
  },
  shop: {
    label: 'Магазин',
    icon: Users,
    color: 'text-rose-600 bg-rose-50',
    desc: 'Розничная точка продаж или онлайн-ритейлер',
  },
  client: {
    label: 'Клиент',
    icon: User,
<<<<<<< HEAD
    color: 'text-slate-600 bg-slate-50',
=======
    color: 'text-text-secondary bg-bg-surface2',
>>>>>>> recover/cabinet-wip-from-stash
    desc: 'Конечный покупатель продукции бренда',
  },
  b2b: {
    label: 'B2B Пользователь',
    icon: Users,
<<<<<<< HEAD
    color: 'text-slate-500 bg-slate-100',
=======
    color: 'text-text-secondary bg-bg-surface2',
>>>>>>> recover/cabinet-wip-from-stash
    desc: 'Корпоративный клиент или байер',
  },
};

const STATUS_CONFIG = {
  active: {
    label: 'Активно',
    desc: 'Функция полностью реализована и доступна для работы',
    color: 'bg-green-500 text-white',
    icon: Check,
  },
  pending: {
    label: 'В разработке',
    desc: 'Функционал находится на этапе активного программирования',
    color: 'bg-blue-400 text-white',
    icon: Clock,
  },
  unconfigured: {
    label: 'Требует настройки',
    desc: 'Модуль готов, но требует интеграции с вашими данными (API/1C)',
    color: 'bg-amber-400 text-white',
    icon: Settings,
  },
  rus_market: {
    label: 'Рынок РФ',
    desc: 'Специализированный модуль для соответствия законодательству РФ',
<<<<<<< HEAD
    color: 'bg-indigo-600 text-white',
=======
    color: 'bg-accent-primary text-white',
>>>>>>> recover/cabinet-wip-from-stash
    icon: ShieldCheck,
  },
};

interface Feature {
  id: string;
  label: string;
  desc: string;
  status: keyof typeof STATUS_CONFIG;
  participants: UserRole[];
  impact?: string;
  syncPage?: string;
  dependencies?: string[];
  integration?: 'B2B-Global' | 'Retail-Global' | '1C' | 'GISMT' | 'External-API';
  targetType?: string;
  interactionDetails?: Record<string, string>; // role -> what they do
}

const SIMULATIONS = [
  {
    id: 'sim-1',
    name: 'Жизненный цикл дропа',
    steps: ['f1', 'f39', 'f6', 'f9', 'f11', 'f17'],
    color: 'text-amber-500',
  },
  {
    id: 'sim-2',
    name: 'Оптовый цикл',
    steps: ['f17', 'f34', 'f19', 'f13', 'f43', 'f15'],
<<<<<<< HEAD
    color: 'text-indigo-500',
=======
    color: 'text-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
  },
  {
    id: 'sim-3',
    name: 'Клиентский путь',
    steps: ['f21', 'f46', 'f47', 'f35', 'f54'],
    color: 'text-rose-500',
  },
];

const STAGE_FEATURES: Record<string, Feature[]> = {
  design: [
    {
      id: 'f1',
      label: 'Цифровые двойники (PLM)',
      desc: 'Централизованное управление лекалами и 3D-моделями. Единый источник правды для бренда и фабрики.',
      status: 'active',
      participants: ['brand', 'manufacturer'],
      syncPage: '/brand/products',
<<<<<<< HEAD
      integration: 'Syntha Global',
=======
      integration: 'External-API',
>>>>>>> recover/cabinet-wip-from-stash
      targetType: 'plm',
      interactionDetails: {
        brand: 'Создание и утверждение техзаданий и 3D-моделей.',
        manufacturer: 'Просмотр лекал, расчет расхода материалов и запуск в работу.',
      },
    },
    {
      id: 'f2',
      label: 'AI Лукбуки и контент',
      desc: 'Автоматическая генерация рекламных образов на основе 3D. Продажи начинаются до пошива образцов.',
      status: 'active',
      participants: ['brand'],
      syncPage: '/brand/media',
<<<<<<< HEAD
      integration: 'Brand Portal',
=======
      integration: 'External-API',
>>>>>>> recover/cabinet-wip-from-stash
      dependencies: ['f1'],
      interactionDetails: {
        brand: 'Генерация маркетинговых материалов на основе 3D-семплов.',
      },
    },
    {
      id: 'f37',
      label: 'AI Анализатор ДНК',
      desc: 'Анализ коллекции на соответствие философии бренда. Поиск слабых мест и сильных сторон ДНК.',
      status: 'pending',
      participants: ['brand'],
      impact: 'Сохранение идентичности при росте',
      dependencies: ['f1'],
      interactionDetails: {
        brand: 'Автоматическая сверка новых эскизов с историческим ДНК бренда.',
      },
    },
    {
      id: 'f38',
      label: 'Ecosystem Laboratory',
      desc: 'Голосование предзаказами за новые модели. Магазины и клиенты сами выбирают, что пойдет в производство.',
      status: 'active',
      participants: ['brand', 'shop', 'client'],
      syncPage: '/brand/kickstarter',
      dependencies: ['f1'],
      interactionDetails: {
        brand: 'Выставление прототипов на голосование.',
        shop: 'Оценка потенциального спроса и бронирование квот.',
        client: 'Голосование и оформление предзаказов.',
      },
    },
    {
      id: 'f48',
      label: 'AI Feedback Loop',
      desc: 'Сбор данных из ритейла для мгновенной корректировки дизайна. Слушаем клиента на этапе эскиза.',
      status: 'pending',
      participants: ['brand', 'client', 'shop'],
      dependencies: ['f21'],
      interactionDetails: {
        brand: 'Анализ отзывов и корректировка будущих коллекций.',
        client: 'Предоставление обратной связи через виртуальную примерку.',
        shop: 'Передача данных о возвратах и предпочтениях.',
      },
    },
    {
      id: 'f3',
      label: 'Адаптация ГОСТ РФ',
      desc: 'Автоматический пересчет размерных сеток в российские стандарты. Снижение возвратов из-за посадки.',
      status: 'rus_market',
      participants: ['brand', 'manufacturer'],
      syncPage: '/brand/quality',
      integration: 'GISMT',
      interactionDetails: {
        brand: 'Контроль соответствия технических характеристик стандартам.',
        manufacturer: 'Приемка лекал, адаптированных под локальный рынок.',
      },
    },
  ],
  sourcing: [
    {
      id: 'f5',
      label: 'Тендерная площадка',
      desc: 'Автоматический сбор предложений от поставщиков сырья. Лучшая цена и сроки в один клик.',
      status: 'active',
      participants: ['brand', 'supplier'],
      syncPage: '/brand/materials',
      interactionDetails: {
        brand: 'Создание заявок на поиск материалов и выбор победителя.',
        supplier: 'Подача коммерческих предложений и спецификаций.',
      },
    },
    {
      id: 'f39',
      label: 'Supplier Collab Lab',
      desc: 'Прямое участие поставщиков в создании коллекции. Предложение тканей под эскизы в реальном времени.',
      status: 'active',
      participants: ['brand', 'supplier'],
      syncPage: '/brand/materials',
      dependencies: ['f1'],
      interactionDetails: {
        brand: 'Запрос на кастомную разработку принтов или составов тканей.',
        supplier: 'Предложение инновационных решений и цифровых образцов.',
      },
    },
    {
      id: 'f40',
      label: 'Economic Optimizer',
      desc: 'Фин-анализ закупок и помощь в масштабировании. Оптимизация экономики материалов и партий.',
      status: 'unconfigured',
      participants: ['brand', 'distributor'],
      impact: 'Снижение себестоимости на 15%',
      targetType: 'financial',
      dependencies: ['f5'],
      interactionDetails: {
        brand: 'Утверждение бюджетов и целевой себестоимости.',
        distributor: 'Анализ логистических затрат и планирование закупок.',
      },
    },
    {
      id: 'f49',
      label: 'Raw Material Tracker',
      desc: 'Сквозной контроль каждой бобины ткани от поставки до цеха. Исключение потерь сырья.',
      status: 'active',
      participants: ['supplier', 'manufacturer', 'brand'],
      syncPage: '/brand/inventory',
      interactionDetails: {
        supplier: 'Маркировка сырья и уведомление об отгрузке.',
        manufacturer: 'Подтверждение приемки и списание на заказ.',
        brand: 'Мониторинг остатков сырья в реальном времени.',
      },
    },
    {
      id: 'f27',
      label: 'AI Риски поставок',
      desc: 'Мониторинг цепочек поставок и предсказание задержек. Страхование сроков производства.',
      status: 'pending',
      participants: ['brand', 'supplier'],
<<<<<<< HEAD
      integration: 'Global Logistics',
=======
      integration: 'B2B-Global',
>>>>>>> recover/cabinet-wip-from-stash
      interactionDetails: {
        brand: 'Управление планами страхования сроков.',
        supplier: 'Предоставление данных о логистических рисках.',
      },
    },
    {
      id: 'f6',
      label: 'Digital Swatch Library',
      desc: 'Библиотека материалов с физическими свойствами. Виртуальное тестирование тканей в 3D.',
      status: 'active',
      participants: ['brand', 'supplier', 'manufacturer'],
      syncPage: '/brand/inventory',
      dependencies: ['f1'],
      interactionDetails: {
        brand: 'Подбор материалов для 3D-визуализации.',
        supplier: 'Загрузка текстур и физических параметров тканей.',
        manufacturer: 'Проверка технологичности материалов для пошива.',
      },
    },
  ],
  production: [
    {
      id: 'f9',
      label: 'Live Shop Floor',
      desc: 'Визуализация прогресса пошива каждой партии онлайн. Фабрика и бренд работают в одном поле.',
      status: 'active',
      participants: ['manufacturer', 'brand'],
      syncPage: '/factory/production',
      dependencies: ['f1'],
      targetType: 'order',
      interactionDetails: {
        manufacturer: 'Отметка этапов готовности (крой, пошив, ОТК).',
        brand: 'Наблюдение за прогрессом и корректировка приоритетов.',
      },
    },
    {
      id: 'f41',
      label: 'AI Quality Predictor',
      desc: 'Предсказание брака на основе данных оборудования. Полный контроль качества производства.',
      status: 'pending',
      participants: ['manufacturer', 'brand'],
      impact: 'Нулевой процент брака',
      dependencies: ['f9'],
      interactionDetails: {
        manufacturer: 'Мониторинг данных с датчиков оборудования.',
        brand: 'Получение уведомлений о потенциальных дефектах.',
      },
    },
    {
      id: 'f30',
      label: 'Аукцион мощностей',
      desc: 'Продажа свободных окон фабриками. Бренды быстро размещают дозаказы хитов.',
      status: 'active',
      participants: ['manufacturer', 'brand'],
<<<<<<< HEAD
      syncPage: '/factory/auctions',
=======
      syncPage: '/factory/production/auctions',
>>>>>>> recover/cabinet-wip-from-stash
      interactionDetails: {
        manufacturer: 'Выставление свободных слотов на продажу.',
        brand: 'Бронирование мощностей для срочных тиражей.',
      },
    },
    {
      id: 'f42',
      label: 'Career Fashion Hub',
      desc: 'Внутренняя биржа вакансий для профи: найм швей, технологов и дизайнеров.',
      status: 'active',
      participants: ['brand', 'manufacturer', 'admin'],
      syncPage: '/brand/staff',
      targetType: 'member',
      interactionDetails: {
        brand: 'Поиск и найм профильных специалистов.',
        manufacturer: 'Найм швей и технологов для расширения линий.',
        admin: 'Модерация вакансий и верификация специалистов.',
      },
    },
    {
      id: 'f50',
      label: 'Product Passports',
      desc: 'Цифровые паспорта изделий. История создания и подтверждение подлинности каждой вещи.',
      status: 'pending',
      participants: ['brand', 'manufacturer', 'client'],
      dependencies: ['f9'],
      interactionDetails: {
        manufacturer: 'Внесение данных о месте, дате и составе изделия.',
        brand: 'Утверждение паспорта и привязка к маркетингу.',
        client: 'Проверка подлинности и истории продукта.',
      },
    },
    {
      id: 'f11',
      label: 'Честный ЗНАК Live',
      desc: 'Мгновенная маркировка на линии пошива. Соответствие всем законам РФ без задержек.',
      status: 'rus_market',
      participants: ['manufacturer', 'brand'],
      syncPage: '/brand/inventory',
      integration: 'GISMT',
      dependencies: ['f9'],
      interactionDetails: {
        manufacturer: 'Печать и наклеивание КИЗов при упаковке.',
        brand: 'Ввод товаров в оборот и отчетность в ЦРПТ.',
      },
    },
  ],
  logistics: [
    {
      id: 'f13',
      label: 'AI-Route Optimizer',
      desc: 'Подбор самых выгодных путей доставки. Контроль логистики и транспортной экономики.',
      status: 'active',
      participants: ['distributor', 'brand'],
      syncPage: '/distributor/territory',
      interactionDetails: {
        distributor: 'Настройка параметров складов и транспортных узлов.',
        brand: 'Выбор оптимальных тарифов и сроков доставки.',
      },
    },
    {
      id: 'f43',
      label: 'Logistics Control 360',
      desc: 'Единый интерфейс управления таможней, складами и курьерами. Все статусы прозрачны.',
      status: 'active',
      participants: ['distributor', 'brand', 'shop'],
      syncPage: '/distributor/orders',
      dependencies: ['f13'],
      interactionDetails: {
        distributor: 'Управление статусами отправлений и консолидация.',
        brand: 'Трекинг партий от фабрики до склада.',
        shop: 'Планирование приемки поставок в магазинах.',
      },
    },
    {
      id: 'f32',
      label: 'Global Fulfillment',
      desc: 'Дропшиппинга и кросс-докинг. Управление разрозненными складами и глобальными остатками.',
      status: 'active',
      participants: ['distributor', 'brand', 'shop'],
      syncPage: '/distributor/orders',
      dependencies: ['f43'],
      interactionDetails: {
        distributor: 'Обработка и упаковка заказов на аутсорс-складах.',
        brand: 'Управление глобальными остатками в разных странах.',
        shop: 'Запрос на прямую отгрузку клиентам (Drop-shipping).',
      },
    },
    {
      id: 'f51',
      label: 'Trade Gateway',
      desc: 'Мультивалютный шлюз для расчетов с миром. Автоматизация документов и валютного контроля.',
      status: 'rus_market',
      participants: ['brand', 'distributor', 'supplier'],
      interactionDetails: {
        brand: 'Проведение валютных платежей и инвойсинг.',
        distributor: 'Подтверждение экспортно-импортных документов.',
        supplier: 'Получение оплаты за сырье.',
      },
    },
    {
      id: 'f16',
      label: 'WMS Connector',
      desc: 'Глубокая интеграция со складскими системами. Точный контроль каждой единицы на полке.',
      status: 'unconfigured',
      participants: ['distributor', 'shop'],
      syncPage: '/distributor/orders',
      integration: '1C',
      interactionDetails: {
        distributor: 'Синхронизация данных складского учета.',
        shop: 'Просмотр реальных остатков на складах партнера.',
      },
    },
    {
      id: 'f14',
      label: 'Таможня ФТС',
      desc: 'Цифровая очистка грузов. Автоматический расчет пошлин и НДС для импорта/экспорта.',
      status: 'rus_market',
      participants: ['distributor', 'brand'],
      syncPage: '/distributor/contracts',
      dependencies: ['f43'],
      interactionDetails: {
        distributor: 'Подача деклараций и работа с таможней.',
        brand: 'Контроль уплаты пошлин и НДС.',
      },
    },
  ],
  wholesale: [
    {
      id: 'f17',
      label: 'Оптовый B2B Портал',
      desc: 'Цифровой шоурум для байеров. Заказы и планирование ассортимента в одном окне.',
      status: 'active',
      participants: ['brand', 'shop'],
      syncPage: '/shop/b2b/partners',
<<<<<<< HEAD
      integration: 'Syntha B2B',
=======
      integration: 'B2B-Global',
>>>>>>> recover/cabinet-wip-from-stash
      targetType: 'order',
      interactionDetails: {
        brand: 'Настройка каталога, лимитов и индивидуальных цен.',
        shop: 'Формирование предзаказов и отслеживание баланса.',
      },
    },
    {
      id: 'f44',
      label: 'Smart Replenishment',
      desc: 'Автоматические дозаказы хитов. Помощь в масштабировании продаж через анализ остатков.',
      status: 'active',
      participants: ['brand', 'shop'],
      syncPage: '/shop/b2b/replenishment',
      dependencies: ['f19'],
      interactionDetails: {
        brand: 'Прогнозирование спроса и предложение квот.',
        shop: 'Автоматическое подтверждение пополнения хитов.',
      },
    },
    {
      id: 'f45',
      label: '360 Analytics & CRM',
      desc: 'Полная аналитика продаж и поведения партнеров. Инструмент развития бизнеса 360.',
      status: 'active',
      participants: ['brand', 'admin', 'shop'],
      syncPage: '/brand/analytics-360',
      interactionDetails: {
        brand: 'Анализ эффективности каналов и рентабельности.',
        admin: 'Мониторинг общей активности экосистемы.',
        shop: 'Сравнение показателей с рыночными бенчмарками.',
      },
    },
    {
      id: 'f52',
      label: 'B2B Fintech Hub',
      desc: 'Факторинг, BNPL и кредитование байеров. Безопасные сделки и финансовое плечо для роста.',
      status: 'active',
      participants: ['brand', 'shop', 'admin'],
      syncPage: '/wallet',
      targetType: 'financial',
      dependencies: ['f17'],
      interactionDetails: {
        brand: 'Запрос факторинга для оборотных средств.',
        shop: 'Оформление BNPL-платежей для закупок.',
        admin: 'Одобрение кредитных лимитов на базе данных ОС.',
      },
    },
    {
      id: 'f34',
      label: 'Line Planning Collab',
      desc: 'Совместное планирование линеек магазина и бренда. Оптимизация маржинальности.',
      status: 'active',
      participants: ['brand', 'shop'],
      syncPage: '/brand/b2b/linesheets',
<<<<<<< HEAD
      integration: 'Syntha B2B',
=======
      integration: 'B2B-Global',
>>>>>>> recover/cabinet-wip-from-stash
      interactionDetails: {
        brand: 'Предложение структуры коллекции под нужды ритейла.',
        shop: 'Совместная верстка ассортиментной матрицы.',
      },
    },
    {
      id: 'f19',
      label: '1С / МойСклад Sync',
      desc: 'Прямая связь с учетными системами ритейла. Синхронный контроль продаж и остатков.',
      status: 'rus_market',
      participants: ['shop', 'brand'],
      syncPage: '/brand/settings',
      integration: '1C',
      interactionDetails: {
        shop: 'Автоматическая выгрузка данных о продажах.',
        brand: 'Получение данных для планирования производства.',
      },
    },
  ],
  retail: [
    {
      id: 'f21',
      label: 'Виртуальная примерочная',
      desc: 'AR-модуль для снижения процента возвратов. Клиент видит вещь на себе до покупки.',
      status: 'active',
      participants: ['brand', 'client'],
      syncPage: '/b/[brandId]',
      integration: 'Retail-Global',
      interactionDetails: {
        brand: 'Загрузка 3D-моделей вещей.',
        client: 'Примерка вещей на аватар или через камеру.',
      },
    },
    {
      id: 'f46',
      label: 'AI Personal Lookbook',
      desc: 'Персональные рекомендации образов. Помощь клиенту в развитии стиля и подборе гардероба.',
      status: 'active',
      participants: ['brand', 'client'],
<<<<<<< HEAD
      syncPage: '/u/wardrobe',
=======
      syncPage: '/client/me/wardrobe',
>>>>>>> recover/cabinet-wip-from-stash
      dependencies: ['f21'],
      interactionDetails: {
        brand: 'Обучение AI-стилиста стилистике бренда.',
        client: 'Получение персональных рекомендаций по стилю.',
      },
    },
    {
      id: 'f47',
      label: 'Omni-Loyalty Ecosystem',
      desc: 'Программа лояльности через ценности: доступ к карьере, показам и аукционам.',
      status: 'active',
      participants: ['brand', 'client', 'shop'],
<<<<<<< HEAD
      syncPage: '/u/loyalty',
=======
      syncPage: '/client/me?tab=loyalty',
>>>>>>> recover/cabinet-wip-from-stash
      interactionDetails: {
        brand: 'Настройка уровней доступа и эксклюзивных наград.',
        client: 'Накопление баллов и использование привилегий.',
        shop: 'Применение скидок лояльности при продаже.',
      },
    },
    {
      id: 'f55',
      label: 'Wardrobe Asset Hub',
      desc: 'Управление гардеробом как финансовым активом. Кредитование под залог вещей.',
      status: 'active',
      participants: ['client', 'admin'],
      syncPage: '/wallet',
      targetType: 'financial',
      interactionDetails: {
        client: 'Оценка стоимости гардероба и получение лимитов.',
        admin: 'Управление залоговыми обязательствами.',
      },
    },
    {
      id: 'f35',
      label: 'AI Visual Search',
      desc: 'Поиск образов по фото. Помощь клиенту найти именно то, что он увидел в журнале.',
      status: 'active',
      participants: ['brand', 'client'],
      syncPage: '/search',
      integration: 'Retail-Global',
      interactionDetails: {
        brand: 'Индексация каталога для визуального поиска.',
        client: 'Поиск товаров по фотографиям и скриншотам.',
      },
    },
    {
      id: 'f22',
      label: 'Синхро Маркетплейсы',
      desc: 'Управление WB, Ozon, Lamoda. Контроль продаж и остатков на всех витринах сразу.',
      status: 'rus_market',
      participants: ['brand', 'shop'],
      syncPage: '/brand/analytics',
      integration: '1C',
      interactionDetails: {
        brand: 'Централизованное управление стоком на маркетплейсах.',
        shop: 'Управление продажами через партнерские кабинеты.',
      },
    },
  ],
};

export function InteractionMatrix() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('brand');
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | null>(null);

  // States for 3 major features
  const [isConfigMode, setIsConfigMode] = useState(false);
  const [activePartnerId, setActivePartnerId] = useState<string | 'all'>('all');
  const [disabledFeatures, setDisabledFeatures] = useState<Record<string, string[]>>({});
  const [simStep, setSimStep] = useState<number | null>(null);
  const [activeSim, setActiveSim] = useState<(typeof SIMULATIONS)[0] | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Real-time Pulse state (simulated)
  const [livePulse, setLivePulse] = useState<Record<string, string>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const allIds = Object.values(STAGE_FEATURES)
        .flat()
        .map((f) => f.id);
      const randomId = allIds[Math.floor(Math.random() * allIds.length)];
      const actions = [
        'Редактирование',
        'Просмотр',
        'Запрос API',
        'Новый заказ',
        'Загрузка лекал',
        'Анализ AI',
      ];
      const action = actions[Math.floor(Math.random() * actions.length)];

      setLivePulse((prev) => ({
        ...prev,
        [randomId]: action,
      }));

      setTimeout(() => {
        setLivePulse((prev) => {
          const newState = { ...prev };
          delete newState[randomId];
          return newState;
        });
      }, 3000);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Simulation logic
  useEffect(() => {
    let timer: any;
    if (activeSim && simStep !== null) {
      if (simStep < activeSim.steps.length) {
        timer = setTimeout(() => setSimStep(simStep + 1), 1500);
      } else {
        timer = setTimeout(() => {
          setSimStep(null);
          setActiveSim(null);
        }, 3000);
      }
    }
    return () => clearTimeout(timer);
  }, [simStep, activeSim]);

  // Heatmap intensity calculator
  const heatmapData = useMemo(() => {
    const intensity: Record<string, number> = {};
    const relevantLogs =
      activePartnerId === 'all'
        ? activityLogs
        : activityLogs.filter((l) => l.organizationId === activePartnerId);

    Object.values(STAGE_FEATURES)
      .flat()
      .forEach((f) => {
        const count = relevantLogs.filter((l) => l.targetType === f.targetType).length;
        intensity[f.id] = Math.min(count * 20, 100);
      });
    return intensity;
  }, [activePartnerId]);

  const relatedFeatureIds = useMemo(() => {
    if (activeSim && simStep !== null) return activeSim.steps.slice(0, simStep + 1);
    if (!hoveredFeatureId) return [];
    const allFeatures = Object.values(STAGE_FEATURES).flat();
    const current = allFeatures.find((f) => f.id === hoveredFeatureId);
    if (!current) return [];
    const deps = current.dependencies || [];
    const dependents = allFeatures
      .filter((f) => f.dependencies?.includes(hoveredFeatureId))
      .map((f) => f.id);
    return [...deps, ...dependents];
  }, [hoveredFeatureId, activeSim, simStep]);

  const toggleFeature = (featureId: string) => {
    if (!isConfigMode || activePartnerId === 'all') return;
    setDisabledFeatures((prev) => {
      const current = prev[activePartnerId] || [];
      const updated = current.includes(featureId)
        ? current.filter((id) => id !== featureId)
        : [...current, featureId];
      return { ...prev, [activePartnerId]: updated };
    });
  };

  const isFeatureDisabled = (featureId: string) => {
    if (activePartnerId === 'all') return false;
    return (disabledFeatures[activePartnerId] || []).includes(featureId);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="space-y-6 duration-300 animate-in fade-in">
        {/* Dynamic Header with Controls */}
        <header className="flex flex-col items-start justify-between gap-3 rounded-xl border border-white/60 bg-white/40 p-4 backdrop-blur-md xl:flex-row xl:items-center">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 shadow-2xl shadow-indigo-200">
=======
            <div className="bg-accent-primary shadow-accent-primary/15 flex h-10 w-10 items-center justify-center rounded-2xl shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
              <Network className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-tighter">Syntha OS Matrix</h2>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
<<<<<<< HEAD
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
=======
                <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  {isConfigMode
                    ? `Настройка прав: ${organizations[activePartnerId]?.name || 'Все'}`
                    : 'Центр управления экосистемой'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Simulation Player */}
<<<<<<< HEAD
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1.5">
              <div className="px-3 text-[9px] font-black uppercase text-slate-400">Сценарии:</div>
=======
            <div className="bg-bg-surface2 border-border-default flex items-center gap-2 rounded-2xl border p-1.5">
              <div className="text-text-muted px-3 text-[9px] font-black uppercase">Сценарии:</div>
>>>>>>> recover/cabinet-wip-from-stash
              {SIMULATIONS.map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => {
                    setActiveSim(sim);
                    setSimStep(0);
                  }}
                  className={cn(
                    'rounded-xl px-3 py-2 text-[9px] font-black uppercase transition-all',
                    activeSim?.id === sim.id
                      ? 'bg-black text-white'
<<<<<<< HEAD
                      : 'text-slate-600 hover:bg-white'
=======
                      : 'text-text-secondary hover:bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  {sim.name}
                </button>
              ))}
              {activeSim && (
                <button
                  onClick={() => {
                    setActiveSim(null);
                    setSimStep(null);
                  }}
                  className="p-2 text-rose-500"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Config & Heatmap Toggles */}
<<<<<<< HEAD
            <div className="flex items-center gap-2 rounded-2xl bg-slate-900 p-1.5">
=======
            <div className="bg-text-primary flex items-center gap-2 rounded-2xl p-1.5">
>>>>>>> recover/cabinet-wip-from-stash
              <button
                onClick={() => setIsConfigMode(!isConfigMode)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase transition-all',
                  isConfigMode
<<<<<<< HEAD
                    ? 'bg-indigo-600 text-white shadow-lg'
=======
                    ? 'bg-accent-primary text-white shadow-lg'
>>>>>>> recover/cabinet-wip-from-stash
                    : 'text-white/40 hover:text-white'
                )}
              >
                {isConfigMode ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : (
                  <Unlock className="h-3.5 w-3.5" />
                )}
                {isConfigMode ? 'Конфигуратор ON' : 'Настроить права'}
              </button>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={cn(
                  'rounded-xl p-2.5 transition-all',
                  showHeatmap ? 'bg-amber-500 text-white' : 'text-white/40'
                )}
              >
                <TrendingUp className="h-4 w-4" />
              </button>
            </div>

            {/* Partner Selector */}
<<<<<<< HEAD
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
              <Filter className="ml-2 h-3.5 w-3.5 text-slate-400" />
=======
            <div className="border-border-default flex items-center gap-2 rounded-2xl border bg-white p-1.5 shadow-sm">
              <Filter className="text-text-muted ml-2 h-3.5 w-3.5" />
>>>>>>> recover/cabinet-wip-from-stash
              <select
                value={activePartnerId}
                onChange={(e) => setActivePartnerId(e.target.value)}
                className="bg-transparent pr-4 text-[10px] font-black uppercase outline-none"
              >
                <option value="all">Все партнеры</option>
                {Object.values(organizations)
                  .filter((o) => o.type !== 'admin')
                  .map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </header>

        {/* Main Process Scheme */}
        <div className="relative">
<<<<<<< HEAD
          <div className="absolute left-0 top-[60px] z-0 hidden h-1 w-full bg-slate-100 lg:block" />
=======
          <div className="bg-bg-surface2 absolute left-0 top-[60px] z-0 hidden h-1 w-full lg:block" />
>>>>>>> recover/cabinet-wip-from-stash

          <div className="relative z-10 grid grid-cols-1 gap-3 lg:grid-cols-6">
            {BUSINESS_STAGES.map((stage, index) => {
              const features = STAGE_FEATURES[stage.id] || [];
              const roleInStage = features.some((f) => f.participants.includes(selectedRole));

              return (
                <div key={stage.id} className="space-y-6">
                  {/* Stage Node */}
                  <div
                    className={cn(
                      'relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-all duration-500',
                      roleInStage
<<<<<<< HEAD
                        ? 'border-indigo-600 bg-white shadow-xl'
                        : 'border-slate-100 bg-slate-50/50 opacity-40 grayscale'
=======
                        ? 'border-accent-primary bg-white shadow-xl'
                        : 'bg-bg-surface2/80 border-border-subtle opacity-40 grayscale'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    {index < BUSINESS_STAGES.length - 1 && (
                      <div className="absolute -right-5 top-1/2 hidden -translate-y-1/2 lg:block">
<<<<<<< HEAD
                        <ChevronRight className="h-4 w-4 text-slate-200" />
=======
                        <ChevronRight className="text-text-muted h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                      </div>
                    )}
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500',
                        roleInStage ? 'scale-110' : 'scale-90',
                        stage.color
                      )}
                    >
                      {React.createElement(stage.icon, { className: 'h-6 w-6' })}
                    </div>
                    <div>
<<<<<<< HEAD
                      <p className="text-[10px] font-black uppercase leading-tight text-slate-900">
                        {stage.label}
                      </p>
                      <p className="mt-1 text-[8px] font-bold uppercase text-slate-400">
=======
                      <p className="text-text-primary text-[10px] font-black uppercase leading-tight">
                        {stage.label}
                      </p>
                      <p className="text-text-muted mt-1 text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                        Шаг {index + 1}
                      </p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="min-h-[300px] space-y-3">
                    {features.map((f) => {
                      const isRelevant = f.participants.includes(selectedRole);
                      const isDisabled = isFeatureDisabled(f.id);
                      const statusInfo = STATUS_CONFIG[f.status];
                      const isHighlighted =
                        hoveredFeatureId === f.id || relatedFeatureIds.includes(f.id);
                      const intensity = showHeatmap ? heatmapData[f.id] || 0 : 0;
                      const isCurrentSimStep = activeSim?.steps[simStep!] === f.id;
                      const liveAction = livePulse[f.id];

                      return (
                        <motion.div key={f.id} layoutId={f.id} onClick={() => toggleFeature(f.id)}>
                          <Card
                            onMouseEnter={() => setHoveredFeatureId(f.id)}
                            onMouseLeave={() => setHoveredFeatureId(null)}
                            className={cn(
                              'group relative cursor-pointer overflow-hidden rounded-2xl border-none shadow-sm transition-all duration-300',
                              isRelevant
                                ? 'bg-white opacity-100'
<<<<<<< HEAD
                                : 'pointer-events-none scale-95 bg-slate-100/50 opacity-30',
                              isDisabled && 'brightness-50 grayscale',
                              isHighlighted && isRelevant
                                ? 'z-20 scale-105 shadow-xl ring-2 ring-indigo-600 ring-offset-2'
=======
                                : 'bg-bg-surface2/50 pointer-events-none scale-95 opacity-30',
                              isDisabled && 'brightness-50 grayscale',
                              isHighlighted && isRelevant
                                ? 'ring-accent-primary z-20 scale-105 shadow-xl ring-2 ring-offset-2'
>>>>>>> recover/cabinet-wip-from-stash
                                : '',
                              isCurrentSimStep &&
                                'scale-110 shadow-2xl ring-4 ring-amber-500 ring-offset-4'
                            )}
                          >
                            {/* Live Activity Indicator */}
                            <AnimatePresence>
                              {liveAction && isRelevant && (
                                <motion.div
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  exit={{ y: -20, opacity: 0 }}
<<<<<<< HEAD
                                  className="absolute left-0 right-0 top-0 z-30 bg-indigo-600 py-1 text-center text-[7px] font-black uppercase text-white"
=======
                                  className="bg-accent-primary absolute left-0 right-0 top-0 z-30 py-1 text-center text-[7px] font-black uppercase text-white"
>>>>>>> recover/cabinet-wip-from-stash
                                >
                                  {liveAction}...
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Heatmap Overlay */}
                            {showHeatmap && isRelevant && intensity > 0 && (
                              <div
                                className="pointer-events-none absolute inset-0 bg-amber-500/10"
                                style={{ opacity: intensity / 100 }}
                              />
                            )}

                            <CardContent className="relative z-10 space-y-3 p-3">
                              <div className="flex items-center justify-between">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        'flex h-5 w-5 cursor-help items-center justify-center rounded-lg',
                                        statusInfo.color
                                      )}
                                    >
                                      {React.createElement(statusInfo.icon, {
                                        className: 'h-3 w-3',
                                      })}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
<<<<<<< HEAD
                                    className="max-w-[200px] rounded-xl border-none bg-slate-900 p-3 text-white shadow-2xl"
=======
                                    className="bg-text-primary max-w-[200px] rounded-xl border-none p-3 text-white shadow-2xl"
>>>>>>> recover/cabinet-wip-from-stash
                                  >
                                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest">
                                      {statusInfo.label}
                                    </p>
                                    <p className="text-[9px] font-medium leading-relaxed opacity-70">
                                      {statusInfo.desc}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>

                                <div className="flex gap-1">
                                  {isConfigMode && activePartnerId !== 'all' && (
                                    <div
                                      className={cn(
                                        'flex h-6 w-6 items-center justify-center rounded-lg',
                                        isDisabled
                                          ? 'bg-rose-500 text-white'
                                          : 'bg-green-500 text-white'
                                      )}
                                    >
                                      {isDisabled ? (
                                        <EyeOff className="h-3 w-3" />
                                      ) : (
                                        <Eye className="h-3 w-3" />
                                      )}
                                    </div>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedFeature(f);
                                    }}
<<<<<<< HEAD
                                    className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 transition-colors hover:bg-black hover:text-white"
=======
                                    className="bg-bg-surface2 flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover:bg-black hover:text-white"
>>>>>>> recover/cabinet-wip-from-stash
                                  >
                                    <Info className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>

<<<<<<< HEAD
                              <p className="line-clamp-2 text-[9px] font-black uppercase leading-tight tracking-tight text-slate-800">
=======
                              <p className="text-text-primary line-clamp-2 text-[9px] font-black uppercase leading-tight tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                {f.label}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex -space-x-1.5">
                                  {f.participants.map((p) => {
                                    const detail = f.interactionDetails?.[p];
                                    return (
                                      <Tooltip key={p}>
                                        <TooltipTrigger asChild>
                                          <div
                                            className={cn(
                                              'z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white transition-transform hover:scale-125',
                                              ROLE_CONFIG[p].color
                                            )}
                                          >
                                            {React.createElement(ROLE_CONFIG[p].icon, {
                                              className: 'h-2.5 w-2.5',
                                            })}
                                          </div>
                                        </TooltipTrigger>
<<<<<<< HEAD
                                        <TooltipContent className="max-w-[180px] rounded-xl border border-slate-200 bg-white p-3 text-slate-900 shadow-xl">
                                          <p className="mb-1 text-[9px] font-black uppercase tracking-widest">
                                            {ROLE_CONFIG[p].label}
                                          </p>
                                          <p className="text-[8px] font-medium italic leading-tight text-slate-500">
=======
                                        <TooltipContent className="border-border-default text-text-primary max-w-[180px] rounded-xl border bg-white p-3 shadow-xl">
                                          <p className="mb-1 text-[9px] font-black uppercase tracking-widest">
                                            {ROLE_CONFIG[p].label}
                                          </p>
                                          <p className="text-text-secondary text-[8px] font-medium italic leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                            {detail ||
                                              'Участвует в процессе синхронно с другими ролями.'}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    );
                                  })}
                                </div>
                                {f.integration && (
<<<<<<< HEAD
                                  <div className="rounded bg-slate-100 px-1.5 py-0.5 text-[7px] font-bold uppercase text-slate-500">
=======
                                  <div className="bg-bg-surface2 text-text-secondary rounded px-1.5 py-0.5 text-[7px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                    {f.integration}
                                  </div>
                                )}
                              </div>
                            </CardContent>

                            {/* Heatmap intensity bar */}
                            {showHeatmap && isRelevant && (
<<<<<<< HEAD
                              <div className="mt-auto h-0.5 w-full bg-slate-100">
=======
                              <div className="bg-bg-surface2 mt-auto h-0.5 w-full">
>>>>>>> recover/cabinet-wip-from-stash
                                <div
                                  className="h-full bg-amber-500 transition-all duration-1000"
                                  style={{ width: `${intensity}%` }}
                                />
                              </div>
                            )}
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Details Dialog */}
        <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
          <DialogContent className="max-w-md rounded-xl border-none bg-white p-3 shadow-2xl">
            {selectedFeature && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-2xl shadow-xl',
                      STATUS_CONFIG[selectedFeature.status].color
                    )}
                  >
                    {React.createElement(STATUS_CONFIG[selectedFeature.status].icon, {
                      className: 'h-7 w-7',
                    })}
                  </div>
                  <div>
                    <div
                      className={cn(
                        'mb-2 inline-block rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest',
                        STATUS_CONFIG[selectedFeature.status].color
                      )}
                    >
                      {STATUS_CONFIG[selectedFeature.status].label}
                    </div>
                    <DialogTitle className="text-sm font-black uppercase tracking-tighter">
                      {selectedFeature.label}
                    </DialogTitle>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
<<<<<<< HEAD
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Описание модуля
                    </label>
                    <p className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm font-medium leading-relaxed text-slate-600">
=======
                    <label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                      Описание модуля
                    </label>
                    <p className="text-text-secondary bg-bg-surface2 border-border-subtle rounded-2xl border p-3 text-sm font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                      {selectedFeature.desc}
                    </p>
                  </div>

                  {/* Role-Specific Actions in Dialog */}
                  <div className="space-y-2">
<<<<<<< HEAD
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
                    <label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      Ролевое взаимодействие
                    </label>
                    <div className="space-y-2">
                      {selectedFeature.participants.map((p) => (
                        <div
                          key={p}
<<<<<<< HEAD
                          className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
=======
                          className="bg-bg-surface2 border-border-subtle flex gap-3 rounded-xl border p-3"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          <div
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                              ROLE_CONFIG[p].color
                            )}
                          >
                            {React.createElement(ROLE_CONFIG[p].icon, { className: 'h-4 w-4' })}
                          </div>
                          <div>
<<<<<<< HEAD
                            <p className="text-[9px] font-black uppercase text-slate-900">
                              {ROLE_CONFIG[p].label}
                            </p>
                            <p className="text-[8px] font-medium text-slate-500">
=======
                            <p className="text-text-primary text-[9px] font-black uppercase">
                              {ROLE_CONFIG[p].label}
                            </p>
                            <p className="text-text-secondary text-[8px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                              {selectedFeature.interactionDetails?.[p] ||
                                'Стандартные операции модуля.'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
<<<<<<< HEAD
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Синхронизация в профиле
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <Globe className="h-3 w-3 text-slate-400" />
                        <span className="truncate text-[9px] font-black uppercase text-slate-600">
=======
                      <label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                        Синхронизация в профиле
                      </label>
                      <div className="bg-bg-surface2 border-border-subtle flex items-center gap-2 rounded-xl border p-3">
                        <Globe className="text-text-muted h-3 w-3" />
                        <span className="text-text-secondary truncate text-[9px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          {selectedFeature.syncPage || 'Раздел в разработке'}
                        </span>
                      </div>
                    </div>
                    {selectedFeature.impact && (
                      <div className="space-y-2">
<<<<<<< HEAD
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Бизнес-эффект
                        </label>
                        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3">
                          <p className="text-[9px] font-black uppercase leading-tight text-indigo-600">
=======
                        <label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                          Бизнес-эффект
                        </label>
                        <div className="bg-accent-primary/10 border-accent-primary/20 rounded-xl border p-3">
                          <p className="text-accent-primary text-[9px] font-black uppercase leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                            {selectedFeature.impact}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedFeature.integration && (
                    <div className="space-y-2">
<<<<<<< HEAD
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Технологический партнер
                      </label>
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-4 text-white">
=======
                      <label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                        Технологический партнер
                      </label>
                      <div className="bg-text-primary flex items-center gap-3 rounded-2xl p-4 text-white">
>>>>>>> recover/cabinet-wip-from-stash
                        <Zap className="h-4 w-4 text-amber-400" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-tighter">
                            Синхронизация с {selectedFeature.integration}
                          </p>
                          <p className="text-[8px] font-bold uppercase text-white/50">
                            Автоматический импорт данных через API
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

<<<<<<< HEAD
                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                  <p className="text-[8px] font-bold uppercase text-slate-400">
=======
                <div className="border-border-subtle flex items-center justify-between border-t pt-6">
                  <p className="text-text-muted text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                    ID: {selectedFeature.id}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedFeature(null)}
<<<<<<< HEAD
                      className="rounded-2xl bg-slate-100 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600"
=======
                      className="bg-bg-surface2 text-text-secondary rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      Закрыть
                    </button>
                    {selectedFeature.syncPage && (
                      <button
                        onClick={() => (window.location.href = selectedFeature.syncPage!)}
                        className="flex items-center gap-2 rounded-2xl bg-black px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-transform hover:scale-105"
                      >
                        <Rocket className="h-3.5 w-3.5" /> В раздел
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Role Selection & Logic Section */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
<<<<<<< HEAD
          <Card className="relative overflow-hidden rounded-xl border-none bg-slate-900 text-white shadow-2xl lg:col-span-1">
=======
          <Card className="bg-text-primary relative overflow-hidden rounded-xl border-none text-white shadow-2xl lg:col-span-1">
>>>>>>> recover/cabinet-wip-from-stash
            <CardContent className="relative z-10 space-y-6 p-3">
              <div className="mb-6 flex flex-wrap gap-2">
                {Object.entries(ROLE_CONFIG).map(([role, config]) => {
                  if (['admin', 'b2b'].includes(role)) return null;
                  const isActive = selectedRole === role;
                  return (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role as UserRole)}
                      className={cn(
                        'rounded-xl p-2 transition-all',
                        isActive
                          ? 'scale-110 bg-white text-black shadow-xl'
                          : 'bg-white/10 text-white/40 hover:bg-white/20'
                      )}
                    >
                      {React.createElement(config.icon, { className: 'h-4 w-4' })}
                    </button>
                  );
                })}
              </div>
              <div>
                <h3 className="mb-2 text-base font-black uppercase tracking-tighter">
                  {ROLE_CONFIG[selectedRole].label}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-white/60">
                  {ROLE_CONFIG[selectedRole].desc}
                </p>
              </div>

              {/* AI Insights for Role */}
<<<<<<< HEAD
              <div className="space-y-3 rounded-3xl border border-indigo-500/30 bg-indigo-600/30 p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-indigo-300">
=======
              <div className="bg-accent-primary/30 border-accent-primary/30 space-y-3 rounded-3xl border p-3 backdrop-blur-sm">
                <div className="text-accent-primary flex items-center gap-2">
>>>>>>> recover/cabinet-wip-from-stash
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    AI Insight
                  </span>
                </div>
                <p className="text-[10px] italic leading-relaxed text-white/80">
                  {roleInsight(selectedRole)}
                </p>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                  <span>Ролевой фокус в ОС:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={cn('h-2 w-2 rounded-full', cfg.color)} />
                      <span className="text-[8px] font-bold uppercase text-white/60">
                        {cfg.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

<<<<<<< HEAD
          <div className="space-y-4 rounded-xl border border-slate-100 bg-white/50 p-3 backdrop-blur-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-black uppercase tracking-tight text-slate-800">
=======
          <div className="border-border-subtle space-y-4 rounded-xl border bg-white/50 p-3 backdrop-blur-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="text-accent-primary h-5 w-5" />
                <h3 className="text-text-primary text-base font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                  {activePartnerId !== 'all'
                    ? `Профиль: ${organizations[activePartnerId]?.name}`
                    : 'Центр управления Syntha Scoping'}
                </h3>
              </div>
              {isConfigMode && (
                <Badge className="animate-pulse bg-rose-500 font-black text-white">
                  РЕЖИМ КОНФИГУРАЦИИ ПРАВ
                </Badge>
              )}
            </div>

            {activePartnerId !== 'all' && organizations[activePartnerId]?.subscription ? (
              <div className="grid grid-cols-1 gap-3 duration-500 animate-in slide-in-from-bottom-4 md:grid-cols-3">
<<<<<<< HEAD
                <div className="space-y-4 rounded-xl bg-slate-900 p-4 text-white shadow-xl">
                  <div className="flex items-center gap-2 text-indigo-400">
=======
                <div className="bg-text-primary space-y-4 rounded-xl p-4 text-white shadow-xl">
                  <div className="text-accent-primary flex items-center gap-2">
>>>>>>> recover/cabinet-wip-from-stash
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Пакет услуг
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-black uppercase italic tracking-tighter">
                      {organizations[activePartnerId].subscription?.plan}
                    </p>
                    <p className="mt-1 text-[9px] font-bold uppercase text-white/40">
                      До:{' '}
                      {new Date(
                        organizations[activePartnerId].subscription!.expiresAt
                      ).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>

<<<<<<< HEAD
                <div className="space-y-4 rounded-xl bg-indigo-600 p-4 text-white shadow-xl">
                  <div className="flex items-center gap-2 text-indigo-200">
=======
                <div className="bg-accent-primary space-y-4 rounded-xl p-4 text-white shadow-xl">
                  <div className="text-accent-primary/40 flex items-center gap-2">
>>>>>>> recover/cabinet-wip-from-stash
                    <Gem className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Программа лояльности
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-black uppercase italic tracking-tighter">
                      {organizations[activePartnerId].subscription?.loyalty.level}
                    </p>
<<<<<<< HEAD
                    <p className="mt-1 text-[9px] font-bold uppercase text-indigo-200">
=======
                    <p className="text-accent-primary/40 mt-1 text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                      {organizations[activePartnerId].subscription?.loyalty.points.toLocaleString(
                        'ru-RU'
                      )}{' '}
                      SC Points
                    </p>
                  </div>
                </div>

<<<<<<< HEAD
                <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
=======
                <div className="border-border-subtle space-y-4 rounded-xl border bg-white p-4 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Zap className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Активные привилегии
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {organizations[activePartnerId].subscription?.loyalty.benefits.map((b, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-1 text-[7px] font-black uppercase text-emerald-700"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  {
                    title: 'Конфигуратор прав',
                    desc: 'Включите режим настройки и кликайте по блокам, чтобы мгновенно изменить интерфейс любого партнера.',
                  },
                  { title: 'Тепловая карта (Heatmap)', desc: intensityDesc(activePartnerId) },
                  {
                    title: 'Симуляция потоков',
                    desc: 'Запускайте бизнес-сценарии в верхней панели, чтобы увидеть путь данных между модулями.',
                  },
                  {
                    title: 'Live Pulse',
                    desc: 'Система в реальном времени подсвечивает активные процессы и действия пользователей во всех модулях.',
                  },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
<<<<<<< HEAD
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-indigo-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      {item.title}
                    </div>
                    <p className="text-xs font-medium leading-relaxed text-slate-500">
=======
                    <div className="text-accent-primary flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                      <span className="bg-accent-primary h-1.5 w-1.5 rounded-full" />
                      {item.title}
                    </div>
                    <p className="text-text-secondary text-xs font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Alert Zone */}
            <div className="flex items-center gap-3 rounded-3xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-200">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-900">
                  Требуется внимание: Sourcing
                </p>
                <p className="text-[9px] font-bold uppercase text-amber-700/80">
                  3 партнера ожидают настройки API-коннектора "Supplier Collab Lab".
                </p>
              </div>
              <button className="ml-auto rounded-xl border border-amber-200 bg-white px-4 py-2 text-[9px] font-black uppercase text-amber-600 transition-all hover:bg-amber-500 hover:text-white">
                Настроить
              </button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function roleInsight(role: UserRole): string {
  const insights: Record<string, string> = {
    brand:
      'Максимальный KPI достигается при связке PLM + AI Content. Рекомендуем активировать Ecosystem Laboratory.',
    manufacturer: "Оптимизация загрузки через 'Аукцион мощностей' повышает рентабельность на 24%.",
    supplier: 'Прямая интеграция с PLM бренда сокращает цикл согласования образцов в 3 раза.',
    shop: 'Smart Replenishment снижает Out-of-stock на 18%. Активируйте B2B Портал.',
    client:
      'Лояльность растет через персональные Lookbooks и AI-подбор стиля. Omni-Loyalty — ключ к LTV.',
  };
  return insights[role] || 'Используйте экосистему Syntha для масштабирования вашего бизнеса.';
}

function intensityDesc(partnerId: string) {
  if (partnerId === 'all')
    return 'Показывает общую нагрузку на модули платформы по всем партнерам в реальном времени.';
  return `Анализирует активность компании ${organizations[partnerId]?.name} и подсвечивает неиспользуемые зоны.`;
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest',
        className
      )}
    >
      {children}
    </div>
  );
}
