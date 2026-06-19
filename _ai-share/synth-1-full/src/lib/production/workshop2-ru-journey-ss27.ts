/**
 * Wave 12 RU: сквозной путь SS27 «коллекция → образец → цех» — чистые функции URL + статусы шагов.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { workshop2ArticleHref, workshop2CollectionListHref } from '@/lib/production/workshop2-url';
import { workshop2ContextToProductionFloorHubHref } from '@/lib/production/workshop2-floor-bridge';
import { workshop2MobileInspectorHref } from '@/lib/production/workshop2-mobile-inspector-checklist';
import { workshop2EdoStatusLabelRu } from '@/lib/production/workshop2-edo-signoff';
import {
  workshop2PgMirrorNum,
  workshop2PgMirrorStr,
} from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export const WORKSHOP2_SS27_COLLECTION_ID = 'SS27';

export type Workshop2RuJourneyStepId = 'collection' | 'workspace' | 'sample' | 'gold' | 'floor';

export type Workshop2RuJourneyStepStatus = 'done' | 'active' | 'pending' | 'blocked';

export type Workshop2RuJourneyStep = {
  id: Workshop2RuJourneyStepId;
  order: number;
  labelRu: string;
  href: string;
  status: Workshop2RuJourneyStepStatus;
  hintRu?: string;
};

export type Workshop2RuJourneyInput = {
  collectionId: string;
  articleId: string;
  articleUrlSegment?: string;
  dossier?: Workshop2DossierPhase1 | null;
};

function articleSegment(input: Workshop2RuJourneyInput): string {
  return (input.articleUrlSegment ?? input.articleId).trim();
}

/** Пять шагов «Путь SS27» для stepper на хабе. */
export function buildWorkshop2Ss27RuJourneySteps(
  input: Workshop2RuJourneyInput
): Workshop2RuJourneyStep[] {
  const cid = input.collectionId.trim();
  const aid = input.articleId.trim();
  const seg = articleSegment(input);
  const d = input.dossier;

  const hasSampleOrder = Boolean(d?.sampleWorkflow?.activeSampleOrderId?.trim());
  const goldApproved = d?.goldSampleStatus?.status === 'approved';
  const edoSigned = d?.edoSignoffMirror?.edoStatus === 'signed';
  const overallPct = workshop2PgMirrorNum(
    d?.readinessPulseMirror,
    'overallPct',
    typeof d?.readinessPulseMirror?.overallPct === 'number'
      ? d.readinessPulseMirror.overallPct
      : Number.NaN
  );
  const tzReady = Boolean(Number.isFinite(overallPct) && overallPct >= 70);
  const floorTab =
    workshop2PgMirrorStr(d?.floorBridgeMirror, 'lastFloorTab') ||
    (typeof d?.floorBridgeMirror?.lastFloorTab === 'string'
      ? d.floorBridgeMirror.lastFloorTab
      : '');
  const floorLinked = Boolean(floorTab.trim());

  const collectionStatus: Workshop2RuJourneyStepStatus = 'done';
  const workspaceStatus: Workshop2RuJourneyStepStatus = tzReady
    ? 'done'
    : hasSampleOrder
      ? 'active'
      : 'pending';
  const sampleStatus: Workshop2RuJourneyStepStatus = hasSampleOrder
    ? 'done'
    : tzReady
      ? 'active'
      : 'blocked';
  const goldStatus: Workshop2RuJourneyStepStatus =
    goldApproved && edoSigned ? 'done' : hasSampleOrder ? 'active' : 'pending';
  const floorStatus: Workshop2RuJourneyStepStatus = floorLinked
    ? 'done'
    : hasSampleOrder
      ? 'active'
      : 'pending';

  return [
    {
      id: 'collection',
      order: 1,
      labelRu: 'Коллекция SS27',
      href: workshop2CollectionListHref(cid),
      status: collectionStatus,
      hintRu: 'Хаб артикулов и фильтры коллекции.',
    },
    {
      id: 'workspace',
      order: 2,
      labelRu: 'ТЗ в workspace',
      href: workshop2ArticleHref(cid, seg, { w2pane: 'tz' }),
      status: workspaceStatus,
      hintRu: tzReady ? 'ТЗ ≥70% по pulse.' : 'Заполните ТЗ перед образцом.',
    },
    {
      id: 'sample',
      order: 3,
      labelRu: 'Заказ образца',
      href: workshop2ArticleHref(cid, seg, { w2pane: 'plan', hash: 'w2article-section-plan-po' }),
      status: sampleStatus,
      hintRu: hasSampleOrder ? 'Образец создан в PG.' : 'Создайте заказ на вкладке «План заказа».',
    },
    {
      id: 'gold',
      order: 4,
      labelRu: 'Эталон и ЭДО',
      href: workshop2ArticleHref(cid, seg, { w2pane: 'fit', w2sec: 'construction' }),
      status: goldStatus,
      hintRu:
        goldApproved && edoSigned
          ? 'Gold sample и ЭП подписаны.'
          : `ЭДО: ${d?.edoSignoffMirror ? workshop2EdoStatusLabelRu(d.edoSignoffMirror.edoStatus) : 'не запрошено'}`,
    },
    {
      id: 'floor',
      order: 5,
      labelRu: 'Передача на пол',
      href: workshop2ContextToProductionFloorHubHref({ collectionId: cid, articleLineId: seg }),
      status: floorStatus,
      hintRu: floorLinked
        ? `Цех: ${d?.floorBridgeMirror?.lastFloorTab ?? 'stages'}`
        : 'Синхронизируйте статус образца с полом.',
    },
  ];
}

/** Текущий активный шаг (первый не done). */
export function resolveWorkshop2Ss27RuJourneyActiveStep(
  steps: Workshop2RuJourneyStep[]
): Workshop2RuJourneyStepId | null {
  const active = steps.find((s) => s.status === 'active');
  if (active) return active.id;
  const pending = steps.find((s) => s.status === 'pending' || s.status === 'blocked');
  return pending?.id ?? null;
}

export function buildWorkshop2InspectorUrlForArticle(input: {
  collectionId: string;
  articleId: string;
  sampleOrderId?: string | null;
}): string | null {
  const orderId = input.sampleOrderId?.trim();
  if (!orderId) return null;
  return workshop2MobileInspectorHref({
    collectionId: input.collectionId,
    articleId: input.articleId,
    orderId,
  });
}

export type Workshop2RuContourStatusLines = {
  investorLineRu: string;
  journeyLineRu: string;
  blockersLineRu: string;
};

/** Wave 18: три строки карточки «Статус контура РФ» на хабе (pure — для UI и тестов). */
export function summarizeWorkshop2RuContourStatusLines(input: {
  readyForInvestorDemo?: boolean;
  stagingNoteRu?: string | null;
  journeySteps?: Workshop2RuJourneyStep[];
  gateBlockerCount?: number;
}): Workshop2RuContourStatusLines {
  const investorLineRu = input.readyForInvestorDemo
    ? 'Готовность инвестору: демо готово (readyForInvestorDemo).'
    : `Готовность инвестору: staging / частично — ${(input.stagingNoteRu ?? 'см. investor-readiness').slice(0, 72)}`;

  const steps = input.journeySteps ?? [];
  const activeId = resolveWorkshop2Ss27RuJourneyActiveStep(steps);
  const activeStep =
    steps.find((s) => s.id === activeId) ?? steps.find((s) => s.status === 'active');
  const journeyLineRu = activeStep
    ? `Шаг SS27: ${activeStep.order}. ${activeStep.labelRu} (${activeStep.status}).`
    : steps.length
      ? `Шаг SS27: ${steps[steps.length - 1]?.labelRu ?? '—'}`
      : 'Шаг SS27: выберите артикул коллекции для journey.';

  const blockers = input.gateBlockerCount ?? 0;
  const blockersLineRu =
    blockers > 0
      ? `Блокеры gates: ${blockers} на якорном артикуле — закройте в workspace.`
      : 'Блокеры gates: нет активных blockers на якорном артикуле.';

  return { investorLineRu, journeyLineRu, blockersLineRu };
}
