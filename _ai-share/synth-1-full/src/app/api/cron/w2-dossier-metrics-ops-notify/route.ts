import { NextResponse } from 'next/server';
import { readW2DossierMetricsUnified } from '@/lib/server/workshop2-dossier-metrics-backend';
import { verifyW2MetricsCronRequest } from '@/lib/server/workshop2-dossier-metrics-cron-auth';
import { aggregateW2DossierMetricsDedupLatest } from '@/lib/server/workshop2-dossier-metrics-store';
import { applyW2MetricsTimeFilter } from '@/lib/server/workshop2-dossier-metrics-time';
import {
  buildW2OpsAlerts,
  getW2OpsAlertThresholds,
} from '@/lib/server/workshop2-dossier-metrics-ops';
import { postW2MetricsWebhook } from '@/lib/server/workshop2-dossier-metrics-notify';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Отправка алертов во внешний webhook (Slack / n8n / …).
 * W2_OPS_ALERT_WEBHOOK_URL — URL POST JSON.
 * По умолчанию шлёт только при наличии warn|error; ?includeInfo=1 — все уровни.
 * Параметры: sinceHours (к окну), limit (чтение хвоста).
 */
export async function GET(request: Request) {
  if (!verifyW2MetricsCronRequest(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const includeInfo = searchParams.get('includeInfo') === '1';
  const limit = Math.min(
    Math.max(parseInt(searchParams.get('limit') ?? '4000', 10) || 4000, 1),
    5000
  );
  const sinceHours =
    searchParams.get('sinceHours')?.trim() || process.env.W2_OPS_ALERT_SINCE_HOURS?.trim() || '';

  const hookUrl = process.env.W2_OPS_ALERT_WEBHOOK_URL?.trim();
  if (!hookUrl) {
    return NextResponse.json({ ok: true, skipped: 'no_webhook', hint: 'W2_OPS_ALERT_WEBHOOK_URL' });
  }

  try {
    const rawRows = await readW2DossierMetricsUnified(limit);
    const sp = new URLSearchParams();
    if (sinceHours) sp.set('sinceHours', sinceHours);
    const { rows } = applyW2MetricsTimeFilter(rawRows, sp);
    const dedup = aggregateW2DossierMetricsDedupLatest(rows);
    const alerts = buildW2OpsAlerts(rows, dedup);
    const toSend = includeInfo
      ? alerts
      : alerts.filter((a) => a.level === 'warn' || a.level === 'error');

    if (toSend.length === 0) {
      return NextResponse.json({
        ok: true,
        skipped: 'no_matching_alerts',
        alertsTotal: alerts.length,
        rowsLoaded: rows.length,
      });
    }

    const whSecret = process.env.W2_METRICS_WEBHOOK_SECRET?.trim();
    const webhook = await postW2MetricsWebhook(
      hookUrl,
      {
        kind: 'w2_ops_alerts',
        at: new Date().toISOString(),
        sinceHours: sinceHours ?? null,
        rowsLoaded: rows.length,
        thresholds: getW2OpsAlertThresholds(),
        alerts: toSend,
      },
      { secret: whSecret }
    );

    console.info(
      '[w2-ops-notify]',
      JSON.stringify({
        event: 'w2_ops_alerts_dispatch',
        ok: webhook.ok,
        sent: toSend.length,
        rows: rows.length,
      })
    );

    if (!webhook.ok) {
      return NextResponse.json({ ok: false, webhook, alertsSent: toSend.length }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      webhook,
      alertsSent: toSend.length,
      rowsLoaded: rows.length,
    });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    console.error(
      '[w2-ops-notify]',
      JSON.stringify({ event: 'w2_ops_alerts_dispatch', ok: false, error: err })
    );
    return NextResponse.json({ ok: false, error: err }, { status: 500 });
  }
}
