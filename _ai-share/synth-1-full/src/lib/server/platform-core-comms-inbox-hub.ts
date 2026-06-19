import 'server-only';

import {
  isWorkshop2RedisConfigured,
  publishWorkshop2RedisEvent,
  subscribeWorkshop2RedisRoom,
} from '@/lib/server/workshop2-redis-pubsub';
import type { Workshop2RealtimeEvent } from '@/lib/server/workshop2-realtime-hub';

const REDIS_ROOM = 'platform-core:comms-inbox';

/** In-process + optional Redis сигнал для SSE refetch inbox / contextual threads. */
const listeners = new Set<() => void>();
let redisBridgeReady = false;

function notifyLocalListeners(): void {
  for (const listener of listeners) {
    try {
      listener();
    } catch {
      /* ignore */
    }
  }
}

function ensureRedisBridge(): void {
  if (redisBridgeReady || !isWorkshop2RedisConfigured()) return;
  redisBridgeReady = true;
  subscribeWorkshop2RedisRoom(REDIS_ROOM, (event: Workshop2RealtimeEvent) => {
    if (event.type !== 'COMMS_INBOX_BUMP') return;
    notifyLocalListeners();
  });
}

export function isPlatformCoreCommsInboxRedisEnabled(): boolean {
  return isWorkshop2RedisConfigured();
}

export function bumpPlatformCoreCommsInbox(reason?: string): void {
  notifyLocalListeners();
  if (!isWorkshop2RedisConfigured()) return;
  void publishWorkshop2RedisEvent(REDIS_ROOM, {
    type: 'COMMS_INBOX_BUMP',
    reason,
    ts: new Date().toISOString(),
  }).catch(() => {
    /* best-effort */
  });
}

export function subscribePlatformCoreCommsInbox(listener: () => void): () => void {
  ensureRedisBridge();
  listeners.add(listener);
  return () => listeners.delete(listener);
}
