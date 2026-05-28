import { NextResponse } from 'next/server';
import { getWorkshop2MarketProfile } from '@/lib/production/workshop2-market-profile';
import { buildWorkshop2DossierLinkedPaths } from '@/lib/production/workshop2-dossier-linked-paths';
import {
  isWorkshop2ContextualChatPersistConfigured,
  listWorkshop2ContextualMessageThreads,
} from '@/lib/server/workshop2-contextual-messages-repository';
import { WORKSHOP2_ARTICLE_CONTEXT_TYPE } from '@/lib/production/workshop2-domain-event-types';
import { WORKSHOP2_B2B_ORDER_CONTEXT_TYPE } from '@/lib/production/workshop2-b2b-order-lifecycle';

/** GET /api/brand/messages/threads — агрегат contextual PG threads (RU main path). */
export async function GET() {
  const market = getWorkshop2MarketProfile();
  const configured = isWorkshop2ContextualChatPersistConfigured();
  const threadsRaw = configured
    ? [
        ...(await listWorkshop2ContextualMessageThreads({
          contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
          limit: 20,
        })),
        ...(await listWorkshop2ContextualMessageThreads({
          contextType: WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
          limit: 15,
        })),
      ].sort((a, b) => (b.lastMessageAt ?? '').localeCompare(a.lastMessageAt ?? ''))
    : [];

  const threads = threadsRaw.map((t) => {
    const collectionId = t.collectionId?.trim();
    const articleId = t.articleId?.trim();
    const workspaceHref =
      collectionId && articleId
        ? buildWorkshop2DossierLinkedPaths({ collectionId, articleId }).workspace
        : undefined;
    return { ...t, workspaceHref };
  });

  return NextResponse.json({
    ok: true,
    market,
    source: configured ? (process.env.WORKSHOP2_DATABASE_URL ? 'postgres' : 'memory') : 'empty',
    threads,
    hintRu:
      market === 'ru'
        ? 'Основной чат — contextual thread в workspace артикула; demo messages-data не используется.'
        : 'Global: brand messages hub + contextual threads.',
  });
}
