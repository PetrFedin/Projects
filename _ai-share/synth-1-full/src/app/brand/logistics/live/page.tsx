'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, AlertTriangle } from 'lucide-react';

export default function LogisticsLivePage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-4 pb-24">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-tight">LIVE: Логистика</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time logistics monitoring dashboard</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-sky-600" />
              <CardTitle className="text-sm">Активные отправления</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">142</p>
            <p className="text-[10px] text-slate-500 mt-1">в пути сейчас</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm">Среднее время доставки</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">2.4 дн</p>
            <p className="text-[10px] text-slate-500 mt-1">по РФ, скользящее окно</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-sm">Задержки</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-amber-700">7</p>
            <p className="text-[10px] text-slate-500 mt-1">требуют эскалации</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
