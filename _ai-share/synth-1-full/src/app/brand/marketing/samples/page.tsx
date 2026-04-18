'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { ROUTES } from '@/lib/routes';
>>>>>>> recover/cabinet-wip-from-stash
import {
  Megaphone,
  Package,
  MapPin,
  Clock,
  QrCode,
  History,
  Plus,
  ArrowRightLeft,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  Camera,
  Layers,
  Truck,
  UserCircle,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { CollectionSample, SampleStatus } from '@/lib/types/samples';
import { cn } from '@/lib/utils';

import PRSampleReturns from '@/components/brand/marketing/pr-sample-returns';
import { ShowroomSampleTagDialog } from '@/components/brand/marketing/showroom-sample-tag-dialog';
import { RegistryPageShell } from '@/components/design-system';

/**
 * PR & Marketing Sample Control UI
 * RFID/QR учет перемещения образцов коллекции.
 */

export default function SampleControlPage() {
  const [samples, setSamples] = useState<CollectionSample[]>([
    {
      id: 'S-101',
      productId: 'P-502',
      sku: 'SKU-001-S',
      internalArticleCode: '100042',
      name: 'Silk Evening Dress',
      size: 'S',
      color: 'Midnight Blue',
      qrCode: 'QR-123456',
      status: 'with_stylist',
      currentLocation: 'Ivan Ivanov (Stylist)',
      condition: 'perfect',
      lastSeenAt: '2026-03-05T10:00:00Z',
      expectedReturnAt: '2026-03-10T18:00:00Z',
      history: [],
    },
    {
      id: 'S-102',
      productId: 'P-503',
      sku: 'SKU-002-M',
      name: 'Wool Oversized Coat',
      size: 'M',
      color: 'Camel',
      qrCode: 'QR-654321',
      status: 'in_stock',
      currentLocation: 'Main Showroom',
      condition: 'good',
      lastSeenAt: '2026-03-07T14:20:00Z',
      history: [],
    },
    {
      id: 'S-103',
      productId: 'P-504',
      sku: 'SKU-003-XS',
      name: 'Leather Bomber Jacket',
      size: 'XS',
      color: 'Black',
      qrCode: 'QR-987654',
      status: 'in_editorial',
      currentLocation: 'Vogue HQ',
      condition: 'perfect',
      lastSeenAt: '2026-03-01T09:00:00Z',
      expectedReturnAt: '2026-03-06T18:00:00Z', // Overdue
      history: [],
    },
  ]);

  const getStatusBadge = (status: SampleStatus) => {
    const config: Record<SampleStatus, { label: string; color: string }> = {
      in_stock: { label: 'В шоуруме', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
      with_stylist: {
        label: 'У стилиста',
<<<<<<< HEAD
        color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      },
      in_editorial: { label: 'В редакции', color: 'bg-amber-50 text-amber-600 border-amber-100' },
      in_transit: { label: 'В пути', color: 'bg-slate-50 text-slate-600 border-slate-100' },
      damaged: { label: 'Поврежден', color: 'bg-rose-50 text-rose-600 border-rose-100' },
      lost: { label: 'Утерян', color: 'bg-rose-900 text-white border-none' },
      archived: { label: 'Архив', color: 'bg-slate-900 text-white border-none' },
=======
        color: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
      },
      in_editorial: { label: 'В редакции', color: 'bg-amber-50 text-amber-600 border-amber-100' },
      in_transit: {
        label: 'В пути',
        color: 'bg-bg-surface2 text-text-secondary border-border-subtle',
      },
      damaged: { label: 'Поврежден', color: 'bg-rose-50 text-rose-600 border-rose-100' },
      lost: { label: 'Утерян', color: 'bg-rose-900 text-white border-none' },
      archived: { label: 'Архив', color: 'bg-text-primary text-white border-none' },
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
    <div className="container mx-auto space-y-10 px-4 py-4">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
=======
    <RegistryPageShell className="space-y-10 pb-16">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="text-accent-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            <Megaphone className="h-3 w-3" />
            Marketing & PR
          </div>
          <h1 className="font-headline text-sm font-black tracking-tighter">PR Sample Control</h1>
          <p className="font-medium text-muted-foreground">
            RFID/QR учет перемещения образцов коллекции между редакциями и стилистами.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-11 rounded-xl px-6 text-[10px] font-black uppercase"
            asChild
          >
            <Link href={ROUTES.shop.b2bScanner} className="inline-flex items-center gap-2">
              <QrCode className="h-4 w-4" aria-hidden />
              Список со сканера
            </Link>
          </Button>
<<<<<<< HEAD
          <Button className="h-11 gap-2 rounded-xl bg-indigo-600 px-6 text-[10px] font-black uppercase text-white shadow-lg">
=======
          <Button className="bg-accent-primary h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
            <Plus className="h-4 w-4" /> Новый запрос на образец
          </Button>
        </div>
      </header>

      {/* Stats Cards + PR ROI Widget */}
      <div className="grid gap-3 md:grid-cols-4">
        {[
<<<<<<< HEAD
          { label: 'Всего образцов', value: '142', icon: Layers, color: 'text-slate-900' },
          { label: 'В шоуруме', value: '86', icon: MapPin, color: 'text-emerald-600' },
          { label: 'На съемках', value: '52', icon: Camera, color: 'text-indigo-600' },
=======
          { label: 'Всего образцов', value: '142', icon: Layers, color: 'text-text-primary' },
          { label: 'В шоуруме', value: '86', icon: MapPin, color: 'text-emerald-600' },
          { label: 'На съемках', value: '52', icon: Camera, color: 'text-accent-primary' },
>>>>>>> recover/cabinet-wip-from-stash
          { label: 'Просрочено', value: '4', icon: AlertCircle, color: 'text-rose-600' },
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

      {/* PR ROI & Media Stats */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="rounded-2xl border border-none border-emerald-100 bg-emerald-50/50 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700">
              PR ROI (оценка)
            </span>
            <BarChart3 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-900">3.2x</p>
          <p className="mt-1 text-[9px] font-medium text-emerald-600">
            Return от образцов в редакциях
          </p>
        </Card>
<<<<<<< HEAD
        <Card className="rounded-2xl border border-none border-indigo-100 bg-indigo-50/50 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-700">
              Публикаций в FW26
            </span>
            <Megaphone className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-xl font-black text-indigo-900">24</p>
          <p className="mt-1 text-[9px] font-medium text-indigo-600">
            Vogue, Elle, Harper's Bazaar
          </p>
        </Card>
        <Card className="rounded-2xl border border-none border-slate-100 bg-slate-50 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">
              Content Factory
            </span>
            <Link
              href="/brand/marketing/content-factory"
              className="text-[9px] font-bold text-indigo-600 hover:underline"
=======
        <Card className="bg-accent-primary/10 border-accent-primary/20 rounded-2xl border border-none p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-accent-primary text-[9px] font-black uppercase tracking-widest">
              Публикаций в FW26
            </span>
            <Megaphone className="text-accent-primary h-4 w-4" />
          </div>
          <p className="text-accent-primary text-xl font-black">24</p>
          <p className="text-accent-primary mt-1 text-[9px] font-medium">
            Vogue, Elle, Harper's Bazaar
          </p>
        </Card>
        <Card className="bg-bg-surface2 border-border-subtle rounded-2xl border border-none p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-text-secondary text-[9px] font-black uppercase tracking-widest">
              Content Factory
            </span>
            <Link
              href={ROUTES.brand.marketingContentFactory}
              className="text-accent-primary text-[9px] font-bold hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
            >
              → Открыть
            </Link>
          </div>
<<<<<<< HEAD
          <p className="text-base font-black text-slate-900">Креативы и кампании</p>
          <p className="mt-1 text-[9px] font-medium text-slate-500">Связь образцов с контентом</p>
=======
          <p className="text-text-primary text-base font-black">Креативы и кампании</p>
          <p className="text-text-secondary mt-1 text-[9px] font-medium">
            Связь образцов с контентом
          </p>
>>>>>>> recover/cabinet-wip-from-stash
        </Card>
      </div>

      {/* Digital twin sample testing */}
<<<<<<< HEAD
      <Card className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-4">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <UserCircle className="h-4 w-4 text-indigo-600" /> Digital twin sample testing
=======
      <Card className="border-accent-primary/30 bg-accent-primary/10 rounded-2xl border p-4">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <UserCircle className="text-accent-primary h-4 w-4" /> Digital twin sample testing
>>>>>>> recover/cabinet-wip-from-stash
          </CardTitle>
          <CardDescription className="text-[11px]">
            Для eyewear — примерка оправы по фото/камере (браузер). Для одежды — отдельный сценарий
            через API виртуальной примерки.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Button
            asChild
            variant="outline"
            size="sm"
<<<<<<< HEAD
            className="gap-2 rounded-xl border-indigo-200 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100"
=======
            className="border-accent-primary/30 text-accent-primary hover:bg-accent-primary/15 gap-2 rounded-xl text-[10px] font-bold"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <Link href={ROUTES.brand.virtualTryonGlasses}>
              <Camera className="h-3.5 w-3.5" /> Виртуальная примерка очков
            </Link>
          </Button>
        </CardContent>
      </Card>

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
                  Активные перемещения
                </CardTitle>
                <CardDescription>Список образцов, находящихся вне шоурума.</CardDescription>
              </div>
              <div className="relative">
<<<<<<< HEAD
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                <Input
                  placeholder="Поиск по SKU / Стилисту"
                  className="h-10 w-64 rounded-xl border-slate-100 pl-9 text-xs"
=======
                <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Поиск по SKU / Стилисту"
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
                    <TableHead className="pl-8 text-[10px] font-black uppercase">
                      Наименование
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Статус</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Локация</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Возврат</TableHead>
                    <TableHead className="pr-8 text-right text-[10px] font-black uppercase">
                      Действие
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {samples.map((sample) => {
                    const isOverdue =
                      sample.expectedReturnAt && new Date(sample.expectedReturnAt) < new Date();
                    return (
<<<<<<< HEAD
                      <TableRow key={sample.id} className="transition-colors hover:bg-slate-50/50">
                        <TableCell className="py-6 pl-8">
                          <p className="text-sm font-bold text-slate-900">{sample.name}</p>
=======
                      <TableRow
                        key={sample.id}
                        className="hover:bg-bg-surface2/80 transition-colors"
                      >
                        <TableCell className="py-6 pl-8">
                          <p className="text-text-primary text-sm font-bold">{sample.name}</p>
>>>>>>> recover/cabinet-wip-from-stash
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] uppercase text-muted-foreground">
                              {sample.sku}
                            </span>
<<<<<<< HEAD
                            <span className="text-[10px] font-bold tracking-widest text-slate-300">
=======
                            <span className="text-text-muted text-[10px] font-bold tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                              /
                            </span>
                            <span className="text-[10px] uppercase text-muted-foreground">
                              {sample.size}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(sample.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
<<<<<<< HEAD
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100">
                              <MapPin className="h-3 w-3 text-slate-400" />
                            </div>
                            <span className="text-xs font-bold text-slate-600">
=======
                            <div className="bg-bg-surface2 flex h-6 w-6 items-center justify-center rounded-lg">
                              <MapPin className="text-text-muted h-3 w-3" />
                            </div>
                            <span className="text-text-secondary text-xs font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                              {sample.currentLocation}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {sample.expectedReturnAt ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <Clock
                                  className={cn(
                                    'h-3 w-3',
<<<<<<< HEAD
                                    isOverdue ? 'text-rose-500' : 'text-slate-400'
=======
                                    isOverdue ? 'text-rose-500' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                                  )}
                                />
                                <span
                                  className={cn(
                                    'font-mono text-xs',
<<<<<<< HEAD
                                    isOverdue ? 'font-black text-rose-600' : 'text-slate-600'
=======
                                    isOverdue ? 'font-black text-rose-600' : 'text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                                  )}
                                >
                                  {new Date(sample.expectedReturnAt).toLocaleDateString()}
                                </span>
                              </div>
                              {isOverdue && (
                                <p className="text-[8px] font-black uppercase tracking-widest text-rose-500">
                                  Просрочено
                                </p>
                              )}
                            </div>
                          ) : (
<<<<<<< HEAD
                            <span className="text-[10px] italic text-slate-300">—</span>
=======
                            <span className="text-text-muted text-[10px] italic">—</span>
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        </TableCell>
                        <TableCell className="pr-8 text-right">
                          <div className="flex flex-wrap items-center justify-end gap-1">
                            {sample.status === 'in_stock' ? (
                              <ShowroomSampleTagDialog sample={sample} />
                            ) : null}
                            <Button
                              variant="ghost"
                              size="icon"
<<<<<<< HEAD
                              className="h-8 w-8 text-slate-300 hover:text-indigo-600"
=======
                              className="text-text-muted hover:text-accent-primary h-8 w-8"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              <History className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
<<<<<<< HEAD
                              className="h-8 w-8 text-slate-300 hover:text-indigo-600"
=======
                              className="text-text-muted hover:text-accent-primary h-8 w-8"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <PRSampleReturns skuId="SKU-001-S" />
        </div>

        <div className="space-y-6">
<<<<<<< HEAD
          <Card className="rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl shadow-slate-200/50">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <Clock className="h-5 w-5 text-indigo-400" />
=======
          <Card className="bg-text-primary rounded-xl border-none p-4 text-white shadow-md shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <Clock className="text-accent-primary h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">
                  Предстоящие возвраты
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Ближайшие 48 часов
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Red Satin Shirt', to: 'Vogue editorial', date: 'Tomorrow, 12:00' },
                { name: 'Linen Trousers', to: 'Stylist: Anna K.', date: 'Today, 18:00' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
<<<<<<< HEAD
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
                    <Truck className="h-4 w-4 text-indigo-400" />
=======
                  <div className="bg-accent-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <Truck className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black">{item.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-tight text-white/40">
                      {item.to}
                    </p>
<<<<<<< HEAD
                    <p className="mt-2 text-[9px] font-black text-indigo-400">{item.date}</p>
=======
                    <p className="text-accent-primary mt-2 text-[9px] font-black">{item.date}</p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-6 h-10 w-full rounded-xl border-none bg-white/10 text-[9px] font-black uppercase text-white hover:bg-white/20">
              Весь график логистики
            </Button>
          </Card>

<<<<<<< HEAD
          <Card className="rounded-xl border-none p-4 shadow-xl shadow-slate-200/50">
=======
          <Card className="rounded-xl border-none p-4 shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
            <h3 className="mb-6 text-sm font-black uppercase tracking-tight">
              Stylist Network KPI
            </h3>
            <div className="space-y-6">
              {[
                { name: 'Anna Petrova', rating: '4.9', samples: 12, overdue: 0 },
                { name: 'Max Fashion', rating: '4.2', samples: 8, overdue: 2 },
                { name: 'Elena Style', rating: '5.0', samples: 5, overdue: 0 },
              ].map((stylist, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
<<<<<<< HEAD
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                      <UserCircle className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black">{stylist.name}</p>
                      <p className="text-[8px] font-black uppercase text-slate-400">
=======
                    <div className="bg-bg-surface2 flex h-8 w-8 items-center justify-center rounded-full">
                      <UserCircle className="text-text-muted h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black">{stylist.name}</p>
                      <p className="text-text-muted text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                        {stylist.samples} образцов
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs font-black">{stylist.rating}</span>
                    </div>
                    {stylist.overdue > 0 && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-rose-500">
                        +{stylist.overdue} просрочено
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </RegistryPageShell>
  );
}
