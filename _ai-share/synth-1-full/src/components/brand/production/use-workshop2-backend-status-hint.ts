'use client';

import { useEffect, useState } from 'react';

export type Workshop2BackendStatus = 'loading' | 'server' | 'pg_disabled' | 'offline';

/** Разбор health API → статус для hub/workspace (Wave M: честный pg_disabled vs offline). */
export function resolveWorkshop2BackendStatusFromHealth(json: {
  ok?: boolean;
  postgres?: string;
  storeMode?: string;
}): Workshop2BackendStatus {
  if (json.ok !== true) return 'offline';
  if (json.postgres === 'ok' || json.storeMode === 'server_postgres') return 'server';
  if (json.postgres === 'disabled' || json.storeMode === 'server_file_persist') {
    return 'pg_disabled';
  }
  if (json.postgres === 'down') return 'offline';
  return 'offline';
}

/**
 * Краткий статус enterprise backend (Postgres / API) для подписей в формах Workshop2.
 */
export function useWorkshop2BackendStatusHint(active: boolean): Workshop2BackendStatus {
  const [status, setStatus] = useState<Workshop2BackendStatus>('loading');

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setStatus('loading');
    void fetch('/api/workshop2/health', { cache: 'no-store' })
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          setStatus('offline');
          return;
        }
        const json = (await res.json()) as { ok?: boolean; postgres?: string; storeMode?: string };
        setStatus(resolveWorkshop2BackendStatusFromHealth(json));
      })
      .catch(() => {
        if (!cancelled) setStatus('offline');
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  return status;
}

export function workshop2BackendStatusHintRu(status: Workshop2BackendStatus): string {
  if (status === 'loading') return 'Проверка связи с сервером…';
  if (status === 'server') {
    return 'Досье и аудит сохраняются в PostgreSQL · состав коллекции — в браузере.';
  }
  if (status === 'pg_disabled') {
    return 'PostgreSQL недоступен — досье на файловом сервере (не PG primary). Поднимите PG: bash scripts/workshop2-pg-bootstrap.sh';
  }
  return 'API offline — запись в браузере до восстановления сервера.';
}
