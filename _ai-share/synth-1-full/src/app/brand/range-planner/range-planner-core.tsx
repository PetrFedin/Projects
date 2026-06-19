'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Sparkles } from 'lucide-react';
import { ROUTES, factoryProductionDossierHref } from '@/lib/routes';
import {
  WORKSHOP2_COL_PARAM,
  WORKSHOP2_CREATE_PARAM,
  WORKSHOP2_TIER_PARAM,
} from '@/lib/production/workshop2-url';
import { PlatformCoreDevelopmentChrome } from '@/components/platform/PlatformCoreDevelopmentChrome';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { hubCabinet } from '@/lib/platform-core-cabinet-chrome';
import { cn } from '@/lib/utils';
import { buildShopShowroomBuySession } from '@/lib/b2b/shop-showroom-buy';
import {
  brandLinesheetsHrefForDemo,
  brandShowroomHrefForDemo,
  getPlatformCoreCollectionLabel,
  getPlatformCoreDemo,
  PLATFORM_CORE_DEMO,
  resolvePageCollectionId,
} from '@/lib/platform-core-hub-matrix';
import { W2_WORKSPACE_SHORT } from '@/lib/platform-core-canonical-labels';
import { PLATFORM_CORE_RANGE_PLANNER_UNAVAILABLE_RU } from '@/lib/platform-core-user-messages';
import { RangePlannerQuickCreateButton } from '@/app/brand/range-planner/range-planner-quick-create';
import { RangePlannerTierPlanEdit } from '@/app/brand/range-planner/range-planner-tier-plan-edit';
import { RangePlannerTierAssignPanel } from '@/app/brand/range-planner/range-planner-tier-assign';
import { RangePlannerTierArticleBoard } from '@/app/brand/range-planner/range-planner-tier-article-board';
import { isPlatformCoreEmptyChainCollection } from '@/lib/platform-core-demo-context';
import type { RangePlannerTier } from '@/lib/production/workshop2-range-planner-bridge';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { usePlatformCoreDevelopmentStatusPoll } from '@/hooks/use-platform-core-development-status-poll';
import {
  parseDevelopmentStatusRangePlanner,
  rangePlannerPgDisclaimerRu,
  type RangePlannerPgSnapshot,
} from '@/lib/production/workshop2-range-planner-pg';

type DevelopmentStatusPayload = {
  articleCount?: number;
  rangePlanner?: RangePlannerPgSnapshot;
};

export function RangePlannerCorePage() {
  const searchParams = useSearchParams();
  const collectionId = resolvePageCollectionId({
    collection: searchParams.get('collection'),
    w2col: searchParams.get('w2col'),
    fallback: PLATFORM_CORE_DEMO.collectionId,
  });
  const [pgSnapshot, setPgSnapshot] = useState<RangePlannerPgSnapshot | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [reloadTick, setReloadTick] = useState(0);
  const bumpReload = useCallback(() => setReloadTick((n) => n + 1), []);
  const { tick: devPollTick } = usePlatformCoreDevelopmentStatusPoll(true, [collectionId]);
  const reloadNonce = reloadTick + devPollTick;

  useEffect(() => {
    let cancelled = false;
    setLoadState('loading');
    (async () => {
      try {
        const res = await fetch(
          `/api/workshop2/collections/${encodeURIComponent(collectionId)}/development-status`,
          { headers: buildWorkshop2ApiRequestHeaders(), cache: 'no-store' }
        );
        const json = (await res.json()) as { ok?: boolean; status?: DevelopmentStatusPayload };
        if (cancelled) return;
        if (json.ok && json.status) {
          setPgSnapshot(parseDevelopmentStatusRangePlanner(json.status, collectionId, res.ok));
          setLoadState('ready');
        } else {
          setPgSnapshot(parseDevelopmentStatusRangePlanner(null, collectionId, false));
          setLoadState('error');
        }
      } catch {
        if (!cancelled) {
          setPgSnapshot(parseDevelopmentStatusRangePlanner(null, collectionId, false));
          setLoadState('error');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [collectionId, reloadNonce]);

  const snapshot = pgSnapshot ?? parseDevelopmentStatusRangePlanner(null, collectionId, false);

  const tierSkuTotal =
    snapshot.tiers.reduce((sum, row) => sum + row.pgSkuCount, 0) + snapshot.unassignedSkuCount;
  const pgTiers = snapshot.tiers.filter((row) => row.budgetFromPg);
  const avgMarginPct =
    pgTiers.length > 0
      ? Math.round(pgTiers.reduce((sum, row) => sum + row.targetMargin, 0) / pgTiers.length)
      : null;
  const articleCountLabel =
    loadState === 'loading'
      ? 'Загрузка плана коллекции…'
      : snapshot.dataSource === 'mock'
        ? `План недоступен · ${getPlatformCoreCollectionLabel(collectionId)} (нужны живые данные)`
        : `${snapshot.articleCount} артикулов · ${tierSkuTotal} SKU по уровням`;

  const disclaimer = rangePlannerPgDisclaimerRu(snapshot);
  const demoCtx = getPlatformCoreDemo(collectionId);
  const showroomHref = brandShowroomHrefForDemo(demoCtx);
  const linesheetsHref = brandLinesheetsHrefForDemo(demoCtx);
  const w2HubHref = `${ROUTES.brand.productionWorkshop2}?${WORKSHOP2_COL_PARAM}=${encodeURIComponent(collectionId)}`;
  const factoryDossierHref = factoryProductionDossierHref(PLATFORM_CORE_DEMO.demoArticleId, {
    collectionId,
  });
  const dossierArticleHref = `${ROUTES.brand.productionWorkshop2}?${WORKSHOP2_COL_PARAM}=${encodeURIComponent(collectionId)}&article=${encodeURIComponent(PLATFORM_CORE_DEMO.demoArticleId)}`;
  const shopMonetization = buildShopShowroomBuySession({ collectionId });
  const emptyChain = isPlatformCoreEmptyChainCollection(collectionId);

  if (emptyChain) {
    return (
      <CabinetPageContent
        maxWidth="5xl"
        className="space-y-6 pb-16"
        data-testid="brand-dev-range-panel"
        data-audit-legacy="range-planner-core"
      >
        <PlatformCoreDevelopmentChrome collectionId={collectionId}>
          <h1 className="text-text-primary text-lg font-semibold tracking-tight">
            Планировщик ассортимента
          </h1>
          <Card
            className="border-amber-200/80 bg-amber-50/40"
            data-testid="range-planner-empty-chain-notice"
          >
            <CardHeader>
              <CardTitle className="text-sm">План недоступен для пустой цепочки</CardTitle>
              <CardDescription>
                Коллекция «{getPlatformCoreCollectionLabel(collectionId)}» без seed-данных — план
                ассортимента не строится. Откройте golden-коллекцию с живыми артикулами.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="sm" variant="outline" asChild>
                <Link
                  href={`${ROUTES.brand.rangePlanner}?collection=SS27`}
                  data-testid="range-planner-empty-chain-ss27-link"
                >
                  План SS27 →
                </Link>
              </Button>
            </CardContent>
          </Card>
        </PlatformCoreDevelopmentChrome>
      </CabinetPageContent>
    );
  }

  return (
    <CabinetPageContent
      maxWidth="5xl"
      className="space-y-6 pb-16"
      data-testid="brand-dev-range-panel"
      data-audit-legacy="range-planner-core"
    >
      <PlatformCoreDevelopmentChrome collectionId={collectionId}>
        <h1 className="text-text-primary text-lg font-semibold tracking-tight">
          Планировщик ассортимента
        </h1>
        <div className="flex flex-col gap-2 max-md:items-stretch md:flex-row md:flex-wrap md:items-center">
          {avgMarginPct != null && loadState === 'ready' ? (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-[11px] text-emerald-800"
              data-testid="range-planner-margin-summary"
            >
              Средняя маржа {avgMarginPct}% · из коллекции
            </Badge>
          ) : null}
          {snapshot.dataSource === 'pg' && loadState === 'ready' ? (
            <Badge
              variant="secondary"
              className="text-[11px] uppercase tracking-wide"
              data-testid="range-planner-core-pg-badge"
            >
              бюджеты и состав из коллекции
            </Badge>
          ) : snapshot.dataSource === 'partial' && loadState === 'ready' ? (
            <Badge
              variant="outline"
              className="text-[11px] uppercase tracking-wide"
              data-testid="range-planner-core-partial-badge"
            >
              состав из коллекции
            </Badge>
          ) : null}
          <p
            className="text-text-secondary text-sm font-medium tabular-nums"
            data-testid="range-planner-core-pg-article-count"
          >
            {articleCountLabel}
          </p>
        </div>
        {loadState === 'ready' && snapshot.dataSource !== 'mock' ? (
          <div
            className={hubGadget.goldenPath}
            data-testid="brand-dev-range-context-strip"
            data-audit-legacy="range-planner-cross-links"
          >
            <Link
              href={w2HubHref}
              data-testid="brand-dev-range-w2-hub-link"
              className={hubGadget.goldenLink}
            >
              W2 hub
            </Link>
            <span className={hubGadget.goldenSep} aria-hidden>
              ·
            </span>
            <Link
              href={dossierArticleHref}
              data-testid="brand-dev-range-dossier-link"
              className={hubGadget.goldenLink}
            >
              Досье артикула
            </Link>
            <span className={hubGadget.goldenSep} aria-hidden>
              ·
            </span>
            <Link
              href={factoryDossierHref}
              data-testid="brand-dev-range-factory-dossier-link"
              className={hubGadget.goldenLink}
            >
              Досье цеха →
            </Link>
            <span className={hubGadget.goldenSep} aria-hidden>
              ·
            </span>
            <Link
              href={showroomHref}
              data-testid="brand-dev-range-showroom-link"
              data-audit-legacy="range-planner-showroom-link"
              className={hubGadget.goldenLink}
            >
              Витрина →
            </Link>
            <span className={hubGadget.goldenSep} aria-hidden>
              ·
            </span>
            <Link
              href={linesheetsHref}
              data-testid="brand-dev-range-linesheets-link"
              data-audit-legacy="range-planner-linesheets-link"
              className={hubGadget.goldenLink}
            >
              Лайншиты →
            </Link>
            <span className={hubGadget.goldenSep} aria-hidden>
              ·
            </span>
            <Link
              href={shopMonetization.matrixHref}
              data-testid="brand-dev-range-shop-matrix-link"
              className={hubGadget.goldenLink}
            >
              Shop matrix →
            </Link>
            <span className={hubGadget.goldenSep} aria-hidden>
              ·
            </span>
            <Link
              href={shopMonetization.checkoutHref}
              data-testid="brand-dev-range-shop-checkout-link"
              className={hubGadget.goldenLink}
            >
              Checkout →
            </Link>
          </div>
        ) : null}

        {snapshot.dataSource === 'mock' ? (
          <div
            className="rounded-lg border border-sky-200 bg-sky-50/90 px-3 py-2 text-[12px] text-sky-950"
            role="status"
            data-testid="range-planner-core-demo-notice"
          >
            {disclaimer}
          </div>
        ) : null}

        {snapshot.dataSource === 'mock' ? (
          <Card className="border-border-default rounded-xl border bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">План ассортимента недоступен</CardTitle>
              <CardDescription>{PLATFORM_CORE_RANGE_PLANNER_UNAVAILABLE_RU}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            {snapshot.unassignedArticles.length > 0 ? (
              <RangePlannerTierAssignPanel
                collectionId={collectionId}
                articles={snapshot.unassignedArticles}
                onAssigned={bumpReload}
              />
            ) : null}
            {snapshot.budgetFromPg && snapshot.tiersFromPg ? (
              <RangePlannerTierArticleBoard
                collectionId={collectionId}
                tierArticles={snapshot.tierArticles}
                onMoved={bumpReload}
              />
            ) : null}
            <Card className="border-border-default rounded-xl border bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" /> План ассортимента по уровням
                </CardTitle>
                <CardDescription>
                  Бюджет и маржа по уровням — из данных коллекции; затем создание артикула в цехе
                  разработки.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    'grid gap-4 md:grid-cols-3',
                    'max-md:flex max-md:gap-3 max-md:overflow-x-auto max-md:snap-x max-md:overscroll-x-contain max-md:pb-1',
                    hubCabinet.workspaceTableScroll
                  )}
                  data-testid="brand-dev-range-tier-plan-grid"
                >
                  {snapshot.tiers.map((row) => (
                    <Card
                      key={row.id}
                      className={cn(
                        'border-border-default bg-bg-surface2/80 overflow-hidden rounded-xl border',
                        'max-md:min-w-[min(78vw,18rem)] max-md:snap-start max-md:shrink-0'
                      )}
                    >
                      <CardHeader className="pb-2">
                        <Badge
                          className="w-fit"
                          variant={
                            row.id === 'core'
                              ? 'default'
                              : row.id === 'trend'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {row.labelRu}
                        </Badge>
                        <CardTitle className="text-sm">{row.descRu}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Целевая маржа</span>
                          <span className="text-accent-primary font-black">
                            {row.budgetFromPg ? `${row.targetMargin}%` : '—'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Бюджет</span>
                          <span className="font-black tabular-nums">
                            {row.budgetFromPg ? `${row.budget.toLocaleString()} ₽` : '—'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">SKU (план)</span>
                          <span className="font-bold">
                            {row.budgetFromPg ? row.planSkuCount : '—'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">SKU в базе</span>
                          <span
                            className="font-bold tabular-nums"
                            data-testid={`range-planner-core-pg-tier-${row.id}`}
                          >
                            {row.pgSkuCount}
                          </span>
                        </div>
                        {row.budgetFromPg ? (
                          <Link
                            href={`${ROUTES.brand.productionWorkshop2}?${WORKSHOP2_COL_PARAM}=${encodeURIComponent(collectionId)}&${WORKSHOP2_TIER_PARAM}=${encodeURIComponent(row.id)}`}
                            data-testid={`range-planner-tier-w2-link-${row.id}`}
                            className="text-accent-primary text-xs font-medium hover:underline"
                          >
                            {row.pgSkuCount > 0
                              ? `${row.pgSkuCount} артикул(ов) в разработке →`
                              : 'Открыть в разработке →'}
                          </Link>
                        ) : null}
                        {row.budgetFromPg ? (
                          <>
                            <RangePlannerTierPlanEdit
                              collectionId={collectionId}
                              tierId={row.id as RangePlannerTier}
                              budget={row.budget}
                              targetMargin={row.targetMargin}
                              onSaved={bumpReload}
                            />
                            <RangePlannerQuickCreateButton
                              tier={row.id as RangePlannerTier}
                              label={row.labelRu}
                              budget={row.budget}
                              targetMargin={row.targetMargin}
                              collectionId={collectionId}
                            />
                          </>
                        ) : (
                          <p className="text-text-muted text-xs">
                            Бюджет и маржа появятся после загрузки метаданных коллекции.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Button size="sm" asChild>
          <Link
            href={`${ROUTES.brand.productionWorkshop2}?${WORKSHOP2_COL_PARAM}=${collectionId}&${WORKSHOP2_CREATE_PARAM}=1`}
            data-testid="brand-dev-range-create-sku-link"
          >
            <Sparkles className="mr-2 h-4 w-4" /> {W2_WORKSPACE_SHORT} · новый артикул
          </Link>
        </Button>
      </PlatformCoreDevelopmentChrome>
    </CabinetPageContent>
  );
}
