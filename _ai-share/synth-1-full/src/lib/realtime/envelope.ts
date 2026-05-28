/** Конверт realtime-события (WS/SSE) — минимальная форма для UI. */
export type RealtimeEnvelope = {
  type: string;
  eventId?: string;
  ts: string;
  payload?: unknown;
};
