'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BarChart3, Download, RefreshCcw } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  aggregateRunwayAnalytics,
  type RunwayAnalyticsDashboard,
} from '@/lib/runway/runway-analytics-aggregation';
import type { RunwayAnalyticsSummary } from '@/lib/runway/runway-analytics-summary';
import { runwayAnalyticsPresetRange } from '@/lib/runway/runway-analytics-query';
import {
  flushRunwayAnalyticsToServer,
  resetScrollExperienceMetrics,
  RUNWAY_ANALYTICS_EVENTS_KEY,
} from '@/lib/scroll-experience-analytics';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/runway/runway-i18n';

const POLL_INTERVAL_MS = 10_000;
const SSE_PATH = '/api/runway/analytics/stream';
const EVENTS_PAGE_SIZE = 25;

type DatePreset = '7' | '30' | 'all';

interface BrandRunwayAnalyticsTabProps {
  tabPanelClassName?: string;
  /** Подписка SSE только когда вкладка активна. */
  streamActive?: boolean;
}

/** Дашборд runway-метрик: SSE live + poll fallback. */
export function BrandRunwayAnalyticsTab({
  tabPanelClassName,
  streamActive = true,
}: BrandRunwayAnalyticsTabProps) {
  const { toast } = useToast();
  const [dashboard, setDashboard] = useState<RunwayAnalyticsDashboard>(() =>
    aggregateRunwayAnalytics()
  );
  const [source, setSource] = useState<'api' | 'local'>('local');
  const [transport, setTransport] = useState<'sse' | 'poll'>('poll');
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => Date.now());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [datePreset, setDatePreset] = useState<DatePreset>('7');
  const [eventsPage, setEventsPage] = useState(1);
  const [weeklySummary, setWeeklySummary] = useState<RunwayAnalyticsSummary | null>(null);
  const [weeklySummaryError, setWeeklySummaryError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const dateQuery = useMemo(() => {
    if (datePreset === 'all') return { from: null as string | null, to: null as string | null };
    const days = datePreset === '7' ? 7 : 30;
    return runwayAnalyticsPresetRange(days);
  }, [datePreset]);

  const applyDashboard = useCallback((apiDash: RunwayAnalyticsDashboard) => {
    setDashboard(apiDash);
    setSource('api');
    setLastUpdatedAt(Date.now());
  }, []);

  const refreshDashboard = useCallback(async () => {
    await flushRunwayAnalyticsToServer();

    const params = new URLSearchParams();
    if (dateQuery.from) params.set('from', dateQuery.from);
    if (dateQuery.to) params.set('to', dateQuery.to);
    params.set('page', String(eventsPage));
    params.set('pageSize', String(EVENTS_PAGE_SIZE));

    try {
      const res = await fetch(`/api/runway/analytics?${params.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        applyDashboard((await res.json()) as RunwayAnalyticsDashboard);
      } else {
        setDashboard(aggregateRunwayAnalytics());
        setSource('local');
        setLastUpdatedAt(Date.now());
      }
    } catch {
      setDashboard(aggregateRunwayAnalytics());
      setSource('local');
      setLastUpdatedAt(Date.now());
    }

    try {
      const summaryRes = await fetch('/api/runway/analytics/summary?period=week', {
        cache: 'no-store',
      });
      if (summaryRes.ok) {
        setWeeklySummary((await summaryRes.json()) as RunwayAnalyticsSummary);
        setWeeklySummaryError(null);
      } else {
        setWeeklySummaryError(t('runway.analyticsEmpty'));
      }
    } catch {
      setWeeklySummaryError(t('runway.analyticsEmpty'));
    }
  }, [applyDashboard, dateQuery.from, dateQuery.to, eventsPage]);

  useEffect(() => {
    void refreshDashboard();
  }, [refreshDashboard]);

  useEffect(() => {
    if (!streamActive || typeof EventSource === 'undefined') {
      setTransport('poll');
      return;
    }

    let cancelled = false;
    const es = new EventSource(SSE_PATH);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      if (cancelled) return;
      try {
        const apiDash = JSON.parse(event.data) as RunwayAnalyticsDashboard;
        applyDashboard(apiDash);
        setTransport('sse');
      } catch {
        /* ignore malformed chunk */
      }
    };

    es.onerror = () => {
      if (cancelled) return;
      setTransport('poll');
      es.close();
      eventSourceRef.current = null;
    };

    return () => {
      cancelled = true;
      es.close();
      eventSourceRef.current = null;
    };
  }, [streamActive, applyDashboard]);

  useEffect(() => {
    if (transport !== 'poll' || !streamActive) return;

    const poll = window.setInterval(() => {
      void refreshDashboard();
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(poll);
  }, [refreshDashboard, transport, streamActive]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === RUNWAY_ANALYTICS_EVENTS_KEY) {
        void refreshDashboard();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshDashboard]);

  useEffect(() => {
    const tick = () => {
      setSecondsAgo(Math.max(0, Math.floor((Date.now() - lastUpdatedAt) / 1000)));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [lastUpdatedAt]);

  const metrics = dashboard.metrics;

  const chartData = useMemo(() => {
    if (dashboard.sectionPopularity.length > 0) {
      return dashboard.sectionPopularity.map((row) => ({
        name: row.sectionLabel,
        views: row.views,
      }));
    }
    return [];
  }, [dashboard.sectionPopularity]);

  const handleReset = async () => {
    resetScrollExperienceMetrics();
    if (process.env.NODE_ENV === 'development') {
      await fetch('/api/runway/analytics?reset=1', { cache: 'no-store' });
    }
    toast({ title: t('runway.metrics'), description: t('runway.analyticsResetDone') });
    await refreshDashboard();
  };

  const handleExportCsv = async () => {
    try {
      const res = await fetch('/api/runway/analytics/export?format=dashboard', {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `runway-analytics-${Date.now()}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast({ title: t('runway.analyticsExportCsv'), description: t('runway.analyticsSourceApi') });
    } catch {
      toast({
        title: t('runway.analyticsExportCsv'),
        description: 'Не удалось скачать CSV',
        variant: 'destructive',
      });
    }
  };

  const transportLabel =
    transport === 'sse' ? t('runway.analyticsSourceSse') : t('runway.analyticsSourcePoll');

  const eventsPageData = dashboard.eventsPage;
  const eventRows = eventsPageData?.items ?? [];

  return (
    <TabsContent value="runway-analytics" className={tabPanelClassName} data-runway-analytics-tab>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{t('runway.analyticsSections')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('runway.analyticsUpdatedAgo', { seconds: secondsAgo })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">{t('runway.analyticsDateRange')}:</span>
            {(
              [
                ['7', t('runway.analyticsLast7Days')],
                ['30', t('runway.analyticsLast30Days')],
                ['all', t('runway.analyticsAllTime')],
              ] as const
            ).map(([preset, label]) => (
              <Button
                key={preset}
                type="button"
                size="sm"
                variant={datePreset === preset ? 'default' : 'outline'}
                data-runway-analytics-preset={preset}
                onClick={() => {
                  setDatePreset(preset);
                  setEventsPage(1);
                }}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              {t('runway.metrics')}
            </Badge>
            <Badge
              variant="secondary"
              className="text-[10px] uppercase tracking-wider"
              data-runway-analytics-transport={transport}
            >
              {transportLabel}
            </Badge>
            <Button type="button" variant="ghost" size="sm" onClick={() => void refreshDashboard()}>
              <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
              {t('runway.analyticsRefresh')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-runway-analytics-export
              onClick={() => void handleExportCsv()}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              {t('runway.analyticsExportCsv')}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => void handleReset()}>
              <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
              {t('runway.analyticsReset')}
            </Button>
          </div>
        </div>

        <Card className="p-4" data-runway-weekly-summary>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold">{t('runway.weeklySummary')}</h4>
              <p className="text-xs text-muted-foreground">{t('runway.weeklySummaryDesc')}</p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void refreshDashboard()}
            >
              <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
              {t('runway.weeklySummaryRefresh')}
            </Button>
          </div>
          {weeklySummary ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-md border border-border p-3">
                <p className="text-[10px] uppercase text-muted-foreground">
                  {t('runway.kpiViews')}
                </p>
                <p className="text-xl font-bold tabular-nums">
                  {weeklySummary.dashboard.metrics.scroll_experience_view}
                </p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-[10px] uppercase text-muted-foreground">
                  {t('runway.kpiSectionChange')}
                </p>
                <p className="text-xl font-bold tabular-nums">
                  {weeklySummary.dashboard.metrics.scroll_experience_section_change}
                </p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-[10px] uppercase text-muted-foreground">
                  {t('runway.kpiAddToCart')}
                </p>
                <p className="text-xl font-bold tabular-nums">
                  {weeklySummary.dashboard.metrics.scroll_experience_add_to_cart}
                </p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-[10px] uppercase text-muted-foreground">
                  {t('runway.weeklySummaryProducts')}
                </p>
                <p className="text-xl font-bold tabular-nums">{weeklySummary.uniqueProductSlugs}</p>
              </div>
              <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
                <p>
                  {weeklySummary.from} — {weeklySummary.to}
                </p>
                <p className="mt-1">{weeklySummary.dashboard.eventCount} событий</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {weeklySummaryError ?? t('runway.analyticsEmpty')}
            </p>
          )}
        </Card>

        <Card className="p-4" data-runway-ab-cohort-split>
          <h4 className="mb-3 text-sm font-semibold">{t('runway.abCohortSplit')}</h4>
          {dashboard.abCohortSplit && dashboard.abCohortSplit.total > 0 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-border p-3">
                <p className="text-[10px] uppercase text-muted-foreground">
                  {t('runway.abCohortRunwayFirst')}
                </p>
                <p className="text-xl font-bold tabular-nums">
                  {dashboard.abCohortSplit.runwayFirst}
                  {dashboard.abCohortSplit.runwayFirstPct != null
                    ? ` (${dashboard.abCohortSplit.runwayFirstPct}%)`
                    : ''}
                </p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-[10px] uppercase text-muted-foreground">
                  {t('runway.abCohortStandardFirst')}
                </p>
                <p className="text-xl font-bold tabular-nums">
                  {dashboard.abCohortSplit.standardFirst}
                  {dashboard.abCohortSplit.standardFirstPct != null
                    ? ` (${dashboard.abCohortSplit.standardFirstPct}%)`
                    : ''}
                </p>
              </div>
              <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
                <p>Всего назначений: {dashboard.abCohortSplit.total}</p>
                <p className="mt-1">Событие: runway_ab_cohort_assigned</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t('runway.abCohortEmpty')}</p>
          )}
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: t('runway.kpiViews'), value: metrics.scroll_experience_view },
            {
              label: t('runway.kpiSectionChange'),
              value: metrics.scroll_experience_section_change,
            },
            { label: t('runway.kpiAddToCart'), value: metrics.scroll_experience_add_to_cart },
            { label: t('runway.kpiShares'), value: metrics.scroll_experience_share },
          ].map((kpi) => (
            <Card key={kpi.label} className="p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{kpi.value}</p>
            </Card>
          ))}
        </div>

        <Card className="p-4">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold">{t('runway.analyticsSections')}</h4>
          </div>
          {chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('runway.analyticsEmpty')}</p>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h4 className="mb-3 text-sm font-semibold">{t('runway.analyticsFunnel')}</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('runway.funnelStep')}</TableHead>
                <TableHead className="text-right">{t('runway.funnelEvents')}</TableHead>
                <TableHead className="text-right">{t('runway.funnelCr')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboard.funnel.map((row) => (
                <TableRow key={row.step}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.count}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.rateFromPrevious != null ? `${row.rateFromPrevious}%` : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-4" data-runway-analytics-events>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold">{t('runway.analyticsEventsLog')}</h4>
            {eventsPageData && eventsPageData.totalPages > 0 ? (
              <p className="text-xs text-muted-foreground">
                {t('runway.analyticsPage', {
                  page: eventsPageData.page,
                  total: eventsPageData.totalPages,
                })}
              </p>
            ) : null}
          </div>
          {eventRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('runway.analyticsEmpty')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('runway.analyticsEventTime')}</TableHead>
                  <TableHead>{t('runway.analyticsEventType')}</TableHead>
                  <TableHead>{t('runway.analyticsEventProduct')}</TableHead>
                  <TableHead className="text-right">#</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventRows.map((row) => (
                  <TableRow key={`${row.timestamp}-${row.event}-${row.productSlug}`}>
                    <TableCell className="text-xs tabular-nums">
                      {new Date(row.timestamp).toLocaleString('ru-RU')}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{row.event}</TableCell>
                    <TableCell className="text-xs">{row.productSlug}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">
                      {row.sectionIndex ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {eventsPageData && eventsPageData.totalPages > 1 ? (
            <div className="mt-3 flex justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={eventsPage <= 1}
                onClick={() => setEventsPage((p) => Math.max(1, p - 1))}
              >
                {t('runway.analyticsPrevPage')}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={eventsPage >= eventsPageData.totalPages}
                onClick={() => setEventsPage((p) => p + 1)}
              >
                {t('runway.analyticsNextPage')}
              </Button>
            </div>
          ) : null}
        </Card>

        <p className="text-xs text-muted-foreground">
          {source === 'api' ? t('runway.analyticsSourceApi') : t('runway.analyticsSourceLocal')}.{' '}
          {transportLabel}.
        </p>
      </div>
    </TabsContent>
  );
}
