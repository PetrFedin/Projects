/**
 * Локальный мост событий workshop2 (браузер + localStorage).
 * Зеркалит паттерн DomainEventBus для R&D-досье без серверной шины.
 *
 * Серверный аудит: POST `/api/workshop2/articles/{collectionId}/{articleId}/events`.
 * Realtime multi-user: SSE `/api/workshop2/realtime` + `useWorkshop2DossierRealtime` (polling fallback).
 */

import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';

export type Workshop2EventType =
  | 'DOSSIER_SAVED'
  | 'DOSSIER_STATUS_CHANGED'
  | 'VAULT_SNAPSHOT_BUMPED'
  | 'TA_MILESTONES_UPDATED'
  | 'ARTICLE_CREATED'
  | 'DOSSIER_INITIALIZED'
  | 'ARTICLE_UPDATED';

export type Workshop2EventPayload = {
  collectionId: string;
  articleId: string;
  dossier?: Workshop2DossierPhase1;
  /** ISO-8601 */
  at: string;
  by?: string;
  meta?: Record<string, unknown>;
};

export type Workshop2DomainEvent = {
  type: Workshop2EventType;
  payload: Workshop2EventPayload;
};

type Workshop2EventHandler = (event: Workshop2DomainEvent) => void;

const STORAGE_KEY = 'w2-event-log-v1';
const MAX_LOG = 40;

class Workshop2EventBridge {
  private handlers = new Map<Workshop2EventType, Set<Workshop2EventHandler>>();
  private wildcardHandlers = new Set<Workshop2EventHandler>();

  subscribe(type: Workshop2EventType, handler: Workshop2EventHandler): () => void {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(handler);
    return () => this.handlers.get(type)?.delete(handler);
  }

  /** Подписка на все типы (отладка / cross-panel sync). */
  subscribeAll(handler: Workshop2EventHandler): () => void {
    this.wildcardHandlers.add(handler);
    return () => this.wildcardHandlers.delete(handler);
  }

  emit(
    type: Workshop2EventType,
    payload: Omit<Workshop2EventPayload, 'at'> & { at?: string }
  ): void {
    const event: Workshop2DomainEvent = {
      type,
      payload: { ...payload, at: payload.at ?? new Date().toISOString() },
    };
    this.appendToLog(event);
    for (const h of this.handlers.get(type) ?? []) {
      try {
        h(event);
      } catch (e) {
        console.error('[Workshop2EventBridge] handler error', type, e);
      }
    }
    for (const h of this.wildcardHandlers) {
      try {
        h(event);
      } catch (e) {
        console.error('[Workshop2EventBridge] wildcard handler error', type, e);
      }
    }
  }

  private appendToLog(event: Workshop2DomainEvent): void {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV === 'production') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const prev: Workshop2DomainEvent[] = raw ? (JSON.parse(raw) as Workshop2DomainEvent[]) : [];
      const next = [...prev.slice(-(MAX_LOG - 1)), event];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* квота / приватный режим — не блокируем emit */
    }
  }
}

export const workshop2EventBridge = new Workshop2EventBridge();

/** Увеличивает счётчик снимка Vault в досье (версионирование документов). */
export function bumpWorkshop2VaultSnapshot(
  dossier: Workshop2DossierPhase1,
  by?: string
): Workshop2DossierPhase1 {
  const version = (dossier.vaultSnapshotVersion ?? 0) + 1;
  return {
    ...dossier,
    vaultSnapshotVersion: version,
    vaultSnapshotAt: new Date().toISOString(),
    vaultSnapshotBy: by ?? dossier.updatedBy,
  };
}
