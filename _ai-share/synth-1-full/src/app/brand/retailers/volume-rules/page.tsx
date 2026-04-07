'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Scale, Zap, TrendingUp } from 'lucide-react';

export default function VolumeRulesPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Объёмные правила</h1>
        <p className="text-sm text-slate-500">Правила по объёму заказа: срабатывания и влияние на выручку.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-slate-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <Scale className="h-5 w-5 text-indigo-600 mb-2" />
            <CardTitle className="text-sm font-bold">Active rules</CardTitle>
            <CardDescription className="text-xs">Активные правила</CardDescription>
          </CardHeader>
          <CardContent><p className="text-2xl font-black tabular-nums text-slate-900">—</p></CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <Zap className="h-5 w-5 text-emerald-600 mb-2" />
            <CardTitle className="text-sm font-bold">Triggered this month</CardTitle>
            <CardDescription className="text-xs">Срабатываний за месяц</CardDescription>
          </CardHeader>
          <CardContent><p className="text-2xl font-black tabular-nums text-slate-900">—</p></CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <TrendingUp className="h-5 w-5 text-amber-600 mb-2" />
            <CardTitle className="text-sm font-bold">Revenue impact</CardTitle>
            <CardDescription className="text-xs">Влияние на выручку</CardDescription>
          </CardHeader>
          <CardContent><p className="text-2xl font-black tabular-nums text-slate-900">—</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
