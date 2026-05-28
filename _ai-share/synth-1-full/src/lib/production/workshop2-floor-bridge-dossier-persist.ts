/**
 * Wave 34 #58: зеркало моста W2 ↔ пол + gates sample-order / handoff.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2SampleOrderStatus } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { workshop2SampleOrderStatusToFloorTab } from '@/lib/production/workshop2-floor-bridge-sync';
import {
  isWorkshop2FloorMesConfigured,
  isWorkshop2FloorMesReverseSyncAllowed,
  type Workshop2FloorMesPollState,
  type Workshop2ProcessEnvLike,
} from '@/lib/production/workshop2-floor-mes';

export function buildWorkshop2FloorBridgeMirror(input: {
  floorTab?: string;
  orderStatus: Workshop2SampleOrderStatus;
  syncedAt: string;
  source: 'floor_api' | 'manual_tab';
  orderId?: string;
  env?: Workshop2ProcessEnvLike;
  floorMesPollState?: Workshop2FloorMesPollState;
  floorMesLastPollAt?: string;
}): NonNullable<Workshop2DossierPhase1['floorBridgeMirror']> {
  const env = input.env ?? process.env;
  const mesConfigured = isWorkshop2FloorMesConfigured(env);
  const reverseSyncEnabled = isWorkshop2FloorMesReverseSyncAllowed(env);
  const expectedTab = workshop2SampleOrderStatusToFloorTab(input.orderStatus);
  const floorTab = input.floorTab?.trim() || expectedTab;
  const tabAligned = floorTab === expectedTab;

  return {
    mirroredAt: new Date().toISOString(),
    lastSyncedAt: input.syncedAt,
    floorTab,
    orderStatus: input.orderStatus,
    expectedFloorTab: expectedTab,
    tabAligned,
    source: input.source,
    orderId: input.orderId,
    reverseSyncEnabled,
    floorMesConfigured: mesConfigured,
    floorMesPollState: input.floorMesPollState ?? (mesConfigured ? 'idle' : 'fail_closed'),
    floorMesLastPollAt: input.floorMesLastPollAt,
    blockerSampleOrder: !reverseSyncEnabled && input.source === 'floor_api',
    blockerHandoff: !reverseSyncEnabled && input.source === 'floor_api',
    hintRu: !reverseSyncEnabled
      ? 'Обратная синхронизация с пола отключена — WORKSHOP2_FLOOR_MES_URL не задан (fail-closed).'
      : tabAligned
        ? `Статус образца синхронизирован с полом (вкладка ${floorTab}).`
        : `Синхронизация с пола: вкладка ${floorTab}, ожидалась ${expectedTab}.`,
  };
}

export function applyWorkshop2FloorBridgeSyncToDossier(
  dossier: Workshop2DossierPhase1,
  input: {
    floorTab?: string;
    orderStatus: Workshop2SampleOrderStatus;
    syncedAt: string;
    source: 'floor_api' | 'manual_tab';
    orderId?: string;
  }
): Workshop2DossierPhase1 {
  const mirror = buildWorkshop2FloorBridgeMirror(input);
  const floorStatusLabel =
    input.orderStatus === 'approved'
      ? 'Утверждён (пол)'
      : input.orderStatus === 'received'
        ? 'Получен (QC)'
        : input.orderStatus === 'in_progress'
          ? 'В работе (цех)'
          : input.orderStatus === 'sent'
            ? 'Отправлен'
            : 'Черновик';

  let next: Workshop2DossierPhase1 = {
    ...dossier,
    floorBridgeMirror: mirror,
    sampleWorkflow: {
      ...dossier.sampleWorkflow,
      activeSampleOrderId: input.orderId ?? dossier.sampleWorkflow?.activeSampleOrderId,
      floorStatusLabel,
      lastSyncedAt: input.syncedAt,
      lastFloorTab: mirror.floorTab,
    },
  };

  if (input.orderStatus === 'approved') {
    next = {
      ...next,
      goldSampleStatus: {
        status: 'approved',
        approvedAt: input.syncedAt,
        approvedBy: 'floor-bridge-sync',
        linkedSampleOrderId: input.orderId ?? dossier.goldSampleStatus?.linkedSampleOrderId,
      },
    };
  }

  return next;
}

export function persistWorkshop2FloorBridgeMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  input: Parameters<typeof applyWorkshop2FloorBridgeSyncToDossier>[1]
): Workshop2DossierPhase1 {
  return applyWorkshop2FloorBridgeSyncToDossier(dossier, input);
}

export function evaluateWorkshop2FloorBridgeSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.floorBridgeMirror;
  if (!mirror) {
    return {
      id: 'floor.bridge.mirror_missing',
      severity: 'warning',
      messageRu:
        'Мост на пол не синхронизирован — после работы на полу нажмите «Сохранить с пола в досье».',
    };
  }
  if (!mirror.reverseSyncEnabled) {
    return {
      id: 'floor.bridge.disabled',
      severity: 'warning',
      messageRu:
        mirror.hintRu ??
        'Обратная синхронизация с пола отключена (WORKSHOP2_FLOOR_MES_URL fail-closed).',
    };
  }
  return null;
}

export function evaluateWorkshop2FloorBridgeHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  return evaluateWorkshop2FloorBridgeSampleGate(dossier);
}
