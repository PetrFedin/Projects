'use client';

import { useWebSocket } from '@/hooks/useWebSocket';
import { useNotifications } from '@/providers/notifications-provider';
import { useEffect, useRef } from 'react';

/**
 * Bridges WebSocket events to NotificationsProvider.
 * When NEXT_PUBLIC_WS_URL is set, real-time events (order, qc, edo, sla, payment, po, system)
 * are pushed into the in-app notification stream.
 */
export function WebSocketNotificationsBridge() {
  const { addNotification } = useNotifications();
  const addRef = useRef(addNotification);
  addRef.current = addNotification;

  const onEvent = (ev: { type: string; title: string; body?: string; href?: string }) => {
    if (ev.type === 'ping') return;
    const type = (ev.type as 'order' | 'qc' | 'edo' | 'sla' | 'payment' | 'po' | 'system') || 'system';
    addRef.current({
      type,
      title: ev.title,
      body: ev.body,
      href: ev.href,
    });
  };

  useWebSocket(onEvent);
  return null;
}
