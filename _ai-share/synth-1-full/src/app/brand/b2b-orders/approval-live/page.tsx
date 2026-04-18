'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, CheckCircle2, AlertOctagon } from 'lucide-react';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function B2BApprovalLivePage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-tight">LIVE: Согласование</h1>
        <p className="mt-1 text-sm text-slate-500">Real-time order approval workflow</p>
      </div>
=======
    <RegistryPageShell className="w-full max-w-none space-y-4 pb-16">
      <RegistryPageHeader
        title="LIVE: Согласование"
        leadPlain="Real-time order approval workflow"
      />
>>>>>>> recover/cabinet-wip-from-stash
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border-default">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="text-accent-primary h-4 w-4" />
              <CardTitle className="text-sm">На согласовании</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">14</p>
<<<<<<< HEAD
            <p className="mt-1 text-[10px] text-slate-500">в очереди руководителя</p>
=======
            <p className="text-text-secondary mt-1 text-[10px]">в очереди руководителя</p>
>>>>>>> recover/cabinet-wip-from-stash
          </CardContent>
        </Card>
        <Card className="border-border-default">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm">Авто-согласовано</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">31</p>
<<<<<<< HEAD
            <p className="mt-1 text-[10px] text-slate-500">за сегодня</p>
=======
            <p className="text-text-secondary mt-1 text-[10px]">за сегодня</p>
>>>>>>> recover/cabinet-wip-from-stash
          </CardContent>
        </Card>
        <Card className="border-border-default sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-rose-600" />
              <CardTitle className="text-sm">Эскалации</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-rose-700">3</p>
<<<<<<< HEAD
            <p className="mt-1 text-[10px] text-slate-500">свыше лимита скидки</p>
=======
            <p className="text-text-secondary mt-1 text-[10px]">свыше лимита скидки</p>
>>>>>>> recover/cabinet-wip-from-stash
          </CardContent>
        </Card>
      </div>
    </RegistryPageShell>
  );
}
