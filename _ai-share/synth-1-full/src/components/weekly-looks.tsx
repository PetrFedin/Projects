'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Trophy,
  Heart,
  Sparkles,
  Layers,
  Share2,
  Eye,
  Gift,
  Plus,
  Check,
  Brain,
  MousePointer2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Archive,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { looks } from '@/lib/looks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { products as allProductsData } from '@/lib/products';

import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';

export type ProductPreviewItem = {
  id: string;
  name: string;
  image: string;
  brand: string;
  price: number;
};

type WeeklyLooksProps = {
  viewRole?: 'client' | 'b2b';
  productPreviews?: ProductPreviewItem[];
  showroomAnchor?: string;
};

export default function WeeklyLooks({
  viewRole = 'client',
  productPreviews = [],
  showroomAnchor,
}: WeeklyLooksProps) {
  const { toast } = useToast();
  const { addB2bActivityLog } = useB2BState();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'top' | 'participants'>('top');
  const [participantsCount, setParticipantsCount] = useState(1284);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<number | null>(null);
  const pageSize = 3;

  const sortedLooks = useMemo(() => [...looks].sort((a, b) => b.likesCount - a.likesCount), []);
  const winnerLook = sortedLooks[0];
  const participantsList = sortedLooks.slice(1);

  const allProducts = allProductsData;

  const winnerProducts = useMemo(() => {
    if (!winnerLook.products || allProducts.length === 0) return [];
    return winnerLook.products
      .map((lp) => allProducts.find((p) => p.id === lp.productId))
      .filter(Boolean);
  }, [winnerLook, allProducts]);

  const participantsProducts = useMemo(() => {
    if (allProducts.length === 0) return [];
    const productIds = new Set();
    participantsList.forEach((look) => {
      look.products?.forEach((lp) => productIds.add(lp.productId));
    });
    // If no products in looks, just take some from allProducts for demo
    if (productIds.size === 0) return allProducts.slice(0, 10);
    return allProducts.filter((p) => productIds.has(p.id));
  }, [participantsList, allProducts]);

  const totalPages = Math.ceil(participantsList.length / pageSize);
  const currentParticipants = participantsList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setParticipantsCount((prev) => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-full space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
              <Trophy className="relative z-10 h-4 w-4 text-black" />
            </div>
            <Badge
              variant="outline"
              className="border-slate-200 px-2 py-0.5 text-[11px] font-bold uppercase tracking-normal text-slate-900"
            >
              {viewRole === 'b2b' ? 'TRENDS_B2B' : 'CHALLENGE_B2C'}
            </Badge>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold uppercase leading-none tracking-tight text-slate-900 md:text-3xl">
                {viewRole === 'b2b' ? 'Тренды индустрии' : 'Образ недели'}
              </h2>
              <div className="flex flex-col gap-1">
                <p className="max-w-md text-xs font-medium text-slate-400">
                  {viewRole === 'b2b'
                    ? 'Анализ потребительских предпочтений и прогноз хитов продаж на основе данных сообщества.'
                    : 'Трендовые коллекции и эксклюзивные новинки от ведущих дизайнеров.'}
                </p>
              </div>
            </div>
            {viewRole === 'client' && (
              <Button
                asChild
                className="h-12 shrink-0 rounded-2xl border-0 bg-slate-900 px-6 text-[11px] font-bold uppercase tracking-normal text-white shadow-lg shadow-slate-200/50 hover:bg-slate-800"
              >
                <Link
                  href={showroomAnchor ? `#${showroomAnchor}` : '/search'}
                  className="flex items-center gap-2"
                >
                  Смотреть все образы недели
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setActiveTab('top')}
              className={cn(
                'rounded-lg px-6 py-2 text-[11px] font-bold uppercase tracking-normal transition-all',
                activeTab === 'top'
                  ? 'border border-slate-200 bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              ПОБЕДИТЕЛЬ
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={cn(
                'rounded-lg px-6 py-2 text-[11px] font-bold uppercase tracking-normal transition-all',
                activeTab === 'participants'
                  ? 'border border-slate-200 bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              НОВАЯ НЕДЕЛЯ
            </button>
          </div>
          <Link
            href="/archive"
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-900"
          >
            <Archive className="h-4 w-4 transition-transform group-hover:scale-110" />
            Архив сообщества
          </Link>
        </div>
      </div>

      {/* Товары из образов — мини-превью, связь с витриной */}
      {viewRole === 'client' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {activeTab === 'top' ? 'Товары из образа победителя' : 'Товары новой недели'}
            </span>
            <Link
              href="/search"
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-900 transition-colors hover:text-slate-600"
            >
              В каталог
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {activeTab === 'top' ? (
            <div className="custom-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
              {(winnerProducts.length > 0 ? winnerProducts : productPreviews).map((p: any) => (
                <Link
                  key={p.id}
                  href={`/search?id=${p.id}`}
                  className="group flex w-[140px] shrink-0 snap-center flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-slate-900 hover:shadow-lg"
                >
                  <div className="relative aspect-square bg-slate-100">
                    <Image
                      src={p.images?.[0]?.url || p.image}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="140px"
                    />
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="line-clamp-2 text-[10px] font-bold leading-tight text-slate-900">
                      {p.name}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-slate-500">{p.brand}</p>
                    <p className="text-[11px] font-black tabular-nums text-slate-900">
                      {p.price.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="group/marquee-products relative overflow-hidden">
              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="flex w-fit items-center gap-3"
              >
                {[1, 2].map((i) => (
                  <div key={i} className="flex shrink-0 items-center gap-3">
                    {(participantsProducts.length > 0 ? participantsProducts : productPreviews).map(
                      (p: any) => (
                        <Link
                          key={`${i}-${p.id}`}
                          href={`/search?id=${p.id}`}
                          className="group flex w-[140px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-slate-900 hover:shadow-lg"
                        >
                          <div className="relative aspect-square bg-slate-100">
                            <Image
                              src={p.images?.[0]?.url || p.image}
                              alt={p.name}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              sizes="140px"
                            />
                          </div>
                          <div className="space-y-1 p-3">
                            <p className="line-clamp-2 text-[10px] font-bold leading-tight text-slate-900">
                              {p.name}
                            </p>
                            <p className="text-[9px] uppercase tracking-wider text-slate-500">
                              {p.brand}
                            </p>
                            <p className="text-[11px] font-black tabular-nums text-slate-900">
                              {p.price.toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'top' ? (
          <motion.div
            key="winner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-3 lg:grid-cols-12"
          >
            <div className="lg:col-span-12">
              <div className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  {/* Image Side */}
                  <div className="group relative flex items-center justify-center overflow-hidden border-r border-slate-100 bg-slate-50 md:col-span-8">
                    <Image
                      src={winnerLook.imageUrl}
                      alt={winnerLook.description}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      priority
                    />

                    {/* Hotspots */}
                    {[
                      { id: 0, top: '25%', left: '45%', label: 'Шелковый платок' },
                      { id: 1, top: '55%', left: '40%', label: 'Кашемировый лонгслив' },
                      { id: 2, top: '85%', left: '65%', label: 'Соломенная сумка' },
                    ].map((spot) => (
                      <div
                        key={spot.id}
                        className="absolute z-20 cursor-pointer"
                        style={{ top: spot.top, left: spot.left }}
                        onMouseEnter={() => setHoveredHotspot(spot.id)}
                        onMouseLeave={() => setHoveredHotspot(null)}
                        onClick={() => setSelectedItemId(spot.id)}
                      >
                        <div className="relative">
                          <div
                            className={cn(
                              'flex h-4 w-4 items-center justify-center rounded-full border border-white/50 bg-white/20 backdrop-blur-md transition-all duration-300',
                              hoveredHotspot === spot.id ? 'scale-150 bg-white' : 'scale-100'
                            )}
                          >
                            <div
                              className={cn(
                                'h-1.5 w-1.5 rounded-full transition-colors',
                                hoveredHotspot === spot.id ? 'bg-indigo-600' : 'bg-white'
                              )}
                            />
                          </div>
                          <div
                            className={cn(
                              'pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-black/90 px-3 py-1.5 backdrop-blur-xl transition-all duration-300',
                              hoveredHotspot === spot.id
                                ? 'translate-x-0 opacity-100'
                                : '-translate-x-2 opacity-0'
                            )}
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">
                              {spot.label}
                            </span>
                          </div>
                          <div className="absolute inset-0 -z-10 h-4 w-4 animate-ping rounded-full border border-white/50 opacity-20" />
                        </div>
                      </div>
                    ))}

                    <div className="pointer-events-none absolute left-6 top-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-1 backdrop-blur-md">
                        <MousePointer2 className="h-3 w-3 text-white/60" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">
                          Matrix_Explorer_v1.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info Side */}
                  <div className="flex flex-col justify-between bg-white p-3 md:col-span-4">
                    <div className="space-y-10">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-xl border border-slate-100 shadow-sm">
                            <AvatarImage
                              src={winnerLook.author.avatarUrl}
                              alt={winnerLook.author.name}
                            />
                            <AvatarFallback>{winnerLook.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="mb-0.5 text-[7px] font-bold uppercase tracking-widest text-slate-400">
                              Автор образа
                            </p>
                            <p className="text-base font-black leading-none tracking-tight text-slate-900">
                              @{winnerLook.author.name}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-base font-black uppercase leading-[1.1] tracking-tight text-slate-950">
                            {winnerLook.description}
                          </h3>
                          <div className="flex gap-3 pt-2">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                              <span className="text-sm font-black tabular-nums text-slate-900">
                                {winnerLook.likesCount.toLocaleString('ru-RU')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-slate-400" />
                              <span className="text-sm font-black tabular-nums text-slate-900">
                                8.4K
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Score */}
                      <div className="space-y-6">
                        <div className="group relative overflow-hidden rounded-3xl border border-indigo-100 bg-indigo-50/50 p-3">
                          <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                            <Brain className="h-12 w-12 text-indigo-600" />
                          </div>
                          <div className="mb-3 flex items-center gap-2">
                            <Badge className="border-none bg-indigo-600 px-1.5 py-0.5 text-[7px] font-black uppercase">
                              Neural_Score: 98.4
                            </Badge>
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">
                              AI Анализ успеха
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                                Trend Synergy
                              </p>
                              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: '95%' }}
                                  className="h-full bg-indigo-500"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                                Color Balance
                              </p>
                              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: '88%' }}
                                  className="h-full bg-emerald-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <div className="flex items-center gap-3">
                            <Layers className="h-4 w-4 text-slate-900" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                              Состав образа
                            </span>
                          </div>
                        </div>
                        <div className="space-y-5">
                          {[
                            { name: 'Шелковый платок', brand: 'RADICAL CHIC', price: '15,000₽' },
                            {
                              name: 'Кашемировый лонгслив',
                              brand: 'Nordic Wool',
                              price: '22,000₽',
                            },
                            { name: 'Соломенная сумка', brand: 'EKONIKA', price: '8,500₽' },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className={cn(
                                'flex cursor-pointer items-start justify-between rounded-2xl border border-transparent p-3 transition-all duration-500',
                                selectedItemId === i
                                  ? 'border-indigo-200 bg-indigo-50/80 shadow-sm'
                                  : 'hover:bg-slate-50'
                              )}
                              onClick={() => setSelectedItemId(i)}
                            >
                              <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-tight text-slate-900">
                                  {item.name}
                                </p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                  {item.brand}
                                </p>
                              </div>
                              <p className="text-xs font-black tabular-nums text-slate-900">
                                {item.price}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="h-12 rounded-2xl border-slate-200 text-[11px] font-bold uppercase tracking-normal transition-all hover:border-indigo-600"
                        >
                          Примерить
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (viewRole === 'b2b') {
                              addB2bActivityLog({
                                type: 'view_product',
                                actor: {
                                  id: 'retailer-1',
                                  name: 'Premium Store',
                                  type: 'retailer',
                                },
                                target: {
                                  id: 'market-matrix',
                                  name: 'Market Intelligence Matrix',
                                  type: 'product',
                                },
                                details:
                                  'Requested deep market analysis for current trend cluster.',
                              });
                            }
                          }}
                          className="h-12 rounded-2xl border-slate-200 text-[11px] font-bold uppercase tracking-normal transition-all hover:border-slate-900"
                        >
                          B2B Matrix
                        </Button>
                      </div>
                      <Button
                        asChild
                        className="button-glimmer button-professional h-10 w-full border-none !bg-black px-10 text-[11px] font-bold uppercase tracking-normal text-white shadow-xl shadow-slate-200/50 hover:!bg-black"
                      >
                        <Link
                          href={`/looks/${winnerLook.id}`}
                          className="flex items-center justify-center gap-2"
                        >
                          Подробнее об образе
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:col-span-12">
              <Card className="group relative mt-12 flex min-h-[300px] w-full items-center overflow-hidden rounded-xl border-none bg-slate-900 shadow-2xl">
                <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover:scale-105">
                  <Image
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000"
                    alt="Challenge Rewards"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                <CardContent className="relative z-10 w-full max-w-4xl space-y-4 p-4 text-white">
                  <div className="group/marquee relative mb-4 overflow-hidden whitespace-nowrap border-y border-white/10 py-2">
                    <motion.div
                      animate={{ x: ['0%', '-50%'] }}
                      transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                      className="flex w-fit items-center gap-3"
                    >
                      {[1, 2].map((i) => (
                        <div key={i} className="flex shrink-0 items-center gap-3">
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                            • Образ недели
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                            • Выбор клиентов
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                            • Тренды сезона
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold uppercase leading-[0.85] tracking-tight md:text-3xl">
                      {viewRole === 'b2b' ? 'АНАЛИЗ РЫНКА' : 'ОБРАЗЫ НЕДЕЛИ'}
                    </h2>
                    <p className="whitespace-nowrap border-l-2 border-indigo-500/50 pl-6 text-sm font-medium text-slate-300">
                      {viewRole === 'b2b'
                        ? '"Инсайты о предпочтениях аудитории."'
                        : '"Лучшие сочетания сезона в одном месте."'}
                    </p>
                    <div className="flex pt-4">
                      <Button
                        asChild
                        onClick={() => {
                          if (viewRole === 'b2b') {
                            addB2bActivityLog({
                              type: 'view_product',
                              actor: { id: 'retailer-1', name: 'Premium Store', type: 'retailer' },
                              target: {
                                id: 'brand-dashboard',
                                name: 'Analytical Dashboard',
                                type: 'product',
                              },
                              details: 'Accessed brand-specific market insights and data.',
                            });
                          }
                        }}
                        className="button-glimmer button-professional flex h-11 w-fit min-w-[200px] items-center justify-center gap-2 rounded-xl border-none !bg-black px-8 text-[11px] font-bold uppercase tracking-normal shadow-none hover:!bg-black"
                      >
                        <Link href={viewRole === 'b2b' ? '/brand/dashboard' : '/u?tab=challenges'}>
                          {viewRole === 'b2b' ? 'Дашборд бренда' : 'Смотреть все'}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="participants"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {currentParticipants.map((look, idx) => (
                <Link key={look.id} href={`/looks/${look.id}`} className="group block">
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:border-slate-900 hover:bg-slate-50 hover:shadow-lg">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                      <Image
                        src={look.imageUrl}
                        alt={look.description}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-black text-xs font-black text-white shadow-xl">
                        #{(currentPage - 1) * pageSize + idx + 2}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 rounded border border-slate-200">
                            <AvatarImage src={look.author.avatarUrl} alt={look.author.name} />
                            <AvatarFallback>{look.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                            @{look.author.name}
                          </span>
                        </div>
                        <h5 className="line-clamp-2 text-[12px] font-black uppercase leading-tight tracking-tight text-slate-900">
                          {look.description}
                        </h5>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                        <div className="flex items-center gap-3">
                          <Heart className="h-3.5 w-3.5 text-rose-500 transition-transform group-hover:scale-125" />
                          <span className="text-[11px] font-black tabular-nums text-slate-900">
                            {look.likesCount.toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <button className="h-7 rounded-lg bg-slate-900 px-3 text-[11px] font-bold uppercase tracking-normal text-white transition-colors hover:bg-indigo-600">
                          ГОЛОСОВАТЬ
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl border-slate-200"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={cn(
                        'h-8 w-8 rounded-lg text-[10px] font-black transition-all',
                        currentPage === i + 1
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900'
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl border-slate-200"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="w-full">
              <Card className="group relative mt-12 flex min-h-[300px] w-full items-center overflow-hidden rounded-xl border-none bg-slate-900 shadow-2xl">
                <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover:scale-105">
                  <Image
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000"
                    alt="Challenge Rewards"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                <CardContent className="relative z-10 w-full max-w-4xl space-y-6 p-4 text-white">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold uppercase leading-[0.85] tracking-tight md:text-3xl">
                      {viewRole === 'b2b' ? (
                        <>
                          АНАЛИЗ
                          <br />
                          РЫНКА
                        </>
                      ) : (
                        <>
                          ПУТЬ К<br />
                          СУПЕРФИНАЛУ
                        </>
                      )}
                    </h2>
                    <p className="whitespace-nowrap border-l-2 border-indigo-500/50 pl-6 text-sm font-medium text-slate-300">
                      {viewRole === 'b2b'
                        ? '"Получите доступ к глубоким инсайтам о предпочтениях аудитории."'
                        : '"Выбирайте лучшее из новых коллекций прямо сейчас"'}
                    </p>
                    <div className="flex pt-4">
                      <Button
                        asChild
                        className="button-glimmer button-professional flex h-11 w-fit min-w-[200px] items-center justify-center gap-2 rounded-xl border-none !bg-black px-8 text-[11px] font-bold uppercase tracking-normal shadow-none hover:!bg-black"
                      >
                        <Link href={viewRole === 'b2b' ? '/brand/dashboard' : '/u?tab=challenges'}>
                          {viewRole === 'b2b' ? 'Дашборд бренда' : 'Участвовать'}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
