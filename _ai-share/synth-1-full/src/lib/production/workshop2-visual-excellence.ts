import type {
  Workshop2DossierPhase1,
  Workshop2VisualReadinessChecklist,
  Workshop2TzPanelSectionId,
  Workshop2TzPanelSectionKeyStored,
  Workshop2TzSignoffStageId,
  Workshop2VisualRefTakeawayAspect,
} from '@/lib/production/workshop2-dossier-phase1.types';

export const VISUAL_READINESS_LABELS: {
  key: keyof Workshop2VisualReadinessChecklist;
  label: string;
  hint: string;
}[] = [
  {
    key: 'refsAttached',
    label: 'Референсы приложены',
    hint: 'Хотя бы один референс с превью или ссылкой.',
  },
  {
    key: 'sketchWithPins',
    label: 'Скетч с метками',
    hint: 'Master-скетч или лист с описанием точек.',
  },
  {
    key: 'floorReferenceReady',
    label: 'Эталон для цеха',
    hint: 'Режим цеха / ссылка проверены; подложка понятна линии.',
  },
  {
    key: 'refThreadsResolved',
    label: 'Комментарии по рефам закрыты',
    hint: 'Нет открытых спорных тредов по ключевым файлам.',
  },
  {
    key: 'canonicalArtifactSet',
    label: 'Главное фото и скетч выбраны',
    hint: 'Зафиксированы канонические артефакты для подписи.',
  },
  {
    key: 'designerIntentFilled',
    label: 'Замысел заполнен',
    hint: 'Mood и тезисы (или legacy brandNotes).',
  },
  {
    key: 'versionOrSnapshotRecorded',
    label: 'Версия или снимок зафиксированы',
    hint: 'Подпись версии + запись в журнале или снимок меток.',
  },
];

export const TZ_PANEL_SECTION_LABELS: Record<Workshop2TzPanelSectionId, string> = {
  general: 'Паспорт',
  visuals: 'Визуал / эскиз',
  material: 'Материалы (BOM)',
  construction: 'Конструкция',
};

/** Ссылки с меток: старые measurements/packaging → актуальные вкладки. */
export function normalizeLinkedTzPanelSectionForNav(
  key: Workshop2TzPanelSectionKeyStored | undefined
): Workshop2TzPanelSectionId | undefined {
  if (!key) return undefined;
  if (key === 'measurements') return 'construction';
  if (key === 'packaging') return 'material';
  return key;
}

export function labelForStoredTzPanelSection(
  key: Workshop2TzPanelSectionKeyStored | undefined
): string {
  const n = normalizeLinkedTzPanelSectionForNav(key);
  return n ? TZ_PANEL_SECTION_LABELS[n] : '';
}

export const ROUTE_STAGE_NAV_OPTIONS: { id: Workshop2TzSignoffStageId; label: string }[] = [
  { id: 'tz', label: 'ТЗ' },
  { id: 'sample', label: 'Образец' },
  { id: 'supply', label: 'Снабжение' },
  { id: 'fit', label: 'Посадка' },
  { id: 'plan', label: 'План' },
  { id: 'release', label: 'Выпуск' },
  { id: 'qc', label: 'ОТК' },
];

/**
 * Какие пункты чеклиста можно честно проставить по уже внесённым данным (только `true`, без снятия галочек).
 * «Треды по рефам» — только если есть комментарии и у каждого стоит `resolved`.
 */
export function inferVisualReadinessChecklistFromFacts(
  dossier: Workshop2DossierPhase1
): Partial<Workshop2VisualReadinessChecklist> {
  const patch: Partial<Workshop2VisualReadinessChecklist> = {};
  if ((dossier.visualReferences?.length ?? 0) > 0) patch.refsAttached = true;
  const sketchOk =
    Boolean(dossier.categorySketchImageDataUrl) ||
    (dossier.categorySketchAnnotations?.length ?? 0) > 0 ||
    Boolean(
      dossier.sketchSheets?.some((s) => Boolean(s.imageDataUrl) || (s.annotations?.length ?? 0) > 0)
    );
  if (sketchOk) patch.sketchWithPins = true;
  const intentOk =
    Boolean(dossier.designerIntent?.mood?.trim()) ||
    Boolean(dossier.designerIntent?.bullets?.some((b) => b.trim())) ||
    Boolean(dossier.brandNotes?.trim());
  if (intentOk) patch.designerIntentFilled = true;
  if (dossier.canonicalMainPhotoRefId && dossier.canonicalMainSketchTarget) {
    patch.canonicalArtifactSet = true;
  }
  if (
    (dossier.visualVersionLog?.length ?? 0) > 0 ||
    (dossier.sketchLabelSnapshots?.length ?? 0) > 0
  ) {
    patch.versionOrSnapshotRecorded = true;
  }
  /** Эталон цеха: подпись производства + зафиксированный снимок меток (без снимка галочку не выводим автоматически). */
  if (
    dossier.categorySketchProductionApproved?.at &&
    (dossier.sketchLabelSnapshots?.length ?? 0) > 0
  ) {
    patch.floorReferenceReady = true;
  }
  const hasAnyRefComment = (dossier.visualReferences ?? []).some(
    (r) => (r.comments?.length ?? 0) > 0
  );
  const allRefCommentsResolved = (dossier.visualReferences ?? []).every((r) =>
    (r.comments ?? []).every((c) => c.resolved === true)
  );
  if (hasAnyRefComment && allRefCommentsResolved) {
    patch.refThreadsResolved = true;
  }
  return patch;
}

export function visualReadinessProgress(dossier: Workshop2DossierPhase1): {
  done: number;
  total: number;
  checklist: Workshop2VisualReadinessChecklist;
} {
  const c = dossier.visualReadinessChecklist ?? {};
  const keys = VISUAL_READINESS_LABELS.map((x) => x.key);
  let done = 0;
  for (const k of keys) {
    if (c[k]) done++;
  }
  return { done, total: keys.length, checklist: c };
}

export type VisualReadinessHintsOptions = {
  /** Страница открыта с ?sketchFloor=1 — усиливаем подсказку по эталону цеха. */
  sketchFloorInUrl?: boolean;
};

/** Подсказки «данные есть, но галочка не стоит» — только для UI. */
export function visualReadinessHints(
  dossier: Workshop2DossierPhase1,
  opts?: VisualReadinessHintsOptions
): Partial<Record<keyof Workshop2VisualReadinessChecklist, string>> {
  const c = dossier.visualReadinessChecklist ?? {};
  const out: Partial<Record<keyof Workshop2VisualReadinessChecklist, string>> = {};
  if (!c.refsAttached && (dossier.visualReferences?.length ?? 0) > 0) {
    out.refsAttached = 'Референсы уже есть — можно отметить.';
  }
  if (
    !c.sketchWithPins &&
    (dossier.categorySketchImageDataUrl ||
      (dossier.categorySketchAnnotations?.length ?? 0) > 0 ||
      dossier.sketchSheets?.some((s) => (s.annotations?.length ?? 0) > 0 || s.imageDataUrl))
  ) {
    out.sketchWithPins = 'Подложка или метки есть — проверьте и отметьте.';
  }
  if (
    !c.designerIntentFilled &&
    ((dossier.designerIntent?.bullets?.some((b) => b.trim()) ?? false) ||
      (dossier.designerIntent?.mood?.trim() ?? '') ||
      (dossier.brandNotes?.trim() ?? ''))
  ) {
    out.designerIntentFilled = 'Замысел или заметки заполнены — отметьте после ревью.';
  }
  if (
    !c.versionOrSnapshotRecorded &&
    ((dossier.visualVersionLog?.length ?? 0) > 0 || (dossier.sketchLabelSnapshots?.length ?? 0) > 0)
  ) {
    out.versionOrSnapshotRecorded = 'Есть снимок или запись в журнале — подтвердите галочкой.';
  }
  if (
    !c.canonicalArtifactSet &&
    dossier.canonicalMainPhotoRefId &&
    dossier.canonicalMainSketchTarget
  ) {
    out.canonicalArtifactSet = 'Канон выбран — отметьте после согласования.';
  }
  if (!c.floorReferenceReady) {
    const prodOk = Boolean(dossier.categorySketchProductionApproved?.at);
    const hasFloorSnapshot = (dossier.sketchLabelSnapshots?.length ?? 0) > 0;
    const pinOnMaster = (dossier.categorySketchAnnotations?.length ?? 0) > 0;
    const pinOnSheets =
      dossier.sketchSheets?.some((s) => (s.annotations?.length ?? 0) > 0) ?? false;
    const hasPins = pinOnMaster || pinOnSheets;
    const customSubstrate = Boolean(dossier.categorySketchImageDataUrl);
    if (prodOk) {
      out.floorReferenceReady = hasFloorSnapshot
        ? 'Скетч согласован с производством, снимок меток есть — проверьте ?sketchFloor=1 для линии и отметьте эталон.'
        : 'Подпись производства есть — сохраните снимок меток для архива, откройте страницу с ?sketchFloor=1 и проверьте читаемость номеров; затем отметьте эталон.';
    } else if (hasFloorSnapshot) {
      out.floorReferenceReady =
        'Есть снимок меток — после проверки на цехе можно отметить готовность эталона.';
    } else if (hasPins && customSubstrate) {
      out.floorReferenceReady =
        'Своя подложка и метки — проверьте читаемость в режиме цеха (?sketchFloor=1), затем отметьте.';
    } else if (hasPins) {
      out.floorReferenceReady =
        'Метки на доске есть — проверьте крупные номера в режиме цеха и отметьте эталон при готовности.';
    }
    if (out.floorReferenceReady && opts?.sketchFloorInUrl) {
      out.floorReferenceReady = `${out.floorReferenceReady} Сейчас включён режим цеха (?sketchFloor=1) — проверьте читаемость номеров.`;
    }
  }
  if (!c.refThreadsResolved) {
    const refsWithChat = (dossier.visualReferences ?? []).filter(
      (r) => (r.comments?.length ?? 0) > 0
    );
    if (refsWithChat.length > 0) {
      let openComments = 0;
      for (const r of refsWithChat) {
        for (const cm of r.comments ?? []) {
          if (cm.resolved !== true) openComments++;
        }
      }
      out.refThreadsResolved =
        openComments > 0
          ? `${openComments} сообщ. без отметки «Решено» в тредах по рефам — отметьте или продолжите обсуждение.`
          : 'Все сообщения отмечены «Решено» — можно проставить пункт чеклиста.';
    }
  }
  return out;
}

export function takeawayAspectLabel(a: Workshop2VisualRefTakeawayAspect): string {
  const m: Record<string, string> = {
    silhouette: 'Силуэт',
    color: 'Цвет',
    hardware: 'Фурнитура',
    fit: 'Посадка',
    fabric: 'Материал/фактура',
    mood: 'Mood',
    other: 'Другое',
  };
  return m[a] ?? a;
}
