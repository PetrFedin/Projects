import 'server-only';

import {
  isWorkshop2RedisConfigured,
  publishWorkshop2RedisEvent,
  subscribeWorkshop2RedisRoom,
} from '@/lib/server/workshop2-redis-pubsub';
import type { Workshop2RealtimeEvent } from '@/lib/server/workshop2-realtime-hub';

const REDIS_ROOM = 'platform-core:handoff-queue';

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
    if (event.type !== 'HANDOFF_QUEUE_BUMP') return;
    notifyLocalListeners();
  });
}

export function isPlatformCoreHandoffQueueRedisEnabled(): boolean {
  return isWorkshop2RedisConfigured();
}

export function bumpPlatformCoreHandoffQueue(factoryId?: string): void {
  notifyLocalListeners();
  if (!isWorkshop2RedisConfigured()) return;
  void publishWorkshop2RedisEvent(REDIS_ROOM, {
    type: 'HANDOFF_QUEUE_BUMP',
    factoryId: factoryId?.trim(),
    ts: new Date().toISOString(),
  }).catch(() => {
    /* best-effort */
  });
}

export function subscribePlatformCoreHandoffQueue(listener: () => void): () => void {
  ensureRedisBridge();
  listeners.add(listener);
  return () => listeners.delete(listener);
}
