'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSearch, MessageSquareWarning, Timer } from 'lucide-react';

export default function SuppliersLivePage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-tight">LIVE: Сорсинг</h1>
        <p className="mt-1 text-sm text-slate-500">Real-time sourcing pipeline monitoring</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-indigo-600" />
              <CardTitle className="text-sm">Активные RFQ</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">23</p>
            <p className="mt-1 text-[10px] text-slate-500">в работе у закупок</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MessageSquareWarning className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-sm">Ответы поставщиков</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">11</p>
            <p className="mt-1 text-[10px] text-slate-500">ожидают ответа</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm">Lead time</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">18 дн</p>
            <p className="mt-1 text-[10px] text-slate-500">медиана по текущим лотам</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
