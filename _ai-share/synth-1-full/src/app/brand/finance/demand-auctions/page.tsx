'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gavel, Inbox, Percent } from 'lucide-react';

export default function DemandAuctionsPage() {
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight">Аукционы потребностей</h2>
        <p className="text-sm text-muted-foreground font-medium mt-1">
          Обратные аукционы по закупкам: заявки, ставки и экономия.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Gavel className="h-4 w-4 text-indigo-600" />
              Active auctions
            </CardTitle>
            <CardDescription className="text-xs">Идут сейчас</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Inbox className="h-4 w-4 text-emerald-600" />
              Bids received
            </CardTitle>
            <CardDescription className="text-xs">Получено предложений</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Percent className="h-4 w-4 text-amber-600" />
              Avg savings %
            </CardTitle>
            <CardDescription className="text-xs">Средняя экономия</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-slate-900">—</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
