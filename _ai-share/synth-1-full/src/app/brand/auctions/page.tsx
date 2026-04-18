'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
<<<<<<< HEAD
  Gavel,
=======
>>>>>>> recover/cabinet-wip-from-stash
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
  Eye,
  Trash2,
  ArrowRight,
  Filter,
  BarChart3,
  Bot,
  Brain,
  ShieldCheck,
  Zap,
  Target,
  History,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { mockAuctions } from '@/lib/auction-data';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAuctionLinks } from '@/lib/data/entity-links';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { ROUTES } from '@/lib/routes';

export default function BrandAuctionsPage() {
  const brandAuctions = mockAuctions.filter((a) => a.brandId === 'syntha');

  const priceForecasts = [
    { category: 'Пальто (Кашемир)', current: 4500, forecast: 4200, trend: 'down' },
    { category: 'Джинсы (Деним)', current: 1800, forecast: 1950, trend: 'up' },
    { category: 'Трикотаж', current: 2200, forecast: 2150, trend: 'stable' },
  ];

  const trustedPartners = [
    { name: 'Фабрика #1 (Москва)', score: 98, rating: 4.9, tags: ['Premium', 'Reliable'] },
    { name: 'Текстиль Плюс', score: 95, rating: 4.8, tags: ['Speed', 'Eco'] },
  ];

  return (
<<<<<<< HEAD
    <div className="min-h-screen space-y-10 bg-slate-50/50 p-4 font-sans md:p-4">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 shadow-lg shadow-slate-900/20">
              <Gavel className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">
              Auction Manager PRO v2.0
            </h2>
          </div>
          <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900">
            Управление закупками
          </h1>
        </div>
        <Button
          asChild
          className="group/btn hover:button-glimmer hover:button-professional flex h-10 min-w-[200px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-slate-900/10 transition-all duration-500 hover:border-black hover:bg-black hover:text-white hover:shadow-xl"
        >
          <Link href="/brand/auctions/new">
            <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover/btn:scale-110" />{' '}
            Создать новый тендер
          </Link>
        </Button>
      </div>
=======
    <RegistryPageShell className="bg-bg-surface2/80 w-full max-w-none space-y-10 pb-16 font-sans">
      <RegistryPageHeader
        title="Управление закупками"
        leadPlain="Auction Manager PRO v2.0 — тендеры и закупки бренда на платформе."
        actions={
          <Button
            asChild
            className="text-text-muted border-border-default group/btn shadow-text-primary/10 inline-flex h-10 items-center justify-center gap-2 rounded-2xl border bg-white px-6 text-[10px] font-black uppercase tracking-widest transition-all duration-500 hover:border-black hover:bg-black hover:text-white hover:shadow-xl"
          >
            <Link href={ROUTES.brand.auctionsNew}>
              <PlusCircle className="h-4 w-4 transition-transform group-hover/btn:scale-110" />{' '}
              Создать новый тендер
            </Link>
          </Button>
        }
      />
>>>>>>> recover/cabinet-wip-from-stash

      {/* Strategic Insights Widgets */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* AI Price Forecast */}
<<<<<<< HEAD
        <Card className="relative overflow-hidden rounded-xl border-none bg-slate-950 p-4 text-white shadow-2xl">
=======
        <Card className="bg-text-primary relative overflow-hidden rounded-xl border-none p-4 text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Bot className="h-32 w-32 rotate-12" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-black uppercase leading-none tracking-widest">
                AI Price Forecast
              </h3>
            </div>
            <div className="space-y-4">
              {priceForecasts.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4"
                >
                  <div>
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-white/40">
                      {f.category}
                    </p>
                    <p className="text-sm font-bold">
                      {f.forecast.toLocaleString('ru-RU')} ₽{' '}
                      <span className="text-[10px] font-medium text-white/20">/ unit</span>
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      'border-none px-2 text-[8px] font-black',
                      f.trend === 'down'
                        ? 'bg-green-500'
                        : f.trend === 'up'
                          ? 'bg-rose-500'
                          : 'bg-blue-500'
                    )}
                  >
                    {f.trend === 'down' ? '-7%' : f.trend === 'up' ? '+8%' : 'STABLE'}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-center text-[9px] font-bold uppercase italic tracking-widest text-white/30">
              Прогноз на основе 12,000 закрытых лотов
            </p>
          </div>
        </Card>

        {/* Trusted Partners */}
        <Card className="rounded-xl border-none bg-white p-4 shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
<<<<<<< HEAD
                <h3 className="text-sm font-black uppercase leading-none tracking-widest text-slate-900">
=======
                <h3 className="text-text-primary text-sm font-black uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Top Rated Partners
                </h3>
              </div>
              <Button variant="ghost" size="icon" className="text-text-muted h-8 w-8 rounded-full">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {trustedPartners.map((p, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="group flex cursor-pointer items-center gap-3 rounded-2xl p-2 transition-all hover:bg-slate-50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 font-black text-slate-400 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                    {p.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase tracking-tight text-slate-900">
=======
                  className="hover:bg-bg-surface2 group flex cursor-pointer items-center gap-3 rounded-2xl p-2 transition-all"
                >
                  <div className="bg-bg-surface2 text-text-muted group-hover:bg-text-primary/90 flex h-12 w-12 items-center justify-center rounded-xl font-black transition-colors group-hover:text-white">
                    {p.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary text-xs font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      {p.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-2.5 w-2.5 text-green-500" />
                        <span className="text-[9px] font-black uppercase text-green-600">
                          {p.score}% Reliability
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
<<<<<<< HEAD
                    className="border-slate-100 text-[8px] font-black uppercase tracking-widest"
=======
                    className="border-border-subtle text-[8px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    {p.rating}★
                  </Badge>
                </div>
              ))}
            </div>
<<<<<<< HEAD
            <Button className="mt-2 h-12 w-full rounded-xl border-none bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-100">
=======
            <Button className="bg-bg-surface2 text-text-primary hover:bg-bg-surface2 mt-2 h-12 w-full rounded-xl border-none text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Весь каталог производств
            </Button>
          </div>
        </Card>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 gap-3">
          <Card className="group flex items-center justify-between overflow-hidden rounded-xl border-none bg-white p-4 shadow-lg">
            <div>
<<<<<<< HEAD
              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Active Tenders
              </p>
              <h3 className="text-base font-black tracking-tighter text-slate-900">
                {brandAuctions.length}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 transition-transform group-hover:scale-110">
              <Zap className="h-6 w-6 text-indigo-600" />
=======
              <p className="text-text-muted mb-1 text-[10px] font-black uppercase tracking-[0.2em]">
                Active Tenders
              </p>
              <h3 className="text-text-primary text-base font-black tracking-tighter">
                {brandAuctions.length}
              </h3>
            </div>
            <div className="bg-accent-primary/10 flex h-10 w-10 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
              <Zap className="text-accent-primary h-6 w-6" />
>>>>>>> recover/cabinet-wip-from-stash
            </div>
          </Card>
          <Card className="group flex items-center justify-between overflow-hidden rounded-xl border-none bg-white p-4 shadow-lg">
            <div>
<<<<<<< HEAD
              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
=======
              <p className="text-text-muted mb-1 text-[10px] font-black uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                Projected Savings
              </p>
              <h3 className="text-base font-black tracking-tighter text-green-500">14.2%</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 transition-transform group-hover:scale-110">
              <Target className="h-6 w-6 text-white" />
            </div>
          </Card>
        </div>
      </div>

      {/* Main Auctions Table */}
      <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
<<<<<<< HEAD
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 p-4">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-slate-400" />
=======
        <CardHeader className="border-border-subtle flex flex-row items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <Filter className="text-text-muted h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
            <CardTitle className="text-base font-black uppercase tracking-tight">
              Ваши активные запросы
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <div className="relative">
<<<<<<< HEAD
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Поиск по тендеру..."
                className="h-10 w-64 rounded-xl border-slate-100 pl-9 text-[10px] font-bold"
=======
              <Search className="text-text-muted absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
              <Input
                placeholder="Поиск по тендеру..."
                className="border-border-subtle h-10 w-64 rounded-xl pl-9 text-[10px] font-bold"
>>>>>>> recover/cabinet-wip-from-stash
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-bg-surface2/80">
              <TableRow className="border-none hover:bg-transparent">
<<<<<<< HEAD
                <TableHead className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Название / SKU
                </TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Статус
                </TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Заявки
                </TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Target Price
                </TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Best Bid
                </TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Прогноз экономии
                </TableHead>
                <TableHead className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
                <TableHead className="text-text-muted px-8 py-4 text-[10px] font-black uppercase tracking-widest">
                  Название / SKU
                </TableHead>
                <TableHead className="text-text-muted py-4 text-[10px] font-black uppercase tracking-widest">
                  Статус
                </TableHead>
                <TableHead className="text-text-muted py-4 text-[10px] font-black uppercase tracking-widest">
                  Заявки
                </TableHead>
                <TableHead className="text-text-muted py-4 text-[10px] font-black uppercase tracking-widest">
                  Target Price
                </TableHead>
                <TableHead className="text-text-muted py-4 text-[10px] font-black uppercase tracking-widest">
                  Best Bid
                </TableHead>
                <TableHead className="text-text-muted py-4 text-[10px] font-black uppercase tracking-widest">
                  Прогноз экономии
                </TableHead>
                <TableHead className="text-text-muted px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brandAuctions.map((auc) => {
                const bestBid =
                  auc.bids.length > 0
                    ? auc.bids.reduce((prev, curr) => (prev.amount < curr.amount ? prev : curr))
                    : null;
<<<<<<< HEAD
                const savings = bestBid
                  ? Math.round(((auc.targetPrice - bestBid.amount) / auc.targetPrice) * 100)
                  : 0;
=======
                const targetPrice = auc.targetPrice ?? 0;
                const savings =
                  bestBid && targetPrice > 0
                    ? Math.round(((targetPrice - bestBid.amount) / targetPrice) * 100)
                    : 0;
>>>>>>> recover/cabinet-wip-from-stash

                return (
                  <TableRow
                    key={auc.id}
<<<<<<< HEAD
                    className="border-b border-slate-50 transition-colors hover:bg-slate-50/30"
                  >
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100 shadow-sm">
=======
                    className="border-border-subtle hover:bg-bg-surface2/30 border-b transition-colors"
                  >
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="border-border-subtle relative h-10 w-12 shrink-0 overflow-hidden rounded-xl border shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
                          <Image
                            src={auc.image || ''}
                            alt={auc.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
<<<<<<< HEAD
                          <p className="font-bold uppercase tracking-tight text-slate-900">
                            {auc.title}
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
                          <p className="text-text-primary font-bold uppercase tracking-tight">
                            {auc.title}
                          </p>
                          <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                            {auc.category}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <Badge
                        className={cn(
                          'border-none px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest shadow-sm',
                          auc.status === 'active'
                            ? 'animate-pulse bg-green-500 text-white'
<<<<<<< HEAD
                            : 'bg-slate-200 text-slate-500'
=======
                            : 'bg-border-subtle text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      >
                        {auc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-2">
                        <Users className="text-text-muted h-3.5 w-3.5" />
                        <span className="text-text-primary text-sm font-bold">
                          {auc.bids.length}
                        </span>
                      </div>
                    </TableCell>
<<<<<<< HEAD
                    <TableCell className="py-6 text-sm font-bold text-slate-400">
                      {auc.targetPrice.toLocaleString('ru-RU')} ₽
=======
                    <TableCell className="text-text-muted py-6 text-sm font-bold">
                      {targetPrice > 0 ? `${targetPrice.toLocaleString('ru-RU')} ₽` : '—'}
>>>>>>> recover/cabinet-wip-from-stash
                    </TableCell>
                    <TableCell className="py-6">
                      {bestBid ? (
                        <div className="flex flex-col">
<<<<<<< HEAD
                          <span className="text-sm font-black text-slate-900">
                            {bestBid.amount.toLocaleString('ru-RU')} ₽
                          </span>
                          <span className="mt-1 text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
=======
                          <span className="text-text-primary text-sm font-black">
                            {bestBid.amount.toLocaleString('ru-RU')} ₽
                          </span>
                          <span className="text-text-muted mt-1 text-[8px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                            by {bestBid.bidderName}
                          </span>
                        </div>
                      ) : (
<<<<<<< HEAD
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
=======
                        <span className="text-text-muted text-xs font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          Нет заявок
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-6">
                      {savings > 0 ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-green-600">-{savings}%</span>
                          <Progress value={savings} className="bg-bg-surface2 h-1 w-12" />
                        </div>
                      ) : (
<<<<<<< HEAD
                        <span className="text-xs font-bold uppercase text-slate-300">...</span>
=======
                        <span className="text-text-muted text-xs font-bold uppercase">...</span>
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
<<<<<<< HEAD
                          className="h-10 w-10 rounded-xl hover:bg-slate-100"
                        >
                          <Link href={`/auctions/${auc.id}`}>
                            <Eye className="h-4 w-4 text-slate-400" />
=======
                          className="hover:bg-bg-surface2 h-10 w-10 rounded-xl"
                        >
                          <Link href={`/auctions/${auc.id}`}>
                            <Eye className="text-text-muted h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
<<<<<<< HEAD
                              className="h-10 w-10 rounded-xl hover:bg-slate-100"
                            >
                              <MoreHorizontal className="h-4 w-4 text-slate-400" />
=======
                              className="hover:bg-bg-surface2 h-10 w-10 rounded-xl"
                            >
                              <MoreHorizontal className="text-text-muted h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
<<<<<<< HEAD
                            className="w-48 rounded-2xl border-slate-100 p-2 shadow-2xl"
=======
                            className="border-border-subtle w-48 rounded-2xl p-2 shadow-2xl"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest">
                              Продлить срок
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest">
                              Изменить ТЗ
                            </DropdownMenuItem>
<<<<<<< HEAD
                            <DropdownMenuSeparator className="bg-slate-50" />
=======
                            <DropdownMenuSeparator className="bg-bg-surface2" />
>>>>>>> recover/cabinet-wip-from-stash
                            <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-500">
                              Отменить аукцион
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
<<<<<<< HEAD
        <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4 px-8">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-slate-400" />
            <span className="text-[9px] font-black uppercase italic tracking-widest text-slate-400">
=======
        <CardFooter className="bg-bg-surface2 border-border-subtle flex items-center justify-between border-t p-4 px-8">
          <div className="flex items-center gap-2">
            <History className="text-text-muted h-4 w-4" />
            <span className="text-text-muted text-[9px] font-black uppercase italic tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Последнее обновление системы: 5 минут назад
            </span>
          </div>
          <Button
            variant="ghost"
<<<<<<< HEAD
            className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900"
=======
            className="text-text-secondary hover:text-text-primary text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
          >
            Показать завершенные тендеры
          </Button>
        </CardFooter>
      </Card>

      <RelatedModulesBlock links={getAuctionLinks()} className="mt-6" />
    </RegistryPageShell>
  );
}
