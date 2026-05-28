'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { shouldMountB2BStateProvider } from '@/lib/layout/b2b-state-route';

const B2BStateProviderSync = dynamic(
  () =>
    import('@/components/layout/B2BStateProviderSync').then((m) => ({
      default: m.B2BStateProviderSync,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

/** Не тянет `b2b-state` на factory/distributor/client/admin/academy/wallet. */
export function B2BStateProviderGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!shouldMountB2BStateProvider(pathname)) {
    return children;
  }
  return <B2BStateProviderSync>{children}</B2BStateProviderSync>;
}
