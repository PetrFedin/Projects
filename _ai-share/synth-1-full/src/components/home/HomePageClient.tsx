'use client';

import { memo } from 'react';
import type { CmsHomeConfig } from '@/data/cms.home.default';
import { useUIState } from '@/providers/ui-state';
import { HomeB2BDialogsProvider } from '@/components/home/context/HomeB2BDialogsContext';
import { HomeCmsProvider } from '@/components/home/context/HomeCmsContext';
import { useHomeShellPrefetch } from '@/components/home/hooks/use-home-shell-prefetch';
import { useSeedHomeProductsCatalog } from '@/components/home/hooks/use-home-products';
import type { Product } from '@/lib/types';

import {
  HomeStickyNavBlock,
  HomeAdminHubGate,
  HomeMidFoldStack,
  HomeBelowFoldGate,
} from '@/components/home/HomePageLazySections';

/** Shell без CMS/products state — не re-render при idle fetch CMS/products. */
const HomePageClientShell = memo(function HomePageClientShell() {
  const {
    globalCategory,
    setGlobalCategory,
    viewRole,
    isFlowMapOpen,
    isCalendarOpen,
    isMediaRadarOpen,
    isConstellationOpen,
    followedBrands,
  } = useUIState();
  const isDropsUnlocked = followedBrands.length >= 2 || viewRole === 'admin';
  useHomeShellPrefetch({ viewRole });

  return (
    <HomeB2BDialogsProvider viewRole={viewRole}>
      <div className="relative flex flex-col bg-[#f8fafc] font-sans">
        <HomeStickyNavBlock
          viewRole={viewRole}
          globalCategory={globalCategory}
          setGlobalCategory={setGlobalCategory}
        />

        <HomeAdminHubGate viewRole={viewRole} />

        <HomeMidFoldStack
          viewRole={viewRole}
          isFlowMapOpen={isFlowMapOpen}
          isCalendarOpen={isCalendarOpen}
          isMediaRadarOpen={isMediaRadarOpen}
          isConstellationOpen={isConstellationOpen}
          globalCategory={globalCategory}
        />

        <HomeBelowFoldGate viewRole={viewRole} isDropsUnlocked={isDropsUnlocked} />
      </div>
    </HomeB2BDialogsProvider>
  );
});

export const HomePageClient = memo(function HomePageClient({
  initialCms,
  initialProducts,
}: {
  initialCms?: CmsHomeConfig;
  /** RSC baseline — без client fetch `/data/products.json` на first paint. */
  initialProducts?: Product[];
}) {
  useSeedHomeProductsCatalog(initialProducts);

  return (
    <HomeCmsProvider initialCms={initialCms}>
      <HomePageClientShell />
    </HomeCmsProvider>
  );
});
