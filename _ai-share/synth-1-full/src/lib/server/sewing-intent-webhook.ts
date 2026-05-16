import 'server-only';

import { logObservability } from '@/lib/logger';
import { getUnknownErrorDetail } from '@/lib/unknown-error-message';
import type { SewingOrderIntentServerRecordV1 } from '@/lib/client/sewing-order-intent';

/**
 * Внешний CRM / n8n / brand queue: `SYNTH_SEWING_INTENT_WEBHOOK_URL` (POST JSON).
 * Не блокирует ответ API; ошибки только в логах.
 */
export function forwardSewingIntentToWebhook(record: SewingOrderIntentServerRecordV1): void {
  const url = process.env.SYNTH_SEWING_INTENT_WEBHOOK_URL?.trim();
  if (!url) return;
  void fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'store.sewing_intent_committed',
      record,
    }),
  })
    .then((r) => {
      if (!r.ok) logObservability('sewing_intent_webhook_http', { status: r.status });
    })
    .catch((e) => {
      logObservability('sewing_intent_webhook_failed', { message: getUnknownErrorDetail(e) });
    });
}
