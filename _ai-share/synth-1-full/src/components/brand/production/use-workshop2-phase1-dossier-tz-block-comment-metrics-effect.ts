'use client';

import { useEffect } from 'react';
import {
  computeW2TzBlockCommentMetrics,
  type W2TzBlockCommentMetrics,
} from '@/lib/production/workshop2-article-tz-block-comments';

type CommentsMap = Parameters<typeof computeW2TzBlockCommentMetrics>[0];

/** Проброс метрик комментариев по блокам ТЗ наверх (пульс / дашборд). */
export function useWorkshop2Phase1DossierTzBlockCommentMetricsEffect(p: {
  attrCommentsById: CommentsMap;
  tzBlockCommentMetricKeys?: readonly string[];
  onTzBlockCommentMetrics?: (metrics: Record<string, W2TzBlockCommentMetrics>) => void;
}) {
  const { attrCommentsById, tzBlockCommentMetricKeys, onTzBlockCommentMetrics } = p;

  useEffect(() => {
    if (!onTzBlockCommentMetrics || !tzBlockCommentMetricKeys?.length) return;
    onTzBlockCommentMetrics(
      computeW2TzBlockCommentMetrics(attrCommentsById, tzBlockCommentMetricKeys)
    );
  }, [attrCommentsById, onTzBlockCommentMetrics, tzBlockCommentMetricKeys]);
}
