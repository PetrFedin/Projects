/**
 * Wave 24 #38: зеркало POM table + gate handoff-commit.
 */
import { summarizeWorkshop2PomTableStatus } from '@/lib/production/workshop2-pom-table-status';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export function buildWorkshop2PomTableMirror(
  dossier: Workshop2DossierPhase1
): NonNullable<Workshop2DossierPhase1['pomTableMirror']> {
  const status = summarizeWorkshop2PomTableStatus(dossier);
  const applyLogCount = dossier.pomTemplateApplyLog?.length ?? 0;
  const blockerHandoff = status.state !== 'ready';

  return {
    mirroredAt: new Date().toISOString(),
    measurementRowCount: status.measurementRowCount,
    perSizeFilledCells: status.filledPerSizeCells,
    technologistSigned: status.technologistSigned,
    pomApplyLogCount: applyLogCount,
    state: status.state,
    blockerHandoff,
    hintRu: status.hintRu,
  };
}

export function persistWorkshop2PomTableMirrorToDossier(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    pomTableMirror: buildWorkshop2PomTableMirror(dossier),
  };
}

export function evaluateWorkshop2PomTableHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.pomTableMirror;
  if (!mirror) {
    const live = summarizeWorkshop2PomTableStatus(dossier);
    if (live.state !== 'ready') {
      return {
        id: 'pom.table.not_ready',
        severity: 'blocker',
        messageRu:
          live.hintRu ?? 'Табель POM не готов — примените шаблон или импорт CAD перед handoff.',
      };
    }
    return {
      id: 'pom.table.mirror_missing',
      severity: 'warning',
      messageRu: 'POM snapshot не в PG — «POM → PG» на конструкции.',
    };
  }
  if (mirror.blockerHandoff) {
    return {
      id: 'pom.table.not_ready',
      severity: 'blocker',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        'Табель POM не готов — handoff commit заблокирован до заполнения мерок.',
    };
  }
  return null;
}
