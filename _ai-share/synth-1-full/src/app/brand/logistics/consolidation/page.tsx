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

      {/* KPI Stats */}
      <div className="grid gap-3 md:grid-cols-4">
        {[
          {
            label: 'Доступно в пуле',
            value: CONSOLIDATION_POOL.length,
            icon: Box,
            color: 'text-text-primary',
          },
          {
            label: 'Подходящие пары',
            value: matches.length,
            icon: Users,
            color: 'text-accent-primary',
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
            color: 'text-text-muted',
          },
        ].map((stat, i) => (
          <Card key={i} className="rounded-3xl border-none bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-3">
              <div className="bg-bg-surface2 rounded-xl p-2">
                <stat.icon className="text-text-muted h-4 w-4" />
              </div>
              <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
            <p className={`text-sm font-black ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden rounded-xl border-none shadow-md shadow-xl">
            <CardHeader className="border-border-subtle flex flex-row items-center justify-between border-b p-4">
              <div>
                <CardTitle className="text-base font-black uppercase tracking-tight">
                  Consolidation Pool
                </CardTitle>
                <CardDescription>Запросы от других брендов по вашим маршрутам.</CardDescription>
              </div>
              <div className="relative">
                <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Фильтр по городу / дате"
                  className="border-border-subtle h-10 w-64 rounded-xl pl-9 text-xs"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-bg-surface2/80">
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
                          <Ship className="text-text-inverse mx-auto h-12 w-12" />
                          <p className="text-text-muted text-sm font-bold uppercase italic tracking-widest">
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
                          'hover:bg-bg-surface2/80 transition-colors',
                          selectedMatches.includes(req.id) && 'bg-accent-primary/10'
                        )}
                      >
                        <TableCell className="py-6 pl-8">
                          <input
                            type="checkbox"
                            checked={selectedMatches.includes(req.id)}
                            onChange={() => toggleMatch(req.id)}
                            className="border-border-default text-accent-primary focus:ring-accent-primary h-4 w-4 cursor-pointer rounded"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <span className="text-text-primary text-xs font-black">
                                {req.origin}
                              </span>
                              <span className="text-text-muted mt-0.5 text-[9px] font-bold uppercase tracking-widest">
                                Destination: {req.destination}
                              </span>
                            </div>
                            <ArrowRight className="text-text-muted h-3 w-3" />
                            <span className="text-text-primary text-xs font-black">
                              {req.destination}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className="bg-bg-surface2 border-border-subtle text-[8px] font-black uppercase"
                            >
                              {req.volume} CBM
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-bg-surface2 border-border-subtle text-[8px] font-black uppercase"
                            >
                              {req.weight} KG
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="text-text-muted h-3 w-3" />
                            <span className="text-text-secondary font-mono text-xs font-medium">
                              {new Date(req.readyDate).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="pr-8 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-text-muted hover:text-accent-primary h-8 w-8"
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

          <Card className="rounded-xl border-none p-4 shadow-md shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-2xl">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-text-primary text-sm font-black uppercase tracking-tight">
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
                  <p className="text-text-primary text-[11px] font-black uppercase tracking-tight">
                    {benefit.title}
                  </p>
                  <p className="text-text-muted text-[10px] font-medium leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-border-subtle mt-8 border-t pt-8">
              <Button
                variant="ghost"
                className="text-accent-primary hover:bg-accent-primary/10 h-10 w-full gap-2 rounded-xl text-[9px] font-black uppercase"
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
