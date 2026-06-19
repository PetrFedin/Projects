'use client';

import { useMemo } from 'react';
import {
  useHomeShowroomLookDialog,
  useHomeShowroomLinesheet,
  useHomeShowroomShowcase,
} from '@/components/home/context/HomeShowroomMidFoldContext';
import { useDeferredMount } from '@/components/home/hooks/use-deferred-mount';
import { ShowroomSectionConnected } from '@/components/home/sections/ShowroomSectionConnected';

/** Showroom — IO/idle после products.json; showcase + linesheet + look dialog contexts. */
export function ShowroomSectionGate() {
  const showcase = useHomeShowroomShowcase();
  const linesheet = useHomeShowroomLinesheet();
  const lookDialog = useHomeShowroomLookDialog();

  const { sentinelRef, ready } = useDeferredMount({
    enabled: showcase.productsReady,
    rootMargin: '500px 0px',
    idleTimeout: 3500,
  });

  const sectionProps = useMemo(
    () => ({
      viewRole: showcase.viewRole,
      showroomTab: showcase.showroomTab,
      setShowroomTab: showcase.setShowroomTab,
      showroomViewMode: showcase.showroomViewMode,
      setShowroomViewMode: showcase.setShowroomViewMode,
      toast: showcase.toast,
      carousels: showcase.carousels,
      filteredShowroomProducts: showcase.filteredShowroomProducts,
      totalLookCards: showcase.totalLookCards,
      isLinesheetMode: linesheet.isLinesheetMode,
      selectedLinesheetItems: linesheet.selectedLinesheetItems,
      setSelectedLinesheetItems: linesheet.setSelectedLinesheetItems,
      setSelectedLook: lookDialog.setSelectedLook,
      setIsLookDetailsOpen: lookDialog.setIsLookDetailsOpen,
      router: showcase.router,
      currency: showcase.currency,
      showroomLayout: showcase.showroomLayout,
    }),
    [
      showcase.viewRole,
      showcase.showroomTab,
      showcase.setShowroomTab,
      showcase.showroomViewMode,
      showcase.setShowroomViewMode,
      showcase.toast,
      showcase.carousels,
      showcase.filteredShowroomProducts,
      showcase.totalLookCards,
      showcase.router,
      showcase.currency,
      linesheet.isLinesheetMode,
      linesheet.selectedLinesheetItems,
      linesheet.setSelectedLinesheetItems,
      lookDialog.setSelectedLook,
      lookDialog.setIsLookDetailsOpen,
      showcase.showroomLayout,
    ]
  );

  return (
    <div id={showcase.viewRole === 'b2b' ? 'SHOWCASE_b2b' : 'SHOWCASE_b2c'}>
      <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden />
      {ready ? (
        <ShowroomSectionConnected {...sectionProps} />
      ) : (
        <div className="min-h-[420px] animate-pulse rounded-xl bg-muted/40" aria-hidden />
      )}
    </div>
  );
}
