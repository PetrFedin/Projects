/**
 * Wave 22 #3: зеркало hub filter enrichment в досье + gate sample-order.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import type { Workshop2HubFilterPresetSnapshot } from '@/lib/production/workshop2-hub-filter-preset-storage';

export function buildWorkshop2HubFilterMirror(input: {
  tzOverallPct: number;
  goldApproved: boolean;
  hasSampleOrder: boolean;
  preset?: Workshop2HubFilterPresetSnapshot | null;
}): NonNullable<Workshop2DossierPhase1['hubFilterMirror']> {
  const blockerSampleOrder = input.tzOverallPct < 30;
  let hintRu: string | undefined;
  if (blockerSampleOrder) {
    hintRu = `ТЗ ${input.tzOverallPct}% < 30% — hub filter покажет артикул как неготовый к образцу.`;
  }

  const preset = input.preset;
  const presetActive = Boolean(
    preset &&
    (preset.search.trim() ||
      preset.tagFilter.length > 0 ||
      preset.catL1 ||
      preset.catL2 ||
      preset.catL3 ||
      preset.advanced?.minTzPct ||
      preset.advanced?.goldApprovedOnly ||
      preset.advanced?.hasSampleOrderOnly)
  );

  return {
    mirroredAt: new Date().toISOString(),
    tzOverallPct: input.tzOverallPct,
    goldApproved: input.goldApproved,
    hasSampleOrder: input.hasSampleOrder,
    blockerSampleOrder,
    hintRu,
    presetSavedAt: preset?.savedAt,
    presetActive,
    presetMinTzPct: preset?.advanced?.minTzPct,
    presetGoldOnly: preset?.advanced?.goldApprovedOnly,
    presetSampleOnly: preset?.advanced?.hasSampleOrderOnly,
  };
}

export function persistWorkshop2HubFilterMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  input: {
    tzOverallPct: number;
    goldApproved: boolean;
    hasSampleOrder: boolean;
    preset?: Workshop2HubFilterPresetSnapshot | null;
  }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    hubFilterMirror: buildWorkshop2HubFilterMirror(input),
  };
}

export function evaluateWorkshop2HubFilterSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.hubFilterMirror;
  if (!mirror) {
    return {
      id: 'hub.filter.mirror_missing',
      severity: 'warning',
      messageRu:
        'Hub filter snapshot не в досье — откройте артикул для синхронизации TZ/gold/sample.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'hub.filter.tz_low',
      severity: 'blocker',
      messageRu:
        mirror.hintRu ??
        `Готовность ТЗ ${mirror.tzOverallPct}% — заказ образца заблокирован (порог hub filter 30%).`,
    };
  }
  return null;
}
