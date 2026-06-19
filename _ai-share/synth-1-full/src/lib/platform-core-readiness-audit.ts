import type { CoreChainRoleId, CoreHubPillarId } from '@/lib/platform-core-hub-matrix';
import {
  PLATFORM_CORE_HUB_ROWS,
  PLATFORM_CORE_PILLARS,
  getPlatformCoreDemo,
  getRolePillarWorkspaceHref,
  platformCoreRolePillarHref,
} from '@/lib/platform-core-hub-matrix';
import {
  averageSectionScores,
  buildEmptySectionSubItems,
  buildSectionSubItems,
  SECTION_AUDIT,
} from '@/lib/platform-core-readiness-sections';
import { isEmptyCellInsightVisibleInHubAudit } from '@/lib/platform-core-empty-cell-registry';

export {
  SECTION_AUDIT,
  EMPTY_SECTION_AUDIT,
  averageSectionScores,
  buildSectionSubItems,
  buildEmptySectionSubItems,
  getExpectedSectionCount,
  getExpectedEmptySectionCount,
} from '@/lib/platform-core-readiness-sections';

export type ReadinessSubItem = {
  id: string;
  label: string;
  order: number;
  staticScore: number;
  liveScore: number;
  href: string;
  /** Краткий аудит раздела: функционал, связи, инвест-привлекательность. */
  summary: string;
  good: string[];
  bad: string[];
  fix: string[];
};

export type ReadinessCell = {
  roleId: CoreChainRoleId;
  pillarId: CoreHubPillarId;
  active: boolean;
  emptyReason?: string;
  staticScore: number | null;
  liveScore: number | null;
  summary: string;
  good: string[];
  bad: string[];
  fix: string[];
  cabinetHref: string;
  workspaceHref: string;
  subItems: ReadinessSubItem[];
};

const ROLE_LABELS: Record<CoreChainRoleId, string> = {
  brand: 'Бренд',
  shop: 'Магазин',
  manufacturer: 'Производство',
  supplier: 'Поставщик',
};

type CellAuditEntry = Omit<
  ReadinessCell,
  'roleId' | 'pillarId' | 'cabinetHref' | 'workspaceHref' | 'subItems' | 'active' | 'emptyReason'
>;

/**
 * Ручной честный аудит готовности (не телеметрия).
 * Оценки по коду, E2E и UX — не авто-метрики и не wave-скоры.
 * Оценки только у active (14 ячеек); неактивные столпы — «—» без peer-insight. Ср. активных ~7.3 (аудит 2026-06-18, P0 nav/cart/sample-peer).
 */
const CELL_AUDIT: Partial<Record<CoreChainRoleId, Partial<Record<CoreHubPillarId, CellAuditEntry>>>> =
  {
  brand: {
    development: {
      staticScore: 7.8,
      liveScore: 7.8,
      summary:
        'W2 dossier · ТЗ · sample peer (W2/dossier цеха, не factory queue) · nav core с SS27.',
      good: [
        'Hub read-from-PG + auto-hydrate SS27/FW27',
        'Dossier hydrate/persist API-first в Platform Core golden',
        'Состав golden-коллекций не пишется в localStorage (PG-authoritative)',
        'Range Planner metadata SS27/FW27 + PG fallback',
        'FW27 dataSource pg при core:bootstrap (e2e core-06)',
        'FW27 tier core/trend/novelty по categoryLeafId (e2e core-06)',
        'UI dossier round-trip: general, BOM, construction, composition 1–4, fiber (e2e core-02)',
        'UI create article → router.push(newArticleId)',
        'Ссылка бренд W2 → досье цеха (platform-core-workspace-peer)',
        'SS27 range planner pg-badge (e2e core-02)',
        'Честные бейджи pg/partial на range-planner-core',
        'Без dual-source баннеров в core mode',
        'core-52 TZ export + composition label e2e',
        'core-53 PATCH margin core/trend/novelty + tier assign API',
        'core-53 investor-readiness + investor-brief page e2e',
        'core-53 investor brief PDF export (brief.pdf API)',
        'brand sample peer href — без dead-end factory #sample-queue (P0)',
        'Nav augment: w2col/range/linesheets/showroom + descriptions',
      ],
      bad: ['Push/SSE при смене статуса образца — poll 30s'],
      fix: ['SSE sample status для brand drawer'],
    },
    sample_collection: {
      staticScore: 7.5,
      liveScore: 7.5,
      summary: 'Лайншиты SS27/FW27 → publish → витрина → shop matrix.',
      good: [
        'Linesheets core + PDF из PG',
        'brand-linesheet-to-shop-matrix CTA',
        'brand-pillar-to-shop-matrix в кабинете',
        'brand-sample-collection-mini-matrix в кабинете',
        'E2E linesheets → matrix (core-02)',
        'Showroom PG + legacy tab guard',
        'core-38/52 mini matrix + checkout deep-link e2e',
        'Empty linesheet fallback copy (`brand-sc-linesheets-empty-copy`)',
      ],
      bad: ['PDF edge cases на пустой коллекции'],
      fix: [],
    },
    collection_order: {
      staticScore: 7.6,
      liveScore: 7.6,
      summary:
        'Реестр B2B PG; confirm → handoff; retailers; CollectionOrderPillarCard + SSE/poll.',
      good: [
        'isPlatformCorePgB2bOrder gate',
        'POST confirm-order до handoff',
        'Amend approve/reject panel',
        'CollectionOrderPillarCard в brand cabinet',
        'Список из API + динамический фильтр коллекций',
        'Brand B2B legacy guard',
        'pre-orders isPlatformCoreMode guard + PG panel',
        'pre-orders скрыт в brand nav core',
        'Hub matrix без legacy pre-orders в golden CTA',
      ],
      bad: [],
      fix: [],
    },
    order_production: {
      staticScore: 7.5,
      liveScore: 7.5,
      summary: 'Подтверждение → цех; handoff queue; materials BOM; dossier lock после handoff.',
      good: [
        'confirm-order + confirm-production-handoff (два шага)',
        'chain-status',
        'OrderProductionPillarCard в brand cabinet',
        'Handoff strip + cross-role на order detail',
        'Hub action «Досье» → brand W2 (не factory dossier)',
        'Handoff retry UX (brand-b2b-handoff-retry)',
        'dossierVersionAtHandoff + dossierDiff в chain-status',
        'brand-order-w2-dossier-diff-* на order detail',
        'b2bEditLock на dossier GET/PUT после handoff',
        'tzWriteDisabled в W2 editor при b2bEditLock',
      ],
      bad: [],
      fix: [],
    },
    comms: {
      staticScore: 7.2,
      liveScore: 7.2,
      summary: 'Сообщения + календарь; contextual threads; poll/SSE без notification center.',
      good: [
        'slimCore brand messages',
        'hasCommunicationsUrlContext',
        'CommunicationsArtifactPolicyStrip off при URL',
        'BrandMessagesRuWorkspaceBanner off при URL',
        'Remount MessagesPage при смене ?collection=',
        'calendar-events API targetChatId (core-01)',
        'Shop calendar: клик B2B-события → messages (core-02)',
        'Brand calendar: превью события + кнопка «Чат» в EventDialog',
        'Production-context banner → W2 hrefs в core',
        'ContextualChatThread SSE live badge + poll fallback (contextual-chat-sse-live-badge)',
      ],
      bad: [],
      fix: [],
    },
  },
  shop: {
    sample_collection: {
      staticScore: 7.4,
      liveScore: 7.4,
      summary: 'Витрина · коллекции брендов; flat nav без side-path; → matrix checkout.',
      good: [
        'Showroom published-articles',
        'PG partnerships API',
        'ShopShowroomMini в кабинете',
        'SHOWROOM_SHOP_LEAD без сторонних платформ',
        'Shop-specific empty state (не «кабинет бренда»)',
        'Hero preview из dossier',
        'shop-showroom-mini-partner-logo из PG',
        'core-06 SS27 hero + partners-link e2e',
        'core-38 EMPTY27 empty onboarding e2e',
        'core-52 eligible badge + matrix CTA on article card',
      ],
      bad: ['Cover hero: dossier может перекрыть partner PG'],
      fix: ['Бейдж fallback vs PG на partner row', 'UAT partners→showroom golden path'],
    },
    collection_order: {
      staticScore: 7.2,
      liveScore: 7.3,
      summary: 'Matrix → checkout → PG; cart persist cookie+PG (P0); резерв WMS — после handoff.',
      good: [
        'CoreWholesaleMatrix без сторонних платформ в core',
        'Matrix W2 PG + e2e create order',
        'Checkout sync → B2B-{timestamp}',
        'Orders list + detail core',
        'Честный бейдж резерва на checkout',
        'withShopB2bCoreLegacyGuard на side-paths',
        'CollectionOrderPillarCard в shop cabinet со steps',
        'Amend card + structured amend API',
        'core-15 clean PG checkout без B2B-DEMO pin',
        'core-43 checkout B2B-\\d+ в JSON export',
        'core-33/52 PG-primary native + INT operational orders',
        'Seed B2B shop2 (`B2B-DEMO-SHOP2-SS27`, db:seed:workshop2-b2b-demo-order + PLATFORM_CORE_PINNED_B2B_ORDER_IDS)',
        'SSE bump при allocated/reserve (`patchWorkshop2B2bOrderStatus` + tracking chains poll)',
        'Shop peer picker checkout (`shop-co-checkout-buyer-picker`)',
        'Cart hydrate + debounced upsert (workshop2-cart-bridge, P0)',
      ],
      bad: [
        'Shop UI не зеркалит PATCH operational status (API работает)',
        'Резерв WMS — после handoff, не при checkout (честный copy)',
      ],
      fix: ['Shop UI status mirror после brand PATCH'],
    },
    order_production: {
      staticScore: 7.1,
      liveScore: 7.1,
      summary: 'Трекинг read-only; chain-status SSE/poll; без push notification center.',
      good: [
        'PlatformCoreB2bOrderDetailFacts',
        'Tracking panel PG + list chrome',
        'Cross-role peer → заказ магазина (не brand handoff)',
        'last-updated на tracking row',
        'Бейдж резерва + poll chain-status (15с активная вкладка)',
        '5 этапов chain-status + бейдж «Материалы подтверждены»',
        'platform-core-tracking-reserve e2e (честный copy)',
        'SSE chain-status-stream + hub bump на handoff/materials/status patch',
        'CTA «Чат» на каждой строке трекинга',
        'core-15 clean PG tracking smoke',
      ],
      bad: [
        'Только просмотр — нет push-уведомлений при смене статуса',
        'Poll без WebSocket — не realtime; резерв зависит от WMS',
      ],
      fix: ['WebSocket вместо SSE при масштабировании'],
    },
    comms: {
      staticScore: 7.1,
      liveScore: 7.1,
      summary: 'Сообщения + календарь orders/logistics; нет notification center на hub.',
      good: [
        '/api/shop/messages/threads',
        'CommunicationsEntityContextBanner на b2b/calendar',
        'B2bOrderUrlContextBanner off в core',
        'Canonical calendar URL',
        'targetChatId + авто-переход в чат при клике (externalEventsOnly)',
        'Universal inbox: все PG-заказы в sidebar + placeholder без сообщений',
        'POST /api/messages/contextual создаёт тред с первого сообщения',
        'Один календарь: comms canonical + delivery-calendar redirect',
        'Calendar event materials_supplied (b2b-materials-*)',
        'B2bChainPhaseBadge на tracking list',
      ],
      bad: ['Tracking без link на calendar row'],
      fix: ['CTA календарь с tracking card'],
    },
  },
  manufacturer: {
    development: {
      staticScore: 7.6,
      liveScore: 7.6,
      summary: 'Досье read-only; sample queue (скрыт в core nav); handoff peer из brand.',
      good: [
        'Factory dossier API',
        'PlatformCoreDossierSampleQueueCard',
        'Dossier core chrome',
        'buildWorkshop2FinalTzExportContextFromDossier на portal',
        'hideBrandFactoryHub в hub actions',
        '#sample-queue hash-scroll + pillar development',
        'DevelopmentPillarCard mfr — только factory_samples step',
        'core-52 export SKU meta + print btn e2e',
      ],
      bad: ['Цех не меняет состав — только читает'],
      fix: [],
    },
    order_production: {
      staticScore: 7.6,
      liveScore: 7.6,
      summary: 'Handoff queue + PO bulk-ack; materials → supplier; без Gantt в core.',
      good: [
        'Handoff queue PG',
        'Production orders core',
        'E2E handoff',
        'manufacturer-golden-cta-handoff-queue',
        'OrderProductionPillarCard: production_po + materials_supplied',
        'CTA «Закупка · поставщик» в кабинете цеха',
        'E2E materials_supplied на pillar card после PATCH (core-02)',
        'bulk-acknowledge API + factory-handoff-bulk-acknowledge UI',
        'B2bChainPhaseBadge на строках handoff queue',
        'ERP POST после bulk ack (live_post или FACTORY-ACK journal)',
        'factory-handoff-erp badge + retry-erp в панели',
        'Bulk ERP retry для attention rows (bulk-retry-erp API + factory-handoff-bulk-erp-retry)',
      ],
      bad: ['ERP live_failed оставляет PO в error до ручного retry (auto-retry до 3× на queue poll)'],
      fix: [],
    },
    comms: {
      staticScore: 7.2,
      liveScore: 7.2,
      summary: 'Сообщения + календарь tasks/orders/production; slim inbox.',
      good: [
        'CommunicationsEntityContextBanner manufacturer',
        'slimCore factory messages',
        'E2E core-01 factory messages',
        'Dedupe factory banner при URL context',
        'Universal inbox: handoff queue → placeholder чаты (manufacturer)',
        'E2E core-02 factory messages inbox SS27',
        'core-14 factory messages dedupe e2e (order= → 0 banners)',
      ],
      bad: [],
      fix: [],
    },
  },
  supplier: {
    development: {
      staticScore: 7.2,
      liveScore: 7.2,
      summary: 'BOM из досье (peer); RFQ-free core → comms; nav 2 группы.',
      good: [
        'BOM из dossier API',
        'UoM в BOM preview',
        'listRfq пустой в Platform Core',
        'brand/suppliers → factory materials BOM redirect',
        'suppliers/rfq → supplier chat',
      ],
      bad: ['Нет единого каталога поставщика в core nav'],
      fix: ['Каталог материалов в кабинете поставщика'],
    },
    order_production: {
      staticScore: 7.3,
      liveScore: 7.3,
      summary: 'Материалы цеха + PATCH materials_supplied под PO manufacturer.',
      good: [
        'materials-procurement-view + PATCH material-request',
        'SupplierProcurementPillarCard progress + chain steps',
        'PO qty из PG queue',
        'E2E confirm PATCH (core-02)',
        'Кнопка confirm только при PO в очереди',
        'Шаг materials_supplied в chain-status (5 этапов)',
        'supplier-procurement-chain-steps в кабинете',
        'E2E materials_supplied на pillar card после PATCH (core-02)',
        'Чат бренду после PATCH material-request (core-02)',
        'PATCH idempotent + materials-procurement-idempotent-badge',
        'SSE chain-status push после materials confirm',
        'bulk-confirm API (все строки BOM одним POST)',
        'Multi-article wizard + confirmAllArticles',
      ],
      bad: ['Нет резерва склада — только заявка в PG'],
      fix: ['Inventory reserve'],
    },
    comms: {
      staticScore: 7.2,
      liveScore: 7.2,
      summary: 'Сообщения (?role=supplier) + календарь logistics; без RFQ inbox.',
      good: [
        '/factory/supplier → /factory/supplier/core',
        'Preserve hash/search на redirect',
        'CommunicationsEntityContextBanner supplier',
        'core-14 supplier messages dedupe e2e (order= → 0 banners)',
      ],
      bad: ['Очередь передачи без order на части tail hrefs'],
      fix: ['Push при смене chain-status'],
    },
  },
};

export function getPlatformCoreReadinessMatrix(
  collectionId: string,
  options?: { liveChain?: boolean }
): ReadinessCell[] {
  const live = options?.liveChain === true;
  const cells: ReadinessCell[] = [];

  for (const row of PLATFORM_CORE_HUB_ROWS) {
    for (const pillar of PLATFORM_CORE_PILLARS) {
      const hubCell = row.pillars[pillar.id];
      const audit = CELL_AUDIT[row.id]?.[pillar.id];
      const active = hubCell.kind === 'active';
      const emptyInsight = !active && isEmptyCellInsightVisibleInHubAudit(row.id, pillar.id);
      const demo = getPlatformCoreDemo(collectionId);
      const subItems = active
        ? buildSectionSubItems(row.id, pillar.id, collectionId)
        : emptyInsight
          ? buildEmptySectionSubItems(row.id, pillar.id, collectionId)
          : [];
      const sectionTemplates = SECTION_AUDIT[row.id]?.[pillar.id] ?? [];
      const visibleSubItems = subItems.filter((_, i) => !sectionTemplates[i]?.scoreAliasOf);
      const sectionLiveAvg = averageSectionScores(subItems, 'live', sectionTemplates);
      const sectionStaticAvg = averageSectionScores(subItems, 'static', sectionTemplates);
      const auditLive = audit?.liveScore ?? (emptyInsight ? 7.3 : 7);
      const auditStatic = audit?.staticScore ?? (emptyInsight ? 7.1 : 6);
      const honestLive =
        sectionLiveAvg != null ? Math.min(sectionLiveAvg, auditLive) : auditLive;
      const honestStatic =
        sectionStaticAvg != null ? Math.min(sectionStaticAvg, auditStatic) : auditStatic;

      const emptyReason = hubCell.kind === 'empty' ? hubCell.reason : undefined;
      const scored = active || emptyInsight;

      cells.push({
        roleId: row.id,
        pillarId: pillar.id,
        active,
        emptyReason,
        staticScore: scored ? honestStatic : null,
        liveScore: scored ? (live ? honestLive : honestStatic) : null,
        summary: active
          ? (audit?.summary ?? (hubCell.kind === 'active' ? hubCell.title : ''))
          : emptyInsight
            ? (subItems[0]?.summary ?? 'Peer-insight контекст')
            : (emptyReason ?? 'Роль не участвует в этом столпе'),
        good: active ? (audit?.good ?? (hubCell.kind === 'active' ? [hubCell.lead] : [])) : emptyInsight ? [subItems[0]?.label ?? 'peer-insight'] : [],
        bad: active ? (audit?.bad ?? []) : emptyInsight ? (subItems[0]?.bad ?? []) : [],
        fix: active ? (audit?.fix ?? []) : emptyInsight ? (subItems.flatMap((s) => s.fix) ?? []) : [],
        cabinetHref: platformCoreRolePillarHref(row.id, pillar.id),
        workspaceHref: active
          ? getRolePillarWorkspaceHref(row.id, pillar.id, demo)
          : platformCoreRolePillarHref(row.id, pillar.id),
        subItems: visibleSubItems,
      });
    }
  }

  return cells;
}

export function getReadinessCell(
  cells: ReadinessCell[],
  roleId: CoreChainRoleId,
  pillarId: CoreHubPillarId
): ReadinessCell | undefined {
  return cells.find((c) => c.roleId === roleId && c.pillarId === pillarId);
}

export type ReadinessScoreMode = 'static' | 'live';

export type ReadinessSummary = {
  mode: ReadinessScoreMode;
  scoredCellCount: number;
  activeScoredCount: number;
  allCellsAvg: number;
  activeCellsAvg: number;
  roleAverages: Record<
    CoreChainRoleId,
    { allAvg: number; activeAvg: number | null; activeCount: number }
  >;
};

function pickCellScore(cell: ReadinessCell, mode: ReadinessScoreMode): number | null {
  return mode === 'live' ? cell.liveScore : cell.staticScore;
}

function averageScores(
  cells: ReadinessCell[],
  mode: ReadinessScoreMode,
  predicate?: (cell: ReadinessCell) => boolean
): number | null {
  const subset = predicate ? cells.filter(predicate) : cells;
  const values = subset.map((c) => pickCellScore(c, mode)).filter((n): n is number => n != null);
  if (values.length === 0) return null;
  return values.reduce((s, n) => s + n, 0) / values.length;
}

/** Сводка из матрицы — единый источник для scorecard и hub. */
export function summarizePlatformCoreReadiness(
  cells: ReadinessCell[],
  mode: ReadinessScoreMode
): ReadinessSummary {
  const roleIds = PLATFORM_CORE_HUB_ROWS.map((r) => r.id);
  const roleAverages = {} as ReadinessSummary['roleAverages'];

  for (const roleId of roleIds) {
    const roleCells = cells.filter((c) => c.roleId === roleId);
    const activeCells = roleCells.filter((c) => c.active);
    roleAverages[roleId] = {
      allAvg: averageScores(roleCells, mode) ?? 0,
      activeAvg: averageScores(activeCells, mode),
      activeCount: activeCells.length,
    };
  }

  const allCellsAvg = averageScores(cells, mode) ?? 0;
  const activeCellsAvg = averageScores(cells, mode, (c) => c.active) ?? allCellsAvg;
  const scoredCellCount = cells.filter((c) => pickCellScore(c, mode) != null).length;
  const activeScoredCount = cells.filter(
    (c) => c.active && pickCellScore(c, mode) != null
  ).length;

  return {
    mode,
    scoredCellCount,
    activeScoredCount,
    allCellsAvg,
    activeCellsAvg,
    roleAverages,
  };
}

export function formatReadinessScore(n: number | null): string {
  if (n == null) return '—';
  return Number.isInteger(n) ? `${n}` : n.toFixed(1);
}

export function readinessScoreTone(score: number | null, live: boolean): string {
  if (score == null) return 'text-text-muted';
  if (!live) return 'text-text-secondary';
  if (score >= 8) return 'text-emerald-700';
  if (score >= 6) return 'text-amber-700';
  return 'text-rose-700';
}

export { ROLE_LABELS };
