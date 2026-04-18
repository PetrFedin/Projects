'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DigitalWorkplaceMap } from '@/components/dashboard';
import { useRbac } from '@/hooks/useRbac';
import { useUserContext } from '@/hooks/useUserContext';
import { resolveB2bWorkspaceRole } from '@/components/b2b/B2BWorkspaceModuleGrid';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';

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

  return (
    <RegistryPageShell className="flex h-[100dvh] min-h-[100dvh] max-w-none flex-col !p-0">
      <DigitalWorkplaceMap
        primaryRole={primaryRole}
        onClose={() => router.push(ROUTES.shop.home)}
      />
    </RegistryPageShell>
  );
}
