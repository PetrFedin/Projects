'use client';

import { RealRouteAi } from "@/components/distributor/real-route-ai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DistributorTerritoryPage() {
  const [protectionOn, setProtectionOn] = useState(true);
  const allowedRegions = ['Москва', 'МО', 'СПб', 'ЛО'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
       <header className="space-y-2">
          <h1 className="text-sm font-black uppercase tracking-tighter">Логистическая Карта & AI Маршруты</h1>
          <p className="text-slate-400 font-medium max-w-2xl text-sm italic">
             Глобальный мониторинг поставок в реальном времени с использованием предиктивной аналитики маршрутов.
          </p>
       </header>

       <Card className="rounded-xl border border-amber-200 bg-amber-50/30">
         <CardHeader>
           <CardTitle className="text-sm flex items-center gap-2">
             <Shield className="h-4 w-4" /> Territory Protection Logic
           </CardTitle>
           <CardDescription>Автоматическая блокировка заказов от магазинов вне эксклюзивного региона</CardDescription>
         </CardHeader>
         <CardContent className="space-y-3">
           <div className="flex items-center gap-2">
             <Button variant={protectionOn ? 'default' : 'outline'} size="sm" onClick={() => setProtectionOn(!protectionOn)} className="rounded-lg">
               {protectionOn ? 'Включено' : 'Выключено'}
             </Button>
             <span className="text-[11px] text-slate-600">Разрешённые регионы: {allowedRegions.join(', ')}</span>
           </div>
           <p className="text-[10px] text-slate-500">Заказы с доставкой вне указанных регионов будут отклонены. Связь с заказами и ритейлерами.</p>
         </CardContent>
       </Card>

       <RealRouteAi />

       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Активных маршрутов', value: '14' },
            { label: 'Объем в пути', value: '42.5M ₽' },
            { label: 'Средняя задержка', value: '4.2ч' }
          ].map((stat, i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
               <span className="text-base font-black text-slate-900">{stat.value}</span>
            </div>
          ))}
       </div>
    </div>
  );
}
