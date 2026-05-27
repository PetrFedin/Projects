/**
 * Демо: один артикул SS27 с заполненным ТЗ (фаза 1) для разработки UI без ручного ввода.
 * Подставляется только если в `synth.brand.workshop2Phase1Dossier.v1` ещё нет содержательного досье.
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  defaultWorkshopSampleSizeScaleKey,
  handbookCatL1FromLeaf,
  WOMEN_OUTERWEAR_BODY_GRID_CM,
} from '@/lib/production/workshop-size-handbook';
import { buildTaMilestonesFromTemplate } from '@/lib/production/workshop2-ta-templates';
import { persistWorkshop2SignoffStagesProgressMirror } from '@/lib/production/workshop2-signoff-stages-dossier-persist';
import { WORKSHOP2_DEFAULT_SIGNOFF_STAGES } from '@/lib/production/workshop2-signoff-stages-config';
import { applyWorkshop2Ss27UatDemoSeed } from '@/lib/production/workshop2-ss27-uat-demo-seed';

const BODY_GRID = '__BODY_GRID';

function av(
  assignmentId: string,
  attributeId: string,
  displayLabel: string,
  text?: string
): Workshop2DossierPhase1['assignments'][number] {
  return {
    assignmentId,
    kind: 'canonical',
    attributeId,
    values: [
      {
        valueId: `${assignmentId}-v1`,
        valueSource: 'free_text',
        displayLabel,
        text: text ?? displayLabel,
      },
    ],
  };
}

/** 1×1 PNG */
const DEMO_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2WZxkAAAAASUVORK5CYII=';

export function isSs27MenCoatFullTzDemoArticle(
  collectionId: string,
  article: { id: string; sku?: string }
): boolean {
  return (
    collectionId === 'SS27' &&
    (article.id === 'demo-ss27-01' || String(article.sku ?? '') === 'SS27-M-COAT-01')
  );
}

export function isSs27WomenDressDemoArticle(
  collectionId: string,
  article: { id: string; sku?: string }
): boolean {
  return (
    collectionId === 'SS27' &&
    (article.id === 'demo-ss27-02' || String(article.sku ?? '') === 'SS27-W-DRS-02')
  );
}

export function isSs27UnisexSneakersDemoArticle(
  collectionId: string,
  article: { id: string; sku?: string }
): boolean {
  return (
    collectionId === 'SS27' &&
    (article.id === 'demo-ss27-03' || String(article.sku ?? '') === 'SS27-U-SNK-03')
  );
}

function isSs27DemoArticleForFullTz(
  collectionId: string,
  article: { id: string; sku?: string }
): boolean {
  return (
    isSs27MenCoatFullTzDemoArticle(collectionId, article) ||
    isSs27WomenDressDemoArticle(collectionId, article) ||
    isSs27UnisexSneakersDemoArticle(collectionId, article)
  );
}

export function isWorkshop2DossierTzEmpty(d: Workshop2DossierPhase1 | null | undefined): boolean {
  if (!d) return true;
  const hasBody =
    Boolean(d.brandNotes?.trim()) ||
    Boolean(d.selectedAudienceId) ||
    (d.assignments?.length ?? 0) > 0 ||
    Boolean(d.passportProductionBrief?.targetSampleOrPilotDate);
  return !hasBody;
}

/**
 * Полное демо-досье ТЗ для мужского пальто SS27 (каталог: лист «Пальто»).
 * `leaf` — из `findHandbookLeafById(categoryLeafId)` строки заказа.
 */
export function buildWorkshop2Ss27MenCoat01FullTzDemoDossier(
  leaf: HandbookCategoryLeaf | null,
  updatedBy: string
): Workshop2DossierPhase1 {
  const now = new Date().toISOString();
  const catL1 = handbookCatL1FromLeaf(leaf ?? undefined) ?? 'women-apparel';
  const scaleId = defaultWorkshopSampleSizeScaleKey(leaf ?? undefined);
  const rowIdx = 4;
  const row = WOMEN_OUTERWEAR_BODY_GRID_CM[rowIdx]!;
  const paramId = `w2:${catL1}:${BODY_GRID}:${rowIdx}`;

  const refId = 'ss27-demo-ref-main';
  const annId = 'ss27-demo-ann-01';

  const base: Workshop2DossierPhase1 = {
    schemaVersion: 1,
    updatedAt: now,
    updatedBy: updatedBy.slice(0, 120),
    selectedAudienceId: 'men',
    isUnisex: false,
    brandNotes:
      'SS27 · мужское пальто премиум: двубортный силуэт, шерсть 90/10, подклад вискоза. ' +
      'Цель — маржа B2B ≥42%, MOQ 120 шт, дроп EU/РФ до 15.07.2027. ТЗ согласовано с дизайном FW26 пальто-блока.',
    passportProductionBrief: {
      b2cProductSlug: 'ss27-m-coat-01',
      markingRequired: true,
      gtin: '04601234567890',
      targetSampleOrPilotDate: '2026-09-01',
      moqTargetMaxPieces: 120,
      moqTargetNote: '120 шт · Drop 1',
      deadlineCriticality: 'hard',
      articleCardOwnerRole: 'product',
      articleCardOwnerName: 'Мария (Продакшн)',
      plannedLaunchType: 'mixed',
      lifecycleTaTemplateId: 'outerwear-90',
      sewingRegionPlanNote: 'Пошив: Иваново (РФ), финишные операции — Москва.',
      tzRoleResponseDue: {
        designer: '2026-05-10',
        technologist: '2026-05-12',
        manager: '2026-05-15',
      },
    },
    assignments: [
      av('ss27-a-mat', 'mat', 'Основная ткань', 'Шерсть 90%, кашемир 10%, плотность 620 г/м'),
      av('ss27-a-comp', 'composition', 'Состав (этикетка)', '90% шерсть, 10% кашемир'),
      av('ss27-a-silh', 'silh', 'Силуэт', 'Двубортное пальто mid-thigh'),
      av('ss27-a-fit', 'fit_type', 'Посадка', 'Regular, плечо структурное'),
      av('ss27-a-clo', 'closure', 'Застёжка', 'Прямые пуговицы рог, 6 шт'),
      av('ss27-a-pocket', 'pocket', 'Карманы', 'Прорезные с клапаном + внутренний нагрудный'),
      av('ss27-a-neck', 'neck', 'Горловина', 'Отложной воротник 9 см'),
      av('ss27-a-sleeve', 'sleeve', 'Рукав', 'Двойной шов, литой манжет'),
      av('ss27-a-pack', 'packaging', 'Упаковка', 'Чехол тканевый + картонная вставка'),
      av('ss27-a-lab', 'labeling', 'Этикетка', 'Состав + QR DPP'),
      av('ss27-a-care', 'careWashingClassOptions', 'Уход', 'Химчистка P'),
      av('ss27-a-temp', 'temperatureOptions', 'Температурный режим', 'Профессиональная химчистка'),
    ],
    techPackAttachments: [
      {
        attachmentId: 'ss27-tp-1',
        fileName: 'SS27-M-COAT-01_techpack_v2.pdf',
        mimeType: 'application/pdf',
        fileSize: 1_240_000,
        previewDataUrl: DEMO_PIXEL,
        revisionNote: 'v2.0 — лекала плеча и воротника',
      },
    ],
    visualReferences: [
      {
        refId,
        title: 'Референс: пальто Jil Sander SS24',
        description: 'Принять линию плеча и длину полы.',
        previewDataUrl: DEMO_PIXEL,
      },
    ],
    canonicalMainPhotoRefId: refId,
    designerIntent: {
      mood: 'Тихий люкс, городской минимализм, тёплый серо-коричневый ряд',
      bullets: [
        'Акцент на ткани и крое, без лишнего декора',
        'Пара с брюками широкого кроя и лоферами',
        'Капсула Syntha Lab SS27 — «умный гардероб»',
      ],
    },
    categorySketchImageDataUrl: DEMO_PIXEL,
    categorySketchImageFileName: 'ss27-coat-master-sketch.png',
    categorySketchAnnotations: [
      {
        annotationId: annId,
        categoryLeafId: leaf?.leafId ?? 'catalog-apparel-g0-l0',
        xPct: 22,
        yPct: 38,
        text: 'Углублить пройму на 0,5 см для M/L',
      },
    ],
    sampleSizeScaleId: scaleId,
    sampleBasePerSizeDimensions: {
      [paramId]: {
        'Обхват груди': String(row.chest),
        'Обхват талии': String(row.waist),
        'Обхват бёдер': String(row.hips),
      },
    },
    tzSignatoryBindings: {
      designerDisplayLabel: 'Виктория Белова',
      technologistDisplayLabel: 'Артём Новиков',
      managerDisplayLabel: 'Мария (Продакшн)',
      designerSignStages: { tz: true, sample: true },
      technologistSignStages: { tz: true, sample: true },
      managerSignStages: { tz: true },
    },
    sectionSignoffs: {
      general: {
        brand: { by: 'Виктория Белова', at: '2026-04-01T12:00:00.000Z' },
        tech: { by: 'Артём Новиков', at: '2026-04-01T14:30:00.000Z' },
      },
      visuals: {
        brand: { by: 'Виктория Белова', at: '2026-04-02T09:00:00.000Z' },
      },
      material: {
        brand: { by: 'Виктория Белова', at: '2026-04-02T11:00:00.000Z' },
        tech: { by: 'Артём Новиков', at: '2026-04-02T15:00:00.000Z' },
      },
      construction: {
        tech: { by: 'Артём Новиков', at: '2026-04-03T10:00:00.000Z' },
      },
    },
    isVerifiedByDesigner: true,
    isVerifiedByTechnologist: true,
    designerSignoff: {
      by: 'Виктория Белова',
      at: '2026-04-03T16:00:00.000Z',
      signatureDigest: 'demo-designer-ss27',
    },
    technologistSignoff: {
      by: 'Артём Новиков',
      at: '2026-04-03T16:05:00.000Z',
      signatureDigest: 'demo-tech-ss27',
    },
    managerSignoff: {
      by: 'Мария (Продакшн)',
      at: '2026-04-04T09:00:00.000Z',
      signatureDigest: 'demo-mgr-ss27',
    },
    edoSignoffMirror: {
      mirroredAt: now,
      provider: 'mock',
      edoStatus: 'signed',
      requestId: 'mock-edo-ss27-staging',
      signedAt: now,
      blockerHandoff: false,
      statusLabelRu: 'Подписано',
      hintRu: 'ЭП Gold Sample (mock, staging UAT РФ).',
    },
    markingHonestSignMirror: {
      mirroredAt: now,
      markingRequired: true,
      gtin: '04601234567890',
      markingOrderId: 'mark-journal-SS27-demo-ss27-01-staging',
      status: 'journal_only',
      journalOnly: true,
      hintRu: 'Маркировка: journal-only для демо SS27 (без ЦРПТ ACK).',
    },
    sampleWorkflow: {
      activeSampleOrderId: 'demo-ss27-01-sample-staging',
      floorStatusLabel: 'synced',
      lastSyncedAt: now,
    },
    taMilestones: buildTaMilestonesFromTemplate('outerwear-90', undefined, new Date('2026-04-01')),
    taMilestonesPersistedAt: now,
    taMilestonesPersistSource: 'dossier_refresh',
    hubCollectionRollupMirror: {
      mirroredAt: now,
      collectionId: 'SS27',
      postgres: 'ok',
      metricsSource: 'pg_primary',
      serverRollupEnabled: true,
      dossierCount: 3,
      articleCount: 3,
      sampleOrderCount: 1,
      blockerSampleOrder: false,
      blockerHandoff: false,
      hintRu: 'SS27 demo rollup — UAT auto-check sample gate.',
    },
    showroomB2bMirror: {
      mirroredAt: now,
      publishMode: 'pg_journal',
      pgPublished: true,
      campaignName: 'SS27 Syntha Lab',
      lastPublishAt: now,
      publishJournalCount: 1,
      liveWebhookConfigured: false,
      liveWebhookAckSimulated: false,
      hintRu: 'Демо: витрина готова к publish (journal_only, без fake ACK).',
    },
    vaultDocuments: [
      {
        id: 'ss27-demo-vault-compliance',
        type: 'certificate',
        title: 'Декларация соответствия (демо)',
        uploadedAt: now,
      },
    ],
    lifecycleState: 'handoff_ready',
  };
  return applyWorkshop2Ss27UatDemoSeed(
    persistWorkshop2SignoffStagesProgressMirror({
      dossier: base,
      stages: WORKSHOP2_DEFAULT_SIGNOFF_STAGES,
    }),
    leaf
  );
}

/** Минимальное демо-досье: платье SS27 (хаб не 0%). */
export function buildWorkshop2Ss27WomenDress02DemoDossier(
  leaf: HandbookCategoryLeaf | null,
  updatedBy: string
): Workshop2DossierPhase1 {
  const now = new Date().toISOString();
  const scaleId = defaultWorkshopSampleSizeScaleKey(leaf ?? undefined, false);
  return {
    schemaVersion: 1,
    updatedAt: now,
    updatedBy: updatedBy.slice(0, 120),
    selectedAudienceId: 'women',
    isUnisex: false,
    brandNotes: 'SS27 · платье миди · хлопок · демо ТЗ для хаба разработки.',
    passportProductionBrief: {
      targetSampleOrPilotDate: '2026-08-15',
      moqTargetMaxPieces: 200,
    },
    assignments: [
      av('ss27-drs-mat', 'mat', 'Основная ткань', 'Хлопок 100%, саржа, 140 г/м²'),
      av('ss27-drs-comp', 'composition', 'Состав', '100% хлопок'),
      av('ss27-drs-color', 'primaryColorFamilyOptions', 'Основной цвет', 'Чёрный'),
      av('ss27-drs-len', 'garmentLengthApparelOptions', 'Длина', 'Миди'),
      av('ss27-drs-fit', 'clothingFitOptions', 'Посадка', 'Приталенная'),
      av('ss27-drs-care', 'careWashingClassOptions', 'Уход', 'Стирка 30°C'),
    ],
    sampleSizeScaleId: scaleId,
    categorySketchImageDataUrl: DEMO_PIXEL,
    lifecycleState: 'draft',
  };
}

/** Минимальное демо-досье: кроссовки унисекс SS27. */
export function buildWorkshop2Ss27UnisexSneakers03DemoDossier(
  leaf: HandbookCategoryLeaf | null,
  updatedBy: string
): Workshop2DossierPhase1 {
  const now = new Date().toISOString();
  const scaleId = defaultWorkshopSampleSizeScaleKey(leaf ?? undefined, true);
  return {
    schemaVersion: 1,
    updatedAt: now,
    updatedBy: updatedBy.slice(0, 120),
    selectedAudienceId: 'men',
    isUnisex: true,
    brandNotes: 'SS27 · кроссовки демисезон · унисекс · демо ТЗ.',
    passportProductionBrief: {
      targetSampleOrPilotDate: '2026-09-01',
      moqTargetMaxPieces: 360,
    },
    assignments: [
      av('ss27-snk-mat', 'mat', 'Материал верха', 'Текстиль + синтетика, водоотталкивание'),
      av('ss27-snk-sole', 'sole', 'Подошва', 'EVA + резина'),
      av('ss27-snk-color', 'primaryColorFamilyOptions', 'Основной цвет', 'Серый'),
      av('ss27-snk-closure', 'shoe-closure', 'Застёжка', 'Шнуровка'),
      av('ss27-snk-shaft', 'shoe-shaft-height', 'Высота голенища', 'Низкие'),
    ],
    sampleSizeScaleId: scaleId,
    categorySketchImageDataUrl: DEMO_PIXEL,
    lifecycleState: 'draft',
  };
}

/** Демо-merge полного ТЗ SS27 (отключить: `NEXT_PUBLIC_W2_SS27_FULL_TZ_DEMO=0`). */
export function isSs27FullTzDemoAutoMergeEnabled(): boolean {
  const v = process.env.NEXT_PUBLIC_W2_SS27_FULL_TZ_DEMO;
  if (v === '0' || v === 'false') return false;
  return true;
}

export function mergeSs27DemoDossierIfNeeded(
  collectionId: string,
  article: { id: string; sku?: string },
  stored: Workshop2DossierPhase1 | null | undefined,
  leaf: HandbookCategoryLeaf | null,
  updatedBy: string
): Workshop2DossierPhase1 | null {
  if (!isSs27FullTzDemoAutoMergeEnabled()) return null;
  if (!isSs27DemoArticleForFullTz(collectionId, article)) return null;
  if (!isWorkshop2DossierTzEmpty(stored)) return null;
  if (isSs27MenCoatFullTzDemoArticle(collectionId, article)) {
    return buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, updatedBy);
  }
  if (isSs27WomenDressDemoArticle(collectionId, article)) {
    return buildWorkshop2Ss27WomenDress02DemoDossier(leaf, updatedBy);
  }
  if (isSs27UnisexSneakersDemoArticle(collectionId, article)) {
    return buildWorkshop2Ss27UnisexSneakers03DemoDossier(leaf, updatedBy);
  }
  return null;
}
