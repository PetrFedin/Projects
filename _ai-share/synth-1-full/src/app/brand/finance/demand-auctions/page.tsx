'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gavel, Inbox, Percent } from 'lucide-react';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function DemandAuctionsPage() {
  return (
<<<<<<< HEAD
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight">Аукционы потребностей</h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Обратные аукционы по закупкам: заявки, ставки и экономия.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Gavel className="h-4 w-4 text-indigo-600" />
=======
    <RegistryPageShell className="w-full max-w-none space-y-4 pb-16">
      <RegistryPageHeader
        title="Аукционы потребностей"
        leadPlain="Обратные аукционы по закупкам: заявки, ставки и экономия."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border-subtle rounded-xl border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Gavel className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
              Active auctions
            </CardTitle>
            <CardDescription className="text-xs">Идут сейчас</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-primary text-2xl font-black">—</p>
          </CardContent>
        </Card>
        <Card className="border-border-subtle rounded-xl border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Inbox className="h-4 w-4 text-emerald-600" />
              Bids received
            </CardTitle>
            <CardDescription className="text-xs">Получено предложений</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-primary text-2xl font-black">—</p>
          </CardContent>
        </Card>
        <Card className="border-border-subtle rounded-xl border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Percent className="h-4 w-4 text-amber-600" />
              Avg savings %
            </CardTitle>
            <CardDescription className="text-xs">Средняя экономия</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-primary text-2xl font-black">—</p>
          </CardContent>
        </Card>
      </div>
    </RegistryPageShell>
  );
}
