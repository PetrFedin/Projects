'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ChevronRight,
  Download,
  Video,
  Image as ImageIcon,
  Box,
  Calendar,
  Percent,
  ShieldCheck,
  Plus,
  ArrowRight,
  Filter,
  Search,
  ShoppingCart,
  Maximize2,
  Lock,
  Eye,
  FileCheck,
  Package,
  Truck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { WholesaleCollection } from '@/lib/types/b2b';
import { WholesaleLookbook } from './WholesaleLookbook';
import { WholesaleOrderMatrix } from './WholesaleOrderMatrix';
import { cn } from '@/lib/cn';

export function WholesaleCollectionExplorer() {
  const { viewRole } = useUIState();
  const { wholesaleCollections } = useB2BState();
  const [selectedCollection, setSelectedCollection] = useState<WholesaleCollection | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDrop, setActiveDrop] = useState<string | null>(null);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'lookbook'>('grid');

  // Use collections from context (already filtered by brand)
  const collections = useMemo(() => {
    return wholesaleCollections;
  }, [wholesaleCollections]);

  return (
    <div className="min-h-screen space-y-4 bg-white p-4">
      <AnimatePresence mode="wait">
        {!selectedCollection ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
<<<<<<< HEAD
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900">
=======
                  <div className="bg-text-primary flex h-8 w-8 items-center justify-center rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  <Badge
                    variant="outline"
<<<<<<< HEAD
                    className="border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-900"
=======
                    className="border-border-default text-text-primary text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    Wholesale_Registry_v4.0
                  </Badge>
                </div>
<<<<<<< HEAD
                <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-base">
=======
                <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-base">
>>>>>>> recover/cabinet-wip-from-stash
                  Маркетплейс
                  <br />
                  Коллекций
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-64">
<<<<<<< HEAD
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Поиск коллекций..."
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 pl-10 focus-visible:ring-indigo-500"
=======
                  <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Поиск коллекций..."
                    className="border-border-subtle bg-bg-surface2 focus-visible:ring-accent-primary h-12 rounded-2xl pl-10"
>>>>>>> recover/cabinet-wip-from-stash
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="border-border-subtle h-12 w-12 rounded-2xl p-0"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                {viewRole === 'brand' && (
<<<<<<< HEAD
                  <Button className="h-12 gap-2 rounded-2xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200">
=======
                  <Button className="bg-text-primary h-12 gap-2 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                    <Plus className="h-4 w-4" /> Новая коллекция
                  </Button>
                )}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((coll) => (
                <Card
                  key={coll.id}
                  onClick={() => setSelectedCollection(coll)}
<<<<<<< HEAD
                  className="group cursor-pointer overflow-hidden rounded-xl border-none shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:scale-[1.02]"
=======
                  className="group cursor-pointer overflow-hidden rounded-xl border-none shadow-2xl shadow-md transition-all duration-500 hover:scale-[1.02]"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={coll.lookbookUrls[0]}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
<<<<<<< HEAD
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    <div className="absolute left-6 top-4">
                      <Badge className="border-none bg-white/90 px-3 py-1 text-[9px] font-black uppercase text-slate-900 backdrop-blur-md">
=======
                    <div className="from-text-primary/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
                    <div className="absolute left-6 top-4">
                      <Badge className="text-text-primary border-none bg-white/90 px-3 py-1 text-[9px] font-black uppercase backdrop-blur-md">
>>>>>>> recover/cabinet-wip-from-stash
                        {coll.season} {coll.year}
                      </Badge>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-sm font-black uppercase leading-tight tracking-tighter text-white">
                        {coll.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="space-y-6 bg-white p-4">
<<<<<<< HEAD
                    <p className="line-clamp-2 text-xs font-medium leading-relaxed text-slate-500">
                      "{coll.description}"
                    </p>
                    <div className="grid grid-cols-3 gap-3 border-y border-slate-50 py-4">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                          Кол-во SKU
                        </p>
                        <p className="text-sm font-black text-slate-900">42</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                          Входная цена
                        </p>
                        <p className="text-sm font-black text-slate-900">12.5K ₽</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                          Дропы
                        </p>
                        <p className="text-sm font-black text-slate-900">{coll.drops.length}</p>
=======
                    <p className="text-text-secondary line-clamp-2 text-xs font-medium leading-relaxed">
                      "{coll.description}"
                    </p>
                    <div className="border-border-subtle grid grid-cols-3 gap-3 border-y py-4">
                      <div className="space-y-1">
                        <p className="text-text-muted text-[8px] font-black uppercase tracking-widest">
                          Кол-во SKU
                        </p>
                        <p className="text-text-primary text-sm font-black">42</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-text-muted text-[8px] font-black uppercase tracking-widest">
                          Входная цена
                        </p>
                        <p className="text-text-primary text-sm font-black">12.5K ₽</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-text-muted text-[8px] font-black uppercase tracking-widest">
                          Дропы
                        </p>
                        <p className="text-text-primary text-sm font-black">{coll.drops.length}</p>
>>>>>>> recover/cabinet-wip-from-stash
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
<<<<<<< HEAD
                            className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100"
=======
                            className="bg-bg-surface2 flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-white"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} />
                          </div>
                        ))}
<<<<<<< HEAD
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-[7px] font-black text-white">
=======
                        <div className="bg-text-primary flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[7px] font-black text-white">
>>>>>>> recover/cabinet-wip-from-stash
                          +12
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="gap-2 p-0 text-[10px] font-black uppercase tracking-widest hover:bg-transparent"
                      >
                        Исследовать коллекцию <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col gap-3 lg:flex-row"
          >
            {/* Sidebar: Navigation & Docs */}
            <div className="w-full space-y-6 lg:w-[350px]">
              <Button
                variant="ghost"
                onClick={() => setSelectedCollection(null)}
<<<<<<< HEAD
                className="mb-4 flex items-center gap-2 p-0 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
=======
                className="text-text-muted hover:text-text-primary mb-4 flex items-center gap-2 p-0 text-[10px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <ChevronRight className="h-4 w-4 rotate-180" /> Назад к списку
              </Button>

<<<<<<< HEAD
              <Card className="overflow-hidden rounded-xl border-none bg-slate-900 text-white shadow-2xl shadow-slate-200/50">
                <div className="space-y-6 p-4">
                  <div className="space-y-2">
                    <Badge className="border-none bg-indigo-600 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
=======
              <Card className="bg-text-primary overflow-hidden rounded-xl border-none text-white shadow-2xl shadow-md">
                <div className="space-y-6 p-4">
                  <div className="space-y-2">
                    <Badge className="bg-accent-primary border-none px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
                      Документация
                    </Badge>
                    <h3 className="text-base font-black uppercase tracking-tight">
                      Технический Хаб
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedCollection.documents.map((doc, i) => (
                      <button
                        key={i}
                        className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-lg',
                              doc.type === 'price'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : doc.type === 'tech'
<<<<<<< HEAD
                                  ? 'bg-indigo-500/20 text-indigo-400'
=======
                                  ? 'bg-accent-primary/20 text-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                                  : 'bg-amber-500/20 text-amber-400'
                            )}
                          >
                            <FileText className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-tight text-white/80">
                            {doc.title}
                          </span>
                        </div>
                        <Download className="h-3.5 w-3.5 text-white/20 transition-all group-hover:text-white" />
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

<<<<<<< HEAD
              <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-slate-200/50">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Ценовые уровни
                  </p>
                  <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
=======
              <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-md">
                <div className="space-y-2">
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    Ценовые уровни
                  </p>
                  <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                    Действующие условия
                  </h4>
                </div>
                <div className="space-y-4">
                  {selectedCollection.pricingTiers.map((tier) => (
                    <div
                      key={tier.id}
<<<<<<< HEAD
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase leading-none text-slate-900">
                          {tier.name}
                        </p>
                        <p className="text-[8px] font-bold uppercase text-slate-400">
=======
                      className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-2xl border p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-text-primary text-[10px] font-black uppercase leading-none">
                          {tier.name}
                        </p>
                        <p className="text-text-muted text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          Мин. заказ: {tier.moq.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-emerald-600">
                        <Percent className="h-2.5 w-2.5" />
                        <span className="text-[10px] font-black">{tier.discountPercent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
<<<<<<< HEAD
                <Button className="h-12 w-full gap-2 rounded-2xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200">
=======
                <Button className="bg-text-primary h-12 w-full gap-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                  Запросить индивидуальные условия
                </Button>
              </Card>
            </div>

            {/* Main Content: Showcase & Lookbook */}
            <div className="flex-1 space-y-4">
              <div className="mb-4 flex items-center justify-between">
<<<<<<< HEAD
                <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
=======
                <div className="bg-bg-surface2 flex items-center gap-1.5 rounded-xl p-1">
>>>>>>> recover/cabinet-wip-from-stash
                  <Button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'h-10 rounded-lg px-6 text-[9px] font-black uppercase tracking-widest transition-all',
                      viewMode === 'grid'
<<<<<<< HEAD
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'bg-transparent text-slate-400 hover:text-slate-600'
=======
                        ? 'text-text-primary bg-white shadow-sm'
                        : 'text-text-muted hover:text-text-secondary bg-transparent'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    Сетка товаров
                  </Button>
                  <Button
                    onClick={() => setViewMode('lookbook')}
                    className={cn(
                      'h-10 rounded-lg px-6 text-[9px] font-black uppercase tracking-widest transition-all',
                      viewMode === 'lookbook'
<<<<<<< HEAD
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'bg-transparent text-slate-400 hover:text-slate-600'
=======
                        ? 'text-text-primary bg-white shadow-sm'
                        : 'text-text-muted hover:text-text-secondary bg-transparent'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    Интерактивный лукбук
                  </Button>
                </div>
              </div>

              {viewMode === 'lookbook' ? (
                <div className="h-[700px]">
                  <WholesaleLookbook onShopProduct={(id) => setIsMatrixOpen(true)} />
                </div>
              ) : (
                <>
                  <div className="group/hero relative h-[400px] overflow-hidden rounded-xl shadow-2xl">
                    <img
                      src={selectedCollection.lookbookUrls[1]}
                      className="h-full w-full object-cover"
                    />
<<<<<<< HEAD
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex scale-95 items-center justify-center opacity-0 transition-all duration-500 group-hover/hero:scale-100 group-hover/hero:opacity-100">
                      <Button className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-0 text-slate-900 shadow-2xl">
=======
                    <div className="from-text-primary absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
                    <div className="absolute inset-0 flex scale-95 items-center justify-center opacity-0 transition-all duration-500 group-hover/hero:scale-100 group-hover/hero:opacity-100">
                      <Button className="text-text-primary flex h-12 w-12 items-center justify-center rounded-full bg-white p-0 shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
                        <Video className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="absolute bottom-10 left-10 space-y-2">
<<<<<<< HEAD
                      <Badge className="border-none bg-indigo-600 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
=======
                      <Badge className="bg-accent-primary border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
                        Презентация бренда
                      </Badge>
                      <h1 className="text-sm font-black uppercase leading-none tracking-tighter text-white">
                        {selectedCollection.title}
                      </h1>
                    </div>
                  </div>

                  {/* Delivery Drops */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {selectedCollection.drops.map((drop) => (
                      <Card
                        key={drop.id}
                        onClick={() => setActiveDrop(drop.id)}
                        className={cn(
<<<<<<< HEAD
                          'group cursor-pointer overflow-hidden rounded-xl border-none shadow-2xl shadow-slate-200/50 transition-all duration-500',
                          activeDrop === drop.id
                            ? 'scale-[1.02] ring-2 ring-indigo-600'
                            : 'hover:bg-slate-50'
=======
                          'group cursor-pointer overflow-hidden rounded-xl border-none shadow-2xl shadow-md transition-all duration-500',
                          activeDrop === drop.id
                            ? 'ring-accent-primary scale-[1.02] ring-2'
                            : 'hover:bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      >
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg transition-colors',
                                activeDrop === drop.id
<<<<<<< HEAD
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-indigo-600'
=======
                                  ? 'bg-accent-primary text-white'
                                  : 'bg-bg-surface2 text-text-muted group-hover:text-accent-primary group-hover:bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                              )}
                            >
                              <Calendar className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
<<<<<<< HEAD
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Окно поставки
                              </p>
                              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
                                {drop.name.replace('Drop', 'Дроп')}
                              </h4>
                              <p className="text-xs font-bold uppercase text-indigo-600">
=======
                              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                                Окно поставки
                              </p>
                              <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
                                {drop.name.replace('Drop', 'Дроп')}
                              </h4>
                              <p className="text-accent-primary text-xs font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                {drop.deliveryDate
                                  .replace('July', 'Июль')
                                  .replace('August', 'Август')
                                  .replace('September', 'Сентябрь')}
                              </p>
                            </div>
                          </div>
                          <ChevronRight
                            className={cn(
                              'h-5 w-5 transition-all',
                              activeDrop === drop.id
<<<<<<< HEAD
                                ? 'translate-x-1 text-indigo-600'
                                : 'text-slate-200'
=======
                                ? 'text-accent-primary translate-x-1'
                                : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                            )}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Grid: Order Matrix Pre-view */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
<<<<<<< HEAD
                        <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                          Каталог коллекции
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
                        <h3 className="text-text-primary text-sm font-black uppercase tracking-tight">
                          Каталог коллекции
                        </h3>
                        <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          Всего 42 модели / Выберите товар для настройки размеров
                        </p>
                      </div>
                      <Button
<<<<<<< HEAD
                        className="h-12 gap-2 rounded-2xl bg-indigo-600 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-200"
=======
                        className="bg-accent-primary shadow-accent-primary/15 h-12 gap-2 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl"
>>>>>>> recover/cabinet-wip-from-stash
                        onClick={() => setIsMatrixOpen(true)}
                      >
                        Открыть матрицу заказа <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
<<<<<<< HEAD
                          className="group flex flex-col rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all duration-500 hover:border-indigo-200 hover:bg-white"
=======
                          className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/30 group flex flex-col rounded-xl border p-4 transition-all duration-500 hover:bg-white"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-white shadow-sm">
                            <img
                              src={`https://placehold.co/400x400/f8fafc/64748b?text=STYLE_${i}`}
                              className="h-full w-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute right-2 top-2">
<<<<<<< HEAD
                              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-400 shadow-sm backdrop-blur-md transition-all hover:text-indigo-600">
=======
                              <button className="text-text-muted hover:text-accent-primary flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 shadow-sm backdrop-blur-md transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2 px-1">
                            <div className="flex items-center justify-between">
<<<<<<< HEAD
                              <p className="text-[8px] font-black uppercase leading-none tracking-widest text-indigo-600">
=======
                              <p className="text-accent-primary text-[8px] font-black uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                                Cyber Parka
                              </p>
                              <Badge
                                variant="outline"
<<<<<<< HEAD
                                className="border-slate-200 px-1.5 py-0 text-[7px] font-bold uppercase"
=======
                                className="border-border-default px-1.5 py-0 text-[7px] font-bold uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                              >
                                Tech_Spec_v2
                              </Badge>
                            </div>
<<<<<<< HEAD
                            <h4 className="text-xs font-black uppercase tracking-tight text-slate-900">
=======
                            <h4 className="text-text-primary text-xs font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                              STYLE_SKU_00{i}
                            </h4>

                            {/* New Detail Specs */}
                            <div className="space-y-1.5 pt-2">
                              <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                                <Box className="h-2.5 w-2.5 text-slate-400" />
                                <span className="text-[8px] font-bold uppercase text-slate-500">
=======
                                <Box className="text-text-muted h-2.5 w-2.5" />
                                <span className="text-text-secondary text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                  Состав: 80% Нейлон, 20% Графен
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ShieldCheck className="h-2.5 w-2.5 text-emerald-500" />
<<<<<<< HEAD
                                <span className="text-[8px] font-bold uppercase text-slate-500">
=======
                                <span className="text-text-secondary text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                  Серт: OEKO-TEX Standard 100
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Truck className="h-2.5 w-2.5 text-amber-500" />
<<<<<<< HEAD
                                <span className="text-[8px] font-bold uppercase text-slate-500">
=======
                                <span className="text-text-secondary text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                  Пр-во: 45-60 дней
                                </span>
                              </div>
                            </div>

<<<<<<< HEAD
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                              <span className="text-[10px] font-black text-slate-900">
                                12,400 ₽
                              </span>
                              <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white shadow-lg transition-all hover:bg-indigo-600">
=======
                            <div className="border-border-subtle mt-3 flex items-center justify-between border-t pt-3">
                              <span className="text-text-primary text-[10px] font-black">
                                12,400 ₽
                              </span>
                              <button className="bg-text-primary hover:bg-accent-primary flex h-7 w-7 items-center justify-center rounded-lg text-white shadow-lg transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMatrixOpen && (
        <WholesaleOrderMatrix
          collectionId={selectedCollection?.id || ''}
          onClose={() => setIsMatrixOpen(false)}
        />
      )}
    </div>
  );
}
