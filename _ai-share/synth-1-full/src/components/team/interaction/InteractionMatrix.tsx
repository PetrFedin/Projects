'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shield, Store, Factory, Handshake, Truck, Users, User, 
  Check, Zap, Cpu, Box, ShoppingCart, Network, Repeat, ChevronRight, Activity,
  Info, Clock, Settings, FileText, ScanBarcode, PieChart, MessageCircle,
  Smartphone, BarChart3, Layers, Globe, ShieldCheck, ZapOff, RefreshCcw, Gem,
  Target, Rocket, Briefcase, TrendingUp, Heart, Search, MousePointer2, 
  DollarSign, BarChart4, Scaling, FileSearch, Play, Pause, RotateCcw,
  Eye, EyeOff, Lock, Unlock, Filter, Sparkles, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { organizations, activityLogs } from '@/components/team/_fixtures/team-data';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Основные этапы бизнеса в Syntha OS
 */
const BUSINESS_STAGES = [
  { id: 'design', label: 'Дизайн и разработка (PLM)', icon: Box, color: 'text-amber-500 bg-amber-50' },
  { id: 'sourcing', label: 'Закупки и сорсинг', icon: Handshake, color: 'text-green-500 bg-green-50' },
  { id: 'production', label: 'Производство', icon: Factory, color: 'text-blue-500 bg-blue-50' },
  { id: 'logistics', label: 'Логистика и таможня', icon: Truck, color: 'text-purple-500 bg-purple-50' },
  { id: 'wholesale', label: 'Оптовые продажи (B2B)', icon: ShoppingCart, color: 'text-indigo-500 bg-indigo-50' },
  { id: 'retail', label: 'Ритейл и лояльность', icon: Store, color: 'text-rose-500 bg-rose-50' }
];

const ROLE_CONFIG: Record<UserRole, { label: string, icon: any, color: string, desc: string }> = {
  admin: { label: 'Администратор', icon: Shield, color: 'text-slate-900 bg-slate-100', desc: 'Полный контроль всей экосистемы и прав доступа' },
  brand: { label: 'Бренд', icon: Store, color: 'text-amber-600 bg-amber-50', desc: 'Владелец продукта, коллекций и интеллектуальной собственности' },
  manufacturer: { label: 'Фабрика', icon: Factory, color: 'text-blue-600 bg-blue-50', desc: 'Производственная площадка, выполняющая заказы по ТЗ' },
  supplier: { label: 'Поставщик', icon: Handshake, color: 'text-green-600 bg-green-50', desc: 'Поставщик тканей, фурнитуры и расходных материалов' },
  distributor: { label: 'Дистрибьютор', icon: Truck, color: 'text-purple-600 bg-purple-50', desc: 'Оптовый посредник, управляющий стоками и логистикой' },
  shop: { label: 'Магазин', icon: Users, color: 'text-rose-600 bg-rose-50', desc: 'Розничная точка продаж или онлайн-ритейлер' },
  client: { label: 'Клиент', icon: User, color: 'text-slate-600 bg-slate-50', desc: 'Конечный покупатель продукции бренда' },
  b2b: { label: 'B2B Пользователь', icon: Users, color: 'text-slate-500 bg-slate-100', desc: 'Корпоративный клиент или байер' }
};

const STATUS_CONFIG = {
  active: { label: 'Активно', desc: 'Функция полностью реализована и доступна для работы', color: 'bg-green-500 text-white', icon: Check },
  pending: { label: 'В разработке', desc: 'Функционал находится на этапе активного программирования', color: 'bg-blue-400 text-white', icon: Clock },
  unconfigured: { label: 'Требует настройки', desc: 'Модуль готов, но требует интеграции с вашими данными (API/1C)', color: 'bg-amber-400 text-white', icon: Settings },
  rus_market: { label: 'Рынок РФ', desc: 'Специализированный модуль для соответствия законодательству РФ', color: 'bg-indigo-600 text-white', icon: ShieldCheck }
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
  { id: 'sim-1', name: 'Жизненный цикл дропа', steps: ['f1', 'f39', 'f6', 'f9', 'f11', 'f17'], color: 'text-amber-500' },
  { id: 'sim-2', name: 'Оптовый цикл', steps: ['f17', 'f34', 'f19', 'f13', 'f43', 'f15'], color: 'text-indigo-500' },
  { id: 'sim-3', name: 'Клиентский путь', steps: ['f21', 'f46', 'f47', 'f35', 'f54'], color: 'text-rose-500' }
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
      integration: 'Syntha Global', 
      targetType: 'plm',
      interactionDetails: {
        brand: 'Создание и утверждение техзаданий и 3D-моделей.',
        manufacturer: 'Просмотр лекал, расчет расхода материалов и запуск в работу.'
      }
    },
    { 
      id: 'f2', 
      label: 'AI Лукбуки и контент', 
      desc: 'Автоматическая генерация рекламных образов на основе 3D. Продажи начинаются до пошива образцов.', 
      status: 'active', 
      participants: ['brand'], 
      syncPage: '/brand/media', 
      integration: 'Brand Portal',
      dependencies: ['f1'],
      interactionDetails: {
        brand: 'Генерация маркетинговых материалов на основе 3D-семплов.'
      }
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
        brand: 'Автоматическая сверка новых эскизов с историческим ДНК бренда.'
      }
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
        client: 'Голосование и оформление предзаказов.'
      }
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
        shop: 'Передача данных о возвратах и предпочтениях.'
      }
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
        manufacturer: 'Приемка лекал, адаптированных под локальный рынок.'
      }
    }
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
        supplier: 'Подача коммерческих предложений и спецификаций.'
      }
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
        supplier: 'Предложение инновационных решений и цифровых образцов.'
      }
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
        distributor: 'Анализ логистических затрат и планирование закупок.'
      }
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
        brand: 'Мониторинг остатков сырья в реальном времени.'
      }
    },
    { 
      id: 'f27', 
      label: 'AI Риски поставок', 
      desc: 'Мониторинг цепочек поставок и предсказание задержек. Страхование сроков производства.', 
      status: 'pending', 
      participants: ['brand', 'supplier'], 
      integration: 'Global Logistics',
      interactionDetails: {
        brand: 'Управление планами страхования сроков.',
        supplier: 'Предоставление данных о логистических рисках.'
      }
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
        manufacturer: 'Проверка технологичности материалов для пошива.'
      }
    }
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
        brand: 'Наблюдение за прогрессом и корректировка приоритетов.'
      }
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
        brand: 'Получение уведомлений о потенциальных дефектах.'
      }
    },
    { 
      id: 'f30', 
      label: 'Аукцион мощностей', 
      desc: 'Продажа свободных окон фабриками. Бренды быстро размещают дозаказы хитов.', 
      status: 'active', 
      participants: ['manufacturer', 'brand'], 
      syncPage: '/factory/auctions',
      interactionDetails: {
        manufacturer: 'Выставление свободных слотов на продажу.',
        brand: 'Бронирование мощностей для срочных тиражей.'
      }
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
        admin: 'Модерация вакансий и верификация специалистов.'
      }
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
        client: 'Проверка подлинности и истории продукта.'
      }
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
        brand: 'Ввод товаров в оборот и отчетность в ЦРПТ.'
      }
    }
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
        brand: 'Выбор оптимальных тарифов и сроков доставки.'
      }
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
        shop: 'Планирование приемки поставок в магазинах.'
      }
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
        shop: 'Запрос на прямую отгрузку клиентам (Drop-shipping).'
      }
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
        supplier: 'Получение оплаты за сырье.'
      }
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
        shop: 'Просмотр реальных остатков на складах партнера.'
      }
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
        brand: 'Контроль уплаты пошлин и НДС.'
      }
    }
  ],
  wholesale: [
    { 
      id: 'f17', 
      label: 'Оптовый B2B Портал', 
      desc: 'Цифровой шоурум для байеров. Заказы и планирование ассортимента в одном окне.', 
      status: 'active', 
      participants: ['brand', 'shop'], 
      syncPage: '/shop/b2b/partners', 
      integration: 'Syntha B2B', 
      targetType: 'order',
      interactionDetails: {
        brand: 'Настройка каталога, лимитов и индивидуальных цен.',
        shop: 'Формирование предзаказов и отслеживание баланса.'
      }
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
        shop: 'Автоматическое подтверждение пополнения хитов.'
      }
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
        shop: 'Сравнение показателей с рыночными бенчмарками.'
      }
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
        admin: 'Одобрение кредитных лимитов на базе данных ОС.'
      }
    },
    { 
      id: 'f34', 
      label: 'Line Planning Collab', 
      desc: 'Совместное планирование линеек магазина и бренда. Оптимизация маржинальности.', 
      status: 'active', 
      participants: ['brand', 'shop'], 
      syncPage: '/brand/b2b/linesheets', 
      integration: 'Syntha B2B',
      interactionDetails: {
        brand: 'Предложение структуры коллекции под нужды ритейла.',
        shop: 'Совместная верстка ассортиментной матрицы.'
      }
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
        brand: 'Получение данных для планирования производства.'
      }
    }
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
        client: 'Примерка вещей на аватар или через камеру.'
      }
    },
    { 
      id: 'f46', 
      label: 'AI Personal Lookbook', 
      desc: 'Персональные рекомендации образов. Помощь клиенту в развитии стиля и подборе гардероба.', 
      status: 'active', 
      participants: ['brand', 'client'], 
      syncPage: '/u/wardrobe',
      dependencies: ['f21'],
      interactionDetails: {
        brand: 'Обучение AI-стилиста стилистике бренда.',
        client: 'Получение персональных рекомендаций по стилю.'
      }
    },
    { 
      id: 'f47', 
      label: 'Omni-Loyalty Ecosystem', 
      desc: 'Программа лояльности через ценности: доступ к карьере, показам и аукционам.', 
      status: 'active', 
      participants: ['brand', 'client', 'shop'], 
      syncPage: '/u/loyalty',
      interactionDetails: {
        brand: 'Настройка уровней доступа и эксклюзивных наград.',
        client: 'Накопление баллов и использование привилегий.',
        shop: 'Применение скидок лояльности при продаже.'
      }
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
        admin: 'Управление залоговыми обязательствами.'
      }
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
        client: 'Поиск товаров по фотографиям и скриншотам.'
      }
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
        shop: 'Управление продажами через партнерские кабинеты.'
      }
    }
  ]
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
  const [activeSim, setActiveSim] = useState<typeof SIMULATIONS[0] | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  
  // Real-time Pulse state (simulated)
  const [livePulse, setLivePulse] = useState<Record<string, string>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const allIds = Object.values(STAGE_FEATURES).flat().map(f => f.id);
      const randomId = allIds[Math.floor(Math.random() * allIds.length)];
      const actions = ['Редактирование', 'Просмотр', 'Запрос API', 'Новый заказ', 'Загрузка лекал', 'Анализ AI'];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      setLivePulse(prev => ({
        ...prev,
        [randomId]: action
      }));
      
      setTimeout(() => {
        setLivePulse(prev => {
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
    const relevantLogs = activePartnerId === 'all' 
      ? activityLogs 
      : activityLogs.filter(l => l.organizationId === activePartnerId);

    Object.values(STAGE_FEATURES).flat().forEach(f => {
      const count = relevantLogs.filter(l => l.targetType === f.targetType).length;
      intensity[f.id] = Math.min(count * 20, 100); 
    });
    return intensity;
  }, [activePartnerId]);

  const relatedFeatureIds = useMemo(() => {
    if (activeSim && simStep !== null) return activeSim.steps.slice(0, simStep + 1);
    if (!hoveredFeatureId) return [];
    const allFeatures = Object.values(STAGE_FEATURES).flat();
    const current = allFeatures.find(f => f.id === hoveredFeatureId);
    if (!current) return [];
    const deps = current.dependencies || [];
    const dependents = allFeatures.filter(f => f.dependencies?.includes(hoveredFeatureId)).map(f => f.id);
    return [...deps, ...dependents];
  }, [hoveredFeatureId, activeSim, simStep]);

  const toggleFeature = (featureId: string) => {
    if (!isConfigMode || activePartnerId === 'all') return;
    setDisabledFeatures(prev => {
      const current = prev[activePartnerId] || [];
      const updated = current.includes(featureId)
        ? current.filter(id => id !== featureId)
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Dynamic Header with Controls */}
      <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 bg-white/40 p-4 rounded-xl border border-white/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200">
            <Network className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-base font-black uppercase tracking-tighter">Syntha OS Matrix</h2>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {isConfigMode ? `Настройка прав: ${organizations[activePartnerId]?.name || 'Все'}` : 'Центр управления экосистемой'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Simulation Player */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <div className="px-3 text-[9px] font-black uppercase text-slate-400">Сценарии:</div>
            {SIMULATIONS.map(sim => (
              <button
                key={sim.id}
                onClick={() => { setActiveSim(sim); setSimStep(0); }}
                className={cn(
                  "px-3 py-2 rounded-xl text-[9px] font-black uppercase transition-all",
                  activeSim?.id === sim.id ? "bg-black text-white" : "hover:bg-white text-slate-600"
                )}
              >
                {sim.name}
              </button>
            ))}
            {activeSim && (
              <button onClick={() => { setActiveSim(null); setSimStep(null); }} className="p-2 text-rose-500">
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Config & Heatmap Toggles */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-2xl">
            <button
              onClick={() => setIsConfigMode(!isConfigMode)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase",
                isConfigMode ? "bg-indigo-600 text-white shadow-lg" : "text-white/40 hover:text-white"
              )}
            >
              {isConfigMode ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              {isConfigMode ? "Конфигуратор ON" : "Настроить права"}
            </button>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                showHeatmap ? "bg-amber-500 text-white" : "text-white/40"
              )}
            >
              <TrendingUp className="h-4 w-4" />
            </button>
          </div>

          {/* Partner Selector */}
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Filter className="h-3.5 w-3.5 text-slate-400 ml-2" />
            <select 
              value={activePartnerId}
              onChange={(e) => setActivePartnerId(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase outline-none pr-4"
            >
              <option value="all">Все партнеры</option>
              {Object.values(organizations).filter(o => o.type !== 'admin').map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Process Scheme */}
      <div className="relative">
        <div className="absolute top-[60px] left-0 w-full h-1 bg-slate-100 z-0 hidden lg:block" />
        
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 relative z-10">
          {BUSINESS_STAGES.map((stage, index) => {
            const features = STAGE_FEATURES[stage.id] || [];
            const roleInStage = features.some(f => f.participants.includes(selectedRole));

            return (
              <div key={stage.id} className="space-y-6">
                {/* Stage Node */}
                <div className={cn(
                  "relative p-4 rounded-xl border-2 transition-all duration-500 text-center flex flex-col items-center gap-3",
                  roleInStage 
                    ? "bg-white border-indigo-600 shadow-xl" 
                    : "bg-slate-50/50 border-slate-100 opacity-40 grayscale"
                )}>
                  {index < BUSINESS_STAGES.length - 1 && (
                    <div className="absolute -right-5 top-1/2 -translate-y-1/2 hidden lg:block">
                      <ChevronRight className="h-4 w-4 text-slate-200" />
                    </div>
                  )}
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500", roleInStage ? "scale-110" : "scale-90", stage.color)}>
                    {React.createElement(stage.icon, { className: "h-6 w-6" })}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-900 leading-tight">{stage.label}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Шаг {index + 1}</p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 min-h-[300px]">
                  {features.map((f) => {
                    const isRelevant = f.participants.includes(selectedRole);
                    const isDisabled = isFeatureDisabled(f.id);
                    const statusInfo = STATUS_CONFIG[f.status];
                    const isHighlighted = hoveredFeatureId === f.id || relatedFeatureIds.includes(f.id);
                    const intensity = showHeatmap ? (heatmapData[f.id] || 0) : 0;
                    const isCurrentSimStep = activeSim?.steps[simStep!] === f.id;
                    const liveAction = livePulse[f.id];

                    return (
                      <motion.div
                        key={f.id}
                        layoutId={f.id}
                        onClick={() => toggleFeature(f.id)}
                      >
                        <Card 
                          onMouseEnter={() => setHoveredFeatureId(f.id)}
                          onMouseLeave={() => setHoveredFeatureId(null)}
                          className={cn(
                            "border-none shadow-sm rounded-2xl transition-all duration-300 relative group overflow-hidden cursor-pointer",
                            isRelevant ? "bg-white opacity-100" : "bg-slate-100/50 opacity-30 scale-95 pointer-events-none",
                            isDisabled && "grayscale brightness-50",
                            isHighlighted && isRelevant ? "ring-2 ring-indigo-600 ring-offset-2 scale-105 z-20 shadow-xl" : "",
                            isCurrentSimStep && "ring-4 ring-amber-500 ring-offset-4 scale-110 shadow-2xl"
                          )}
                        >
                          {/* Live Activity Indicator */}
                          <AnimatePresence>
                            {liveAction && isRelevant && (
                              <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="absolute top-0 right-0 left-0 bg-indigo-600 text-white text-[7px] font-black uppercase py-1 text-center z-30"
                              >
                                {liveAction}...
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Heatmap Overlay */}
                          {showHeatmap && isRelevant && intensity > 0 && (
                            <div 
                              className="absolute inset-0 bg-amber-500/10 pointer-events-none"
                              style={{ opacity: intensity / 100 }}
                            />
                          )}

                          <CardContent className="p-3 space-y-3 relative z-10">
                            <div className="flex items-center justify-between">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className={cn("h-5 w-5 rounded-lg flex items-center justify-center cursor-help", statusInfo.color)}>
                                    {React.createElement(statusInfo.icon, { className: "h-3 w-3" })}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-slate-900 text-white border-none p-3 max-w-[200px] rounded-xl shadow-2xl">
                                  <p className="text-[10px] font-black uppercase tracking-widest mb-1">{statusInfo.label}</p>
                                  <p className="text-[9px] font-medium leading-relaxed opacity-70">{statusInfo.desc}</p>
                                </TooltipContent>
                              </Tooltip>
                              
                              <div className="flex gap-1">
                                {isConfigMode && activePartnerId !== 'all' && (
                                  <div className={cn("h-6 w-6 rounded-lg flex items-center justify-center", isDisabled ? "bg-rose-500 text-white" : "bg-green-500 text-white")}>
                                    {isDisabled ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                  </div>
                                )}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setSelectedFeature(f); }}
                                  className="h-6 w-6 bg-slate-50 rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                                >
                                  <Info className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-[9px] font-black uppercase text-slate-800 leading-tight tracking-tight line-clamp-2">
                              {f.label}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex -space-x-1.5">
                                {f.participants.map(p => {
                                  const detail = f.interactionDetails?.[p];
                                  return (
                                    <Tooltip key={p}>
                                      <TooltipTrigger asChild>
                                        <div className={cn("h-5 w-5 rounded-full border-2 border-white flex items-center justify-center transition-transform hover:scale-125 z-10", ROLE_CONFIG[p].color)}>
                                          {React.createElement(ROLE_CONFIG[p].icon, { className: "h-2.5 w-2.5" })}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-white border border-slate-200 text-slate-900 p-3 rounded-xl shadow-xl max-w-[180px]">
                                        <p className="text-[9px] font-black uppercase tracking-widest mb-1">{ROLE_CONFIG[p].label}</p>
                                        <p className="text-[8px] font-medium leading-tight text-slate-500 italic">
                                          {detail || "Участвует в процессе синхронно с другими ролями."}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  );
                                })}
                              </div>
                              {f.integration && (
                                <div className="px-1.5 py-0.5 bg-slate-100 rounded text-[7px] font-bold text-slate-500 uppercase">
                                  {f.integration}
                                </div>
                              )}
                            </div>
                          </CardContent>
                          
                          {/* Heatmap intensity bar */}
                          {showHeatmap && isRelevant && (
                            <div className="h-0.5 w-full bg-slate-100 mt-auto">
                              <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${intensity}%` }} />
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
        <DialogContent className="max-w-md bg-white rounded-xl p-3 border-none shadow-2xl">
          {selectedFeature && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shadow-xl", STATUS_CONFIG[selectedFeature.status].color)}>
                  {React.createElement(STATUS_CONFIG[selectedFeature.status].icon, { className: "h-7 w-7" })}
                </div>
                <div>
                  <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-2 inline-block", STATUS_CONFIG[selectedFeature.status].color)}>
                    {STATUS_CONFIG[selectedFeature.status].label}
                  </div>
                  <DialogTitle className="text-sm font-black uppercase tracking-tighter">{selectedFeature.label}</DialogTitle>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Описание модуля</label>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {selectedFeature.desc}
                  </p>
                </div>

                {/* Role-Specific Actions in Dialog */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ролевое взаимодействие</label>
                  <div className="space-y-2">
                    {selectedFeature.participants.map(p => (
                      <div key={p} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", ROLE_CONFIG[p].color)}>
                          {React.createElement(ROLE_CONFIG[p].icon, { className: "h-4 w-4" })}
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-900">{ROLE_CONFIG[p].label}</p>
                          <p className="text-[8px] text-slate-500 font-medium">{selectedFeature.interactionDetails?.[p] || "Стандартные операции модуля."}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Синхронизация в профиле</label>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Globe className="h-3 w-3 text-slate-400" />
                      <span className="text-[9px] font-black text-slate-600 uppercase truncate">{selectedFeature.syncPage || 'Раздел в разработке'}</span>
                    </div>
                  </div>
                  {selectedFeature.impact && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Бизнес-эффект</label>
                      <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                        <p className="text-[9px] font-black text-indigo-600 uppercase leading-tight">{selectedFeature.impact}</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedFeature.integration && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Технологический партнер</label>
                    <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-2xl text-white">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tighter">Синхронизация с {selectedFeature.integration}</p>
                        <p className="text-[8px] text-white/50 font-bold uppercase">Автоматический импорт данных через API</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <p className="text-[8px] font-bold text-slate-400 uppercase">ID: {selectedFeature.id}</p>
                <div className="flex gap-3">
                  <button onClick={() => setSelectedFeature(null)} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">Закрыть</button>
                  {selectedFeature.syncPage && (
                    <button onClick={() => window.location.href = selectedFeature.syncPage!} className="px-8 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-1 border-none shadow-2xl rounded-xl bg-slate-900 text-white overflow-hidden relative">
          <CardContent className="p-3 space-y-6 relative z-10">
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(ROLE_CONFIG).map(([role, config]) => {
                if (['admin', 'b2b'].includes(role)) return null;
                const isActive = selectedRole === role;
                return (
                  <button key={role} onClick={() => setSelectedRole(role as UserRole)} className={cn("p-2 rounded-xl transition-all", isActive ? "bg-white text-black scale-110 shadow-xl" : "bg-white/10 text-white/40 hover:bg-white/20")}>
                    {React.createElement(config.icon, { className: "h-4 w-4" })}
                  </button>
                );
              })}
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tighter mb-2">{ROLE_CONFIG[selectedRole].label}</h3>
              <p className="text-sm text-white/60 font-medium leading-relaxed">{ROLE_CONFIG[selectedRole].desc}</p>
            </div>
            
            {/* AI Insights for Role */}
            <div className="p-3 bg-indigo-600/30 rounded-3xl border border-indigo-500/30 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-2 text-indigo-300">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Insight</span>
              </div>
              <p className="text-[10px] text-white/80 leading-relaxed italic">
                {roleInsight(selectedRole)}
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-white/40 tracking-widest">
                <span>Ролевой фокус в ОС:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", cfg.color)} />
                    <span className="text-[8px] font-bold text-white/60 uppercase">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-100 p-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-black uppercase tracking-tight text-slate-800">
                {activePartnerId !== 'all' ? `Профиль: ${organizations[activePartnerId]?.name}` : 'Центр управления Syntha Scoping'}
              </h3>
            </div>
            {isConfigMode && (
              <Badge className="bg-rose-500 text-white font-black animate-pulse">РЕЖИМ КОНФИГУРАЦИИ ПРАВ</Badge>
            )}
          </div>
          
          {activePartnerId !== 'all' && organizations[activePartnerId]?.subscription ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-4 bg-slate-900 rounded-xl text-white space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-indigo-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Пакет услуг</span>
                </div>
                <div>
                  <p className="text-base font-black uppercase tracking-tighter italic">{organizations[activePartnerId].subscription?.plan}</p>
                  <p className="text-[9px] text-white/40 font-bold uppercase mt-1">До: {new Date(organizations[activePartnerId].subscription!.expiresAt).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>

              <div className="p-4 bg-indigo-600 rounded-xl text-white space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-indigo-200">
                  <Gem className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Программа лояльности</span>
                </div>
                <div>
                  <p className="text-base font-black uppercase tracking-tighter italic">{organizations[activePartnerId].subscription?.loyalty.level}</p>
                  <p className="text-[9px] text-indigo-200 font-bold uppercase mt-1">{organizations[activePartnerId].subscription?.loyalty.points.toLocaleString('ru-RU')} SC Points</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-100 rounded-xl space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Zap className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Активные привилегии</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {organizations[activePartnerId].subscription?.loyalty.benefits.map((b, i) => (
                    <span key={i} className="text-[7px] font-black uppercase px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Конфигуратор прав", desc: "Включите режим настройки и кликайте по блокам, чтобы мгновенно изменить интерфейс любого партнера." },
                { title: "Тепловая карта (Heatmap)", desc: intensityDesc(activePartnerId) },
                { title: "Симуляция потоков", desc: "Запускайте бизнес-сценарии в верхней панели, чтобы увидеть путь данных между модулями." },
                { title: "Live Pulse", desc: "Система в реальном времени подсвечивает активные процессы и действия пользователей во всех модулях." }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-[11px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Quick Alert Zone */}
          <div className="p-4 bg-amber-50 rounded-3xl border border-amber-100 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-200">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-amber-900 tracking-widest">Требуется внимание: Sourcing</p>
              <p className="text-[9px] text-amber-700/80 font-bold uppercase">3 партнера ожидают настройки API-коннектора "Supplier Collab Lab".</p>
            </div>
            <button className="ml-auto px-4 py-2 bg-white text-amber-600 border border-amber-200 rounded-xl text-[9px] font-black uppercase hover:bg-amber-500 hover:text-white transition-all">
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
    brand: "Максимальный KPI достигается при связке PLM + AI Content. Рекомендуем активировать Ecosystem Laboratory.",
    manufacturer: "Оптимизация загрузки через 'Аукцион мощностей' повышает рентабельность на 24%.",
    supplier: "Прямая интеграция с PLM бренда сокращает цикл согласования образцов в 3 раза.",
    shop: "Smart Replenishment снижает Out-of-stock на 18%. Активируйте B2B Портал.",
    client: "Лояльность растет через персональные Lookbooks и AI-подбор стиля. Omni-Loyalty — ключ к LTV."
  };
  return insights[role] || "Используйте экосистему Syntha для масштабирования вашего бизнеса.";
}

function intensityDesc(partnerId: string) {
  if (partnerId === 'all') return "Показывает общую нагрузку на модули платформы по всем партнерам в реальном времени.";
  return `Анализирует активность компании ${organizations[partnerId]?.name} и подсвечивает неиспользуемые зоны.`;
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", className)}>{children}</div>;
}
