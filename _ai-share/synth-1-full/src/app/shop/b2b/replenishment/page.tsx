'use client';

import React from 'react';
import SmartReplenishment from '@/components/shop/replenishment/SmartReplenishment';
import { RegistryPageShell } from '@/components/design-system';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';

export default function SmartReplenishmentPage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto px-4 py-12">
      <SmartReplenishment />
    </div>
=======
    <RegistryPageShell className="max-w-5xl space-y-6">
      <ShopB2bContentHeader lead="AI-пополнение по POS и остаткам; связь с заказами B2B и трекингом." />
      <ShopAnalyticsSegmentErpStrip />
      <SmartReplenishment />

      <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="shop-b2b-replenishment-retail-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link
            href={ROUTES.shop.analyticsFootfall}
            data-testid="shop-b2b-replenishment-footfall-link"
          >
            Трафик по зонам
          </Link>
        </Button>
        <B2bMarginAnalysisHubButton />
      </div>
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
