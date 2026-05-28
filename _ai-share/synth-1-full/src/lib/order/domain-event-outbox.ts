/**
 * [Phase — Domain event outbox]
 * Запись доменных событий на диск перед публикацией в eventBus: при сбое между персистом и publish
 * запись остаётся pending — см. processPendingDomainEventOutbox (bootstrap) или ручной вызов.
 * At-least-once: подписчики с полем dedupeKey должны быть идемпотентны.
 */

import 'server-only';

import fs from 'fs/promises';
import path from 'path';

import { logObservability } from '@/lib/logger';
import type { DomainEvent } from '@/lib/production/execution-linkage';

export type OutboxEntry = {
  id: string;
  status: 'pending' | 'sent';
  event: DomainEvent;
  createdAt: string;
  attempts: number;
  lastError?: string;
  sentAt?: string;
};

export type DomainEventOutboxStats = {
  total: number;
  pending: number;
  sent: number;
  failed: number;
};

type OutboxSnapshot = {
  entries: Record<string, OutboxEntry>;
};

const snapshot: OutboxSnapshot = { entries: {} };
let loadPromise: Promise<void> | null = null;
let opChain: Promise<unknown> = Promise.resolve();

function runExclusive<T>(fn: () => Promise<T>): Promise<T> {
  const next = opChain.then(fn, fn) as Promise<T>;
  opChain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

export function getDomainEventOutboxFilePath(): string {
  const fromEnv = process.env.DOMAIN_EVENT_OUTBOX_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'domain-event-outbox.json');
}

async function loadSnapshot(): Promise<void> {
  const p = getDomainEventOutboxFilePath();
  try {
    const raw = await fs.readFile(p, 'utf8');
    const parsed = JSON.parse(raw) as OutboxSnapshot;
    snapshot.entries = parsed.entries && typeof parsed.entries === 'object' ? parsed.entries : {};
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      snapshot.entries = {};
      return;
    }
    throw e;
  }
}

async function saveSnapshot(): Promise<void> {
  const p = getDomainEventOutboxFilePath();
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(snapshot), 'utf8');
}

async function ensureLoadedOnce(): Promise<void> {
  if (!loadPromise) {
    loadPromise = loadSnapshot();
  }
  await loadPromise;
}

function computeStats(): DomainEventOutboxStats {
  const entries = Object.values(snapshot.entries);
  const pending = entries.filter((e) => e.status === 'pending').length;
  const sent = entries.filter((e) => e.status === 'sent').length;
  const failed = entries.filter(
    (e) => e.status === 'pending' && typeof e.lastError === 'string'
  ).length;
  return {
    total: entries.length,
    pending,
    sent,
    failed,
  };
}

/**
 * Сохраняет событие как pending (до вызова dispatch).
 */
export async function enqueueDomainEventOutbox(event: DomainEvent): Promise<void> {
  return runExclusive(async () => {
    await ensureLoadedOnce();
    snapshot.entries[event.eventId] = {
      id: event.eventId,
      status: 'pending',
      event,
      createdAt: new Date().toISOString(),
      attempts: 0,
    };
    await saveSnapshot();
    logObservability('domain_outbox.enqueued', {
      eventId: event.eventId,
      type: event.type,
      dedupeKey: event.dedupeKey,
      ...computeStats(),
    });
  });
}

/**
 * Публикует в eventBus и помечает sent. Идемпотентно, если уже sent.
 */
export async function dispatchDomainEventOutboxByEventId(eventId: string): Promise<void> {
  return runExclusive(async () => {
    await ensureLoadedOnce();
    const row = snapshot.entries[eventId];
    if (!row) return;
    if (row.status === 'sent') return;

    const { eventBus } = await import('./domain-events');
    row.attempts += 1;
    await saveSnapshot();

    try {
      await eventBus.publish(row.event);
      row.status = 'sent';
      row.sentAt = new Date().toISOString();
      row.lastError = undefined;
      await saveSnapshot();
      logObservability('domain_outbox.dispatched', {
        eventId,
        type: row.event.type,
        attempts: row.attempts,
        dedupeKey: row.event.dedupeKey,
        ...computeStats(),
      });
    } catch (err) {
      row.lastError = err instanceof Error ? err.message : String(err);
      await saveSnapshot();
      logObservability('domain_outbox.dispatch_failed', {
        eventId,
        type: row.event.type,
        attempts: row.attempts,
        dedupeKey: row.event.dedupeKey,
        error: row.lastError,
        ...computeStats(),
      });
      throw err;
    }
  });
}

/**
 * Типичный путь: запись на диск, затем немедленная публикация.
 */
export async function enqueueAndDispatchDomainEventOutbox(event: DomainEvent): Promise<void> {
  await enqueueDomainEventOutbox(event);
  await dispatchDomainEventOutboxByEventId(event.eventId);
}

/**
 * Обрабатывает зависшие pending (например после рестарта до publish).
 */
export async function processPendingDomainEventOutbox(limit: number): Promise<number> {
  await ensureLoadedOnce();
  const pending = Object.values(snapshot.entries).filter((e) => e.status === 'pending');
  let done = 0;
  for (const row of pending) {
    if (done >= limit) break;
    try {
      await dispatchDomainEventOutboxByEventId(row.id);
      done += 1;
    } catch {
      /* оставляем pending; следующий прогон или алерт по lastError */
    }
  }
  const pendingAfter = Object.values(snapshot.entries).filter((e) => e.status === 'pending').length;
  const stats = computeStats();
  logObservability('domain_outbox.run_completed', {
    processedThisRun: done,
    limit,
    ...stats,
  });
  if (pendingAfter > 0) {
    logObservability('domain_outbox.pending_backlog', {
      processedThisRun: done,
      ...stats,
    });
  }
  return done;
}

/** Количество записей со статусом pending (после ensureLoaded). */
export async function getDomainEventOutboxPendingCount(): Promise<number> {
  return runExclusive(async () => {
    await ensureLoadedOnce();
    return Object.values(snapshot.entries).filter((e) => e.status === 'pending').length;
  });
}

/** Сводная статистика outbox (для cron/health/алертов). */
export async function getDomainEventOutboxStats(): Promise<DomainEventOutboxStats> {
  return runExclusive(async () => {
    await ensureLoadedOnce();
    return computeStats();
  });
}

/** Только для Jest. */
export function __resetDomainEventOutboxForTests(): void {
  if (process.env.NODE_ENV !== 'test') return;
  snapshot.entries = {};
  loadPromise = null;
  opChain = Promise.resolve();
}
