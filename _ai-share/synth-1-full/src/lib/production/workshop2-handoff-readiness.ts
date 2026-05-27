/**
 * Серверная проверка готовности к передаче: vault + пороги ТЗ.
 */
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { getWorkshop2ReadinessSnapshot } from '@/lib/production/workshop2-readiness-snapshot';

export type Workshop2HandoffReadinessCheck = {
  id: string;
  severity: 'blocker' | 'warning';
  messageRu: string;
};

export type Workshop2HandoffReadinessResult = {
  ready: boolean;
  vaultFileCount: number;
  tzOverallPct: number;
  preflightScore: number;
  checks: Workshop2HandoffReadinessCheck[];
  /** 0–10 для хаба/API (blocker снижает сильнее warning). */
  score10: number;
};

export type Workshop2HandoffReadinessInput = {
  dossier: Workshop2DossierPhase1;
  categoryLeafId?: string;
  vaultFileCount: number;
  minVaultFiles?: number;
  minTzOverallPct?: number;
};

/** Пороги по умолчанию для handoff gate. */
export const WORKSHOP2_HANDOFF_DEFAULT_MIN_VAULT_FILES = 1;
export const WORKSHOP2_HANDOFF_DEFAULT_MIN_TZ_PCT = 70;

export function evaluateWorkshop2HandoffReadiness(
  input: Workshop2HandoffReadinessInput
): Workshop2HandoffReadinessResult {
  const minVault = input.minVaultFiles ?? WORKSHOP2_HANDOFF_DEFAULT_MIN_VAULT_FILES;
  const minTz = input.minTzOverallPct ?? WORKSHOP2_HANDOFF_DEFAULT_MIN_TZ_PCT;
  const leaf = input.categoryLeafId ? (findHandbookLeafById(input.categoryLeafId) ?? null) : null;
  const readiness = getWorkshop2ReadinessSnapshot({
    dossier: input.dossier,
    leaf,
  });
  const checks: Workshop2HandoffReadinessCheck[] = [];

  if (input.vaultFileCount < minVault) {
    checks.push({
      id: 'vault.files.min',
      severity: 'blocker',
      messageRu: `В Vault нужно минимум ${minVault} файл(ов) с storage_path (сейчас ${input.vaultFileCount}).`,
    });
  }

  if (readiness.tzOverallPct < minTz) {
    checks.push({
      id: 'tz.overall.min',
      severity: 'blocker',
      messageRu: `Готовность ТЗ ${readiness.tzOverallPct}% ниже порога ${minTz}%.`,
    });
  }

  const pomRows = input.dossier.sampleBasePerSizeDimensions ?? {};
  const hasPom = Object.keys(pomRows).length > 0;
  if (!hasPom) {
    checks.push({
      id: 'construction.pom.empty',
      severity: 'warning',
      messageRu: 'Табель мер (POM) пуст — рекомендуем подставить шаблон на шаге «Мерки».',
    });
  }

  const cadMeta = (input.dossier.techPackAttachments ?? []).some(
    (a) => a.sourceKind === 'cad' || a.remoteObjectKey
  );
  const vaultCadHint = input.vaultFileCount > 0;
  if (!cadMeta && !vaultCadHint) {
    checks.push({
      id: 'cad.missing',
      severity: 'warning',
      messageRu: 'Нет CAD/лекал в vault или tech pack — загрузите DXF/PDF через CAD ingest.',
    });
  }

  const blockers = checks.filter((c) => c.severity === 'blocker');
  const warnings = checks.filter((c) => c.severity === 'warning');
  const score10 = Math.max(0, Math.min(10, 10 - blockers.length * 3 - warnings.length * 0.5));
  return {
    ready: blockers.length === 0,
    vaultFileCount: input.vaultFileCount,
    tzOverallPct: readiness.tzOverallPct,
    preflightScore: readiness.preflightScore,
    checks,
    score10: blockers.length === 0 && warnings.length === 0 ? 10 : Number(score10.toFixed(1)),
  };
}
