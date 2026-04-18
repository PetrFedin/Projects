'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, ShoppingCart, LayoutDashboard } from 'lucide-react';

export default function DealerCabinetPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 duration-500 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Личный кабинет дилера</h1>
        <p className="text-sm text-slate-500">
          Портал дилера: активность, заказы и визиты в кабинет.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <Users className="mb-2 h-5 w-5 text-indigo-600" />
            <CardTitle className="text-sm font-bold">Active dealers</CardTitle>
            <CardDescription className="text-xs">Активные дилеры</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <ShoppingCart className="mb-2 h-5 w-5 text-emerald-600" />
            <CardTitle className="text-sm font-bold">Orders this month</CardTitle>
            <CardDescription className="text-xs">Заказы за месяц</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <LayoutDashboard className="mb-2 h-5 w-5 text-amber-600" />
            <CardTitle className="text-sm font-bold">Portal visits</CardTitle>
            <CardDescription className="text-xs">Визиты в портал</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
