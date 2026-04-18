'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSearch, MessageSquareWarning, Timer } from 'lucide-react';
import { RegistryPageShell } from '@/components/design-system';

export default function SuppliersLivePage() {
  return (
    <RegistryPageShell className="max-w-5xl space-y-4 pb-16">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-tight">LIVE: Сорсинг</h1>
        <p className="text-text-secondary mt-1 text-sm">Real-time sourcing pipeline monitoring</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border-subtle">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileSearch className="text-accent-primary h-4 w-4" />
              <CardTitle className="text-sm">Активные RFQ</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">23</p>
            <p className="text-text-secondary mt-1 text-[10px]">в работе у закупок</p>
          </CardContent>
        </Card>
        <Card className="border-border-subtle">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MessageSquareWarning className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-sm">Ответы поставщиков</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">11</p>
            <p className="text-text-secondary mt-1 text-[10px]">ожидают ответа</p>
          </CardContent>
        </Card>
        <Card className="border-border-subtle sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm">Lead time</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">18 дн</p>
            <p className="text-text-secondary mt-1 text-[10px]">медиана по текущим лотам</p>
          </CardContent>
        </Card>
      </div>
    </RegistryPageShell>
  );
}
