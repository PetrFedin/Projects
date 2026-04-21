/**
 * Ядро №1 (ТЗ → отшив): единая матрица «id этапа COLLECTION_STEPS → вкладка карточки артикула в разработке коллекции»
 * и проверки handoff в серию (этап `production-window` в каталоге).
 *
 * Источник этапов — только `collection-steps-catalog.ts`. Не дублировать порядок этапов здесь.
 */

import {
  COLLECTION_STEPS,
  getTransitiveDependsOnStepIds,
} from '@/lib/production/collection-steps-catalog';
import type { Workshop2ArticleMainTab } from '@/lib/production/workshop2-collection-metrics';
import {
  W2_ARTICLE_SECTION_DOM,
  workshop2ArticleHref,
} from '@/lib/production/workshop2-url';
import {
  isSkuStepDone,
  type CollectionSkuFlowDoc,
} from '@/lib/production/unified-sku-flow-store';

/** Этап каталога «площадка и сроки серии» — граница handoff из разработки/семплов в серийное производство. */
export const PRODUCTION_WINDOW_CATALOG_STEP_ID = 'production-window' as const;

export type Workshop2CatalogStepRoutingRow = {
  stepId: string;
  /** Основная вкладка `w2pane` в карточке артикула (разработка коллекции); `null` — этап вне карточки (коллекция, B2B, внешний модуль). */
  primaryArticlePane: Workshop2ArticleMainTab | null;
  /** Если этап пересекается с несколькими вкладками (например `samples` → fit + supply). */
  secondaryArticlePanes?: readonly Workshop2ArticleMainTab[];
  /** Для онбординга и согласования с командой. */
  teamNote?: string;
};

/**
 * Полная матрица: ровно по одному ряду на каждый этап `COLLECTION_STEPS`.
 * При добавлении этапа в каталог — дополнить этот массив (см. assert ниже).
 */
export const WORKSHOP2_CATALOG_STEP_ROUTING: readonly Workshop2CatalogStepRoutingRow[] = [
  {
    stepId: 'brief',
    primaryArticlePane: null,
    teamNote: 'Коллекция и цели — хаб коллекции, не карточка SKU.',
  },
  {
    stepId: 'assortment-map',
    primaryArticlePane: null,
    teamNote: 'Карта SKU — PIM / продукты, контекст коллекции.',
  },
  {
    stepId: 'collection-hub',
    primaryArticlePane: null,
    teamNote: 'Хаб артикулов в цеху — список, не вкладка карточки.',
  },
  {
    stepId: 'costing',
    primaryArticlePane: null,
    teamNote: 'Себестоимость — модуль бюджета; не карточка артикула в разработке коллекции.',
  },
  {
    stepId: 'materials',
    primaryArticlePane: null,
    teamNote: 'Материалы и BOM — внешний контур до фиксации в ТЗ.',
  },
  {
    stepId: 'photo-ref',
    primaryArticlePane: null,
    teamNote: 'Медиа и рефы — контент-хаб.',
  },
  {
    stepId: 'tech-pack',
    primaryArticlePane: 'tz',
    teamNote: 'Tech Pack и досье — вкладка «ТЗ».',
  },
  {
    stepId: 'gate-all-stakeholders',
    primaryArticlePane: 'overview',
    teamNote: 'Согласование сторон — паспорт на обзоре; детали в ТЗ.',
  },
  {
    stepId: 'supply-path',
    primaryArticlePane: 'supply',
    teamNote: 'Поставка в цех — «Снабжение».',
  },
  {
    stepId: 'samples',
    primaryArticlePane: 'fit',
    secondaryArticlePanes: ['supply', 'overview'],
    teamNote: 'Отшив образца — fit/эталон; пересечение со снабжением и обзором.',
  },
  {
    stepId: 'b2b-linesheets',
    primaryArticlePane: null,
    teamNote: 'B2B материалы — вне контура карточки разработки.',
  },
  {
    stepId: 'production-window',
    primaryArticlePane: 'plan',
    teamNote: 'Площадка и сроки серии — план/PO в карточке (мост на пол цеха).',
  },
  {
    stepId: 'po',
    primaryArticlePane: 'plan',
    teamNote: 'PO — вкладка плана в карточке.',
  },
  {
    stepId: 'floor-ops',
    primaryArticlePane: 'plan',
    teamNote: 'Операции и сводка — рядом с планом/PO.',
  },
  {
    stepId: 'supplies-bind',
    primaryArticlePane: 'supply',
    teamNote: 'Снабжение под PO — «Снабжение».',
  },
  {
    stepId: 'nesting-cut',
    primaryArticlePane: 'plan',
    teamNote: 'Nesting — секция плана (раскрой).',
  },
  {
    stepId: 'floor-execution',
    primaryArticlePane: 'release',
    teamNote: 'Выпуск в цеху — вкладка «Выпуск».',
  },
  {
    stepId: 'qc',
    primaryArticlePane: 'qc',
    teamNote: 'ОТК — вкладка QC.',
  },
  {
    stepId: 'ready-made',
    primaryArticlePane: 'stock',
    teamNote: 'Готовый товар — склад/остатки в карточке.',
  },
  {
    stepId: 'wholesale-prep',
    primaryArticlePane: 'stock',
    teamNote: 'Комплектация под B2B — склад в карточке; детали — склад бренда.',
  },
  {
    stepId: 'b2b-ship-stores',
    primaryArticlePane: null,
    teamNote: 'Отгрузка в магазины — логистика / B2B.',
  },
  {
    stepId: 'sustainability',
    primaryArticlePane: null,
    teamNote: 'ESG — отдельный модуль; привязка к материалам/PO в каталоге.',
  },
];

(function assertWorkshop2RoutingMatchesCatalog() {
  const catalogIds = new Set(COLLECTION_STEPS.map((s) => s.id));
  const routingIds = new Set(WORKSHOP2_CATALOG_STEP_ROUTING.map((r) => r.stepId));
  if (catalogIds.size !== routingIds.size) {
    throw new Error(
      `workshop2-core1: routing count ${routingIds.size} !== COLLECTION_STEPS ${catalogIds.size}`
    );
  }
  for (const id of catalogIds) {
    if (!routingIds.has(id)) {
      throw new Error(`workshop2-core1: add WORKSHOP2_CATALOG_STEP_ROUTING row for catalog step "${id}"`);
    }
  }
  for (const id of routingIds) {
    if (!catalogIds.has(id)) {
      throw new Error(`workshop2-core1: unknown stepId in routing: "${id}"`);
    }
  }
})();

const ROUTING_BY_STEP_ID = new Map(
  WORKSHOP2_CATALOG_STEP_ROUTING.map((r) => [r.stepId, r] as const)
);

const PANE_SCROLL_HASH: Partial<Record<Workshop2ArticleMainTab, string>> = {
  supply: W2_ARTICLE_SECTION_DOM.supply,
  fit: W2_ARTICLE_SECTION_DOM.fit,
  plan: W2_ARTICLE_SECTION_DOM.planPo,
  release: W2_ARTICLE_SECTION_DOM.release,
  qc: W2_ARTICLE_SECTION_DOM.qc,
  stock: W2_ARTICLE_SECTION_DOM.stock,
};

export function getWorkshop2CatalogStepRoutingRow(
  stepId: string
): Workshop2CatalogStepRoutingRow | undefined {
  return ROUTING_BY_STEP_ID.get(stepId);
}

/** Основная вкладка карточки артикула (разработка коллекции) для этапа каталога, если этап работает в карточке артикула. */
export function getWorkshop2PrimaryPaneForCatalogStep(
  stepId: string
): Workshop2ArticleMainTab | null {
  return ROUTING_BY_STEP_ID.get(stepId)?.primaryArticlePane ?? null;
}

/**
 * Deep link в карточку артикула с `w2pane` и hash секции (если есть).
 * Возвращает `null`, если этап не маппится на карточку (см. `primaryArticlePane: null`).
 */
export function workshop2ArticleHrefForCatalogStep(
  collectionId: string,
  articleSegment: string,
  catalogStepId: string
): string | null {
  const pane = getWorkshop2PrimaryPaneForCatalogStep(catalogStepId);
  if (!pane) return null;
  const hash = PANE_SCROLL_HASH[pane];
  return workshop2ArticleHref(collectionId, articleSegment, {
    w2pane: pane,
    ...(hash ? { hash } : {}),
  });
}

/** Id этапов, которые по графу `dependsOn` должны быть закрыты до `production-window`. */
export function getSeriesHandoffPrerequisiteStepIds(): readonly string[] {
  return getTransitiveDependsOnStepIds(PRODUCTION_WINDOW_CATALOG_STEP_ID);
}

/** Этапы-предпосылки серии, по которым у артикула ещё нет done/skipped в unified flow. */
export function getSeriesHandoffMissingSteps(
  doc: CollectionSkuFlowDoc,
  skuId: string
): string[] {
  return getSeriesHandoffPrerequisiteStepIds().filter(
    (id) => !isSkuStepDone(doc, skuId, id)
  );
}

export function isSeriesHandoffReadyForSku(
  doc: CollectionSkuFlowDoc,
  skuId: string
): boolean {
  return getSeriesHandoffMissingSteps(doc, skuId).length === 0;
}
