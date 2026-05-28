'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { shouldMountQueryProvider } from '@/lib/layout/query-provider-route';

const QueryProviderSync = dynamic(
  () =>
    import('@/providers/query-provider').then((m) => ({
      default: m.QueryProvider,
    })),
  { ssr: false, loading: () => null }
);

/** Lazy `@tanstack/react-query` — только `/brand/*`. */
export function QueryProviderGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!shouldMountQueryProvider(pathname)) {
    return children;
  }
  return <QueryProviderSync>{children}</QueryProviderSync>;
}
