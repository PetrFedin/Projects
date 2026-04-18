'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import BrandMarketingContentFactoryPage from '@/app/brand/marketing/content-factory/page';

/**
 * CMS: на маршруте /brand/cms — редирект в Content Factory (полноэкранно).
 * Во вкладке «Медиа и контент» (/brand/media) тот же модуль рендерится внутри таба без ухода со страницы.
 */
export default function CMSPage() {
  const pathname = usePathname();
  const router = useRouter();
  const isStandaloneCmsRoute = pathname === '/brand/cms';

  useEffect(() => {
    if (isStandaloneCmsRoute) {
      router.replace('/brand/marketing/content-factory');
    }
  }, [isStandaloneCmsRoute, router]);

  if (isStandaloneCmsRoute) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-500">
        Перенаправление в Content Factory…
      </div>
    );
  }

  return <BrandMarketingContentFactoryPage />;
}
