'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, ArrowLeft, Database, Download, Layers } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { FinanceProductionB2BBudgetBadges } from '@/components/brand/SectionBadgeCta';
import { getAnalyticsPhase2Links } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getFactTables, getBuyingSummary } from '@/lib/api/analytics';
import type { FactTableMeta, BuyingAnalyticsSummary } from '@/lib/analytics/phase2-types';
import { ROUTES } from '@/lib/routes';

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
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Analytics Phase 2"
        description="ETL в fact_* / snapshot_*, buying analytics API, дашборды план/факт и закупки. Связь с финансами, Production, B2B заказами, 1С/Мой Склад."
        icon={BarChart3}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={<FinanceProductionB2BBudgetBadges />}
      />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.brand.analyticsBi}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold uppercase">Analytics Phase 2</h1>
        </div>
        <Button variant="outline" size="sm" disabled title="При подключении API"><Download className="h-4 w-4 mr-2" /> Импорт 1С/Мой Склад</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> Fact-таблицы и снапшоты</CardTitle>
          <CardDescription>ETL загрузки. При API — pipeline в fact_* и snapshot_*.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {factTables.map((t) => (
              <li key={t.name} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-mono text-sm">{t.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{kindLabels[t.kind]}</Badge>
                  <span className="text-xs text-slate-500">{t.rowCount.toLocaleString()} строк · {t.lastLoadedAt?.slice(0, 16).replace('T', ' ')}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 mt-3">API: ANALYTICS_PHASE2_API.factTables, snapshots.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5" /> Buying Analytics{buyingSummary ? ` — ${buyingSummary.periodKey}` : ''}</CardTitle>
          <CardDescription>Закупки по партнёрам, план/факт. Дашборды при подключении API.</CardDescription>
        </CardHeader>
        <CardContent>
          {buyingSummary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div><p className="text-xs text-slate-500">Заказано, ₽</p><p className="text-lg font-semibold">{buyingSummary.totalOrderedRub.toLocaleString('ru')}</p></div>
            <div><p className="text-xs text-slate-500">Получено, ₽</p><p className="text-lg font-semibold">{buyingSummary.totalReceivedRub.toLocaleString('ru')}</p></div>
            <div><p className="text-xs text-slate-500">Заказов</p><p className="text-lg font-semibold">{buyingSummary.orderCount}</p></div>
          </div>
          )}
          <p className="text-xs text-slate-400">API: ANALYTICS_PHASE2_API.buyingSummary, dashboardPlanFact. Импорт: 1С, Мой Склад.</p>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getAnalyticsPhase2Links()} title="Финансы, Production, B2B заказы, 1С/Мой Склад" />
    </div>
  );
}
