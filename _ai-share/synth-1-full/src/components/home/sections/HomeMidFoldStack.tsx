'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import {
  HomeShowroomMidFoldProvider,
  useHomeShowroomShowcase,
} from '@/components/home/context/HomeShowroomMidFoldContext';
import { useHomeCmsCarousels } from '@/components/home/context/HomeCmsContext';
import type { GlobalCategory } from '@/lib/types';
import { useHomeProducts } from '@/components/home/hooks/use-home-products';

const B2BPresentationSectionsGate = dynamic(
  () =>
    import('@/components/home/sections/B2BPresentationSectionsGate').then((m) => ({
      default: m.B2BPresentationSectionsGate,
    })),
  { ssr: false, loading: () => <div className="min-h-[240px] animate-pulse rounded-xl bg-muted/40" aria-hidden /> }
);

const ClientBrandsSectionGate = dynamic(
  () =>
    import('@/components/home/sections/ClientBrandsSectionGate').then((m) => ({
      default: m.ClientBrandsSectionGate,
    })),
  { ssr: false, loading: () => <div className="min-h-[200px] animate-pulse rounded-xl bg-muted/40" aria-hidden /> }
);

const ProductScrollSwitcherFeaturedGate = dynamic(
  () =>
    import('@/components/product/ProductScrollSwitcherFeaturedGate').then((m) => ({
      default: m.ProductScrollSwitcherFeaturedGate,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto min-h-[420px] max-w-6xl animate-pulse rounded-xl bg-muted/40" aria-hidden />
    ),
  }
);

const ShowroomSectionGate = dynamic(
  () =>
    import('@/components/home/sections/ShowroomSectionGate').then((m) => ({
      default: m.ShowroomSectionGate,
    })),
  { ssr: false, loading: () => <div className="min-h-[420px] animate-pulse rounded-xl bg-muted/40" aria-hidden /> }
);

type HomeMidFoldStackProps = {
  viewRole: string;
  isFlowMapOpen: boolean;
  isCalendarOpen: boolean;
  isMediaRadarOpen: boolean;
  isConstellationOpen: boolean;
  globalCategory: GlobalCategory;
};

const HomeMidFoldRunwayGate = memo(function HomeMidFoldRunwayGate({
  viewRole,
}: {
  viewRole: string;
}) {
  const { products, productsReady } = useHomeShowroomShowcase();

  if (viewRole !== 'client' || !productsReady || products.length === 0) {
    return null;
  }

  return (
    <ProductScrollSwitcherFeaturedGate products={products} productsReady={productsReady} />
  );
});

const HomeMidFoldStackBody = memo(function HomeMidFoldStackBody({
  viewRole,
  isFlowMapOpen,
  isCalendarOpen,
  isMediaRadarOpen,
  isConstellationOpen,
}: Pick<
  HomeMidFoldStackProps,
  'viewRole' | 'isFlowMapOpen' | 'isCalendarOpen' | 'isMediaRadarOpen' | 'isConstellationOpen'
>) {
  const overlayOpen =
    isFlowMapOpen || isCalendarOpen || isMediaRadarOpen || isConstellationOpen;

  return (
    <>
      <div className={cn('flex flex-col', overlayOpen && 'hidden')}>
        {viewRole === 'b2b' && (
          <B2BPresentationSectionsGate isFlowMapOpen={isFlowMapOpen} />
        )}

        {viewRole === 'client' && <ClientBrandsSectionGate viewRole={viewRole} />}

        <HomeMidFoldRunwayGate viewRole={viewRole} />
      </div>

      <ShowroomSectionGate />
    </>
  );
});

const HomeMidFoldDataLayer = memo(function HomeMidFoldDataLayer({
  viewRole,
  isFlowMapOpen,
  isCalendarOpen,
  isMediaRadarOpen,
  isConstellationOpen,
  globalCategory,
}: HomeMidFoldStackProps) {
  const carousels = useHomeCmsCarousels();
  const { products, productsReady } = useHomeProducts({ viewRole });

  return (
    <HomeShowroomMidFoldProvider
      viewRole={viewRole}
      products={products}
      productsReady={productsReady}
      globalCategory={globalCategory}
      carousels={carousels}
    >
      <HomeMidFoldStackBody
        viewRole={viewRole}
        isFlowMapOpen={isFlowMapOpen}
        isCalendarOpen={isCalendarOpen}
        isMediaRadarOpen={isMediaRadarOpen}
        isConstellationOpen={isConstellationOpen}
      />
    </HomeShowroomMidFoldProvider>
  );
});

/** Mid-fold — UI props от shell; CMS/products подписка в data layer. */
export const HomeMidFoldStack = memo(function HomeMidFoldStack(props: HomeMidFoldStackProps) {
  return <HomeMidFoldDataLayer {...props} />;
});
