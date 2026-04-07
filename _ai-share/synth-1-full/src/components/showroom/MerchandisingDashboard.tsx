'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Settings2, 
  Maximize2, 
  Handshake, 
  ArrowRight, 
  ShoppingBag, 
  LayoutGrid, 
  Check, 
  FileText,
  MessageSquare, 
  TrendingUp, 
  Box, 
  Eye, 
  ChevronRight,
  RefreshCcw,
  Zap,
  BarChart3,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';
import { CartItem, Product } from '@/lib/types';

interface MerchandisingDashboardProps {
  merchStatus: "draft" | "ready" | "sent";
  setMerchStatus: (status: "draft" | "ready" | "sent") => void;
  activeMerchBrand: string;
  isCustomerPov: boolean;
  setIsCustomerPov: (isPov: boolean) => void;
}

export const MerchandisingDashboard: React.FC<MerchandisingDashboardProps> = ({
  merchStatus,
  setMerchStatus,
  activeMerchBrand,
  isCustomerPov,
  setIsCustomerPov
}) => {
  const { viewRole, activeCurrency } = useUIState();
  const { b2bCart, setB2bCart } = useB2BState();
  const [selected3DProduct, setSelected3DProduct] = useState<CartItem | null>(null);
  const [showBrandFeedback, setShowBrandFeedback] = useState(false);
  
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // 1. AI SALES SIMULATOR LOGIC
  const revenueForecast = useMemo(() => {
    const baseValue = b2bCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Симуляция влияния мерчандайзинга на продажи (от +10% до +35%)
    // При перетаскивании (изменении порядка) или изменении состава выручка меняется
    const randomFactor = 1.1 + (Math.sin(b2bCart.length) * 0.1); 
    const boost = b2bCart.length > 5 ? 1.24 * randomFactor : 1.12 * randomFactor; 
    return Math.round(baseValue * boost);
  }, [b2bCart]);

  const crossSellPotential = useMemo(() => {
    const categories = new Set(b2bCart.map(item => item.category));
    return categories.size > 2 ? 84 : 42;
  }, [b2bCart]);

  // Сортировка (Авто-баланс)
  const handleAutoBalance = () => {
    const sortedCart = [...b2bCart].sort((a, b) => {
      if (a.category !== b.category) return (a.category || "").localeCompare(b.category || "");
      return b.price - a.price;
    });
    setB2bCart(sortedCart);
    toast({ 
      title: "AI Оптимизация", 
      description: "Товары сгруппированы по категориям и ценовой ценности для повышения конверсии." 
    });
  };

  return (
    <motion.div 
      key="merchandising-dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex-shrink-0 w-full flex flex-col gap-3 max-w-6xl mx-auto pb-20"
    >
      <div className="bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-full w-fit mx-auto mb-2 animate-pulse">
        MERCHANDISING ENGINE ACTIVE
      </div>

      {/* --- 1. DIGITAL RACK --- */}
      <div className="w-full bg-white/60 backdrop-blur-xl rounded-xl p-4 border border-slate-200 shadow-xl relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.1]" />
        
        {/* Rack Header */}
        <div className={cn(
          "relative z-10 w-full flex items-center justify-between mb-10 transition-all duration-500",
          isCustomerPov && "opacity-0 invisible h-0 mb-0"
        )}>
          <div className="space-y-0.5">
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none">Цифровая рейка</h3>
            <Link 
              href="/brand/b2b-orders/8821"
              className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-500 hover:text-indigo-700 hover:underline transition-colors block w-fit"
            >
              Синхронизация с заказом #8821
            </Link>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleAutoBalance}
              variant="outline" 
              className="h-10 px-6 rounded-xl border-slate-200 bg-white text-[9px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Авто-баланс
            </Button>
            <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-slate-200 bg-white flex items-center justify-center">
              <Settings2 className="h-3.5 w-3.5 text-slate-500" />
            </Button>
          </div>
        </div>

        {/* The Rack itself */}
        <div className="absolute top-40 left-12 right-12 h-1 bg-slate-200 rounded-full shadow-inner z-0" />

        <div className="relative z-10 flex flex-wrap justify-center gap-x-8 gap-y-16 mt-4 w-full px-4 min-h-[300px]">
          {b2bCart.length > 0 ? b2bCart.map((item) => (
            <motion.div 
              key={item.id}
              drag={!isCustomerPov}
              dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
              dragElastic={0.1}
              className="relative group/merch cursor-grab active:cursor-grabbing"
              onClick={() => !isCustomerPov && setSelected3DProduct(item)}
            >
              {!isCustomerPov && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-10 w-4 pointer-events-none opacity-30 group-hover/merch:opacity-100 transition-opacity">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-slate-400 rounded-full border-b-0" />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-400" />
                </div>
              )}
              <div className={cn(
                "w-32 aspect-[3/4.5] rounded-2xl overflow-hidden border-4 border-white shadow-lg group-hover/merch:shadow-2xl transition-all duration-500 bg-white relative",
                isCustomerPov && "shadow-2xl scale-110",
                selected3DProduct?.id === item.id && "ring-4 ring-indigo-500 ring-offset-4"
              )}>
                <img src={item.images?.[0]?.url || (item as any).image} className="w-full h-full object-cover" />
                
                {/* 3D Label & Quick View */}
                {!isCustomerPov && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/merch:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <Badge className="bg-white text-slate-900 border-none text-[7px] font-black uppercase">
                      {item.quantity} ед.
                    </Badge>
                    <div className="flex gap-1">
                      <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                        <Box className="h-3 w-3" />
                      </div>
                      <div className="p-1.5 bg-white rounded-lg text-slate-900">
                        <Eye className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {!isCustomerPov && (
                <p className="mt-2 text-[8px] font-black uppercase text-slate-900 tracking-tight text-center truncate w-32">
                  {item.name}
                </p>
              )}
            </motion.div>
          )) : (
            <div className="col-span-full py-10 flex flex-col items-center gap-3 text-slate-300">
              <ShoppingBag className="h-10 w-10 opacity-10" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em]">Рейка пуста. Добавьте товары из каталога.</p>
            </div>
          )}
        </div>

        {/* Rack Footer Controls */}
        <div className="w-full mt-12 pt-6 flex items-center justify-between border-t border-slate-100 relative z-20">
          <div className="flex gap-3">
            <button 
              onClick={() => {
                setIsCustomerPov(!isCustomerPov);
                toast({ 
                  title: !isCustomerPov ? "Режим Customer POV" : "Режим управления", 
                  description: !isCustomerPov ? "Интерфейс скрыт. Вид торгового зала со стороны покупателя." : "Инструменты редактирования возвращены."
                });
              }}
              className={cn(
                "h-10 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2 shadow-sm",
                isCustomerPov ? "bg-black text-white border-black" : "bg-white text-slate-400 hover:text-slate-600 border-slate-100"
              )}
            >
              <Maximize2 className="h-3 w-3" /> {isCustomerPov ? "Выйти из POV" : "Вид покупателя"}
            </button>
            
            {/* 2. AI SALES SIMULATOR WIDGET (Inside rack footer) */}
            {!isCustomerPov && b2bCart.length > 0 && (
              <div className="flex items-center gap-3 px-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-left-4">
                <div className="flex flex-col">
                  <span className="text-[7px] font-black uppercase text-slate-400 leading-none mb-1">Прогноз выручки</span>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-900">
                      {revenueForecast.toLocaleString('ru-RU')} ₽
                    </span>
                    <Badge className="bg-emerald-100 text-emerald-600 border-none text-[6px] font-black h-3.5 px-1">
                      +24%
                    </Badge>
                  </div>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-[7px] font-black uppercase text-slate-400 leading-none mb-1">Кросс-сейл</span>
                  <span className="text-[10px] font-black text-slate-900">{crossSellPotential}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => {
                setIsGeneratingPdf(true);
                toast({ title: "Генерация отчета", description: "PDF-презентация коллекции формируется..." });
                setTimeout(() => {
                  setIsGeneratingPdf(false);
                  toast({ title: "Отчет готов", description: "Презентация Lookbook_FW26.pdf сохранена в загрузки." });
                }, 2000);
              }}
              disabled={isGeneratingPdf}
              className={cn(
                "h-10 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2 bg-white text-slate-400 hover:text-slate-600 border-slate-100 shadow-sm hover:bg-slate-50",
                isGeneratingPdf && "opacity-50 cursor-wait"
              )}
            >
              {isGeneratingPdf ? (
                <><RefreshCcw className="h-3 w-3 animate-spin" /> Формирование...</>
              ) : (
                <><FileText className="h-3 w-3" /> Экспорт PDF</>
              )}
            </button>
            
            <button 
              onClick={() => {
                setMerchStatus('ready');
                toast({ title: "Сохранено", description: "Ваша планограмма синхронизирована с заказом." });
              }}
              className={cn(
                "h-10 px-8 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center",
                merchStatus === 'ready' || merchStatus === 'sent' 
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                  : "bg-black text-white border border-black shadow-xl button-glimmer"
              )}
            >
              {merchStatus === 'ready' || merchStatus === 'sent' ? (
                <><Check className="h-3 w-3 mr-2" /> Сохранено</>
              ) : "Сохранить развеску"}
            </button>
          </div>
        </div>
      </div>

      {/* --- 2. BRAND COLLABORATION & FEEDBACK LOOP --- */}
      <Card className="bg-white border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 group hover:border-indigo-200 transition-all relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
          <Sparkles className="h-32 w-32" />
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-12 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
              <Handshake className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <h5 className="text-sm font-black uppercase text-slate-900 tracking-tight leading-none">Связь с брендом</h5>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{activeMerchBrand}</p>
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-md">
              Синхронизируйте вашу развеску с производственным календарем бренда для гарантии ATS и своевременной отгрузки.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full animate-pulse",
                  merchStatus === 'sent' ? "bg-emerald-500" : "bg-amber-500"
                )} />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">
                  Статус: {merchStatus === 'draft' ? 'Черновик' : merchStatus === 'ready' ? 'Готов к отправке' : 'Отправлено бренду'}
                </span>
              </div>
              {merchStatus === 'sent' && (
                <button 
                  onClick={() => setShowBrandFeedback(!showBrandFeedback)}
                  className="text-[8px] font-black uppercase text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <MessageSquare className="h-2.5 w-2.5" /> 
                  {showBrandFeedback ? "Скрыть ответ" : "Посмотреть ответ бренда (1)"}
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            {merchStatus === 'sent' ? (
              <Badge className="h-10 px-6 rounded-xl bg-slate-100 text-slate-500 border-none font-black uppercase text-[9px] flex items-center gap-2">
                <Check className="h-3.5 w-3.5" /> Ожидаем подтверждения
              </Badge>
            ) : (
              <button 
                onClick={() => {
                  setMerchStatus('sent');
                  toast({ 
                    title: "Запрос отправлен", 
                    description: "Бренд получил вашу планограмму и подготовит ответ в течение 24 часов." 
                  });
                }}
                disabled={merchStatus === 'draft'}
                className={cn(
                  "h-10 px-8 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all flex items-center justify-center",
                  merchStatus === 'draft' 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    : "bg-black text-white border border-black shadow-xl button-glimmer hover:bg-slate-800"
                )}
              >
                Отправить бренду
              </button>
            )}
          </div>
        </div>

        {/* 4. BRAND RESPONSE LOOP (Feedback content) */}
        <AnimatePresence>
          {showBrandFeedback && merchStatus === 'sent' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t border-slate-100 mt-2">
                <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-white border border-indigo-200 flex items-center justify-center shrink-0">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" className="h-8 w-8 rounded-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-slate-900">Александр (Senior MD, {activeMerchBrand})</span>
                      <Badge className="bg-indigo-600 text-white text-[6px] h-3 px-1">OFFICIAL RESPONSE</Badge>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic">
                      "Отличная подборка! Однако, согласно нашей аналитике по вашему региону, я рекомендую добавить **пару аксессуаров из Drop 2** к этой развеске. Это повысит средний чек на 15%. Я прикрепил рекомендуемые позиции ниже."
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="h-7 text-[8px] font-black uppercase rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-100">
                        Принять рекомендации
                      </Button>
                      <Button variant="ghost" className="h-7 text-[8px] font-black uppercase rounded-lg text-slate-400">
                        Обсудить в чате
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* --- 3. MERCHANDISING ANALYTICS BANNER --- */}
      {!isCustomerPov && (
        <Link href="/shop/b2b/orders/#8821?tab=analytics">
          <div className="w-full bg-slate-900 rounded-xl p-4 shadow-2xl relative overflow-hidden group cursor-pointer border border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <Badge className="bg-indigo-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                    Intel OS Analytics
                  </Badge>
                </div>
                <h4 className="text-base font-black text-white uppercase tracking-tight">
                  Аналитика мерчандайзинга
                </h4>
                <p className="text-slate-400 text-[10px] font-medium max-w-sm uppercase tracking-wider leading-relaxed">
                  Прогноз: оптимизированная выкладка увеличит глубину корзины на 18% за счет эффективного кросс-сейла.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="h-10 w-10 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[8px] font-black text-white">
                    +12
                  </div>
                </div>
                <Button className="bg-white text-slate-900 hover:bg-slate-100 h-12 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest group-hover:scale-105 transition-all">
                  Подробный отчет <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* --- 4. CONTEXTUAL 3D PREVIEW OVERLAY --- */}
      <AnimatePresence>
        {selected3DProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-md"
            onClick={() => setSelected3DProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl w-full max-w-5xl h-[70vh] shadow-2xl overflow-hidden flex flex-col md:flex-row"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex-1 bg-slate-50 relative group">
                {/* 3D Simulation Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <img 
                      src={selected3DProduct.images?.[0]?.url || (selected3DProduct as any).image} 
                      className="w-full h-full object-contain opacity-20 grayscale"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="h-20 w-20 rounded-full bg-indigo-600/10 flex items-center justify-center border-2 border-indigo-600/20 border-dashed animate-spin-slow">
                         <RefreshCcw className="h-8 w-8 text-indigo-600" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs font-black uppercase text-slate-900 tracking-widest">3D Digital Twin Rendering</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Physically-based cloth simulation active</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 3D HUD */}
                <div className="absolute top-4 left-8 space-y-2">
                  <Badge className="bg-slate-900 text-white border-none font-black text-[8px] px-3 py-1">LOD: ULTRA</Badge>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer">
                      <LayoutGrid className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-80 p-3 flex flex-col justify-between border-l border-slate-100">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{selected3DProduct.brand}</p>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-tight">{selected3DProduct.name}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Аналитика посадки</p>
                      <div className="space-y-1.5">
                        {[
                          { label: "Плечевой пояс", val: 98 },
                          { label: "Длина рукава", val: 94 },
                          { label: "Общий силуэт", val: 100 },
                        ].map(stat => (
                          <div key={stat.label} className="space-y-1">
                            <div className="flex justify-between text-[7px] font-black uppercase">
                              <span>{stat.label}</span>
                              <span>{stat.val}%</span>
                            </div>
                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stat.val}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => setSelected3DProduct(null)}
                    className="w-full h-12 rounded-2xl bg-black text-white font-black uppercase text-[10px] tracking-widest shadow-xl"
                  >
                    Вернуться к рейке
                  </Button>
                  <p className="text-[7px] text-center text-slate-400 font-bold uppercase tracking-widest">
                    Esc, чтобы закрыть предпросмотр
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
