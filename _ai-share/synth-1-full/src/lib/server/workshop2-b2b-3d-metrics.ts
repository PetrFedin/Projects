import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';
import {
  WORKSHOP2_ARTICLE_CONTEXT_TYPE,
  workshop2ArticleContextId,
} from '@/lib/production/workshop2-domain-event-types';
import { appendWorkshop2ContextualSystemMessage } from '@/lib/server/workshop2-contextual-messages-repository';

const SESSION_JOURNAL_BASENAME = '.planning/workshop2-b2b-3d-session-journal.json';

type JournalRow = {
  sessionId?: string;
  collectionId?: string;
  articleId?: string;
  embedMode?: string;
  durationSec?: number;
  error?: boolean;
  errorCode?: string;
  at?: string;
  kind?: 'view' | 'session';
};

function journalPath(): string {
  return path.join(process.cwd(), SESSION_JOURNAL_BASENAME);
}

function appendJournalRow(row: JournalRow): void {
  if (process.env.NODE_ENV === 'test') return;
  try {
    const file = journalPath();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    let sessions: JournalRow[] = [];
    if (fs.existsSync(file)) {
      const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as {
        sessions?: JournalRow[];
        entries?: JournalRow[];
      };
      sessions = parsed.sessions ?? parsed.entries ?? [];
      if (!Array.isArray(sessions)) sessions = [];
    }
    sessions.push({ ...row, at: row.at ?? new Date().toISOString() });
    fs.writeFileSync(file, JSON.stringify({ sessions }, null, 2), 'utf8');
  } catch {
    /* best-effort journal */
  }
}

async function notifyArticleContext(input: {
  collectionId: string;
  articleId: string;
  message: string;
}): Promise<void> {
  const contextId = workshop2ArticleContextId(input.collectionId, input.articleId);
  await appendWorkshop2ContextualSystemMessage({
    organizationId: 'org-brand-001',
    contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
    contextId,
    message: input.message,
  }).catch(() => {
    /* optional comms */
  });
}

/** POST /showroom/3d-view — investor metrics + contextual system line. */
export async function recordWorkshop2B2b3dViewEvent(input: {
  collectionId: string;
  articleId: string;
  embedMode?: string;
}): Promise<{ ok: true }> {
  appendJournalRow({
    kind: 'view',
    collectionId: input.collectionId,
    articleId: input.articleId,
    embedMode: input.embedMode,
    error: false,
  });

  const messageRu = `[3D] Просмотр витрины · ${input.collectionId}/${input.articleId} (${input.embedMode ?? 'embed'}).`;
  await notifyArticleContext({
    collectionId: input.collectionId,
    articleId: input.articleId,
    message: messageRu,
  });

  void enqueueWorkshop2DomainEvent({
    type: 'b2b.3d.view',
    collectionId: input.collectionId,
    articleId: input.articleId,
    payload: { embedMode: input.embedMode ?? 'embed', messageRu },
    dispatchNow: true,
  }).catch(() => {
    /* best-effort */
  });

  return { ok: true };
}

/** POST /showroom/3d-session — SLA journal + domain event. */
export async function recordWorkshop2B2b3dSessionEvent(input: {
  collectionId: string;
  articleId: string;
  embedMode?: string;
  durationMs: number;
  sdkReady?: boolean;
}): Promise<{ ok: true; durationSec: number }> {
  const durationSec = Math.max(0, Math.round(input.durationMs / 1000));
  const error = durationSec <= 0;

  appendJournalRow({
    kind: 'session',
    sessionId: `3d-${Date.now()}`,
    collectionId: input.collectionId,
    articleId: input.articleId,
    embedMode: input.embedMode,
    durationSec,
    error,
    errorCode: error ? 'zero_duration' : undefined,
  });

  const messageRu = `[3D] Сессия ${durationSec}с · ${input.collectionId}/${input.articleId}${input.sdkReady ? ' · SDK ready' : ''}.`;
  await notifyArticleContext({
    collectionId: input.collectionId,
    articleId: input.articleId,
    message: messageRu,
  });

  void enqueueWorkshop2DomainEvent({
    type: 'b2b.3d.session',
    collectionId: input.collectionId,
    articleId: input.articleId,
    payload: {
      embedMode: input.embedMode ?? 'sdk',
      durationSec,
      sdkReady: Boolean(input.sdkReady),
      messageRu,
    },
    dispatchNow: true,
  }).catch(() => {
    /* best-effort */
  });

  return { ok: true, durationSec };
}
