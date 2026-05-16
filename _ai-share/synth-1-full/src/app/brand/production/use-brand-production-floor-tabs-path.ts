'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { STAGES_SKU_PARAM } from '@/lib/production/stages-url';
import { isProductionFloorTab, type ProductionFloorTabId } from '@/lib/production/floor-flow';

export function useBrandProductionFloorTabsPath() {
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const collectionIdFromQuery = searchParams.get('collectionId') || '';
  const effectiveCollectionId = collectionIdFromQuery || 'default';
  /** Демо-коллекция Investor делит с «по умолчанию» один flow в localStorage (те же три SKU). */
  const collectionFlowKey =
    !collectionIdFromQuery || collectionIdFromQuery === 'Investor'
      ? 'default'
      : collectionIdFromQuery;

  const floorTabFromSearch = searchParams.get('floorTab');
  const [tab, setTabState] = useState<ProductionFloorTabId>(
    isProductionFloorTab(floorTabFromSearch) ? floorTabFromSearch : 'workshop'
  );
  const [suppliesSub, setSuppliesSub] = useState<'vmi' | 'reservation'>('vmi');
  const [sampleSub, setSampleSub] = useState<'gold' | 'fit'>('gold');
  const [launchSub, setLaunchSub] = useState<'daily' | 'skills' | 'video' | 'sub'>('daily');
  const [qualitySub, setQualitySub] = useState<'mobile' | 'desk'>('mobile');

  useEffect(() => {
    const v = searchParams.get('floorTab');
    if (isProductionFloorTab(v)) setTabState(v);
    else setTabState('workshop');
  }, [searchParams]);

  /** Старые ссылки ?floorTab=workshop2 → отдельный маршрут разработки коллекции (workshop2). */
  useEffect(() => {
    if (searchParams.get('floorTab') !== 'workshop2') return;
    const p = new URLSearchParams(searchParams.toString());
    p.delete('floorTab');
    const q = p.toString();
    router.replace(
      q ? `${ROUTES.brand.productionWorkshop2}?${q}` : ROUTES.brand.productionWorkshop2,
      { scroll: false }
    );
  }, [router, searchParams]);

  const handleLiveContextCollectionChange = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id && id !== 'default') params.set('collectionId', id);
      else params.delete('collectionId');
      params.delete(STAGES_SKU_PARAM);
      params.set('floorTab', 'live');
      const q = params.toString();
      router.replace(`${pathname}${q ? `?${q}` : ''}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const floorHref = useCallback(
    (floorTab: ProductionFloorTabId) => {
      const params = new URLSearchParams(searchParams.toString());
      if (floorTab === 'workshop') params.delete('floorTab');
      else params.set('floorTab', floorTab);
      const q = params.toString();
      return `${pathname}${q ? `?${q}` : ''}`;
    },
    [pathname, searchParams]
  );

  const handleCollectionChange = (value: string) => {
    if (value === '__new__') {
      router.push('/brand/production?collectionId=New');
      return;
    }
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      params.set('collectionId', value);
    } else {
      params.delete('collectionId');
    }
    params.delete(STAGES_SKU_PARAM);
    const query = params.toString();
    router.push(`/brand/production${query ? `?${query}` : ''}`);
  };

  return {
    searchParams,
    router,
    pathname,
    collectionIdFromQuery,
    effectiveCollectionId,
    collectionFlowKey,
    tab,
    setTabState,
    suppliesSub,
    setSuppliesSub,
    sampleSub,
    setSampleSub,
    launchSub,
    setLaunchSub,
    qualitySub,
    setQualitySub,
    floorHref,
    handleLiveContextCollectionChange,
    handleCollectionChange,
  };
}
