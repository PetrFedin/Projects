import { readSewingPatternIntentV1 } from '@/lib/pattern-drafting/sewing-pattern-leaf-storage';
import type { OrderSewingIntentSnapshot } from '@/lib/types';

/**
 * Снимок категории+мерок из localStorage для передачи в `createOrder` (мок-репозиторий, далее OMS/CRM).
 * Только в браузере; на SSR возвращает `null`.
 */
export function getSewingIntentForOrder(): OrderSewingIntentSnapshot | null {
  if (typeof window === 'undefined') return null;
  const i = readSewingPatternIntentV1();
  if (!i?.handbookLeafId) return null;
  return {
    clientSewingIntentHandbookLeafId: i.handbookLeafId,
    clientSewingIntentPathLabel: i.pathLabel,
    clientSewingIntentSnapshotAt: i.updatedAt,
    clientSewingIntentMeasures: { ...i.measures },
  };
}
