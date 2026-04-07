'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
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
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserContext } from "@/hooks/useUserContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  WORKSPACE_TABS, 
  WORKSPACE_ITEMS, 
  ROLE_CONFIG, 
  ROLE_PERMISSIONS,
  WORKSPACE_ITEM_PATHS,
  type B2BUserRole 
} from "@/lib/data/b2b-workspace-matrix";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { 
  OrganizationSwitcher,
  AIAssistantChat,
  QuickReorderBar,
  SmartRecommendationsWidget
} from "@/components/dashboard";
import { ReplenishmentRecommendationsBlock } from "@/components/b2b/ReplenishmentRecommendationsBlock";

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
    return WORKSPACE_ITEMS.filter(it => it.tabId === activeTab && allowed.includes(it.id));
  }, [activeTab, primaryRole]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased overflow-x-hidden">
      <QuickReorderBar />
      
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Заголовок — JOOR-style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">B2B Workplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Рабочее пространство
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
              Центральный узел управления для fashion-бизнеса. Единые инструменты для управления продуктом, командной работы и комплаенса.
            </p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-slate-200">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Активных</span>
            <span className="text-xl font-bold tabular-nums text-slate-900">14</span>
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Табы — чистый B2B */}
        <nav className="flex flex-wrap gap-2 p-2 rounded-xl bg-slate-100/80 border border-slate-200/60">
          {WORKSPACE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Поток заказов */}
        <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mr-2">Поток заказов</span>
          <Link href={ROUTES.shop.b2bCreateOrder} className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Создать заказ</Link>
          <span className="text-slate-300">·</span>
          <Link href={ROUTES.shop.b2bOrderByCollection} className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Заказ по коллекции</Link>
          <span className="text-slate-300">·</span>
          <Link href={ROUTES.shop.b2bOrderDrafts} className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Черновики</Link>
          <span className="text-slate-300">·</span>
          <Link href={ROUTES.shop.b2bOrders} className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Мои заказы</Link>
          <span className="text-slate-300">·</span>
          <Link href={ROUTES.shop.b2bFinance} className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Финансы партнёра</Link>
          <span className="text-slate-300">·</span>
          <Link href={ROUTES.shop.b2bPayment} className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Оплата (JOOR Pay)</Link>
          <span className="text-slate-300">·</span>
          <Link href={ROUTES.shop.b2bCollectionTerms} className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Условия по коллекциям</Link>
          <span className="text-slate-300">·</span>
          <Link href={ROUTES.shop.b2bDeliveryCalendar} className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Календарь поставок</Link>
          <span className="text-slate-300">·</span>
          <Link href={ROUTES.shop.b2bShowroom} className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Виртуальный шоурум</Link>
          <span className="text-slate-300">·</span>
          <Link href={ROUTES.shop.b2bLookbookShare} className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Поделиться лукбуком</Link>
          <span className="text-slate-300">·</span>
          <Link href={ROUTES.shop.b2bAcademy} className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Академия</Link>
        </div>

        {/* Сетка карточек */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {WORKSPACE_TABS.find(t => t.id === activeTab)?.label ?? 'Модули'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden group hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col h-full">
                      <div className="p-5 flex flex-col h-full space-y-4">
                        {/* Категория и Сетка иконок в углу */}
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                            {item.category || 'МОДУЛЬ'}
                          </span>
                          <div className="grid grid-cols-2 gap-1.5 opacity-40 group-hover:opacity-70 transition-opacity">
                            <Shield className="h-3 w-3 text-slate-400" />
                            <Store className="h-3 w-3 text-slate-400" />
                            <BarChart3 className="h-3 w-3 text-slate-400" />
                            <Database className="h-3 w-3 text-slate-400" />
                          </div>
                        </div>

                        {/* Центральная иконка (Крупная) */}
                        <div className="flex-1 flex flex-col items-center justify-center py-6 space-y-4">
                          <div className={cn(
                            "h-24 w-24 rounded-[2.2rem] flex items-center justify-center transition-all duration-700 shadow-sm group-hover:shadow-indigo-200/60 group-hover:scale-110 rotate-[-3deg] group-hover:rotate-0",
                            item.id === 'market-intelligence' ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200" : "bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                          )}>
                            <Layers className="h-10 w-10" />
                          </div>
                          
                          <div className="text-center space-y-3">
                            <h3 className="text-base font-bold uppercase tracking-tight text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.15em] leading-relaxed">
                              {item.description.split(' ').slice(0, 3).join(' ')}...
                            </p>
                          </div>
                        </div>

                        {/* Футер: Роли и Стрелка */}
                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex gap-1.5">
                            {['B', 'R', 'D'].map(l => (
                              <span key={l} className="text-[9px] font-black text-slate-300 border-2 border-slate-50 w-5 h-5 flex items-center justify-center rounded-lg group-hover:border-indigo-100 group-hover:text-indigo-400 transition-all">
                                {l}
                              </span>
                            ))}
                          </div>
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-200 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                            <ArrowRight className="h-5 w-5" />
                          </span>
                        </div>
                        </div>
                    </div>
                  </Link>
                </motion.div>
              ); })}
            </AnimatePresence>
          </div>
        </div>

        {/* --- ИНДУСТРИАЛЬНЫЙ БАННЕР --- */}
        <div className="relative rounded-[4.5rem] overflow-hidden min-h-[550px] flex items-center group shadow-2xl border-b-8 border-indigo-600">
          <div className="absolute inset-0 bg-[#080C1A]">
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070" 
              className="w-full h-full object-cover opacity-25 grayscale group-hover:scale-110 transition-transform duration-[2000ms]"
              alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080C1A] via-[#080C1A]/80 to-transparent" />
          </div>
          
          <div className="relative z-10 p-20 md:p-32 space-y-6 max-w-5xl">
            <div className="flex flex-wrap items-center gap-3 text-white/40">
              {['СМАРТ-КОНТРАКТЫ', 'РЕЕСТР ПОСТАВЩИКОВ', 'ОПТИМИЗАЦИЯ СТОИМОСТИ'].map(text => (
                <div key={text} className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                  <span className="text-[11px] font-black tracking-[0.35em] uppercase">{text}</span>
                </div>
              ))}
            </div>
            
            <h2 className="text-8xl md:text-9xl font-black text-white uppercase tracking-[-0.06em] leading-[0.8]">
              ЦИФРОВОЙ<br /><span className="text-indigo-500">ИНТЕЛЛЕКТ</span>
            </h2>
            
            <div className="flex gap-3 border-l-4 border-indigo-600 pl-12">
              <p className="text-base text-indigo-100/70 font-medium italic leading-tight max-w-2xl">
                "Мы не просто производим — мы создаем цифровую экосистему эффективности."
              </p>
            </div>
          </div>
        </div>

        {/* --- СТАТУС ОРГАНИЗАЦИИ --- */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-[4rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <OrganizationSwitcher />
            <div className="h-20 w-px bg-slate-100 hidden md:block" />
            <div className="space-y-2">
              <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">ГЛОБАЛЬНАЯ ШТАБ-КВАРТИРА</p>
              <p className="text-base font-black text-slate-900 tracking-tight italic">{currentOrg?.name || 'SYNTHA GLOBAL HQ'}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {['БАЙЕР', 'РЕТЕЙЛЕР', 'БРЕНД'].map((role) => (
              <div key={role} className={cn(
                "px-8 py-4 rounded-2xl flex items-center gap-3 border-2 transition-all duration-700",
                (primaryRole.toUpperCase() === role) 
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
              )}>
                <div className={cn("h-2.5 w-2.5 rounded-full", (primaryRole.toUpperCase() === role) ? "bg-indigo-400 shadow-[0_0_12px_#818cf8]" : "bg-slate-200")} />
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2">
              <SmartRecommendationsWidget />
            </div>
            <div className="bg-[#1A1F2C] rounded-xl p-4 text-white space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="h-32 w-32" />
              </div>
              <h3 className="text-base font-black uppercase tracking-tight leading-none">
                AI Market<br />Intelligence
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Наш алгоритм проанализировал ваши последние заказы и текущие тренды на маркетплейсе. 
                Мы рекомендуем обратить внимание на категорию <strong>Techwear</strong>.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Прогноз спроса: +24%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Confidence Score: 0.92</span>
                </div>
              </div>
              <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 border border-slate-900 rounded-lg h-10 font-semibold text-[11px] uppercase tracking-wider mt-8 transition-colors">
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
      <div className="fixed left-8 top-1/2 -translate-y-1/2 w-20 bg-white/90 backdrop-blur-2xl border border-white/20 rounded-xl flex flex-col items-center py-12 gap-3 shadow-[0_40px_100px_rgba(0,0,0,0.15)] z-40">
        <Link href={ROUTES.shop.b2b} className="bg-slate-900 p-4 rounded-[1.5rem] shadow-xl transform hover:rotate-6 transition-transform cursor-pointer">
          <Monitor className="h-6 w-6 text-white" />
        </Link>
        <Link href={ROUTES.shop.b2bDiscover}><Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-black transition-all rounded-2xl h-12 w-12" title="Discover"><Search className="h-6 w-6" /></Button></Link>
        <Link href={ROUTES.shop.b2bPartners}><Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-black transition-all rounded-2xl h-12 w-12" title="Партнёры"><Briefcase className="h-6 w-6" /></Button></Link>
        <Link href={ROUTES.shop.b2bOrderDrafts}><Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-black transition-all rounded-2xl h-12 w-12" title="Черновики"><FileCheck className="h-6 w-6" /></Button></Link>
        <Link href={ROUTES.shop.b2bOrders}><Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-black transition-all rounded-2xl h-12 w-12" title="Мои заказы"><Layers className="h-6 w-6" /></Button></Link>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ (как на скрине) */}
      <div className="fixed right-0 top-1/4 w-12 bg-white/90 backdrop-blur-2xl border border-slate-100 rounded-l-[3rem] flex flex-col items-center py-12 gap-3 shadow-2xl z-40 border-r-0">
        {[Shield, Store, Briefcase, Layers, Package, ShoppingBag].map((Icon, i) => (
          <Icon key={i} className="h-5 w-5 text-slate-300 hover:text-indigo-600 cursor-pointer transition-all hover:scale-125" />
        ))}
      </div>
    </div>
  );
}
