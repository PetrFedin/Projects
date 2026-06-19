/**
 * Wave B2 + E1: Centric BOM import, conflict detection, RFQ thread message.
 */
import 'server-only';

import type { Workshop2ProductionMaterialLine } from '@/lib/production/workshop2-dossier-phase1.types';
import { WORKSHOP2_ARTICLE_CONTEXT_TYPE } from '@/lib/production/workshop2-domain-event-types';
import { appendWorkshop2ContextualSystemMessage } from '@/lib/server/workshop2-contextual-messages-repository';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { upsertExternalRef } from './integration-external-refs-persistence.file';

export type CentricBomLineInput = {
  materialName: string;
  consumption?: number;
  unit?: string;
  supplier?: string;
};

export type CentricBomConflict = {
  materialName: string;
  kind: 'missing_in_syntha' | 'missing_in_centric' | 'consumption_mismatch';
  centricValue?: string;
  synthaValue?: string;
};

export type CentricBomImportResult = {
  articleId: string;
  centricStyleId: string;
  conflicts: CentricBomConflict[];
  centricLineCount: number;
  synthaLineCount: number;
  hasBlockingConflicts: boolean;
};

function normName(s: string): string {
  return s.trim().toLowerCase();
}

function synthaConsumption(line: Workshop2ProductionMaterialLine): number {
  return line.yieldPerUnit ?? line.consumption ?? 0;
}

export function detectCentricBomConflicts(
  centricLines: CentricBomLineInput[],
  synthaLines: Workshop2ProductionMaterialLine[]
): CentricBomConflict[] {
  const conflicts: CentricBomConflict[] = [];
  const synthaByName = new Map(synthaLines.map((l) => [normName(l.materialName), l]));
  const centricNames = new Set<string>();

  for (const c of centricLines) {
    const key = normName(c.materialName);
    if (!key) continue;
    centricNames.add(key);
    const syntha = synthaByName.get(key);
    if (!syntha) {
      conflicts.push({
        materialName: c.materialName,
        kind: 'missing_in_syntha',
        centricValue: String(c.consumption ?? '—'),
      });
      continue;
    }
    const cCons = c.consumption ?? 0;
    const sCons = synthaConsumption(syntha);
    if (cCons > 0 && sCons > 0 && Math.abs(cCons - sCons) > 0.01) {
      conflicts.push({
        materialName: c.materialName,
        kind: 'consumption_mismatch',
        centricValue: String(cCons),
        synthaValue: String(sCons),
      });
    }
  }

  for (const s of synthaLines) {
    const key = normName(s.materialName);
    if (!key || centricNames.has(key)) continue;
    conflicts.push({
      materialName: s.materialName,
      kind: 'missing_in_centric',
      synthaValue: String(synthaConsumption(s)),
    });
  }

  return conflicts;
}

export async function importCentricBom(input: {
  styleId: string;
  collectionId: string;
  articleId: string;
  lines: CentricBomLineInput[];
  organizationId?: string;
}): Promise<CentricBomImportResult> {
  const org = input.organizationId?.trim() || 'org-brand-001';
  const record = await getWorkshop2ServerDossierRecord(input.collectionId, input.articleId);
  const synthaLines = record?.dossier?.productionModel?.materialLines ?? [];
  const conflicts = detectCentricBomConflicts(input.lines, synthaLines);

  upsertExternalRef({
    platform: 'centric',
    externalId: input.styleId,
    externalRevision: 'BOM',
    synthaEntityType: 'article',
    synthaEntityId: input.articleId,
    lastSyncedAt: new Date().toISOString(),
    syncDirection: 'inbound',
  });

  const articleCtx = `${input.collectionId}:${input.articleId}`;
  const conflictSummary =
    conflicts.length === 0
      ? 'BOM совпадает с досье Syntha.'
      : `BOM Centric: ${conflicts.length} расхождений — ${conflicts
          .slice(0, 3)
          .map((c) => c.materialName)
          .join(', ')}`;

  await appendWorkshop2ContextualSystemMessage({
    organizationId: org,
    contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
    contextId: articleCtx,
    message: `Centric BOM import · ${input.styleId} · ${conflictSummary}`,
  });

  return {
    articleId: input.articleId,
    centricStyleId: input.styleId,
    conflicts,
    centricLineCount: input.lines.length,
    synthaLineCount: synthaLines.length,
    hasBlockingConflicts: conflicts.some((c) => c.kind !== 'consumption_mismatch'),
  };
}
