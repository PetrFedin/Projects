import { canonicalPhaseAssignmentFilled } from '@/components/brand/production/workshop2-phase1-dossier-panel-assignment-helpers';
import { getAttributeById } from '@/lib/production/attribute-catalog';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { parseMatRowsFromDossier } from '@/lib/production/workshop2-material-mat-rows';

/** Материал в паспорте + сумма % состава при связке mat+composition (шаги 1–2 «Следующее»). */
export function validateWorkshopMatAndCompositionBlockers(opts: {
  dossier: Workshop2DossierPhase1;
  matLabelById: Map<string, string>;
  linkedMatComposition: boolean;
  /** Если false — проверки mat не выполняются. */
  enforceMat: boolean;
}): string | null {
  if (!opts.enforceMat) return null;
  const matAssign = opts.dossier.assignments.find(
    (x) => x.kind === 'canonical' && x.attributeId === 'mat'
  );
  const hbCount =
    matAssign?.values.filter((v) => v.valueSource === 'handbook_parameter').length ?? 0;
  if (hbCount === 0) return 'Выберите материал.';
  if (opts.linkedMatComposition) {
    const rows = parseMatRowsFromDossier(opts.dossier, opts.matLabelById);
    const sum = rows.reduce((s, r) => s + r.pct, 0);
    if (sum !== 100) {
      return `Сумма процентов состава должна быть ровно 100% (сейчас ${sum}%).`;
    }
  }
  return null;
}

/** Обязательные канонические поля фазы 2 перед шагом 3. */
export function validatePhase2CanonicalRequiredFilled(opts: {
  leafPhase2Ids: readonly string[];
  dossier: Workshop2DossierPhase1;
}): string | null {
  for (const id of opts.leafPhase2Ids) {
    if (id === 'mat') continue;
    const attr = getAttributeById(id);
    if (!attr?.requiredForPhase2) continue;
    const a = opts.dossier.assignments.find((x) => x.kind === 'canonical' && x.attributeId === id);
    if (!canonicalPhaseAssignmentFilled(a, attr)) {
      return `Заполните поле «${attr.name}».`;
    }
  }
  return null;
}
