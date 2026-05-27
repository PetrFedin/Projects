'use client';

/**
 * Realtime-слой workshop2: SSE (комната dossier/article) + polling fallback.
 *
 * Ограничения (честно для enterprise):
 * - Next.js App Router не поднимает WebSocket upgrade в route handler — только SSE или polling.
 * - Нет CRDT/OT: при 409 показывается merge modal, не автоматическое слияние полей.
 * - При обрыве SSE включается polling (по умолчанию 30 с на вкладке досье).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { loadWorkshop2DossierFromApi } from '@/lib/production/workshop2-api-client';
import { shouldApplyWorkshop2RemoteDossierUpdate } from '@/lib/production/workshop2-realtime-merge-policy';

export type Workshop2ConnectionStatus = 'online' | 'syncing' | 'offline';
export type Workshop2RealtimeTransport = 'sse' | 'polling' | 'idle';

/** Не перезаписывать досье с сервера, пока пользователь редактирует поле формы. */
export function isWorkshop2DossierFormFocused(): boolean {
  if (typeof document === 'undefined') return false;
  const el = document.activeElement;
  if (!el || !(el instanceof HTMLElement)) return false;
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement ||
    el.isContentEditable
  );
}

export type Workshop2RealtimeServerEvent =
  | {
      type: 'DOSSIER_UPDATED';
      collectionId: string;
      articleId: string;
      version: number;
      updatedAt: string;
      updatedBy?: string;
    }
  | {
      type: 'EVENT_APPENDED';
      collectionId: string;
      articleId: string;
      eventId: string;
      eventType: string;
      version: number;
      createdAt: string;
    }
  | {
      type: 'PRESENCE';
      collectionId: string;
      articleId: string;
      editors: { actorId: string; actorLabel: string; since: string }[];
    }
  | { type: 'ping'; ts: string };

function realtimeStreamUrl(collectionId: string, articleId: string): string {
  const q = new URLSearchParams({ collectionId, articleId });
  return `/api/workshop2/realtime?${q.toString()}`;
}

export type UseWorkshop2DossierRealtimeOptions = {
  collectionId: string;
  articleId: string;
  /** Интервал polling fallback, мс (по умолчанию 30 с). */
  pollingIntervalMs?: number;
  enabled?: boolean;
  localVersion?: number | null;
  onRemoteDossier?: (
    dossier: Workshop2DossierPhase1,
    meta: { version: number; updatedAt: string; updatedBy?: string }
  ) => void;
  onServerEvent?: (event: Workshop2RealtimeServerEvent) => void;
  onPresence?: (editors: { actorId: string; actorLabel: string; since: string }[]) => void;
};

/**
 * Подписка на обновления досье: SSE primary, polling при disconnect/offline.
 */
export function useWorkshop2DossierRealtime(opts: UseWorkshop2DossierRealtimeOptions): {
  connectionStatus: Workshop2ConnectionStatus;
  transport: Workshop2RealtimeTransport;
  lastError: string | null;
  lastServerVersion: number | null;
  refetchNow: () => Promise<void>;
} {
  const {
    collectionId,
    articleId,
    pollingIntervalMs = 30_000,
    enabled = true,
    localVersion = null,
    onRemoteDossier,
    onServerEvent,
    onPresence,
  } = opts;

  const [connectionStatus, setConnectionStatus] = useState<Workshop2ConnectionStatus>('offline');
  const [transport, setTransport] = useState<Workshop2RealtimeTransport>('idle');
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastServerVersion, setLastServerVersion] = useState<number | null>(null);
  const localVersionRef = useRef(localVersion);
  localVersionRef.current = localVersion;
  const onRemoteRef = useRef(onRemoteDossier);
  onRemoteRef.current = onRemoteDossier;
  const onEventRef = useRef(onServerEvent);
  onEventRef.current = onServerEvent;
  const onPresenceRef = useRef(onPresence);
  onPresenceRef.current = onPresence;

  const transportRef = useRef<Workshop2RealtimeTransport>('idle');
  transportRef.current = transport;

  const refetchNow = useCallback(async () => {
    if (!enabled || !collectionId || !articleId) return;
    if (isWorkshop2DossierFormFocused()) return;
    setConnectionStatus('syncing');
    try {
      const loaded = await loadWorkshop2DossierFromApi(collectionId, articleId);
      if (!loaded.ok) {
        if (loaded.reason !== 'not_found') {
          setLastError(loaded.reason);
          setConnectionStatus('offline');
        }
        return;
      }
      setLastError(null);
      setLastServerVersion(loaded.data.version);
      const mergeDecision = shouldApplyWorkshop2RemoteDossierUpdate({
        localVersion: localVersionRef.current,
        remoteVersion: loaded.data.version,
        formFocused: isWorkshop2DossierFormFocused(),
      });
      if (mergeDecision.apply) {
        onRemoteRef.current?.(loaded.data.dossier, {
          version: loaded.data.version,
          updatedAt: loaded.data.updatedAt,
        });
      }
      if (transportRef.current !== 'sse') {
        setConnectionStatus('online');
      }
    } finally {
      if (transportRef.current !== 'sse') {
        setConnectionStatus((s) => (s === 'syncing' ? 'online' : s));
      }
    }
  }, [articleId, collectionId, enabled]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !collectionId || !articleId) {
      setTransport('idle');
      setConnectionStatus('offline');
      return;
    }

    if (typeof EventSource === 'undefined') {
      setTransport('polling');
      return;
    }

    let es: EventSource | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let disposed = false;

    const startPolling = () => {
      if (pollTimer) return;
      setTransport('polling');
      setConnectionStatus('online');
      void refetchNow();
      pollTimer = setInterval(() => {
        if (document.visibilityState === 'visible') void refetchNow();
      }, pollingIntervalMs);
    };

    const handleServerPayload = (raw: string) => {
      try {
        const event = JSON.parse(raw) as Workshop2RealtimeServerEvent;
        if (event.type === 'ping') return;
        onEventRef.current?.(event);
        if (event.type === 'PRESENCE') {
          onPresenceRef.current?.(event.editors);
          return;
        }
        if (event.type === 'DOSSIER_UPDATED') {
          const mergeDecision = shouldApplyWorkshop2RemoteDossierUpdate({
            localVersion: localVersionRef.current,
            remoteVersion: event.version,
            formFocused: isWorkshop2DossierFormFocused(),
          });
          if (!mergeDecision.apply) return;
          void loadWorkshop2DossierFromApi(collectionId, articleId).then((loaded) => {
            if (!loaded.ok) return;
            setLastServerVersion(loaded.data.version);
            onRemoteRef.current?.(loaded.data.dossier, {
              version: loaded.data.version,
              updatedAt: loaded.data.updatedAt,
              updatedBy: event.type === 'DOSSIER_UPDATED' ? event.updatedBy : undefined,
            });
          });
        }
      } catch {
        // ignore malformed SSE
      }
    };

    const connectSse = () => {
      if (disposed) return;
      es?.close();
      es = new EventSource(realtimeStreamUrl(collectionId, articleId));
      es.onopen = () => {
        setTransport('sse');
        setConnectionStatus('online');
        setLastError(null);
        if (pollTimer) {
          clearInterval(pollTimer);
          pollTimer = null;
        }
      };
      es.onmessage = (ev) => {
        setConnectionStatus('online');
        handleServerPayload(ev.data);
      };
      es.onerror = () => {
        es?.close();
        es = null;
        setLastError('sse_disconnected');
        startPolling();
      };
    };

    connectSse();

    const onVis = () => {
      if (document.visibilityState === 'visible' && transportRef.current === 'polling') {
        void refetchNow();
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      disposed = true;
      es?.close();
      if (pollTimer) clearInterval(pollTimer);
      document.removeEventListener('visibilitychange', onVis);
      setTransport('idle');
      setConnectionStatus('offline');
    };
  }, [articleId, collectionId, enabled, pollingIntervalMs, refetchNow]);

  return { connectionStatus, transport, lastError, lastServerVersion, refetchNow };
}

/** @deprecated Используйте useWorkshop2DossierRealtime */
export const useWorkshop2DossierSync = useWorkshop2DossierRealtime;

export type UseWorkshop2DossierSyncOptions = UseWorkshop2DossierRealtimeOptions;

/** Заглушка transport API (совместимость). */
export const workshop2RealtimeStub = {
  subscribeDossier() {
    return () => undefined;
  },
};
