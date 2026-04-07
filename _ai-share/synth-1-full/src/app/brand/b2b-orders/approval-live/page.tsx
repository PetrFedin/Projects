'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function B2BApprovalLivePage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-4 pb-24">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-tight">LIVE: Согласование</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time order approval workflow</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-indigo-600" />
              <CardTitle className="text-sm">На согласовании</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">14</p>
            <p className="text-[10px] text-slate-500 mt-1">в очереди руководителя</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm">Авто-согласовано</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">31</p>
            <p className="text-[10px] text-slate-500 mt-1">за сегодня</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-rose-600" />
              <CardTitle className="text-sm">Эскалации</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-rose-700">3</p>
            <p className="text-[10px] text-slate-500 mt-1">свыше лимита скидки</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
