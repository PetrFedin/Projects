'use client';

import { createContext, useContext, useCallback } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useNotifications } from '@/providers/notifications-provider';
import type { WSMessage } from '@/hooks/useWebSocket';

interface WebSocketContextType {
  connected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { addNotification } = useNotifications();

  const handleMessage = useCallback(
    (msg: WSMessage) => {
      if (msg.type === 'notification' && msg.payload) {
        addNotification({
          type: msg.payload.type as 'sla' | 'qc' | 'po' | 'payment' | 'order' | 'edo' | 'system',
          title: msg.payload.title,
          body: msg.payload.body,
          href: msg.payload.href,
        });
      }
      if (msg.type === 'order_status') {
        addNotification({
          type: 'order',
          title: `Заказ #${msg.orderId}`,
          body: `Статус: ${msg.status}`,
          href: `/shop/b2b/orders/${msg.orderId}`,
        });
      }
      if (msg.type === 'qc_update') {
        addNotification({
          type: 'qc',
          title: 'QC обновление',
          body: `Коллекция ${msg.collectionId}: ${msg.status}`,
          href: '/brand/production',
        });
      }
      if (msg.type === 'edo_document') {
        addNotification({
          type: 'edo',
          title: 'ЭДО документ',
          body: `Документ ${msg.docId}: ${msg.status}`,
          href: '/brand/compliance',
        });
      }
    },
    [addNotification]
  );

  const { connected } = useWebSocket({
    onMessage: handleMessage,
    enabled: !!process.env.NEXT_PUBLIC_WS_URL,
  });

  return (
    <WebSocketContext.Provider value={{ connected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const ctx = useContext(WebSocketContext);
  return ctx ?? { connected: false };
}
