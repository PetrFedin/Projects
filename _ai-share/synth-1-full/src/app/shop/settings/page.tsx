'use client';

import React from 'react';
import { Settings, Activity, Layout, MessageSquare, ShieldCheck, Bell, ShoppingBag, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/utils';

export default function ShopSettingsPage() {
  const { pulseMode, setPulseMode } = useUIState();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header className="space-y-2">
        <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900">Настройки магазина</h1>
        <p className="text-slate-400 font-medium max-w-2xl text-sm italic">
           Управление розничной точкой, параметрами синхронизации и визуальными уведомлениями.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
         <div className="lg:col-span-8 space-y-4">
            <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
              <CardHeader className="p-3 pb-4 bg-rose-600 text-white">
                <div className="flex items-center gap-3">
                   <Activity className="h-6 w-6 text-rose-200" />
                   <div>
                      <CardTitle className="text-base font-black uppercase tracking-tight">Операционный Пульс (Live Pulse)</CardTitle>
                      <CardDescription className="text-rose-100 italic">Настройка отображения статусов производства и отгрузок от брендов.</CardDescription>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 space-y-10">
                 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="space-y-2">
                       <Label className="text-[11px] font-black uppercase tracking-widest text-slate-900">Режим уведомлений</Label>
                       <p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
                          «Бегущая строка» удобна для постоянного мониторинга остатков и поставок.
                       </p>
                    </div>
                    
                    <Tabs 
                      defaultValue={pulseMode} 
                      value={pulseMode} 
                      onValueChange={(val) => setPulseMode(val as any)}
                    >
                       <TabsList className="bg-white p-1 rounded-2xl h-auto shadow-sm border border-slate-100">
                          <TabsTrigger value="ticker" className="rounded-xl py-3 px-8 data-[state=active]:bg-rose-600 data-[state=active]:text-white text-[10px] font-black uppercase gap-2 transition-all">
                             <Layout className="h-3.5 w-3.5" /> Бегущая строка
                          </TabsTrigger>
                          <TabsTrigger value="floating" className="rounded-xl py-3 px-8 data-[state=active]:bg-rose-600 data-[state=active]:text-white text-[10px] font-black uppercase gap-2 transition-all">
                             <MessageSquare className="h-3.5 w-3.5" /> Всплывающие
                          </TabsTrigger>
                       </TabsList>
                    </Tabs>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { icon: Bell, title: "Уведомления о стоке", desc: "Алерт при остатке < 10%" },
                      { icon: ShoppingBag, title: "Авто-заказы", desc: "Настройка Smart Replenishment" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-50 shadow-sm hover:shadow-md transition-all cursor-pointer">
                         <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center">
                            <item.icon className="h-5 w-5 text-slate-400" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-slate-900">{item.title}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </CardContent>
              <CardFooter className="p-3 pt-0 flex justify-end">
                 <Button className="h-10 px-12 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-transform">
                    Применить
                 </Button>
              </CardFooter>
            </Card>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white p-4 space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Store className="h-32 w-32" />
               </div>
               <div className="relative z-10 space-y-4">
                  <h4 className="text-base font-black uppercase tracking-tighter">Retail Sync</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                     Ваша кассовая система (POS) синхронизирована с CRM 360°. Омни-канальная лояльность активна.
                  </p>
                  <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 text-white hover:bg-white hover:text-slate-900 font-black uppercase text-[9px] tracking-widest">
                     Проверить связь
                  </Button>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
