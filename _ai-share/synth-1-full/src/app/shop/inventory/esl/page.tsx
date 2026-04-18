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
import { RegistryPageShell } from '@/components/design-system';
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
    if (status === 'normal') return <BatteryMedium className="text-text-muted h-4 w-4" />;
    return <Battery className="h-4 w-4 text-emerald-500" />;
  };

  return (
    <RegistryPageShell className="max-w-5xl space-y-10">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="text-accent-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
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
            className="bg-accent-primary shadow-accent-primary/15 h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase text-white shadow-lg"
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
            <p className="text-text-muted mb-1 text-[10px] font-black uppercase tracking-widest">
              {stat.label}
            </p>
            <p className={cn('mb-2 text-base font-black', stat.color)}>{stat.value}</p>
            <Badge
              variant="outline"
              className="border-border-subtle text-[8px] font-black uppercase"
            >
              {stat.status}
            </Badge>
          </Card>
        ))}
      </div>

      {/* Main Management Table */}
      <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md shadow-xl">
        <CardHeader className="border-border-subtle flex flex-row items-center justify-between border-b p-4">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight">
              Label Registry
            </CardTitle>
            <CardDescription>Устройства, привязанные к артикулам в торговом зале.</CardDescription>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search SKU or ID..."
                className="border-border-subtle h-10 w-64 rounded-xl pl-9 text-xs"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-bg-surface2/80">
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
                <TableRow
                  key={device.id}
                  className="hover:bg-bg-surface2/80 group transition-colors"
                >
                  <TableCell className="py-6 pl-8">
                    <div className="space-y-1">
                      <p className="text-text-primary text-xs font-black">{device.id}</p>
                      <code className="text-accent-primary bg-accent-primary/10 rounded px-1.5 py-0.5 font-mono text-[10px]">
                        {device.sku}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-text-primary text-sm font-black">{device.productName}</p>
                    <p className="text-text-muted text-[10px] font-bold uppercase tracking-tight">
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
                          <span className="text-text-muted text-xs font-bold line-through">
                            ${device.currentPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-text-primary text-sm font-black">
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
                          device.status === 'online' ? 'bg-emerald-500' : 'bg-border-default'
                        )}
                      />
                      <span className="text-text-secondary text-[10px] font-black uppercase">
                        {device.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {getBatteryIcon(device.batteryLevel)}
                        <span className="text-text-secondary text-[10px] font-bold">
                          {device.batteryLevel}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Wifi
                          className={cn(
                            'h-4 w-4',
                            device.signalStrength > 50 ? 'text-accent-primary' : 'text-text-muted'
                          )}
                        />
                        <span className="text-text-secondary text-[10px] font-bold">
                          {device.signalStrength}%
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-text-muted hover:text-accent-primary rounded-xl"
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
        <Card className="bg-text-primary group relative overflow-hidden rounded-xl border-none p-4 text-white shadow-md shadow-xl">
          <div className="absolute -bottom-10 -right-10 opacity-10 transition-transform group-hover:scale-110">
            <Zap className="text-accent-primary h-40 w-40" />
          </div>
          <div className="relative z-10 mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <Smartphone className="text-accent-primary h-5 w-5" />
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
          <Button className="bg-accent-primary relative z-10 h-10 rounded-xl border-none px-6 text-[10px] font-black uppercase text-white">
            View Automation Logs
          </Button>
        </Card>

        <Card className="border-border-subtle space-y-6 rounded-xl border border-none bg-white p-4 shadow-md shadow-xl">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h3 className="text-text-primary text-sm font-black uppercase tracking-tight">
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
              { label: 'Firmware Update', status: 'v2.4.1 (Stable)', color: 'text-text-muted' },
            ].map((item, i) => (
              <div
                key={i}
                className="border-border-subtle flex items-center justify-between border-b py-2 last:border-0"
              >
                <span className="text-text-muted text-[10px] font-black uppercase">
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
