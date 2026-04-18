'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { RegistryPageShell } from '@/components/design-system';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { BarChart3, Calculator, PieChart } from 'lucide-react';

/** Единый хаб среза «Маржа»: калькулятор, отчётность, landed cost и перекрёстные ссылки на аналитику. */
export default function B2bMarginAnalysisHubPage() {
  return (
    <RegistryPageShell className="max-w-4xl space-y-6" data-testid="page-shop-b2b-margin-analysis">
      <ShopB2bContentHeader lead="Срез «Маржа»: инструменты и отчёты по закупке и рознице в одном месте." />
      <ShopAnalyticsSegmentErpStrip />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calculator className="text-text-secondary h-4 w-4" />
              Калькулятор
            </CardTitle>
            <CardDescription>Маржа в корзине (NuOrder-style)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-black uppercase"
              asChild
            >
              <Link href={ROUTES.shop.b2bMarginCalculator}>Открыть</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="text-text-secondary h-4 w-4" />
              Отчёт ASOS
            </CardTitle>
            <CardDescription>По брендам и категориям</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-black uppercase"
              asChild
            >
              <Link href={ROUTES.shop.b2bMarginReport}>Открыть</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="text-text-secondary h-4 w-4" />
              Landed cost
            </CardTitle>
            <CardDescription>Полная себестоимость поставки</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-black uppercase"
              asChild
            >
              <Link href={ROUTES.shop.b2bLandedCost}>Открыть</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          Другие срезы
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="margin-hub-retail-analytics-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.b2bAnalytics} data-testid="margin-hub-b2b-analytics-link">
            Аналитика закупок (B2B)
          </Link>
        </Button>
      </div>

      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Заказы, аналитика, fulfillment"
        className="mt-2"
      />
    </RegistryPageShell>
  );
}
