'use client';

import { useEffect, useRef } from 'react';
import { useNotifications } from '@/providers/notifications-provider';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || '';
const POLL_INTERVAL = 30000;
const POLL_TIMEOUT_MS = 8000;

/**
 * When WebSocket URL is not set, polls /api/notifications/feed for new events
 * and pushes them into NotificationsProvider.
 */
export function RealtimeFallbackBridge() {
  const { addNotification } = useNotifications();
  const lastIdRef = useRef<string | null>(null);
  const addRef = useRef(addNotification);
  const inFlightRef = useRef(false);
  addRef.current = addNotification;

  useEffect(() => {
    if (WS_URL || typeof window === 'undefined') return;

    const poll = async () => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), POLL_TIMEOUT_MS);
      try {
        const token = localStorage.getItem('syntha_access_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(
          `/api/notifications/feed${lastIdRef.current ? `?after=${lastIdRef.current}` : ''}`,
          { headers, signal: controller.signal }
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          events?: Array<{ id: string; type: string; title: string; body?: string; href?: string }>;
          lastId?: string;
        };
        const events = data.events ?? [];
        for (const ev of events) {
          if (ev.id) lastIdRef.current = ev.id;
          addRef.current({
            type: (ev.type || 'system') as
              | 'order'
              | 'qc'
              | 'edo'
              | 'sla'
              | 'payment'
              | 'po'
              | 'system',
            title: ev.title,
            body: ev.body,
            href: ev.href,
          });
        }
        if (data.lastId) lastIdRef.current = data.lastId;
      } catch {
        // ignore
      } finally {
        window.clearTimeout(timeoutId);
        inFlightRef.current = false;
      }
    };

    poll();
    const id = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return null;
}
