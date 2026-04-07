import {
  getW2MetricsClientIp,
  isW2MetricsIpInAllowlist,
  parseW2MetricsIpAllowlist,
} from '@/lib/server/workshop2-dossier-metrics-request-ip';

/**
 * Единый секрет для чтения метрик: достаточно задать W2_DOSSIER_METRICS_READ_SECRET
 * или W2_ADMIN_DOSSIER_METRICS_SECRET (достаточно одного).
 * Опционально: W2_DOSSIER_METRICS_READ_IP_ALLOWLIST — только перечисленные IP (точное совпадение).
 */

export function getW2DossierMetricsUnifiedReadSecret(): string | null {
  return (
    process.env.W2_DOSSIER_METRICS_READ_SECRET?.trim() ||
    process.env.W2_ADMIN_DOSSIER_METRICS_SECRET?.trim() ||
    null
  );
}

function readIpAllowlist(): Set<string> {
  return parseW2MetricsIpAllowlist(process.env.W2_DOSSIER_METRICS_READ_IP_ALLOWLIST);
}

/** Допуск: Authorization: Bearer <secret> или X-W2-Metrics-Key: <secret> (для curl/прокси). */
export function verifyW2DossierMetricsReadRequest(request: Request): boolean {
  const allowedIps = readIpAllowlist();
  if (allowedIps.size > 0) {
    const ip = getW2MetricsClientIp(request);
    if (!isW2MetricsIpInAllowlist(ip, allowedIps)) {
      return false;
    }
  }

  const secret = getW2DossierMetricsUnifiedReadSecret();
  if (!secret) return true;
  const auth = request.headers.get('authorization');
  const key = request.headers.get('x-w2-metrics-key');
  if (auth === `Bearer ${secret}`) return true;
  if (key === secret) return true;
  return false;
}
