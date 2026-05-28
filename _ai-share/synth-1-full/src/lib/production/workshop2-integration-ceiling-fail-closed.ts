/**
 * Wave 33: второй слой fail-closed для 7 ceilings — export/handoff warnings, без инфляции score.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  buildWorkshop2IntegrationCeilingProbes,
  type Workshop2ProcessEnvLike,
} from '@/lib/production/workshop2-live-integration-probes-env';
import {
  hasWorkshop2CeilingStagingContractAckInDossier,
  isWorkshop2StagingContractModeEnabled,
} from '@/lib/production/workshop2-staging-contract-mode';

export function evaluateWorkshop2IntegrationCeilingExportWarnings(
  env: Workshop2ProcessEnvLike = process.env,
  dossier?: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck[] {
  return buildWorkshop2IntegrationCeilingProbes(env)
    .filter((c) => !c.configured)
    .filter((c) => !hasWorkshop2CeilingStagingContractAckInDossier(dossier, c.catalogId))
    .map((c) => ({
      id: `ceiling.${c.kind}.live_not_configured_export`,
      severity: 'warning' as const,
      messageRu: `#${c.catalogId} export-tz: ${c.unlockHintRu}`,
    }));
}

export function evaluateWorkshop2IntegrationCeilingHandoffWarnings(
  env: Workshop2ProcessEnvLike = process.env,
  dossier?: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck[] {
  const warnings = buildWorkshop2IntegrationCeilingProbes(env)
    .filter((c) => !c.configured)
    .filter((c) => !hasWorkshop2CeilingStagingContractAckInDossier(dossier, c.catalogId))
    .map((c) => ({
      id: `ceiling.${c.kind}.live_not_configured_handoff`,
      severity: 'warning' as const,
      messageRu: `#${c.catalogId} handoff: live integration не настроена — ${c.labelRu}`,
    }));

  const prod = String(env.NODE_ENV ?? process.env.NODE_ENV ?? '').trim() === 'production';
  if (prod && dossier) {
    for (const c of buildWorkshop2IntegrationCeilingProbes(env)) {
      if (c.configured) continue;
      if (hasWorkshop2CeilingStagingContractAckInDossier(dossier, c.catalogId)) continue;
      if ([50, 53, 55, 63, 66, 78].includes(c.catalogId)) {
        warnings.push({
          id: `ceiling.${c.kind}.prod_without_live_ack`,
          severity: 'warning',
          messageRu: `#${c.catalogId} production: нет live partner ACK — только staging contract или live env.`,
        });
      }
    }
  }
  return warnings;
}

/** Блокирует действия, выдающие себя за live registry write-back без env. */
export function evaluateWorkshop2DppRegistryWritebackBlocked(
  env: Workshop2ProcessEnvLike = process.env,
  dossier?: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  if (isWorkshop2StagingContractModeEnabled(env)) return null;
  if (hasWorkshop2CeilingStagingContractAckInDossier(dossier, 50)) return null;
  const ceiling = buildWorkshop2IntegrationCeilingProbes(env).find((x) => x.catalogId === 50);
  if (!ceiling || ceiling.configured) return null;
  return {
    id: 'ceiling.dpp.registry_writeback_blocked',
    severity: 'blocker',
    messageRu: ceiling.unlockHintRu,
  };
}
