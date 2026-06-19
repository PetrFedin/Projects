'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import StyleCalendar from '@/components/user/style-calendar';
import { B2bOrderUrlContextBanner } from '@/components/b2b/B2bOrderUrlContextBanner';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ROUTES } from '@/lib/routes';

function ShopCalendarCoreRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const qs = searchParams?.toString();
    router.replace(qs ? `${ROUTES.shop.b2bCalendar}?${qs}` : ROUTES.shop.b2bCalendar);
  }, [router, searchParams]);

  return (
    <div className="text-text-secondary py-10 text-sm">Перенаправление в календарь закупок…</div>
  );
}

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
      <StyleCalendar initialRole="shop" contextSearchSeed={contextSearchSeed || undefined} />
    </div>
  );
}

export default function ShopCalendarPage() {
  if (isPlatformCoreMode()) {
    return (
      <CabinetPageContent maxWidth="5xl" className="space-y-4 px-4 py-6 pb-24 sm:px-6">
        <Suspense
          fallback={<div className="text-text-secondary py-10 text-sm">Перенаправление…</div>}
        >
          <ShopCalendarCoreRedirect />
        </Suspense>
      </CabinetPageContent>
    );
  }

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
