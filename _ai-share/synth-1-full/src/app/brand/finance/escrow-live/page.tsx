'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock, Banknote } from 'lucide-react';

export default function EscrowLivePage() {
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight">LIVE: Этапы оплаты (Эскроу)</h2>
        <p className="text-sm text-muted-foreground font-medium mt-1">
          Текущие сделки в эскроу и статусы этапов оплаты в реальном времени.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              Active escrow deals
            </CardTitle>
            <CardDescription className="text-xs">Сделки в работе</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              Pending milestones
            </CardTitle>
            <CardDescription className="text-xs">Ожидают подтверждения</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Banknote className="h-4 w-4 text-indigo-600" />
              Released this month
            </CardTitle>
            <CardDescription className="text-xs">Выплачено за месяц</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-slate-900">—</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
