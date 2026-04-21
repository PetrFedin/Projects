'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RegistryPageHeader } from '@/components/design-system';

export default function LogisticsLivePage() {
  return (
    <CabinetPageContent maxWidth="full" className="w-full space-y-6 pb-16">
      <RegistryPageHeader
        title="LIVE: Логистика"
        leadPlain="Real-time logistics monitoring dashboard"
        eyebrow={
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.brand.logistics} aria-label="Назад к логистике">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border-default">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-sky-600" />
              <CardTitle className="text-sm">Активные отправления</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">142</p>
            <p className="text-text-secondary mt-1 text-[10px]">в пути сейчас</p>
          </CardContent>
        </Card>
        <Card className="border-border-default">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm">Среднее время доставки</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">2.4 дн</p>
            <p className="text-text-secondary mt-1 text-[10px]">по РФ, скользящее окно</p>
          </CardContent>
        </Card>
        <Card className="border-border-default sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-sm">Задержки</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-amber-700">7</p>
            <p className="text-text-secondary mt-1 text-[10px]">требуют эскалации</p>
          </CardContent>
        </Card>
      </div>
    </CabinetPageContent>
  );
}
