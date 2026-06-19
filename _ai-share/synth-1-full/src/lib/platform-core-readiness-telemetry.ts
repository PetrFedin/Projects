/**
 * Телеметрия PG для hub — дополняет ручной CELL_AUDIT, не заменяет оценки.
 * Оценки /10 остаются в readiness-audit; здесь только факты из chain-overview.
 */

import type { CoreHubPillarId } from '@/lib/platform-core-hub-matrix';

export type ReadinessTelemetryInput = {
  pillars: ReadonlyArray<{ id: CoreHubPillarId; done: boolean }>;
  commsThreadCount: number;
};

export type ReadinessTelemetrySnapshot = {
  pillarsDone: number;
  pillarsTotal: number;
  commsThreadCount: number;
  lineRu: string;
};

export function buildReadinessTelemetrySnapshot(
  input: ReadinessTelemetryInput | null | undefined
): ReadinessTelemetrySnapshot | null {
  if (!input?.pillars?.length) return null;
  const pillarsDone = input.pillars.filter((p) => p.done).length;
  const pillarsTotal = input.pillars.length;
  const comms = input.commsThreadCount ?? 0;
  const commsPart =
    comms > 0
      ? ` · ${comms} сообщ. в контексте оптового заказа`
      : ' · переписка по заказу пока пуста';
  return {
    pillarsDone,
    pillarsTotal,
    commsThreadCount: comms,
    lineRu: `Телеметрия PG: ${pillarsDone}/${pillarsTotal} столпов цепочки выполнены${commsPart}. Оценки /10 — ручной аудит.`,
  };
}
