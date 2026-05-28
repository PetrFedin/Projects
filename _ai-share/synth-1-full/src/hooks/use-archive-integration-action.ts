'use client';

import { useCallback } from 'react';
import { getUnknownErrorMessage } from '@/lib/unknown-error-message';

/** Сообщение под интеграционные кнопки (архивные B2B-страницы). */
export type ArchiveIntegrationMessage = { type: 'success' | 'error'; text: string };

type B2bActionShape = {
  success?: boolean;
  error?: string;
  /** Некоторые BFF (Fashion Cloud и т.п.) отдают список ошибок вместо одной строки. */
  errors?: string[];
  processed?: number;
  count?: number;
  synced?: number;
};

export type ArchiveB2bSuccessLine =
  | { kind: 'processed' }
  | { kind: 'count'; label?: string }
  | { kind: 'synced' }
  | { kind: 'literal'; text: string };

/**
 * Разбор ответов вида `{ success, error, processed?|count?|synced? }` для JOOR / NuORDER и похожих маршрутов.
 */
export function archiveMessageFromB2bShape(
  data: B2bActionShape,
  success: ArchiveB2bSuccessLine
): ArchiveIntegrationMessage {
  if (!data.success) {
    const fromList =
      Array.isArray(data.errors) && data.errors.length > 0 ? data.errors.join(', ') : undefined;
    return { type: 'error', text: fromList || data.error || 'Ошибка' };
  }
  if (success.kind === 'literal') {
    return { type: 'success', text: success.text };
  }
  if (success.kind === 'processed') {
    return { type: 'success', text: `Обработано: ${data.processed ?? 0}` };
  }
  if (success.kind === 'synced') {
    return { type: 'success', text: `Синхронизировано: ${data.synced ?? 0}` };
  }
  const label = success.label ?? 'Обновлено';
  return { type: 'success', text: `${label}: ${data.count ?? 0}` };
}

type RunArchiveActionParams = {
  setMsg: (msg: ArchiveIntegrationMessage | null) => void;
  setLoading: (loading: boolean) => void;
  work: () => Promise<ArchiveIntegrationMessage>;
};

/**
 * Общий try/finally для POST-экшенов на archive-страницах интеграций.
 */
export function useArchiveIntegrationAction() {
  return useCallback(async ({ setMsg, setLoading, work }: RunArchiveActionParams) => {
    setMsg(null);
    setLoading(true);
    try {
      setMsg(await work());
    } catch (e: unknown) {
      setMsg({ type: 'error', text: getUnknownErrorMessage(e, 'Ошибка запроса') });
    } finally {
      setLoading(false);
    }
  }, []);
}
