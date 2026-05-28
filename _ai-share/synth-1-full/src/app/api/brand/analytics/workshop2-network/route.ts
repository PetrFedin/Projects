/**
 * GET — Workshop2 network analytics (domain events + calendar aggregate).
 */
import { NextResponse } from 'next/server';
import { aggregateWorkshop2NetworkAnalytics } from '@/lib/production/workshop2-network-analytics';
import { listAllWorkshop2BrandCalendarEvents } from '@/lib/server/workshop2-brand-calendar-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { isWorkshop2DomainEventType } from '@/lib/production/workshop2-domain-event-types';

export async function GET() {
  const calendarEvents = await listAllWorkshop2BrandCalendarEvents();
  let domainEvents: Array<{
    id: string;
    type: string;
    collectionId: string;
    articleId: string;
    payload: Record<string, unknown>;
    createdAt: string;
  }> = [];

  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    const res = await getWorkshop2PgPool().query<{
      id: number;
      event_type: string;
      collection_id: string;
      article_id: string;
      payload: Record<string, unknown>;
      created_at: Date;
    }>(
      `SELECT id, event_type, collection_id, article_id, payload, created_at
       FROM workshop2_domain_event_outbox
       ORDER BY created_at DESC
       LIMIT 500`
    );
    domainEvents = res.rows
      .filter((r) => isWorkshop2DomainEventType(r.event_type))
      .map((r) => ({
        id: String(r.id),
        type: r.event_type,
        collectionId: r.collection_id,
        articleId: r.article_id,
        payload: r.payload ?? {},
        createdAt: r.created_at.toISOString(),
      }));
  }

  const snapshot = aggregateWorkshop2NetworkAnalytics({
    domainEvents: domainEvents as never,
    calendarEvents,
  });

  return NextResponse.json({ ok: true, snapshot });
}
