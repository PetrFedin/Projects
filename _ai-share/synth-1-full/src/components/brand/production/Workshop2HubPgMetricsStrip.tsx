'use client';

import { useEffect, useState } from 'react';
import {
  fetchWorkshop2HubPgMetrics,
  type Workshop2HubPgMetrics,
} from '@/lib/production/workshop2-hub-pg-metrics';

/** Полоска PG-счётчиков на хабе (когда postgres ok). */
export function Workshop2HubPgMetricsStrip() {
  const [metrics, setMetrics] = useState<Workshop2HubPgMetrics | null>(null);

  useEffect(() => {
    void fetchWorkshop2HubPgMetrics().then(setMetrics);
  }, []);

  if (!metrics || metrics.postgres !== 'ok' || !metrics.counts) {
    return null;
  }

  const c = metrics.counts;
  return (
    <p className="text-text-muted text-[11px]" role="status">
      PostgreSQL: {c.dossiers} досье · {c.articles} артикулов · {c.sampleOrders} образцов ·{' '}
      {c.events} событий audit
    </p>
  );
}
