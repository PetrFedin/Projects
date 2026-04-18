'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, CheckCircle2, AlertOctagon } from 'lucide-react';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function B2BApprovalLivePage() {
  return (
    <RegistryPageShell className="w-full max-w-none space-y-4 pb-16">
      <RegistryPageHeader
        title="LIVE: Согласование"
        leadPlain="Real-time order approval workflow"
      />
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
            <p className="text-text-secondary mt-1 text-[10px]">в очереди руководителя</p>
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
            <p className="text-text-secondary mt-1 text-[10px]">за сегодня</p>
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
            <p className="text-text-secondary mt-1 text-[10px]">свыше лимита скидки</p>
          </CardContent>
        </Card>
      </div>
    </RegistryPageShell>
  );
}
