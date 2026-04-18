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
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
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
  merchStatus: 'draft' | 'ready' | 'sent';
  setMerchStatus: (status: 'draft' | 'ready' | 'sent') => void;
  activeMerchBrand: string;
  isCustomerPov: boolean;
  setIsCustomerPov: (isPov: boolean) => void;
}

export const MerchandisingDashboard: React.FC<MerchandisingDashboardProps> = ({
  merchStatus,
  setMerchStatus,
  activeMerchBrand,
  isCustomerPov,
  setIsCustomerPov,
}) => {
  const { viewRole, activeCurrency } = useUIState();
  const { b2bCart, setB2bCart } = useB2BState();
  const [selected3DProduct, setSelected3DProduct] = useState<CartItem | null>(null);
  const [showBrandFeedback, setShowBrandFeedback] = useState(false);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // 1. AI SALES SIMULATOR LOGIC
  const revenueForecast = useMemo(() => {
    const baseValue = b2bCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // Симуляция влияния мерчандайзинга на продажи (от +10% до +35%)
    // При перетаскивании (изменении порядка) или изменении состава выручка меняется
    const randomFactor = 1.1 + Math.sin(b2bCart.length) * 0.1;
    const boost = b2bCart.length > 5 ? 1.24 * randomFactor : 1.12 * randomFactor;
    return Math.round(baseValue * boost);
  }, [b2bCart]);

  const crossSellPotential = useMemo(() => {
    const categories = new Set(b2bCart.map((item) => item.category));
    return categories.size > 2 ? 84 : 42;
  }, [b2bCart]);

  // Сортировка (Авто-баланс)
  const handleAutoBalance = () => {
    const sortedCart = [...b2bCart].sort((a, b) => {
      if (a.category !== b.category) return (a.category || '').localeCompare(b.category || '');
      return b.price - a.price;
    });
    setB2bCart(sortedCart);
    toast({
      title: 'AI Оптимизация',
      description: 'Товары сгруппированы по категориям и ценовой ценности для повышения конверсии.',
    });
  };

  return (
    <motion.div
      key="merchandising-dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-6xl flex-shrink-0 flex-col gap-3 pb-20"
    >
      <div className="mx-auto mb-2 w-fit animate-pulse rounded-full bg-amber-500 px-2 py-1 text-[8px] font-black text-white">
        MERCHANDISING ENGINE ACTIVE
      </div>

      {/* --- 1. DIGITAL RACK --- */}
      <div className="border-border-default relative flex w-full flex-col items-center overflow-hidden rounded-xl border bg-white/60 p-4 shadow-xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.1]" />

        {/* Rack Header */}
        <div
          className={cn(
            'relative z-10 mb-10 flex w-full items-center justify-between transition-all duration-500',
            isCustomerPov && 'invisible mb-0 h-0 opacity-0'
          )}
        >
          <div className="space-y-0.5">
            <h3 className="text-text-primary text-sm font-black uppercase leading-none tracking-tight">
              Цифровая рейка
            </h3>
            <Link
              href={ROUTES.brand.b2bOrder('8821')}
              className="text-accent-primary hover:text-accent-primary block w-fit text-[9px] font-bold uppercase tracking-[0.2em] transition-colors hover:underline"
            >
              Синхронизация с заказом #8821
            </Link>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAutoBalance}
              variant="outline"
              className="border-border-default hover:bg-accent-primary/10 hover:text-accent-primary h-10 rounded-xl bg-white px-6 text-[9px] font-black uppercase tracking-widest transition-all"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Авто-баланс
            </Button>
            <Button
              variant="outline"
              className="border-border-default flex h-10 w-10 items-center justify-center rounded-xl bg-white p-0"
            >
              <Settings2 className="text-text-secondary h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* The Rack itself */}
        <div className="bg-border-subtle absolute left-12 right-12 top-40 z-0 h-1 rounded-full shadow-inner" />

        <div className="relative z-10 mt-4 flex min-h-[300px] w-full flex-wrap justify-center gap-x-8 gap-y-16 px-4">
          {b2bCart.length > 0 ? (
            b2bCart.map((item) => (
              <motion.div
                key={item.id}
                drag={!isCustomerPov}
                dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
                dragElastic={0.1}
                className="group/merch relative cursor-grab active:cursor-grabbing"
                onClick={() => !isCustomerPov && setSelected3DProduct(item)}
              >
                {!isCustomerPov && (
                  <div className="pointer-events-none absolute -top-3 left-1/2 h-10 w-4 -translate-x-1/2 opacity-30 transition-opacity group-hover/merch:opacity-100">
                    <div className="border-border-strong absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-b-0" />
                    <div className="bg-text-muted absolute left-1/2 top-4 h-6 w-0.5 -translate-x-1/2" />
                  </div>
                )}
                <div
                  className={cn(
                    'relative aspect-[3/4.5] w-32 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg transition-all duration-500 group-hover/merch:shadow-2xl',
                    isCustomerPov && 'scale-110 shadow-2xl',
                    selected3DProduct?.id === item.id && 'ring-accent-primary ring-4 ring-offset-4'
                  )}
                >
                  <img
                    src={item.images?.[0]?.url || (item as any).image}
                    className="h-full w-full object-cover"
                  />

                  {/* 3D Label & Quick View */}
                  {!isCustomerPov && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover/merch:opacity-100">
                      <Badge className="text-text-primary border-none bg-white text-[7px] font-black uppercase">
                        {item.quantity} ед.
                      </Badge>
                      <div className="flex gap-1">
                        <div className="bg-accent-primary rounded-lg p-1.5 text-white">
                          <Box className="h-3 w-3" />
                        </div>
                        <div className="text-text-primary rounded-lg bg-white p-1.5">
                          <Eye className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {!isCustomerPov && (
                  <p className="text-text-primary mt-2 w-32 truncate text-center text-[8px] font-black uppercase tracking-tight">
                    {item.name}
                  </p>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-text-muted col-span-full flex flex-col items-center gap-3 py-10">
              <ShoppingBag className="h-10 w-10 opacity-10" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em]">
                Рейка пуста. Добавьте товары из каталога.
              </p>
            </div>
          )}
        </div>

        {/* Rack Footer Controls */}
        <div className="border-border-subtle relative z-20 mt-12 flex w-full items-center justify-between border-t pt-6">
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsCustomerPov(!isCustomerPov);
                toast({
                  title: !isCustomerPov ? 'Режим Customer POV' : 'Режим управления',
                  description: !isCustomerPov
                    ? 'Интерфейс скрыт. Вид торгового зала со стороны покупателя.'
                    : 'Инструменты редактирования возвращены.',
                });
              }}
              className={cn(
                'flex h-10 items-center justify-center gap-2 rounded-xl border px-5 text-[9px] font-black uppercase tracking-widest shadow-sm transition-all',
                isCustomerPov
                  ? 'border-black bg-black text-white'
                  : 'text-text-muted hover:text-text-secondary border-border-subtle bg-white'
              )}
            >
              <Maximize2 className="h-3 w-3" /> {isCustomerPov ? 'Выйти из POV' : 'Вид покупателя'}
            </button>

            {/* 2. AI SALES SIMULATOR WIDGET (Inside rack footer) */}
            {!isCustomerPov && b2bCart.length > 0 && (
              <div className="bg-bg-surface2 border-border-subtle flex items-center gap-3 rounded-xl border px-4 shadow-sm animate-in fade-in slide-in-from-left-4">
                <div className="flex flex-col">
                  <span className="text-text-muted mb-1 text-[7px] font-black uppercase leading-none">
                    Прогноз выручки
                  </span>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-text-primary text-[10px] font-black">
                      {revenueForecast.toLocaleString('ru-RU')} ₽
                    </span>
                    <Badge className="h-3.5 border-none bg-emerald-100 px-1 text-[6px] font-black text-emerald-600">
                      +24%
                    </Badge>
                  </div>
                </div>
                <div className="bg-border-subtle h-6 w-px" />
                <div className="flex flex-col">
                  <span className="text-text-muted mb-1 text-[7px] font-black uppercase leading-none">
                    Кросс-сейл
                  </span>
                  <span className="text-text-primary text-[10px] font-black">
                    {crossSellPotential}%
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsGeneratingPdf(true);
                toast({
                  title: 'Генерация отчета',
                  description: 'PDF-презентация коллекции формируется...',
                });
                setTimeout(() => {
                  setIsGeneratingPdf(false);
                  toast({
                    title: 'Отчет готов',
                    description: 'Презентация Lookbook_FW26.pdf сохранена в загрузки.',
                  });
                }, 2000);
              }}
              disabled={isGeneratingPdf}
              className={cn(
                'text-text-muted hover:text-text-secondary border-border-subtle hover:bg-bg-surface2 flex h-10 items-center justify-center gap-2 rounded-xl border bg-white px-5 text-[9px] font-black uppercase tracking-widest shadow-sm transition-all',
                isGeneratingPdf && 'cursor-wait opacity-50'
              )}
            >
              {isGeneratingPdf ? (
                <>
                  <RefreshCcw className="h-3 w-3 animate-spin" /> Формирование...
                </>
              ) : (
                <>
                  <FileText className="h-3 w-3" /> Экспорт PDF
                </>
              )}
            </button>

            <button
              onClick={() => {
                setMerchStatus('ready');
                toast({
                  title: 'Сохранено',
                  description: 'Ваша планограмма синхронизирована с заказом.',
                });
              }}
              className={cn(
                'flex h-10 items-center justify-center rounded-xl px-8 text-[9px] font-black uppercase tracking-widest transition-all',
                merchStatus === 'ready' || merchStatus === 'sent'
                  ? 'border border-emerald-100 bg-emerald-50 text-emerald-600'
                  : 'button-glimmer border border-black bg-black text-white shadow-xl'
              )}
            >
              {merchStatus === 'ready' || merchStatus === 'sent' ? (
                <>
                  <Check className="mr-2 h-3 w-3" /> Сохранено
                </>
              ) : (
                'Сохранить развеску'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- 2. BRAND COLLABORATION & FEEDBACK LOOP --- */}
      <Card className="border-border-default hover:border-accent-primary/30 group relative flex flex-col gap-3 overflow-hidden rounded-xl bg-white p-4 shadow-sm transition-all">
        <div className="absolute -right-4 -top-4 opacity-[0.03] transition-opacity group-hover:opacity-[0.05]">
          <Sparkles className="h-32 w-32" />
        </div>

        <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
          <div className="flex shrink-0 items-center gap-3">
            <div className="bg-accent-primary/10 text-accent-primary flex h-12 w-10 items-center justify-center rounded-2xl shadow-inner">
              <Handshake className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <h5 className="text-text-primary text-sm font-black uppercase leading-none tracking-tight">
                Связь с брендом
              </h5>
              <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                {activeMerchBrand}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <p className="text-text-secondary max-w-md text-[10px] font-medium leading-relaxed">
              Синхронизируйте вашу развеску с производственным календарем бренда для гарантии ATS и
              своевременной отгрузки.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    'h-1.5 w-1.5 animate-pulse rounded-full',
                    merchStatus === 'sent' ? 'bg-emerald-500' : 'bg-amber-500'
                  )}
                />
                <span className="text-text-primary text-[8px] font-black uppercase tracking-widest">
                  Статус:{' '}
                  {merchStatus === 'draft'
                    ? 'Черновик'
                    : merchStatus === 'ready'
                      ? 'Готов к отправке'
                      : 'Отправлено бренду'}
                </span>
              </div>
              {merchStatus === 'sent' && (
                <button
                  onClick={() => setShowBrandFeedback(!showBrandFeedback)}
                  className="text-accent-primary flex items-center gap-1 text-[8px] font-black uppercase hover:underline"
                >
                  <MessageSquare className="h-2.5 w-2.5" />
                  {showBrandFeedback ? 'Скрыть ответ' : 'Посмотреть ответ бренда (1)'}
                </button>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-3">
            {merchStatus === 'sent' ? (
              <Badge className="bg-bg-surface2 text-text-secondary flex h-10 items-center gap-2 rounded-xl border-none px-6 text-[9px] font-black uppercase">
                <Check className="h-3.5 w-3.5" /> Ожидаем подтверждения
              </Badge>
            ) : (
              <button
                onClick={() => {
                  setMerchStatus('sent');
                  toast({
                    title: 'Запрос отправлен',
                    description:
                      'Бренд получил вашу планограмму и подготовит ответ в течение 24 часов.',
                  });
                }}
                disabled={merchStatus === 'draft'}
                className={cn(
                  'flex h-10 items-center justify-center rounded-xl px-8 text-[9px] font-black uppercase tracking-widest transition-all',
                  merchStatus === 'draft'
                    ? 'bg-bg-surface2 text-text-muted border-border-default cursor-not-allowed border'
                    : 'button-glimmer hover:bg-text-primary/90 border border-black bg-black text-white shadow-xl'
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
              <div className="border-border-subtle mt-2 border-t pt-6">
                <div className="bg-accent-primary/10 border-accent-primary/20 flex gap-3 rounded-2xl border p-4">
                  <div className="border-accent-primary/30 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-text-primary text-[10px] font-black uppercase">
                        Александр (Senior MD, {activeMerchBrand})
                      </span>
                      <Badge className="bg-accent-primary h-3 px-1 text-[6px] text-white">
                        OFFICIAL RESPONSE
                      </Badge>
                    </div>
                    <p className="text-text-secondary text-[11px] font-medium italic leading-relaxed">
                      "Отличная подборка! Однако, согласно нашей аналитике по вашему региону, я
                      рекомендую добавить **пару аксессуаров из Drop 2** к этой развеске. Это
                      повысит средний чек на 15%. Я прикрепил рекомендуемые позиции ниже."
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        className="border-accent-primary/30 text-accent-primary hover:bg-accent-primary/15 h-7 rounded-lg text-[8px] font-black uppercase"
                      >
                        Принять рекомендации
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-text-muted h-7 rounded-lg text-[8px] font-black uppercase"
                      >
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
        <Link href={`${ROUTES.shop.b2bOrders}#8821?tab=analytics`}>
          <div className="bg-text-primary group relative w-full cursor-pointer overflow-hidden rounded-xl border border-white/5 p-4 shadow-2xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent)]" />
            <div className="relative z-10 flex flex-col items-center justify-between gap-3 md:flex-row">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <Badge className="bg-accent-primary border-none px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
                    Intel OS Analytics
                  </Badge>
                </div>
                <h4 className="text-base font-black uppercase tracking-tight text-white">
                  Аналитика мерчандайзинга
                </h4>
                <p className="text-text-muted max-w-sm text-[10px] font-medium uppercase leading-relaxed tracking-wider">
                  Прогноз: оптимизированная выкладка увеличит глубину корзины на 18% за счет
                  эффективного кросс-сейла.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border-text-primary bg-text-primary/90 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="border-text-primary bg-accent-primary flex h-10 w-10 items-center justify-center rounded-full border-2 text-[8px] font-black text-white">
                    +12
                  </div>
                </div>
                <Button className="text-text-primary hover:bg-bg-surface2 h-12 rounded-2xl bg-white px-8 text-[10px] font-black uppercase tracking-widest transition-all group-hover:scale-105">
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
            className="bg-text-primary/80 fixed inset-0 z-[100] flex items-center justify-center p-3 backdrop-blur-md"
            onClick={() => setSelected3DProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="flex h-[70vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-bg-surface2 group relative flex-1">
                {/* 3D Simulation Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-full w-full">
                    <img
                      src={selected3DProduct.images?.[0]?.url || (selected3DProduct as any).image}
                      className="h-full w-full object-contain opacity-20 grayscale"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="bg-accent-primary/10 border-accent-primary/20 animate-spin-slow flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed">
                        <RefreshCcw className="text-accent-primary h-8 w-8" />
                      </div>
                      <div className="space-y-1 text-center">
                        <p className="text-text-primary text-xs font-black uppercase tracking-widest">
                          3D Digital Twin Rendering
                        </p>
                        <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                          Physically-based cloth simulation active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3D HUD */}
                <div className="absolute left-8 top-4 space-y-2">
                  <Badge className="bg-text-primary border-none px-3 py-1 text-[8px] font-black text-white">
                    LOD: ULTRA
                  </Badge>
                  <div className="flex gap-2">
                    <div className="text-text-muted hover:text-accent-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white shadow-md transition-colors">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div className="text-text-muted hover:text-accent-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white shadow-md transition-colors">
                      <LayoutGrid className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-border-subtle flex w-full flex-col justify-between border-l p-3 md:w-80">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
                      {selected3DProduct.brand}
                    </p>
                    <h3 className="text-text-primary text-sm font-black uppercase leading-tight tracking-tighter">
                      {selected3DProduct.name}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-text-muted text-[8px] font-black uppercase tracking-widest">
                        Аналитика посадки
                      </p>
                      <div className="space-y-1.5">
                        {[
                          { label: 'Плечевой пояс', val: 98 },
                          { label: 'Длина рукава', val: 94 },
                          { label: 'Общий силуэт', val: 100 },
                        ].map((stat) => (
                          <div key={stat.label} className="space-y-1">
                            <div className="flex justify-between text-[7px] font-black uppercase">
                              <span>{stat.label}</span>
                              <span>{stat.val}%</span>
                            </div>
                            <div className="bg-bg-surface2 h-1 w-full overflow-hidden rounded-full">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${stat.val}%` }}
                              />
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
                    className="h-12 w-full rounded-2xl bg-black text-[10px] font-black uppercase tracking-widest text-white shadow-xl"
                  >
                    Вернуться к рейке
                  </Button>
                  <p className="text-text-muted text-center text-[7px] font-bold uppercase tracking-widest">
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
