/**
 * Паспорт ТЗ: атрибуты «старт» vs блок до образца/отгрузки, хаб и гейт.
 * Обязательные поля каталога зависят от шага ТЗ (`tzPhase`: phase1 → requiredForPhase1, 2/3 → requiredForPhase2).
 */
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** Таможня / рынок / штрихкод в паспорте — дозаполняются ближе к образцу, отдельно от базовой рамки. */
export const PASSPORT_GENERAL_PRE_SAMPLE_ATTR_IDS = new Set<string>([
  'countryOfOriginMarketOptions',
  'productBarcodeTypeOptions',
  'customsHsDeclarationOptions',
  'customsProductGroupOptions',
  'customsTnvedCodePrimary',
  'customsTnvedCodeSecondary',
  'customsTnvedCodeTertiary',
  'customsTnvedPreliminaryCode',
  'customsClassificationRationale',
  'customsValueIncotermsNote',
]);

export type Workshop2PassportCheckSnapshot = {
  checkedAtIso: string;
  startPct: number;
  preSamplePct: number;
  combinedPct: number;
  lines: string[];
};

function assignmentOk(dossier: Workshop2DossierPhase1, attributeId: string): boolean {
  return dossier.assignments.some((a) => a.attributeId === attributeId && a.values.length > 0);
}

/** Шаг ТЗ в редакторе досье (те же значения, что у material BOM export). */
export type WorkshopPassportTzPhase = '1' | '2' | '3';

/** Обязательность строки паспорта в «Старт по каталогу» для данного шага ТЗ. */
export function passportCatalogRowRequiredForTzPhase(
  row: ResolvedPhase1AttributeRow,
  tzPhase: WorkshopPassportTzPhase
): boolean {
  const a = row.attribute;
  if (tzPhase === '1') return Boolean(a.requiredForPhase1);
  /** Шаги 2–3: в каталоге есть только флаг phase2; для phase3 используем ту же планку. */
  return Boolean(a.requiredForPhase2);
}

export function partitionGeneralPassportRows(rows: ResolvedPhase1AttributeRow[]): {
  startRows: ResolvedPhase1AttributeRow[];
  preSampleRows: ResolvedPhase1AttributeRow[];
} {
  const preSampleRows = rows.filter((r) => PASSPORT_GENERAL_PRE_SAMPLE_ATTR_IDS.has(r.attribute.attributeId));
  const startRows = rows.filter((r) => !PASSPORT_GENERAL_PRE_SAMPLE_ATTR_IDS.has(r.attribute.attributeId));
  return { startRows, preSampleRows };
}

export function partitionGeneralPassportExtras(extras: { attribute: AttributeCatalogAttribute; groupLabel: string }[]): {
  startExtras: { attribute: AttributeCatalogAttribute; groupLabel: string }[];
  preSampleExtras: { attribute: AttributeCatalogAttribute; groupLabel: string }[];
} {
  const preSampleExtras = extras.filter((e) => PASSPORT_GENERAL_PRE_SAMPLE_ATTR_IDS.has(e.attribute.attributeId));
  const startExtras = extras.filter((e) => !PASSPORT_GENERAL_PRE_SAMPLE_ATTR_IDS.has(e.attribute.attributeId));
  return { startExtras, preSampleExtras };
}

export function buildWorkshop2PassportCheckSnapshot(
  dossier: Workshop2DossierPhase1,
  skuDraft: string,
  nameDraft: string,
  selectedAudienceId: string | undefined,
  currentLeaf: HandbookCategoryLeaf,
  startRows: ResolvedPhase1AttributeRow[],
  preSampleRows: ResolvedPhase1AttributeRow[],
  tzPhase: WorkshopPassportTzPhase = '1'
): Workshop2PassportCheckSnapshot {
  const pb = dossier.passportProductionBrief;
  const lines: string[] = [];
  const checks: boolean[] = [];

  const skuOk = Boolean(skuDraft.trim());
  if (!skuOk) lines.push('Нет SKU артикула.');
  checks.push(skuOk);

  const nameOk = Boolean(nameDraft.trim());
  if (!nameOk) lines.push('Нет рабочего названия модели.');
  checks.push(nameOk);

  const audOk = Boolean(selectedAudienceId?.trim());
  if (!audOk) lines.push('Не выбрана аудитория.');
  checks.push(audOk);

  const leafOk = Boolean(currentLeaf?.leafId?.trim() && currentLeaf.pathLabel?.trim());
  if (!leafOk) lines.push('Не зафиксирована ветка каталога (L1–L3).');
  checks.push(leafOk);

  const ownerOk = Boolean(pb?.articleCardOwnerName?.trim());
  if (!ownerOk) lines.push('Укажите ответственного за карточку артикула (администратор модели).');
  checks.push(ownerOk);

  const launchOk = Boolean(pb?.plannedLaunchType && pb.plannedLaunchType !== 'undecided');
  if (!launchOk) lines.push('Выберите планируемый тип запуска (своё производство / КНП / смешанный).');
  checks.push(launchOk);

  const anchorOk = Boolean(pb?.targetSampleOrPilotDate?.trim());
  if (!anchorOk) lines.push('Задайте целевую дату образца или пилотной партии.');
  checks.push(anchorOk);

  const critOk = pb?.deadlineCriticality === 'hard' || pb?.deadlineCriticality === 'flexible';
  if (!critOk) lines.push('Укажите критичность срока: жёсткий дедлайн или гибкий ориентир.');
  checks.push(critOk);

  for (const row of startRows) {
    if (!passportCatalogRowRequiredForTzPhase(row, tzPhase)) continue;
    const ok = assignmentOk(dossier, row.attribute.attributeId);
    checks.push(ok);
    if (!ok) lines.push(`Старт по каталогу: заполните «${row.attribute.name}».`);
  }

  const startDone = checks.filter(Boolean).length;
  const startTotal = checks.length;
  const startPct = startTotal > 0 ? Math.round((startDone / startTotal) * 100) : 100;

  let preDone = 0;
  const preTotal = preSampleRows.length;
  for (const row of preSampleRows) {
    if (assignmentOk(dossier, row.attribute.attributeId)) preDone++;
    else lines.push(`До образца / отгрузки: «${row.attribute.name}».`);
  }
  const preSamplePct = preTotal > 0 ? Math.round((preDone / preTotal) * 100) : 100;

  const combinedTotal = startTotal + preTotal;
  const combinedDone = startDone + preDone;
  const combinedPct = combinedTotal > 0 ? Math.round((combinedDone / combinedTotal) * 100) : 100;

  return {
    checkedAtIso: new Date().toISOString(),
    startPct,
    preSamplePct,
    combinedPct,
    lines,
  };
}

/** Якоря подстраницы «Паспорт» в ТЗ (липкая навигация + гейт). */
export const W2_PASSPORT_SUBPAGE_ANCHORS = {
  /** Хлебные крошки разделов ТЗ и первичность секций для `w2view` (`data-w2-dossier-view` на корне панели). */
  denseView: 'w2-passport-dense-view',
  hub: 'w2-passport-hub',
  identity: 'w2-passport-identity',
  brief: 'w2-passport-brief',
  start: 'w2-passport-start',
  market: 'w2-passport-market',
  audit: 'w2-passport-audit',
  readOnly: 'w2-passport-readonly',
} as const;

export type Workshop2PassportGateItem = {
  id: string;
  message: string;
  anchorId: string;
  jumpLabel: string;
};

export type Workshop2PassportRouteCheckpoint = {
  id: string;
  label: string;
  done: boolean;
  anchorId: string;
};

export type Workshop2PassportHubModel = {
  checkpoints: Workshop2PassportRouteCheckpoint[];
  gateItems: Workshop2PassportGateItem[];
  startPct: number;
  preSamplePct: number;
  combinedPct: number;
};

const PA = W2_PASSPORT_SUBPAGE_ANCHORS;

/**
 * Контрольные точки «паспорт для маршрута», мини-гейт и проценты (тот же контур, что snapshot.lines).
 */
export function buildPassportHubModel(
  dossier: Workshop2DossierPhase1,
  skuDraft: string,
  nameDraft: string,
  selectedAudienceId: string | undefined,
  currentLeaf: HandbookCategoryLeaf,
  startRows: ResolvedPhase1AttributeRow[],
  preSampleRows: ResolvedPhase1AttributeRow[],
  tzPhase: WorkshopPassportTzPhase = '1'
): Workshop2PassportHubModel {
  const pb = dossier.passportProductionBrief;
  const gateItems: Workshop2PassportGateItem[] = [];
  const startCatalogLabel =
    tzPhase === '1'
      ? 'Обязательные поля «Старт по каталогу»'
      : `Обязательные поля паспорта (шаг ${tzPhase} ТЗ)`;

  const skuOk = Boolean(skuDraft.trim());
  if (!skuOk) {
    gateItems.push({
      id: 'pg-sku',
      message: 'Нет SKU артикула.',
      anchorId: PA.identity,
      jumpLabel: 'Идентификация',
    });
  }

  const nameOk = Boolean(nameDraft.trim());
  if (!nameOk) {
    gateItems.push({
      id: 'pg-name',
      message: 'Нет рабочего названия модели.',
      anchorId: PA.identity,
      jumpLabel: 'Идентификация',
    });
  }

  const audOk = Boolean(selectedAudienceId?.trim());
  if (!audOk) {
    gateItems.push({
      id: 'pg-aud',
      message: 'Не выбрана аудитория.',
      anchorId: PA.identity,
      jumpLabel: 'Идентификация',
    });
  }

  const leafOk = Boolean(currentLeaf?.leafId?.trim() && currentLeaf.pathLabel?.trim());
  if (!leafOk) {
    gateItems.push({
      id: 'pg-leaf',
      message: 'Не зафиксирована ветка каталога (L1–L3).',
      anchorId: PA.identity,
      jumpLabel: 'Идентификация',
    });
  }

  const ownerOk = Boolean(pb?.articleCardOwnerName?.trim());
  if (!ownerOk) {
    gateItems.push({
      id: 'pg-owner',
      message: 'Укажите ответственного за карточку артикула.',
      anchorId: PA.brief,
      jumpLabel: 'Бриф',
    });
  }

  const launchOk = Boolean(pb?.plannedLaunchType && pb.plannedLaunchType !== 'undecided');
  if (!launchOk) {
    gateItems.push({
      id: 'pg-launch',
      message: 'Выберите планируемый тип запуска (своё производство / КНП / смешанный).',
      anchorId: PA.brief,
      jumpLabel: 'Бриф',
    });
  }

  const anchorOk = Boolean(pb?.targetSampleOrPilotDate?.trim());
  if (!anchorOk) {
    gateItems.push({
      id: 'pg-date',
      message: 'Задайте целевую дату образца или пилотной партии.',
      anchorId: PA.brief,
      jumpLabel: 'Бриф',
    });
  }

  const critOk = pb?.deadlineCriticality === 'hard' || pb?.deadlineCriticality === 'flexible';
  if (!critOk) {
    gateItems.push({
      id: 'pg-crit',
      message: 'Укажите критичность срока: жёсткий дедлайн или гибкий ориентир.',
      anchorId: PA.brief,
      jumpLabel: 'Бриф',
    });
  }

  let startRequiredOk = true;
  for (const row of startRows) {
    if (!passportCatalogRowRequiredForTzPhase(row, tzPhase)) continue;
    const ok = assignmentOk(dossier, row.attribute.attributeId);
    if (!ok) {
      startRequiredOk = false;
      gateItems.push({
        id: `pg-start-${row.attribute.attributeId}`,
        message: `Старт по каталогу: заполните «${row.attribute.name}».`,
        anchorId: PA.start,
        jumpLabel: 'Старт',
      });
    }
  }

  let preMissing = 0;
  for (const row of preSampleRows) {
    if (assignmentOk(dossier, row.attribute.attributeId)) continue;
    preMissing++;
    if (preMissing <= 6) {
      gateItems.push({
        id: `pg-pre-${row.attribute.attributeId}`,
        message: `До образца / отгрузки: «${row.attribute.name}».`,
        anchorId: PA.market,
        jumpLabel: 'Рынок',
      });
    }
  }
  if (preMissing > 6) {
    gateItems.push({
      id: 'pg-pre-more',
      message: `И ещё ${preMissing - 6} полей в блоке «Рынок и коды» не заполнены.`,
      anchorId: PA.market,
      jumpLabel: 'Рынок',
    });
  }

  const preTotal = preSampleRows.length;
  let preDone = 0;
  for (const row of preSampleRows) {
    if (assignmentOk(dossier, row.attribute.attributeId)) preDone++;
  }
  const preSamplePct = preTotal > 0 ? Math.round((preDone / preTotal) * 100) : 100;

  const identityDone = skuOk && nameOk && audOk && leafOk;
  const briefDone = ownerOk && launchOk && anchorOk && critOk;

  const checkpoints: Workshop2PassportRouteCheckpoint[] = [
    { id: 'pc-identity', label: 'Идентификация (SKU, название, аудитория, L1–L3)', done: identityDone, anchorId: PA.identity },
    { id: 'pc-brief', label: 'Бриф до образца (ответственный, запуск, дата, критичность)', done: briefDone, anchorId: PA.brief },
    {
      id: 'pc-start',
      label: startCatalogLabel,
      done: startRequiredOk,
      anchorId: PA.start,
    },
    {
      id: 'pc-market',
      label: 'Рынок и коды (по мере готовности)',
      done: preTotal === 0 || preDone >= preTotal,
      anchorId: PA.market,
    },
  ];

  const startChecks = 8 + startRows.filter((r) => passportCatalogRowRequiredForTzPhase(r, tzPhase)).length;
  let startDoneCount = 0;
  if (skuOk) startDoneCount++;
  if (nameOk) startDoneCount++;
  if (audOk) startDoneCount++;
  if (leafOk) startDoneCount++;
  if (ownerOk) startDoneCount++;
  if (launchOk) startDoneCount++;
  if (anchorOk) startDoneCount++;
  if (critOk) startDoneCount++;
  for (const row of startRows) {
    if (!passportCatalogRowRequiredForTzPhase(row, tzPhase)) continue;
    if (assignmentOk(dossier, row.attribute.attributeId)) startDoneCount++;
  }
  const startPct = startChecks > 0 ? Math.round((startDoneCount / startChecks) * 100) : 100;

  const combinedTotal = startChecks + preTotal;
  const combinedDone = startDoneCount + preDone;
  const combinedPct = combinedTotal > 0 ? Math.round((combinedDone / combinedTotal) * 100) : 100;

  return {
    checkpoints,
    gateItems,
    startPct,
    preSamplePct,
    combinedPct,
  };
}
