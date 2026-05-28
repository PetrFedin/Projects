'use client';

import { NotificationsProvider } from '@/providers/notifications-provider';

/** Sync-обёртка — отдельный chunk при dynamic import из gate. */
export function NotificationsProviderSync({ children }: { children: React.ReactNode }) {
  return <NotificationsProvider>{children}</NotificationsProvider>;
}
