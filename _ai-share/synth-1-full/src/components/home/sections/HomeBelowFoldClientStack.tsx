'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import type { CmsHomeConfig } from '@/data/cms.home.default';
import { HomeBelowFoldSectionGate } from '@/components/home/sections/HomeBelowFoldSectionGate';
import { HomeMouseGlowGate } from '@/components/home/sections/HomeMouseGlowGate';

const HomeLaboratorySection = dynamic(
  () =>
    import('@/components/home/sections/HomeLaboratorySection').then((m) => ({
      default: m.HomeLaboratorySection,
    })),
  { ssr: false }
);

const HomeDropsUnlockedSection = dynamic(
  () =>
    import('@/components/home/sections/HomeDropsUnlockedSection').then((m) => ({
      default: m.HomeDropsUnlockedSection,
    })),
  { ssr: false }
);

const HomeAiStylistSection = dynamic(
  () =>
    import('@/components/home/sections/HomeAiStylistSection').then((m) => ({
      default: m.HomeAiStylistSection,
    })),
  { ssr: false }
);

const HomeWeeklyLooksSection = dynamic(
  () =>
    import('@/components/home/sections/HomeWeeklyLooksSection').then((m) => ({
      default: m.HomeWeeklyLooksSection,
    })),
  { ssr: false }
);

const HomeMediaLiveSection = dynamic(
  () =>
    import('@/components/home/sections/HomeMediaLiveSection').then((m) => ({
      default: m.HomeMediaLiveSection,
    })),
  { ssr: false }
);

const HomeClientEditorialSections = dynamic(
  () =>
    import('@/components/home/sections/HomeClientEditorialSections').then((m) => ({
      default: m.HomeClientEditorialSections,
    })),
  { ssr: false }
);

const B2BUpdatesSection = dynamic(
  () =>
    import('@/components/home/B2BUpdatesSection').then((m) => ({
      default: m.B2BUpdatesSection,
    })),
  { ssr: false }
);

type HomeBelowFoldClientStackProps = {
  viewRole: string;
  isDropsUnlocked: boolean;
  live: CmsHomeConfig['live'];
};

/** Below-fold B2C — каждая секция через IO gate (staggered chunk load). */
export const HomeBelowFoldClientStack = memo(function HomeBelowFoldClientStack({
  viewRole,
  isDropsUnlocked,
  live,
}: HomeBelowFoldClientStackProps) {
  return (
    <>
      <HomeMouseGlowGate />

      {viewRole === 'client' && (
        <HomeBelowFoldSectionGate minHeight="min-h-[420px]">
          <HomeLaboratorySection />
        </HomeBelowFoldSectionGate>
      )}

      <HomeBelowFoldSectionGate minHeight="min-h-[240px]">
        <HomeDropsUnlockedSection viewRole={viewRole} isDropsUnlocked={isDropsUnlocked} />
      </HomeBelowFoldSectionGate>

      <HomeBelowFoldSectionGate minHeight="min-h-[280px]">
        <HomeAiStylistSection viewRole={viewRole} />
      </HomeBelowFoldSectionGate>

      <HomeBelowFoldSectionGate minHeight="min-h-[420px]">
        <HomeWeeklyLooksSection viewRole={viewRole} />
      </HomeBelowFoldSectionGate>

      <HomeBelowFoldSectionGate minHeight="min-h-[200px]">
        <HomeMediaLiveSection viewRole={viewRole} live={live} />
      </HomeBelowFoldSectionGate>

      <HomeBelowFoldSectionGate minHeight="min-h-[480px]">
        <HomeClientEditorialSections viewRole={viewRole} />
      </HomeBelowFoldSectionGate>

      <HomeBelowFoldSectionGate minHeight="min-h-[200px]" rootMargin="200px 0px">
        <B2BUpdatesSection />
      </HomeBelowFoldSectionGate>
    </>
  );
});
