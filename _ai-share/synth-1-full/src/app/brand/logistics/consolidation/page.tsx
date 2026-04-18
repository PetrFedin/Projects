'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Truck,
  Ship,
  Globe,
  Package,
  Clock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Zap,
  DollarSign,
  MapPin,
  Layers,
  Search,
  Users,
  Box,
  Share2,
  Calendar,
  Building2,
  Lock,
  History,
  Info,
  ExternalLink,
} from 'lucide-react';
import {
  CONSOLIDATION_POOL,
  findConsolidationMatches,
  calculateConsolidationSavings,
} from '@/lib/logic/consolidation-utils';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

/**
 * Smart Logistics Consolidation UI
 * Группировка грузов разных брендов для снижения расходов на логистику.
 */

export default function LogisticsConsolidationPage() {
  const [activeTab, setActiveTab] = useState<'pool' | 'my-requests' | 'history'>('pool');
  const [selectedMatches, setSelectedMatches] = useState<string[]>([]);

  // Simulation of current brand request
  const myRequest = {
    id: 'REQ-NEW',
    brandId: 'My Brand',
    origin: 'Shanghai, CN',
    destination: 'Moscow, RU',
    volume: 4.5,
    weight: 850,
    readyDate: '2026-03-21',
    status: 'pending' as const,
  };

  const matches = useMemo(() => findConsolidationMatches(myRequest), [myRequest]);
  const savings = useMemo(
    () =>
      calculateConsolidationSavings([
        ...matches.filter((m) => selectedMatches.includes(m.id)),
        myRequest,
      ]),
    [selectedMatches, matches, myRequest]
  );

  const toggleMatch = (id: string) => {
    setSelectedMatches((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  return (
<<<<<<< HEAD
    <div className="container mx-auto space-y-10 px-4 py-4">
      <SectionInfoCard
        title="Консолидация грузов"
        description="Объединение партий разных брендов для снижения логистических расходов. Связь с Production (отгрузки) и Duty Calculator. Pool грузов, заявки, история."
        icon={Ship}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Production → отгрузки
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Duty Calculator
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href="/brand/warehouse">Warehouse</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/logistics/duty-calculator">Duty Calc</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/logistics/shadow-inventory">Shadow Inventory</Link>
            </Button>
          </>
        }
      />
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
            <Ship className="h-3 w-3" />
            Smart Consolidation Hub
          </div>
          <h1 className="font-headline text-sm font-black uppercase tracking-tighter">
            Logistics Consolidation
          </h1>
          <p className="font-medium text-muted-foreground">
            Объединяйте грузы с другими брендами и экономьте до 35% на логистике.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase"
          >
            <History className="h-4 w-4" /> Архив грузов
          </Button>
          <Button className="h-11 gap-2 rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase text-white shadow-lg shadow-slate-200">
            <Plus className="h-4 w-4" /> Новый запрос на перевозку
          </Button>
        </div>
      </header>
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        eyebrow={
          <div className="text-accent-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Ship className="h-3 w-3" />
            Smart Consolidation Hub
          </div>
        }
        title="Консолидация грузов"
        leadPlain="Объединение партий разных брендов для снижения логистических расходов. Pool грузов, заявки, история; связь с Production, Duty Calculator и Shadow Inventory. До 35% экономии на логистике."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Ship className="size-6 shrink-0 text-muted-foreground" aria-hidden />
            <Badge variant="outline" className="text-[9px]">
              Production → отгрузки
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Duty Calculator
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.warehouse}>Warehouse</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.logisticsDutyCalculator}>Duty Calc</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.logisticsShadowInventory}>Shadow Inventory</Link>
            </Button>
            <Button
              variant="outline"
              className="h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase"
            >
              <History className="h-4 w-4" /> Архив грузов
            </Button>
            <Button className="bg-text-primary h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase text-white shadow-lg shadow-md">
              <Plus className="h-4 w-4" /> Новый запрос на перевозку
            </Button>
          </div>
        }
      />
>>>>>>> recover/cabinet-wip-from-stash

      {/* KPI Stats */}
      <div className="grid gap-3 md:grid-cols-4">
        {[
          {
            label: 'Доступно в пуле',
            value: CONSOLIDATION_POOL.length,
            icon: Box,
<<<<<<< HEAD
            color: 'text-slate-900',
=======
            color: 'text-text-primary',
>>>>>>> recover/cabinet-wip-from-stash
          },
          {
            label: 'Подходящие пары',
            value: matches.length,
            icon: Users,
<<<<<<< HEAD
            color: 'text-indigo-600',
=======
            color: 'text-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
          },
          {
            label: 'Потенциальная экономия',
            value: `$${savings.estimatedSavings.toLocaleString()}`,
            icon: TrendingUp,
            color: 'text-emerald-600',
          },
          {
            label: 'Ваш объем (CBM)',
            value: myRequest.volume,
            icon: Layers,
<<<<<<< HEAD
            color: 'text-slate-400',
=======
            color: 'text-text-muted',
>>>>>>> recover/cabinet-wip-from-stash
          },
        ].map((stat, i) => (
          <Card key={i} className="rounded-3xl border-none bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-3">
<<<<<<< HEAD
              <div className="rounded-xl bg-slate-50 p-2">
                <stat.icon className="h-4 w-4 text-slate-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
              <div className="bg-bg-surface2 rounded-xl p-2">
                <stat.icon className="text-text-muted h-4 w-4" />
              </div>
              <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                {stat.label}
              </span>
            </div>
            <p className={`text-sm font-black ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
<<<<<<< HEAD
          <Card className="overflow-hidden rounded-xl border-none shadow-xl shadow-slate-200/50">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 p-4">
=======
          <Card className="overflow-hidden rounded-xl border-none shadow-md shadow-xl">
            <CardHeader className="border-border-subtle flex flex-row items-center justify-between border-b p-4">
>>>>>>> recover/cabinet-wip-from-stash
              <div>
                <CardTitle className="text-base font-black uppercase tracking-tight">
                  Consolidation Pool
                </CardTitle>
                <CardDescription>Запросы от других брендов по вашим маршрутам.</CardDescription>
              </div>
              <div className="relative">
<<<<<<< HEAD
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                <Input
                  placeholder="Фильтр по городу / дате"
                  className="h-10 w-64 rounded-xl border-slate-100 pl-9 text-xs"
=======
                <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Фильтр по городу / дате"
                  className="border-border-subtle h-10 w-64 rounded-xl pl-9 text-xs"
>>>>>>> recover/cabinet-wip-from-stash
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
<<<<<<< HEAD
                <TableHeader className="bg-slate-50/50">
=======
                <TableHeader className="bg-bg-surface2/80">
>>>>>>> recover/cabinet-wip-from-stash
                  <TableRow>
                    <TableHead className="pl-8 text-[10px] font-black uppercase">Выбрать</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">
                      Маршрут (Откуда - Куда)
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase">
                      Параметры (CBM/KG)
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase">
                      Дата готовности
                    </TableHead>
                    <TableHead className="pr-8 text-right text-[10px] font-black uppercase">
                      Действие
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center">
                        <div className="space-y-4">
<<<<<<< HEAD
                          <Ship className="mx-auto h-12 w-12 text-slate-100" />
                          <p className="text-sm font-bold uppercase italic tracking-widest text-slate-400">
=======
                          <Ship className="text-text-inverse mx-auto h-12 w-12" />
                          <p className="text-text-muted text-sm font-bold uppercase italic tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                            Пока нет подходящих пар для консолидации
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    matches.map((req) => (
                      <TableRow
                        key={req.id}
                        className={cn(
<<<<<<< HEAD
                          'transition-colors hover:bg-slate-50/50',
                          selectedMatches.includes(req.id) && 'bg-indigo-50/30'
=======
                          'hover:bg-bg-surface2/80 transition-colors',
                          selectedMatches.includes(req.id) && 'bg-accent-primary/10'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      >
                        <TableCell className="py-6 pl-8">
                          <input
                            type="checkbox"
                            checked={selectedMatches.includes(req.id)}
                            onChange={() => toggleMatch(req.id)}
<<<<<<< HEAD
                            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
=======
                            className="border-border-default text-accent-primary focus:ring-accent-primary h-4 w-4 cursor-pointer rounded"
>>>>>>> recover/cabinet-wip-from-stash
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
<<<<<<< HEAD
                              <span className="text-xs font-black text-slate-900">
                                {req.origin}
                              </span>
                              <span className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                Destination: {req.destination}
                              </span>
                            </div>
                            <ArrowRight className="h-3 w-3 text-slate-300" />
                            <span className="text-xs font-black text-slate-900">
=======
                              <span className="text-text-primary text-xs font-black">
                                {req.origin}
                              </span>
                              <span className="text-text-muted mt-0.5 text-[9px] font-bold uppercase tracking-widest">
                                Destination: {req.destination}
                              </span>
                            </div>
                            <ArrowRight className="text-text-muted h-3 w-3" />
                            <span className="text-text-primary text-xs font-black">
>>>>>>> recover/cabinet-wip-from-stash
                              {req.destination}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
<<<<<<< HEAD
                              className="border-slate-100 bg-slate-50 text-[8px] font-black uppercase"
=======
                              className="bg-bg-surface2 border-border-subtle text-[8px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              {req.volume} CBM
                            </Badge>
                            <Badge
                              variant="outline"
<<<<<<< HEAD
                              className="border-slate-100 bg-slate-50 text-[8px] font-black uppercase"
=======
                              className="bg-bg-surface2 border-border-subtle text-[8px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              {req.weight} KG
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span className="font-mono text-xs font-medium text-slate-600">
=======
                            <Calendar className="text-text-muted h-3 w-3" />
                            <span className="text-text-secondary font-mono text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                              {new Date(req.readyDate).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="pr-8 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
<<<<<<< HEAD
                            className="h-8 w-8 text-slate-300 hover:text-indigo-600"
=======
                            className="text-text-muted hover:text-accent-primary h-8 w-8"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="relative overflow-hidden rounded-xl border-none bg-emerald-600 p-3 text-white shadow-2xl shadow-emerald-100">
            <div className="absolute right-0 top-0 h-48 w-48 -translate-y-24 translate-x-24 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 rounded-full bg-emerald-400/20 blur-2xl" />

            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight">
                    Consolidation Savings
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    ЭКОНОМИЯ ПРИ ОБЪЕДИНЕНИИ ГРУЗОВ
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-base font-black tracking-tighter">
                  ${savings.estimatedSavings.toFixed(0)}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                  ESTIMATED LOGISTICS SAVINGS (USD)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    Total Volume
                  </p>
                  <p className="text-sm font-black text-white">{savings.totalCBM.toFixed(1)} CBM</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    Selected Brands
                  </p>
                  <p className="text-sm font-black text-emerald-200">
                    {selectedMatches.length + 1}
                  </p>
                </div>
              </div>

              <Button
                disabled={selectedMatches.length === 0}
                className="h-10 w-full rounded-2xl border-none bg-white text-[10px] font-black uppercase text-emerald-600 shadow-lg shadow-emerald-700/20 hover:bg-emerald-50 disabled:opacity-50"
              >
                Отправить запрос на объединение
              </Button>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="rounded-xl border-none p-4 shadow-xl shadow-slate-200/50">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
=======
          <Card className="rounded-xl border-none p-4 shadow-md shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-2xl">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-text-primary text-sm font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                Why Consolidate?
              </h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Lower Freight Cost',
                  desc: 'LCL (Less than Container Load) rates are higher than shared containers.',
                },
                {
                  title: 'Faster Clearance',
                  desc: 'Consolidated shipments often get prioritized by logistics agents.',
                },
                {
                  title: 'ESG Benefits',
                  desc: 'Reduced carbon footprint by optimizing shipping space.',
                },
              ].map((benefit, i) => (
                <div key={i} className="space-y-1">
<<<<<<< HEAD
                  <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">
                    {benefit.title}
                  </p>
                  <p className="text-[10px] font-medium leading-relaxed text-slate-400">
=======
                  <p className="text-text-primary text-[11px] font-black uppercase tracking-tight">
                    {benefit.title}
                  </p>
                  <p className="text-text-muted text-[10px] font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <div className="mt-8 border-t border-slate-50 pt-8">
              <Button
                variant="ghost"
                className="h-10 w-full gap-2 rounded-xl text-[9px] font-black uppercase text-indigo-600 hover:bg-indigo-50"
=======
            <div className="border-border-subtle mt-8 border-t pt-8">
              <Button
                variant="ghost"
                className="text-accent-primary hover:bg-accent-primary/10 h-10 w-full gap-2 rounded-xl text-[9px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Learn More About Hub <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </RegistryPageShell>
  );
}
