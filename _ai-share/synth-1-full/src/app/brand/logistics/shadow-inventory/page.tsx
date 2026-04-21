'use client';

import React, { useState } from 'react';
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
  Plane,
  Box,
  Search,
  Filter,
  ArrowRight,
  Timer,
  MapPin,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Globe,
  Anchor,
  TrendingUp,
  ShoppingCart,
  SwitchCamera,
  Calendar,
} from 'lucide-react';
import { InTransitShipment } from '@/lib/types/logistics';
import { MOCK_SHIPMENTS, calculateTotalInTransit } from '@/lib/logic/logistics-utils';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';

/**
 * Shadow Inventory (Sell-in-Transit) — Brand OS
 * Учет и продажа товаров, находящихся в пути от фабрик.
 */

export default function ShadowInventoryPage() {
  const [shipments, setShipments] = useState<InTransitShipment[]>(MOCK_SHIPMENTS);

  const toggleSellable = (shipmentId: string) => {
    setShipments(
      shipments.map((s) =>
        s.id === shipmentId ? { ...s, sellableInTransit: !s.sellableInTransit } : s
      )
    );
  };

  const getStatusBadge = (status: InTransitShipment['status']) => {
    const config = {
      departed: { label: 'Отправлен', color: 'bg-slate-100 text-slate-600' },
      at_sea: { label: 'В пути (Море)', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
      customs: { label: 'Таможня', color: 'bg-amber-50 text-amber-600 border-amber-100' },
      last_mile: {
        label: 'Последняя миля',
        color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      },
      delivered: { label: 'Доставлен', color: 'bg-emerald-500 text-white' },
    };
    const item = config[status];
    return (
      <Badge
        variant="outline"
        className={cn('h-5 px-2 text-[8px] font-black uppercase', item.color)}
      >
        {item.label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-4 duration-700 animate-in fade-in">
      <SectionInfoCard
        title="Теневой инвентарь"
        description="Продажа товаров в пути. Отслеживание грузов от фабрик до склада. Связь с Production (PO), B2B (заказы) и Warehouse (приёмки). Sell-in-transit для ранних продаж."
        icon={Truck}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Production → PO
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              B2B → заказы
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Warehouse
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href="/brand/warehouse">Warehouse</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/logistics/duty-calculator">Duty Calc</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/logistics/consolidation">Consolidation</Link>
            </Button>
          </>
        }
      />
      <header className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <Truck className="h-2.5 w-2.5" />
            <span>Логистика склада</span>
          </div>
          <h1 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900">
            Теневой инвентарь
          </h1>
          <p className="mt-1 px-0.5 text-[11px] font-medium text-slate-500">
            Продажа в пути в реальном времени и распределение.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:text-indigo-600"
          >
            <Globe className="mr-1.5 h-3 w-3" /> Глобальный трек
          </Button>
          <Button className="h-7 rounded-lg bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-slate-800">
            <Filter className="mr-1.5 h-3 w-3" /> Фильтр
          </Button>
        </div>
      </header>

      {/* Analytics Row — Compact & Normalized */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: 'В пути (всего)',
            value: calculateTotalInTransit(shipments).toLocaleString(),
            icon: Box,
            color: 'text-slate-900',
            bg: 'bg-slate-50/50',
          },
          {
            label: 'Теневой остаток (ATP)',
            value: '700',
            icon: Zap,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50/50',
          },
          {
            label: 'Активные отгрузки',
            value: shipments.length,
            icon: Ship,
            color: 'text-blue-600',
            bg: 'bg-blue-50/50',
          },
          {
            label: 'Ближайшее прибытие',
            value: '3 дн.',
            icon: Timer,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50/50',
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-100"
          >
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400">
                {stat.label}
              </span>
              <div
                className={cn('rounded-lg border border-slate-200/50 p-1.5 shadow-inner', stat.bg)}
              >
                <stat.icon className={cn('h-3.5 w-3.5 transition-colors', stat.color)} />
              </div>
            </div>
            <p
              className={cn(
                'text-sm font-black tabular-nums leading-none tracking-tighter',
                stat.color
              )}
            >
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-2 grid gap-3 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30 p-3">
              <CardTitle className="text-sm font-black uppercase tracking-tight">
                Отгрузки в пути
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
                <Input
                  placeholder="Фильтр отгрузок…"
                  className="h-8 w-48 rounded-lg border-slate-200 bg-white pl-9 text-[10px] font-bold uppercase"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white">
                  <TableRow className="border-b border-slate-50 hover:bg-transparent">
                    <TableHead className="h-10 pl-6 text-[9px] font-black uppercase tracking-wider">
                      ID / маршрут
                    </TableHead>
                    <TableHead className="h-10 text-[9px] font-black uppercase tracking-wider">
                      Статус / ETA
                    </TableHead>
                    <TableHead className="h-10 text-[9px] font-black uppercase tracking-wider">
                      Позиции (тень)
                    </TableHead>
                    <TableHead className="h-10 text-center text-[9px] font-black uppercase tracking-wider">
                      Продажа в пути
                    </TableHead>
                    <TableHead className="h-10 pr-6 text-right text-[9px] font-black uppercase tracking-wider">
                      Действие
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((ship) => (
                    <TableRow
                      key={ship.id}
                      className="group border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/50"
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="space-y-1">
                          <p className="text-[11px] font-black uppercase text-slate-900">
                            {ship.id}
                          </p>
                          <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                            <span>{ship.origin.split(',')[1]}</span>
                            <ArrowRight className="h-2 w-2" />
                            <span>{ship.destination.split(',')[1]}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          {getStatusBadge(ship.status)}
                          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-slate-500">
                            <Calendar className="h-2.5 w-2.5" />
                            {ship.estimatedArrival}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs font-black text-slate-900">
                            {ship.items.reduce((s, i) => s + i.qty, 0)} шт.
                          </p>
                          <p className="text-[8px] font-black uppercase tracking-tight text-indigo-600">
                            {ship.items.length} SKUs
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <Switch
                            checked={ship.sellableInTransit}
                            onCheckedChange={() => toggleSellable(ship.id)}
                            className="scale-75"
                          />
                          <span
                            className={cn(
                              'text-[7px] font-black uppercase tracking-widest',
                              ship.sellableInTransit ? 'text-indigo-600' : 'text-slate-300'
                            )}
                          >
                            {ship.sellableInTransit ? 'Вкл.' : 'Выкл.'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg text-slate-300 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <Card className="group rounded-2xl border border-slate-800 bg-slate-900 p-3 text-white shadow-lg transition-all hover:border-indigo-500/30">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-inner transition-transform group-hover:scale-105">
                <TrendingUp className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-tight">
                  Досрочная выручка
                </h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                  Инсайт по теневым продажам
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center shadow-inner transition-colors group-hover:bg-white/10">
                <p className="mb-1 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
                  Предпродано в пути
                </p>
                <p className="text-sm font-black tabular-nums">3 850 000 ₽</p>
              </div>

              <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/60">
                    Распродажа в транзите
                  </span>
                  <span className="text-xs font-black tabular-nums text-indigo-400">14.2%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10 shadow-inner">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-1000"
                    style={{ width: '14.2%' }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-5 border-t border-white/5 pt-4 text-[9px] font-medium italic leading-relaxed text-white/30">
              «Теневые продажи» позволяют предзаказы на входящие партии и сокращают разрыв по ДС на
              14–20 дней.
            </p>
          </Card>

          <Card className="group space-y-5 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-amber-100">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 shadow-sm transition-transform group-hover:scale-105">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-tight text-slate-900">
                Transit Risks
              </h3>
            </div>

            <div className="space-y-1">
              {[
                {
                  label: 'Port Congestion (Shenzhen)',
                  status: 'Moderate',
                  color: 'text-amber-500',
                },
                { label: 'Weather Delay (North Sea)', status: '+2 days', color: 'text-rose-500' },
                { label: 'Carrier Performance', status: '98% On-time', color: 'text-emerald-500' },
              ].map((risk, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border-b border-slate-50 px-1 py-2.5 transition-colors last:border-0 hover:bg-slate-50/50"
                >
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    {risk.label}
                  </span>
                  <span
                    className={cn('text-[9px] font-black uppercase tracking-tight', risk.color)}
                  >
                    {risk.status}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-full rounded-xl border-slate-200 text-[9px] font-black uppercase tracking-widest shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              Analyze Supply Chain
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
