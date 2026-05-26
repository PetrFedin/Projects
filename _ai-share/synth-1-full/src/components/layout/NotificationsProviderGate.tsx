'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { shouldMountB2BStateProvider } from '@/lib/layout/b2b-state-route';

const NotificationsProviderSync = dynamic(
  () =>
    import('@/components/layout/NotificationsProviderSync').then((m) => ({
      default: m.NotificationsProviderSync,
    })),
  { ssr: false }
);

/**
 * Тот же scope, что B2B: на factory/distributor/client/admin/academy/wallet
 * нет useNotifications в дереве страниц.
 */
export function NotificationsProviderGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!shouldMountB2BStateProvider(pathname)) {
    return children;
  }
  return <NotificationsProviderSync>{children}</NotificationsProviderSync>;
}
