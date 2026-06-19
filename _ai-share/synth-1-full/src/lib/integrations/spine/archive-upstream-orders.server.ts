/**
 * Shared archive upstream list handlers (ADR-002 · spine import).
 * Без demo-fixture: 503 если канал не настроен, массив если пусто.
 */
import 'server-only';

import { NextResponse } from 'next/server';

export type ArchiveUpstreamQuery = {
  since?: string;
  until?: string;
  status?: string;
  limit: number;
};

export function parseArchiveUpstreamQuery(request: Request): ArchiveUpstreamQuery {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const parsed = limitParam ? parseInt(limitParam, 10) : 20;
  return {
    since: searchParams.get('since')?.trim() || undefined,
    until: searchParams.get('until')?.trim() || undefined,
    status: searchParams.get('status')?.trim() || undefined,
    limit: Math.min(50, Math.max(1, Number.isFinite(parsed) ? parsed : 20)),
  };
}

export function archiveUpstreamNotConfiguredResponse(channelLabelRu: string): NextResponse {
  return NextResponse.json(
    {
      ok: false as const,
      error: {
        code: 'CHANNEL_NOT_CONFIGURED',
        messageRu: `${channelLabelRu}: канал не настроен. Задайте credentials в deployment config.`,
      },
    },
    { status: 503 }
  );
}

export function archiveUpstreamFetchFailedResponse(messageRu: string): NextResponse {
  return NextResponse.json(
    {
      ok: false as const,
      error: { code: 'UPSTREAM_FETCH_FAILED', messageRu },
    },
    { status: 502 }
  );
}

/** Нормализует upstream row для spine batch import (unwrap `.raw`). */
export {
  toSpineImportOrderPayload,
  toSpineImportOrderPayloadList,
} from './spine-import-payload.utils';
