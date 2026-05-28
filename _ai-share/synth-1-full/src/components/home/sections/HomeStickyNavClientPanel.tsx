'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import type { GlobalCategory } from '@/lib/types';
import { globalCategories } from '@/components/home/_fixtures/home-data';

const HomeGlobalCategorySelector = dynamic(
  () =>
    import('@/components/home/GlobalCategorySelector').then((m) => ({
      default: m.GlobalCategorySelector,
    })),
  {
    ssr: false,
    loading: () => <div className="min-h-[48px] animate-pulse bg-muted/30" aria-hidden />,
  }
);

type HomeStickyNavClientPanelProps = {
  globalCategory: GlobalCategory;
  setGlobalCategory: (category: GlobalCategory) => void;
};

/** Client sticky category selector — без B2BNavigation chunk. */
export const HomeStickyNavClientPanel = memo(function HomeStickyNavClientPanel({
  globalCategory,
  setGlobalCategory,
}: HomeStickyNavClientPanelProps) {
  return (
    <div className="relative z-[100]">
      <HomeGlobalCategorySelector
        categories={globalCategories}
        activeCategory={globalCategory}
        onChange={setGlobalCategory}
      />
    </div>
  );
});
