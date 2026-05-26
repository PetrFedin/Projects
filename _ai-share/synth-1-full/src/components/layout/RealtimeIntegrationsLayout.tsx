'use client';

import { usePathname } from 'next/navigation';
import { shouldMountB2BStateProvider } from '@/lib/layout/b2b-state-route';
import { WebSocketProvider } from '@/providers/websocket-provider';
import { RealtimeFallbackBridge } from '@/components/realtime/realtime-fallback-bridge';

/**
 * Real-time integrations: WebSocket when NEXT_PUBLIC_WS_URL is set,
 * otherwise polling /api/notifications/feed.
 * Must be inside NotificationsProvider — тот же scope, что NotificationsProviderGate.
 */
export function RealtimeIntegrationsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!shouldMountB2BStateProvider(pathname)) {
    return children;
  }
  return (
    <WebSocketProvider>
      <RealtimeFallbackBridge />
      {children}
    </WebSocketProvider>
  );
}
