'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Hourglass, TrendingUp } from 'lucide-react';

export default function B2BOrdersLivePage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-tight">LIVE: B2B Заказы</h1>
        <p className="mt-1 text-sm text-slate-500">Real-time B2B order processing monitor</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-sky-600" />
              <CardTitle className="text-sm">Заказы в работе</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">56</p>
            <p className="mt-1 text-[10px] text-slate-500">обработка и резерв</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Hourglass className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-sm">Ожидают подтверждения</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">9</p>
            <p className="mt-1 text-[10px] text-slate-500">ответ бренда</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm">Объём сегодня</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">₽ 4.2M</p>
            <p className="mt-1 text-[10px] text-slate-500">по подтверждённым строкам</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
