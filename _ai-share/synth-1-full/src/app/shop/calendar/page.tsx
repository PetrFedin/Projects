'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import StyleCalendar from '@/components/user/style-calendar';
import { B2bOrderUrlContextBanner } from '@/components/b2b/B2bOrderUrlContextBanner';

function ShopCalendarBody() {
  const searchParams = useSearchParams();
  const contextSearchSeed = useMemo(() => {
    const parts = [
      searchParams.get('q')?.trim(),
      searchParams.get('sku')?.trim(),
      searchParams.get('season')?.trim(),
      searchParams.get('order')?.trim(),
      searchParams.get('orderId')?.trim(),
    ].filter(Boolean) as string[];
    return parts.join(' ');
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <B2bOrderUrlContextBanner variant="shop" className="rounded-xl" />
      <StyleCalendar
        initialRole="shop"
        contextSearchSeed={contextSearchSeed || undefined}
      />
    </div>
  );
}

export default function ShopCalendarPage() {
  return (
    <CabinetPageContent maxWidth="5xl" className="space-y-4 px-4 py-6 pb-24 sm:px-6">
      <Suspense
        fallback={<div className="text-text-secondary py-10 text-sm">Загрузка календаря…</div>}
      >
        <ShopCalendarBody />
      </Suspense>
    </CabinetPageContent>
  );
}
