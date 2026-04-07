import { NextResponse } from 'next/server';
import { readW2DossierMetricsUnified } from '@/lib/server/workshop2-dossier-metrics-backend';
import { runW2DossierMetricsArchiveJob } from '@/lib/server/workshop2-dossier-metrics-archive';
import { postW2MetricsWebhook } from '@/lib/server/workshop2-dossier-metrics-notify';
import { verifyW2MetricsCronRequest } from '@/lib/server/workshop2-dossier-metrics-cron-auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/**
 * Cron / ручной вызов: снять хвост метрик и записать в W2_METRICS_ARCHIVE_PUT_URL или W2_METRICS_ARCHIVE_LOCAL_DIR.
 * Идемпотентность: SHA-256 содержимого среза (строки отсортированы); повтор с тем же хвостом → skipped_duplicate.
 * Принудительно: ?force=1 (всё равно перезапишет state после успешной выгрузки).
 * Vercel Cron: Authorization: Bearer <W2_METRICS_CRON_SECRET>.
 */
export async function GET(request: Request) {
  if (!verifyW2MetricsCronRequest(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === '1';

  const limit = Math.min(
    Math.max(parseInt(process.env.W2_METRICS_ARCHIVE_READ_LIMIT ?? '5000', 10) || 5000, 1),
    20_000
  );

  const t0 = Date.now();
  try {
    const tRead = Date.now();
    const rows = await readW2DossierMetricsUnified(limit);
    const readMs = Date.now() - tRead;
    const job = await runW2DossierMetricsArchiveJob(rows, { force });

    const logLine = {
      event: 'w2_metrics_archive',
      ok: job.ok,
      skipped: job.skipped,
      fingerprint: job.fingerprint,
      fingerprintShort: job.fingerprint ? job.fingerprint.slice(0, 16) : null,
      rows: job.rows,
      limit,
      bytes: job.bytes,
      stateUpdated: job.stateUpdated,
      statePath: job.statePath,
      writeTarget: job.write?.ok ? job.write.target : job.write?.target,
      archiveMs: job.durationMs,
      readMs,
      totalMs: Date.now() - t0,
      force,
    };
    console.info('[w2-metrics-archive]', JSON.stringify(logLine));

    const totalMs = Date.now() - t0;
    const payload = {
      ok: job.ok,
      job,
      limit,
      force,
      readMs,
      totalMs,
    };

    const hookUrl = process.env.W2_METRICS_ARCHIVE_WEBHOOK_URL?.trim();
    let webhook: { ok: boolean; status?: number; err?: string } | null = null;
    if (hookUrl) {
      const whSecret = process.env.W2_METRICS_WEBHOOK_SECRET?.trim();
      webhook = await postW2MetricsWebhook(
        hookUrl,
        {
          kind: 'w2_metrics_archive',
          at: new Date().toISOString(),
          ok: job.ok,
          skipped: job.skipped,
          fingerprint: job.fingerprint,
          rows: job.rows,
          bytes: job.bytes,
          writeTarget: job.write?.ok ? job.write.target : job.write?.target,
          error: job.error,
          retention: job.retention,
          totalMs,
        },
        { secret: whSecret }
      );
      if (!webhook.ok) {
        console.warn('[w2-metrics-archive]', JSON.stringify({ event: 'archive_webhook_failed', ...webhook }));
      }
    }

    const body = { ...payload, webhook };
    if (!job.ok && job.skipped === null) {
      return NextResponse.json(body, { status: 500 });
    }
    return NextResponse.json(body);
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    console.error(
      '[w2-metrics-archive]',
      JSON.stringify({ event: 'w2_metrics_archive', ok: false, error: err, limit })
    );
    return NextResponse.json({ ok: false, error: 'read_failed', message: err }, { status: 500 });
  }
}
