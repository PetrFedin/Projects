/**
 * Wave X — memory journal reserve/release в internalWmsMirror (file-store round-trip).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2InternalWmsMemoryJournalEntry = {
  at: string;
  kind: 'reserve' | 'release' | 'sync';
  actor?: string;
  sampleOrderId?: string;
  qty?: number;
  movementCount?: number;
  messageRu?: string;
};

const MAX_JOURNAL = 24;

export function appendWorkshop2InternalWmsMemoryJournal(
  dossier: Workshop2DossierPhase1,
  entry: Omit<Workshop2InternalWmsMemoryJournalEntry, 'at'> & { at?: string }
): Workshop2DossierPhase1 {
  const prevRaw = dossier.internalWmsMirror?.memoryJournal;
  const prev = Array.isArray(prevRaw) ? prevRaw : [];
  const next: Workshop2InternalWmsMemoryJournalEntry = {
    at: entry.at ?? new Date().toISOString(),
    kind: entry.kind,
    actor: entry.actor,
    sampleOrderId: entry.sampleOrderId,
    qty: entry.qty,
    movementCount: entry.movementCount,
    messageRu: entry.messageRu,
  };
  const memoryJournal = [...prev, next].slice(-MAX_JOURNAL);
  return {
    ...dossier,
    internalWmsMirror: dossier.internalWmsMirror
      ? { ...dossier.internalWmsMirror, memoryJournal }
      : {
          mirroredAt: next.at,
          itemCount: 0,
          onHandQty: 0,
          reservedQty: 0,
          movementCount: entry.movementCount ?? 0,
          reserveDeficitCount: 0,
          wmsSyncStatus: 'memory_fallback',
          locationCode: 'WORKSHOP2-WH',
          memoryJournal,
        },
  };
}
