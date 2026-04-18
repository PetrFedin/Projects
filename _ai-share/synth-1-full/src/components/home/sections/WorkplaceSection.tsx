'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  MessageSquare,
  Database,
  FolderOpen,
  BarChart3,
  Users,
  Cloud,
  Activity,
  ArrowRight,
  ArrowUpRight,
  Layers,
  ShieldCheck,
  Plus,
  Zap,
  Globe,
  Lock,
  PenTool,
  Percent,
  PieChart,
  Calculator,
  Truck,
  X,
  BookOpen,
  Landmark,
  ShoppingBag,
  Gavel,
  Scan,
  ShieldAlert,
  Settings,
  Target,
  ChevronRight,
  Search,
  Settings2,
  FileCheck,
  Share2,
  Monitor,
  Eye,
  Shield,
  Store,
  Briefcase,
  Package,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DigitalWorkplaceMap } from '@/components/dashboard/DigitalWorkplaceMap';
import { useUserContext } from '@/hooks/useUserContext';
import { type B2BUserRole } from '@/lib/data/b2b-workspace-matrix';
import Link from 'next/link';

export function WorkplaceSection() {
  const { isFlowMapOpen, setIsFlowMapOpen, viewRole } = useUIState();
  const { isRetailer, isBrand } = useUserContext();
  const [activeTab, setActiveTab] = useState('ops');
  const containerRef = useRef<HTMLDivElement>(null);

  const primaryB2BRole = useMemo((): B2BUserRole => {
    if (isBrand) return 'brand';
    if (isRetailer) return 'retailer';
    return 'buyer';
  }, [isRetailer, isBrand]);

  const getToolPath = (toolId: string) => {
    // Determine path based on role and tool
    const basePath = viewRole === 'admin' ? '/admin' : '/brand';
    if (toolId === 'collab') return `${basePath}/team`;
    if (toolId === 'pim') return `${basePath}/inventory`;
    if (toolId === 'claims') return `${basePath}/quality`;
    if (toolId === 'dms') return `${basePath}/billing`;
    if (toolId === 'crm') return `${basePath}/customers`;
    if (toolId === 'leads') return `${basePath}/customers`;
    if (toolId === 'showroom-360') return `${basePath}/showroom`;
    if (toolId === 'merch') return `/shop/b2b/matrix`;
    if (toolId === 'planning') return `${basePath}/planning`;
    return basePath;
  };

  const toolCategories = [
    {
      id: 'ops',
      title: 'Операции и Коллаборация',
      tools: [
        {
          id: 'collab',
          title: 'Центр Коллаборации',
          desc: 'Задачи, календарь и мессенджер для команд.',
          icon: MessageSquare,
          roles: ['brand', 'retailer', 'distributor'],
          category: 'КОЛЛАБОРАЦИЯ',
          badge: 'CORE',
        },
        {
          id: 'pim',
          title: 'Система PIM',
          desc: 'Управление мастер-данными товаров и медиа.',
          icon: Database,
          roles: ['brand'],
          category: 'ДАННЫЕ',
          badge: 'DATA',
        },
        {
          id: 'claims',
          title: 'Портал Претензий',
          desc: 'Автоматизация возвратов и рекламаций.',
          icon: ShieldAlert,
          roles: ['brand', 'retailer'],
          category: 'СЕРВИС',
        },
        {
          id: 'dms',
          title: 'DMS Хранилище',
          desc: 'Безопасный электронный документооборот (ЭДО).',
          icon: FolderOpen,
          roles: ['brand', 'retailer'],
          category: 'ДОКУМЕНТЫ',
        },
        {
          id: 'crm',
          title: 'Partner CRM',
          desc: 'Аналитика вовлеченности и перформанса партнеров.',
          icon: BarChart3,
          roles: ['brand', 'distributor'],
          category: 'АНАЛИТИКА',
        },
      ],
    },
    {
      id: 'commercial',
      title: 'Коммерция и Продажи',
      tools: [
        {
          id: 'leads',
          title: 'Lead Scoring',
          desc: 'AI-поиск и оценка потенциальных ретейлеров.',
          icon: Target,
          roles: ['brand'],
          category: 'ПРОДАЖИ',
          badge: 'AI',
        },
        {
          id: 'showroom-360',
          title: 'Шоурум 360°',
          desc: 'Визуальный поиск и детальное изучение коллекций.',
          icon: Scan,
          roles: ['brand', 'retailer'],
          category: 'ВИЗУАЛИЗАЦИЯ',
        },
        {
          id: 'collab-buying',
          title: 'Командные Закупки',
          desc: 'Совместный отбор и голосование за ассортимент.',
          icon: Users,
          roles: ['retailer', 'distributor'],
          category: 'БАЙИНГ',
        },
        {
          id: 'marketing',
          title: 'Asset Cloud',
          desc: 'Облако маркетинговых материалов для соцсетей.',
          icon: Cloud,
          roles: ['brand', 'retailer'],
          category: 'МАРКЕТИНГ',
        },
        {
          id: 'lookbook',
          title: 'Visual Hub',
          desc: 'Интерактивные цифровые лукбуки коллекций.',
          icon: BookOpen,
          roles: ['brand', 'retailer'],
          category: 'КОНТЕНТ',
        },
        {
          id: 'financing',
          title: 'Финансирование',
          desc: 'B2B Buy Now Pay Later (BNPL) и кредитование.',
          icon: Landmark,
          roles: ['retailer', 'distributor'],
          category: 'ФИНАНСЫ',
        },
        {
          id: 'merch',
          title: 'Digital Rack',
          desc: 'Цифровой мерчандайзинг и планограммы.',
          icon: ShoppingBag,
          roles: ['retailer', 'brand'],
          category: 'МЕРЧАНДАЙЗИНГ',
        },
        {
          id: 'planning',
          title: 'AI SKU Planner',
          desc: 'Планирование бюджета и SKU на базе AI.',
          icon: PieChart,
          roles: ['retailer', 'brand'],
          category: 'ПЛАНИРОВАНИЕ',
          badge: 'AI',
        },
      ],
    },
    {
      id: 'supply',
      title: 'Цепочки Поставок',
      tools: [
        {
          id: 'prod-pulse',
          title: 'Production Pulse',
          desc: 'IoT-мониторинг производства на фабриках.',
          icon: Activity,
          roles: ['brand'],
          category: 'ПРОИЗВОДСТВО',
          badge: 'IOT',
        },
        {
          id: 'ats',
          title: 'ATS Инвентарь',
          desc: 'Матрица свободных остатков (Available to Sell).',
          icon: Database,
          roles: ['brand', 'distributor'],
          category: 'СКЛАД',
        },
        {
          id: 'logistics',
          title: 'Трекинг Заказов',
          desc: 'Мониторинг логистических этапов и мильстоунов.',
          icon: Truck,
          roles: ['brand', 'retailer'],
          category: 'ЛОГИСТИКА',
        },
        {
          id: 'landed-cost',
          title: 'Landed Cost',
          desc: 'Калькулятор полной себестоимости импорта.',
          icon: Calculator,
          roles: ['retailer', 'distributor'],
          category: 'РАСЧЕТЫ',
        },
        {
          id: 'contracts',
          title: 'Юридический Хаб',
          desc: 'Цифровое подписание контрактов и соглашений.',
          icon: PenTool,
          roles: ['brand', 'retailer'],
          category: 'ПРАВО',
        },
      ],
    },
  ];

  const ROLE_ICONS: Record<string, any> = {
    brand: Store,
    retailer: ShoppingBag,
    distributor: Briefcase,
    admin: Shield,
  };

  const ROLE_LABELS: Record<string, string> = {
    brand: 'Бренд',
    retailer: 'Ретейлер',
    distributor: 'Дистрибьютор',
    admin: 'Админ',
  };

  const currentTools = useMemo(() => {
    return toolCategories.find((cat) => cat.id === activeTab)?.tools || [];
  }, [activeTab]);

  return (
    <motion.section
      id="WORKPLACE_b2b"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="section-spacing relative scroll-mt-24 bg-transparent"
    >
      <div className="container mx-auto px-4">
        <Card className="relative rounded-xl border border-none border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
          <CardContent className="p-3">
            {/* Header section (Same as Production) */}
            <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900">
                    <LayoutGrid className="h-4 w-4 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-slate-200 px-2 py-0.5 text-xs font-bold uppercase tracking-normal text-slate-900"
                  >
                    B2B_OS_WORKPLACE_V5.0
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold uppercase leading-tight tracking-tight text-slate-900 md:text-4xl">
                  РАБОЧЕЕ ПРОСТРАНСТВО
                </h2>
                <p className="max-w-md text-xs font-medium text-slate-400">
                  Центральный узел управления для fashion-бизнеса и командной работы.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsFlowMapOpen('workplace')}
                        className="hover:border-slate-900"
                      >
                        <Share2 className="h-4 w-4 text-indigo-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-lg border-none bg-slate-900 p-2 text-white shadow-2xl">
                      <p className="text-[10px] font-bold uppercase tracking-wide">
                        Карта процессов
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
                  <button
                    onClick={() => {
                      containerRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
                    }}
                    className="p-1 text-slate-400 transition-colors hover:text-slate-900"
                  >
                    <ArrowRight className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    onClick={() => {
                      containerRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
                    }}
                    className="p-1 text-slate-400 transition-colors hover:text-slate-900"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs (Same as Production) */}
            <div className="no-scrollbar mb-8 flex snap-x gap-2 overflow-x-auto pb-2">
              <div className="flex w-fit shrink-0 items-center gap-1.5 rounded-2xl border border-slate-100 bg-slate-50 p-1">
                {toolCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={cn(
                      'btn-tab min-w-[160px]',
                      activeTab === cat.id ? 'btn-tab-active' : 'btn-tab-inactive'
                    )}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Carousel (Same as Production) */}
            <div className="group/workplace relative -mx-4 mb-8 px-4">
              <div
                ref={containerRef}
                className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-6"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-3"
                  >
                    {currentTools.map((tool, idx) => (
                      <div
                        key={tool.id}
                        className="group/card relative flex w-[280px] flex-shrink-0 snap-start flex-col rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-slate-900/30 hover:shadow-2xl hover:shadow-slate-200/50 md:w-[320px]"
                      >
                        <div className="absolute right-6 top-4 z-20">
                          <div className="flex items-center gap-1.5">
                            {tool.badge && (
                              <Badge
                                className={cn(
                                  'flex h-5 items-center border-none px-1.5 text-[7px] font-bold uppercase tracking-wide shadow-lg',
                                  tool.badge === 'AI'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-900 text-white'
                                )}
                              >
                                {tool.badge}
                              </Badge>
                            )}
                            {tool.roles.map((role) => {
                              const Icon = ROLE_ICONS[role];
                              return (
                                <TooltipProvider key={role}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="rounded-lg border border-slate-100 bg-white p-1.5 text-slate-400 shadow-sm">
                                        <Icon className="h-3.5 w-3.5" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="rounded-lg border-none bg-slate-900 p-2 text-white shadow-2xl">
                                      <p className="text-[10px] font-bold uppercase tracking-wide">
                                        {ROLE_LABELS[role]}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="space-y-1">
                            <p className="text-[5.5px] font-bold uppercase tracking-wide text-indigo-600 opacity-60">
                              {tool.category}
                            </p>
                            <h4 className="text-[10px] font-bold uppercase leading-none tracking-wide text-slate-900 transition-colors group-hover/card:text-indigo-600">
                              {tool.title}
                            </h4>
                          </div>
                          <p className="text-xs font-medium leading-relaxed text-slate-500">
                            {tool.desc}
                          </p>
                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-6">
                          {(() => {
                            const isAccessGranted =
                              tool.roles.includes(primaryB2BRole) || viewRole === 'admin';
                            return (
                              <Button
                                variant="ctaOutline"
                                size="ctaSm"
                                asChild={isAccessGranted}
                                disabled={!isAccessGranted}
                                className={cn(
                                  'group/btn mx-auto w-[200px]',
                                  !isAccessGranted &&
                                    'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 opacity-60'
                                )}
                              >
                                {isAccessGranted ? (
                                  <Link href={getToolPath(tool.id)}>
                                    Инициализировать
                                    <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                                  </Link>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    Доступ ограничен
                                    <Lock className="h-3 w-3" />
                                  </span>
                                )}
                              </Button>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Banner (Same as Production) */}
            <Card className="group/banner relative flex min-h-[300px] items-center overflow-hidden rounded-[3.5rem] border-b-8 border-none border-indigo-600 bg-[#0A0F1E] shadow-2xl">
              <div className="absolute inset-0 overflow-hidden rounded-[3.5rem] opacity-25 transition-transform duration-1000 group-hover/banner:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000"
                  className="h-full w-full object-cover grayscale"
                  alt="Industrial Background"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1E] via-[#0A0F1E]/80 to-transparent" />
              <CardContent className="relative z-10 max-w-4xl space-y-6 p-4 text-white">
                <div className="relative mb-4 overflow-hidden whitespace-nowrap border-y border-white/10 py-2">
                  <motion.div
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
                    className="flex w-fit items-center gap-3"
                  >
                    {[1, 2].map((i) => (
                      <div key={i} className="flex shrink-0 items-center gap-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                          • Смарт-Контракты
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                          • Командная Работа
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                          • Дистрибуция Контента
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                          • Таможенный Комплаенс
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                          • Синхронизация PIM
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>
                <h2 className="text-xl font-bold uppercase leading-tight tracking-tight md:text-3xl">
                  АРХИТЕКТУРА ЭФФЕКТИВНОСТИ
                </h2>
                <p className="border-l-2 border-indigo-500/50 pl-6 text-sm font-medium text-slate-300">
                  "Интеллектуальная среда управления, где каждый процесс прозрачен, а каждое решение
                  подкреплено аналитикой."
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Process Map Dialog */}
        <Dialog
          open={isFlowMapOpen === 'workplace'}
          onOpenChange={(open) => setIsFlowMapOpen(open ? 'workplace' : null)}
        >
          <DialogContent className="z-[10000] flex max-h-[96vh] max-w-[98vw] flex-col overflow-hidden rounded-xl border-none bg-slate-900 p-0 shadow-[0_0_50px_rgba(0,0,0,0.1)]">
            <DialogHeader className="sr-only">
              <DialogTitle>Карта Процессов Пространства</DialogTitle>
            </DialogHeader>
            <DigitalWorkplaceMap
              onClose={() => setIsFlowMapOpen(null)}
              primaryRole={primaryB2BRole}
            />
          </DialogContent>
        </Dialog>
      </div>
    </motion.section>
  );
}
