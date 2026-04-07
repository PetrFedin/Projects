'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchPartnerReportsSalesByBrand,
  fetchPartnerReportsTopSku,
  fetchPartnerReportsSellThrough,
  fetchPartnerReportsPlanFact,
  type PartnerReportsFilters,
} from '@/lib/b2b/b2b-api-client';
import type {
  SalesByBrandRow,
  TopSkuRow,
  SellThroughRow,
  PlanFactRow,
} from '@/lib/b2b/partner-reports-data';

export interface PartnerReportsState {
  salesByBrand: SalesByBrandRow[];
  topSku: TopSkuRow[];
  sellThrough: SellThroughRow[];
  planFact: PlanFactRow[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePartnerReports(filters: PartnerReportsFilters): PartnerReportsState {
  const [salesByBrand, setSalesByBrand] = useState<SalesByBrandRow[]>([]);
  const [topSku, setTopSku] = useState<TopSkuRow[]>([]);
  const [sellThrough, setSellThrough] = useState<SellThroughRow[]>([]);
  const [planFact, setPlanFact] = useState<PlanFactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sales, top, sell, plan] = await Promise.all([
        fetchPartnerReportsSalesByBrand(filters),
        fetchPartnerReportsTopSku(filters),
        fetchPartnerReportsSellThrough(filters),
        fetchPartnerReportsPlanFact(filters),
      ]);
      setSalesByBrand(sales);
      setTopSku(top);
      setSellThrough(sell);
      setPlanFact(plan);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки отчётов');
    } finally {
      setLoading(false);
    }
  }, [filters.season, filters.brand]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    salesByBrand,
    topSku,
    sellThrough,
    planFact,
    loading,
    error,
    refetch: load,
  };
}
