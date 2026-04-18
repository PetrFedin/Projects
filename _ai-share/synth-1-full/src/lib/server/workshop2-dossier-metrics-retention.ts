import { truncateW2DossierMetricsFile } from '@/lib/server/workshop2-dossier-metrics-store';
import {
  getW2DossierMetricsUpstashConfig,
  upstashDeleteW2DossierMetricsList,
} from '@/lib/server/workshop2-dossier-metrics-upstash';

/**
 * После успешной выгрузки архива — опционально очистить «горячий» источник.
 * Включать только осознанно: новые события до следующего архива теряются для hot-хвоста.
 */
export async function applyW2MetricsHotSourceRetentionAfterArchive(): Promise<{
  redisCleared: boolean;
  fileTruncated: boolean;
}> {
  let redisCleared = false;
  let fileTruncated = false;

  if (
    process.env.W2_METRICS_ARCHIVE_AFTER_SUCCESS_CLEAR_REDIS === '1' &&
    getW2DossierMetricsUpstashConfig()
  ) {
    await upstashDeleteW2DossierMetricsList();
    redisCleared = true;
  }

  if (process.env.W2_METRICS_ARCHIVE_AFTER_SUCCESS_TRUNCATE_FILE === '1') {
    await truncateW2DossierMetricsFile();
    fileTruncated = true;
  }

  return { redisCleared, fileTruncated };
}
