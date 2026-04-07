'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Percent, Gift } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { getRelatedLinks } from '@/lib/data/integration-modules';

/** Net terms, First order discount, НДС (РФ). Faire-style: 30/60 дней отсрочки, автоскидка на первый заказ. */
export default function BrandFinanceRfTermsPage() {
  const netTermsLinks = getRelatedLinks('net-terms').map((l) => ({ label: l.label, href: l.href }));

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl animate-in fade-in duration-700">
      <SectionInfoCard
        title="Условия для РФ (Net terms, скидки)"
        description="Отсрочка платежа 30/60 дней для оптовиков (Faire), автоскидка на первый заказ, НДС."
        icon={CreditCard}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">Net terms</Badge>
            <Badge variant="outline" className="text-[9px]">First order</Badge>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" /> Net terms / Отсрочка</CardTitle>
            <CardDescription>30/60 дней для оптовиков. Кредитный лимит по партнёру.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Настройка лимитов и сроков отсрочки платежа.</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href={ROUTES.brand.integrationsErpPlm}>1С синхронизация</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Gift className="h-4 w-4" /> First order discount</CardTitle>
            <CardDescription>Автоматическая скидка на первый заказ нового партнёра.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Процент или фикс. скидка при первом заказе.</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href={ROUTES.brand.buyerApplications}>Анкета онбординга</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <RelatedModulesBlock links={netTermsLinks} title="Связанные модули" />
    </div>
  );
}
