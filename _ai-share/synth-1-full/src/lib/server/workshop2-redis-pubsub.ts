import 'server-only';
import type { Workshop2RealtimeEvent } from '@/lib/server/workshop2-realtime-hub';

const CHANNEL_PREFIX = 'workshop2:rt:';

let publisherReady: Promise<unknown> | null = null;
let subscriberReady: Promise<unknown> | null = null;
let subscriberClient: { quit: () => Promise<void> } | null = null;

export function isWorkshop2RedisConfigured(): boolean {
  return Boolean(process.env.REDIS_URL?.trim());
}

function channelForRoom(room: string): string {
  return `${CHANNEL_PREFIX}${room}`;
}

async function getRedisModule(): Promise<typeof import('redis') | null> {
  if (!isWorkshop2RedisConfigured()) return null;
  try {
    return await import('redis');
  } catch {
    console.warn('[workshop2-redis] пакет redis не установлен — только in-process SSE');
    return null;
  }
}

async function getPublisher(): Promise<import('redis').RedisClientType | null> {
  const redis = await getRedisModule();
  if (!redis) return null;
  if (!publisherReady) {
    publisherReady = (async () => {
      const client = redis.createClient({ url: process.env.REDIS_URL!.trim() });
      client.on('error', (e) => console.warn('[workshop2-redis] publisher', e));
      await client.connect();
      return client;
    })();
  }
  return (await publisherReady) as import('redis').RedisClientType;
}

/** Публикует событие в Redis (multi-instance). */
export async function publishWorkshop2RedisEvent(
  room: string,
  event: Workshop2RealtimeEvent
): Promise<void> {
  const pub = await getPublisher();
  if (!pub) return;
  await pub.publish(channelForRoom(room), JSON.stringify(event));
}

type RoomHandler = (event: Workshop2RealtimeEvent) => void;

const roomHandlers = new Map<string, Set<RoomHandler>>();

/** Подписка на Redis для комнаты (один subscriber на процесс). */
export async function ensureWorkshop2RedisSubscriber(): Promise<void> {
  if (!isWorkshop2RedisConfigured()) return;
  if (subscriberReady) {
    await subscriberReady;
    return;
  }
  subscriberReady = (async () => {
    const redis = await getRedisModule();
    if (!redis) return;
    const sub = redis.createClient({ url: process.env.REDIS_URL!.trim() });
    sub.on('error', (e) => console.warn('[workshop2-redis] subscriber', e));
    await sub.connect();
    subscriberClient = sub as unknown as { quit: () => Promise<void> };
    await sub.pSubscribe(`${CHANNEL_PREFIX}*`, (message, channel) => {
      const room = channel.slice(CHANNEL_PREFIX.length);
      let event: Workshop2RealtimeEvent;
      try {
        event = JSON.parse(message) as Workshop2RealtimeEvent;
      } catch {
        return;
      }
      for (const h of roomHandlers.get(room) ?? []) {
        try {
          h(event);
        } catch (e) {
          console.error('[workshop2-redis] handler', e);
        }
      }
    });
  })();
  await subscriberReady;
}

export function subscribeWorkshop2RedisRoom(room: string, handler: RoomHandler): () => void {
  if (!roomHandlers.has(room)) roomHandlers.set(room, new Set());
  roomHandlers.get(room)!.add(handler);
  void ensureWorkshop2RedisSubscriber();
  return () => {
    roomHandlers.get(room)?.delete(handler);
  };
}
