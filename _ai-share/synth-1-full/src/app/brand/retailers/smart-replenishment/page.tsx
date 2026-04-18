'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCw, PackageCheck, CalendarDays } from 'lucide-react';

export default function SmartReplenishmentPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 duration-500 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Умное пополнение</h1>
        <p className="text-sm text-slate-500">
          Автоматические рекомендации пополнения и покрытие запасов.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <RefreshCw className="mb-2 h-5 w-5 text-indigo-600" />
            <CardTitle className="text-sm font-bold">Auto-reorder suggestions</CardTitle>
            <CardDescription className="text-xs">Подсказки авто-заказа</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <PackageCheck className="mb-2 h-5 w-5 text-emerald-600" />
            <CardTitle className="text-sm font-bold">Fill rate</CardTitle>
            <CardDescription className="text-xs">Уровень выполнения</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <CalendarDays className="mb-2 h-5 w-5 text-amber-600" />
            <CardTitle className="text-sm font-bold">Stock coverage days</CardTitle>
            <CardDescription className="text-xs">Дней покрытия склада</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
