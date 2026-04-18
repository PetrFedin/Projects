'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Store,
  ShoppingBag,
  BarChart3,
  Layers,
  Eye,
  Package,
  ChevronRight,
  Share2,
  Monitor,
  MessageSquare,
  FileCheck,
  Search,
  Settings2,
  ArrowRight,
  Database,
  Users,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserContext } from '@/hooks/useUserContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WORKSPACE_TABS,
  WORKSPACE_ITEMS,
  ROLE_CONFIG,
  ROLE_PERMISSIONS,
  WORKSPACE_ITEM_PATHS,
  type B2BUserRole,
} from '@/lib/data/b2b-workspace-matrix';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import {
  OrganizationSwitcher,
  AIAssistantChat,
  QuickReorderBar,
  SmartRecommendationsWidget,
} from '@/components/dashboard';
import { ReplenishmentRecommendationsBlock } from '@/components/b2b/ReplenishmentRecommendationsBlock';

export default function DigitalWorkplacePage() {
  const { isRetailer, isBrand, isBuyer, currentOrg } = useUserContext();
  const [activeTab, setActiveTab] = useState('intelligence');

  const primaryRole = useMemo((): B2BUserRole => {
    if (isRetailer) return 'retailer';
    if (isBrand) return 'brand';
    if (isBuyer) return 'buyer';
    return 'distributor';
  }, [isRetailer, isBrand, isBuyer]);

  const filteredItems = useMemo(() => {
    const allowed = ROLE_PERMISSIONS[primaryRole] || [];
    return WORKSPACE_ITEMS.filter((it) => it.tabId === activeTab && allowed.includes(it.id));
  }, [activeTab, primaryRole]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground antialiased">
      <QuickReorderBar />

      <main className="container mx-auto space-y-6 px-4 py-6 md:px-6 lg:px-8">
        {/* Заголовок — JOOR-style */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                B2B Workplace
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Рабочее пространство
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Центральный узел управления для fashion-бизнеса. Единые инструменты для управления
              продуктом, командной работы и комплаенса.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Активных
            </span>
            <span className="text-xl font-bold tabular-nums text-slate-900">14</span>
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Табы — чистый B2B */}
        <nav className="flex flex-wrap gap-2 rounded-xl border border-slate-200/60 bg-slate-100/80 p-2">
          {WORKSPACE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200',
                activeTab === tab.id
                  ? 'border border-slate-200 bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Поток заказов */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/60 bg-slate-50/80 p-4">
          <span className="mr-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Поток заказов
          </span>
          <Link
            href={ROUTES.shop.b2bCreateOrder}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            Создать заказ
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href={ROUTES.shop.b2bOrderByCollection}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            Заказ по коллекции
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href={ROUTES.shop.b2bOrderDrafts}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            Черновики
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href={ROUTES.shop.b2bOrders}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            Мои заказы
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href={ROUTES.shop.b2bFinance}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            Финансы партнёра
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href={ROUTES.shop.b2bPayment}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            Оплата (JOOR Pay)
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href={ROUTES.shop.b2bCollectionTerms}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            Условия по коллекциям
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href={ROUTES.shop.b2bDeliveryCalendar}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            Календарь поставок
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href={ROUTES.shop.b2bShowroom}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            Виртуальный шоурум
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href={ROUTES.shop.b2bLookbookShare}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            Поделиться лукбуком
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href={ROUTES.shop.b2bAcademy}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            Академия
          </Link>
        </div>

        {/* Сетка карточек */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {WORKSPACE_TABS.find((t) => t.id === activeTab)?.label ?? 'Модули'}
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="wait">
              {filteredItems.map((item, idx) => {
                const href = WORKSPACE_ITEM_PATHS[item.id] || '/shop/b2b';
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                  >
                    <Link href={href} className="block h-full">
                      <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md">
                        <div className="flex h-full flex-col space-y-4 p-5">
                          {/* Категория и Сетка иконок в углу */}
                          <div className="flex items-start justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                              {item.category || 'МОДУЛЬ'}
                            </span>
                            <div className="grid grid-cols-2 gap-1.5 opacity-40 transition-opacity group-hover:opacity-70">
                              <Shield className="h-3 w-3 text-slate-400" />
                              <Store className="h-3 w-3 text-slate-400" />
                              <BarChart3 className="h-3 w-3 text-slate-400" />
                              <Database className="h-3 w-3 text-slate-400" />
                            </div>
                          </div>

                          {/* Центральная иконка (Крупная) */}
                          <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-6">
                            <div
                              className={cn(
                                'flex h-24 w-24 rotate-[-3deg] items-center justify-center rounded-[2.2rem] shadow-sm transition-all duration-700 group-hover:rotate-0 group-hover:scale-110 group-hover:shadow-indigo-200/60',
                                item.id === 'market-intelligence'
                                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                                  : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                              )}
                            >
                              <Layers className="h-10 w-10" />
                            </div>

                            <div className="space-y-3 text-center">
                              <h3 className="text-base font-bold uppercase leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                                {item.title}
                              </h3>
                              <p className="text-[11px] font-bold uppercase leading-relaxed tracking-[0.15em] text-slate-400">
                                {item.description.split(' ').slice(0, 3).join(' ')}...
                              </p>
                            </div>
                          </div>

                          {/* Футер: Роли и Стрелка */}
                          <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                            <div className="flex gap-1.5">
                              {['B', 'R', 'D'].map((l) => (
                                <span
                                  key={l}
                                  className="flex h-5 w-5 items-center justify-center rounded-lg border-2 border-slate-50 text-[9px] font-black text-slate-300 transition-all group-hover:border-indigo-100 group-hover:text-indigo-400"
                                >
                                  {l}
                                </span>
                              ))}
                            </div>
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-200 transition-all group-hover:bg-indigo-50 group-hover:text-indigo-600">
                              <ArrowRight className="h-5 w-5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* --- ИНДУСТРИАЛЬНЫЙ БАННЕР --- */}
        <div className="group relative flex min-h-[550px] items-center overflow-hidden rounded-[4.5rem] border-b-8 border-indigo-600 shadow-2xl">
          <div className="absolute inset-0 bg-[#080C1A]">
            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070"
              className="duration-[2000ms] h-full w-full object-cover opacity-25 grayscale transition-transform group-hover:scale-110"
              alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080C1A] via-[#080C1A]/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl space-y-6 p-20 md:p-32">
            <div className="flex flex-wrap items-center gap-3 text-white/40">
              {['СМАРТ-КОНТРАКТЫ', 'РЕЕСТР ПОСТАВЩИКОВ', 'ОПТИМИЗАЦИЯ СТОИМОСТИ'].map((text) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.35em]">{text}</span>
                </div>
              ))}
            </div>

            <h2 className="text-8xl font-black uppercase leading-[0.8] tracking-[-0.06em] text-white md:text-9xl">
              ЦИФРОВОЙ
              <br />
              <span className="text-indigo-500">ИНТЕЛЛЕКТ</span>
            </h2>

            <div className="flex gap-3 border-l-4 border-indigo-600 pl-12">
              <p className="max-w-2xl text-base font-medium italic leading-tight text-indigo-100/70">
                "Мы не просто производим — мы создаем цифровую экосистему эффективности."
              </p>
            </div>
          </div>
        </div>

        {/* --- СТАТУС ОРГАНИЗАЦИИ --- */}
        <div className="flex flex-col items-center justify-between gap-3 rounded-[4rem] border border-slate-100 bg-white p-4 shadow-sm md:flex-row">
          <div className="flex items-center gap-3">
            <OrganizationSwitcher />
            <div className="hidden h-20 w-px bg-slate-100 md:block" />
            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-300">
                ГЛОБАЛЬНАЯ ШТАБ-КВАРТИРА
              </p>
              <p className="text-base font-black italic tracking-tight text-slate-900">
                {currentOrg?.name || 'SYNTHA GLOBAL HQ'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {['БАЙЕР', 'РЕТЕЙЛЕР', 'БРЕНД'].map((role) => (
              <div
                key={role}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border-2 px-8 py-4 transition-all duration-700',
                  primaryRole.toUpperCase() === role
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <div
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    primaryRole.toUpperCase() === role
                      ? 'bg-indigo-400 shadow-[0_0_12px_#818cf8]'
                      : 'bg-slate-200'
                  )}
                />
                <span className="text-[11px] font-black uppercase tracking-widest">{role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- ПЕРСОНАЛИЗИРОВАННЫЕ ИНСАЙТЫ (AI Layer) --- */}
        {activeTab === 'intelligence' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SmartRecommendationsWidget />
              </div>
              <div className="relative space-y-4 overflow-hidden rounded-xl bg-[#1A1F2C] p-4 text-white shadow-2xl">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                  <Sparkles className="h-32 w-32" />
                </div>
                <h3 className="text-base font-black uppercase leading-none tracking-tight">
                  AI Market
                  <br />
                  Intelligence
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Наш алгоритм проанализировал ваши последние заказы и текущие тренды на
                  маркетплейсе. Мы рекомендуем обратить внимание на категорию{' '}
                  <strong>Techwear</strong>.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      Прогноз спроса: +24%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      Confidence Score: 0.92
                    </span>
                  </div>
                </div>
                <Button className="mt-8 h-10 w-full rounded-lg border border-slate-900 bg-slate-900 text-[11px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-slate-800">
                  ПОЛНЫЙ ОТЧЕТ
                </Button>
              </div>
            </div>
            <ReplenishmentRecommendationsBlock maxItems={5} />
          </motion.div>
        )}
      </main>

      <AIAssistantChat />

      {/* ЛЕВАЯ ПАНЕЛЬ — навигация по B2B (синхронизировано с ROUTES) */}
      <div className="fixed left-8 top-1/2 z-40 flex w-20 -translate-y-1/2 flex-col items-center gap-3 rounded-xl border border-white/20 bg-white/90 py-12 shadow-[0_40px_100px_rgba(0,0,0,0.15)] backdrop-blur-2xl">
        <Link
          href={ROUTES.shop.b2b}
          className="transform cursor-pointer rounded-[1.5rem] bg-slate-900 p-4 shadow-xl transition-transform hover:rotate-6"
        >
          <Monitor className="h-6 w-6 text-white" />
        </Link>
        <Link href={ROUTES.shop.b2bDiscover}>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-2xl text-slate-300 transition-all hover:bg-black hover:text-white"
            title="Discover"
          >
            <Search className="h-6 w-6" />
          </Button>
        </Link>
        <Link href={ROUTES.shop.b2bPartners}>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-2xl text-slate-300 transition-all hover:bg-black hover:text-white"
            title="Партнёры"
          >
            <Briefcase className="h-6 w-6" />
          </Button>
        </Link>
        <Link href={ROUTES.shop.b2bOrderDrafts}>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-2xl text-slate-300 transition-all hover:bg-black hover:text-white"
            title="Черновики"
          >
            <FileCheck className="h-6 w-6" />
          </Button>
        </Link>
        <Link href={ROUTES.shop.b2bOrders}>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-2xl text-slate-300 transition-all hover:bg-black hover:text-white"
            title="Мои заказы"
          >
            <Layers className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ (как на скрине) */}
      <div className="fixed right-0 top-1/4 z-40 flex w-12 flex-col items-center gap-3 rounded-l-[3rem] border border-r-0 border-slate-100 bg-white/90 py-12 shadow-2xl backdrop-blur-2xl">
        {[Shield, Store, Briefcase, Layers, Package, ShoppingBag].map((Icon, i) => (
          <Icon
            key={i}
            className="h-5 w-5 cursor-pointer text-slate-300 transition-all hover:scale-125 hover:text-indigo-600"
          />
        ))}
      </div>
    </div>
  );
}
