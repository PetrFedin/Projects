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
import { ROUTES } from '@/lib/routes';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

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
      departed: { label: 'Отправлен', color: 'bg-bg-surface2 text-text-secondary' },
      at_sea: {
        label: 'В пути (Море)',
        color: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
      },
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
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16 duration-700 animate-in fade-in">
      <RegistryPageHeader
        eyebrow={
          <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
            <Truck className="h-2.5 w-2.5" />
            <span>Inventory Logistics Node</span>
          </div>
        }
        title="Shadow Inventory"
        leadPlain="Продажа товаров в пути и отслеживание грузов от фабрик до склада. Связь с Production (PO), B2B-заказами и приёмкой на Warehouse. Sell-in-transit для ранних продаж."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Truck className="size-6 shrink-0 text-muted-foreground" aria-hidden />
            <Badge variant="outline" className="text-[9px]">
              Production → PO
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              B2B → заказы
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Warehouse
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.warehouse}>Warehouse</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.logisticsDutyCalculator}>Duty Calc</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.logisticsConsolidation}>Consolidation</Link>
            </Button>
            <div className="bg-bg-surface2 border-border-default flex items-center gap-2 rounded-xl border p-1 shadow-inner">
              <Button
                variant="ghost"
                size="sm"
                className="text-text-secondary border-border-default hover:text-accent-primary h-7 rounded-lg border bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
              >
                <Globe className="mr-1.5 h-3 w-3" /> Global Track
              </Button>
              <Button className="bg-text-primary hover:bg-text-primary/90 h-7 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all">
                <Filter className="mr-1.5 h-3 w-3" /> Filter
              </Button>
            </div>
          </div>
        }
      />

      {/* Analytics Row — Compact & Normalized */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: 'Total In-Transit',
            value: calculateTotalInTransit(shipments).toLocaleString(),
            icon: Box,
            color: 'text-text-primary',
            bg: 'bg-bg-surface2/80',
          },
          {
            label: 'ATP Shadow Stock',
            value: '700',
            icon: Zap,
            color: 'text-accent-primary',
            bg: 'bg-accent-primary/10',
          },
          {
            label: 'Active Shipments',
            value: shipments.length,
            icon: Ship,
            color: 'text-blue-600',
            bg: 'bg-blue-50/50',
          },
          {
            label: 'Next Arrival',
            value: '3 Days',
            icon: Timer,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50/50',
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-border-subtle hover:border-accent-primary/20 group relative overflow-hidden rounded-xl border bg-white p-3.5 shadow-sm transition-all"
          >
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-[0.15em]">
                {stat.label}
              </span>
              <div
                className={cn(
                  'border-border-default/50 rounded-lg border p-1.5 shadow-inner',
                  stat.bg
                )}
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
          <Card className="border-border-subtle overflow-hidden rounded-2xl border bg-white shadow-sm">
            <CardHeader className="border-border-subtle bg-bg-surface2/30 flex flex-row items-center justify-between border-b p-3">
              <CardTitle className="text-sm font-black uppercase tracking-tight">
                In-Transit Shipments
              </CardTitle>
              <div className="relative">
                <Search className="text-text-muted absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
                <Input
                  placeholder="Filter shipments..."
                  className="border-border-default h-8 w-48 rounded-lg bg-white pl-9 text-[10px] font-bold uppercase"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white">
                  <TableRow className="border-border-subtle border-b hover:bg-transparent">
                    <TableHead className="h-10 pl-6 text-[9px] font-black uppercase tracking-wider">
                      Shipment ID / Route
                    </TableHead>
                    <TableHead className="h-10 text-[9px] font-black uppercase tracking-wider">
                      Status / ETA
                    </TableHead>
                    <TableHead className="h-10 text-[9px] font-black uppercase tracking-wider">
                      Items (Shadow)
                    </TableHead>
                    <TableHead className="h-10 text-center text-[9px] font-black uppercase tracking-wider">
                      Sell In Transit
                    </TableHead>
                    <TableHead className="h-10 pr-6 text-right text-[9px] font-black uppercase tracking-wider">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((ship) => (
                    <TableRow
                      key={ship.id}
                      className="hover:bg-bg-surface2/80 border-border-subtle group border-b transition-colors last:border-0"
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="space-y-1">
                          <p className="text-text-primary text-[11px] font-black uppercase">
                            {ship.id}
                          </p>
                          <div className="text-text-muted flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest">
                            <span>{ship.origin.split(',')[1]}</span>
                            <ArrowRight className="h-2 w-2" />
                            <span>{ship.destination.split(',')[1]}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          {getStatusBadge(ship.status)}
                          <div className="text-text-secondary flex items-center gap-1.5 text-[9px] font-bold uppercase">
                            <Calendar className="h-2.5 w-2.5" />
                            {ship.estimatedArrival}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-text-primary text-xs font-black">
                            {ship.items.reduce((s, i) => s + i.qty, 0)} units
                          </p>
                          <p className="text-accent-primary text-[8px] font-black uppercase tracking-tight">
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
                              ship.sellableInTransit ? 'text-accent-primary' : 'text-text-muted'
                            )}
                          >
                            {ship.sellableInTransit ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 h-7 w-7 rounded-lg transition-all"
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
          <Card className="border-text-primary/30 bg-text-primary hover:border-accent-primary/30 group rounded-2xl border p-3 text-white shadow-lg transition-all">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-inner transition-transform group-hover:scale-105">
                <TrendingUp className="w-4.5 h-4.5 text-accent-primary" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-tight">
                  Revenue Pull-Forward
                </h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                  Shadow Selling Insight
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center shadow-inner transition-colors group-hover:bg-white/10">
                <p className="mb-1 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
                  Pre-Sold in Transit
                </p>
                <p className="text-sm font-black tabular-nums">$42,500</p>
              </div>

              <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/60">
                    Transit Sell-Through
                  </span>
                  <span className="text-accent-primary text-xs font-black tabular-nums">14.2%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10 shadow-inner">
                  <div
                    className="bg-accent-primary h-full rounded-full transition-all duration-1000"
                    style={{ width: '14.2%' }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-5 border-t border-white/5 pt-4 text-[9px] font-medium italic leading-relaxed text-white/30">
              "Shadow Selling" allows pre-orders for incoming goods, reducing cash flow gaps by
              14-20 days.
            </p>
          </Card>

          <Card className="border-border-subtle group space-y-5 rounded-2xl border bg-white p-3 shadow-sm transition-all hover:border-amber-100">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 shadow-sm transition-transform group-hover:scale-105">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
              </div>
              <h3 className="text-text-primary text-xs font-black uppercase tracking-tight">
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
                  className="border-border-subtle hover:bg-bg-surface2/80 flex items-center justify-between rounded-lg border-b px-1 py-2.5 transition-colors last:border-0"
                >
                  <span className="text-text-muted text-[9px] font-black uppercase tracking-wider">
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
              className="border-border-default hover:bg-text-primary/90 hover:border-text-primary h-9 w-full rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-all hover:text-white"
            >
              Analyze Supply Chain
            </Button>
          </Card>
        </div>
      </div>
    </RegistryPageShell>
  );
}
