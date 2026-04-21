'use client';

import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { DigitalWorkplaceMap } from '@/components/dashboard';
import { useRbac } from '@/hooks/useRbac';
import { useUserContext } from '@/hooks/useUserContext';
import { resolveB2bWorkspaceRole } from '@/components/b2b/B2BWorkspaceModuleGrid';
import { ROUTES } from '@/lib/routes';
import { B2bOrderUrlContextBanner, getSynthaThreeCoresQuickLinksForBuyer } from '@/lib/syntha-priority-cores';
import { cn } from '@/lib/utils';
import { operationalLayoutContract as o } from '@/lib/ui/operational-layout-contract';

/**
 * Полноэкранная карта модулей B2B (визуализация связей; пункт «Карта процессов B2B» в сайдбаре).
 * Закрытие ведёт в дашборд ритейла; роль берётся из контекста.
 */
export default function ShopB2BWorkspaceMapPage() {
  const router = useRouter();
  const { role } = useRbac();
  const { isRetailer, isBrand, isBuyer } = useUserContext();
  const primaryRole = useMemo(
    () => resolveB2bWorkspaceRole(role, { isRetailer, isBrand, isBuyer }),
    [role, isRetailer, isBrand, isBuyer]
  );

  const quick = getSynthaThreeCoresQuickLinksForBuyer();

  return (
    <CabinetPageContent
      maxWidth="full"
      className="flex h-[100dvh] min-h-[100dvh] flex-col !p-0"
    >
      <div
        className={cn(
          o.panel,
          'shrink-0 space-y-2 border-b border-border-default px-3 py-2 shadow-none sm:px-4'
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-text-muted text-[9px] font-black uppercase tracking-[0.18em]">
            Три ядра · быстрые функции
          </p>
          <p className="text-text-muted max-w-xl text-[9px] leading-snug">
            Надстройка (чат/календарь) не заменяет ТЗ и B2B — те же переходы, что на реестрах и в
            create-order.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quick.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-text-primary hover:bg-bg-surface2 border-border-subtle rounded-md border px-2 py-1 text-[10px] font-semibold transition-colors hover:text-accent-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Suspense fallback={null}>
          <B2bOrderUrlContextBanner variant="shop" className="rounded-lg shadow-none" />
        </Suspense>
      </div>
      <div className="min-h-0 flex-1">
        <DigitalWorkplaceMap
          primaryRole={primaryRole}
          onClose={() => router.push(ROUTES.shop.home)}
        />
      </div>
    </CabinetPageContent>
  );
}
