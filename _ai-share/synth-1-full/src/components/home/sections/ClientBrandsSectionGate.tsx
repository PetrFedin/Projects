'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import {
  useHomeShowroomBrands,
  useHomeShowroomLinesheet,
} from '@/components/home/context/HomeShowroomMidFoldContext';
import { useDeferredMount } from '@/components/home/hooks/use-deferred-mount';

const ClientBrandsSection = dynamic(
  () =>
    import('@/components/home/sections/ClientBrandsSection').then((m) => ({
      default: m.ClientBrandsSection,
    })),
  { ssr: false, loading: () => <div className="min-h-[200px] animate-pulse rounded-xl bg-muted/40" aria-hidden /> }
);

type ClientBrandsSectionGateProps = {
  viewRole: string;
};

/** Client brands — context + IO/idle; без prop drilling linesheet state. */
export const ClientBrandsSectionGate = memo(function ClientBrandsSectionGate({
  viewRole,
}: ClientBrandsSectionGateProps) {
  const { brandsTab, setBrandsTab } = useHomeShowroomBrands();
  const { isLinesheetMode, setIsLinesheetMode } = useHomeShowroomLinesheet();

  const { sentinelRef, ready } = useDeferredMount({
    rootMargin: '300px 0px',
    idleTimeout: 2500,
  });

  if (viewRole !== 'client') return null;

  return (
    <div className="pt-20">
      <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden />
      {ready ? (
        <ClientBrandsSection
          viewRole={viewRole}
          brandsTab={brandsTab}
          setBrandsTab={setBrandsTab}
          isLinesheetMode={isLinesheetMode}
          setIsLinesheetMode={setIsLinesheetMode}
        />
      ) : (
        <div className="min-h-[200px] animate-pulse rounded-xl bg-muted/40" aria-hidden />
      )}
    </div>
  );
});
