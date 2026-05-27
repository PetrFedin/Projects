import type { CollectionArticle } from '@/app/brand/production/production-page-types';
import { JOOR_DELIVERY_WINDOWS } from '@/lib/b2b/joor-constants';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import { ROUTES } from '@/lib/routes';

export type DisplayedArticlesSort = 'stage' | 'drop' | 'revenue';

export type DisplayedArticlesFilters = {
  articleSearch: string;
  articleFilterStage: string;
  articleFilterDrop: string;
  articleFocusNeedsAttention: boolean;
  articleSortBy: DisplayedArticlesSort;
};

/** Фильтрация и сортировка артикулов для таблицы на полу коллекции. */
/** Артикулы без Tech Pack или без PO — для бейджа «нужно внимание». */
export function countCollectionArticlesNeedingAttention(
  articles: readonly { techPackDone: boolean; poDone: boolean }[]
): number {
  return articles.filter((a) => !a.techPackDone || !a.poDone).length;
}

export function buildDisplayedCollectionArticles(
  collectionArticles: readonly CollectionArticle[],
  filters: DisplayedArticlesFilters
): CollectionArticle[] {
  let list = [...collectionArticles];
  const q = filters.articleSearch.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (a) =>
        a.sku.toLowerCase().includes(q) ||
        a.season.toLowerCase().includes(q) ||
        (a.categoryPathLabel?.toLowerCase().includes(q) ?? false) ||
        (a.fabricSuppliersLabel?.toLowerCase().includes(q) ?? false) ||
        (a.fabricStockNote?.toLowerCase().includes(q) ?? false)
    );
  }
  if (filters.articleFilterStage) {
    list = list.filter((a) => a.currentStageId === filters.articleFilterStage);
  }
  if (filters.articleFilterDrop) {
    list = list.filter((a) => a.deliveryWindowId === filters.articleFilterDrop);
  }
  if (filters.articleFocusNeedsAttention) {
    list = list.filter((a) => !a.techPackDone || !a.poDone);
  }
  const stageOrder = COLLECTION_STEPS.map((s) => s.id);
  const dropOrder = JOOR_DELIVERY_WINDOWS.map((w) => w.id);
  list.sort((a, b) => {
    if (filters.articleSortBy === 'stage') {
      return stageOrder.indexOf(a.currentStageId) - stageOrder.indexOf(b.currentStageId);
    }
    if (filters.articleSortBy === 'drop') {
      return (
        dropOrder.indexOf(a.deliveryWindowId || '') - dropOrder.indexOf(b.deliveryWindowId || '') ||
        a.sku.localeCompare(b.sku)
      );
    }
    return b.forecastRevenue - a.forecastRevenue;
  });
  return list;
}

export function downloadCollectionArticlesCsv(params: {
  displayedArticles: readonly CollectionArticle[];
  dropLabelById: Record<string, string>;
  collectionIdFromQuery: string;
}): void {
  if (typeof document === 'undefined') return;
  const headers = [
    'Артикул',
    'Сезон коллекции',
    'Производство (РФ)',
    'Дроп',
    'Этап',
    'Прогноз (шт)',
    'Прогноз (₽)',
    'Ткань (поставщики)',
    'Сток ткани бренда',
    'Tech Pack',
    'Сэмплы',
    'PO',
    'QC',
    'Готово',
  ];
  const rows = params.displayedArticles.map((a) => {
    const step = COLLECTION_STEPS.find((s) => s.id === a.currentStageId);
    const dropLabel = a.deliveryWindowId
      ? (params.dropLabelById[a.deliveryWindowId] ?? a.deliveryWindowId)
      : '';
    return [
      a.sku,
      a.season,
      a.productionSiteLabel,
      dropLabel,
      step?.title ?? a.currentStageId,
      a.forecastQty,
      a.forecastRevenue,
      a.fabricSuppliersLabel,
      a.fabricStockNote ?? '',
      a.techPackDone ? 'Да' : 'Нет',
      a.samplesDone ? 'Да' : 'Нет',
      a.poDone ? 'Да' : 'Нет',
      a.qcDone ? 'Да' : 'Нет',
      a.ready ? 'Да' : 'Нет',
    ];
  });
  const csv = [
    headers.join(';'),
    ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')),
  ].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `collection-articles-${params.collectionIdFromQuery || 'default'}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export type CollectionChecklistItem = {
  id: string;
  label: string;
  count: number;
  href?: string;
  done: boolean;
};

/** Чек-лист «Что сделать по коллекции» на основе статусов артикулов. */
export function buildCollectionChecklist(
  collectionArticles: readonly CollectionArticle[],
  collectionQuery: string,
  floorHref: (floorTab: ProductionFloorTabId) => string
): CollectionChecklistItem[] {
  const items: CollectionChecklistItem[] = [];
  const noTechPack = collectionArticles.filter((a) => !a.techPackDone).length;
  const noSamples = collectionArticles.filter((a) => !a.samplesDone).length;
  const noPo = collectionArticles.filter((a) => !a.poDone).length;
  const notReady = collectionArticles.filter((a) => !a.ready).length;
  if (collectionArticles.length === 0) {
    items.push({
      id: 'add',
      label: 'Добавить артикулы в коллекцию',
      count: 0,
      href: ROUTES.brand.products,
      done: false,
    });
  } else {
    if (noTechPack > 0) {
      items.push({
        id: 'tp',
        label: `Заполнить Tech Pack (${noTechPack} арт.)`,
        count: noTechPack,
        href: `${ROUTES.brand.productionTechPackStyle('new')}${collectionQuery}`,
        done: false,
      });
    } else
      items.push({ id: 'tp', label: 'Tech Pack по всем артикулам готов', count: 0, done: true });
    if (noSamples > 0)
      items.push({
        id: 'sm',
        label: `Сэмплы / Gold Sample (${noSamples} арт.)`,
        count: noSamples,
        href: floorHref('sample'),
        done: false,
      });
    else items.push({ id: 'sm', label: 'Сэмплы по всем артикулам готовы', count: 0, done: true });
    if (noPo > 0)
      items.push({
        id: 'po',
        label: `Выставить PO в производство (${noPo} арт.)`,
        count: noPo,
        href: floorHref('plan'),
        done: false,
      });
    else items.push({ id: 'po', label: 'PO по всем артикулам выставлены', count: 0, done: true });
    if (notReady > 0)
      items.push({
        id: 'ready',
        label: `Готовый товар на склад (${notReady} в процессе)`,
        count: notReady,
        href: floorHref('receipt'),
        done: false,
      });
    else items.push({ id: 'ready', label: 'Все артикулы приняты на склад', count: 0, done: true });
  }
  return items;
}
