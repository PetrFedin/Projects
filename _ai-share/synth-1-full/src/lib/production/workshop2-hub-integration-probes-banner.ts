/**
 * Wave 4 P2 #9 + Wave 6: consolidated integration probes one-liner для hub banner.
 */
import type { Workshop2IntegrationProbesResponse } from '@/lib/production/workshop2-live-integration-probes-client';

export function summarizeWorkshop2HubIntegrationProbesOneLiner(
  probes: Workshop2IntegrationProbesResponse | null | undefined
): string | null {
  if (!probes) {
    return 'Интеграции: probes offline — GET /api/workshop2/integration-probes недоступен.';
  }

  const w4 = probes.wave4Horizontal;
  const w6 = probes.wave6Horizontal;
  const parts: string[] = [];
  const market = (probes as { market?: string }).market ?? 'ru';
  parts.push(`market: ${market}`);

  if (probes.readyForInvestorDemo) {
    parts.push('investor demo ready');
  } else {
    parts.push('investor demo не готов');
    parts.push('→ /api/workshop2/investor-readiness');
  }

  if (w6?.domainEventsSse?.configured) {
    parts.push('domain events SSE');
  }

  if (w4?.pgOnlyMode?.enabled) {
    parts.push('PG-only');
  }
  if (w4?.ediInbound?.configured) {
    parts.push('EDI journal');
  }
  if (market === 'global' && w4?.shopifyOAuth?.configured) {
    parts.push(`Shopify ${w4.shopifyOAuth.status}`);
  }
  const w9 = (probes as { wave9RuHorizontal?: { moySklad?: { configured: boolean } } })
    .wave9RuHorizontal;
  if (market === 'ru' && w9?.moySklad?.configured) {
    parts.push('МойСклад');
  }
  if (w4?.b2bCommission?.configured) {
    parts.push('commission stub');
  }

  const w3 = probes.wave3Horizontal;
  if (w3?.b2bCreditHold?.enabled) parts.push('credit hold');
  if (w3?.cutTicketGate?.enabled) parts.push('cut ticket gate');

  return `Probes: ${parts.join(' · ')}.`;
}
