'use client';

import { useCallback, useMemo, useState } from 'react';
import type { StagesTabArticle } from '@/components/brand/production/stages-dependencies-tab-content-helpers';

export function useStagesDependenciesSlicePicker(args: {
  poolArticles: StagesTabArticle[];
  focusArticle: StagesTabArticle | null;
}) {
  const { poolArticles, focusArticle } = args;

  const [pickerQ, setPickerQ] = useState('');
  const [expandedPickDetailIds, setExpandedPickDetailIds] = useState<Set<string>>(() => new Set());

  const togglePickDetailRow = useCallback((id: string) => {
    setExpandedPickDetailIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const articlesForPickerList = useMemo(() => {
    let list = poolArticles;
    const q = pickerQ.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.sku.toLowerCase().includes(q) ||
          (a.season?.toLowerCase().includes(q) ?? false) ||
          (a.categoryPathLabel?.toLowerCase().includes(q) ?? false) ||
          (a.fabricSuppliersLabel?.toLowerCase().includes(q) ?? false) ||
          (a.fabricStockNote?.toLowerCase().includes(q) ?? false)
      );
    }
    return list;
  }, [poolArticles, pickerQ]);

  const skuSelectArticles = useMemo(() => {
    if (!focusArticle || articlesForPickerList.some((a) => a.id === focusArticle.id)) {
      return articlesForPickerList;
    }
    return [focusArticle, ...articlesForPickerList];
  }, [articlesForPickerList, focusArticle]);

  return {
    pickerQ,
    setPickerQ,
    expandedPickDetailIds,
    togglePickDetailRow,
    articlesForPickerList,
    skuSelectArticles,
  };
}
