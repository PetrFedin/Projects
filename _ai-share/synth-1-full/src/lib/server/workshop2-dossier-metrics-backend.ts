import type { Workshop2DossierMetricsPayload } from '@/lib/production/workshop2-dossier-metrics-ingest';
import {
  appendW2DossierMetricRow,
  maybeRotateW2DossierMetricsFile,
  readW2DossierMetricsTail,
} from '@/lib/server/workshop2-dossier-metrics-store';
import {
  getW2DossierMetricsUpstashConfig,
  upstashAppendW2DossierMetricRow,
  upstashReadW2DossierMetricsTail,
} from '@/lib/server/workshop2-dossier-metrics-upstash';

export type W2MetricsAppendResult = {
  stored: boolean;
  target: 'redis' | 'file' | 'redis_fallback_file';
};

export async function appendW2DossierMetricUnified(
  row: Workshop2DossierMetricsPayload
): Promise<W2MetricsAppendResult> {
  if (getW2DossierMetricsUpstashConfig()) {
    try {
      await upstashAppendW2DossierMetricRow(row);
      return { stored: true, target: 'redis' };
    } catch (e) {
      console.warn('[w2-metrics] Upstash append failed, file fallback', e);
      try {
        await appendW2DossierMetricRow(row);
        await maybeRotateW2DossierMetricsFile();
        return { stored: true, target: 'redis_fallback_file' };
      } catch (e2) {
        console.warn('[w2-metrics] file append failed', e2);
        return { stored: false, target: 'redis_fallback_file' };
      }
    }
  }
  try {
    await appendW2DossierMetricRow(row);
    await maybeRotateW2DossierMetricsFile();
    return { stored: true, target: 'file' };
  } catch (e) {
    console.warn('[w2-metrics] file append failed', e);
    return { stored: false, target: 'file' };
  }
}

export async function readW2DossierMetricsUnified(
  maxLines: number
): Promise<Workshop2DossierMetricsPayload[]> {
  if (getW2DossierMetricsUpstashConfig()) {
    try {
      const fromRedis = await upstashReadW2DossierMetricsTail(maxLines);
      if (fromRedis.length > 0) return fromRedis;
    } catch (e) {
      console.warn('[w2-metrics] Upstash read failed, file fallback', e);
    }
  }
  return readW2DossierMetricsTail(maxLines);
}
