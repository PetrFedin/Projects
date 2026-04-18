'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Hourglass, TrendingUp } from 'lucide-react';
import { B2B_ORDERS_REGISTRY_LABEL } from '@/lib/ui/b2b-registry-label';
import { RegistryPageShell } from '@/components/design-system';

export default function B2BOrdersLivePage() {
  return (
    <RegistryPageShell className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-tight">
          LIVE: {B2B_ORDERS_REGISTRY_LABEL}
        </h1>
        <p className="text-text-secondary mt-1 text-sm">Real-time B2B order processing monitor</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border-default">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-sky-600" />
              <CardTitle className="text-sm">Заказы в работе</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">56</p>
            <p className="text-text-secondary mt-1 text-[10px]">обработка и резерв</p>
          </CardContent>
        </Card>
        <Card className="border-border-default">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Hourglass className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-sm">Ожидают подтверждения</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">9</p>
            <p className="text-text-secondary mt-1 text-[10px]">ответ бренда</p>
          </CardContent>
        </Card>
        <Card className="border-border-default sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm">Объём сегодня</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">₽ 4.2M</p>
            <p className="text-text-secondary mt-1 text-[10px]">по подтверждённым строкам</p>
          </CardContent>
        </Card>
      </div>
    </RegistryPageShell>
  );
}
