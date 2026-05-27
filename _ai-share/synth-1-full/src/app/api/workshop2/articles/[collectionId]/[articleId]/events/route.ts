/**
 * Журнал событий досье (PostgreSQL audit log + file-fallback).
 */

import { NextRequest, NextResponse } from 'next/server';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import {
  appendWorkshop2ServerDossierEvent,
  getWorkshop2ServerDossierRecord,
  listWorkshop2DossierEvents,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  resolveWorkshop2OrganizationId,
  resolveWorkshop2UpdatedBy,
  workshop2DatabaseNotConfiguredResponse,
} from '@/lib/server/workshop2-api-context';
import { getWorkshop2RealtimeHub } from '@/lib/server/workshop2-realtime-hub';
import {
  guardWorkshop2Route,
  WORKSHOP2_EVENTS_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

async function getEvents(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_EVENTS_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return NextResponse.json(
      { ok: false, error: 'invalid_path', message: 'Некорректный путь API' },
      { status: 400 }
    );
  }

  try {
    const record = await getWorkshop2ServerDossierRecord(cid, aid);
    if (!record) {
      return NextResponse.json(
        { ok: false, error: 'not_found', message: 'Досье не найдено' },
        { status: 404 }
      );
    }

    const u = new URL(req.url);
    const eventType = u.searchParams.get('eventType')?.trim() ?? '';
    const limitRaw = Number(u.searchParams.get('limit') ?? 40);
    const limit = Number.isFinite(limitRaw) ? Math.floor(limitRaw) : 40;
    const organizationId = resolveWorkshop2OrganizationId(req);

    const events = await listWorkshop2DossierEvents({
      collectionId: cid,
      articleId: aid,
      limit,
      organizationId,
      ...(eventType ? { eventType } : {}),
    });

    return NextResponse.json({ ok: true, events });
  } catch (e) {
    if (e instanceof Error && e.message.includes('WORKSHOP2_DATABASE_URL_NOT_CONFIGURED')) {
      return NextResponse.json(workshop2DatabaseNotConfiguredResponse(), { status: 503 });
    }
    throw e;
  }
}

export async function POST(req: NextRequest, ctx: RouteCtx) {
  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_json', message: 'Некорректное тело запроса (JSON)' },
      { status: 400 }
    );
  }

  const eventType = String((body as { eventType?: string })?.eventType ?? '').trim();
  const eventPayload = (body as { eventPayload?: Record<string, unknown> })?.eventPayload;
  const payloadBy =
    eventPayload && typeof eventPayload.by === 'string' ? eventPayload.by : undefined;

  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES, { bodyActorLabel: payloadBy });
  if (auth instanceof NextResponse) return auth;

  if (!cid || !aid) {
    return NextResponse.json(
      { ok: false, error: 'invalid_path', message: 'Некорректный путь API' },
      { status: 400 }
    );
  }

  const organizationId = resolveWorkshop2OrganizationId(req);
  const createdBy = resolveWorkshop2UpdatedBy(req, payloadBy, auth.actor) ?? auth.actor?.actorLabel;

  if (!eventType) {
    return NextResponse.json(
      { ok: false, error: 'invalid_event', message: 'Укажите eventType' },
      { status: 400 }
    );
  }

  try {
    const result = await appendWorkshop2ServerDossierEvent({
      collectionId: cid,
      articleId: aid,
      eventType,
      organizationId,
      createdBy,
      ...(eventPayload && typeof eventPayload === 'object' ? { eventPayload } : {}),
    });

    if (!result.ok) {
      if (result.error === 'not_found') {
        return NextResponse.json(
          { ok: false, error: 'not_found', message: 'Досье не найдено' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { ok: false, error: result.error, message: 'Некорректное событие' },
        { status: 400 }
      );
    }

    getWorkshop2RealtimeHub().publishEventAppended({
      collectionId: cid,
      articleId: aid,
      eventId: result.record.id,
      eventType: result.record.eventType,
      version: result.record.version,
      createdAt: result.record.createdAt,
      createdBy: result.record.createdBy,
    });

    return NextResponse.json({
      ok: true,
      id: result.record.id,
      version: result.record.version,
      eventType: result.record.eventType,
      createdAt: result.record.createdAt,
    });
  } catch (e) {
    if (e instanceof Error && e.message.includes('WORKSHOP2_DATABASE_URL_NOT_CONFIGURED')) {
      return NextResponse.json(workshop2DatabaseNotConfiguredResponse(), { status: 503 });
    }
    throw e;
  }
}

export const GET = withWorkshop2ApiErrorRu(getEvents);
