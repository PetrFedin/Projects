/** Клиентские подсказки backoff ERP (согласованы с server erpAutoRetryDelayMs). */

export const WORKSHOP2_ERP_AUTO_RETRY_MAX = 3;
export const ERP_AUTO_RETRY_BASE_MS = 15_000;

export function erpAutoRetryDelayMs(attempt: number): number {
  return ERP_AUTO_RETRY_BASE_MS * 2 ** Math.max(0, attempt);
}

export function formatErpAutoRetryCountdownRu(iso?: string, nowMs = Date.now()): string | null {
  if (!iso?.trim()) return null;
  const at = Date.parse(iso);
  if (!Number.isFinite(at)) return null;
  const deltaMs = at - nowMs;
  if (deltaMs <= 0) return 'Автоповтор ERP — сейчас';
  const sec = Math.ceil(deltaMs / 1000);
  if (sec < 60) return `Автоповтор ERP через ${sec} с`;
  const min = Math.ceil(sec / 60);
  return min < 2 ? 'Автоповтор ERP ~1 мин' : `Автоповтор ERP ~${min} мин`;
}

export function formatErpAutoRetryExhaustedRu(
  count?: number,
  max = WORKSHOP2_ERP_AUTO_RETRY_MAX
): string | null {
  if (count == null || count < max) return null;
  return `Автоповторы ERP исчерпаны (${max}/${max}) — нажмите «Повторить ERP».`;
}

export function formatErpAutoRetryAttemptRu(
  count?: number,
  max = WORKSHOP2_ERP_AUTO_RETRY_MAX
): string | null {
  if (count == null || count <= 0) return null;
  return `Попытка автоповтора ${Math.min(count, max)}/${max}`;
}

export function pickEarliestErpNextRetryAt(
  dates: readonly (string | undefined)[]
): string | undefined {
  let best: string | undefined;
  let bestMs = Infinity;
  for (const iso of dates) {
    if (!iso?.trim()) continue;
    const ms = Date.parse(iso);
    if (Number.isFinite(ms) && ms < bestMs) {
      bestMs = ms;
      best = iso;
    }
  }
  return best;
}

export function summarizeFactoryErpAttentionRu(input: {
  errorCount: number;
  journalOnlyCount: number;
  pendingCount: number;
}): string {
  const parts: string[] = [];
  if (input.errorCount > 0) {
    parts.push(
      `${input.errorCount} ${input.errorCount === 1 ? 'серия' : 'серии'} — ошибка live ERP`
    );
  }
  if (input.journalOnlyCount > 0) {
    parts.push(
      `${input.journalOnlyCount} ${input.journalOnlyCount === 1 ? 'серия' : 'серии'} — журнал (live ERP не настроен)`
    );
  }
  if (input.pendingCount > 0) {
    parts.push(
      `${input.pendingCount} ${input.pendingCount === 1 ? 'серия' : 'серии'} — ожидает ERP после приёмки`
    );
  }
  return parts.length > 0 ? parts.join(' · ') : 'Серии требуют синхронизации с ERP.';
}
