'use client';

import { PlatformCoreHubAlertsChips } from '@/components/platform/PlatformCoreHubAlertsChips';
import { PlatformCoreChromeShell } from '@/components/platform/PlatformCoreChromeShell';
import { PlatformCoreHubQuickEntry } from '@/components/platform/PlatformCoreHubQuickEntry';
import { PlatformCorePlannerPanel } from '@/components/platform/PlatformCorePlannerPanel';
import { PlatformCorePillarRoleScoreMatrix } from '@/components/platform/PlatformCorePillarRoleScoreMatrix';
import { PlatformCoreRoleCabinetBlocks } from '@/components/platform/PlatformCoreRoleCabinetBlocks';
import { PlatformCoreSynthaStyleBanner } from '@/components/platform/PlatformCoreSynthaStyleBanner';
import { usePlatformCoreHubViews } from '@/hooks/use-platform-core-hub-views';
import { platformCoreHubLayout } from '@/lib/platform-core-hub-layout';
import { resolvePlatformCoreCollectionId } from '@/lib/platform-core-hub-matrix';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

export function PlatformHubPageClient() {
  const searchParams = useSearchParams();
  const hubCollectionId = resolvePlatformCoreCollectionId(searchParams.get('collection'));
  const { hubViews } = usePlatformCoreHubViews();

  const showRolesOnly = hubViews.audit && !hubViews.business;

  return (
    <PlatformCoreChromeShell collectionId={hubCollectionId}>
      <div className="bg-bg-surface pb-safe min-h-[calc(100vh-2.5rem)] w-full px-4 md:px-6 md:pb-6">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-6">
          <div
            data-testid="platform-core-hub-left-column"
            className="space-y-2 md:space-y-4"
          >
            <PlatformCoreSynthaStyleBanner />

            {hubViews.business ? (
              <section
                data-testid="platform-core-hub-panel-business"
                aria-label="Продукт"
                className={cn(
                  platformCoreHubLayout.quickEntryAfterBanner,
                  hubViews.audit && platformCoreHubLayout.quickEntryAfterBannerWithAudit
                )}
              >
                <PlatformCoreHubQuickEntry />
              </section>
            ) : null}

            <PlatformCoreHubAlertsChips collectionId={hubCollectionId} />

            {showRolesOnly ? (
              <section
                data-testid="platform-core-hub-panel-roles"
                aria-label="Роли · быстрый вход"
              >
                <PlatformCoreRoleCabinetBlocks />
              </section>
            ) : null}
          </div>

          {hubViews.audit ? (
            <section
              data-testid="platform-core-hub-panel-audit"
              aria-label="Аудит"
              className="mt-5 lg:mt-0"
            >
              <PlatformCorePillarRoleScoreMatrix collectionId={hubCollectionId} />
            </section>
          ) : null}
        </div>

        {hubViews.planner ? (
          <section
            id="platform-core-planner-section"
            data-testid="platform-core-hub-panel-planner"
            aria-label="План"
            className="scroll-mt-14 mt-6 border-t border-slate-100 pt-6 md:mt-8 md:pt-8"
          >
            <PlatformCorePlannerPanel collectionId={hubCollectionId} />
          </section>
        ) : null}
      </div>
    </PlatformCoreChromeShell>
  );
}
