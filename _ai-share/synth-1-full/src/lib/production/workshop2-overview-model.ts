import {
  calculateArticleStageGates,
  calculateDossierReadiness,
  type DossierSection,
  type StageGateStatus,
} from '@/lib/production/dossier-readiness-engine';
import type { ArticleWorkspaceBundle } from '@/lib/production/article-workspace/types';
import { type HandbookCategoryLeaf } from '@/lib/production/category-catalog';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { workshop2DossierWarningLooksVisual } from '@/lib/production/workshop2-visual-section-warnings';

export type Workshop2OverviewTab =
  | 'overview'
  | 'tz'
  | 'supply'
  | 'fit'
  | 'plan'
  | 'release'
  | 'qc'
  | 'stock';

export type Workshop2OverviewBundleSnapshot = {
  supply?: {
    lines: { id: string; status: string; qty?: number; costPerUnit?: number }[];
  };
  fitGold?: {
    goldApproved: boolean;
    fitComments: { id: string }[];
  };
  planPo?: {
    purchaseOrders: { id: string; status: string }[];
    nestingAiOptimization?: { efficiencyGainPct: number };
  };
  release?: {
    operations?: { id: string; status: string; costPerUnit?: number }[];
  };
  qc?: {
    batches: {
      id: string;
      status: string;
      batchSize?: number;
      majorDefects?: number | null;
    }[];
  };
  stock?: {
    movements: { id: string }[];
  };
};

/** Явное сопоставление снимка вкладок артикула с полями, нужными обзору (без каста). */
export function toWorkshop2OverviewBundleSnapshot(
  bundle: ArticleWorkspaceBundle | null
): Workshop2OverviewBundleSnapshot | null {
  if (!bundle) return null;
  return {
    supply: bundle.supply
      ? {
          lines: bundle.supply.lines.map((l) => ({
            id: l.id,
            status: l.status,
            qty: l.qty,
            costPerUnit: l.costPerUnit,
          })),
        }
      : undefined,
    fitGold: bundle.fitGold
      ? {
          goldApproved: bundle.fitGold.goldApproved,
          fitComments: bundle.fitGold.fitComments.map((c) => ({ id: c.id })),
        }
      : undefined,
    planPo: bundle.planPo
      ? {
          purchaseOrders: bundle.planPo.purchaseOrders.map((po) => ({
            id: po.id,
            status: po.status,
          })),
          nestingAiOptimization: bundle.planPo.nestingAiOptimization
            ? { efficiencyGainPct: bundle.planPo.nestingAiOptimization.efficiencyGainPct }
            : undefined,
        }
      : undefined,
    release: bundle.release
      ? {
          operations: bundle.release.operations?.map((o) => ({
            id: o.id,
            status: o.status,
            costPerUnit: o.costPerUnit,
          })),
        }
      : undefined,
    qc: bundle.qc
      ? {
          batches: bundle.qc.batches.map((b) => ({
            id: b.id,
            status: b.status,
            batchSize: b.batchSize,
            majorDefects: b.majorDefects ?? null,
          })),
        }
      : undefined,
    stock: bundle.stock
      ? { movements: bundle.stock.movements.map((m) => ({ id: m.id })) }
      : undefined,
  };
}

export type Workshop2OverviewDecisionItem = {
  label: string;
  filled: boolean;
  /** Секция ТЗ, где заполняется этот блок. */
  dossierSection: DossierSection;
};

export type Workshop2OverviewRouteStage = {
  id: Workshop2OverviewTab;
  label: string;
  owner: string;
  status: StageGateStatus;
  pct: number;
  blocker?: string;
};

export type Workshop2OverviewBlocker = {
  id: string;
  stage: Exclude<Workshop2OverviewTab, 'overview'>;
  stageLabel: string;
  owner: string;
  text: string;
  ctaLabel: string;
  /** Для ТЗ — открыть конкретный раздел досье. */
  dossierSection?: DossierSection;
};

export type Workshop2OverviewPrimaryAction = {
  tab: Exclude<Workshop2OverviewTab, 'overview'>;
  title: string;
  reason: string;
  buttonLabel: string;
  dossierSection?: DossierSection;
};

export type Workshop2OverviewModel = {
  decisionItems: Workshop2OverviewDecisionItem[];
  routeStages: Workshop2OverviewRouteStage[];
  topBlockers: Workshop2OverviewBlocker[];
  primaryAction: Workshop2OverviewPrimaryAction;
};

/** Подпись этапа без повтора роли, если она уже в названии (напр. «Снабжение · Закупка» и владелец «Закупка»). */
export function formatWorkshop2StageEyebrow(label: string, owner: string): string {
  const o = owner.trim();
  if (!o) return label;
  const parts = label.split('·').map((s) => s.trim());
  if (parts.some((p) => p === o)) return label;
  return `${label} · ${o}`;
}

function getAssignmentLabels(
  dossier: Workshop2DossierPhase1 | null,
  attributeIds: string[],
  limit = 3
): string[] {
  if (!dossier) return [];
  const labels = dossier.assignments
    .filter((assignment) => attributeIds.includes(assignment.attributeId ?? ''))
    .flatMap((assignment) => assignment.values.map((value) => value.displayLabel?.trim() ?? ''))
    .filter(Boolean);
  return [...new Set(labels)].slice(0, limit);
}

function buildDecisionItems(dossier: Workshop2DossierPhase1 | null): Workshop2OverviewDecisionItem[] {
  const audienceFilled = Boolean(dossier?.selectedAudienceId);
  const intentFilled = Boolean(dossier?.brandNotes?.trim());
  const materialAttrIds = ['mat', 'composition', 'insulationMaterialOptions', 'thermoTechOptions'];
  const materialFilled = Boolean(
    dossier?.assignments.some(
      (a) => Boolean(a.attributeId && materialAttrIds.includes(a.attributeId) && a.values.length > 0)
    )
  );
  const measurementsFilled = Boolean(
    dossier?.sampleSizeScaleId &&
      dossier.sampleBasePerSizeDimensions &&
      Object.keys(dossier.sampleBasePerSizeDimensions).length > 0
  );
  const constructionAttrIds = [
    'silh',
    'fit_type',
    'clothingFitOptions',
    'garmentLengthApparelOptions',
    'insulationLevelOptions',
    'closure',
    'fasteningOptionsByCategory',
    'pocket',
    'pocketOptions',
    'neck',
    'collarOptionsByCategory',
    'sleeve',
    'sleeveOptionsByCategory',
  ];
  const constructionFilled =
    getAssignmentLabels(dossier, constructionAttrIds, 99).length > 0 ||
    (dossier?.techPackAttachments?.length ?? 0) > 0;
  const packagingFilled =
    getAssignmentLabels(
      dossier,
      [
        'packaging',
        'labeling',
        'barcode',
        'careWashingClassOptions',
        'temperatureOptions',
        'packagingDimensionsClassOptions',
        'articleWeightPackagingClassOptions',
      ],
      99
    ).length > 0;

  return [
    { label: 'Аудитория', filled: audienceFilled, dossierSection: 'general' },
    { label: 'Замысел', filled: intentFilled, dossierSection: 'visuals' },
    {
      label: 'Материалы (BOM)',
      filled: materialFilled && packagingFilled,
      dossierSection: 'material',
    },
    {
      label: 'Конструкция и табель мер',
      filled: constructionFilled && measurementsFilled,
      dossierSection: 'construction',
    },
  ];
}

function pushUniqueBlocker(
  target: Workshop2OverviewBlocker[],
  blocker: Workshop2OverviewBlocker
) {
  if (target.some((item) => item.stage === blocker.stage && item.text === blocker.text)) return;
  target.push(blocker);
}

function buildTopBlockers(
  warnings: string[],
  routeStages: Workshop2OverviewRouteStage[]
): Workshop2OverviewBlocker[] {
  const blockers: Workshop2OverviewBlocker[] = [];
  const tzStage = routeStages.find((stage) => stage.id === 'tz');

  const visualsWarning = warnings.find(workshop2DossierWarningLooksVisual);
  if (visualsWarning && tzStage) {
    pushUniqueBlocker(blockers, {
      id: 'tz-visuals',
      stage: 'tz',
      stageLabel: 'ТЗ',
      owner: tzStage.owner,
      text: visualsWarning.length > 120 ? `${visualsWarning.slice(0, 117)}…` : visualsWarning,
      ctaLabel: 'Открыть',
      dossierSection: 'visuals',
    });
  }

  const materialsWarning = warnings.find((warning) => warning.includes('материал'));
  if (materialsWarning && tzStage) {
    pushUniqueBlocker(blockers, {
      id: 'tz-material',
      stage: 'tz',
      stageLabel: 'ТЗ',
      owner: tzStage.owner,
      text: 'Не подтвержден основной материал.',
      ctaLabel: 'Открыть',
      dossierSection: 'material',
    });
  }

  const measurementsWarning =
    warnings.find((warning) => warning.includes('Не заполнены мерки')) ??
    warnings.find((warning) => warning.includes('размерный блок'));
  if (measurementsWarning && tzStage) {
    pushUniqueBlocker(blockers, {
      id: 'tz-measurements',
      stage: 'tz',
      stageLabel: 'ТЗ',
      owner: tzStage.owner,
      text: measurementsWarning,
      ctaLabel: 'Открыть',
      dossierSection: 'construction',
    });
  }

  const approvalsWarning =
    warnings.find((warning) => warning.includes('дизайнера')) ??
    warnings.find((warning) => warning.includes('технолога'));
  if (approvalsWarning && tzStage) {
    pushUniqueBlocker(blockers, {
      id: 'tz-approvals',
      stage: 'tz',
      stageLabel: 'ТЗ',
      owner: tzStage.owner,
      text: approvalsWarning,
      ctaLabel: 'Открыть',
      dossierSection: 'general',
    });
  }

  for (const stage of routeStages) {
    if (stage.id === 'overview' || stage.id === 'tz' || !stage.blocker) continue;
    pushUniqueBlocker(blockers, {
      id: `${stage.id}-blocker`,
      stage: stage.id,
      stageLabel: stage.label,
      owner: stage.owner,
      text: stage.blocker,
      ctaLabel: 'Открыть',
    });
  }

  return blockers.slice(0, 3);
}

function buildPrimaryAction(
  warnings: string[],
  bundle: Workshop2OverviewBundleSnapshot | null,
  decisionItems: Workshop2OverviewDecisionItem[]
): Workshop2OverviewPrimaryAction {
  if (warnings.some(workshop2DossierWarningLooksVisual)) {
    return {
      tab: 'tz',
      title: 'Довести раздел «Визуал / эскиз»',
      reason:
        'Нужны согласованные поля каталога (где требует категория), референсы, скетч или метки и замысел — иначе маршрут SKU размыт.',
      buttonLabel: 'Следующее >',
      dossierSection: 'visuals',
    };
  }

  if (warnings.some((warning) => warning.includes('материал'))) {
    return {
      tab: 'tz',
      title: 'Подтвердить основной материал',
      reason: 'Материальный состав нужен как база для BOM, себестоимости и последующего handoff.',
      buttonLabel: 'Следующее >',
      dossierSection: 'material',
    };
  }

  if (
    warnings.some(
      (warning) => warning.includes('размерный блок') || warning.includes('Не заполнены мерки')
    )
  ) {
    return {
      tab: 'tz',
      title: 'Заполнить размерный блок',
      reason: 'Без мерок нельзя корректно передать SKU в fit и контроль качества.',
      buttonLabel: 'Следующее >',
      dossierSection: 'construction',
    };
  }

  if (warnings.some((warning) => warning.includes('дизайнера') || warning.includes('технолога'))) {
    return {
      tab: 'tz',
      title: 'Собрать финальные подтверждения',
      reason: 'Маршрут нельзя считать согласованным без отметок дизайнера и технолога.',
      buttonLabel: 'Следующее >',
      dossierSection: 'general',
    };
  }

  const firstDecisionGap = decisionItems.find((d) => !d.filled);
  if (firstDecisionGap) {
    return {
      tab: 'tz',
      title: `Закрыть блок «${firstDecisionGap.label}»`,
      reason:
        'По сводке решений на обзоре этот пункт ещё не закрыт — лучше согласовать ТЗ до операционных шагов маршрута.',
      buttonLabel: 'Следующее >',
      dossierSection: firstDecisionGap.dossierSection,
    };
  }

  if ((bundle?.supply?.lines.length ?? 0) === 0) {
    return {
      tab: 'supply',
      title: 'Собрать BOM',
      reason: 'Пока нет строк снабжения, артикул не готов к реальной исполнимости.',
      buttonLabel: 'Следующее >',
    };
  }

  const fitCommentCount = bundle?.fitGold?.fitComments.length ?? 0;
  if (fitCommentCount === 0) {
    return {
      tab: 'fit',
      title: 'Зафиксировать посадку образца',
      reason: 'Добавьте комментарии по эталонной примерке на вкладке «Эталон · посадка».',
      buttonLabel: 'Следующее >',
    };
  }

  if (!bundle?.fitGold?.goldApproved) {
    return {
      tab: 'stock',
      title: 'Принять сэмпл в коллекцию',
      reason:
        'На вкладке «Склад» заполните приёмку сэмпла (режим цепочки, комплаенс), затем подтвердите включение в коллекцию.',
      buttonLabel: 'Следующее >',
    };
  }

  const purchaseOrders = bundle?.planPo?.purchaseOrders ?? [];
  if (!purchaseOrders.some((po) => po.status === 'confirmed' || po.status === 'closed')) {
    return {
      tab: 'plan',
      title: 'Подтвердить PO',
      reason: 'Без подтвержденного PO нельзя стабильно планировать запуск и выпуск.',
      buttonLabel: 'Следующее >',
    };
  }

  if ((bundle?.qc?.batches.length ?? 0) === 0) {
    return {
      tab: 'qc',
      title: 'Завести контрольные партии',
      reason: 'SKU нужен рабочий контур качества до перехода в финальный цикл.',
      buttonLabel: 'Следующее >',
    };
  }

  return {
    tab: 'stock',
    title: 'Проверить складскую приемку',
    reason: 'Осталось закрыть финальный участок движения изделия после выпуска и контроля.',
    buttonLabel: 'Следующее >',
  };
}

/** Тексты для диалога «зачем секция ТЗ» в сводке решений на обзоре Цеха 2. */
export const WORKSHOP2_DOSSIER_SECTION_GUIDANCE: Record<
  DossierSection,
  { headline: string; purpose: string; essentials: string[] }
> = {
  general: {
    headline: 'Аудитория и общие данные',
    purpose:
      'Здесь задаётся, для кого изделие и в каком контексте оно живёт: позиционирование, сезон, роль модели в коллекции и финальные согласования. Без этого handoff по маршруту легко расходится с ожиданиями команды и фабрики.',
    essentials: [
      'Целевая аудитория и сегмент',
      'Сезон, капсула, носители образа',
      'Отметки дизайнера и технолога по готовности ТЗ',
    ],
  },
  visuals: {
    headline: 'Визуал и замысел',
    purpose:
      'Эталон «как должно выглядеть»: эскиз, референсы, акценты силуэта и стиля. Это общая опора для снабжения, конструктора, образца и контроля качества.',
    essentials: [
      'Эскиз и визуальные референсы',
      'Описание образа и отличий от базовых моделей',
    ],
  },
  material: {
    headline: 'Материалы (BOM)',
    purpose:
      'Состав тканей и фурнитуры, BOM и себестоимость; в той же вкладке — упаковка, маркировка, штрихкод и уход, чтобы выпуск и склад совпадали с брендом.',
    essentials: [
      'Основная и подкладочная ткань, утеплитель, фурнитура',
      'Упаковка, этикетки, штрихкод, care-label',
    ],
  },
  construction: {
    headline: 'Конструкция и табель мер',
    purpose:
      'Узлы, посадка и tech pack плюс базовый размер и табель мер: одни числа для ТЗ, образца, фабрики и ОТК.',
    essentials: [
      'Силуэт, узлы, карманы, застёжки, вложения tech pack',
      'Базовый размер, шкала и заполненные мерки',
    ],
  },
  sample_intake: {
    headline: 'Приёмка сэмпла в коллекцию',
    purpose:
      'После согласованного образца фиксируются финальные таможенно-комплаенс данные под отгрузку: цепочка производства, фактическое происхождение, утверждённый ТН ВЭД, маркировка и реквизиты документов. В паспорте ТЗ остаётся план и черновые коды.',
    essentials: [
      'Режим цепочки (РФ / импорт / ЕАЭС)',
      'Финальные поля блока приёмки на вкладке Fit',
      'Подтверждение «принять сэмпл» только при заполненном гейте',
    ],
  },
};

/** Тексты для диалога «что в этапе» на обзоре Цеха 2. */
export const WORKSHOP2_ROUTE_STAGE_GUIDANCE: Record<
  Workshop2OverviewTab,
  { headline: string; purpose: string; essentials: string[] }
> = {
  overview: {
    headline: 'Обзор',
    purpose:
      'Входная панель SKU: паспорт артикула, прогресс и замечания, карта маршрута, обязательные решения из ТЗ, блокеры и один следующий шаг — без дублирования длинных форм.',
    essentials: [
      'Понять, что за изделие и где оно в процессе',
      'Увидеть топ-блокеры и перейти в нужный раздел ТЗ',
      'Сверить операционные KPI, когда появятся данные',
    ],
  },
  tz: {
    headline: 'ТЗ · Дизайн + тех',
    purpose:
      'Зафиксировать изделие как продукт: кто аудитория, как выглядит модель, из чего шьём, какие мерки и конструкция, как уходит на выпуск и склад.',
    essentials: [
      'Паспорт артикула и аудитория',
      'Визуал, эскиз, замысел',
      'Материалы и состав',
      'Табель мер и базовый размер',
      'Конструкция и техпакет',
      'Упаковка, маркировка, штрихкод',
      'Отметки дизайнера и технолога',
    ],
  },
  supply: {
    headline: 'Снабжение · Закупка',
    purpose: 'Перевести материальный замысел в исполнимый BOM: позиции, статусы, поставщики и сроки.',
    essentials: [
      'Строки BOM по SKU',
      'Подтверждение поставок и статусов',
      'Критичные сроки под запуск',
    ],
  },
  fit: {
    headline: 'Эталон · посадка',
    purpose: 'Сверить образец с ТЗ и зафиксировать gold sample как эталон для серии.',
    essentials: [
      'Замеры и комментарии по посадке',
      'Утверждение эталонного образца',
    ],
  },
  plan: {
    headline: 'План · PO',
    purpose: 'Закрепить закупку и запуск: PO, даты, привязка к производству.',
    essentials: [
      'Черновики и подтверждённые PO',
      'Синхронизация с выпуском',
    ],
  },
  release: {
    headline: 'Выпуск',
    purpose: 'Описать и отслеживать производственный маршрут по SKU в цеху.',
    essentials: [
      'Техоперации и их статусы',
      'Готовность к передаче в ОТК',
    ],
  },
  qc: {
    headline: 'ОТК',
    purpose: 'Контроль партий по качеству и допускам относительно ТЗ.',
    essentials: [
      'Партии и AQL',
      'Брак, доработки, повторные проверки',
    ],
  },
  stock: {
    headline: 'Склад',
    purpose: 'Зафиксировать приёмку и движения готовой продукции по артикулу.',
    essentials: [
      'Приёмка и остатки',
      'Блокировки к отгрузке при необходимости',
    ],
  },
};

export function buildWorkshop2OverviewModel(args: {
  dossier: Workshop2DossierPhase1 | null;
  leaf: HandbookCategoryLeaf | undefined | null;
  bundle: Workshop2OverviewBundleSnapshot | null;
}): Workshop2OverviewModel {
  const { dossier, leaf, bundle } = args;
  const dossierReadiness = calculateDossierReadiness(dossier, leaf);
  const routeStages = calculateArticleStageGates(dossierReadiness, bundle).map((stage) => ({
    id: stage.stage as Workshop2OverviewTab,
    label: stage.label,
    owner: stage.owner,
    status: stage.status,
    pct: stage.pct,
    blocker: stage.blocker,
  }));
  const warnings = dossierReadiness.summary.warnings;
  const decisionItems = buildDecisionItems(dossier);

  return {
    decisionItems,
    routeStages,
    topBlockers: buildTopBlockers(warnings, routeStages),
    primaryAction: buildPrimaryAction(warnings, bundle, decisionItems),
  };
}
