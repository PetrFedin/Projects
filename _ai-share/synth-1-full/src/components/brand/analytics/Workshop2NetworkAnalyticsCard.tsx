'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Workshop2NetworkAnalyticsSnapshot } from '@/lib/production/workshop2-network-analytics';

/** Wave 5: карточка сети Workshop2 на странице аналитики бренда. */
export function Workshop2NetworkAnalyticsCard() {
  const [snapshot, setSnapshot] = useState<Workshop2NetworkAnalyticsSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch('/api/brand/analytics/workshop2-network', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { snapshot?: Workshop2NetworkAnalyticsSnapshot }) => {
        if (data.snapshot) setSnapshot(data.snapshot);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'load_failed'));
  }, []);

  return (
    <Card data-testid="workshop2-network-analytics-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Workshop2 · сеть производства</CardTitle>
        <CardDescription className="text-xs">
          Агрегат domain events + календарь T&amp;A (PG / file-store).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 text-xs">
        {error ? (
          <p className="text-text-muted">Недоступно: {error}</p>
        ) : !snapshot ? (
          <p className="text-text-muted">Загрузка…</p>
        ) : (
          <>
            <Badge variant="outline">Blocked: {snapshot.articlesBlocked}</Badge>
            <Badge variant="outline">Образцы в пути: {snapshot.samplesInTransit}</Badge>
            <Badge variant="outline">Showroom: {snapshot.showroomPublishedCount}</Badge>
            <Badge variant="outline">MES QC: {snapshot.mesQcDefectCount}</Badge>
            <Badge variant="outline">Calendar blockers: {snapshot.calendarBlockerCount}</Badge>
            <p className="text-text-muted w-full pt-1">{snapshot.hintRu}</p>
            <Link
              href="/brand/production/workshop2"
              className="text-sky-700 underline underline-offset-2"
            >
              Открыть хаб Workshop2
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
