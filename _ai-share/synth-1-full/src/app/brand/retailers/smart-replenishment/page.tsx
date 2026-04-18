'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCw, PackageCheck, CalendarDays } from 'lucide-react';
import { RegistryPageShell } from '@/components/design-system';

export default function SmartReplenishmentPage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 duration-500 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Умное пополнение</h1>
        <p className="text-sm text-slate-500">
=======
    <RegistryPageShell className="max-w-5xl space-y-6 pb-16 duration-500 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-text-primary text-xl font-bold tracking-tight">Умное пополнение</h1>
        <p className="text-text-secondary text-sm">
>>>>>>> recover/cabinet-wip-from-stash
          Автоматические рекомендации пополнения и покрытие запасов.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
<<<<<<< HEAD
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <RefreshCw className="mb-2 h-5 w-5 text-indigo-600" />
=======
        <Card className="border-border-subtle rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <RefreshCw className="text-accent-primary mb-2 h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
            <CardTitle className="text-sm font-bold">Auto-reorder suggestions</CardTitle>
            <CardDescription className="text-xs">Подсказки авто-заказа</CardDescription>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm">
=======
            <p className="text-text-primary text-2xl font-black tabular-nums">—</p>
          </CardContent>
        </Card>
        <Card className="border-border-subtle rounded-xl shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
          <CardHeader className="pb-2">
            <PackageCheck className="mb-2 h-5 w-5 text-emerald-600" />
            <CardTitle className="text-sm font-bold">Fill rate</CardTitle>
            <CardDescription className="text-xs">Уровень выполнения</CardDescription>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm">
=======
            <p className="text-text-primary text-2xl font-black tabular-nums">—</p>
          </CardContent>
        </Card>
        <Card className="border-border-subtle rounded-xl shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
          <CardHeader className="pb-2">
            <CalendarDays className="mb-2 h-5 w-5 text-amber-600" />
            <CardTitle className="text-sm font-bold">Stock coverage days</CardTitle>
            <CardDescription className="text-xs">Дней покрытия склада</CardDescription>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
=======
            <p className="text-text-primary text-2xl font-black tabular-nums">—</p>
>>>>>>> recover/cabinet-wip-from-stash
          </CardContent>
        </Card>
      </div>
    </RegistryPageShell>
  );
}
