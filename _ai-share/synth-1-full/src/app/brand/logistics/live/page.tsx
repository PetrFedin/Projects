'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function LogisticsLivePage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-tight">LIVE: Логистика</h1>
        <p className="mt-1 text-sm text-slate-500">Real-time logistics monitoring dashboard</p>
      </div>
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
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
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            <p className="mt-1 text-[10px] text-slate-500">в пути сейчас</p>
=======
            <p className="text-text-secondary mt-1 text-[10px]">в пути сейчас</p>
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            <p className="mt-1 text-[10px] text-slate-500">по РФ, скользящее окно</p>
=======
            <p className="text-text-secondary mt-1 text-[10px]">по РФ, скользящее окно</p>
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            <p className="mt-1 text-[10px] text-slate-500">требуют эскалации</p>
=======
            <p className="text-text-secondary mt-1 text-[10px]">требуют эскалации</p>
>>>>>>> recover/cabinet-wip-from-stash
          </CardContent>
        </Card>
      </div>
    </RegistryPageShell>
  );
}
