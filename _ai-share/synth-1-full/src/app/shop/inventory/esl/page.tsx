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
<<<<<<< HEAD
=======
import { RegistryPageShell } from '@/components/design-system';
>>>>>>> recover/cabinet-wip-from-stash
import {
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  BatteryMedium,
  RefreshCcw,
  Tag,
  Search,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Zap,
  Cpu,
  Smartphone,
  Globe,
  Monitor,
  Settings2,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { ESLDevice } from '@/lib/types/retail';
import { MOCK_ESL_DEVICES, getBatteryStatus } from '@/lib/logic/esl-utils';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/**
 * Dynamic ESL Sync Page — Shop OS
 * Управление электронными ценниками в торговом зале.
 */

export default function ESLManagementPage() {
  const [devices, setDevices] = useState<ESLDevice[]>(MOCK_ESL_DEVICES);
  const [updating, setUpdating] = useState<string | null>(null);

  const syncAll = () => {
    setUpdating('all');
    setTimeout(() => setUpdating(null), 2000);
  };

  const getBatteryIcon = (level: number) => {
    const status = getBatteryStatus(level);
    if (status === 'critical')
      return <BatteryLow className="h-4 w-4 animate-pulse text-rose-500" />;
    if (status === 'low') return <BatteryLow className="h-4 w-4 text-amber-500" />;
<<<<<<< HEAD
    if (status === 'normal') return <BatteryMedium className="h-4 w-4 text-slate-400" />;
=======
    if (status === 'normal') return <BatteryMedium className="text-text-muted h-4 w-4" />;
>>>>>>> recover/cabinet-wip-from-stash
    return <Battery className="h-4 w-4 text-emerald-500" />;
  };

  return (
<<<<<<< HEAD
    <div className="container mx-auto space-y-10 px-4 py-4">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
=======
    <RegistryPageShell className="max-w-5xl space-y-10">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="text-accent-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            <Tag className="h-3.5 w-3.5" />
            Retail Operations
          </div>
          <h1 className="font-headline text-sm font-black uppercase tracking-tighter">
            Dynamic ESL Sync
          </h1>
          <p className="font-medium text-muted-foreground">
            Синхронизация цен и акций с электронными ценниками в реальном времени.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase"
          >
            <Settings2 className="h-4 w-4" /> Gateway Config
          </Button>
          <Button
            onClick={syncAll}
            disabled={!!updating}
<<<<<<< HEAD
            className="h-11 gap-2 rounded-xl bg-indigo-600 px-6 text-[10px] font-black uppercase text-white shadow-lg shadow-indigo-200"
=======
            className="bg-accent-primary shadow-accent-primary/15 h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase text-white shadow-lg"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <RefreshCcw className={cn('h-4 w-4', updating === 'all' && 'animate-spin')} />
            Sync All Devices
          </Button>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: 'Total Devices', value: devices.length, status: 'Active' },
          {
            label: 'Online',
            value: devices.filter((d) => d.status === 'online').length,
            status: 'Healthy',
            color: 'text-emerald-500',
          },
          {
            label: 'Low Battery',
            value: devices.filter((d) => d.batteryLevel < 20).length,
            status: 'Requires Action',
            color: 'text-rose-500',
          },
          { label: 'Pending Updates', value: '0', status: 'All Synced' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-3xl border-none bg-white p-4 shadow-sm">
<<<<<<< HEAD
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {stat.label}
            </p>
            <p className={cn('mb-2 text-base font-black', stat.color)}>{stat.value}</p>
            <Badge variant="outline" className="border-slate-100 text-[8px] font-black uppercase">
=======
            <p className="text-text-muted mb-1 text-[10px] font-black uppercase tracking-widest">
              {stat.label}
            </p>
            <p className={cn('mb-2 text-base font-black', stat.color)}>{stat.value}</p>
            <Badge
              variant="outline"
              className="border-border-subtle text-[8px] font-black uppercase"
            >
>>>>>>> recover/cabinet-wip-from-stash
              {stat.status}
            </Badge>
          </Card>
        ))}
      </div>

      {/* Main Management Table */}
<<<<<<< HEAD
      <Card className="overflow-hidden rounded-xl border-none bg-white shadow-xl shadow-slate-200/50">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 p-4">
=======
      <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md shadow-xl">
        <CardHeader className="border-border-subtle flex flex-row items-center justify-between border-b p-4">
>>>>>>> recover/cabinet-wip-from-stash
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight">
              Label Registry
            </CardTitle>
            <CardDescription>Устройства, привязанные к артикулам в торговом зале.</CardDescription>
          </div>
          <div className="flex gap-3">
            <div className="relative">
<<<<<<< HEAD
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
              <Input
                placeholder="Search SKU or ID..."
                className="h-10 w-64 rounded-xl border-slate-100 pl-9 text-xs"
=======
              <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search SKU or ID..."
                className="border-border-subtle h-10 w-64 rounded-xl pl-9 text-xs"
>>>>>>> recover/cabinet-wip-from-stash
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
              <Filter className="h-4 w-4" />
            </Button>
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
                <TableHead className="pl-8 text-[10px] font-black uppercase">
                  Device / SKU
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase">Product</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Display Price</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Power/Signal</TableHead>
                <TableHead className="pr-8 text-right text-[10px] font-black uppercase">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
<<<<<<< HEAD
                <TableRow key={device.id} className="group transition-colors hover:bg-slate-50/50">
                  <TableCell className="py-6 pl-8">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-900">{device.id}</p>
                      <code className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] text-indigo-600">
=======
                <TableRow
                  key={device.id}
                  className="hover:bg-bg-surface2/80 group transition-colors"
                >
                  <TableCell className="py-6 pl-8">
                    <div className="space-y-1">
                      <p className="text-text-primary text-xs font-black">{device.id}</p>
                      <code className="text-accent-primary bg-accent-primary/10 rounded px-1.5 py-0.5 font-mono text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                        {device.sku}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell>
<<<<<<< HEAD
                    <p className="text-sm font-black text-slate-900">{device.productName}</p>
                    <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
=======
                    <p className="text-text-primary text-sm font-black">{device.productName}</p>
                    <p className="text-text-muted text-[10px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      {device.location}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {device.promoPrice ? (
                        <>
                          <span className="text-sm font-black text-rose-500">
                            ${device.promoPrice}
                          </span>
<<<<<<< HEAD
                          <span className="text-xs font-bold text-slate-300 line-through">
=======
                          <span className="text-text-muted text-xs font-bold line-through">
>>>>>>> recover/cabinet-wip-from-stash
                            ${device.currentPrice}
                          </span>
                        </>
                      ) : (
<<<<<<< HEAD
                        <span className="text-sm font-black text-slate-900">
=======
                        <span className="text-text-primary text-sm font-black">
>>>>>>> recover/cabinet-wip-from-stash
                          ${device.currentPrice}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'h-2 w-2 rounded-full',
<<<<<<< HEAD
                          device.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'
                        )}
                      />
                      <span className="text-[10px] font-black uppercase text-slate-600">
=======
                          device.status === 'online' ? 'bg-emerald-500' : 'bg-border-default'
                        )}
                      />
                      <span className="text-text-secondary text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                        {device.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {getBatteryIcon(device.batteryLevel)}
<<<<<<< HEAD
                        <span className="text-[10px] font-bold text-slate-500">
=======
                        <span className="text-text-secondary text-[10px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                          {device.batteryLevel}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Wifi
                          className={cn(
                            'h-4 w-4',
<<<<<<< HEAD
                            device.signalStrength > 50 ? 'text-indigo-400' : 'text-slate-300'
                          )}
                        />
                        <span className="text-[10px] font-bold text-slate-500">
=======
                            device.signalStrength > 50 ? 'text-accent-primary' : 'text-text-muted'
                          )}
                        />
                        <span className="text-text-secondary text-[10px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                          {device.signalStrength}%
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
<<<<<<< HEAD
                      className="rounded-xl text-slate-300 hover:text-indigo-600"
=======
                      className="text-text-muted hover:text-accent-primary rounded-xl"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info Section */}
      <div className="grid gap-3 md:grid-cols-2">
<<<<<<< HEAD
        <Card className="group relative overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl shadow-slate-200/50">
          <div className="absolute -bottom-10 -right-10 opacity-10 transition-transform group-hover:scale-110">
            <Zap className="h-40 w-40 text-indigo-400" />
          </div>
          <div className="relative z-10 mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <Smartphone className="h-5 w-5 text-indigo-400" />
=======
        <Card className="bg-text-primary group relative overflow-hidden rounded-xl border-none p-4 text-white shadow-md shadow-xl">
          <div className="absolute -bottom-10 -right-10 opacity-10 transition-transform group-hover:scale-110">
            <Zap className="text-accent-primary h-40 w-40" />
          </div>
          <div className="relative z-10 mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <Smartphone className="text-accent-primary h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
            </div>
            <h3 className="text-sm font-black uppercase italic tracking-tight">
              Storefront Automation
            </h3>
          </div>
          <p className="relative z-10 mb-8 text-sm font-medium leading-relaxed text-white/60">
            Ценники автоматически переключаются в режим «PROMO», когда маркетинговый отдел запускает
            акцию в Brand OS. При сканировании QR-кода на ценнике клиент попадает в **Digital
            Product Passport** с историей вещи.
          </p>
<<<<<<< HEAD
          <Button className="relative z-10 h-10 rounded-xl border-none bg-indigo-600 px-6 text-[10px] font-black uppercase text-white">
=======
          <Button className="bg-accent-primary relative z-10 h-10 rounded-xl border-none px-6 text-[10px] font-black uppercase text-white">
>>>>>>> recover/cabinet-wip-from-stash
            View Automation Logs
          </Button>
        </Card>

<<<<<<< HEAD
        <Card className="space-y-6 rounded-xl border border-none border-slate-50 bg-white p-4 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
=======
        <Card className="border-border-subtle space-y-6 rounded-xl border border-none bg-white p-4 shadow-md shadow-xl">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h3 className="text-text-primary text-sm font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
              Sync Status
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Cloud Gateway', status: 'Operational', color: 'text-emerald-500' },
              {
                label: 'Local Base Station',
                status: 'Online (Showroom A)',
                color: 'text-emerald-500',
              },
<<<<<<< HEAD
              { label: 'Firmware Update', status: 'v2.4.1 (Stable)', color: 'text-slate-400' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-slate-50 py-2 last:border-0"
              >
                <span className="text-[10px] font-black uppercase text-slate-400">
=======
              { label: 'Firmware Update', status: 'v2.4.1 (Stable)', color: 'text-text-muted' },
            ].map((item, i) => (
              <div
                key={i}
                className="border-border-subtle flex items-center justify-between border-b py-2 last:border-0"
              >
                <span className="text-text-muted text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  {item.label}
                </span>
                <span className={cn('text-[10px] font-black uppercase', item.color)}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </RegistryPageShell>
  );
}
