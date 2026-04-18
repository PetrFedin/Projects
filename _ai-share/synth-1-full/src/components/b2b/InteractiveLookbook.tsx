'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Eye,
  Settings2,
  Trash2,
  MousePointer2,
  Tag,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Share2,
  Sparkles,
  Layers,
  ArrowRight,
  Cloud,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useB2BState } from '@/providers/b2b-state';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/cn';
import allProductsData from '@/lib/products';

export function InteractiveLookbook() {
  const { b2bLookbooks, addB2bLookbook } = useB2BState();
  const { activeCurrency } = useUIState();
  const [selectedLookbook, setSelectedLookbook] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [isEditorMode, setIsEditorMode] = useState(false);

  const activePage = selectedLookbook?.pages[activePageIdx];

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditorMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // In a real app, show product picker
    console.log(`New hotspot at x: ${x}, y: ${y}`);
  };

  return (
    <div className="min-h-screen space-y-4 bg-slate-50 p-3 text-left">
      <AnimatePresence mode="wait">
        {!selectedLookbook ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-600"
                  >
                    VISUAL_SELL_v3.0
                  </Badge>
                </div>
                <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
                  Интерактивные
                  <br />
                  Лукбуки
                </h2>
                <p className="max-w-md text-xs font-medium text-slate-400">
                  Превратите имиджевые кампании в торговый опыт. Отмечайте товары прямо на фото для
                  мгновенного оформления оптовых заказов.
                </p>
              </div>

              <Button className="h-10 gap-2 rounded-2xl bg-slate-900 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200">
                <Plus className="h-4 w-4" /> Создать новый лукбук
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {b2bLookbooks.map((lb) => (
                <Card
                  key={lb.id}
                  onClick={() => setSelectedLookbook(lb)}
                  className="group cursor-pointer overflow-hidden rounded-xl border-none bg-white shadow-xl shadow-slate-200/50 transition-all hover:scale-[1.02]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={lb.coverUrl}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                    <div className="absolute left-6 top-4">
                      <Badge className="border-none bg-white/90 px-3 py-1 text-[8px] font-black uppercase text-slate-900 backdrop-blur-md">
                        {lb.season}
                      </Badge>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8">
                      <h4 className="mb-2 text-sm font-black uppercase leading-none tracking-tight text-white">
                        {lb.title}
                      </h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                        {lb.pages.length} Стр. •{' '}
                        {lb.pages.reduce((acc, p) => acc + p.hotspots.length, 0)} Товаров
                      </p>
                    </div>
                  </div>
                  <CardContent className="flex items-center justify-between border-t border-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        {lb.status}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl text-slate-300 transition-all group-hover:bg-slate-50 group-hover:text-slate-900"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setSelectedLookbook(null)}
                variant="ghost"
                className="gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
              >
                <ChevronLeft className="h-4 w-4" /> Назад в библиотеку
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsEditorMode(!isEditorMode)}
                  variant={isEditorMode ? 'default' : 'outline'}
                  className={cn(
                    'h-12 gap-2 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest',
                    isEditorMode ? 'bg-indigo-600 text-white' : 'bg-white'
                  )}
                >
                  <Settings2 className="h-4 w-4" />{' '}
                  {isEditorMode ? 'Сохранить макет' : 'Режим редактора'}
                </Button>
                <Button className="h-12 gap-2 rounded-2xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white">
                  <Share2 className="h-4 w-4" /> Опубликовать ссылку
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-8">
                <Card className="relative overflow-hidden rounded-xl border-none bg-white shadow-2xl">
                  <div
                    className={cn(
                      'relative aspect-[4/5] cursor-crosshair',
                      !isEditorMode && 'cursor-default'
                    )}
                    onClick={handlePageClick}
                  >
                    <img src={activePage.imageUrl} className="h-full w-full object-cover" />

                    {activePage.hotspots.map((h: any) => {
                      const product = allProductsData.find((p) => p.id === h.productId);
                      return (
                        <div
                          key={h.id}
                          className="group absolute"
                          style={{ left: `${h.x}%`, top: `${h.y}%` }}
                        >
                          <div className="relative">
                            <div className="flex h-8 w-8 animate-pulse cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-2xl backdrop-blur-md transition-all group-hover:scale-125 group-hover:animate-none">
                              <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                            </div>

                            <div className="pointer-events-none absolute left-1/2 top-3 z-20 w-48 -translate-x-1/2 scale-90 rounded-2xl bg-white p-4 opacity-0 shadow-2xl transition-all group-hover:scale-100 group-hover:opacity-100">
                              <div className="space-y-3">
                                <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
                                  <img
                                    src={product?.images?.[0]?.url}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black uppercase leading-none text-slate-900">
                                    {product?.name}
                                  </p>
                                  <p className="text-[9px] font-bold uppercase text-indigo-600">
                                    {product?.price.toLocaleString('ru-RU')} ₽
                                  </p>
                                </div>
                                <Button className="h-8 w-full rounded-lg bg-slate-900 text-[8px] font-black uppercase text-white">
                                  В корзину
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="absolute inset-y-0 left-0 flex items-center px-4">
                    <Button
                      onClick={() => setActivePageIdx(Math.max(0, activePageIdx - 1))}
                      disabled={activePageIdx === 0}
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-slate-900 disabled:opacity-30"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4">
                    <Button
                      onClick={() =>
                        setActivePageIdx(
                          Math.min(selectedLookbook.pages.length - 1, activePageIdx + 1)
                        )
                      }
                      disabled={activePageIdx === selectedLookbook.pages.length - 1}
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-slate-900 disabled:opacity-30"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                </Card>

                <div className="flex justify-center gap-3 overflow-x-auto py-2">
                  {selectedLookbook.pages.map((p: any, i: number) => (
                    <button
                      key={p.id}
                      onClick={() => setActivePageIdx(i)}
                      className={cn(
                        'h-20 w-12 shrink-0 overflow-hidden rounded-xl border-4 transition-all',
                        activePageIdx === i
                          ? 'scale-110 border-indigo-600 shadow-lg'
                          : 'border-white opacity-60 shadow-sm hover:opacity-100'
                      )}
                    >
                      <img src={p.imageUrl} className="h-full w-full object-cover" />
                    </button>
                  ))}
                  {isEditorMode && (
                    <button className="flex h-20 w-12 shrink-0 items-center justify-center rounded-xl border-4 border-dashed border-slate-200 text-slate-300 transition-all hover:border-slate-400 hover:text-slate-900">
                      <Plus className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4 lg:col-span-4">
                <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">
                    Товары на странице
                  </h4>
                  <div className="space-y-4">
                    {activePage.hotspots.length > 0 ? (
                      activePage.hotspots.map((h: any) => {
                        const product = allProductsData.find((p) => p.id === h.productId);
                        return (
                          <div key={h.id} className="group flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                <img
                                  src={product?.images?.[0]?.url}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase text-slate-900">
                                  {product?.name}
                                </p>
                                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                  {product?.sku}
                                </p>
                              </div>
                            </div>
                            {isEditorMode ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg text-rose-500 hover:bg-rose-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Badge className="border-none bg-emerald-50 text-[8px] font-black text-emerald-600">
                                В НАЛИЧИИ
                              </Badge>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="py-4 text-[10px] font-bold uppercase italic tracking-widest text-slate-300">
                        Нет отмеченных товаров на странице
                      </p>
                    )}
                  </div>
                  {isEditorMode && (
                    <Button
                      variant="outline"
                      className="h-12 w-full gap-2 rounded-xl border-slate-100 text-[9px] font-black uppercase tracking-widest"
                    >
                      <Tag className="h-4 w-4" /> Отметить новый товар
                    </Button>
                  )}
                </Card>

                <Card className="relative space-y-6 overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
                  <div className="absolute right-0 top-0 p-4 opacity-10">
                    <Sparkles className="h-24 w-24" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <h5 className="text-sm font-black uppercase tracking-widest text-indigo-400">
                      AI Визуальный Помощник
                    </h5>
                    <p className="text-[10px] font-medium uppercase leading-relaxed tracking-widest text-slate-400">
                      Наш ИИ автоматически обнаружил **3 потенциальных товара** на этом фото.
                      Нажмите для проверки и подтверждения тегов.
                    </p>
                    <Button className="h-10 w-full rounded-xl bg-white text-[9px] font-black uppercase tracking-widest text-slate-900">
                      Запустить ИИ-сканирование
                    </Button>
                  </div>
                </Card>

                <Card className="space-y-4 rounded-xl border-none bg-indigo-50 p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <MousePointer2 className="h-4 w-4 text-indigo-600" />
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-900">
                      Эффективность страницы
                    </h5>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase text-indigo-400">
                        Ср. время фокуса
                      </p>
                      <p className="text-base font-black text-indigo-900">12.4с</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase text-indigo-400">
                        Кликабельность (CTR)
                      </p>
                      <p className="text-base font-black text-indigo-900">18.2%</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
