'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { RealtimeTransportMode } from '@/lib/realtime/browser-transport';

export type WSMessage =
  | { type: 'order_status'; orderId: string; status: string }
  | { type: 'qc_update'; collectionId: string; status: string }
  | { type: 'edo_document'; docId: string; status: string }
  | { type: 'notification'; payload: { type: string; title: string; body?: string; href?: string } }
  | { type: 'reconnect' }
  | { type: 'b2b_finance_refresh'; orderId: string; amount?: number }
  | { type: 'b2b_integrations_refresh'; orderId?: string; provider?: string }
  | {
      type: 'process_refresh';
      processId: string;
      contextId: string;
      kind: 'runtime' | 'definition';
      version?: number;
    };

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || '';

function parseMessage(data: string): WSMessage | null {
  try {
    return JSON.parse(data) as WSMessage;
  } catch {
    return null;
  }
}

export interface UseWebSocketOptions {
  onMessage?: (msg: WSMessage) => void;
  enabled?: boolean;
}

export function useWebSocket({ onMessage, enabled = true }: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const connect = useCallback(() => {
    if (!WS_URL || !enabled) return;
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    ws.onmessage = (ev) => {
      const msg = parseMessage(ev.data);
      if (msg) onMessageRef.current?.(msg);
    };
    wsRef.current = ws;
  }, [enabled]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setConnected(false);
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  const transport: RealtimeTransportMode = connected ? 'ws' : 'idle';
  return { connected, transport, reconnectAttempt: 0 };
}
