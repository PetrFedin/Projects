'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, ArrowLeft, TrendingUp } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { PreOrderQuotaBadges } from '@/components/brand/SectionBadgeCta';
import { B2BIntegrationStatusWidget } from '@/components/b2b/B2BIntegrationStatusWidget';
import { getPreOrderQuotaLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import {
  listPreOrderQuotaCampaigns,
  type PreOrderQuotaCampaign,
} from '@/lib/distributor/pre-order-quota';

export default function PreOrderQuotaPage() {
  const [campaigns, setCampaigns] = useState<PreOrderQuotaCampaign[]>([]);

  useEffect(() => {
    listPreOrderQuotaCampaigns().then(setCampaigns);
  }, []);

  const campaign = campaigns[0];

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
        title="Pre-Order Quota Management"
        description="Распределение дефицитных артикулов между дилерами по KPI. Связь с Pre-order, B2B заказами и планированием. При API — публикация квот, блокировка сверх лимита."
        icon={Package}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={<PreOrderQuotaBadges />}
      />
      <div className="flex items-center gap-3">
        <Link href={ROUTES.brand.distributors}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold uppercase">Pre-Order Quota</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> {campaign?.title ?? 'Pre-Order Quota'}
          </CardTitle>
          <CardDescription>
            Квоты по артикулам и дистрибьюторам. KPI влияет на долю при дефиците.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!campaign && <p className="text-sm text-slate-500">Загрузка квот...</p>}
          {campaign?.skuQuotas?.map((sq) => (
            <div key={sq.skuId} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="font-medium">
                {sq.skuName ?? sq.skuId} · всего {sq.totalUnits} шт
              </p>
              <ul className="mt-2 text-sm text-slate-600">
                {sq.allocated.map((a, i) => (
                  <li key={i}>
                    Д{a.distributorId}: {a.units} шт
                    {a.kpiScore != null ? ` (KPI ${a.kpiScore})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {campaign && (
            <Badge variant="outline" className="text-[10px]">
              {campaign.status}
            </Badge>
          )}
          <p className="text-xs text-slate-400">
            API: PRE_ORDER_QUOTA_API — кампании, распределение, публикация.
          </p>
        </CardContent>
      </Card>
      <B2BIntegrationStatusWidget settingsHref={ROUTES.brand.integrations} />
      <RelatedModulesBlock
        links={getPreOrderQuotaLinks()}
        title="Pre-order, B2B заказы, планирование"
      />
    </div>
  );
}
