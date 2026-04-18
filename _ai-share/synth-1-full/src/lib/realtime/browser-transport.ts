import type { RealtimeEnvelope } from './envelope';

/** Режим транспорта для UI (хук useWebSocket / WebSocketProvider). */
export type RealtimeTransportMode = 'idle' | 'ws';

type MsgHandler = (ev: RealtimeEnvelope) => void;

const subscribers: MsgHandler[] = [];

const transport = {
  subscribeMessages(handler: MsgHandler): () => void {
    subscribers.push(handler);
    return () => {
      const i = subscribers.indexOf(handler);
      if (i >= 0) subscribers.splice(i, 1);
    };
  },
  stop(): void {
    subscribers.length = 0;
  },
};

export function getRealtimeBrowserTransport(): typeof transport {
  return transport;
}
