'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListOrdered, ListChecks, ArrowRightCircle } from 'lucide-react';
import { RegistryPageShell } from '@/components/design-system';

export default function OrderListsPage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 duration-500 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Списки заказов</h1>
        <p className="text-sm text-slate-500">
=======
    <RegistryPageShell className="max-w-5xl space-y-6 pb-16 duration-500 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-text-primary text-xl font-bold tracking-tight">Списки заказов</h1>
        <p className="text-text-secondary text-sm">
>>>>>>> recover/cabinet-wip-from-stash
          Списки для повторных заказов и конверсия в оформление.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
<<<<<<< HEAD
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <ListOrdered className="mb-2 h-5 w-5 text-indigo-600" />
=======
        <Card className="border-border-subtle rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <ListOrdered className="text-accent-primary mb-2 h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
            <CardTitle className="text-sm font-bold">Active lists</CardTitle>
            <CardDescription className="text-xs">Активные списки</CardDescription>
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
            <ListChecks className="mb-2 h-5 w-5 text-emerald-600" />
            <CardTitle className="text-sm font-bold">Items in lists</CardTitle>
            <CardDescription className="text-xs">Позиций в списках</CardDescription>
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
            <ArrowRightCircle className="mb-2 h-5 w-5 text-amber-600" />
            <CardTitle className="text-sm font-bold">Conversion to order</CardTitle>
            <CardDescription className="text-xs">Конверсия в заказ</CardDescription>
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
