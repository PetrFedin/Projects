'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, ArrowLeft } from 'lucide-react';
import { getCycleCountingLinks } from '@/lib/data/entity-links';
import { listCycleCountSessions } from '@/lib/api';
import type { CycleCountSession } from '@/lib/shop/cycle-counting';
import { RegistryPageShell } from '@/components/design-system';
import { ROUTES } from '@/lib/routes';

const statusLabels: Record<CycleCountSession['status'], string> = {
  in_progress: 'В процессе',
  completed: 'Завершена',
  discrepancy: 'Расхождение',
};

export default function CycleCountingPage() {
  const links = getCycleCountingLinks();
  const [sessions, setSessions] = useState<CycleCountSession[]>([]);

  useEffect(() => {
    listCycleCountSessions().then(setSessions);
  }, []);

  return (
<<<<<<< HEAD
    <div className="container max-w-4xl space-y-6 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Link href="/shop/inventory">
=======
    <RegistryPageShell className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.shop.inventory}>
>>>>>>> recover/cabinet-wip-from-stash
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Cycle Counting</h1>
<<<<<<< HEAD
          <p className="text-sm text-slate-500">
=======
          <p className="text-text-secondary text-sm">
>>>>>>> recover/cabinet-wip-from-stash
            Инвентаризация склада через камеру смартфона (~15 мин). Связь со складом и маркировкой
            (Russian Layer).
          </p>
        </div>
      </div>

      <Card className="border-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Camera className="h-4 w-4 text-blue-600" />
            Сессии инвентаризации
          </CardTitle>
          <CardDescription>Сканирование по зонам, сверка с КИЗ (Честный ЗНАК)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {sessions.map((s) => (
            <div
              key={s.id}
<<<<<<< HEAD
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3"
=======
              className="bg-bg-surface2 border-border-subtle flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <div>
                <p className="text-sm font-medium">
                  Зона {s.zone} · {s.scannedCount} / {s.expectedCount}
                </p>
<<<<<<< HEAD
                <p className="text-xs text-slate-500">
=======
                <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                  {s.completedAt ? `Завершена в ${s.completedAt.slice(11, 16)}` : 'В процессе'}
                  {s.markingVerified && ' · КИЗ проверен'}
                </p>
              </div>
              <Badge
                variant={s.status === 'completed' ? 'default' : 'secondary'}
                className="text-[10px]"
              >
                {statusLabels[s.status]}
              </Badge>
            </div>
          ))}
<<<<<<< HEAD
          <p className="mt-3 text-xs text-slate-400">
=======
          <p className="text-text-muted mt-3 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
            API: CYCLE_COUNTING_API — старт сессии, сканирование, завершение. Russian Layer:
            маркировка.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Связанные модули</CardTitle>
          <CardDescription>Склад, маркировка</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Button variant="outline" size="sm" className="text-xs" asChild>
                  <Link href={l.href}>{l.label}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </RegistryPageShell>
  );
}
