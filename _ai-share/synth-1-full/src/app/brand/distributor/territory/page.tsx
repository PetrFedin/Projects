'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowLeft, ShieldAlert } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { B2BOrdersPartnersDistributorsBadges } from '@/components/brand/SectionBadgeCta';
import { B2BIntegrationStatusWidget } from '@/components/b2b/B2BIntegrationStatusWidget';
import { getTerritoryProtectionLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { listRules, type TerritoryRule } from '@/lib/distributor/territory-protection';

const actionLabels: Record<TerritoryRule['action'], string> = {
  allow: 'Разрешено',
  block: 'Блокировка',
  warning: 'Предупреждение',
};

export default function TerritoryProtectionPage() {
  const [rules, setRules] = useState<TerritoryRule[]>([]);

  useEffect(() => {
    listRules().then(setRules);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Territory Protection Logic"
        description="Блокировка заказов от магазинов вне эксклюзивного региона дистрибьютора. Связь с B2B заказами, партнёрами и квотами. При API — проверка при создании заказа."
        icon={MapPin}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        badges={<B2BOrdersPartnersDistributorsBadges />}
      />
      <div className="flex items-center gap-3">
        <Link href={ROUTES.brand.distributors}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold uppercase">Territory Protection</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" /> Правила по регионам
          </CardTitle>
          <CardDescription>Заказы от ритейлеров вне указанных регионов блокируются или помечаются предупреждением.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {rules.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-medium">Дистрибьютор D01</p>
                  <p className="text-xs text-slate-500">{r.regions.join(', ')} → {actionLabels[r.action]}</p>
                </div>
                <Badge variant={r.action === 'block' ? 'destructive' : 'outline'} className="text-[10px]">{actionLabels[r.action]}</Badge>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 mt-3">API: TERRITORY_PROTECTION_API — правила, check при создании заказа.</p>
        </CardContent>
      </Card>
      <B2BIntegrationStatusWidget settingsHref={ROUTES.brand.integrations} />
      <RelatedModulesBlock links={getTerritoryProtectionLinks()} title="B2B заказы, партнёры, квоты" />
    </div>
  );
}
