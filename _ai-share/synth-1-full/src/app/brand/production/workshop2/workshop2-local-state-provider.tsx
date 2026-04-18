'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@/providers/auth-provider';
import { initialOrderItems } from '@/lib/order-data';
import { getProductionDataPort } from '@/lib/production-data';
import { deriveStagesArticleFacets } from '@/lib/production/stages-tab-facets';
import { subscribeUnifiedSkuFlowSaved } from '@/lib/production/sku-flow-sync';
import {
  removeSkuFromUnifiedDoc,
  type CollectionSkuFlowDoc,
} from '@/lib/production/unified-sku-flow-store';
import { appendWorkshop2ArticleActivity } from '@/lib/production/workshop2-activity-log';
import {
  applyWorkshop2ArticleCommit,
  applyWorkshop2BulkNewArticles,
  archiveWorkshop2Collection,
  defaultWorkshop2ActiveIds,
  listWorkshop2ArticlePickerLines,
  LOCAL_COLLECTION_INVENTORY_STORAGE_KEY,
  loadLocalCollectionInventory,
  isWorkshop2InternalArticleCodeValid,
  mergeWorkshop2ActiveOrder,
  patchWorkshop2ArticleLine,
  registerUserCollection,
  removeArticleFromInventory,
  restoreWorkshop2Collection,
  saveLocalCollectionInventory,
  setWorkshop2CollectionPinned,
  storageKeyForCollectionId,
  WORKSHOP2_SYSTEM_COLLECTION_ID,
  type ApplyWorkshop2ArticleResult,
  type LocalCollectionInventory,
  type LocalOrderLine,
  type UserCollectionRow,
  updateWorkshop2Ss27Meta,
  updateWorkshop2UserCollection,
  type Workshop2ArticleCommit,
  type Workshop2ArticleLinePatch,
  type Workshop2Ss27MetaPatch,
  type Workshop2UserCollectionUpdate,
} from '@/lib/production/local-collection-inventory';
import { normalizeWorkshopTzSignatoryBindings } from '@/lib/production/workshop2-tz-signatory-options';
import { getHandbookCategoryLeaves } from '@/lib/production/category-catalog';
import {
  emptyWorkshop2DossierPhase1,
  getWorkshop2Phase1Dossier,
  removeWorkshop2Phase1Dossier,
  setWorkshop2Phase1Dossier,
} from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  WORKSHOP2_COLLECTION_ID,
  workshop2MergedItemsForCollectionList,
} from '@/lib/production/workshop2-articles';
import {
  skuPipelineStepProgress,
  workshop2CollectionMetrics,
} from '@/lib/production/workshop2-collection-metrics';
import type {
  Workshop2ArticleRow,
  Workshop2CollectionListItem,
  Workshop2CollectionMetrics,
} from '@/components/brand/production/Workshop2TabContent';

/** Демо SS27: «Создана», пока нет строк с `createdInWorkshop2At` в этой подборке. */
const WORKSHOP2_SS27_CARD_META_CREATED = '2026-01-15T09:00:00.000Z';

function maxWorkshop2LineTimestamp(raw: unknown[]): string | undefined {
  let max = '';
  for (const item of raw) {
    const line = item as LocalOrderLine;
    for (const at of [line.createdInWorkshop2At, line.updatedInWorkshop2At]) {
      if (typeof at === 'string' && at > max) max = at;
    }
  }
  return max || undefined;
}

/** Дата и время для карточки: числовой месяц, без секунд, одна строка. */
function formatWorkshop2CardDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}.${mm}.${yyyy}, ${hh}:${min}`;
  } catch {
    return iso;
  }
}

function mapRawToArticleRows(raw: unknown[]): Workshop2ArticleRow[] {
  return raw.map((item, idx) => {
    const facets = deriveStagesArticleFacets(item as Record<string, unknown>, idx);
    const it = item as LocalOrderLine & { id?: string; sku?: string; name?: string };
    const origin =
      it.articleOrigin === 'new' || it.articleOrigin === 'base' ? it.articleOrigin : undefined;
    const atts = it.workshopAttachments?.length ?? 0;
    const com = it.workshopComment?.trim();
    let commentPreview: string | undefined;
    if (com) {
      commentPreview = com.length > 80 ? `${com.slice(0, 77)}…` : com;
    }
    const addedAt =
      typeof it.createdInWorkshop2At === 'string' ? it.createdInWorkshop2At : undefined;
    const updatedAt =
      typeof it.updatedInWorkshop2At === 'string' ? it.updatedInWorkshop2At : undefined;
    const firstAtt = it.workshopAttachments?.[0]?.dataUrl;
    const articleThumbDataUrl =
      typeof firstAtt === 'string' && firstAtt.startsWith('data:') ? firstAtt : undefined;
    const catLeaf =
      typeof it.categoryLeafId === 'string' && it.categoryLeafId.trim()
        ? it.categoryLeafId.trim()
        : '';
    const wAtt = it.workshopAttachments;
    const attachments =
      Array.isArray(wAtt) && wAtt.length > 0
        ? wAtt
            .filter(
              (a): a is { name: string; dataUrl: string } =>
                typeof a === 'object' &&
                a !== null &&
                typeof (a as { name?: string }).name === 'string' &&
                typeof (a as { dataUrl?: string }).dataUrl === 'string'
            )
            .map((a) => ({ name: a.name, dataUrl: a.dataUrl }))
        : undefined;
    const intCode = isWorkshop2InternalArticleCodeValid(it.internalArticleCode)
      ? it.internalArticleCode
      : undefined;
    const createdByLine =
      typeof it.createdInWorkshop2By === 'string' && it.createdInWorkshop2By.trim()
        ? it.createdInWorkshop2By.trim()
        : undefined;
    const tzRow = normalizeWorkshopTzSignatoryBindings(it.workshopTzSignatoryBindings);
    return {
      id: String(it.id ?? `idx-${idx}`),
      ...(intCode ? { internalArticleCode: intCode } : {}),
      sku: String(it.sku ?? it.id ?? idx),
      name: String(it.name ?? ''),
      audienceLabel: facets.audienceLabel,
      categoryL1: facets.categoryL1,
      categoryL2: facets.categoryL2,
      categoryL3: facets.categoryL3,
      season: facets.season,
      articleOrigin: origin,
      attachmentCount: atts > 0 ? atts : undefined,
      commentPreview,
      workshopComment: com || undefined,
      addedAtIso: addedAt,
      updatedAtIso: updatedAt,
      articleThumbDataUrl,
      categoryLeafId: catLeaf || undefined,
      workshopAttachments: attachments,
      ...(tzRow ? { workshopTzSignatoryBindings: tzRow } : {}),
    };
  });
}

export type Workshop2LocalStateApi = {
  createdByLabel: string;
  storageStaleBanner: boolean;
  reloadInventoryAfterExternalChange: () => void;
  activeCollections: Workshop2CollectionListItem[];
  archivedCollections: Workshop2CollectionListItem[];
  metricsByCollectionId: Record<string, Workshop2CollectionMetrics>;
  getArticlePipelineProgress: (
    collectionId: string,
    articleId: string
  ) => { done: number; total: number; pct: number };
  getSkuFlowDoc: (collectionId: string) => CollectionSkuFlowDoc;
  onCreateCollection: (
    rawId: string,
    displayName: string,
    opts: {
      description?: string;
      createdBy: string;
      coverDataUrl?: string;
      targetSeason?: string;
      targetChannel?: string;
      dropDeadlineIso?: string;
      teamNote?: string;
      panelAccentHex?: string;
    }
  ) => { id: string; name: string; createdAt: string; createdBy: string };
  onArchiveCollection: (collectionId: string) => void;
  onRestoreCollection: (collectionId: string) => void;
  onToggleCollectionPin: (collectionId: string, pinned: boolean) => void;
  getUserCollectionRow: (id: string) => UserCollectionRow | undefined;
  getCollectionCoverDataUrl: (id: string) => string | undefined;
  onUpdateUserCollection: (id: string, patch: Workshop2UserCollectionUpdate) => boolean;
  onUpdateSs27Meta: (patch: Workshop2Ss27MetaPatch) => boolean;
  articlePickerLines: LocalOrderLine[];
  onCommitWorkshop2Article: (collectionId: string, commit: Workshop2ArticleCommit) => boolean;
  onBulkAddWorkshop2Articles: (
    collectionId: string,
    rows: { sku: string; name?: string }[]
  ) => { added: number; skippedDuplicates: number };
  onRemoveWorkshop2Article: (collectionId: string, articleId: string) => void;
  onPatchWorkshop2ArticleLine: (
    collectionId: string,
    articleId: string,
    patch: Workshop2ArticleLinePatch
  ) => boolean;
  highlightArticleId: string | null;
};

const Workshop2LocalStateContext = createContext<Workshop2LocalStateApi | null>(null);

export function useWorkshop2LocalState(): Workshop2LocalStateApi {
  const v = useContext(Workshop2LocalStateContext);
  if (!v) {
    throw new Error(
      'useWorkshop2LocalState: оберните страницу в Workshop2LocalStateProvider (layout Цеха 2)'
    );
  }
  return v;
}

export function Workshop2LocalStateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const createdByLabel = user?.displayName?.trim() || user?.email?.trim() || 'Не авторизован';

  const [localInventory, setLocalInventory] = useState<LocalCollectionInventory>(() => ({
    v: 1,
    articlesByCollection: {},
    userCollections: [],
    archivedUserCollections: [],
    collectionCovers: {},
    archivedSystemCollectionIds: [],
  }));

  const [flowByCollection, setFlowByCollection] = useState<Record<string, CollectionSkuFlowDoc>>(
    {}
  );
  const [storageStaleBanner, setStorageStaleBanner] = useState(false);
  const [highlightArticleId, setHighlightArticleId] = useState<string | null>(null);

  useEffect(() => {
    setLocalInventory(loadLocalCollectionInventory());
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_COLLECTION_INVENTORY_STORAGE_KEY && e.newValue != null) {
        setStorageStaleBanner(true);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!highlightArticleId) return;
    const t = window.setTimeout(() => setHighlightArticleId(null), 2400);
    return () => window.clearTimeout(t);
  }, [highlightArticleId]);

  useEffect(() => {
    saveLocalCollectionInventory(localInventory);
  }, [localInventory]);

  const seedOrderLines = useMemo(() => initialOrderItems as unknown as LocalOrderLine[], []);

  const articlePickerLines = useMemo(
    () => listWorkshop2ArticlePickerLines(localInventory, seedOrderLines),
    [localInventory, seedOrderLines]
  );

  const activeCollectionList = useMemo((): Workshop2CollectionListItem[] => {
    const userSorted = [...localInventory.userCollections].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );
    const byId = new Map<string, Workshop2CollectionListItem>();
    const covers = localInventory.collectionCovers ?? {};
    const pins = localInventory.workshop2Pinned ?? {};
    const sysArchived = (localInventory.archivedSystemCollectionIds ?? []).includes(
      WORKSHOP2_SYSTEM_COLLECTION_ID
    );
    if (!sysArchived) {
      const ss27Raw = workshop2MergedItemsForCollectionList(
        WORKSHOP2_COLLECTION_ID,
        localInventory,
        initialOrderItems
      );
      const ss27Upd = maxWorkshop2LineTimestamp(ss27Raw);
      const ss27m = localInventory.workshop2Ss27Meta;
      byId.set(WORKSHOP2_COLLECTION_ID, {
        id: WORKSHOP2_COLLECTION_ID,
        displayName: ss27m?.displayName?.trim() || WORKSHOP2_COLLECTION_ID,
        articleRows: mapRawToArticleRows(ss27Raw),
        kind: 'ss27',
        coverDataUrl: covers[WORKSHOP2_COLLECTION_ID],
        cardTimestamps: {
          createdCaption: 'Создана',
          createdValue: formatWorkshop2CardDateTime(WORKSHOP2_SS27_CARD_META_CREATED),
          ...(ss27Upd
            ? {
                updatedCaption: 'Изменена',
                updatedValue: formatWorkshop2CardDateTime(ss27Upd),
              }
            : {}),
        },
        pinned: pins[WORKSHOP2_COLLECTION_ID] === true,
        panelAccentHex: ss27m?.panelAccentHex,
        description: ss27m?.description,
        teamNote: ss27m?.teamNote,
        targetSeason: ss27m?.targetSeason,
        targetChannel: ss27m?.targetChannel,
        dropDeadlineIso: ss27m?.dropDeadlineIso,
      });
    }
    for (const uc of userSorted) {
      const raw = workshop2MergedItemsForCollectionList(uc.id, localInventory, initialOrderItems);
      const hasUpd = uc.updatedAt && uc.updatedAt.localeCompare(uc.createdAt) > 0;
      byId.set(uc.id, {
        id: uc.id,
        displayName: uc.name,
        articleRows: mapRawToArticleRows(raw),
        kind: 'user',
        coverDataUrl: covers[uc.id],
        cardTimestamps: {
          createdCaption: 'Создана',
          createdValue: formatWorkshop2CardDateTime(uc.createdAt),
          ...(hasUpd && uc.updatedAt
            ? {
                updatedCaption: 'Изменена',
                updatedValue: formatWorkshop2CardDateTime(uc.updatedAt),
              }
            : {}),
        },
        pinned: pins[uc.id] === true,
        panelAccentHex: uc.panelAccentHex,
        description: uc.description,
        teamNote: uc.teamNote,
      });
    }
    const defaultIds = defaultWorkshop2ActiveIds(localInventory);
    const orderedIds = mergeWorkshop2ActiveOrder(localInventory, defaultIds);
    return orderedIds.map((id) => byId.get(id)).filter(Boolean) as Workshop2CollectionListItem[];
  }, [localInventory]);

  const archivedCollectionList = useMemo((): Workshop2CollectionListItem[] => {
    const covers = localInventory.collectionCovers ?? {};
    const arch = localInventory.archivedUserCollections ?? [];
    const sorted = [...arch].sort((a, b) => (b.archivedAt ?? '').localeCompare(a.archivedAt ?? ''));
    const out: Workshop2CollectionListItem[] = sorted.map((uc) => {
      const raw = workshop2MergedItemsForCollectionList(uc.id, localInventory, initialOrderItems);
      const hasUpd = uc.updatedAt && uc.updatedAt.localeCompare(uc.createdAt) > 0;
      return {
        id: uc.id,
        displayName: uc.name,
        articleRows: mapRawToArticleRows(raw),
        kind: 'user',
        coverDataUrl: covers[uc.id],
        cardTimestamps: {
          createdCaption: 'Создана',
          createdValue: formatWorkshop2CardDateTime(uc.createdAt),
          ...(hasUpd && uc.updatedAt
            ? {
                updatedCaption: 'Изменена',
                updatedValue: formatWorkshop2CardDateTime(uc.updatedAt),
              }
            : {}),
        },
        pinned: false,
        panelAccentHex: uc.panelAccentHex,
        description: uc.description,
        teamNote: uc.teamNote,
      };
    });
    if (
      (localInventory.archivedSystemCollectionIds ?? []).includes(WORKSHOP2_SYSTEM_COLLECTION_ID)
    ) {
      const ss27Raw = workshop2MergedItemsForCollectionList(
        WORKSHOP2_COLLECTION_ID,
        localInventory,
        initialOrderItems
      );
      const ss27Upd = maxWorkshop2LineTimestamp(ss27Raw);
      const ss27m = localInventory.workshop2Ss27Meta;
      out.unshift({
        id: WORKSHOP2_COLLECTION_ID,
        displayName: ss27m?.displayName?.trim() || WORKSHOP2_COLLECTION_ID,
        articleRows: mapRawToArticleRows(ss27Raw),
        kind: 'ss27',
        coverDataUrl: covers[WORKSHOP2_COLLECTION_ID],
        cardTimestamps: {
          createdCaption: 'Создана',
          createdValue: formatWorkshop2CardDateTime(WORKSHOP2_SS27_CARD_META_CREATED),
          ...(ss27Upd
            ? {
                updatedCaption: 'Изменена',
                updatedValue: formatWorkshop2CardDateTime(ss27Upd),
              }
            : {}),
        },
        pinned: false,
        panelAccentHex: ss27m?.panelAccentHex,
        description: ss27m?.description,
        teamNote: ss27m?.teamNote,
        targetSeason: ss27m?.targetSeason,
        targetChannel: ss27m?.targetChannel,
        dropDeadlineIso: ss27m?.dropDeadlineIso,
      });
    }
    return out;
  }, [localInventory]);

  const allCollectionsForFlow = useMemo(
    () => [...activeCollectionList, ...archivedCollectionList],
    [activeCollectionList, archivedCollectionList]
  );

  const collectionIdsKey = useMemo(
    () => allCollectionsForFlow.map((c) => c.id).join('\0'),
    [allCollectionsForFlow]
  );

  useEffect(() => {
    let cancelled = false;
    const ids = collectionIdsKey ? collectionIdsKey.split('\0') : [];
    if (ids.length === 0) return;
    void Promise.all(
      ids.map(async (id) => {
        const doc = await getProductionDataPort().getSkuFlow(id);
        return [id, doc] as const;
      })
    ).then((entries) => {
      if (cancelled) return;
      setFlowByCollection((prev) => {
        const next = { ...prev };
        for (const [id, doc] of entries) next[id] = doc;
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [collectionIdsKey]);

  useEffect(() => {
    return subscribeUnifiedSkuFlowSaved(({ collectionKey }) => {
      void getProductionDataPort()
        .getSkuFlow(collectionKey)
        .then((doc) => {
          setFlowByCollection((prev) => ({ ...prev, [collectionKey]: doc }));
        });
    });
  }, []);

  const emptyDoc = useMemo(() => ({ v: 1 as const, skus: {} }), []);

  const metricsByCollectionId = useMemo(() => {
    const out: Record<string, Workshop2CollectionMetrics> = {};
    for (const col of allCollectionsForFlow) {
      const doc = flowByCollection[col.id] ?? emptyDoc;
      out[col.id] = workshop2CollectionMetrics(
        doc,
        col.articleRows.map((r) => r.id)
      );
    }
    return out;
  }, [allCollectionsForFlow, flowByCollection, emptyDoc]);

  const getArticlePipelineProgress = useCallback(
    (collectionId: string, articleId: string) => {
      const doc = flowByCollection[collectionId] ?? emptyDoc;
      return skuPipelineStepProgress(doc, articleId);
    },
    [flowByCollection, emptyDoc]
  );

  const handleCreate = useCallback(
    (
      rawId: string,
      displayName: string,
      opts: {
        description?: string;
        createdBy: string;
        coverDataUrl?: string;
        targetSeason?: string;
        targetChannel?: string;
        dropDeadlineIso?: string;
        teamNote?: string;
        panelAccentHex?: string;
      }
    ) => {
      let meta!: { id: string; name: string; createdAt: string; createdBy: string };
      setLocalInventory((prev) => {
        const { inventory, id } = registerUserCollection(prev, rawId, displayName, {
          description: opts.description,
          createdBy: opts.createdBy,
          coverDataUrl: opts.coverDataUrl,
          targetSeason: opts.targetSeason,
          targetChannel: opts.targetChannel,
          dropDeadlineIso: opts.dropDeadlineIso,
          teamNote: opts.teamNote,
          panelAccentHex: opts.panelAccentHex,
        });
        const row = inventory.userCollections.find((c) => c.id === id);
        meta = {
          id,
          name: row?.name ?? displayName,
          createdAt: row?.createdAt ?? new Date().toISOString(),
          createdBy: opts.createdBy,
        };
        return inventory;
      });
      return meta;
    },
    []
  );

  const handleBulkWorkshop2Articles = useCallback(
    (collectionId: string, rows: { sku: string; name?: string }[]) => {
      const leaf = getHandbookCategoryLeaves()[0]?.leafId ?? 'catalog-apparel-g0-l0';
      let stats = { added: 0, skippedDuplicates: 0 };
      setLocalInventory((prev) => {
        const r = applyWorkshop2BulkNewArticles(prev, collectionId, rows, leaf, createdByLabel);
        stats = { added: r.added, skippedDuplicates: r.skippedDuplicates };
        return r.inventory;
      });
      return stats;
    },
    [createdByLabel]
  );

  const handleArchive = useCallback((collectionId: string) => {
    setLocalInventory((prev) => {
      const next = archiveWorkshop2Collection(prev, collectionId);
      return next ?? prev;
    });
  }, []);

  const handleRestore = useCallback((collectionId: string) => {
    setLocalInventory((prev) => {
      const next = restoreWorkshop2Collection(prev, collectionId);
      return next ?? prev;
    });
  }, []);

  const handleToggleCollectionPin = useCallback((collectionId: string, pinned: boolean) => {
    setLocalInventory((prev) => setWorkshop2CollectionPinned(prev, collectionId, pinned));
  }, []);

  const getUserCollectionRow = useCallback(
    (id: string): UserCollectionRow | undefined =>
      localInventory.userCollections.find((c) => c.id === id) ??
      localInventory.archivedUserCollections?.find((c) => c.id === id),
    [localInventory]
  );

  const getCollectionCoverDataUrl = useCallback(
    (id: string) => localInventory.collectionCovers?.[id],
    [localInventory]
  );

  const handleUpdateUserCollection = useCallback(
    (collectionId: string, patch: Workshop2UserCollectionUpdate) => {
      let ok = false;
      setLocalInventory((prev) => {
        const next = updateWorkshop2UserCollection(prev, collectionId, patch);
        if (next) ok = true;
        return next ?? prev;
      });
      return ok;
    },
    []
  );

  const handleUpdateSs27Meta = useCallback((patch: Workshop2Ss27MetaPatch) => {
    setLocalInventory((prev) => updateWorkshop2Ss27Meta(prev, patch));
    return true;
  }, []);

  const getSkuFlowDoc = useCallback(
    (collectionId: string) => flowByCollection[collectionId] ?? emptyDoc,
    [flowByCollection, emptyDoc]
  );

  const handleArticleCommit = useCallback(
    (collectionId: string, commit: Workshop2ArticleCommit): boolean => {
      let applied: ApplyWorkshop2ArticleResult | undefined;
      setLocalInventory((prev) => {
        const r = applyWorkshop2ArticleCommit(prev, collectionId, commit, createdByLabel);
        applied = r;
        return r.ok ? r.inventory : prev;
      });
      if (applied?.ok) {
        const newArticleId = applied.newArticleId;
        setHighlightArticleId(newArticleId);
        const key = storageKeyForCollectionId(collectionId);
        const list = applied.inventory.articlesByCollection[key] ?? [];
        const line = list.find((l) => l.id === newArticleId) as LocalOrderLine | undefined;
        const nb = normalizeWorkshopTzSignatoryBindings(line?.workshopTzSignatoryBindings);
        if (nb) {
          const existing = getWorkshop2Phase1Dossier(collectionId, newArticleId);
          const base = existing ?? emptyWorkshop2DossierPhase1();
          setWorkshop2Phase1Dossier(collectionId, newArticleId, {
            ...base,
            tzSignatoryBindings: nb,
          });
        }
        return true;
      }
      return false;
    },
    [createdByLabel]
  );

  const handlePatchWorkshop2ArticleLine = useCallback(
    (collectionId: string, articleId: string, patch: Workshop2ArticleLinePatch): boolean => {
      let ok = false;
      setLocalInventory((prev) => {
        const next = patchWorkshop2ArticleLine(prev, collectionId, articleId, patch);
        if (next) ok = true;
        return next ?? prev;
      });
      if (ok) {
        appendWorkshop2ArticleActivity(
          collectionId,
          articleId,
          'Изменены данные артикула в составе коллекции (локальный инвентарь Цеха 2)',
          createdByLabel
        );
      }
      return ok;
    },
    [createdByLabel]
  );

  const handleRemoveWorkshop2Article = useCallback(
    (collectionId: string, articleId: string) => {
      removeWorkshop2Phase1Dossier(collectionId, articleId);
      const key = storageKeyForCollectionId(collectionId);
      setLocalInventory((prev) => removeArticleFromInventory(prev, key, articleId, collectionId));
      setFlowByCollection((prev) => {
        const doc = prev[collectionId] ?? emptyDoc;
        const next = removeSkuFromUnifiedDoc(doc, articleId);
        if (next !== doc) {
          queueMicrotask(() => {
            void getProductionDataPort().saveSkuFlow(collectionId, next);
          });
        }
        return { ...prev, [collectionId]: next };
      });
    },
    [emptyDoc]
  );

  const reloadInventoryAfterExternalChange = useCallback(() => {
    setLocalInventory(loadLocalCollectionInventory());
    setStorageStaleBanner(false);
  }, []);

  const value = useMemo(
    (): Workshop2LocalStateApi => ({
      createdByLabel,
      storageStaleBanner,
      reloadInventoryAfterExternalChange,
      activeCollections: activeCollectionList,
      archivedCollections: archivedCollectionList,
      metricsByCollectionId,
      getArticlePipelineProgress,
      getSkuFlowDoc,
      onCreateCollection: handleCreate,
      onArchiveCollection: handleArchive,
      onRestoreCollection: handleRestore,
      onToggleCollectionPin: handleToggleCollectionPin,
      getUserCollectionRow,
      getCollectionCoverDataUrl,
      onUpdateUserCollection: handleUpdateUserCollection,
      onUpdateSs27Meta: handleUpdateSs27Meta,
      articlePickerLines,
      onCommitWorkshop2Article: handleArticleCommit,
      onBulkAddWorkshop2Articles: handleBulkWorkshop2Articles,
      onRemoveWorkshop2Article: handleRemoveWorkshop2Article,
      onPatchWorkshop2ArticleLine: handlePatchWorkshop2ArticleLine,
      highlightArticleId,
    }),
    [
      createdByLabel,
      storageStaleBanner,
      reloadInventoryAfterExternalChange,
      activeCollectionList,
      archivedCollectionList,
      metricsByCollectionId,
      getArticlePipelineProgress,
      getSkuFlowDoc,
      handleCreate,
      handleArchive,
      handleRestore,
      handleToggleCollectionPin,
      getUserCollectionRow,
      getCollectionCoverDataUrl,
      handleUpdateUserCollection,
      handleUpdateSs27Meta,
      articlePickerLines,
      handleArticleCommit,
      handleBulkWorkshop2Articles,
      handleRemoveWorkshop2Article,
      handlePatchWorkshop2ArticleLine,
      highlightArticleId,
    ]
  );

  return (
    <Workshop2LocalStateContext.Provider value={value}>
      {children}
    </Workshop2LocalStateContext.Provider>
  );
}
