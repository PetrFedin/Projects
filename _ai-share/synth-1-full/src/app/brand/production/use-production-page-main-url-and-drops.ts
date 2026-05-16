'use client';

import { useEffect, useState } from 'react';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { getDrops } from '@/lib/collections-api';

export type ProductionPageMainApiDrop = {
  id: number;
  drop_name: string;
  season: string;
  status: string;
  scheduled_date: string;
};

/** ?status=in_progress | shipped → вкладка заказов и пресет фильтра. */
export function useProductionPageMainOrdersTabFromSearchParams(
  searchParams: ReadonlyURLSearchParams,
  setActiveTab: (tab: string) => void,
  setOrdersFilter: (filter: string) => void
) {
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'in_progress') {
      setActiveTab('orders');
      setOrdersFilter('In Production');
    } else if (status === 'shipped') {
      setActiveTab('orders');
      setOrdersFilter('Shipped');
    }
  }, [searchParams, setActiveTab, setOrdersFilter]);
}

export function useProductionPageMainApiDrops(): ProductionPageMainApiDrop[] {
  const [apiDrops, setApiDrops] = useState<ProductionPageMainApiDrop[]>([]);
  useEffect(() => {
    let cancelled = false;
    getDrops()
      .then((list) => {
        if (!cancelled) setApiDrops(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return apiDrops;
}
