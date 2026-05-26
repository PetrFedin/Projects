'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { shouldMountUIStateProvider } from '@/lib/layout/ui-state-route';

const UIStateProviderSync = dynamic(
  () =>
    import('@/components/layout/UIStateProviderSync').then((m) => ({
      default: m.UIStateProviderSync,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

/** Не тянет `ui-state` на factory/distributor/admin кроме страниц settings. */
export function UIStateProviderGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!shouldMountUIStateProvider(pathname)) {
    return children;
  }
  return <UIStateProviderSync>{children}</UIStateProviderSync>;
}
