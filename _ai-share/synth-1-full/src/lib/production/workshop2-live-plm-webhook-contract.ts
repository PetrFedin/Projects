/**
 * Wave F (#78): PLM webhook receipt + partnerAck journal shape — fail-closed без fake ACK.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2CeilingJournalEntry } from '@/lib/production/workshop2-ceiling-staging-core';
import { isWorkshop2LivePlmTransportConfigured } from '@/lib/production/workshop2-live-integration-probes-env';

export type Workshop2PlmWebhookPartnerAckShape = {
  partnerAckRecorded: false;
  partnerAckId: null;
  ackAt: null;
  webhookReceiptRecorded: boolean;
  lastEvent?: string;
  hintRu: string;
};

/** Journal после webhook: partnerAck всегда false до live ACK URL. */
export function buildWorkshop2PlmWebhookPartnerAckShape(input: {
  dossier: Workshop2DossierPhase1;
  eventId: string;
  env?: Record<string, string | undefined>;
}): Workshop2PlmWebhookPartnerAckShape {
  const journal = input.dossier.plmTransportJournalMirror?.journal ?? [];
  const receipt = journal.find((j) => j.event === 'webhook_receipt');
  const live = isWorkshop2LivePlmTransportConfigured(input.env);
  return {
    partnerAckRecorded: false,
    partnerAckId: null,
    ackAt: null,
    webhookReceiptRecorded: Boolean(receipt),
    lastEvent: receipt?.event,
    hintRu: live
      ? `Webhook receipt ${input.eventId} в journal — partnerAckId только после live ACK transport.`
      : 'Webhook receipt в journal — WORKSHOP2_PLM_PARTNER_ACK_URL не задан (fail-closed).',
  };
}

export function evaluateWorkshop2PlmUiFailClosed(input: {
  plmTransportLive: boolean;
  journal?: Workshop2CeilingJournalEntry[];
}): { allowProcess: boolean; messageRu: string } {
  if (!input.plmTransportLive) {
    return {
      allowProcess: false,
      messageRu:
        'PLM live transport не настроен — Process/Retry заблокированы (без fake partner ACK).',
    };
  }
  const failed = (input.journal ?? []).filter((j) => j.outcome === 'failed');
  if (failed.length > 0) {
    return {
      allowProcess: false,
      messageRu: `PLM journal: ${failed.length} failed — исправьте перед Process.`,
    };
  }
  return { allowProcess: true, messageRu: 'Live PLM transport доступен.' };
}
