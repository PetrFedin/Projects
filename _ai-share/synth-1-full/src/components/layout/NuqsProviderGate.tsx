'use client';

import { usePathname } from 'next/navigation';
import { NuqsProvider } from '@/components/providers/nuqs-provider';
import { shouldMountNuqsProvider } from '@/lib/layout/nuqs-provider-route';

/**
 * `nuqs` нужен только на public shell (кабинеты используют свой `useQueryState` без NuqsAdapter).
 */
export function NuqsProviderGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (!shouldMountNuqsProvider(pathname)) {
    return <>{children}</>;
  }

  return <NuqsProvider>{children}</NuqsProvider>;
}
