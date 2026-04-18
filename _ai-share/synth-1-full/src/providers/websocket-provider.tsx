'use client';

import { createContext, useContext, useCallback } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useNotifications } from '@/providers/notifications-provider';
import type { WSMessage } from '@/hooks/useWebSocket';
import type { RealtimeTransportMode } from '@/lib/realtime/browser-transport';
import {
  SYNTHA_B2B_FINANCE_REFRESH,
  SYNTHA_B2B_INTEGRATIONS_REFRESH,
  SYNTHA_PROCESS_REFRESH,
  type B2BFinanceRefreshDetail,
  type ProcessRefreshDetail,
} from '@/lib/realtime/syntha-client-events';
import { processLiveUrl, ROUTES } from '@/lib/routes';

interface WebSocketContextType {
  connected: boolean;
  transport: RealtimeTransportMode;
  reconnectAttempt: number;
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
          href: ROUTES.shop.b2bOrder(msg.orderId),
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
      if (msg.type === 'b2b_finance_refresh') {
        addNotification({
          type: 'payment',
          title: 'Платёж зачислен',
          body:
            msg.amount != null
              ? `Заказ ${msg.orderId} · ${msg.amount.toLocaleString('ru-RU')} ₽`
              : `Заказ ${msg.orderId}`,
          href: '/shop/b2b/payment',
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent(SYNTHA_B2B_FINANCE_REFRESH, {
              detail: { orderId: msg.orderId } satisfies B2BFinanceRefreshDetail,
            })
          );
        }
      }
      if (msg.type === 'b2b_integrations_refresh') {
        addNotification({
          type: 'order',
          title: 'Экспорт принят',
          body: msg.orderId
            ? `Заказ ${msg.orderId}${msg.provider ? ` · ${msg.provider}` : ''}`
            : 'Интеграция: экспорт',
          href: '/shop/b2b/settings',
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(SYNTHA_B2B_INTEGRATIONS_REFRESH));
        }
      }
      if (msg.type === 'process_refresh') {
        addNotification({
          type: 'system',
          title: msg.kind === 'runtime' ? 'Процесс: обновлён runtime' : 'Процесс: обновлена схема',
          body: `${msg.processId}${msg.version != null ? ` · v${msg.version}` : ''}`,
          href: processLiveUrl(msg.processId, msg.contextId),
        });
        if (typeof window !== 'undefined') {
          const detail: ProcessRefreshDetail = {
            processId: msg.processId,
            contextId: msg.contextId,
            kind: msg.kind,
            version: msg.version,
          };
          window.dispatchEvent(new CustomEvent(SYNTHA_PROCESS_REFRESH, { detail }));
        }
      }
    },
    [addNotification]
  );

  const { connected, transport, reconnectAttempt } = useWebSocket({
    onMessage: handleMessage,
    enabled: true,
  });

<<<<<<< HEAD
  return <WebSocketContext.Provider value={{ connected }}>{children}</WebSocketContext.Provider>;
=======
  return (
    <WebSocketContext.Provider value={{ connected, transport, reconnectAttempt }}>
      {children}
    </WebSocketContext.Provider>
  );
>>>>>>> recover/cabinet-wip-from-stash
}

export function useWebSocketContext() {
  const ctx = useContext(WebSocketContext);
  return ctx ?? { connected: false, transport: 'idle' as const, reconnectAttempt: 0 };
}
