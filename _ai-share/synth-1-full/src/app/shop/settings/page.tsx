'use client';

import React from 'react';
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

export default function ShopSettingsPage() {
  const { pulseMode, setPulseMode } = useUIState();

  return (
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
                <div>
                  <CardTitle className="text-base font-black uppercase tracking-tight">
                    Операционный Пульс (Live Pulse)
                  </CardTitle>
                  <CardDescription className="italic text-rose-100">
                    Настройка отображения статусов производства и отгрузок от брендов.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-10 p-3">
              <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Режим уведомлений
                  </Label>
                  <p className="max-w-xs text-xs font-medium leading-relaxed text-slate-500">
                    «Бегущая строка» удобна для постоянного мониторинга остатков и поставок.
                  </p>
                </div>

                <Tabs
                  defaultValue={pulseMode}
                  value={pulseMode}
                  onValueChange={(val) => setPulseMode(val as any)}
                >
                  <TabsList className="h-auto rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
                    <TabsTrigger
                      value="ticker"
                      className="gap-2 rounded-xl px-8 py-3 text-[10px] font-black uppercase transition-all data-[state=active]:bg-rose-600 data-[state=active]:text-white"
                    >
                      <Layout className="h-3.5 w-3.5" /> Бегущая строка
                    </TabsTrigger>
                    <TabsTrigger
                      value="floating"
                      className="gap-2 rounded-xl px-8 py-3 text-[10px] font-black uppercase transition-all data-[state=active]:bg-rose-600 data-[state=active]:text-white"
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
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-3 pt-0">
              <Button className="h-10 rounded-2xl bg-black px-12 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl transition-transform hover:scale-105">
                Применить
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Card className="relative space-y-6 overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Store className="h-32 w-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <h4 className="text-base font-black uppercase tracking-tighter">Retail Sync</h4>
              <p className="text-xs font-medium leading-relaxed text-slate-400">
                Ваша кассовая система (POS) синхронизирована с CRM 360°. Омни-канальная лояльность
                активна.
              </p>
              <Button
                variant="outline"
                className="h-12 w-full rounded-xl border-white/20 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-slate-900"
              >
                Проверить связь
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
