'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Boxes,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Factory,
  FileSpreadsheet,
  FolderKanban,
  Image,
  Layers,
  Leaf,
  Package,
  PackageCheck,
  PlayCircle,
  Ruler,
  Settings2,
  Shirt,
  Ship,
  Truck,
  Users,
} from 'lucide-react';
import type { CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { MatrixStepStatus } from '@/lib/production/unified-sku-flow-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CollectionStepModuleDialog,
  type CollectionModuleSaveEvent,
} from '@/components/brand/production/CollectionStepModuleDialog';
import { CollectionAssortmentHubCard } from '@/components/brand/production/CollectionAssortmentHubCard';
import { CollectionBriefHubCard } from '@/components/brand/production/CollectionBriefHubCard';
import { CollectionStageModuleHubCard } from '@/components/brand/production/CollectionStageModuleHubCard';
import type { CollectionChainDeepLinkHrefs } from '@/lib/production/collection-chain-hrefs';

const STATUS_RU: Record<MatrixStepStatus, string> = {
  not_started: 'матрица: не начато',
  in_progress: 'матрица: в работе',
  done: 'матрица: готово',
};

type Props = {
  steps: readonly CollectionStep[];
  collectionFlowKey: string;
  collectionId: string;
  /** Подпись коллекции для карточки брифа */
  collectionLabel: string;
  /** PIM с контекстом коллекции (`/brand/products?collectionId=…`) */
  pimCollectionHref: string;
  /** Цех · коллекция с тем же `collectionId` */
  workshopCollectionHref: string;
  /** Бюджет · факт с тем же query */
  budgetActualHref: string;
  materialsHref: string;
  mediaHref: string;
  techPackHref: string;
  liveProcessHref: string;
  suppliesFloorHref: string;
  sampleFloorHref: string;
  workshopFloorTabHrefs: {
    live: string;
    stages: string;
    workshop: string;
    plan: string;
    ops: string;
    nesting: string;
    launch: string;
    quality: string;
    receipt: string;
  };
  b2bLinesheetsHref: string;
  factoriesHref: string;
  warehouseHref: string;
  b2bShipmentsHref: string;
  liveB2bHref: string;
  esgHref: string;
  chainDeepLinkHrefs: CollectionChainDeepLinkHrefs;
  articlesByStage: Record<string, number>;
  aggregateStatus: Record<string, MatrixStepStatus>;
  hrefWithCollection: (step: CollectionStep) => string | null;
  onAfterModuleSave?: (e: CollectionModuleSaveEvent) => void;
};

export function CollectionWorkshopStageChain({
  steps,
  collectionFlowKey,
  collectionId,
  collectionLabel,
  pimCollectionHref,
  workshopCollectionHref,
  budgetActualHref,
  materialsHref,
  mediaHref,
  techPackHref,
  liveProcessHref,
  suppliesFloorHref,
  sampleFloorHref,
  workshopFloorTabHrefs,
  b2bLinesheetsHref,
  factoriesHref,
  warehouseHref,
  b2bShipmentsHref,
  liveB2bHref,
  esgHref,
  chainDeepLinkHrefs,
  articlesByStage,
  aggregateStatus,
  hrefWithCollection,
  onAfterModuleSave,
}: Props) {
  const [openStep, setOpenStep] = useState<CollectionStep | null>(null);
  const briefStep = steps.find((s) => s.id === 'brief') ?? null;
  const assortmentStep = steps.find((s) => s.id === 'assortment-map') ?? null;
  const collectionHubStep = steps.find((s) => s.id === 'collection-hub') ?? null;
  const costingStep = steps.find((s) => s.id === 'costing') ?? null;
  const materialsStep = steps.find((s) => s.id === 'materials') ?? null;
  const photoRefStep = steps.find((s) => s.id === 'photo-ref') ?? null;
  const techPackStep = steps.find((s) => s.id === 'tech-pack') ?? null;
  const gateStep = steps.find((s) => s.id === 'gate-all-stakeholders') ?? null;
  const supplyPathStep = steps.find((s) => s.id === 'supply-path') ?? null;
  const samplesStep = steps.find((s) => s.id === 'samples') ?? null;
  const b2bLinesheetsStep = steps.find((s) => s.id === 'b2b-linesheets') ?? null;
  const productionWindowStep = steps.find((s) => s.id === 'production-window') ?? null;
  const poStep = steps.find((s) => s.id === 'po') ?? null;
  const floorOpsStep = steps.find((s) => s.id === 'floor-ops') ?? null;
  const suppliesBindStep = steps.find((s) => s.id === 'supplies-bind') ?? null;
  const nestingCutStep = steps.find((s) => s.id === 'nesting-cut') ?? null;
  const floorExecutionStep = steps.find((s) => s.id === 'floor-execution') ?? null;
  const qcStep = steps.find((s) => s.id === 'qc') ?? null;
  const readyMadeStep = steps.find((s) => s.id === 'ready-made') ?? null;
  const wholesalePrepStep = steps.find((s) => s.id === 'wholesale-prep') ?? null;
  const b2bShipStoresStep = steps.find((s) => s.id === 'b2b-ship-stores') ?? null;
  const sustainabilityStep = steps.find((s) => s.id === 'sustainability') ?? null;

  return (
    <>
      {briefStep ? (
        <div className="mb-4">
          <CollectionBriefHubCard
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixBriefStatus={aggregateStatus.brief}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(briefStep)}
            outlineLinks={[
              { href: chainDeepLinkHrefs.collections, label: 'Коллекции →' },
              { href: chainDeepLinkHrefs.collectionsNew, label: 'Новая коллекция →' },
              { href: workshopFloorTabHrefs.live, label: 'Онлайн-схема цеха →' },
              { href: workshopFloorTabHrefs.stages, label: 'Этапы (цех) →' },
            ]}
          />
        </div>
      ) : null}
      {assortmentStep ? (
        <div className="mb-4">
          <CollectionAssortmentHubCard
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            pimHref={pimCollectionHref}
            matrixAssortmentStatus={aggregateStatus['assortment-map']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(assortmentStep)}
            outlineLinks={[
              { href: workshopFloorTabHrefs.stages, label: 'Этапы (цех) →' },
              { href: chainDeepLinkHrefs.collections, label: 'Коллекции →' },
              { href: workshopCollectionHref, label: 'Хаб цеха →' },
              { href: budgetActualHref, label: 'Себестоимость →' },
            ]}
          />
        </div>
      ) : null}
      {collectionHubStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="collection-hub"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['collection-hub']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(collectionHubStep)}
            cardTitle="Коллекция в цеху (хаб артикулов)"
            Icon={FolderKanban}
            iconClassName="text-emerald-700"
            cardHint="Приоритеты контроля и план вывода артикулов — те же поля, что модуль этапа. Переход в экран цеха ниже."
            previewFieldKeys={['hubPriorities', 'skuRolloutPlan']}
            variant="emerald"
            saveLabel="Сохранить настройки хаба"
            moduleLink={{ href: workshopCollectionHref, label: 'Цех · коллекция →' }}
            moduleLinkExtra={[
              { href: workshopFloorTabHrefs.stages, label: 'Матрица этапов →' },
              { href: workshopFloorTabHrefs.live, label: 'Онлайн-схема →' },
              { href: pimCollectionHref, label: 'Каталог товаров (PIM) →' },
            ]}
          />
        </div>
      ) : null}
      {costingStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="costing"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus.costing}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(costingStep)}
            cardTitle="Себестоимость и маржа"
            Icon={CircleDollarSign}
            iconClassName="text-rose-700"
            cardHint="Политика полной себестоимости (landed cost), коридоры маржи, курсы и пошлины — демо-слой до связи с «Бюджет · факт»."
            previewFieldKeys={['landedCostPolicy', 'marginBands']}
            variant="rose"
            saveLabel="Сохранить параметры калькуляции"
            moduleLink={{ href: budgetActualHref, label: 'Бюджет · факт →' }}
            moduleLinkExtra={[
              { href: chainDeepLinkHrefs.pricing, label: 'Прайсинг →' },
              { href: materialsHref, label: 'Материалы →' },
              { href: chainDeepLinkHrefs.calendar, label: 'Календарь →' },
            ]}
          />
        </div>
      ) : null}
      {materialsStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="materials"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus.materials}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(materialsStep)}
            cardTitle="Материалы и поставщики"
            Icon={Package}
            iconClassName="text-accent-primary"
            cardHint="Стратегия сырья, шорт-лист, нормы расхода — тот же модуль, что этап «Подбор материалов…»."
            previewFieldKeys={['materialStrategy', 'supplierShortlist']}
            variant="violet"
            saveLabel="Сохранить материалы (коллекция)"
            moduleLink={{ href: materialsHref, label: 'Материалы · BOM →' }}
            moduleLinkExtra={[
              { href: chainDeepLinkHrefs.suppliers, label: 'Поставщики →' },
              { href: chainDeepLinkHrefs.suppliersRfq, label: 'Запрос котировок →' },
              { href: chainDeepLinkHrefs.materialsReservation, label: 'Бронь материалов →' },
              { href: workshopFloorTabHrefs.stages, label: 'Этапы →' },
            ]}
          />
        </div>
      ) : null}
      {photoRefStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="photo-ref"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['photo-ref']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(photoRefStep)}
            cardTitle="Референсы, скетчи, фото"
            Icon={Image}
            iconClassName="text-sky-700"
            cardHint="Визуальное направление, план съёмок, прототип — модуль этапа «Референсы модели…»."
            previewFieldKeys={['visualDirection', 'shootPlan']}
            variant="sky"
            saveLabel="Сохранить медиа-план коллекции"
            moduleLink={{ href: mediaHref, label: 'Медиа →' }}
            moduleLinkExtra={[
              { href: chainDeepLinkHrefs.contentHub, label: 'Контент-хаб →' },
              { href: techPackHref, label: 'Техпак →' },
              { href: chainDeepLinkHrefs.messages, label: 'Сообщения →' },
            ]}
          />
        </div>
      ) : null}
      {techPackStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="tech-pack"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['tech-pack']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(techPackStep)}
            cardTitle="Техпак / ТЗ"
            Icon={Ruler}
            iconClassName="text-accent-primary"
            cardHint="Объём ТЗ, версии, градация — демо; конструктор техпака по ссылке (плейсхолдер new + collectionId)."
            previewFieldKeys={['tzScope', 'revisionLog']}
            variant="indigo"
            saveLabel="Сохранить черновик ТЗ (коллекция)"
            moduleLink={{ href: techPackHref, label: 'Техпак →' }}
            moduleLinkExtra={[
              { href: mediaHref, label: 'Медиа →' },
              { href: sampleFloorHref, label: 'Эталон · примерка →' },
              { href: workshopCollectionHref, label: 'Хаб цеха →' },
              { href: chainDeepLinkHrefs.integrationsErpPlm, label: 'Интеграции PLM / ERP →' },
            ]}
          />
        </div>
      ) : null}
      {gateStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="gate-all-stakeholders"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['gate-all-stakeholders']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(gateStep)}
            cardTitle="Согласование сторон (ворота)"
            Icon={Users}
            iconClassName="text-amber-800"
            cardHint="Стороны, чек-лист, формальное go/hold — модуль этапа «Согласование всех сторон»."
            previewFieldKeys={['stakeholderList', 'checklistStatus']}
            variant="amber"
            saveLabel="Сохранить ворота согласования"
            moduleLink={{ href: liveProcessHref, label: 'Процесс онлайн →' }}
            moduleLinkExtra={[
              { href: workshopFloorTabHrefs.live, label: 'Онлайн-схема цеха →' },
              { href: workshopFloorTabHrefs.workshop, label: 'Хаб коллекции →' },
              { href: workshopFloorTabHrefs.stages, label: 'Матрица этапов →' },
              { href: chainDeepLinkHrefs.messages, label: 'Сообщения →' },
              { href: chainDeepLinkHrefs.tasks, label: 'Задачи →' },
              { href: chainDeepLinkHrefs.teamTasks, label: 'Команда · задачи →' },
            ]}
          />
        </div>
      ) : null}
      {supplyPathStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="supply-path"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['supply-path']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(supplyPathStep)}
            cardTitle="Поставка в цех (закупка / сток)"
            Icon={Truck}
            iconClassName="text-orange-800"
            cardHint="Решение по источнику, обязательства поставщика, приход в цех — модуль этапа «Поставщик · закупка…»."
            previewFieldKeys={['sourcingDecision', 'supplierCommitments']}
            variant="orange"
            saveLabel="Сохранить контур поставки"
            moduleLink={{ href: suppliesFloorHref, label: 'Снабжение цеха →' }}
            moduleLinkExtra={[
              { href: chainDeepLinkHrefs.vmi, label: 'Управление запасами у поставщика →' },
              { href: chainDeepLinkHrefs.warehouse, label: 'Склад бренда →' },
              { href: materialsHref, label: 'Закупка (материалы) →' },
              { href: chainDeepLinkHrefs.calendar, label: 'Календарь →' },
            ]}
          />
        </div>
      ) : null}
      {samplesStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="samples"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus.samples}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(samplesStep)}
            cardTitle="Семплы и примерки"
            Icon={Shirt}
            iconClassName="text-teal-800"
            cardHint="Раунд семпла, объём артикулов, примерка, эталонный образец — модуль этапа «Отшив семплов…»."
            previewFieldKeys={['sampleRound', 'sampleScope']}
            variant="teal"
            saveLabel="Сохранить план семплов"
            moduleLink={{ href: sampleFloorHref, label: 'Эталон · примерка →' }}
            moduleLinkExtra={[
              { href: chainDeepLinkHrefs.productionGoldSample, label: 'Эталонный образец →' },
              {
                href: chainDeepLinkHrefs.productionFitComments,
                label: 'Комментарии по примерке →',
              },
            ]}
          />
        </div>
      ) : null}
      {b2bLinesheetsStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="b2b-linesheets"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['b2b-linesheets']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(b2bLinesheetsStep)}
            cardTitle="B2B: лайншиты и лукбуки"
            Icon={FileSpreadsheet}
            iconClassName="text-accent-primary"
            cardHint="Охват презентаций для байеров, статус показов — модуль этапа «B2B: лукбуки и лайншиты»."
            previewFieldKeys={['linesheetCoverage', 'b2bPresentationNote']}
            variant="violet"
            saveLabel="Сохранить B2B-презентацию коллекции"
            moduleLink={{ href: b2bLinesheetsHref, label: 'Лайншиты →' }}
            moduleLinkExtra={{
              href: chainDeepLinkHrefs.b2bLinesheetsCreate,
<<<<<<< HEAD
              label: 'Создать linesheet →',
=======
              label: 'Создать лайншит →',
>>>>>>> recover/cabinet-wip-from-stash
            }}
          />
        </div>
      ) : null}
      {productionWindowStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="production-window"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['production-window']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(productionWindowStep)}
            cardTitle="Производство: площадка и сроки"
            Icon={Factory}
            iconClassName="text-sky-800"
            cardHint="Фабрика, календарь раскрой–пошив, риски мощности — модуль этапа «Производство: площадка и сроки процессов»."
            previewFieldKeys={['factoryAllocation', 'processCalendar']}
            variant="sky"
            saveLabel="Сохранить окно производства"
            moduleLink={{ href: factoriesHref, label: 'Фабрики →' }}
            moduleLinkExtra={{ href: workshopFloorTabHrefs.live, label: 'Онлайн-схема цеха →' }}
          />
        </div>
      ) : null}
      {poStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="po"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus.po}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(poStep)}
            cardTitle="PO и запуск серии"
            Icon={ClipboardList}
            iconClassName="text-accent-primary"
            cardHint="Список PO, объёмы, сроки от фабрики — модуль этапа «PO и запуск серии в производство»."
            previewFieldKeys={['poList', 'qtyAndSizes']}
            variant="indigo"
            saveLabel="Сохранить сводку PO"
            moduleLink={{ href: workshopFloorTabHrefs.plan, label: 'План · PO (цех) →' }}
            moduleLinkExtra={{
              href: chainDeepLinkHrefs.productionGantt,
              label: 'Диаграмма Ганта →',
            }}
          />
        </div>
      ) : null}
      {floorOpsStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="floor-ops"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['floor-ops']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(floorOpsStep)}
            cardTitle="Операции: BOM и аудит PO"
            Icon={Settings2}
            iconClassName="text-rose-800"
            cardHint="BOM, аудит PO на полу, коммуникации с фабрикой — модуль этапа «Операции: BOM, сводка PO, аудит»."
            previewFieldKeys={['bomSync', 'poOpsAudit']}
            variant="rose"
            saveLabel="Сохранить операционный контур"
            moduleLink={{ href: workshopFloorTabHrefs.ops, label: 'Операции цеха →' }}
            moduleLinkExtra={{
              href: chainDeepLinkHrefs.productionOperations,
              label: 'Операции (страница) →',
            }}
          />
        </div>
      ) : null}
      {suppliesBindStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="supplies-bind"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['supplies-bind']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(suppliesBindStep)}
            cardTitle="Снабжение: брони и готовность к раскрою"
            Icon={Package}
            iconClassName="text-orange-800"
            cardHint="Резервы у поставщика (VMI), готовность к раскрою, покрытие стоком — модуль «Снабжение цеха (VMI · бронирование)»."
            previewFieldKeys={['reservationIds', 'cutReadiness']}
            variant="orange"
            saveLabel="Сохранить привязку снабжения"
            moduleLink={{ href: suppliesFloorHref, label: 'Снабжение цеха →' }}
            moduleLinkExtra={{
              href: chainDeepLinkHrefs.vmi,
              label: 'Управление запасами у поставщика →',
            }}
          />
        </div>
      ) : null}
      {nestingCutStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="nesting-cut"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['nesting-cut']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(nestingCutStep)}
            cardTitle="Нестинг ИИ · раскрой"
            Icon={Layers}
            iconClassName="text-teal-800"
            cardHint="Задание нестинга, выход ткани, маркеры — модуль этапа «Нестинг ИИ · раскрой»."
            previewFieldKeys={['nestingJobRef', 'yieldFabric']}
            variant="teal"
            saveLabel="Сохранить параметры раскроя"
<<<<<<< HEAD
            moduleLink={{ href: workshopFloorTabHrefs.nesting, label: 'Nesting (цех) →' }}
            moduleLinkExtra={{
              href: chainDeepLinkHrefs.productionNesting,
              label: 'Nesting (полная) →',
=======
            moduleLink={{ href: workshopFloorTabHrefs.nesting, label: 'Нестинг (цех) →' }}
            moduleLinkExtra={{
              href: chainDeepLinkHrefs.productionNesting,
              label: 'Нестинг (полная страница) →',
>>>>>>> recover/cabinet-wip-from-stash
            }}
          />
        </div>
      ) : null}
      {floorExecutionStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="floor-execution"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['floor-execution']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(floorExecutionStep)}
            cardTitle="Выпуск в цеху (смены · субподряд)"
            Icon={PlayCircle}
            iconClassName="text-emerald-800"
            cardHint="План смен, субподряд, видео-контрольные точки — модуль «Выпуск в цеху»."
            previewFieldKeys={['shiftPlan', 'subcontractTrack']}
            variant="emerald"
            saveLabel="Сохранить план выпуска"
            moduleLink={{ href: workshopFloorTabHrefs.launch, label: 'Выпуск (цех) →' }}
            moduleLinkExtra={{ href: workshopFloorTabHrefs.live, label: 'Онлайн-схема цеха →' }}
          />
        </div>
      ) : null}
      {qcStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="qc"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus.qc}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(qcStep)}
            cardTitle="ОТК: инспекции и приёмка"
            Icon={ClipboardCheck}
            iconClassName="text-amber-800"
            cardHint="Партии на инспекции, дефекты, решение о выпуске — модуль «ОТК: инспекции и приёмка партий»."
            previewFieldKeys={['inspectionBatches', 'defectLog']}
            variant="amber"
            saveLabel="Сохранить журнал ОТК"
            moduleLink={{ href: workshopFloorTabHrefs.quality, label: 'ОТК (цех) →' }}
            moduleLinkExtra={{
              href: chainDeepLinkHrefs.productionQcApp,
              label: 'Приложение ОТК →',
            }}
          />
        </div>
      ) : null}
      {readyMadeStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="ready-made"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['ready-made']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(readyMadeStep)}
            cardTitle="Готовый товар и склад"
            Icon={PackageCheck}
            iconClassName="text-accent-primary"
            cardHint="Приёмка vs PO, размещение на складе, качество при входе — модуль «Готовый товар и склад бренда»."
            previewFieldKeys={['receiptVsPo', 'warehousePlacement']}
            variant="violet"
            saveLabel="Сохранить приёмку на склад"
            moduleLink={{ href: workshopFloorTabHrefs.receipt, label: 'Приёмка (цех) →' }}
            moduleLinkExtra={{
              href: chainDeepLinkHrefs.productionReadyMade,
              label: 'Готовый товар →',
            }}
          />
        </div>
      ) : null}
      {wholesalePrepStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="wholesale-prep"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['wholesale-prep']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(wholesalePrepStep)}
            cardTitle="Комплектация под B2B"
            Icon={Boxes}
            iconClassName="text-sky-800"
            cardHint="Маркировка, упаковка, привязка к заказам B2B — модуль «Комплектация под B2B»."
            previewFieldKeys={['labelingPackaging', 'b2bOrderMapping']}
            variant="sky"
            saveLabel="Сохранить план комплектации"
            moduleLink={{ href: warehouseHref, label: 'Склад бренда →' }}
            moduleLinkExtra={[
              { href: chainDeepLinkHrefs.logistics, label: 'Логистика →' },
              { href: chainDeepLinkHrefs.b2bOrders, label: 'Заказы B2B →' },
            ]}
          />
        </div>
      ) : null}
      {b2bShipStoresStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="b2b-ship-stores"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus['b2b-ship-stores']}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(b2bShipStoresStep)}
            cardTitle="Отгрузка в магазины клиентов"
            Icon={Ship}
            iconClassName="text-accent-primary"
            cardHint="ASN, маршруты в торговые точки, подтверждения доставки — модуль «Отгрузка в магазины клиентов»."
            previewFieldKeys={['asnRefs', 'retailRoutes']}
            variant="indigo"
            saveLabel="Сохранить план отгрузок"
            moduleLink={{ href: b2bShipmentsHref, label: 'Отгрузки B2B →' }}
            moduleLinkExtra={[
              { href: liveB2bHref, label: 'B2B онлайн →' },
              { href: chainDeepLinkHrefs.liveLogistics, label: 'Логистика онлайн →' },
            ]}
          />
        </div>
      ) : null}
      {sustainabilityStep ? (
        <div className="mb-4">
          <CollectionStageModuleHubCard
            stepId="sustainability"
            collectionFlowKey={collectionFlowKey}
            collectionLabel={collectionLabel}
            matrixStatus={aggregateStatus.sustainability}
            onAfterModuleSave={onAfterModuleSave}
            onOpenFullDialog={() => setOpenStep(sustainabilityStep)}
            cardTitle="ESG и устойчивость"
            Icon={Leaf}
            iconClassName="text-emerald-800"
            cardHint="Сертификаты, паспорт изделия, циркулярность — модуль «ESG и устойчивость»."
            previewFieldKeys={['certificates', 'productPassport']}
            variant="emerald"
            saveLabel="Сохранить ESG-профиль коллекции"
            moduleLink={{ href: esgHref, label: 'ESG →' }}
            moduleLinkExtra={[
              { href: materialsHref, label: 'Материалы →' },
              { href: chainDeepLinkHrefs.compliance, label: 'Комплаенс →' },
              { href: chainDeepLinkHrefs.circularHub, label: 'Циркулярность →' },
            ]}
          />
        </div>
      ) : null}
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-stretch gap-1">
          {steps.map((step, idx, arr) => {
            const count = articlesByStage[step.id] ?? 0;
            const href = hrefWithCollection(step);
            const st = aggregateStatus[step.id];
            return (
              <div key={step.id} className="flex items-center">
                <div className="border-accent-primary/30 hover:border-accent-primary/40 flex w-[152px] shrink-0 flex-col rounded-lg border bg-white p-2 shadow-sm transition-all hover:shadow-md">
                  <p className="text-text-muted text-[9px] font-black">Этап {idx + 1}</p>
                  <button
                    type="button"
                    title="Открыть модуль этапа: поля, вложения, история"
                    onClick={() => setOpenStep(step)}
                    className="text-accent-primary mt-0.5 text-left text-[10px] font-bold leading-tight underline-offset-2 hover:underline"
                  >
                    {step.title}
                  </button>
                  <p className="text-text-secondary mt-1 text-[9px]">
                    артикулов: <strong>{count}</strong>
                  </p>
                  {st ? (
                    <Badge
                      variant="outline"
<<<<<<< HEAD
                      className="mt-1 h-5 w-fit border-slate-200 text-[7px] font-bold uppercase leading-none"
=======
                      className="border-border-default mt-1 h-5 w-fit text-[7px] font-bold uppercase leading-none"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      {STATUS_RU[st]}
                    </Badge>
                  ) : null}
                  {href ? (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="mt-1.5 h-6 w-full px-1 text-[8px]"
                      title={step.description}
                    >
                      <Link href={href}>
                        В модуль <ArrowRight className="ml-0.5 inline h-2.5 w-2.5" />
                      </Link>
                    </Button>
                  ) : null}
                </div>
                {idx < arr.length - 1 ? (
                  <div className="text-text-muted flex shrink-0 items-center px-0.5">
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
<<<<<<< HEAD
      <p className="text-[10px] text-slate-500">
=======
      <p className="text-text-secondary text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
        Карточки сверху — те же модули, что и этапы в ленте (полный контур до ESG). В ленте —
        вложения и журнал; ссылки — в цех, фабрики, склад, B2B, ESG и т.д.
      </p>

      <CollectionStepModuleDialog
        open={openStep !== null}
        onOpenChange={(o) => !o && setOpenStep(null)}
        step={openStep}
        collectionFlowKey={collectionFlowKey}
        collectionId={collectionId}
        matrixStatus={openStep ? aggregateStatus[openStep.id] : undefined}
        onAfterModuleSave={onAfterModuleSave}
      />
    </>
  );
}
