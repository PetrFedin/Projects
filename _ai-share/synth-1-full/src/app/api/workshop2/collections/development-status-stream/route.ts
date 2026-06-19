/**
 * GET — SSE push при смене development-status (poll + in-process hub bump).
 * Query: collectionIds — comma-separated, max 8.
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  fingerprintWorkshop2DevelopmentStatus,
  formatPlatformCoreDevelopmentStatusSseData,
} from '@/lib/platform-core-development-status-sse';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import {
  isPlatformCoreDevelopmentStatusRedisEnabled,
  subscribePlatformCoreDevelopmentStatus,
} from '@/lib/server/platform-core-development-status-hub';
import { getWorkshop2DevelopmentStatus } from '@/lib/server/workshop2-development-status';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_COLLECTIONS = 8;
const POLL_MS = 8_000;

export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const raw = req.nextUrl.searchParams.get('collectionIds')?.trim() ?? '';
  const collectionIds = [
    ...new Set(
      raw
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    ),
  ].slice(0, MAX_COLLECTIONS);

  if (collectionIds.length === 0) {
    return NextResponse.json(
      { ok: false, messageRu: 'Укажите collectionIds через запятую.' },
      { status: 400 }
    );
  }

  const factoryId =
    req.nextUrl.searchParams.get('factoryId')?.trim() || PLATFORM_CORE_DEMO.factoryId;
  const encoder = new TextEncoder();
  let lastFingerprint = '';
  let pollTimer: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const sendRaw = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          /* client disconnected */
        }
      };

      const poll = async () => {
        try {
          const statuses = await Promise.all(
            collectionIds.map((collectionId) =>
              getWorkshop2DevelopmentStatus(collectionId, factoryId, { skipRangePlanner: false })
            )
          );
          const fingerprint = statuses
            .map((status) => fingerprintWorkshop2DevelopmentStatus(status))
            .sort()
            .join('||');
          if (fingerprint !== lastFingerprint) {
            lastFingerprint = fingerprint;
            sendRaw(
              formatPlatformCoreDevelopmentStatusSseData({
                type: 'development_update',
                ts: new Date().toISOString(),
                collectionIds,
                fingerprint,
              })
            );
          }
        } catch {
          /* best-effort */
        }
      };

      sendRaw(
        formatPlatformCoreDevelopmentStatusSseData({ type: 'ping', ts: new Date().toISOString() })
      );
      void poll();

      const onBump = () => void poll();
      const unsubscribe = subscribePlatformCoreDevelopmentStatus(onBump);
      pollTimer = setInterval(() => void poll(), POLL_MS);

      req.signal.addEventListener('abort', () => {
        if (pollTimer) clearInterval(pollTimer);
        unsubscribe();
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Platform-Core-Development-Sse': isPlatformCoreDevelopmentStatusRedisEnabled()
        ? 'poll+bump+redis'
        : 'poll+bump',
    },
  });
}
