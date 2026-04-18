'use client';

import { WebSocketProvider } from '@/providers/websocket-provider';
import { RealtimeFallbackBridge } from '@/components/realtime/realtime-fallback-bridge';

/**
 * Real-time integrations: WebSocket when NEXT_PUBLIC_WS_URL is set,
 * otherwise polling /api/notifications/feed.
 * Must be inside NotificationsProvider.
 */
export function RealtimeIntegrationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <WebSocketProvider>
      <RealtimeFallbackBridge />
      {children}
    </WebSocketProvider>
  );
}
