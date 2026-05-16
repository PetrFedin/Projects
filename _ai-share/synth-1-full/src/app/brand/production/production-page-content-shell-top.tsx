'use client';

import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import {
  GlobalProductionSearch,
  type SearchResult,
} from '@/components/brand/production/GlobalProductionSearch';

export function ProductionPageContentShellTop({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const {
    setIsGlobalSearchOpen,
    isGlobalSearchOpen,
    setSelectedCollectionIds,
    setActiveTab,
    collections,
    filteredSkus,
    filteredProductionOrders,
    displaySampleStatuses,
    filteredSampleStatuses,
  } = px;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen?.(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setIsGlobalSearchOpen]);

  const handleGlobalSearchSelect = (r: SearchResult) => {
    if (r.type === 'collection') setSelectedCollectionIds?.([r.id]);
    if (r.type === 'sku' || r.type === 'sample') setActiveTab?.('samples');
    if (r.type === 'po') setActiveTab?.('orders');
    if (r.type === 'factory') setActiveTab?.('factories');
    if (r.collectionId) setSelectedCollectionIds?.([r.collectionId]);
    setIsGlobalSearchOpen?.(false);
  };

  return (
    <>
      {typeof setIsGlobalSearchOpen === 'function' && (
        <GlobalProductionSearch
          open={!!isGlobalSearchOpen}
          onOpenChange={(o) => setIsGlobalSearchOpen?.(o)}
          onSelect={handleGlobalSearchSelect}
          collections={collections || []}
          skus={filteredSkus || []}
          orders={filteredProductionOrders || []}
          samples={displaySampleStatuses || filteredSampleStatuses || []}
          factories={[
            { id: 'S-01', name: 'Global Textiles' },
            { id: 'S-02', name: 'YKK Russia' },
            { id: 'S-03', name: 'Smart Tailor Lab' },
          ]}
        />
      )}
      <div className="text-text-muted mb-4 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest">
        <Link
          href={ROUTES.brand.organizationPage}
          className="hover:text-accent-primary transition-colors"
        >
          Организация
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-accent-primary">Управление производством</span>
      </div>
    </>
  );
}
