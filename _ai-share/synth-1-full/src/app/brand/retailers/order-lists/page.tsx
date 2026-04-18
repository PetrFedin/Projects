'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListOrdered, ListChecks, ArrowRightCircle } from 'lucide-react';

export default function OrderListsPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 duration-500 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Списки заказов</h1>
        <p className="text-sm text-slate-500">
          Списки для повторных заказов и конверсия в оформление.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <ListOrdered className="mb-2 h-5 w-5 text-indigo-600" />
            <CardTitle className="text-sm font-bold">Active lists</CardTitle>
            <CardDescription className="text-xs">Активные списки</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <ListChecks className="mb-2 h-5 w-5 text-emerald-600" />
            <CardTitle className="text-sm font-bold">Items in lists</CardTitle>
            <CardDescription className="text-xs">Позиций в списках</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <ArrowRightCircle className="mb-2 h-5 w-5 text-amber-600" />
            <CardTitle className="text-sm font-bold">Conversion to order</CardTitle>
            <CardDescription className="text-xs">Конверсия в заказ</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
