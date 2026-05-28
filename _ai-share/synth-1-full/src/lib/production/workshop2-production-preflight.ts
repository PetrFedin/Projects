import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';
import {
  compositionLabelConstructorFiberHasRows,
  compositionLabelConstructorFiberPercentSum,
  compositionLabelFiberRowsSumIsHundred,
} from './workshop2-composition-label-constructor';
import { normalizeSketchSheets } from './workshop2-sketch-sheets';
import { runWorkshop2AiConflictChecks } from './workshop2-preflight-ai-conflict-registry';

export type W2PreflightSeverity = 'blocker' | 'warning';

export type W2ProductionPreflightIssue = {
  id: string;
  severity: W2PreflightSeverity;
  section: 'passport' | 'visuals' | 'materials' | 'construction' | 'sketch' | 'handoff';
  label: string;
  detail: string;
  anchor?: string;
};

export type W2ProductionPreflightSnapshot = {
  score: number;
  blockers: W2ProductionPreflightIssue[];
  warnings: W2ProductionPreflightIssue[];
  issues: W2ProductionPreflightIssue[];
  canSendToFactory: boolean;
};

/** SKU/название из черновика карточки артикула — синхронно с `sectionReadinessUi` и предупреждениями вкладки. */
export type W2ProductionPreflightOpts = {
  articleSkuDraft?: string;
  articleNameDraft?: string;
};

export type W2ProductionPreflightScoreBand = {
  label: string;
  tone: 'text-rose-700' | 'text-amber-700' | 'text-emerald-700';
};

/** Пороги совпадают с полосой «Готовность производства» в UI кабинета. */
export function getW2ProductionPreflightScoreBand(score: number): W2ProductionPreflightScoreBand {
  if (score < 60) return { label: 'нельзя передавать', tone: 'text-rose-700' };
  if (score < 80) return { label: 'риск', tone: 'text-amber-700' };
  return { label: 'готово', tone: 'text-emerald-700' };
}

function hasAssignmentValue(dossier: Workshop2DossierPhase1, attributeId: string): boolean {
  return (dossier.assignments ?? []).some(
    (a) => a.attributeId === attributeId && (a.values ?? []).length > 0
  );
}

function hasText(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasSketch(dossier: Workshop2DossierPhase1): boolean {
  const sheets = normalizeSketchSheets(dossier.sketchSheets);
  return hasText(dossier.categorySketchImageDataUrl) || sheets.some((s) => hasText(s.imageDataUrl));
}

function hasBaseMeasurements(dossier: Workshop2DossierPhase1): boolean {
  const dims = dossier.sampleBasePerSizeDimensions;
  if (!dims) return false;
  return Object.values(dims).some((row) => {
    const values = Object.values(row ?? {}).filter((v) => String(v ?? '').trim().length > 0);
    return values.length >= 3;
  });
}

function addIssue(issues: W2ProductionPreflightIssue[], issue: W2ProductionPreflightIssue): void {
  issues.push(issue);
}

export function buildWorkshop2ProductionPreflightSnapshot(
  dossier: Workshop2DossierPhase1,
  opts?: W2ProductionPreflightOpts
): W2ProductionPreflightSnapshot {
  const issues: W2ProductionPreflightIssue[] = [];

  const hasSku = hasAssignmentValue(dossier, 'sku') || hasText(opts?.articleSkuDraft);
  const hasName = hasAssignmentValue(dossier, 'name') || hasText(opts?.articleNameDraft);
  const hasL3 = hasAssignmentValue(dossier, 'l3');
  const hasAudience = hasAssignmentValue(dossier, 'audience');

  const hasVisualRef = (dossier.visualReferences?.length ?? 0) > 0;
  const sketchReady = hasSketch(dossier);

  const hasMaterial = hasAssignmentValue(dossier, 'mat');
  const hasComposition = hasAssignmentValue(dossier, 'composition');

  const hasColor =
    hasAssignmentValue(dossier, 'color') ||
    hasAssignmentValue(dossier, 'primaryColorFamilyOptions');
  const hasLength = hasAssignmentValue(dossier, 'len');
  const hasSilhouette =
    hasAssignmentValue(dossier, 'silh') || hasAssignmentValue(dossier, 'clothingFitOptions');

  const hasSleeve =
    hasAssignmentValue(dossier, 'sleeve') || hasAssignmentValue(dossier, 'sleeveOptionsByCategory');
  const hasPocket =
    hasAssignmentValue(dossier, 'pocket') || hasAssignmentValue(dossier, 'pocketOptions');
  const hasClosure =
    hasAssignmentValue(dossier, 'closure') ||
    hasAssignmentValue(dossier, 'closureOptionsByCategory') ||
    hasAssignmentValue(dossier, 'fastenerOptionsByCategory');
  const hasHardware = hasAssignmentValue(dossier, 'hardwareOptionsByCategory');
  const hasCollar =
    hasAssignmentValue(dossier, 'collarOptionsByCategory') || hasAssignmentValue(dossier, 'neck');
  const hasLining = hasAssignmentValue(dossier, 'liningOptionsByCategory');

  const hasMeasurements = hasBaseMeasurements(dossier);

  const labelSpec = dossier.compositionLabelSpec;
  const hasLabelFiberRows = compositionLabelConstructorFiberHasRows(labelSpec);
  const fiberSum = compositionLabelConstructorFiberPercentSum(labelSpec);
  const fiberSumOk = compositionLabelFiberRowsSumIsHundred(labelSpec);

  // AI Cross-check logic from registry
  const l1Value =
    dossier.assignments.find((a) => a.attributeId === 'l1')?.values?.[0]?.displayLabel ?? '';
  const l2Value =
    dossier.assignments.find((a) => a.attributeId === 'l2')?.values?.[0]?.displayLabel ?? '';
  const l3Value =
    dossier.assignments.find((a) => a.attributeId === 'l3')?.values?.[0]?.displayLabel ?? '';

  const aiConflicts = runWorkshop2AiConflictChecks(dossier, {
    l1Name: l1Value,
    l2Name: l2Value,
    l3Name: l3Value,
  });

  aiConflicts.forEach((c) => addIssue(issues, c));

  if (!hasSku) {
    addIssue(issues, {
      id: 'passport.sku.missing',
      severity: 'blocker',
      section: 'passport',
      label: 'Нет SKU',
      detail: 'Без артикула производство и документы не смогут связать образец с карточкой.',
      anchor: 'passport',
    });
  }
  if (!hasName) {
    addIssue(issues, {
      id: 'passport.name.missing',
      severity: 'blocker',
      section: 'passport',
      label: 'Нет рабочего названия модели',
      detail: 'Нужно короткое понятное название изделия.',
      anchor: 'passport',
    });
  }
  if (!hasL3) {
    addIssue(issues, {
      id: 'passport.l3.missing',
      severity: 'blocker',
      section: 'passport',
      label: 'Не выбрана карточка модели L3',
      detail: 'Без L3 система не понимает, какие узлы и проверки применять.',
      anchor: 'passport',
    });
  }
  if (!hasAudience) {
    addIssue(issues, {
      id: 'passport.audience.missing',
      severity: 'warning',
      section: 'passport',
      label: 'Не указана аудитория',
      detail: 'Для образца это не всегда блокер, но для карточки артикула обязательно.',
      anchor: 'passport',
    });
  }
  if (!hasVisualRef && !sketchReady) {
    addIssue(issues, {
      id: 'visual.reference_or_sketch.missing',
      severity: 'blocker',
      section: 'visuals',
      label: 'Нет визуального канона',
      detail:
        'Нужен хотя бы один референс или скетч, иначе производство будет трактовать изделие на свой вкус.',
      anchor: 'visuals',
    });
  }
  if (!hasColor) {
    addIssue(issues, {
      id: 'visual.color.missing',
      severity: 'warning',
      section: 'visuals',
      label: 'Не указан основной цвет',
      detail: 'Для первого сэмпла можно пропустить, но для финального ТЗ цвет нужен.',
      anchor: 'visuals',
    });
  }
  if (!hasSilhouette) {
    addIssue(issues, {
      id: 'construction.silhouette.missing',
      severity: 'blocker',
      section: 'construction',
      label: 'Не указан силуэт / посадка',
      detail: 'Производство не сможет корректно собрать образец без решения по посадке.',
      anchor: 'construction',
    });
  }
  if (!hasLength) {
    addIssue(issues, {
      id: 'construction.length.missing',
      severity: 'warning',
      section: 'construction',
      label: 'Не указана длина изделия',
      detail: 'Для пальто, курток, платьев и юбок длина должна быть задана явно.',
      anchor: 'construction',
    });
  }
  if (!hasSleeve) {
    addIssue(issues, {
      id: 'construction.sleeve.missing',
      severity: 'blocker',
      section: 'construction',
      label: 'Не описан рукав',
      detail: 'Для верхней одежды рукав — обязательный узел.',
      anchor: 'construction',
    });
  }
  if (!hasClosure) {
    addIssue(issues, {
      id: 'construction.closure.missing',
      severity: 'blocker',
      section: 'construction',
      label: 'Не указана застёжка',
      detail:
        'Нужно выбрать тип застёжки: пуговицы, молния, кнопки, скрытая планка или явно указать отсутствие.',
      anchor: 'construction',
    });
  }
  if (hasClosure && !hasHardware) {
    addIssue(issues, {
      id: 'materials.hardware.missing',
      severity: 'blocker',
      section: 'materials',
      label: 'Есть застёжка, но нет фурнитуры',
      detail: 'Для застёжки нужно указать пуговицы, молнию, кнопки или другую фурнитуру.',
      anchor: 'materials',
    });
  }
  if (!hasPocket) {
    addIssue(issues, {
      id: 'construction.pocket.missing',
      severity: 'warning',
      section: 'construction',
      label: 'Не описаны карманы',
      detail:
        'Если карманов нет — лучше явно указать "без карманов", иначе это останется серой зоной.',
      anchor: 'construction',
    });
  }
  if (!hasCollar) {
    addIssue(issues, {
      id: 'construction.collar.missing',
      severity: 'warning',
      section: 'construction',
      label: 'Не описан воротник / горловина',
      detail: 'Для пальто и верхней одежды это важный конструктивный узел.',
      anchor: 'construction',
    });
  }
  if (!hasLining) {
    addIssue(issues, {
      id: 'materials.lining.missing',
      severity: 'warning',
      section: 'materials',
      label: 'Не указана подкладка',
      detail: 'Для пальто нужно указать материал подкладки или явно отметить "без подкладки".',
      anchor: 'materials',
    });
  }
  if (!hasMaterial) {
    addIssue(issues, {
      id: 'materials.main.missing',
      severity: 'blocker',
      section: 'materials',
      label: 'Нет основного материала',
      detail: 'Без материала корпуса ТЗ нельзя передавать в производство.',
      anchor: 'materials',
    });
  }
  if (!hasComposition && !hasLabelFiberRows) {
    addIssue(issues, {
      id: 'materials.composition.missing',
      severity: 'blocker',
      section: 'materials',
      label: 'Нет сырьевого состава',
      detail: 'Нужно заполнить состав через mat/composition или через конструктор бирки.',
      anchor: 'materials',
    });
  }
  if (hasLabelFiberRows && !fiberSumOk) {
    addIssue(issues, {
      id: 'materials.composition.sum.invalid',
      severity: 'blocker',
      section: 'materials',
      label: 'Состав не равен 100%',
      detail: `Сейчас сумма состава ${fiberSum}%. Нужно 100%.`,
      anchor: 'materials',
    });
  }
  if (!hasMeasurements) {
    addIssue(issues, {
      id: 'construction.measurements.missing',
      severity: 'blocker',
      section: 'construction',
      label: 'Нет базовых замеров',
      detail: 'Минимум для сэмпла: длина изделия, грудь, плечо, рукав.',
      anchor: 'construction',
    });
  } else {
    const dims = dossier.sampleBasePerSizeDimensions;
    const tols = dossier.sampleBaseDimensionTolerances ?? {};
    const keysWithDims = new Set<string>();
    if (dims) {
      for (const row of Object.values(dims)) {
        for (const [k, v] of Object.entries(row ?? {})) {
          if (String(v ?? '').trim().length > 0) keysWithDims.add(k);
        }
      }
    }
    const missingTolerance = Array.from(keysWithDims).some(
      (k) => !tols[k] || (tols[k].plus == null && tols[k].minus == null)
    );
    if (missingTolerance) {
      addIssue(issues, {
        id: 'construction.measurements.tolerances_missing',
        severity: 'warning',
        section: 'construction',
        label: 'Не указаны допуски для мерок',
        detail: 'Политикой бренда предусмотрено указание допусков (±см) для всех мерок в таблице.',
        anchor: 'construction',
      });
    }
  }

  const model = dossier.productionModel;
  if (model && model.materialLines.length > 0) {
    const missingYield = model.materialLines.some((m) => m.yieldPerUnit == null);
    if (missingYield) {
      addIssue(issues, {
        id: 'materials.yield.missing',
        severity: 'warning',
        section: 'materials',
        label: 'Не указан расход материалов',
        detail:
          'В BOM (раздел Конструкция/Узлы) есть материалы без указания расхода на единицу (yield).',
        anchor: 'construction',
      });
    }

    const missingSupplierOrArticle = model.materialLines.some(
      (m) => (m.materialName?.length ?? 0) > 0 && !(m.supplier?.trim() || m.article?.trim())
    );
    if (missingSupplierOrArticle) {
      addIssue(issues, {
        id: 'materials.supplier_or_article.missing',
        severity: 'blocker',
        section: 'materials',
        label: 'Материалы-заглушки в BOM',
        detail:
          'В BOM добавлены материалы, у которых не указаны ни поставщик, ни артикул. Производство не сможет закупить такое сырье.',
        anchor: 'materials',
      });
    }
  }
  if (!sketchReady) {
    addIssue(issues, {
      id: 'sketch.image.missing',
      severity: 'blocker',
      section: 'sketch',
      label: 'Нет скетча',
      detail: 'Нужен хотя бы один скетч или подложка с изображением.',
      anchor: 'sketch',
    });
  }

  const blockers = issues.filter((i) => i.severity === 'blocker');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const penalty = blockers.length * 14 + warnings.length * 5;
  const score = Math.max(0, Math.min(100, 100 - penalty));

  return {
    score,
    blockers,
    warnings,
    issues,
    canSendToFactory: blockers.length === 0,
  };
}
