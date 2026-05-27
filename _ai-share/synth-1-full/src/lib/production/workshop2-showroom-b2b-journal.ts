/**
 * Wave 37 #62: PG journal publish для B2B шоурума — без имитации live webhook ACK.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  isWorkshop2LiveShowroomConfigured,
  type Workshop2ProcessEnvLike,
} from '@/lib/production/workshop2-live-integration-probes-env';
import type { Workshop2ShowroomCampaign } from '@/lib/server/workshop2-showroom-repository';

export type Workshop2ShowroomPublishMode = 'pg_journal' | 'live_webhook';

export type Workshop2ShowroomB2bMirror = {
  mirroredAt: string;
  publishMode: Workshop2ShowroomPublishMode;
  pgPublished: boolean;
  campaignName?: string;
  lastPublishAt?: string;
  publishJournalCount: number;
  liveWebhookConfigured: boolean;
  /** Никогда true без реального webhook ACK — только PG persist. */
  liveWebhookAckSimulated: false;
  hintRu?: string;
};

export function buildWorkshop2ShowroomB2bMirror(input: {
  campaign: Workshop2ShowroomCampaign | null;
  env?: Workshop2ProcessEnvLike;
  publishJournalIncrement?: number;
}): Workshop2ShowroomB2bMirror {
  const liveWebhookConfigured = isWorkshop2LiveShowroomConfigured(input.env);
  const pgPublished = Boolean(input.campaign?.published);
  const publishJournalCount = (input.publishJournalIncrement ?? 0) + (pgPublished ? 1 : 0);
  let hintRu: string | undefined;
  if (pgPublished && !liveWebhookConfigured) {
    hintRu =
      'Кампания в PG (journal). Live B2B webhook не настроен — внешний портал не получал ACK.';
  } else if (!pgPublished) {
    hintRu = 'Шоурум не опубликован в PG — сохраните кампанию перед handoff.';
  }
  return {
    mirroredAt: new Date().toISOString(),
    publishMode: liveWebhookConfigured ? 'live_webhook' : 'pg_journal',
    pgPublished,
    campaignName: input.campaign?.campaignName,
    lastPublishAt: input.campaign?.lastSyncAt ?? input.campaign?.updatedAt,
    publishJournalCount: Math.max(1, publishJournalCount),
    liveWebhookConfigured,
    liveWebhookAckSimulated: false,
    hintRu,
  };
}

export function persistWorkshop2ShowroomB2bMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  mirror: Workshop2ShowroomB2bMirror
): Workshop2DossierPhase1 {
  return { ...dossier, showroomB2bMirror: mirror };
}

export function evaluateWorkshop2ShowroomB2bHandoffGate(input: {
  dossier: Workshop2DossierPhase1;
}): Workshop2HandoffReadinessCheck | null {
  const mirror = input.dossier.showroomB2bMirror;
  if (!mirror) {
    return {
      id: 'showroom.b2b.mirror_missing',
      severity: 'warning',
      messageRu:
        'B2B шоурум: нет journal mirror в досье — опубликуйте кампанию в PG на вкладке «План».',
    };
  }
  if (!mirror.pgPublished) {
    return {
      id: 'showroom.b2b.not_published_pg',
      severity: 'warning',
      messageRu: mirror.hintRu ?? 'Шоурум не опубликован в PG — handoff без live Joor/Brandboom.',
    };
  }
  if (mirror.liveWebhookAckSimulated) {
    return {
      id: 'showroom.b2b.fake_webhook_ack',
      severity: 'blocker',
      messageRu: 'Запрещена имитация live webhook ACK без env.',
    };
  }
  return null;
}

export function evaluateWorkshop2ShowroomB2bExportGate(input: {
  dossier: Workshop2DossierPhase1;
}): Workshop2HandoffReadinessCheck | null {
  return evaluateWorkshop2ShowroomB2bHandoffGate(input);
}
