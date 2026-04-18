'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProductionFloorTabWithHint } from '@/components/brand/production/ProductionFloorTabWithHint';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getProductionLinks } from '@/lib/data/entity-links';
import { ROUTES, processLiveUrl } from '@/lib/routes';
import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import type { CollectionChainDeepLinkHrefs } from '@/lib/production/collection-chain-hrefs';
import { STAGES_SKU_PARAM, STAGES_STEP_PARAM } from '@/lib/production/stages-url';
import { getSkuDataGatedCurrentStepId } from '@/lib/production/stage-data-fill-spec';
import { getProductionDataPort } from '@/lib/production-data';
import {
  buildAggregateStatusMap,
  ensureSkuStages,
  isSkuStepDone,
  patchSkuStage,
  removeSkuFromUnifiedDoc,
  type CollectionSkuFlowDoc,
} from '@/lib/production/unified-sku-flow-store';
import {
  StagesContextFilterPulseIcon,
  StagesDependenciesTabContent,
  stagesTabHasActiveFilters,
  type StagesLocalInventoryToolsInput,
} from '@/components/brand/production/StagesDependenciesTabContent';
import { ProductionFloorContextBar } from '@/components/brand/production/ProductionFloorContextBar';
import { CollectionWorkshopStageChain } from '@/components/brand/production/CollectionWorkshopStageChain';
import type { CollectionModuleSaveEvent } from '@/components/brand/production/CollectionStepModuleDialog';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { RegistryPageShell } from '@/components/design-system';
import {
  CheckCircle2,
  CircleDot,
  Factory,
  ArrowRight,
  PlusCircle,
  BarChart3,
  Play,
  FileText,
  Package,
  ClipboardCheck,
  Truck,
  Search,
  Download,
  AlertCircle,
  ListTodo,
  ShoppingBag,
  ShieldCheck,
  Camera,
  Ruler,
  ListTree,
  Activity,
} from 'lucide-react';

const LiveProcessPageBody = dynamic(
  () => import('@/components/live-process/LiveProcessPageBody').then((m) => m.LiveProcessPageBody),
  {
    ssr: false,
    loading: () => <div className="text-text-muted p-8 text-center text-sm">Загрузка LIVE…</div>,
  }
);

const GoldSampleContent = dynamic(() => import('@/app/brand/production/gold-sample/page'), {
  ssr: false,
});
const QcAppContent = dynamic(() => import('@/app/brand/production/qc-app/page'), { ssr: false });
const ReadyMadeContent = dynamic(
  () => import('@/app/brand/production/ready-made/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const FitCommentsContent = dynamic(
  () => import('@/app/brand/production/fit-comments/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const GanttContent = dynamic(
  () => import('@/app/brand/production/gantt/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const DailyOutputContent = dynamic(
  () => import('@/app/brand/production/daily-output/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const WorkerSkillsContent = dynamic(
  () => import('@/app/brand/production/worker-skills/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const MilestonesVideoContent = dynamic(
  () => import('@/app/brand/production/milestones-video/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const SubcontractorContent = dynamic(
  () => import('@/app/brand/production/subcontractor/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const VmiContent = dynamic(() => import('@/app/brand/vmi/page').then((m) => m.default), {
  ssr: false,
  loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div>,
});
const MaterialReservationContent = dynamic(
  () => import('@/app/brand/materials/reservation/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const ProductionLiveContent = dynamic(
  () => import('@/app/brand/production/operations/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const QualityLiveContent = dynamic(
  () =>
    import('@/components/brand/quality/BrandQualityDeskBody').then((m) => m.BrandQualityDeskBody),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const NestingContent = dynamic(
  () => import('@/app/brand/production/nesting/nesting-page-body').then((m) => m.NestingPageBody),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
import { JOOR_DELIVERY_WINDOWS } from '@/lib/b2b/joor-constants';
import products from '@/lib/products';
import { initialOrderItems } from '@/lib/order-data';
import type { QcInspection } from '@/lib/production/qc-app';
import type { MilestoneWithVideo } from '@/lib/production/milestones-video';
import type { SubcontractOrder } from '@/lib/production/subcontractor';
import {
  isProductionFloorTab,
  productionFloorTabRequiresArticle,
  PRODUCTION_FLOOR_STEPS,
  type ProductionFloorTabId,
} from '@/lib/production/floor-flow';
import {
  deriveStagesArticleFacets,
  stagesArticleDisplayLabel,
} from '@/lib/production/stages-tab-facets';
import {
  buildInvestorDemoFlowDoc,
  investorDemoFlowIsPristine,
  INVESTOR_DEMO_ARTICLE_IDS,
} from '@/lib/production/investor-demo-flow-seed';
import {
  buildLocalDraftArticle,
  exportInventoryJson,
  loadLocalCollectionInventory,
  mergeImportInventories,
  normalizeLocalSkuCode,
  parseInventoryImportJson,
  registerUserCollection,
  removeArticleFromInventory,
  removeUserCollectionFromInventory,
  saveLocalCollectionInventory,
  storageKeyForCollectionId,
  type LocalCollectionInventory,
} from '@/lib/production/local-collection-inventory';

function getProductionFloorTabTitle(tab: ProductionFloorTabId): string {
  return PRODUCTION_FLOOR_STEPS.find((s) => s.id === tab)?.label ?? tab;
}

/** Подмешать collectionId к любому href */
function mergeCollectionQuery(href: string, collectionQuery: string): string {
  if (!href || !collectionQuery) return href;
  const q = collectionQuery.startsWith('?') ? collectionQuery.slice(1) : collectionQuery;
  return href.includes('?') ? `${href}&${q}` : `${href}?${q}`;
}

/** Мок-номер заказа для связки артикул ↔ B2B/PO в чатах и календаре (до API). */
function derivePrimaryOrderRef(season: string, idx: number): string {
  const s = (season || 'COL').replace(/\s+/g, '').slice(0, 12);
  return `PO-${s}-${String(idx + 1).padStart(4, '0')}`;
}

/** Артикул в коллекции с детальным статусом по этапам для оперативного создания и запуска в производство */
export interface CollectionArticle {
  id: string;
  sku: string;
  name: string;
  /** Текущий этап (id из COLLECTION_STEPS) */
  currentStageId: string;
  /** Прогноз: количество для производства */
  forecastQty: number;
  /** Прогноз: выручка (опт) */
  forecastRevenue: number;
  /** Дроп / окно поставки */
  deliveryWindowId?: string;
  techPackDone: boolean;
  samplesDone: boolean;
  poDone: boolean;
  qcDone: boolean;
  ready: boolean;
  /** Фасеты для фильтров на вкладке «Этапы» (справочник CATEGORY_HANDBOOK) */
  audienceId: string;
  audienceLabel: string;
  categoryLeafId: string;
  season: string;
  categoryL1: string;
  categoryL2: string;
  categoryL3: string;
  /** Аудитория › L1 › L2 › L3 по CATEGORY_HANDBOOK */
  categoryPathLabel: string;
  productionSiteId: string;
  productionSiteLabel: string;
  fabricSuppliersLabel: string;
  fabricStockNote?: string;
  /** Заказ (PO), в контексте которого ведётся артикул */
  primaryOrderRef?: string;
}

/** Мок: список коллекций для провала — все, по которым велась или ведётся работа */
const MOCK_COLLECTIONS: {
  id: string;
  name: string;
  status: 'draft' | 'in_progress' | 'done';
  articleCount: number;
  progressPct: number;
}[] = [
  { id: '', name: 'По умолчанию', status: 'in_progress', articleCount: 3, progressPct: 45 },
  {
    id: 'Investor',
    name: 'Демо для инвесторов',
    status: 'in_progress',
    articleCount: 3,
    progressPct: 52,
  },
  { id: 'New', name: 'Новая (черновик)', status: 'draft', articleCount: 0, progressPct: 0 },
  {
    id: 'FW26-Main',
    name: 'FW26 Основная',
    status: 'in_progress',
    articleCount: 12,
    progressPct: 70,
  },
  { id: 'SS27', name: 'SS27', status: 'in_progress', articleCount: 3, progressPct: 48 },
  { id: 'SS26', name: 'SS26', status: 'draft', articleCount: 5, progressPct: 20 },
  {
    id: 'FW25-Archive',
    name: 'FW25 (завершена)',
    status: 'done',
    articleCount: 24,
    progressPct: 100,
  },
];

export default function BrandProductionCollectionFlowPage() {
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const collectionIdFromQuery = searchParams.get('collectionId') || '';
  const effectiveCollectionId = collectionIdFromQuery || 'default';
  /** Демо-коллекция Investor делит с «по умолчанию» один flow в localStorage (те же три SKU). */
  const collectionFlowKey =
    !collectionIdFromQuery || collectionIdFromQuery === 'Investor'
      ? 'default'
      : collectionIdFromQuery;

  const [unifiedDoc, setUnifiedDoc] = useState<CollectionSkuFlowDoc>(() => ({ v: 1, skus: {} }));
  /** Один раз на collectionFlowKey: подставить демо-статусы для трёх инвесторских SKU, если пайплайн ещё «чистый». */
  const investorDemoEvaluatedRef = useRef<string | null>(null);

  useEffect(() => {
    investorDemoEvaluatedRef.current = null;
    let cancelled = false;
    void getProductionDataPort()
      .getSkuFlow(collectionFlowKey)
      .then((doc) => {
        if (!cancelled) setUnifiedDoc(doc);
      });
    return () => {
      cancelled = true;
    };
  }, [collectionFlowKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    void getProductionDataPort().saveSkuFlow(collectionFlowKey, unifiedDoc);
  }, [collectionFlowKey, unifiedDoc]);

  /** Поиск и фильтры по артикулам */
  const [articleSearch, setArticleSearch] = useState('');
  const [articleFilterStage, setArticleFilterStage] = useState<string>('');
  const [articleFilterDrop, setArticleFilterDrop] = useState<string>('');
  /** Режим «Требуют внимания»: только артикулы без Tech Pack или без PO */
  const [articleFocusNeedsAttention, setArticleFocusNeedsAttention] = useState(false);
  /** Сортировка: stage | drop | revenue */
  const [articleSortBy, setArticleSortBy] = useState<'stage' | 'drop' | 'revenue'>('stage');

  const floorTabFromSearch = searchParams.get('floorTab');
  const [tab, setTabState] = useState<ProductionFloorTabId>(
    isProductionFloorTab(floorTabFromSearch) ? floorTabFromSearch : 'workshop'
  );
  const [suppliesSub, setSuppliesSub] = useState<'vmi' | 'reservation'>('vmi');
  const [sampleSub, setSampleSub] = useState<'gold' | 'fit'>('gold');
  const [launchSub, setLaunchSub] = useState<'daily' | 'skills' | 'video' | 'sub'>('daily');
  const [qualitySub, setQualitySub] = useState<'mobile' | 'desk'>('mobile');

  useEffect(() => {
    const v = searchParams.get('floorTab');
    if (isProductionFloorTab(v)) setTabState(v);
    else setTabState('workshop');
  }, [searchParams]);

  /** Старые ссылки ?floorTab=workshop2 → отдельный маршрут Цех 2. */
  useEffect(() => {
    if (searchParams.get('floorTab') !== 'workshop2') return;
    const p = new URLSearchParams(searchParams.toString());
    p.delete('floorTab');
    const q = p.toString();
    router.replace(
      q ? `${ROUTES.brand.productionWorkshop2}?${q}` : ROUTES.brand.productionWorkshop2,
      { scroll: false }
    );
  }, [router, searchParams]);

  const handleLiveContextCollectionChange = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id && id !== 'default') params.set('collectionId', id);
      else params.delete('collectionId');
      params.delete(STAGES_SKU_PARAM);
      params.set('floorTab', 'live');
      const q = params.toString();
      router.replace(`${pathname}${q ? `?${q}` : ''}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const floorHref = useCallback(
    (floorTab: ProductionFloorTabId) => {
      const params = new URLSearchParams(searchParams.toString());
      if (floorTab === 'workshop') params.delete('floorTab');
      else params.set('floorTab', floorTab);
      const q = params.toString();
      return `${pathname}${q ? `?${q}` : ''}`;
    },
    [pathname, searchParams]
  );

  const collectionOptions = useMemo(() => {
    const seasons = new Set<string>();
    (products as any[]).forEach((p) => {
      if (p.season && typeof p.season === 'string' && p.season.trim()) {
        seasons.add(p.season.trim());
      }
    });
    return Array.from(seasons).sort();
  }, []);

  const [localInventory, setLocalInventory] = useState<LocalCollectionInventory>(() => ({
    v: 1,
    articlesByCollection: {},
    userCollections: [],
    archivedUserCollections: [],
  }));

  useEffect(() => {
    setLocalInventory(loadLocalCollectionInventory());
  }, []);

  useEffect(() => {
    saveLocalCollectionInventory(localInventory);
  }, [localInventory]);

  const collectionSelectOptions = useMemo(() => {
    const s = new Set(collectionOptions);
    localInventory.userCollections.forEach((c) => s.add(c.id));
    return Array.from(s).sort();
  }, [collectionOptions, localInventory.userCollections]);

  const workshopCollectionsDisplay = useMemo(() => {
    const existing = new Set(MOCK_COLLECTIONS.map((m) => m.id));
    const extra = localInventory.userCollections
      .filter((u) => !existing.has(u.id))
      .map((c) => ({
        id: c.id,
        name: `${c.name} · локально`,
        status: 'draft' as const,
        articleCount: localInventory.articlesByCollection[c.id]?.length ?? 0,
        progressPct: 0,
      }));
    return [...extra, ...MOCK_COLLECTIONS];
  }, [localInventory]);

  const pendingFocusLocalSkuRef = useRef<string | null>(null);

  const pushUserCollection = useCallback(
    (rawId: string, displayName: string) => {
      const idRef = { current: '' };
      setLocalInventory((prev) => {
        const { inventory, id } = registerUserCollection(prev, rawId, displayName);
        idRef.current = id;
        return inventory;
      });
      queueMicrotask(() => {
        router.push(`/brand/production?collectionId=${encodeURIComponent(idRef.current)}`);
      });
    },
    [router]
  );

  const handleCollectionChange = (value: string) => {
    if (value === '__new__') {
      router.push('/brand/production?collectionId=New');
      return;
    }
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      params.set('collectionId', value);
    } else {
      params.delete('collectionId');
    }
    params.delete(STAGES_SKU_PARAM);
    const query = params.toString();
    router.push(`/brand/production${query ? `?${query}` : ''}`);
  };

  const collectionLabel = useMemo(() => {
    if (!collectionIdFromQuery) return 'Коллекция (по умолчанию)';
    return `Коллекция: ${collectionIdFromQuery}`;
  }, [collectionIdFromQuery]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const itemsForCollection = useMemo(() => {
    const items = initialOrderItems as any[];
    const key = storageKeyForCollectionId(collectionIdFromQuery);
    const extras = localInventory.articlesByCollection[key] ?? [];

    if (collectionIdFromQuery === 'Investor') {
      return [...items.filter((i) => i.investorDemo === true), ...extras];
    }
    if (!collectionIdFromQuery) {
      return [...items, ...(localInventory.articlesByCollection['__default__'] ?? [])];
    }
    return [...items.filter((item) => item.season === collectionIdFromQuery), ...extras];
  }, [collectionIdFromQuery, localInventory.articlesByCollection]);

  const isLocalSkuDuplicate = useCallback(
    (raw: string) => {
      const n = normalizeLocalSkuCode(raw);
      if (n.length < 2) return false;
      return (itemsForCollection as { sku?: string; id?: string }[]).some(
        (it) => normalizeLocalSkuCode(String(it.sku ?? it.id ?? '')) === n
      );
    },
    [itemsForCollection]
  );

  const pushLocalArticle = useCallback(
    (skuCode: string, displayName?: string) => {
      if (isLocalSkuDuplicate(skuCode)) return false;
      const key = storageKeyForCollectionId(collectionIdFromQuery);
      const draft = buildLocalDraftArticle(collectionIdFromQuery, skuCode, displayName, {
        investorDemo: collectionIdFromQuery === 'Investor',
      });
      pendingFocusLocalSkuRef.current = draft.id;
      setLocalInventory((inv) => ({
        ...inv,
        articlesByCollection: {
          ...inv.articlesByCollection,
          [key]: [...(inv.articlesByCollection[key] ?? []), draft],
        },
      }));
      return true;
    },
    [collectionIdFromQuery, isLocalSkuDuplicate]
  );

  const removeLocalArticle = useCallback(
    (articleId: string) => {
      const key = storageKeyForCollectionId(collectionIdFromQuery);
      setLocalInventory((inv) => removeArticleFromInventory(inv, key, articleId));
      setUnifiedDoc((d) => {
        const next = removeSkuFromUnifiedDoc(d, articleId);
        void getProductionDataPort().saveSkuFlow(collectionFlowKey, next);
        return next;
      });
      const cur = searchParams.get('stagesSku');
      if (cur === articleId) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('stagesSku');
        const q = params.toString();
        router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
      }
    },
    [collectionIdFromQuery, collectionFlowKey, pathname, router, searchParams]
  );

  const removeCurrentUserCollection = useCallback(() => {
    const cid = collectionIdFromQuery.trim();
    if (!cid) return;
    if (!localInventory.userCollections.some((c) => c.id === cid)) return;
    const toRemove = localInventory.articlesByCollection[cid] ?? [];
    if (
      typeof window !== 'undefined' &&
      !window.confirm(
        `Удалить локальную коллекцию «${cid}» и все её артикулы (${toRemove.length} шт.)? Это действие нельзя отменить.`
      )
    )
      return;
    setLocalInventory((inv) => removeUserCollectionFromInventory(inv, cid));
    setUnifiedDoc((d) => {
      let next = d;
      for (const row of toRemove) {
        next = removeSkuFromUnifiedDoc(next, row.id);
      }
      void getProductionDataPort().saveSkuFlow(collectionFlowKey, next);
      return next;
    });
    router.push('/brand/production');
  }, [
    collectionIdFromQuery,
    localInventory.userCollections,
    localInventory.articlesByCollection,
    collectionFlowKey,
    router,
  ]);

  const exportLocalInventory = useCallback(() => {
    if (typeof document === 'undefined') return;
    const blob = new Blob([exportInventoryJson(localInventory)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brand-local-inventory-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [localInventory]);

  const importLocalInventory = useCallback((jsonText: string, replaceAll: boolean) => {
    const parsed = parseInventoryImportJson(jsonText);
    if (!parsed) return { ok: false as const, message: 'Файл не похож на валидный экспорт (v1).' };
    if (replaceAll) {
      setLocalInventory(parsed);
      return {
        ok: true as const,
        message: 'Данные заменены целиком. Обновите при необходимости flow по коллекциям.',
      };
    }
    setLocalInventory((base) => mergeImportInventories(base, parsed));
    return { ok: true as const, message: 'Импорт объединён с текущими черновиками.' };
  }, []);

  const localRemovableArticles = useMemo(
    () =>
      (itemsForCollection as { id?: string; sku?: string }[])
        .filter((it) => String(it.id ?? '').startsWith('local-'))
        .map((it) => ({ id: String(it.id), sku: String(it.sku ?? it.id) })),
    [itemsForCollection]
  );

  const isUserDefinedCollection = useMemo(
    () => localInventory.userCollections.some((c) => c.id === collectionIdFromQuery.trim()),
    [localInventory.userCollections, collectionIdFromQuery]
  );

  const dropStats = useMemo(() => {
    const acc: Record<string, { styles: number; qty: number }> = {};
    (itemsForCollection as any[]).forEach((item) => {
      const windowId: string = item.deliveryWindowId || 'unknown';
      if (!acc[windowId]) acc[windowId] = { styles: 0, qty: 0 };
      acc[windowId].styles += 1;
      acc[windowId].qty += item.orderedQuantity ?? 0;
    });
    return acc;
  }, [itemsForCollection]);

  const dropsWithMeta = useMemo(() => {
    return JOOR_DELIVERY_WINDOWS.map((w) => {
      const start = new Date(w.startShipDate);
      const complete = new Date(w.completeShipDate);
      const cancel = w.cancelDate ? new Date(w.cancelDate) : undefined;
      const daysToStart = Math.round((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const daysToCancel = cancel
        ? Math.round((cancel.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        : undefined;
      const isPast = complete.getTime() < today.getTime();
      const isActive = !isPast && start.getTime() <= today.getTime();
      const isUpcoming = !isPast && start.getTime() > today.getTime();
      return {
        ...w,
        start,
        complete,
        cancel,
        daysToStart,
        daysToCancel,
        isPast,
        isActive,
        isUpcoming,
      };
    });
  }, [today.getTime()]);

  // Mock data for QC / milestones / subcontractor linked to PO-201/202 which use items from initialOrderItems.
  const mockQcInspections: QcInspection[] = [
    {
      id: 'qc1',
      orderId: 'PO-201',
      aqlLevel: '2.5',
      status: 'passed',
      inspectedCount: 80,
      defectCount: 0,
      defects: [],
      inspectedAt: '2026-03-10T14:00:00Z',
    },
    {
      id: 'qc2',
      orderId: 'PO-202',
      aqlLevel: '4.0',
      status: 'rework',
      inspectedCount: 120,
      defectCount: 3,
      defects: [{ id: 'd1', type: 'пятно', severity: 'major', position: 'спинка' }],
      inspectedAt: '2026-03-11T09:00:00Z',
    },
  ] as any;

  const mockMilestones: MilestoneWithVideo[] = [
    {
      id: 'm1',
      orderId: 'PO-201',
      milestoneType: 'cutting_done',
      milestoneLabel: 'Раскрой завершён',
      status: 'approved',
      completedAt: '2026-03-09T12:00:00Z',
      approvedAt: '2026-03-09T14:00:00Z',
    },
    {
      id: 'm2',
      orderId: 'PO-201',
      milestoneType: 'assembly_done',
      milestoneLabel: 'Сборка завершена',
      status: 'video_uploaded',
      completedAt: '2026-03-10T18:00:00Z',
    },
    {
      id: 'm3',
      orderId: 'PO-201',
      milestoneType: 'final_qc',
      milestoneLabel: 'Финальный ОК',
      status: 'pending',
    },
  ];

  const mockSubOrders: SubcontractOrder[] = [
    {
      id: 's1',
      subcontractorId: 'sc1',
      subcontractorName: 'Ателье «Стиль»',
      orderId: 'PO-201',
      workType: 'sewing',
      workTypeLabel: 'Пошив',
      quantity: 500,
      unit: 'шт',
      status: 'in_progress',
      requestedAt: '2026-03-05T10:00:00Z',
    },
    {
      id: 's2',
      subcontractorId: 'sc2',
      subcontractorName: 'Раскройный цех №2',
      orderId: 'PO-202',
      workType: 'cutting',
      workTypeLabel: 'Раскрой',
      quantity: 1200,
      unit: 'шт',
      status: 'completed',
      requestedAt: '2026-03-01T08:00:00Z',
      completedAt: '2026-03-08T17:00:00Z',
    },
  ];

  const qcSummary = useMemo(() => {
    // For now, tie all mock inspections to current collection (in реале — фильтр по PO/collectionId)
    const inspections = mockQcInspections;
    const total = inspections.length;
    const passed = inspections.filter((i) => i.status === 'passed').length;
    const withIssues = inspections.filter(
      (i) => i.defectCount > 0 || i.status === 'rework' || i.status === 'rejected'
    ).length;
    return { total, passed, withIssues };
  }, []);

  const milestonesSummary = useMemo(() => {
    const m = mockMilestones;
    const total = m.length;
    const approved = m.filter((x) => x.status === 'approved').length;
    const pending = m.filter((x) => x.status === 'pending').length;
    return { total, approved, pending };
  }, []);

  const subcontractSummary = useMemo(() => {
    const orders = mockSubOrders;
    const total = orders.length;
    const inProgress = orders.filter((o) => o.status === 'in_progress').length;
    const completed = orders.filter((o) => o.status === 'completed').length;
    return { total, inProgress, completed };
  }, []);

  const hasRisks =
    qcSummary.withIssues > 0 ||
    milestonesSummary.pending > 0 ||
    dropsWithMeta.some((d) => d.daysToCancel !== undefined && d.daysToCancel < 0);

  const stepIdsCatalog = useMemo(() => COLLECTION_STEPS.map((s) => s.id), []);

  /** id + подпись для flow (артикул · сезон), без маркетингового названия */
  const articleSeeds = useMemo(
    () =>
      (itemsForCollection as any[]).map((item, idx) => {
        const id = String(item.id);
        const sku = String(item.sku ?? item.id);
        const facets = deriveStagesArticleFacets(item as Record<string, unknown>, idx);
        return { id, label: stagesArticleDisplayLabel(sku, facets.season) };
      }),
    [itemsForCollection]
  );

  useEffect(() => {
    setUnifiedDoc((prev) => {
      let d = prev;
      for (const a of articleSeeds) {
        d = ensureSkuStages(d, a.id, a.label, stepIdsCatalog);
      }
      return d;
    });
  }, [articleSeeds, stepIdsCatalog]);

  useEffect(() => {
    if (investorDemoEvaluatedRef.current === collectionFlowKey) return;

    const skuIds = articleSeeds.map((a) => a.id);
    const expected = [...INVESTOR_DEMO_ARTICLE_IDS].sort().join(',');
    if (skuIds.length !== 3 || [...skuIds].sort().join(',') !== expected) {
      investorDemoEvaluatedRef.current = collectionFlowKey;
      return;
    }

    setUnifiedDoc((prev) => {
      let d = prev;
      for (const a of articleSeeds) {
        d = ensureSkuStages(d, a.id, a.label, stepIdsCatalog);
      }
      if (!investorDemoFlowIsPristine(d, skuIds, stepIdsCatalog)) return prev;
      return buildInvestorDemoFlowDoc(d);
    });
    investorDemoEvaluatedRef.current = collectionFlowKey;
  }, [collectionFlowKey, articleSeeds, stepIdsCatalog]);

  const flowDocReady = useMemo(() => {
    let d = unifiedDoc;
    for (const a of articleSeeds) {
      d = ensureSkuStages(d, a.id, a.label, stepIdsCatalog);
    }
    return d;
  }, [unifiedDoc, articleSeeds, stepIdsCatalog]);

  /** Артикулы коллекции: текущий этап = первый с незакрытыми обязательными полями чеклиста, иначе по статусам матрицы. */
  const collectionArticles: CollectionArticle[] = useMemo(() => {
    const items = itemsForCollection as any[];
    return items.map((item, idx) => {
      const skuKey = String(item.id);
      const currentStageId =
        getSkuDataGatedCurrentStepId(flowDocReady, skuKey, stepIdsCatalog) || stepIdsCatalog[0];
      const qty = item.orderedQuantity ?? 30;
      const price = typeof item.price === 'number' ? item.price : (item.price ?? 0);
      const wholesalePrice = price * 0.4;
      const facets = deriveStagesArticleFacets(item as Record<string, unknown>, idx);
      const skuStr = (item.sku ?? item.id) as string;
      const seasonStr = (item.season ?? facets.season ?? '') as string;
      const orderFromItem =
        (item as { primaryOrderRef?: string; orderRef?: string; poNumber?: string })
          .primaryOrderRef ??
        (item as { orderRef?: string }).orderRef ??
        (item as { poNumber?: string }).poNumber;
      return {
        id: skuKey,
        sku: skuStr,
        name: item.name ?? 'Без названия',
        currentStageId,
        primaryOrderRef: orderFromItem
          ? String(orderFromItem)
          : derivePrimaryOrderRef(seasonStr, idx),
        forecastQty: qty,
        forecastRevenue: qty * wholesalePrice,
        deliveryWindowId: item.deliveryWindowId ?? 'drop1',
        techPackDone: isSkuStepDone(flowDocReady, skuKey, 'tech-pack'),
        samplesDone: isSkuStepDone(flowDocReady, skuKey, 'samples'),
        poDone: isSkuStepDone(flowDocReady, skuKey, 'po'),
        qcDone: isSkuStepDone(flowDocReady, skuKey, 'qc'),
        ready: isSkuStepDone(flowDocReady, skuKey, 'ready-made'),
        ...facets,
      };
    });
  }, [itemsForCollection, flowDocReady, stepIdsCatalog]);

  useEffect(() => {
    const id = pendingFocusLocalSkuRef.current;
    if (!id) return;
    if (!collectionArticles.some((a) => a.id === id)) return;
    pendingFocusLocalSkuRef.current = null;
    const params = new URLSearchParams(searchParams.toString());
    params.set('stagesSku', id);
    params.set('floorTab', 'stages');
    params.set('stagesSub', 'sku');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [collectionArticles, pathname, router, searchParams]);

  const skuIds = useMemo(() => collectionArticles.map((a) => a.id), [collectionArticles]);

  const hubModuleKickoffStepIds = useMemo(
    () =>
      new Set([
        'brief',
        'assortment-map',
        'collection-hub',
        'costing',
        'materials',
        'photo-ref',
        'tech-pack',
        'gate-all-stakeholders',
        'supply-path',
        'samples',
        'b2b-linesheets',
        'production-window',
        'po',
        'floor-ops',
        'supplies-bind',
        'nesting-cut',
        'floor-execution',
        'qc',
        'ready-made',
        'wholesale-prep',
        'b2b-ship-stores',
        'sustainability',
      ]),
    []
  );

  /** Первое содержательное сохранение коллекционных модулей → все SKU: этап в матрице «в работе». */
  const handleCollectionModuleSaved = useCallback(
    (e: CollectionModuleSaveEvent) => {
      if (!e.firstSubstantiveSave || skuIds.length === 0) return;
      if (!hubModuleKickoffStepIds.has(e.stepId)) return;
      const stepId = e.stepId;
      setUnifiedDoc((d) => {
        let next = d;
        for (const aid of skuIds) {
          const art = collectionArticles.find((a) => a.id === aid);
          const label = art?.sku ?? aid;
          next = ensureSkuStages(next, aid, label, stepIdsCatalog);
          const st = next.skus[aid]?.stages[stepId]?.status;
          if (st === 'not_started') {
            next = patchSkuStage(next, aid, stepId, { status: 'in_progress' });
          }
        }
        void getProductionDataPort().saveSkuFlow(collectionFlowKey, next);
        return next;
      });
    },
    [skuIds, collectionArticles, stepIdsCatalog, collectionFlowKey, hubModuleKickoffStepIds]
  );

  const aggregateStatus = useMemo(
    () => buildAggregateStatusMap(flowDocReady, skuIds, COLLECTION_STEPS),
    [flowDocReady, skuIds]
  );

  const completedCount = COLLECTION_STEPS.filter((s) => aggregateStatus[s.id] === 'done').length;
  const progressPct = Math.round((completedCount / COLLECTION_STEPS.length) * 100);

  const articlesByStage = useMemo(() => {
    const acc: Record<string, number> = {};
    collectionArticles.forEach((a) => {
      acc[a.currentStageId] = (acc[a.currentStageId] ?? 0) + 1;
    });
    return acc;
  }, [collectionArticles]);

  const totalForecastRevenue = useMemo(
    () => collectionArticles.reduce((sum, a) => sum + a.forecastRevenue, 0),
    [collectionArticles]
  );
  const totalForecastQty = useMemo(
    () => collectionArticles.reduce((sum, a) => sum + a.forecastQty, 0),
    [collectionArticles]
  );

  /** Сводка по артикулам: сколько прошли Tech Pack, PO, готовы — для шапки блока артикулов */
  const articlesProgressSummary = useMemo(() => {
    const withTechPack = collectionArticles.filter((a) => a.techPackDone).length;
    const withSamples = collectionArticles.filter((a) => a.samplesDone).length;
    const withPo = collectionArticles.filter((a) => a.poDone).length;
    const ready = collectionArticles.filter((a) => a.ready).length;
    const total = collectionArticles.length;
    return { withTechPack, withSamples, withPo, ready, total };
  }, [collectionArticles]);

  const dropLabelById: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    JOOR_DELIVERY_WINDOWS.forEach((w) => {
      map[w.id] = w.label;
    });
    return map;
  }, []);

  const collectionQuery = collectionIdFromQuery
    ? `?collectionId=${encodeURIComponent(collectionIdFromQuery)}`
    : '';

  const suppliesFloorHref = useMemo(
    () =>
      collectionIdFromQuery
        ? `/brand/production?collectionId=${encodeURIComponent(collectionIdFromQuery)}&floorTab=supplies`
        : '/brand/production?floorTab=supplies',
    [collectionIdFromQuery]
  );

  const sampleFloorHref = useMemo(
    () =>
      collectionIdFromQuery
        ? `/brand/production?collectionId=${encodeURIComponent(collectionIdFromQuery)}&floorTab=sample`
        : '/brand/production?floorTab=sample',
    [collectionIdFromQuery]
  );

  const liveProcessHref = useMemo(
    () =>
      collectionIdFromQuery
        ? `${ROUTES.brand.processLiveProduction}?collectionId=${encodeURIComponent(collectionIdFromQuery)}`
        : ROUTES.brand.processLiveProduction,
    [collectionIdFromQuery]
  );

  const workshopFloorTabHrefs = useMemo(() => {
    const tab = (id: string) =>
      collectionIdFromQuery
        ? `/brand/production?collectionId=${encodeURIComponent(collectionIdFromQuery)}&floorTab=${id}`
        : `/brand/production?floorTab=${id}`;
    return {
      live: tab('live'),
      stages: tab('stages'),
      workshop: tab('workshop'),
      plan: tab('plan'),
      ops: tab('ops'),
      nesting: tab('nesting'),
      launch: tab('launch'),
      quality: tab('quality'),
      receipt: tab('receipt'),
    };
  }, [collectionIdFromQuery]);

  const b2bLinesheetsHref = useMemo(
    () =>
      collectionQuery
        ? `${ROUTES.brand.b2bLinesheets}${collectionQuery}`
        : ROUTES.brand.b2bLinesheets,
    [collectionQuery]
  );

  const factoriesHref = useMemo(
    () =>
      collectionQuery ? `${ROUTES.brand.factories}${collectionQuery}` : ROUTES.brand.factories,
    [collectionQuery]
  );

  const warehouseHref = useMemo(
    () =>
      collectionQuery ? `${ROUTES.brand.warehouse}${collectionQuery}` : ROUTES.brand.warehouse,
    [collectionQuery]
  );

  const b2bShipmentsHref = useMemo(
    () =>
      collectionQuery
        ? `${ROUTES.brand.b2bShipments}${collectionQuery}`
        : ROUTES.brand.b2bShipments,
    [collectionQuery]
  );

  const esgHref = useMemo(
    () => (collectionQuery ? `${ROUTES.brand.esg}${collectionQuery}` : ROUTES.brand.esg),
    [collectionQuery]
  );

  const liveB2bHref = useMemo(
    () =>
      collectionIdFromQuery
        ? `${ROUTES.brand.processLiveB2b}?collectionId=${encodeURIComponent(collectionIdFromQuery)}`
        : ROUTES.brand.processLiveB2b,
    [collectionIdFromQuery]
  );

  /** Глубокие ссылки для вторых кнопок на карточках хаба (Gantt, полные страницы, VMI и т.д.) */
  const chainDeepLinkHrefs = useMemo((): CollectionChainDeepLinkHrefs => {
    const q = collectionQuery;
    const withQ = (path: string) => (q ? `${path}${q}` : path);
    return {
      productionGantt: withQ(ROUTES.brand.productionGantt),
      productionOperations: withQ(ROUTES.brand.productionOperations),
      productionNesting: withQ(ROUTES.brand.productionNesting),
      productionQcApp: withQ(ROUTES.brand.productionQcApp),
      productionReadyMade: withQ(ROUTES.brand.productionReadyMade),
      logistics: withQ(ROUTES.brand.logistics),
      b2bOrders: withQ(ROUTES.brand.b2bOrders),
      vmi: withQ(ROUTES.brand.vmi),
      b2bLinesheetsCreate: withQ(ROUTES.brand.b2bLinesheetsCreate),
      productionGoldSample: withQ(ROUTES.brand.productionGoldSample),
      productionFitComments: withQ(ROUTES.brand.productionFitComments),
      liveLogistics: collectionIdFromQuery
        ? `${ROUTES.brand.processLiveLogistics}?collectionId=${encodeURIComponent(collectionIdFromQuery)}`
        : ROUTES.brand.processLiveLogistics,
      collections: withQ(ROUTES.brand.collections),
      collectionsNew: ROUTES.brand.collectionsNew,
      pricing: withQ(ROUTES.brand.pricing),
      suppliers: withQ(ROUTES.brand.suppliers),
      suppliersRfq: withQ(ROUTES.brand.suppliersRfq),
      materialsReservation: withQ(ROUTES.brand.materialsReservation),
      contentHub: withQ(ROUTES.brand.contentHub),
      integrationsErpPlm: withQ(ROUTES.brand.integrationsErpPlm),
      messages: withQ(ROUTES.brand.messages),
      calendar: withQ(ROUTES.brand.calendar),
      tasks: withQ(ROUTES.brand.tasks),
      teamTasks: ROUTES.brand.teamTasks,
      compliance: withQ(ROUTES.brand.compliance),
      circularHub: withQ(ROUTES.brand.circularHub),
      warehouse: withQ(ROUTES.brand.warehouse),
    };
  }, [collectionQuery, collectionIdFromQuery]);

  /** Отфильтрованные и отсортированные артикулы для таблицы */
  const displayedArticles = useMemo(() => {
    let list = collectionArticles;
    const q = articleSearch.trim().toLowerCase();
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
    if (articleFilterStage) {
      list = list.filter((a) => a.currentStageId === articleFilterStage);
    }
    if (articleFilterDrop) {
      list = list.filter((a) => a.deliveryWindowId === articleFilterDrop);
    }
    if (articleFocusNeedsAttention) {
      list = list.filter((a) => !a.techPackDone || !a.poDone);
    }
    const stageOrder = COLLECTION_STEPS.map((s) => s.id);
    const dropOrder = JOOR_DELIVERY_WINDOWS.map((w) => w.id);
    list = [...list].sort((a, b) => {
      if (articleSortBy === 'stage') {
        return stageOrder.indexOf(a.currentStageId) - stageOrder.indexOf(b.currentStageId);
      }
      if (articleSortBy === 'drop') {
        return (
          dropOrder.indexOf(a.deliveryWindowId || '') -
            dropOrder.indexOf(b.deliveryWindowId || '') || a.sku.localeCompare(b.sku)
        );
      }
      return b.forecastRevenue - a.forecastRevenue;
    });
    return list;
  }, [
    collectionArticles,
    articleSearch,
    articleFilterStage,
    articleFilterDrop,
    articleFocusNeedsAttention,
    articleSortBy,
  ]);

  const needsAttentionCount = useMemo(
    () => collectionArticles.filter((a) => !a.techPackDone || !a.poDone).length,
    [collectionArticles]
  );

  const exportArticlesCsv = () => {
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
    const rows = displayedArticles.map((a) => {
      const step = COLLECTION_STEPS.find((s) => s.id === a.currentStageId);
      const dropLabel = a.deliveryWindowId
        ? (dropLabelById[a.deliveryWindowId] ?? a.deliveryWindowId)
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
    a.download = `collection-articles-${collectionIdFromQuery || 'default'}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /** Чек-лист «Что сделать по коллекции» на основе статусов */
  const collectionChecklist = useMemo(() => {
    const items: { id: string; label: string; count: number; href?: string; done: boolean }[] = [];
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
      else
        items.push({ id: 'ready', label: 'Все артикулы приняты на склад', count: 0, done: true });
    }
    return items;
  }, [collectionArticles, collectionQuery, floorHref]);

  const stagesFilterOn = stagesTabHasActiveFilters(searchParams);

  const stagesSkuContextId = searchParams.get(STAGES_SKU_PARAM)?.trim() ?? '';
  const stagesSkuContextLine = useMemo(() => {
    if (!stagesSkuContextId) return undefined;
    const a = collectionArticles.find((x) => x.id === stagesSkuContextId);
    return a ? stagesArticleDisplayLabel(a.sku, a.season) : undefined;
  }, [stagesSkuContextId, collectionArticles]);

  const stagesStepContextId = searchParams.get(STAGES_STEP_PARAM)?.trim() ?? '';
  const stagesStepContextTitle = useMemo(() => {
    if (!stagesStepContextId) return undefined;
    return COLLECTION_STEPS.find((s) => s.id === stagesStepContextId)?.title;
  }, [stagesStepContextId]);

  const stagesSkuCatalogContext = useMemo(() => {
    if (!stagesSkuContextId) return null;
    const a = collectionArticles.find((x) => x.id === stagesSkuContextId);
    if (!a?.currentStageId) return null;
    const idx = COLLECTION_STEPS.findIndex((s) => s.id === a.currentStageId);
    if (idx < 0) return null;
    const st = COLLECTION_STEPS[idx]!;
    return {
      title: st.title,
      phase: st.phase,
      positionLabel: `${idx + 1}/${COLLECTION_STEPS.length}`,
    };
  }, [stagesSkuContextId, collectionArticles]);

  const articleContextValid = useMemo(
    () =>
      Boolean(stagesSkuContextId && collectionArticles.some((a) => a.id === stagesSkuContextId)),
    [stagesSkuContextId, collectionArticles]
  );

  const articleRequiredTabHint =
    'Сначала выберите артикул: вкладка «Коллекция» → в таблице кнопка «В цех · процесс».';

  const setTab = useCallback(
    (nextRaw: string) => {
      const next: ProductionFloorTabId = isProductionFloorTab(nextRaw) ? nextRaw : 'workshop';
      if (productionFloorTabRequiresArticle(next) && !articleContextValid) {
        setTabState('workshop');
        const params = new URLSearchParams(searchParams.toString());
        params.delete('floorTab');
        const q = params.toString();
        router.replace(`${pathname}${q ? `?${q}` : ''}`, { scroll: false });
        return;
      }
      setTabState(next);
      const params = new URLSearchParams(searchParams.toString());
      if (next === 'workshop') params.delete('floorTab');
      else params.set('floorTab', next);
      const q = params.toString();
      router.replace(`${pathname}${q ? `?${q}` : ''}`, { scroll: false });
    },
    [articleContextValid, pathname, router, searchParams]
  );

  const openArticleProductionHub = useCallback(
    (articleId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(STAGES_SKU_PARAM, articleId);
      params.set('floorTab', 'stages');
      params.set('stagesSub', 'sku');
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const id = stagesSkuContextId;
    if (!id) return;
    if (collectionArticles.length === 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(STAGES_SKU_PARAM);
      const q = params.toString();
      router.replace(`${pathname}${q ? `?${q}` : ''}`, { scroll: false });
      return;
    }
    if (collectionArticles.some((a) => a.id === id)) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete(STAGES_SKU_PARAM);
    const q = params.toString();
    router.replace(`${pathname}${q ? `?${q}` : ''}`, { scroll: false });
  }, [stagesSkuContextId, collectionArticles, pathname, router, searchParams]);

  useEffect(() => {
    if (!productionFloorTabRequiresArticle(tab)) return;
    if (articleContextValid) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete('floorTab');
    if (stagesSkuContextId) params.delete(STAGES_SKU_PARAM);
    const q = params.toString();
    router.replace(`${pathname}${q ? `?${q}` : ''}`, { scroll: false });
  }, [tab, articleContextValid, stagesSkuContextId, pathname, router, searchParams]);

  /** Путь + query без origin — одинаково на SSR и при гидрации (избегаем рассинхрона disabled у кнопки «Ссылка»). */
  const productionFullPageUrl = useMemo(() => {
    const q = searchParams.toString();
    return `${pathname}${q ? `?${q}` : ''}`;
  }, [pathname, searchParams]);

  const exportUnifiedFlowJson = useCallback(() => {
    if (typeof document === 'undefined') return;
    const blob = new Blob([JSON.stringify(unifiedDoc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unified-sku-flow-${collectionFlowKey}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [unifiedDoc, collectionFlowKey]);

  return (
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <TooltipProvider delayDuration={280}>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          {/* cabinetSurface v1 */}
          <TabsList className={cn(cabinetSurface.tabsList, 'flex-wrap overflow-x-auto')}>
            <ProductionFloorTabWithHint
              tab="stages"
              disabled={!articleContextValid}
              disabledHint={articleRequiredTabHint}
              className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
            >
              <ListTree className="h-3.5 w-3.5 shrink-0" />
              <span className="max-w-[9rem] leading-tight sm:whitespace-nowrap">
                Этапы и зависимости
              </span>
              {stagesFilterOn ? <StagesContextFilterPulseIcon /> : null}
            </ProductionFloorTabWithHint>
            <ProductionFloorTabWithHint
              tab="live"
              className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
            >
              <Activity className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">LIVE · схема</span>
            </ProductionFloorTabWithHint>
            <ProductionFloorTabWithHint
              tab="workshop"
              className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
            >
              <Factory className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">Коллекция</span>
            </ProductionFloorTabWithHint>
            <ProductionFloorTabWithHint
              tab="supplies"
              disabled={!articleContextValid}
              disabledHint={articleRequiredTabHint}
              className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
            >
              <Package className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">Снабжение</span>
            </ProductionFloorTabWithHint>
            <ProductionFloorTabWithHint
              tab="sample"
              disabled={!articleContextValid}
              disabledHint={articleRequiredTabHint}
              className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
            >
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">Эталон · fit</span>
            </ProductionFloorTabWithHint>
            <ProductionFloorTabWithHint
              tab="plan"
              disabled={!articleContextValid}
              disabledHint={articleRequiredTabHint}
              className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
            >
              <BarChart3 className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">План · PO</span>
            </ProductionFloorTabWithHint>
            <ProductionFloorTabWithHint
              tab="nesting"
              disabled={!articleContextValid}
              disabledHint={articleRequiredTabHint}
              className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
            >
              <Ruler className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">Nesting AI</span>
            </ProductionFloorTabWithHint>
            <ProductionFloorTabWithHint
              tab="launch"
              disabled={!articleContextValid}
              disabledHint={articleRequiredTabHint}
              className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
            >
              <Play className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">Выпуск</span>
            </ProductionFloorTabWithHint>
            <ProductionFloorTabWithHint
              tab="quality"
              disabled={!articleContextValid}
              disabledHint={articleRequiredTabHint}
              className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
            >
              <Camera className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">ОТК</span>
            </ProductionFloorTabWithHint>
            <ProductionFloorTabWithHint
              tab="receipt"
              disabled={!articleContextValid}
              disabledHint={articleRequiredTabHint}
              className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
            >
              <Truck className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">Склад</span>
            </ProductionFloorTabWithHint>
            <ProductionFloorTabWithHint
              tab="ops"
              disabled={!articleContextValid}
              disabledHint={articleRequiredTabHint}
              className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
            >
              <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">Операции</span>
            </ProductionFloorTabWithHint>
          </TabsList>

          <ProductionFloorContextBar
            className="mt-3"
            collectionLabel={collectionLabel}
            collectionId={collectionIdFromQuery}
            stagesSkuId={stagesSkuContextId}
            stagesSkuLine={stagesSkuContextLine}
            stagesStepId={stagesStepContextId}
            stagesStepTitle={stagesStepContextTitle}
            skuCatalogStageTitle={stagesSkuCatalogContext?.title}
            skuCatalogStagePhase={stagesSkuCatalogContext?.phase}
            skuCatalogPositionLabel={stagesSkuCatalogContext?.positionLabel}
            fullPageUrl={productionFullPageUrl}
            stagesTabHref={floorHref('stages')}
            currentTab={tab}
            currentTabTitle={getProductionFloorTabTitle(tab)}
          />

          <TabsContent value="stages" className="mt-4 space-y-6">
            {tab === 'stages' && (
              <StagesDependenciesTabContent
                key={collectionFlowKey}
                collectionArticles={collectionArticles}
                flowDoc={flowDocReady}
                steps={COLLECTION_STEPS}
                collectionQuery={collectionQuery}
                floorHref={floorHref}
                mergeCollectionQuery={mergeCollectionQuery}
                setUnifiedDoc={setUnifiedDoc}
                getProductionFloorTabTitle={getProductionFloorTabTitle}
                collectionFlowKey={collectionFlowKey}
                localInventoryTools={
                  {
                    collectionId: collectionIdFromQuery,
                    totalArticlesInCollection: collectionArticles.length,
                    localRemovableArticles,
                    isUserDefinedCollection,
                    onAddArticle: pushLocalArticle,
                    onCreateCollection: pushUserCollection,
                    onRemoveLocalArticle: removeLocalArticle,
                    onRemoveUserCollection: removeCurrentUserCollection,
                    onExportInventory: exportLocalInventory,
                    onImportInventory: importLocalInventory,
                    isSkuDuplicate: isLocalSkuDuplicate,
                    onExportUnifiedFlow: exportUnifiedFlowJson,
                  } satisfies StagesLocalInventoryToolsInput
                }
              />
            )}
          </TabsContent>

          <TabsContent value="live" className="mt-4 space-y-4">
            {tab === 'live' && (
              <LiveProcessPageBody
                processId="production"
                embedded
                workshopCollectionId={collectionIdFromQuery}
                onWorkshopCollectionChange={handleLiveContextCollectionChange}
              />
            )}
          </TabsContent>

          <TabsContent value="workshop" className="mt-4 space-y-6">
            <Card className="border-accent-primary/30 bg-accent-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-accent-primary text-sm uppercase tracking-tight">
                  Единый производственный хаб
                </CardTitle>
                <CardDescription className="text-text-primary text-xs leading-relaxed">
                  Сначала коллекция, затем артикул. Вкладки «Этапы», «Снабжение», «Эталон», «План»,
                  «Выпуск», «ОТК», «Склад» и «Операции» открываются только после выбора артикула в
                  таблице ниже — <strong className="text-text-primary">«В цех · процесс»</strong>.
                  Вкладка «LIVE · схема» доступна без артикула (обзор по коллекции). Раздел готовых
                  к продаже продуктов и B2B/B2C — отдельно позже.
                </CardDescription>
              </CardHeader>
              {articleContextValid && stagesSkuContextLine ? (
                <CardContent className="flex flex-wrap items-center gap-2 pt-0">
                  <Badge variant="secondary" className="text-[10px] font-semibold">
                    В работе: {stagesSkuContextLine}
                  </Badge>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() => setTab('stages')}
                  >
                    К этапам и модулям этого артикула
                  </Button>
                </CardContent>
              ) : null}
            </Card>

            {/* —— Мои коллекции: все, по которым велась или ведётся работа; провал в одну —— */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-tight">
                  <Factory className="h-4 w-4" /> Работа по коллекциям
                </CardTitle>
                <CardDescription className="text-xs">
                  Выберите коллекцию. Дальше в таблице артикулов нажмите «В цех · процесс», чтобы
                  вести полный контур производства по одному изделию за раз.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {workshopCollectionsDisplay.map((col) => {
                    const isCurrent =
                      (col.id || 'default') === (collectionIdFromQuery || 'default');
                    const statusLabel =
                      col.status === 'done'
                        ? 'Завершена'
                        : col.status === 'in_progress'
                          ? 'В работе'
                          : 'Черновик';
                    const statusClass =
                      col.status === 'done'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : col.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-bg-surface2 text-text-secondary border-border-default';
                    return (
                      <Link
                        key={col.id || 'default'}
                        href={
                          col.id === ''
                            ? '/brand/production'
                            : `/brand/production?collectionId=${encodeURIComponent(col.id)}`
                        }
                      >
                        <Card
                          className={cn(
                            'h-full border-2 transition-all hover:shadow-md',
                            isCurrent
                              ? 'border-accent-primary/40 bg-accent-primary/10'
                              : 'border-border-subtle'
                          )}
                        >
                          <CardContent className="p-4">
                            <p className="text-text-primary truncate text-[12px] font-semibold">
                              {col.name}
                            </p>
                            <Badge className={cn('mt-1.5 border text-[9px]', statusClass)}>
                              {statusLabel}
                            </Badge>
                            <p className="text-text-secondary mt-2 text-[10px]">
                              Артикулов: <strong>{col.articleCount}</strong>
                            </p>
                            <Progress value={col.progressPct} className="mt-1 h-1.5" />
                            <p className="text-text-muted mt-0.5 text-[9px]">{col.progressPct}%</p>
                            <p
                              className={cn(
                                'mt-3 rounded-lg py-1.5 text-center text-[10px] font-semibold',
                                isCurrent
                                  ? 'bg-accent-primary/15 text-accent-primary'
                                  : 'bg-bg-surface2 text-text-secondary'
                              )}
                            >
                              {isCurrent ? 'Открыта' : 'Открыть'}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* —— Инструменты производства: GANTT, отчёты смен, QC, компетенции, этапы с видео, субподряд, Nesting —— */}
            <Card className="border-accent-primary/20 bg-accent-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-tight">
                  <ListTodo className="h-4 w-4" /> Инструменты производства
                </CardTitle>
                <CardDescription className="text-xs">
                  После выбора артикула («В цех · процесс») эти ссылки ведут в модули с тем же
                  контекстом. Без артикула сначала откройте таблицу ниже.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                    <Link href={floorHref('plan')}>GANTT · план PO</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                    <Link href={floorHref('launch')}>Выпуск · смены</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                    <Link href={floorHref('quality')}>ОТК · мобильное</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                    <Link href={floorHref('supplies')}>VMI · бронь материалов</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                    <Link href={floorHref('nesting')}>Nesting AI · раскрой</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* —— Поэтапная схема: одна коллекция проходит этапы 1→2→…→N; артикулы и быстрые действия — инструменты —— */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-tight">
                  Поэтапная схема: от идеи до склада
                </CardTitle>
                <CardDescription className="text-xs">
                  <strong>Что это:</strong> цепочка ниже — те же этапы и тот же порядок, что в
                  матрице «Этапы и зависимости» (
                  <code className="bg-bg-surface2 rounded px-1 text-[10px]">COLLECTION_STEPS</code>
                  ). Переход артикула к следующему шагу в работе определяется графом зависимостей (
                  <code className="bg-bg-surface2 rounded px-1 text-[10px]">dependsOn</code>
                  ), а не только номером карточки. Выберите коллекцию выше (карточки «Работа по
                  коллекциям»). По <strong>названию этапа</strong> — модуль: поля, вложения, журнал;
                  «В модуль» — переход в экран этапа. В блоке <strong>«Артикулы коллекции»</strong>{' '}
                  — таблица и текущий этап. <strong>«Быстрые действия»</strong> — добавление
                  артикулов, прогноз, запуск.
                </CardDescription>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                    <Link href={floorHref('stages')}>
                      Этапы и зависимости: матрица, статусы, ссылки →
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                    <Link href={processLiveUrl('production', effectiveCollectionId)}>
                      LIVE process: ответственные, даты, календарь, обсуждения →
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary bg-bg-surface2 border-border-subtle rounded-lg border p-3 text-[11px]">
                  Текущая коллекция: <strong>{collectionLabel}</strong>. Прогресс по этапам:{' '}
                  <strong>{completedCount}</strong> из {COLLECTION_STEPS.length} (этап считается
                  «готово», когда все артикулы в коллекции закрыли этап). Детали по ответственным,
                  деньгам и выходам — на вкладке «Этапы» в блоке «По артикулам».
                </p>

                <CollectionWorkshopStageChain
                  steps={COLLECTION_STEPS}
                  collectionFlowKey={collectionFlowKey}
                  collectionId={collectionIdFromQuery}
                  collectionLabel={collectionLabel}
                  pimCollectionHref={
                    collectionQuery
                      ? `${ROUTES.brand.products}${collectionQuery}`
                      : ROUTES.brand.products
                  }
                  workshopCollectionHref={
                    collectionQuery ? `/brand/production${collectionQuery}` : '/brand/production'
                  }
                  budgetActualHref={
                    collectionQuery
                      ? `${ROUTES.brand.budgetActual}${collectionQuery}`
                      : ROUTES.brand.budgetActual
                  }
                  materialsHref={
                    collectionQuery
                      ? `${ROUTES.brand.materials}${collectionQuery}`
                      : ROUTES.brand.materials
                  }
                  mediaHref={
                    collectionQuery ? `${ROUTES.brand.media}${collectionQuery}` : ROUTES.brand.media
                  }
                  techPackHref={
                    collectionQuery
                      ? `${ROUTES.brand.productionTechPackStyle('new')}${collectionQuery}`
                      : ROUTES.brand.productionTechPackStyle('new')
                  }
                  liveProcessHref={liveProcessHref}
                  suppliesFloorHref={suppliesFloorHref}
                  sampleFloorHref={sampleFloorHref}
                  workshopFloorTabHrefs={workshopFloorTabHrefs}
                  b2bLinesheetsHref={b2bLinesheetsHref}
                  factoriesHref={factoriesHref}
                  warehouseHref={warehouseHref}
                  b2bShipmentsHref={b2bShipmentsHref}
                  liveB2bHref={liveB2bHref}
                  esgHref={esgHref}
                  chainDeepLinkHrefs={chainDeepLinkHrefs}
                  articlesByStage={articlesByStage}
                  aggregateStatus={aggregateStatus}
                  onAfterModuleSave={handleCollectionModuleSaved}
                  hrefWithCollection={(step) => {
                    if (!step.href) return null;
                    return collectionQuery
                      ? `${step.href}${step.href.includes('?') ? '&' : '?'}${collectionQuery.slice(1)}`
                      : step.href;
                  }}
                />

                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  <span className="text-text-secondary">Текущая коллекция:</span>
                  <select
                    value={collectionIdFromQuery}
                    onChange={(e) => handleCollectionChange(e.target.value)}
                    className="border-border-default rounded-lg border bg-white px-2 py-1.5 text-[10px]"
                  >
                    <option value="">По умолчанию</option>
                    {collectionSelectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    <option value="__new__">➕ Новая коллекция…</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() => router.push('/brand/production?collectionId=New')}
                  >
                    Новая коллекция
                  </Button>
                  <span className="text-text-muted ml-2">Прогресс: {progressPct}%</span>
                  <Progress
                    value={progressPct}
                    className="ml-1 inline-block h-1.5 w-24 align-middle"
                  />
                </div>

                <div className="border-border-subtle bg-bg-surface2/60 rounded-xl border p-3">
                  <p className="text-text-secondary mb-2 text-[10px] font-bold">
                    Таймлайн дропов по коллекции
                  </p>
                  <div className="space-y-2">
                    {dropsWithMeta.map((drop) => {
                      const stateLabel = drop.isPast
                        ? 'Завершён'
                        : drop.isActive
                          ? 'В отгрузке'
                          : 'Планируется';
                      const stats = dropStats[drop.id];
                      return (
                        <div key={drop.id} className="flex items-center gap-3 text-[10px]">
                          <span className="w-28 shrink-0">
                            {drop.label.replace(/^Drop \d+: /, '')}
                          </span>
                          <span
                            className={cn(
                              'font-medium',
                              drop.isPast
                                ? 'text-text-secondary'
                                : drop.isActive
                                  ? 'text-emerald-700'
                                  : 'text-amber-700'
                            )}
                          >
                            {stateLabel}
                          </span>
                          {stats && (
                            <span className="text-text-secondary">
                              Стилей: {stats.styles}, шт: {stats.qty}
                            </span>
                          )}
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="ml-auto h-6 text-[9px]"
                          >
                            <Link
                              href={`${ROUTES.brand.productionGantt}?window=${encodeURIComponent(drop.id)}${collectionIdFromQuery ? `&collectionId=${encodeURIComponent(collectionIdFromQuery)}` : ''}`}
                            >
                              PO по дропу →
                            </Link>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Быстрые действия: для выбранной выше коллекции — добавить артикулы, прогноз, запуск в производство */}
            <div className="border-accent-primary/20 from-accent-primary/10 flex flex-wrap items-center gap-2 rounded-xl border bg-gradient-to-r to-white p-4">
              <span className="text-text-secondary mr-2 text-[10px] font-black uppercase tracking-widest">
                Быстрые действия
              </span>
              <span className="text-text-secondary hidden text-[10px] sm:inline">
                (для коллекции «{collectionLabel}»)
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-[10px] font-bold uppercase"
                asChild
              >
                <Link
                  href={
                    collectionIdFromQuery
                      ? `${ROUTES.brand.products}?addToCollection=${encodeURIComponent(collectionIdFromQuery)}`
                      : ROUTES.brand.products
                  }
                >
                  <PlusCircle className="h-4 w-4" /> Добавить артикулы в коллекцию
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-[10px] font-bold uppercase"
                asChild
              >
                <Link href={ROUTES.brand.budgetActual}>
                  <BarChart3 className="h-4 w-4" /> Спрогнозировать коллекцию
                </Link>
              </Button>
              <Button
                size="sm"
                className="bg-text-primary hover:bg-text-primary/90 h-9 gap-1.5 text-[10px] font-bold uppercase text-white"
                asChild
              >
                <Link
                  href={`${ROUTES.brand.productionGantt}${collectionIdFromQuery ? `?collectionId=${encodeURIComponent(collectionIdFromQuery)}` : ''}`}
                >
                  <Play className="h-4 w-4" /> Запустить в производство
                </Link>
              </Button>
              <span className="text-text-secondary ml-2 text-[10px]">
                Артикулов в коллекции: <strong>{collectionArticles.length}</strong> · Прогноз:{' '}
                <strong>{totalForecastQty.toLocaleString('ru-RU')} шт</strong> · Выручка:{' '}
                <strong>{(totalForecastRevenue / 1_000_000).toFixed(1)} млн ₽</strong>
              </span>
              {collectionIdFromQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto h-9 gap-1.5 text-[10px] font-bold uppercase"
                  asChild
                >
                  <Link
                    href={`${ROUTES.shop.b2bOrders}?${collectionQuery ? collectionQuery.slice(1) + '&' : ''}view=collection`}
                  >
                    <ShoppingBag className="h-4 w-4" /> B2B по коллекции
                  </Link>
                </Button>
              )}
            </div>

            {/* Фокус: что сделать в первую очередь */}
            {collectionArticles.length > 0 && (
              <Card className="border-amber-100 bg-gradient-to-br from-amber-50/50 to-white">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-tight">
                    <ListTodo className="h-4 w-4 text-amber-600" /> Что сделать по коллекции
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Чек-лист по статусам артикулов. Переход в нужный раздел по клику.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {collectionChecklist.map((item) => (
                      <li key={item.id}>
                        {item.href ? (
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-white',
                              item.done
                                ? 'border-emerald-200 bg-emerald-50/50'
                                : 'border-amber-200 bg-white'
                            )}
                          >
                            {item.done ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                            ) : (
                              <CircleDot className="h-4 w-4 shrink-0 text-amber-500" />
                            )}
                            <span
                              className={cn(
                                'text-[11px] font-medium',
                                item.done ? 'text-emerald-800' : 'text-text-primary'
                              )}
                            >
                              {item.label}
                            </span>
                          </Link>
                        ) : (
                          <div
                            className={cn(
                              'flex items-center gap-2 rounded-lg border p-3',
                              item.done
                                ? 'border-emerald-200 bg-emerald-50/50'
                                : 'border-border-subtle bg-bg-surface2/80'
                            )}
                          >
                            {item.done ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                            ) : (
                              <CircleDot className="text-text-muted h-4 w-4 shrink-0" />
                            )}
                            <span
                              className={cn(
                                'text-[11px] font-medium',
                                item.done ? 'text-emerald-800' : 'text-text-secondary'
                              )}
                            >
                              {item.label}
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Карточки «Требуют внимания» */}
            {collectionArticles.length > 0 && needsAttentionCount > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Card
                  className="cursor-pointer border-amber-200 bg-amber-50/30 transition-colors hover:bg-amber-50/50"
                  onClick={() => setArticleFocusNeedsAttention(true)}
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                        Требуют внимания
                      </p>
                      <p className="text-text-primary text-lg font-black">
                        {needsAttentionCount} артикулов
                      </p>
                      <p className="text-text-secondary text-[10px]">Без Tech Pack или без PO</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border-default">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-xl">
                      <FileText className="text-text-secondary h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                        Без Tech Pack
                      </p>
                      <p className="text-text-primary text-lg font-black">
                        {articlesProgressSummary.total - articlesProgressSummary.withTechPack} арт.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border-default">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="bg-accent-primary/15 flex h-10 w-10 items-center justify-center rounded-xl">
                      <ClipboardCheck className="text-accent-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                        Без PO
                      </p>
                      <p className="text-text-primary text-lg font-black">
                        {articlesProgressSummary.total - articlesProgressSummary.withPo} арт.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-sm uppercase tracking-tight">
                      Артикулы коллекции
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      Все артикулы коллекции «{collectionLabel}». Колонка «В цех · процесс» — вход в
                      полный производственный контур по выбранному SKU (этапы, снабжение, эталон,
                      выпуск и т.д.). Остальные иконки — быстрые внешние экраны.
                    </CardDescription>
                  </div>
                  {articlesProgressSummary.total > 0 && (
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <Badge
                        variant="outline"
                        className="border-border-default text-text-secondary"
                      >
                        Tech Pack: {articlesProgressSummary.withTechPack}/
                        {articlesProgressSummary.total}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-border-default text-text-secondary"
                      >
                        Сэмплы: {articlesProgressSummary.withSamples}/
                        {articlesProgressSummary.total}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-accent-primary/30 text-accent-primary"
                      >
                        PO: {articlesProgressSummary.withPo}/{articlesProgressSummary.total}
                      </Badge>
                      <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                        Готово: {articlesProgressSummary.ready}/{articlesProgressSummary.total}
                      </Badge>
                    </div>
                  )}
                </div>
                {collectionArticles.length > 0 && (
                  <div className="border-border-subtle mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                    <div className="relative min-w-[140px] max-w-[200px] flex-1">
                      <Search className="text-text-muted absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Поиск: артикул, сезон, категория, ткань…"
                        value={articleSearch}
                        onChange={(e) => setArticleSearch(e.target.value)}
                        className="border-border-default focus:ring-accent-primary focus:border-accent-primary h-8 w-full rounded-lg border bg-white pl-8 pr-2 text-[11px] focus:ring-2"
                      />
                    </div>
                    <select
                      value={articleFilterStage}
                      onChange={(e) => setArticleFilterStage(e.target.value)}
                      className="border-border-default h-8 rounded-lg border bg-white px-2 text-[11px]"
                    >
                      <option value="">Все этапы</option>
                      {COLLECTION_STEPS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                    <select
                      value={articleFilterDrop}
                      onChange={(e) => setArticleFilterDrop(e.target.value)}
                      className="border-border-default h-8 rounded-lg border bg-white px-2 text-[11px]"
                    >
                      <option value="">Все дропы</option>
                      {JOOR_DELIVERY_WINDOWS.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.label.replace(/^Drop \d+: /, '')}
                        </option>
                      ))}
                    </select>
                    <select
                      value={articleSortBy}
                      onChange={(e) =>
                        setArticleSortBy(e.target.value as 'stage' | 'drop' | 'revenue')
                      }
                      className="border-border-default h-8 rounded-lg border bg-white px-2 text-[11px]"
                    >
                      <option value="stage">Сортировка: по этапу</option>
                      <option value="drop">Сортировка: по дропу</option>
                      <option value="revenue">Сортировка: по выручке</option>
                    </select>
                    <Button
                      variant={articleFocusNeedsAttention ? 'default' : 'outline'}
                      size="sm"
                      className="h-8 gap-1 text-[10px]"
                      onClick={() => setArticleFocusNeedsAttention((v) => !v)}
                    >
                      <AlertCircle className="h-3.5 w-3.5" /> Требуют внимания{' '}
                      {needsAttentionCount > 0 && `(${needsAttentionCount})`}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 text-[10px]"
                      onClick={exportArticlesCsv}
                    >
                      <Download className="h-3.5 w-3.5" /> Экспорт CSV
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-border-subtle text-text-secondary border-b text-[10px] font-bold uppercase tracking-widest">
                      <th className="pb-2 pr-4">Артикул</th>
                      <th className="pb-2 pr-4">Сезон</th>
                      <th className="min-w-[7rem] pb-2 pr-3">Производство</th>
                      <th className="pb-2 pr-3">Дроп</th>
                      <th className="pb-2 pr-4">Этап</th>
                      <th className="pb-2 pr-4">Прогноз</th>
                      <th className="pb-2 pr-2 text-center">Tech Pack</th>
                      <th className="pb-2 pr-2 text-center">Сэмплы</th>
                      <th className="pb-2 pr-2 text-center">PO</th>
                      <th className="pb-2 pr-2 text-center">QC</th>
                      <th className="pb-2 pr-2 text-center">Готово</th>
                      <th className="min-w-[7.5rem] pb-2">В цех</th>
                      <th className="pb-2">Ещё</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedArticles.map((art) => {
                      const step = COLLECTION_STEPS.find((s) => s.id === art.currentStageId);
                      const dropLabel = art.deliveryWindowId
                        ? (dropLabelById[art.deliveryWindowId] ?? art.deliveryWindowId)
                        : '—';
                      const ganttHref = `${ROUTES.brand.productionGantt}${collectionQuery}${collectionQuery ? '&' : '?'}sku=${encodeURIComponent(art.sku || art.id)}`;
                      const readyMadeHref = `${ROUTES.brand.productionReadyMade}${collectionQuery}${collectionQuery ? '&' : '?'}sku=${encodeURIComponent(art.sku || art.id)}`;
                      return (
                        <tr
                          key={art.id}
                          className="border-border-subtle hover:bg-bg-surface2/80 border-b transition-colors"
                        >
                          <td className="py-3 pr-4">
                            <span className="text-text-primary font-mono text-[11px] font-bold">
                              {art.sku}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="text-text-primary text-[11px] font-medium">
                              {art.season}
                            </span>
                          </td>
                          <td className="py-3 pr-3 align-top">
                            <span className="text-text-primary block max-w-[9rem] text-[10px] leading-snug">
                              {art.productionSiteLabel}
                            </span>
                          </td>
                          <td className="py-3 pr-3">
                            <span className="text-text-secondary text-[10px]">
                              {dropLabel.replace(/^Drop \d+: /, '')}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant="outline" className="border-border-default text-[9px]">
                              {step?.title ?? art.currentStageId}
                            </Badge>
                          </td>
                          <td className="text-text-primary py-3 pr-4 text-[11px]">
                            {art.forecastQty.toLocaleString('ru-RU')} шт ·{' '}
                            {(art.forecastRevenue / 1000).toFixed(0)}k ₽
                          </td>
                          <td className="py-3 pr-2 text-center">
                            {art.techPackDone ? (
                              <CheckCircle2 className="inline h-4 w-4 text-emerald-600" />
                            ) : (
                              <CircleDot className="inline h-4 w-4 text-amber-500" />
                            )}
                          </td>
                          <td className="py-3 pr-2 text-center">
                            {art.samplesDone ? (
                              <CheckCircle2 className="inline h-4 w-4 text-emerald-600" />
                            ) : (
                              <CircleDot className="inline h-4 w-4 text-amber-500" />
                            )}
                          </td>
                          <td className="py-3 pr-2 text-center">
                            {art.poDone ? (
                              <CheckCircle2 className="inline h-4 w-4 text-emerald-600" />
                            ) : (
                              <CircleDot className="inline h-4 w-4 text-amber-500" />
                            )}
                          </td>
                          <td className="py-3 pr-2 text-center">
                            {art.qcDone ? (
                              <CheckCircle2 className="inline h-4 w-4 text-emerald-600" />
                            ) : (
                              <CircleDot className="inline h-4 w-4 text-amber-500" />
                            )}
                          </td>
                          <td className="py-3 pr-2 text-center">
                            {art.ready ? (
                              <CheckCircle2 className="inline h-4 w-4 text-emerald-600" />
                            ) : (
                              <CircleDot className="text-text-muted inline h-4 w-4" />
                            )}
                          </td>
                          <td className="py-3 pr-2 align-middle">
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              className="bg-text-primary hover:bg-text-primary/90 h-7 px-2 text-[9px] font-black uppercase tracking-tight"
                              title="Открыть этапы и модули цеха только для этого артикула"
                              onClick={() => openArticleProductionHub(art.id)}
                            >
                              В цех · процесс
                            </Button>
                          </td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1">
                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-[9px]"
                                title="Tech Pack"
                              >
                                <Link
                                  href={`/brand/production/tech-pack/${art.sku || art.id}${collectionQuery}`}
                                >
                                  <FileText className="h-3 w-3" />
                                </Link>
                              </Button>
                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-[9px]"
                                title="Сэмплы"
                              >
                                <Link
                                  href={`${ROUTES.brand.productionGoldSample}${collectionQuery}&sku=${encodeURIComponent(art.sku || art.id)}`}
                                >
                                  <Package className="h-3 w-3" />
                                </Link>
                              </Button>
                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-[9px]"
                                title="PO"
                              >
                                <Link href={ganttHref}>
                                  <ClipboardCheck className="h-3 w-3" />
                                </Link>
                              </Button>
                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-[9px]"
                                title="Готовый товар"
                              >
                                <Link href={readyMadeHref}>
                                  <Truck className="h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {collectionArticles.length === 0 && (
                  <div className="text-text-secondary py-12 text-center text-sm">
                    Нет артикулов в текущей коллекции. Выберите сезон выше или добавьте артикулы из
                    раздела Продукты.
                    <Button variant="outline" size="sm" className="ml-2 mt-3" asChild>
                      <Link href={ROUTES.brand.products}>Перейти в Продукты</Link>
                    </Button>
                  </div>
                )}
                {collectionArticles.length > 0 && displayedArticles.length === 0 && (
                  <div className="text-text-secondary py-8 text-center text-sm">
                    По фильтрам ничего не найдено. Сбросьте поиск или «Требуют внимания».
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 mt-3"
                      onClick={() => {
                        setArticleSearch('');
                        setArticleFilterStage('');
                        setArticleFilterDrop('');
                        setArticleFocusNeedsAttention(false);
                      }}
                    >
                      Сбросить фильтры
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-tight">
                  Сводка по производству и риски по коллекции
                </CardTitle>
                <CardDescription className="text-xs">
                  QC, видео‑этапы и субподряд по текущей коллекции. Помогает увидеть, есть ли риски
                  по качеству, срокам и выполнению работ.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-[11px] md:grid-cols-3">
                <div className="border-border-subtle bg-bg-surface2/80 space-y-1 rounded-xl border p-3">
                  <p className="text-text-primary font-bold">QC инспекции</p>
                  <p className="text-text-secondary">
                    Всего: <strong>{qcSummary.total}</strong>
                  </p>
                  <p className="text-emerald-700">
                    Принято: <strong>{qcSummary.passed}</strong>
                  </p>
                  <p
                    className={qcSummary.withIssues > 0 ? 'text-amber-700' : 'text-text-secondary'}
                  >
                    С вопросами: <strong>{qcSummary.withIssues}</strong>
                  </p>
                </div>
                <div className="border-border-subtle bg-bg-surface2/80 space-y-1 rounded-xl border p-3">
                  <p className="text-text-primary font-bold">Видео‑этапы по PO</p>
                  <p className="text-text-secondary">
                    Этапов: <strong>{milestonesSummary.total}</strong>
                  </p>
                  <p className="text-emerald-700">
                    Утверждено: <strong>{milestonesSummary.approved}</strong>
                  </p>
                  <p
                    className={
                      milestonesSummary.pending > 0 ? 'text-amber-700' : 'text-text-secondary'
                    }
                  >
                    Ожидает: <strong>{milestonesSummary.pending}</strong>
                  </p>
                </div>
                <div className="border-border-subtle bg-bg-surface2/80 space-y-1 rounded-xl border p-3">
                  <p className="text-text-primary font-bold">Субподряд (заказы на сторону)</p>
                  <p className="text-text-secondary">
                    Всего: <strong>{subcontractSummary.total}</strong>
                  </p>
                  <p className="text-emerald-700">
                    Выполнено: <strong>{subcontractSummary.completed}</strong>
                  </p>
                  <p
                    className={
                      subcontractSummary.inProgress > 0 ? 'text-amber-700' : 'text-text-secondary'
                    }
                  >
                    В работе: <strong>{subcontractSummary.inProgress}</strong>
                  </p>
                </div>
                <div
                  className={cn(
                    'mt-1 flex items-center gap-2 rounded-xl border p-3 md:col-span-3',
                    hasRisks
                      ? 'border-amber-300 bg-amber-50'
                      : 'border-emerald-200 bg-emerald-50/80'
                  )}
                >
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      hasRisks ? 'bg-amber-500' : 'bg-emerald-500'
                    )}
                  />
                  <p className="text-text-primary text-[10px]">
                    {hasRisks
                      ? 'Есть риски по коллекции: проверьте инспекции QC, незавершённые видео‑этапы и сроки отмены PO по дропам.'
                      : 'Критических рисков по коллекции не выявлено: QC пройден, ключевые этапы подтверждены, дропы в пределах дедлайнов.'}
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="text-xs" asChild>
                <Link href={floorHref('ops')}>
                  Операции: PO, BOM, QC, аудит (вкладка «Операции»)
                </Link>
              </Button>
            </div>
            <RelatedModulesBlock
              links={getProductionLinks()}
              title="Производство: QC, видео-этапы, субподрядчики, готовый товар"
            />
          </TabsContent>

          <TabsContent value="supplies" className="mt-4">
            {tab === 'supplies' && (
              <Tabs
                value={suppliesSub}
                onValueChange={(v) => setSuppliesSub(v as 'vmi' | 'reservation')}
                className="w-full"
              >
                {/* cabinetSurface v1 */}
                <TabsList className={cn(cabinetSurface.tabsList, 'mb-2 flex-wrap')}>
                  <TabsTrigger value="vmi" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
                    Запасы (VMI)
                  </TabsTrigger>
                  <TabsTrigger
                    value="reservation"
                    className={cn(cabinetSurface.tabsTrigger, 'h-7')}
                  >
                    Бронирование
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="vmi" className="mt-0">
                  {suppliesSub === 'vmi' && <VmiContent />}
                </TabsContent>
                <TabsContent value="reservation" className="mt-0">
                  {suppliesSub === 'reservation' && <MaterialReservationContent />}
                </TabsContent>
              </Tabs>
            )}
          </TabsContent>

          <TabsContent value="sample" className="mt-4">
            {tab === 'sample' && (
              <Tabs
                value={sampleSub}
                onValueChange={(v) => setSampleSub(v as 'gold' | 'fit')}
                className="w-full"
              >
                {/* cabinetSurface v1 */}
                <TabsList className={cn(cabinetSurface.tabsList, 'mb-2 flex-wrap')}>
                  <TabsTrigger value="gold" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
                    Утверждение эталона
                  </TabsTrigger>
                  <TabsTrigger value="fit" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
                    Fit comments
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="gold" className="mt-0">
                  {sampleSub === 'gold' && <GoldSampleContent />}
                </TabsContent>
                <TabsContent value="fit" className="mt-0">
                  {sampleSub === 'fit' && <FitCommentsContent />}
                </TabsContent>
              </Tabs>
            )}
          </TabsContent>

          <TabsContent value="plan" className="mt-4">
            {tab === 'plan' && <GanttContent />}
          </TabsContent>

          <TabsContent value="nesting" className="mt-4">
            {tab === 'nesting' && <NestingContent />}
          </TabsContent>

          <TabsContent value="launch" className="mt-4">
            {tab === 'launch' && (
              <Tabs
                value={launchSub}
                onValueChange={(v) => setLaunchSub(v as 'daily' | 'skills' | 'video' | 'sub')}
                className="w-full"
              >
                {/* cabinetSurface v1 */}
                <TabsList className={cn(cabinetSurface.tabsList, 'mb-2 flex-wrap')}>
                  <TabsTrigger value="daily" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
                    Ежедневный выпуск
                  </TabsTrigger>
                  <TabsTrigger value="skills" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
                    Матрица навыков
                  </TabsTrigger>
                  <TabsTrigger value="video" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
                    Видеоэтапы
                  </TabsTrigger>
                  <TabsTrigger value="sub" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
                    Субподрядчики
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="daily" className="mt-0">
                  {launchSub === 'daily' && <DailyOutputContent />}
                </TabsContent>
                <TabsContent value="skills" className="mt-0">
                  {launchSub === 'skills' && <WorkerSkillsContent />}
                </TabsContent>
                <TabsContent value="video" className="mt-0">
                  {launchSub === 'video' && <MilestonesVideoContent />}
                </TabsContent>
                <TabsContent value="sub" className="mt-0">
                  {launchSub === 'sub' && <SubcontractorContent />}
                </TabsContent>
              </Tabs>
            )}
          </TabsContent>

          <TabsContent value="quality" className="mt-4">
            {tab === 'quality' && (
              <Tabs
                value={qualitySub}
                onValueChange={(v) => setQualitySub(v as 'mobile' | 'desk')}
                className="w-full"
              >
                {/* cabinetSurface v1 */}
                <TabsList className={cn(cabinetSurface.tabsList, 'mb-2 flex-wrap')}>
                  <TabsTrigger value="mobile" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
                    Мобильный ОТК
                  </TabsTrigger>
                  <TabsTrigger value="desk" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
                    Рабочее место QC
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="mobile" className="mt-0">
                  {qualitySub === 'mobile' && <QcAppContent />}
                </TabsContent>
                <TabsContent value="desk" className="mt-0">
                  {qualitySub === 'desk' && <QualityLiveContent />}
                </TabsContent>
              </Tabs>
            )}
          </TabsContent>

          <TabsContent value="receipt" className="mt-4">
            {tab === 'receipt' && <ReadyMadeContent />}
          </TabsContent>

          <TabsContent value="ops" className="mt-4">
            {tab === 'ops' && <ProductionLiveContent />}
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </RegistryPageShell>
  );
}
