/**
 * DPP export: блокировка пустого JSON-LD в TZ bundle (wave 18 #50).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  extractWorkshop2DppMaterialsFromDossier,
  buildWorkshop2DppExportBlock,
} from '@/lib/production/workshop2-dpp-export';
import { validateWorkshop2DppJsonLdForExport } from '@/lib/production/workshop2-dpp-jsonld-validator';

export function evaluateWorkshop2DppExportGate(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  articleSku?: string;
  articleName?: string;
}): Workshop2HandoffReadinessCheck | null {
  const materials = extractWorkshop2DppMaterialsFromDossier(input.dossier);
  const block = buildWorkshop2DppExportBlock({
    dossier: input.dossier,
    collectionId: input.collectionId,
    articleId: input.articleId,
    articleSku: input.articleSku,
    articleName: input.articleName,
  });
  const hasComposition =
    Boolean(block.compositionText?.trim()) || materials.some((m) => Boolean(m.name?.trim()));
  const hasPassport = Boolean(block.passportId?.trim());

  if (!hasPassport) {
    return {
      id: 'dpp.passport.missing',
      severity: 'blocker',
      messageRu: 'DPP: нет passportId — заполните BOM или материалы в ТЗ.',
    };
  }
  if (!hasComposition) {
    return {
      id: 'dpp.composition.missing',
      severity: 'blocker',
      messageRu:
        'DPP: нет состава — заполните BOM, бирку состава или fiber rows перед экспортом в ZIP ТЗ.',
    };
  }
  const schema = validateWorkshop2DppJsonLdForExport(input);
  if (schema.state === 'invalid') {
    return {
      id: 'dpp.jsonld.schema_invalid',
      severity: 'blocker',
      messageRu: schema.hintRu ?? 'DPP JSON-LD не прошёл schema validator.',
    };
  }
  if (block.registryStub.registryId != null) {
    return {
      id: 'dpp.registry.unexpected',
      severity: 'warning',
      messageRu: 'EU registry write-back не подключён — registryId должен оставаться null.',
    };
  }
  return null;
}

export function buildWorkshop2DppExportValidationRecord(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  articleSku?: string;
  articleName?: string;
}): {
  validatedAt: string;
  state: 'ready' | 'blocked';
  hintRu?: string;
  schemaState?: 'valid' | 'invalid';
  issueCount?: number;
  previewAvailable?: boolean;
} {
  const schema = validateWorkshop2DppJsonLdForExport(input);
  const check = evaluateWorkshop2DppExportGate(input);
  return {
    validatedAt: schema.validatedAt,
    state: check?.severity === 'blocker' ? 'blocked' : 'ready',
    hintRu: check?.messageRu ?? schema.hintRu,
    schemaState: schema.state,
    issueCount: schema.issueCount,
    previewAvailable: true,
  };
}
