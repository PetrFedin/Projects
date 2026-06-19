/**
 * Wave 41 #78: manual partner ack id + journal CSV export (honest, не fake transport).
 */
import type {
  Workshop2DossierPhase1,
  Workshop2PlmManualPartnerAckMirror,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2CeilingJournalEntry } from '@/lib/production/workshop2-ceiling-staging-core';

export type { Workshop2PlmManualPartnerAckMirror };

export function buildWorkshop2PlmTransportJournalCsv(
  journal: Workshop2CeilingJournalEntry[] | undefined
): string {
  const headers = [
    'at',
    'actor',
    'event',
    'outcome',
    'httpStatus',
    'error',
    'stagingUrl',
    'partnerAckRecorded',
    'ackId',
  ];
  const escape = (s: string) => `"${String(s).replace(/"/g, '""')}"`;
  const rows = (journal ?? []).map((j) =>
    [
      j.at,
      j.actor,
      j.event,
      j.outcome,
      j.httpStatus != null ? String(j.httpStatus) : '',
      j.error ?? '',
      j.stagingUrl ?? '',
      j.partnerAckRecorded ? 'true' : 'false',
      j.ackId ?? '',
    ]
      .map(escape)
      .join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

export function summarizeWorkshop2PlmManualPartnerAck(dossier: Workshop2DossierPhase1): {
  hasManualAck: boolean;
  manualPartnerAckId: string | null;
  journalRowCount: number;
  hintRu: string;
} {
  const manual = dossier.plmManualPartnerAckMirror?.manualPartnerAckId?.trim() ?? null;
  const fromJournal = dossier.plmTransportJournalMirror?.partnerAckId?.trim() ?? null;
  const id = manual ?? fromJournal;
  const journalRowCount = dossier.plmTransportJournalMirror?.journal?.length ?? 0;
  return {
    hasManualAck: Boolean(manual),
    manualPartnerAckId: id,
    journalRowCount,
    hintRu: manual
      ? `Manual partner ack id: ${manual} (не заменяет live PLM transport).`
      : journalRowCount > 0
        ? `PLM journal: ${journalRowCount} строк — экспорт CSV или Process outbox.`
        : 'Запишите webhook receipt или manual ack id перед handoff.',
  };
}

export function persistWorkshop2PlmManualPartnerAckToDossier(input: {
  dossier: Workshop2DossierPhase1;
  actor: string;
  manualPartnerAckId: string;
}): Workshop2DossierPhase1 {
  const id = input.manualPartnerAckId.trim();
  const journal = input.dossier.plmTransportJournalMirror?.journal ?? [];
  const mirror: Workshop2PlmManualPartnerAckMirror = {
    mirroredAt: new Date().toISOString(),
    lastActor: input.actor,
    manualPartnerAckId: id || null,
    labeledAs: 'manual_ack_id',
    replayExportReady: journal.length > 0,
    journalRowCount: journal.length,
    hintRu: id
      ? `Ручной partner ack «${id}» в PG — prod live transport всё ещё отдельно.`
      : 'Partner ack id не задан.',
  };
  return {
    ...input.dossier,
    plmManualPartnerAckMirror: mirror,
    plmTransportJournalMirror: input.dossier.plmTransportJournalMirror
      ? {
          ...input.dossier.plmTransportJournalMirror,
          hintRu: mirror.hintRu,
        }
      : input.dossier.plmTransportJournalMirror,
  };
}
