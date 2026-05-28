/**
 * Wave 41 #50: JSON-LD schema validator для DPP export (blocker только при invalid schema).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2DppExportBlock,
  buildWorkshop2DppJsonLdStub,
} from '@/lib/production/workshop2-dpp-export';

export type Workshop2DppJsonLdValidationIssue = {
  code: string;
  messageRu: string;
  path?: string;
};

export type Workshop2DppJsonLdValidationResult = {
  validatedAt: string;
  state: 'valid' | 'invalid';
  issueCount: number;
  issues: Workshop2DppJsonLdValidationIssue[];
  previewJsonLd: Record<string, unknown>;
  hintRu?: string;
};

function pushIssue(
  issues: Workshop2DppJsonLdValidationIssue[],
  code: string,
  messageRu: string,
  path?: string
) {
  issues.push({ code, messageRu, path });
}

/** Валидация JSON-LD перед ZIP/export — не требует live registry. */
export function validateWorkshop2DppJsonLdForExport(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  articleSku?: string;
  articleName?: string;
}): Workshop2DppJsonLdValidationResult {
  const block = buildWorkshop2DppExportBlock(input);
  const jsonLd = buildWorkshop2DppJsonLdStub(block);
  const issues: Workshop2DppJsonLdValidationIssue[] = [];

  if (!block.passportId?.trim()) {
    pushIssue(issues, 'missing_passport_id', 'passportId обязателен для DPP JSON-LD.', '@id');
  }
  if (!block.compositionText?.trim() && block.materials.length === 0) {
    pushIssue(issues, 'missing_composition', 'Нет состава — заполните BOM или бирку.', 'material');
  }
  if (!jsonLd['@context']) {
    pushIssue(issues, 'missing_context', 'JSON-LD @context отсутствует.', '@context');
  }
  if (jsonLd['@type'] !== 'Product') {
    pushIssue(issues, 'invalid_type', '@type должен быть Product.', '@type');
  }
  const props = jsonLd.additionalProperty;
  if (!Array.isArray(props) || props.length < 3) {
    pushIssue(
      issues,
      'sparse_properties',
      'additionalProperty слишком короткий — проверьте metrics из BOM.',
      'additionalProperty'
    );
  }
  const carbon = block.metrics.carbonFootprint;
  if (carbon == null || Number.isNaN(Number(carbon))) {
    pushIssue(
      issues,
      'invalid_carbon',
      'carbonFootprint из BOM не число.',
      'metrics.carbonFootprint'
    );
  }
  if (block.registryStub.registryId != null) {
    pushIssue(
      issues,
      'unexpected_registry_id',
      'registryId должен быть null без live write-back.',
      'registryStub.registryId'
    );
  }

  const state = issues.length === 0 ? 'valid' : 'invalid';
  return {
    validatedAt: new Date().toISOString(),
    state,
    issueCount: issues.length,
    issues,
    previewJsonLd: jsonLd,
    hintRu:
      state === 'valid'
        ? 'JSON-LD прошёл schema validator — export preview/ZIP разрешён (без live registry).'
        : `JSON-LD invalid (${issues.length}) — исправьте поля перед export.`,
  };
}

export function persistWorkshop2DppJsonLdValidationToDossier(
  dossier: Workshop2DossierPhase1,
  input: Parameters<typeof validateWorkshop2DppJsonLdForExport>[0]
): Workshop2DossierPhase1 {
  const result = validateWorkshop2DppJsonLdForExport(input);
  return {
    ...dossier,
    dppExportValidation: {
      validatedAt: result.validatedAt,
      state: result.state === 'valid' ? 'ready' : 'blocked',
      hintRu: result.hintRu,
      schemaState: result.state,
      issueCount: result.issueCount,
      previewAvailable: true,
    },
  };
}
