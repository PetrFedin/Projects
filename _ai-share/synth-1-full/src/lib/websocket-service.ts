/**
 * WebSocket service for real-time notifications.
 * Connects to NEXT_PUBLIC_WS_URL when set, falls back to polling.
 */

export type WsEventType = 'order' | 'qc' | 'edo' | 'sla' | 'payment' | 'po' | 'system';

export interface WsEvent {
  type: WsEventType;
  id?: string;
  title: string;
  body?: string;
  href?: string;
  payload?: Record<string, unknown>;
  ts: string;
}

type MessageHandler = (event: WsEvent) => void;

let ws: WebSocket | null = null;
let handlers = new Set<MessageHandler>();
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let pingInterval: ReturnType<typeof setInterval> | null = null;
const RECONNECT_DELAY = 5000;
const PING_INTERVAL = 30000;

function clearTimers() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
}

function parseMessage(data: string | Blob): WsEvent | null {
  try {
    if (typeof data === 'string') {
      const parsed = JSON.parse(data) as WsEvent;
      if (parsed.type === 'ping') return null;
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function connect(url: string) {
  if (typeof window === 'undefined') return;
  try {
    ws = new WebSocket(url);
    ws.onopen = () => {
      clearTimers();
      pingInterval = setInterval(() => {
        ws?.readyState === WebSocket.OPEN &&
          ws.send(JSON.stringify({ type: 'ping', ts: new Date().toISOString() }));
      }, PING_INTERVAL);
    };
    ws.onmessage = (e) => {
      const ev = parseMessage(e.data);
      if (ev) {
        handlers.forEach((h) => h(ev));
      }
    };
    ws.onclose = () => {
      clearTimers();
      ws = null;
      reconnectTimeout = setTimeout(() => connect(url), RECONNECT_DELAY);
    };
    ws.onerror = () => {};
  } catch {
    ws = null;
  }
}

export function initWebSocket() {
  const url = process.env.NEXT_PUBLIC_WS_URL;
  if (url && typeof window !== 'undefined') {
    connect(url);
  }
}

export function closeWebSocket() {
  clearTimers();
  if (ws) {
    ws.close();
    ws = null;
  }
}

export function subscribe(handler: MessageHandler): () => void {
  handlers.add(handler);
  return () => handlers.delete(handler);
}
