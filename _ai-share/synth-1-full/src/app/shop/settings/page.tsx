'use client';

import React from 'react';
<<<<<<< HEAD
import {
  Settings,
  Activity,
  Layout,
  MessageSquare,
  ShieldCheck,
  Bell,
  ShoppingBag,
  Store,
} from 'lucide-react';
=======
import { Activity, Layout, MessageSquare, Bell, ShoppingBag, Store } from 'lucide-react';
>>>>>>> recover/cabinet-wip-from-stash
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { tid } from '@/lib/ui/test-ids';
import { ROUTES } from '@/lib/routes';
import Link from 'next/link';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function ShopSettingsPage() {
  const { pulseMode, setPulseMode } = useUIState();

  return (
<<<<<<< HEAD
    <div className="space-y-6 duration-300 animate-in fade-in">
      <header className="space-y-2">
        <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900">
          Настройки магазина
        </h1>
        <p className="max-w-2xl text-sm font-medium italic text-slate-400">
          Управление розничной точкой, параметрами синхронизации и визуальными уведомлениями.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
            <CardHeader className="bg-rose-600 p-3 pb-4 text-white">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-rose-200" />
=======
    <RegistryPageShell
      className="bg-bg-canvas space-y-6 duration-300 animate-in fade-in"
      data-testid={tid.page('shop-settings')}
    >
      <RegistryPageHeader
        title="Настройки магазина"
        leadPlain="Управление розничной точкой, параметрами синхронизации и визуальными уведомлениями."
        eyebrow={
          <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
            <Link href={ROUTES.shop.home} className="hover:text-accent-primary transition-colors">
              Ритейл-центр
            </Link>
            <span className="text-text-muted">/</span>
            <span className="text-text-muted">Настройки</span>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <Card className="border-border-subtle bg-bg-surface overflow-hidden rounded-xl border shadow-sm">
            <CardHeader className="bg-accent-primary text-text-inverse p-3 pb-4">
              <div className="flex items-center gap-3">
                <Activity className="text-text-inverse/80 h-6 w-6" />
>>>>>>> recover/cabinet-wip-from-stash
                <div>
                  <CardTitle className="text-base font-black uppercase tracking-tight">
                    Операционный Пульс (Live Pulse)
                  </CardTitle>
<<<<<<< HEAD
                  <CardDescription className="italic text-rose-100">
=======
                  <CardDescription className="text-text-inverse/80 italic">
>>>>>>> recover/cabinet-wip-from-stash
                    Настройка отображения статусов производства и отгрузок от брендов.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-10 p-3">
<<<<<<< HEAD
              <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Режим уведомлений
                  </Label>
                  <p className="max-w-xs text-xs font-medium leading-relaxed text-slate-500">
=======
              <div className="bg-bg-surface2 border-border-subtle flex flex-col items-start justify-between gap-3 rounded-xl border p-4 md:flex-row md:items-center">
                <div className="space-y-2">
                  <Label className="text-text-primary text-[11px] font-black uppercase tracking-widest">
                    Режим уведомлений
                  </Label>
                  <p className="text-text-secondary max-w-xs text-xs font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                    «Бегущая строка» удобна для постоянного мониторинга остатков и поставок.
                  </p>
                </div>

                <Tabs
                  defaultValue={pulseMode}
                  value={pulseMode}
                  onValueChange={(val) => setPulseMode(val as any)}
                >
<<<<<<< HEAD
                  <TabsList className="h-auto rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
                    <TabsTrigger
                      value="ticker"
                      className="gap-2 rounded-xl px-8 py-3 text-[10px] font-black uppercase transition-all data-[state=active]:bg-rose-600 data-[state=active]:text-white"
=======
                  {/* cabinetSurface v1 */}
                  <TabsList className={cn(cabinetSurface.tabsList, 'w-fit flex-wrap')}>
                    <TabsTrigger
                      value="ticker"
                      className={cn(
                        cabinetSurface.tabsTrigger,
                        'data-[state=active]:text-accent-primary h-9 gap-2 px-5'
                      )}
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      <Layout className="h-3.5 w-3.5" /> Бегущая строка
                    </TabsTrigger>
                    <TabsTrigger
                      value="floating"
<<<<<<< HEAD
                      className="gap-2 rounded-xl px-8 py-3 text-[10px] font-black uppercase transition-all data-[state=active]:bg-rose-600 data-[state=active]:text-white"
=======
                      className={cn(
                        cabinetSurface.tabsTrigger,
                        'data-[state=active]:text-accent-primary h-9 gap-2 px-5'
                      )}
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> Всплывающие
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  { icon: Bell, title: 'Уведомления о стоке', desc: 'Алерт при остатке < 10%' },
                  {
                    icon: ShoppingBag,
                    title: 'Авто-заказы',
                    desc: 'Настройка Smart Replenishment',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
<<<<<<< HEAD
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-50 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                      <item.icon className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-[9px] font-bold uppercase text-slate-400">{item.desc}</p>
=======
                    className="bg-bg-surface border-border-subtle flex cursor-pointer items-center gap-3 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-xl">
                      <item.icon className="text-text-muted h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-text-primary text-[10px] font-black uppercase">
                        {item.title}
                      </p>
                      <p className="text-text-muted text-[9px] font-bold uppercase">{item.desc}</p>
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-3 pt-0">
<<<<<<< HEAD
              <Button className="h-10 rounded-2xl bg-black px-12 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl transition-transform hover:scale-105">
=======
              <Button className="bg-text-primary text-text-inverse h-10 rounded-2xl px-12 text-[10px] font-black uppercase tracking-widest shadow-xl transition-transform hover:scale-105">
>>>>>>> recover/cabinet-wip-from-stash
                Применить
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-4">
<<<<<<< HEAD
          <Card className="relative space-y-6 overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
=======
          <Card className="border-border-subtle bg-text-primary text-text-inverse relative space-y-6 overflow-hidden rounded-xl border p-4 shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Store className="h-32 w-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <h4 className="text-base font-black uppercase tracking-tighter">Retail Sync</h4>
<<<<<<< HEAD
              <p className="text-xs font-medium leading-relaxed text-slate-400">
=======
              <p className="text-text-muted text-xs font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                Ваша кассовая система (POS) синхронизирована с CRM 360°. Омни-канальная лояльность
                активна.
              </p>
              <Button
                variant="outline"
<<<<<<< HEAD
                className="h-12 w-full rounded-xl border-white/20 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-slate-900"
=======
                className="text-text-inverse hover:bg-bg-surface hover:text-text-primary h-12 w-full rounded-xl border-white/20 text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Проверить связь
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </RegistryPageShell>
  );
}
