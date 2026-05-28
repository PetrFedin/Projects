/**
 * Wave V — честный chip интеграционного здоровья hub toolbar (readyForInvestorDemo из probes API).
 */
import type { Workshop2UxStatusChip } from '@/lib/production/workshop2-ux-phase1-helpers';
import type { Workshop2IntegrationProbesResponse } from '@/lib/production/workshop2-live-integration-probes-client';

export function summarizeWorkshop2HubIntegrationHealthChip(
  probes: Workshop2IntegrationProbesResponse | null | undefined
): Workshop2UxStatusChip | null {
  if (!probes) {
    return {
      id: 'integration-health',
      label: 'Интеграции: offline',
      hintRu: 'GET /api/workshop2/integration-probes недоступен — dev-сервер или сеть.',
      tone: 'rose',
    };
  }

  const ready = probes.readyForInvestorDemo === true;
  const configuredCount = probes.probeFlags
    ? Object.values(probes.probeFlags).filter((f) => f.configured).length
    : 0;
  const liveCount = probes.probeFlags
    ? Object.values(probes.probeFlags).filter((f) => f.live).length
    : 0;

  if (ready) {
    return {
      id: 'integration-health',
      label: probes.stagingContractMode ? 'Demo: staging contract' : 'Investor demo: ready',
      hintRu: probes.stagingContractMode
        ? 'WORKSHOP2_STAGING_CONTRACT_MODE — mock ACK, не prod live.'
        : configuredCount === 0
          ? 'Все 7 ceilings disabled — честный file-store режим.'
          : `Ceilings configured ${configuredCount} · prod live ${liveCount}.`,
      tone: probes.stagingContractMode ? 'amber' : 'emerald',
    };
  }

  return {
    id: 'integration-health',
    label: 'Investor demo: не готов',
    hintRu:
      'localhost/staging URL без prod live — readyForInvestorDemo=false (Wave O honesty). Настройте partner URL или отключите ceilings.',
    tone: 'amber',
  };
}
