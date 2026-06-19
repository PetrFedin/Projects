/**
 * Wave 20 #18: аудит PLM outbox в досье + gate handoff/export chains.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  formatWorkshop2PlmOutboxBadge,
  type Workshop2PlmOutboxBadgeInput,
} from '@/lib/production/workshop2-plm-outbox-badge';
import { isWorkshop2LivePlmTransportConfigured } from '@/lib/production/workshop2-live-integration-probes-env';
import {
  workshop2PgMirrorNum,
  workshop2PgMirrorStr,
} from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export function buildWorkshop2PlmOutboxAuditFromCounts(
  input: Workshop2PlmOutboxBadgeInput
): NonNullable<Workshop2DossierPhase1['plmOutboxAudit']> {
  const badge = formatWorkshop2PlmOutboxBadge(input);
  return {
    auditedAt: new Date().toISOString(),
    pending: Math.max(0, input.pending),
    awaitingAck: Math.max(0, input.awaitingAck),
    failed: Math.max(0, input.failed ?? 0),
    autoAckEnabled: Boolean(input.autoAckEnabled),
    tone: badge.tone,
  };
}

export function buildWorkshop2PlmOutboxMirrorFromCounts(
  input: Workshop2PlmOutboxBadgeInput
): NonNullable<Workshop2DossierPhase1['plmOutboxMirror']> {
  const audit = buildWorkshop2PlmOutboxAuditFromCounts(input);
  const blockerHandoff = audit.failed > 0;
  const blockerSampleOrder = audit.failed > 0;

  let hintRu: string | undefined;
  if (blockerHandoff) {
    hintRu = `PLM outbox: ${audit.failed} failed — retry перед образцом/handoff.`;
  } else if (audit.pending > 0 || audit.awaitingAck > 0) {
    hintRu = `PLM: ${audit.pending} pending, ${audit.awaitingAck} ждут ACK.`;
  }

  const transportKind: 'outbox_journal' | 'live_partner' = isWorkshop2LivePlmTransportConfigured()
    ? 'live_partner'
    : 'outbox_journal';
  const serverWorkflowEnabled = transportKind === 'outbox_journal' && audit.failed === 0;

  return {
    mirroredAt: audit.auditedAt,
    pending: audit.pending,
    awaitingAck: audit.awaitingAck,
    failed: audit.failed,
    autoAckEnabled: audit.autoAckEnabled,
    tone: audit.tone,
    transportKind,
    serverWorkflowEnabled,
    blockerSampleOrder,
    blockerHandoff,
    hintRu:
      hintRu ??
      (transportKind === 'outbox_journal'
        ? 'PLM: outbox journal (без live webhook) — Process disabled до env.'
        : undefined),
  };
}

export function persistWorkshop2PlmOutboxAuditToDossier(
  dossier: Workshop2DossierPhase1,
  counts: Workshop2PlmOutboxBadgeInput
): Workshop2DossierPhase1 {
  const audit = buildWorkshop2PlmOutboxAuditFromCounts(counts);
  const mirror = buildWorkshop2PlmOutboxMirrorFromCounts(counts);
  return {
    ...dossier,
    plmOutboxAudit: audit,
    plmOutboxMirror: mirror,
  };
}

export function evaluateWorkshop2PlmOutboxSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.plmOutboxMirror;
  if (!mirror) {
    return {
      id: 'plm.outbox.mirror_missing',
      severity: 'warning',
      messageRu: 'PLM outbox не в PG — «PLM → PG» в шапке перед образцом.',
    };
  }
  if (mirror.blockerSampleOrder === true) {
    return {
      id: 'plm.outbox.failed',
      severity: 'blocker',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        `PLM outbox: ${workshop2PgMirrorNum(mirror, 'failed')} failed — исправьте очередь перед образцом.`,
    };
  }
  const pending = workshop2PgMirrorNum(mirror, 'pending');
  if (pending > 5) {
    return {
      id: 'plm.outbox.pending_high',
      severity: 'warning',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        `PLM: ${pending} pending — process outbox перед образцом.`,
    };
  }
  return null;
}

/** Wave 35 #18: export-tz — PLM transport journal vs live. */
export function evaluateWorkshop2PlmOutboxExportGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.plmOutboxMirror;
  if (!mirror) {
    return {
      id: 'plm.outbox.export_missing',
      severity: 'warning',
      messageRu: 'ZIP ТЗ: PLM outbox не в досье.',
    };
  }
  const failed = workshop2PgMirrorNum(mirror, 'failed');
  if (failed > 0) {
    return {
      id: 'plm.outbox.export_failed',
      severity: 'blocker',
      messageRu: workshop2PgMirrorStr(mirror, 'hintRu') || 'ZIP ТЗ: PLM outbox failed.',
    };
  }
  return null;
}

/** Блокирует handoff commit при failed outbox; warning при pending без свежего аудита. */
export function evaluateWorkshop2PlmOutboxHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const audit = dossier.plmOutboxMirror ?? dossier.plmOutboxAudit;
  if (!audit) {
    return {
      id: 'plm.outbox.audit_missing',
      severity: 'warning',
      messageRu:
        'PLM outbox не зафиксирован в досье — нажмите «Аудит PLM в досье» в шапке перед передачей в цех.',
    };
  }
  const auditFailed =
    'failed' in audit && typeof audit.failed === 'number'
      ? audit.failed
      : workshop2PgMirrorNum(audit as Workshop2DossierPhase1['plmOutboxMirror'], 'failed');
  if (auditFailed > 0) {
    return {
      id: 'plm.outbox.failed',
      severity: 'blocker',
      messageRu: `PLM outbox: ${auditFailed} событий failed — retry failed и process перед handoff.`,
    };
  }
  const auditPending =
    'pending' in audit && typeof audit.pending === 'number'
      ? audit.pending
      : workshop2PgMirrorNum(audit as Workshop2DossierPhase1['plmOutboxMirror'], 'pending');
  const auditAwaitingAck =
    'awaitingAck' in audit && typeof audit.awaitingAck === 'number'
      ? audit.awaitingAck
      : workshop2PgMirrorNum(audit as Workshop2DossierPhase1['plmOutboxMirror'], 'awaitingAck');
  if (auditPending > 0 || auditAwaitingAck > 0) {
    const auditedAt =
      'auditedAt' in audit && typeof audit.auditedAt === 'string'
        ? audit.auditedAt
        : workshop2PgMirrorStr(audit as Workshop2DossierPhase1['plmOutboxMirror'], 'mirroredAt');
    const ageMs = auditedAt ? Date.now() - new Date(auditedAt).getTime() : 0;
    if (ageMs > 24 * 60 * 60 * 1000) {
      return {
        id: 'plm.outbox.stale_audit',
        severity: 'warning',
        messageRu: `PLM: ${auditPending} pending, ${auditAwaitingAck} ждут ACK — обновите аудит в досье.`,
      };
    }
  }
  return null;
}
