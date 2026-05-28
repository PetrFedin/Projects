/**
 * Wave 6 P0: SSE probe + event envelope для domain-events outbox poll stream.
 */
import type { Workshop2DomainEventEnvelope } from '@/lib/production/workshop2-domain-event-types';

export type Workshop2DomainEventsSseEvent =
  | { type: 'ping'; ts: string }
  | { type: 'domain_event'; event: Workshop2DomainEventEnvelope }
  | { type: 'heartbeat'; ts: string; since?: string };

export function formatWorkshop2DomainEventsSseData(event: Workshop2DomainEventsSseEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export function probeWorkshop2DomainEventsSse(env?: Record<string, string | undefined>): {
  configured: boolean;
  streamPath: string;
  pollIntervalMs: number;
  messageRu: string;
} {
  const pollRaw = String(
    env?.WORKSHOP2_DOMAIN_EVENTS_SSE_POLL_MS ??
      process.env.WORKSHOP2_DOMAIN_EVENTS_SSE_POLL_MS ??
      '2500'
  ).trim();
  const pollIntervalMs = Number(pollRaw);
  return {
    configured: true,
    streamPath: '/api/workshop2/domain-events/subscribe/stream',
    pollIntervalMs:
      Number.isFinite(pollIntervalMs) && pollIntervalMs >= 500 ? pollIntervalMs : 2500,
    messageRu: 'SSE stream из outbox poll — heartbeat + reconnect-friendly (без fake push ACK).',
  };
}
