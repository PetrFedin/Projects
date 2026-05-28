/**
 * Честный badge PLM outbox в header workspace — pending vs sent-awaiting-ACK.
 */
import { WORKSHOP2_LIVE_INTEGRATION_LABELS } from '@/lib/production/workshop2-integration-live-required';

export type Workshop2PlmOutboxBadgeInput = {
  pending: number;
  awaitingAck: number;
  failed?: number;
  autoAckEnabled?: boolean;
};

export type Workshop2PlmOutboxBadge = {
  labelRu: string;
  shortLabelRu: string;
  tone: 'ok' | 'pending' | 'awaiting_ack' | 'failed';
  titleRu: string;
  showProcessButton: boolean;
  showRetryFailedButton: boolean;
};

function withPlmLiveCeilingHint(titleRu: string, autoAckEnabled?: boolean): string {
  if (autoAckEnabled) return titleRu;
  return `${titleRu} ${WORKSHOP2_LIVE_INTEGRATION_LABELS.plmTransport}`;
}

export function formatWorkshop2PlmOutboxBadge(
  input: Workshop2PlmOutboxBadgeInput
): Workshop2PlmOutboxBadge {
  const pending = Math.max(0, input.pending);
  const awaitingAck = Math.max(0, input.awaitingAck);
  const failed = Math.max(0, input.failed ?? 0);
  const actionable = pending + awaitingAck;
  const liveHint = (title: string) => withPlmLiveCeilingHint(title, input.autoAckEnabled);

  if (failed > 0 && actionable === 0) {
    return {
      labelRu: `PLM: ошибки (${failed})`,
      shortLabelRu: `PLM fail (${failed})`,
      tone: 'failed',
      titleRu: liveHint(
        'События outbox в статусе failed — нажмите «Retry failed» для сброса в pending и повторной отправки.'
      ),
      showProcessButton: false,
      showRetryFailedButton: true,
    };
  }

  if (actionable === 0) {
    return {
      labelRu: 'PLM: синхронизировано',
      shortLabelRu: 'PLM OK',
      tone: 'ok',
      titleRu: input.autoAckEnabled
        ? 'Очередь пуста · WORKSHOP2_PLM_AUTO_ACK включён'
        : liveHint('Очередь пуста · события доставлены или ACK получен'),
      showProcessButton: false,
      showRetryFailedButton: false,
    };
  }

  if (pending > 0 && awaitingAck > 0) {
    return {
      labelRu: `PLM: очередь (${pending}) · ждёт ACK (${awaitingAck})${failed ? ` · fail (${failed})` : ''}`,
      shortLabelRu: `PLM (${actionable})`,
      tone: 'pending',
      titleRu: liveHint(
        'Есть неотправленные события и отправленные без внешнего ACK. Process route + plm-outbox/ack.'
      ),
      showProcessButton: true,
      showRetryFailedButton: failed > 0,
    };
  }

  if (awaitingAck > 0) {
    return {
      labelRu: `PLM: ждёт ACK (${awaitingAck})${failed ? ` · fail (${failed})` : ''}`,
      shortLabelRu: `PLM ACK (${awaitingAck})`,
      tone: 'awaiting_ack',
      titleRu: liveHint(
        'События отправлены на webhook — без WORKSHOP2_PLM_AUTO_ACK нужен внешний ACK (plm-outbox/ack).'
      ),
      showProcessButton: true,
      showRetryFailedButton: failed > 0,
    };
  }

  return {
    labelRu: `PLM: в очереди (${pending})${failed ? ` · fail (${failed})` : ''}`,
    shortLabelRu: `PLM (${pending})`,
    tone: 'pending',
    titleRu: liveHint('События досье ждут process route (webhook + опциональный auto-ACK).'),
    showProcessButton: true,
    showRetryFailedButton: failed > 0,
  };
}

export { fetchWorkshop2PlmOutboxStatus } from '@/lib/production/workshop2-sample-api-client';
