'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import type { CoreChainRoleId, CoreHubPillarId } from '@/lib/platform-core-hub-matrix';
import { PLATFORM_CORE_ROLE_EMPTY_PILLAR_RU } from '@/lib/platform-core-user-messages';
import {
  PLATFORM_CORE_PILLARS,
  getDefaultPillarForRole,
  factoryMaterialsHrefForDemo,
  getRolePillarWorkspaceHref,
  getPlatformCoreHubRow,
  getPlatformCorePillarEntityLabelForDemo,
  isCoreHubPillarId,
  resolvePlatformCoreCollectionId,
} from '@/lib/platform-core-hub-matrix';
import { PlatformCoreChromeShell } from '@/components/platform/PlatformCoreChromeShell';
import { PlatformCoreContextBar } from '@/components/platform/PlatformCoreContextBar';
import { PlatformCoreRoleCabinetStrip } from '@/components/platform/PlatformCoreRoleCabinetStrip';
import {
  usePlatformCoreChainOverview,
  usePlatformCoreDemoContext,
} from '@/components/platform/usePlatformCoreChainOverview';
import { cn } from '@/lib/utils';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import {
  getRoleCabinetNavPillarIds,
  isEmptyCellInsightVisibleInUi,
  isEmptyCellInsightVisibleInCabinetHub,
  isRolePillarCabinetSelectable,
} from '@/lib/platform-core-empty-cell-registry';
import { prefetchPlatformCoreW2FromHref } from '@/lib/platform-core-w2-prefetch';
import { prefetchPillarSnapshot } from '@/lib/platform-core-pillar-prefetch';
import { RoleCabinetHubHeader } from '@/components/platform/RoleCabinetHubChrome';
import { PlatformCoreCabinetPillarCards } from '@/components/platform/PlatformCoreCabinetPillarCards';
import { RolePillarCrossRoleLinks } from '@/components/platform/RolePillarCrossRoleLinks';
import { hubCabinet, pillarInsight } from '@/lib/platform-core-cabinet-chrome';
import { hubSectionLabelClassName } from '@/lib/platform-core-hub-layout';

const DevelopmentPillarCard = dynamic(
  () =>
    import('@/components/platform/DevelopmentPillarCard').then((m) => ({
      default: m.DevelopmentPillarCard,
    })),
  { ssr: false }
);

const CollectionOrderPillarCard = dynamic(
  () =>
    import('@/components/platform/CollectionOrderPillarCard').then((m) => ({
      default: m.CollectionOrderPillarCard,
    })),
  { ssr: false }
);

const CommsPillarCard = dynamic(
  () =>
    import('@/components/platform/CommsPillarCard').then((m) => ({
      default: m.CommsPillarCard,
    })),
  { ssr: false }
);

const SupplierProcurementPillarCard = dynamic(
  () =>
    import('@/components/platform/SupplierProcurementPillarCard').then((m) => ({
      default: m.SupplierProcurementPillarCard,
    })),
  { ssr: false }
);

const PlatformCoreEmptyCellPanels = dynamic(
  () =>
    import('@/components/platform/PlatformCoreEmptyCellPanels').then((m) => ({
      default: m.PlatformCoreEmptyCellPanels,
    })),
  {
    ssr: false,
    loading: () => (
      <p className="text-text-muted text-sm" data-testid="role-pillar-empty-insight-loading">
        Загрузка контекста…
      </p>
    ),
  }
);

const BrandSampleCollectionMini = dynamic(
  () =>
    import('@/components/platform/BrandSampleCollectionMini').then((m) => ({
      default: m.BrandSampleCollectionMini,
    })),
  { ssr: false }
);

const ShopShowroomMini = dynamic(
  () =>
    import('@/components/platform/ShopShowroomMini').then((m) => ({
      default: m.ShopShowroomMini,
    })),
  { ssr: false }
);

const SupplierBomPreview = dynamic(
  () =>
    import('@/components/platform/SupplierBomPreview').then((m) => ({
      default: m.SupplierBomPreview,
    })),
  { ssr: false }
);
const SupplierDevCabinetSpinePeerStrip = dynamic(
  () =>
    import('@/components/factory/supplier/SupplierDevCabinetSpinePeerStrip').then((m) => ({
      default: m.SupplierDevCabinetSpinePeerStrip,
    })),
  { ssr: false }
);
const OrderProductionPillarCard = dynamic(
  () =>
    import('@/components/platform/OrderProductionPillarCard').then((m) => ({
      default: m.OrderProductionPillarCard,
    })),
  { ssr: false }
);

type Props = {
  roleId: CoreChainRoleId;
};

function RoleCoreCabinetHubInner({ roleId }: Props) {
  const row = getPlatformCoreHubRow(roleId);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const pillarFromUrl = searchParams.get('pillar');
  const pillarSelectedInUrl =
    Boolean(pillarFromUrl) && isCoreHubPillarId(pillarFromUrl as string);
  const collectionId = resolvePlatformCoreCollectionId(searchParams.get('collection'));
  const { pillarDone } = usePlatformCoreChainOverview(collectionId);
  const demo = usePlatformCoreDemoContext();
  const [selectedPillar, setSelectedPillar] = useState<CoreHubPillarId>(() => {
    if (pillarFromUrl && isCoreHubPillarId(pillarFromUrl)) return pillarFromUrl;
    return getDefaultPillarForRole(roleId);
  });

  useEffect(() => {
    const p = searchParams.get('pillar');
    const defaultPillar = getDefaultPillarForRole(roleId);
    if (p && isCoreHubPillarId(p) && isRolePillarCabinetSelectable(roleId, p, collectionId)) {
      setSelectedPillar(p);
      return;
    }
    if (p && isCoreHubPillarId(p) && !isRolePillarCabinetSelectable(roleId, p, collectionId)) {
      setSelectedPillar(defaultPillar);
      const params = new URLSearchParams(searchParams.toString());
      if (roleId === 'shop' && p === 'order_production') {
        params.set('pillar', 'collection_order');
      } else {
        params.set('pillar', defaultPillar);
      }
      if (searchParams.has('collection') || collectionId !== 'SS27') {
        params.set('collection', collectionId);
      }
      const hash =
        roleId === 'shop' && p === 'order_production' ? '#shop-co-buyer-tracking' : '';
      router.replace(`${pathname}?${params.toString()}${hash}`, { scroll: false });
      return;
    }
    if (!p) {
      setSelectedPillar((prev) =>
        isRolePillarCabinetSelectable(roleId, prev, collectionId) ? prev : defaultPillar
      );
    }
  }, [searchParams, roleId, collectionId, pathname, router]);

  useEffect(() => {
    if (!isEmptyCellInsightVisibleInUi(roleId, selectedPillar)) return;
    prefetchPillarSnapshot({
      collectionId,
      pillarId: selectedPillar,
      roleId,
      factoryId: demo.factoryId,
    });
  }, [roleId, selectedPillar, collectionId, demo.factoryId]);

  function selectPillar(pillarId: CoreHubPillarId) {
    setSelectedPillar(pillarId);
    const params = new URLSearchParams(searchParams.toString());
    params.set('pillar', pillarId);
    if (searchParams.has('collection') || collectionId !== 'SS27') {
      params.set('collection', collectionId);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (!row) return null;

  const cell = row.pillars[selectedPillar];
  const navPillarIds = getRoleCabinetNavPillarIds(roleId, collectionId);
  const workspaceHref = getRolePillarWorkspaceHref(roleId, selectedPillar, demo);
  const pillarMeta = PLATFORM_CORE_PILLARS.find((p) => p.id === selectedPillar);
  const pillarLead =
    cell.kind === 'active'
      ? cell.lead.split(/[.!]/)[0]?.trim() + (cell.lead.includes('.') ? '.' : '')
      : '';

  function renderPillarAsideButtons() {
    return PLATFORM_CORE_PILLARS.filter((pillar) => navPillarIds.includes(pillar.id)).map(
      (pillar) => {
        const isActive = selectedPillar === pillar.id;
        const pillarCell = row.pillars[pillar.id];
        const isPeerContext =
          pillarCell.kind === 'empty' && isEmptyCellInsightVisibleInUi(roleId, pillar.id);
        return (
          <button
            key={pillar.id}
            type="button"
            data-testid={`role-pillar-${pillar.id}`}
            onClick={() => selectPillar(pillar.id)}
            onMouseEnter={() =>
              prefetchPillarSnapshot({
                collectionId,
                pillarId: pillar.id,
                roleId,
                factoryId: demo.factoryId,
              })
            }
            onFocus={() =>
              prefetchPillarSnapshot({
                collectionId,
                pillarId: pillar.id,
                roleId,
                factoryId: demo.factoryId,
              })
            }
            className={isActive ? hubCabinet.pillarBtnActive : hubCabinet.pillarBtnIdle}
          >
            <span className="flex items-center justify-between gap-2">
              <span className={hubCabinet.pillarBtnTitle}>{pillar.title}</span>
              {isPeerContext ? (
                <span
                  className="text-text-muted text-[9px] font-medium uppercase tracking-wide"
                  data-testid={`role-pillar-${pillar.id}-peer-badge`}
                >
                  контекст
                </span>
              ) : pillarDone(pillar.id) != null ? (
                pillarDone(pillar.id) ? (
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" aria-hidden />
                ) : (
                  <Circle className="text-text-muted h-3 w-3 shrink-0" aria-hidden />
                )
              ) : null}
            </span>
          </button>
        );
      }
    );
  }

  return (
    <div
      data-testid={`role-core-cabinet-${roleId}`}
      className={cn(
        hubCabinet.page,
        isPlatformCoreMode() && 'bg-bg-surface pb-safe min-h-[calc(100vh-2.5rem)]',
        !isPlatformCoreMode() && 'mx-auto max-w-6xl px-4 py-8 md:px-6'
      )}
    >
      <header className="space-y-2 md:space-y-3">
        <PlatformCoreContextBar
          roleId={roleId}
          pillarId={selectedPillar}
          entityLabel={getPlatformCorePillarEntityLabelForDemo(selectedPillar, demo)}
          showDemoIdStrip={false}
        />
        {isPlatformCoreMode() ? (
          <RoleCabinetHubHeader roleId={roleId} collectionId={collectionId} />
        ) : null}
        {!isPlatformCoreMode() ? (
          <div className="flex flex-wrap items-center justify-end gap-3">
            <PlatformCoreRoleCabinetStrip highlightRole={roleId} />
          </div>
        ) : null}
      </header>

      {isPlatformCoreMode() && !pillarSelectedInUrl ? (
        <PlatformCoreCabinetPillarCards
          pillarIds={navPillarIds}
          selectedPillarId={selectedPillar}
          onSelect={selectPillar}
        />
      ) : null}

      <div className={cn(hubCabinet.layout, isPlatformCoreMode() && 'flex-col md:flex-col')}>
        <aside
          data-testid="role-core-pillar-nav"
          className={cn(hubCabinet.pillarNav, isPlatformCoreMode() ? 'hidden' : undefined)}
        >
          <p className={hubCabinet.pillarNavLabel}>Столпы</p>
          <nav aria-label="Разделы столпов" className="flex flex-col gap-0.5">
            {renderPillarAsideButtons()}
          </nav>
          {roleId === 'supplier' ? (
            <div className="border-border-subtle mt-2 border-t px-2 pt-2">
              <Link
                href={factoryMaterialsHrefForDemo(demo)}
                data-testid="supplier-core-material-catalog-nav"
                className="text-text-secondary hover:text-text-primary hover:bg-bg-surface2 flex w-full min-h-11 items-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold transition-colors"
                onMouseEnter={() =>
                  prefetchPlatformCoreW2FromHref(factoryMaterialsHrefForDemo(demo))
                }
              >
                Каталог материалов
                <ArrowRight className="size-3 opacity-60" aria-hidden />
              </Link>
            </div>
          ) : null}
        </aside>

        {(!isPlatformCoreMode() || pillarSelectedInUrl) && (
        <main
          data-testid="role-core-pillar-panel"
          className={cn(hubCabinet.pillarPanel, isPlatformCoreMode() && 'w-full max-w-none')}
        >
          {cell.kind === 'empty' ? (
            <div className="min-w-0 space-y-4" data-testid="role-pillar-empty-participant">
              {isEmptyCellInsightVisibleInCabinetHub(roleId, selectedPillar) ? (
                <PlatformCoreEmptyCellPanels
                  roleId={roleId}
                  pillarId={selectedPillar}
                  demo={demo}
                  embedCrossRole
                />
              ) : (
                <>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {PLATFORM_CORE_ROLE_EMPTY_PILLAR_RU}
                  </p>
                  <RolePillarCrossRoleLinks
                    roleId={roleId}
                    pillarId={selectedPillar}
                    variant="compact"
                  />
                </>
              )}
            </div>
          ) : (
            <div
              key={selectedPillar}
              className={cn(
                isPlatformCoreMode() ? 'space-y-3' : 'space-y-3 md:space-y-4',
                hubCabinet.pillarPanelEnter
              )}
            >
              {isPlatformCoreMode() ? (
                <>
                  <div className="space-y-1">
                    <p className={hubSectionLabelClassName()}>{pillarMeta?.title ?? cell.title}</p>
                    {pillarMeta?.subtitle ? (
                      <p className="text-text-secondary text-[11px] leading-snug md:text-xs">
                        {pillarMeta.subtitle}
                      </p>
                    ) : null}
                    {pillarLead ? (
                      <p className="text-text-secondary pt-0.5 text-xs leading-relaxed">{pillarLead}</p>
                    ) : null}
                  </div>
                  <Link
                    href={workspaceHref}
                    data-testid="role-pillar-primary-cta"
                    className={hubCabinet.primaryCta}
                    onMouseEnter={() => prefetchPlatformCoreW2FromHref(workspaceHref)}
                    onFocus={() => prefetchPlatformCoreW2FromHref(workspaceHref)}
                  >
                    Открыть рабочий экран
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <div className={pillarInsight.root}>
                    <RoleCorePillarInsightCards
                      roleId={roleId}
                      pillarId={selectedPillar}
                      compact
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className={hubCabinet.panelHeader}>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h2 className={hubCabinet.pillarTitle}>{cell.title}</h2>
                      {pillarLead ? (
                        <p className={hubCabinet.pillarLead}>{pillarLead || cell.lead}</p>
                      ) : null}
                    </div>
                    <Link
                      href={workspaceHref}
                      data-testid="role-pillar-primary-cta"
                      className={hubCabinet.primaryCta}
                      onMouseEnter={() => prefetchPlatformCoreW2FromHref(workspaceHref)}
                      onFocus={() => prefetchPlatformCoreW2FromHref(workspaceHref)}
                    >
                      Открыть рабочий экран
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                  <div className={hubCabinet.insightGrid}>
                    <RoleCorePillarInsightCards
                      roleId={roleId}
                      pillarId={selectedPillar}
                      compact
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </main>
        )}
      </div>
    </div>
  );
}

function RoleCoreCabinetHubWithCollection(props: Props) {
  const searchParams = useSearchParams();
  const collectionId = resolvePlatformCoreCollectionId(searchParams.get('collection'));
  return (
    <PlatformCoreChromeShell collectionId={collectionId}>
      <RoleCoreCabinetHubInner {...props} />
    </PlatformCoreChromeShell>
  );
}

export function RoleCoreCabinetHub(props: Props) {
  return <RoleCoreCabinetHubWithCollection {...props} />;
}

function RoleCorePillarInsightCards({
  roleId,
  pillarId,
  compact = false,
}: {
  roleId: CoreChainRoleId;
  pillarId: CoreHubPillarId;
  compact?: boolean;
}) {
  const demo = usePlatformCoreDemoContext();
  if (!isPlatformCoreMode()) return null;

  let card: ReactNode = null;

  if (roleId === 'brand' && pillarId === 'development') {
    card = <DevelopmentPillarCard variant="brand" compact={compact} />;
  } else if (roleId === 'brand' && pillarId === 'sample_collection') {
    card = <BrandSampleCollectionMini demo={demo} compact={compact} />;
  } else if (roleId === 'brand' && pillarId === 'collection_order') {
    card = <CollectionOrderPillarCard variant="brand" compact={compact} />;
  } else if (roleId === 'brand' && pillarId === 'order_production') {
    card = <OrderProductionPillarCard variant="brand" compact={compact} />;
  } else if (roleId === 'brand' && pillarId === 'comms') {
    card = <CommsPillarCard variant="brand" compact={compact} />;
  } else if (roleId === 'shop' && pillarId === 'collection_order') {
    card = <CollectionOrderPillarCard variant="shop" compact={compact} />;
  } else if (roleId === 'shop' && pillarId === 'sample_collection') {
    card = <ShopShowroomMini demo={demo} compact={compact} />;
  } else if (roleId === 'shop' && pillarId === 'comms') {
    card = <CommsPillarCard variant="shop" compact={compact} />;
  } else if (roleId === 'manufacturer' && pillarId === 'development') {
    card = <DevelopmentPillarCard variant="manufacturer" compact={compact} />;
  } else if (roleId === 'manufacturer' && pillarId === 'order_production') {
    card = <OrderProductionPillarCard variant="manufacturer" compact={compact} />;
  } else if (roleId === 'manufacturer' && pillarId === 'comms') {
    card = <CommsPillarCard variant="manufacturer" compact={compact} />;
  } else if (roleId === 'supplier' && pillarId === 'order_production') {
    card = <SupplierProcurementPillarCard compact={compact} />;
  } else if (roleId === 'supplier' && pillarId === 'comms') {
    card = <CommsPillarCard variant="supplier" compact={compact} />;
  } else if (roleId === 'supplier' && pillarId === 'development') {
    card = (
      <div className="space-y-2">
        <SupplierDevCabinetSpinePeerStrip
          collectionId={demo.collectionId}
          articleId={demo.demoArticleId}
          orderId={demo.demoOrderId}
        />
        <SupplierBomPreview demo={demo} compact />
      </div>
    );
  }

  if (!card) return null;

  return (
    <div data-testid={`role-pillar-insight-${roleId}-${pillarId}`} className={pillarInsight.root}>
      {card}
    </div>
  );
}

