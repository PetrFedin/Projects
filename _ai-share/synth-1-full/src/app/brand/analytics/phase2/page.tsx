'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Database, Download, Layers } from 'lucide-react';
import { FinanceProductionB2BBudgetBadges } from '@/components/brand/SectionBadgeCta';
import { getAnalyticsPhase2Links } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getFactTables, getBuyingSummary } from '@/lib/api/analytics';
import type { FactTableMeta, BuyingAnalyticsSummary } from '@/lib/analytics/phase2-types';
import { ROUTES } from '@/lib/routes';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

const kindLabels: Record<FactTableMeta['kind'], string> = {
  sales: 'Продажи',
  purchases: 'Закупки',
  inventory: 'Остатки',
  production: 'Производство',
  returns: 'Возвраты',
};

export default function AnalyticsPhase2Page() {
  const [factTables, setFactTables] = useState<FactTableMeta[]>([]);
  const [buyingSummary, setBuyingSummary] = useState<BuyingAnalyticsSummary | null>(null);

  useEffect(() => {
    getFactTables().then(setFactTables);
    getBuyingSummary().then(setBuyingSummary);
  }, []);

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
>>>>>>> recover/cabinet-wip-from-stash
        title="Analytics Phase 2"
        leadPlain="ETL в fact_* / snapshot_*, buying analytics API, дашборды план/факт и закупки. Связь с финансами, Production, B2B заказами, 1С/Мой Склад."
        eyebrow={
          <Button variant="ghost" size="icon" className="-ml-2 shrink-0" asChild>
            <Link href={ROUTES.brand.analyticsBi} aria-label="Назад к BI">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
        actions={
          <Button variant="outline" size="sm" disabled title="При подключении API">
            <Download className="mr-2 h-4 w-4" /> Импорт 1С/Мой Склад
          </Button>
        }
      />
<<<<<<< HEAD
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.brand.analyticsBi}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold uppercase">Analytics Phase 2</h1>
        </div>
        <Button variant="outline" size="sm" disabled title="При подключении API">
          <Download className="mr-2 h-4 w-4" /> Импорт 1С/Мой Склад
        </Button>
=======
      <div className="flex flex-wrap gap-2">
        <FinanceProductionB2BBudgetBadges />
>>>>>>> recover/cabinet-wip-from-stash
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Fact-таблицы и снапшоты
          </CardTitle>
          <CardDescription>ETL загрузки. При API — pipeline в fact_* и snapshot_*.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {factTables.map((t) => (
              <li
                key={t.name}
<<<<<<< HEAD
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3"
=======
                className="bg-bg-surface2 border-border-subtle flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <span className="font-mono text-sm">{t.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {kindLabels[t.kind]}
                  </Badge>
<<<<<<< HEAD
                  <span className="text-xs text-slate-500">
=======
                  <span className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                    {t.rowCount.toLocaleString()} строк ·{' '}
                    {t.lastLoadedAt?.slice(0, 16).replace('T', ' ')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
<<<<<<< HEAD
          <p className="mt-3 text-xs text-slate-400">
=======
          <p className="text-text-muted mt-3 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
            API: ANALYTICS_PHASE2_API.factTables, snapshots.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" /> Buying Analytics
            {buyingSummary ? ` — ${buyingSummary.periodKey}` : ''}
          </CardTitle>
          <CardDescription>
            Закупки по партнёрам, план/факт. Дашборды при подключении API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {buyingSummary && (
            <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
<<<<<<< HEAD
                <p className="text-xs text-slate-500">Заказано, ₽</p>
=======
                <p className="text-text-secondary text-xs">Заказано, ₽</p>
>>>>>>> recover/cabinet-wip-from-stash
                <p className="text-lg font-semibold">
                  {buyingSummary.totalOrderedRub.toLocaleString('ru')}
                </p>
              </div>
              <div>
<<<<<<< HEAD
                <p className="text-xs text-slate-500">Получено, ₽</p>
=======
                <p className="text-text-secondary text-xs">Получено, ₽</p>
>>>>>>> recover/cabinet-wip-from-stash
                <p className="text-lg font-semibold">
                  {buyingSummary.totalReceivedRub.toLocaleString('ru')}
                </p>
              </div>
              <div>
<<<<<<< HEAD
                <p className="text-xs text-slate-500">Заказов</p>
=======
                <p className="text-text-secondary text-xs">Заказов</p>
>>>>>>> recover/cabinet-wip-from-stash
                <p className="text-lg font-semibold">{buyingSummary.orderCount}</p>
              </div>
            </div>
          )}
<<<<<<< HEAD
          <p className="text-xs text-slate-400">
=======
          <p className="text-text-muted text-xs">
>>>>>>> recover/cabinet-wip-from-stash
            API: ANALYTICS_PHASE2_API.buyingSummary, dashboardPlanFact. Импорт: 1С, Мой Склад.
          </p>
        </CardContent>
      </Card>
      <RelatedModulesBlock
        links={getAnalyticsPhase2Links()}
        title="Финансы, Production, B2B заказы, 1С/Мой Склад"
      />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
