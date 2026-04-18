'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Gavel,
  Search,
  Filter,
  Clock,
  Users,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Box,
  Factory,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Brain,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockAuctions } from '@/lib/auction-data';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIState } from '@/providers/ui-state';
import type { Auction } from '@/lib/types';

export default function PublicAuctionsPage() {
  const { viewRole, user } = useUIState();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeType, setActiveType] = React.useState<
    'all' | 'production' | 'materials' | 'collaboration' | 'services'
  >('all');
  const [activeStatus, setActiveStatus] = React.useState<'all' | 'active' | 'completed'>('all');

  const role = user?.activeOrganizationId?.includes('org-brand')
    ? 'brand'
    : user?.activeOrganizationId?.includes('org-factory')
      ? 'factory'
      : user?.activeOrganizationId?.includes('org-shop')
        ? 'shop'
        : 'client';

  const filteredAuctions = mockAuctions.filter((auc) => {
    const matchesSearch =
      auc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeType === 'all' || auc.type === activeType;
    const matchesStatus = activeStatus === 'all' || auc.status === activeStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 font-sans duration-300 animate-in fade-in md:p-4 lg:p-4">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Hero Header */}
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 shadow-lg shadow-slate-900/20">
                <Gavel className="h-6 w-6 text-white" />
              </div>
              <Badge
                variant="outline"
                className="border-slate-900/20 bg-slate-900/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-900"
              >
                B2B Exchange
              </Badge>
            </div>
            <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900 md:text-base">
              {viewRole === 'b2b'
                ? role === 'factory'
                  ? 'Тендеры на мощности'
                  : 'Аукционы'
                : 'Аукционы'}
            </h1>
            <p className="max-w-xl text-sm font-medium text-slate-400">
              {viewRole === 'b2b'
                ? role === 'factory'
                  ? 'Получайте заказы от брендов и оптимизируйте загрузку своих цехов через прозрачную систему ставок.'
                  : 'Размещайте заказы и получайте лучшие предложения от проверенных производств.'
                : 'Размещайте заказы и получайте лучшие предложения от проверенных поставщиков и производств.'}
            </p>
          </div>
          {viewRole === 'b2b' && (role === 'brand' || role === 'shop') && (
            <Button
              asChild
              className="group h-12 rounded-2xl bg-slate-900 px-10 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-slate-900/20 transition-all hover:bg-black"
            >
              <Link href="/brand/auctions">
                Создать лот{' '}
                <PlusCircle className="ml-2 h-5 w-5 transition-transform group-hover:rotate-90" />
              </Link>
            </Button>
          )}
        </div>

        {/* Stats / Quick Insights */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Card className="relative overflow-hidden rounded-xl border-none bg-white p-4 shadow-xl">
            <div className="absolute right-0 top-0 p-4 opacity-5">
              <TrendingUp className="h-24 w-24" />
            </div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Объем сделок
            </p>
            <h3 className="text-base font-black tracking-tighter text-slate-900">158.4M ₽</h3>
          </Card>
          <Card className="relative overflow-hidden rounded-xl border-none bg-white p-4 shadow-xl">
            <div className="absolute right-0 top-0 p-4 opacity-5">
              <Users className="h-24 w-24" />
            </div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Активных участников
            </p>
            <h3 className="text-base font-black tracking-tighter text-slate-900">
              4,850{' '}
              <span className="text-sm font-bold uppercase tracking-normal text-slate-400">
                профи
              </span>
            </h3>
          </Card>
          <Card className="relative overflow-hidden rounded-xl border-none bg-indigo-600 p-4 text-white shadow-xl">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Sparkles className="h-24 w-24" />
            </div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">
              Коллаборации
            </p>
            <h3 className="text-base font-black tracking-tighter">Influencer Ads</h3>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-lg md:flex-row">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1">
              {(['all', 'production', 'materials', 'collaboration', 'services'] as const).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={cn(
                      'rounded-lg px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all',
                      activeType === type
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    )}
                  >
                    {type === 'all'
                      ? 'Все типы'
                      : type === 'production'
                        ? 'Производство'
                        : type === 'materials'
                          ? 'Сырье'
                          : type === 'collaboration'
                            ? 'Коллаборации'
                            : 'Услуги'}
                  </button>
                )
              )}
            </div>
            <div className="mx-2 h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1">
              {(['all', 'active', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={cn(
                    'rounded-lg px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all',
                    activeStatus === status
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  {status === 'all' ? 'Все' : status === 'active' ? 'Активные' : 'Завершенные'}
                </button>
              ))}
            </div>
          </div>

          <div className="group relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-900" />
            <Input
              placeholder="Поиск по тендерам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-xl border-slate-100 bg-slate-50 pl-12 text-[10px] font-bold uppercase tracking-widest transition-all focus:bg-white focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredAuctions.map((auc, idx) => {
              const bestBid =
                auc.bids.length > 0
                  ? auc.bids.reduce((prev, curr) => (prev.amount < curr.amount ? prev : curr))
                  : null;

              return (
                <motion.div
                  key={auc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="group flex h-full flex-col overflow-hidden rounded-xl border-none bg-white shadow-xl transition-all duration-500 hover:shadow-2xl">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={auc.image || ''}
                        alt={auc.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                      <div className="absolute left-4 top-4 flex gap-2">
                        <Badge
                          className={cn(
                            'border-none px-3 py-1 text-[8px] font-black uppercase tracking-[0.1em] shadow-lg',
                            auc.type === 'production'
                              ? 'bg-blue-600 text-white'
                              : auc.type === 'materials'
                                ? 'bg-emerald-600 text-white'
                                : auc.type === 'collaboration'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-amber-600 text-white'
                          )}
                        >
                          {auc.type === 'production'
                            ? 'Производство'
                            : auc.type === 'materials'
                              ? 'Закупка сырья'
                              : auc.type === 'collaboration'
                                ? 'Коллаборация'
                                : 'Услуги профи'}
                        </Badge>
                        {auc.influencerData && (
                          <Badge className="border-none bg-white/90 px-2 text-[8px] font-black uppercase tracking-widest text-slate-900 backdrop-blur-md">
                            ER: {auc.influencerData.er}%
                          </Badge>
                        )}
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                          {auc.brandName}
                        </p>
                        <h3 className="line-clamp-2 text-base font-black uppercase leading-tight tracking-tight">
                          {auc.title}
                        </h3>
                      </div>
                    </div>

                    <CardContent className="flex-1 space-y-6 p-4">
                      {auc.type === 'collaboration' ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Users className="h-3 w-3" />{' '}
                              {auc.influencerData?.followers.toLocaleString('ru-RU')} подп.
                            </span>
                            <span className="h-1 w-1 rounded-full bg-slate-200" />
                            <span className="flex items-center gap-1.5 text-indigo-600">
                              <Zap className="h-3 w-3 fill-current" />{' '}
                              {auc.influencerData?.realAudienceScore}% live
                            </span>
                          </div>

                          <p className="line-clamp-3 text-xs font-medium italic leading-relaxed text-slate-500">
                            "{auc.description}"
                          </p>

                          <div className="space-y-3 rounded-2xl border border-purple-100/50 bg-purple-50/50 p-4">
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-purple-600">
                              <Brain className="h-3.5 w-3.5" /> AI Match Analysis
                            </div>
                            <p className="text-[10px] font-bold leading-relaxed text-slate-600">
                              {auc.aiSmartAdvisor?.matchAnalysis}
                            </p>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[8px] font-black uppercase text-slate-400">
                                Relevance Score
                              </span>
                              <span className="text-xs font-black text-purple-600">
                                {auc.aiSmartAdvisor?.relevanceScore}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="line-clamp-3 text-xs font-medium italic leading-relaxed text-slate-500">
                            "{auc.description}"
                          </p>

                          <div className="grid grid-cols-2 gap-3 border-t border-slate-50 pt-4">
                            <div className="space-y-1">
                              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                                Current Best Bid
                              </p>
                              <p className="text-sm font-black text-slate-900">
                                {bestBid
                                  ? `${bestBid.amount.toLocaleString('ru-RU')} ₽`
                                  : 'No Bids'}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                                Target Volume
                              </p>
                              <p className="text-sm font-black text-slate-900">
                                {auc.targetQuantity?.toLocaleString('ru-RU')} ед.
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {auc.type !== 'collaboration' && (
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-300" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {auc.bids.length} Participants
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-rose-500">
                            <Clock className="h-4 w-4 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              2d 14h left
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button
                        asChild
                        className={cn(
                          'group h-10 w-full rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all',
                          auc.type === 'collaboration'
                            ? 'bg-purple-600 shadow-purple-900/10 hover:bg-purple-700'
                            : 'bg-slate-900 shadow-slate-900/10 hover:bg-black'
                        )}
                      >
                        <Link href={`/auctions/${auc.id}`}>
                          {auc.type === 'collaboration'
                            ? 'Обсудить коллаборацию'
                            : 'Сделать ставку'}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredAuctions.length === 0 && (
          <div className="space-y-6 py-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-10 w-10 text-slate-300" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-black uppercase tracking-tight text-slate-900">
                Ничего не найдено
              </h4>
              <p className="font-medium text-slate-400">
                Попробуйте изменить параметры фильтрации или поисковый запрос.
              </p>
            </div>
            <Button
              variant="outline"
              className="h-12 rounded-xl"
              onClick={() => {
                setSearchQuery('');
                setActiveType('all');
                setActiveStatus('all');
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}

        {/* CTA Banner for Partners */}
        <Card className="relative overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-2xl">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Factory className="h-64 w-64 rotate-12" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <Badge className="border-none bg-accent px-3 text-[10px] font-black uppercase tracking-widest text-white">
              For Manufacturers & Suppliers
            </Badge>
            <h2 className="text-sm font-black uppercase leading-tight tracking-tighter md:text-sm">
              Ваши мощности простаивают?
            </h2>
            <p className="text-sm font-bold leading-relaxed text-white/60">
              Присоединяйтесь к экосистеме Syntha в качестве партнера. Получайте доступ к заказам от
              ведущих брендов, используйте AI для оценки своих ставок и растите вместе с нами.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="h-12 rounded-2xl bg-accent px-10 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-accent/20 transition-all">
                Стать партнером
              </Button>
              <Button
                variant="ghost"
                className="h-12 rounded-2xl border border-white/10 px-10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5"
              >
                Как это работает
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
