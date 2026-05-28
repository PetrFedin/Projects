/**
 * Wave 11: компактная сводка РФ для шапки workspace (~80 lines total with UI).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { calculateDossierReadiness } from '@/lib/production/dossier-readiness-engine';
import { formatWorkshop2RubCurrency } from '@/lib/production/workshop2-rub-currency';
import { resolveWorkshop2CostingRubFromDossier } from '@/lib/production/workshop2-dossier-costing-rub';
import { workshop2EdoStatusLabelRu } from '@/lib/production/workshop2-edo-signoff';
import { buildWorkshop2MarkingWizardSteps } from '@/lib/production/workshop2-marking-honest-sign';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';

export type Workshop2RuStatusStripSummary = {
  totalRubLabel: string | null;
  edoLabelRu: string;
  markingLabelRu: string;
  gateBlockerCount: number;
  hintRu?: string;
  /** Wave 13: click targets для сегментов полосы. */
  edoHref?: string;
  markingHref?: string;
  supplyHref?: string;
};

export function summarizeWorkshop2RuStatusStrip(
  dossier: Workshop2DossierPhase1 | null | undefined,
  nav?: { collectionId: string; articleId: string; articleUrlSegment?: string }
): Workshop2RuStatusStripSummary | null {
  if (!dossier) return null;

  const readiness = calculateDossierReadiness(dossier, null);
  const gateBlockerCount = readiness.overall.missingGates?.length ?? 0;
  const costing = resolveWorkshop2CostingRubFromDossier(dossier);
  const totalRubLabel =
    costing && costing.estimatedFobRub > 0
      ? formatWorkshop2RubCurrency(costing.estimatedFobRub)
      : null;

  const edo = dossier.edoSignoffMirror;
  const edoLabelRu = edo
    ? (edo.statusLabelRu ?? workshop2EdoStatusLabelRu(edo.edoStatus))
    : 'ЭДО —';

  const markingSteps = buildWorkshop2MarkingWizardSteps(dossier);
  const activeMarking = markingSteps.find((s) => s.status === 'active');
  const markingLabelRu =
    dossier.markingHonestSignMirror?.status === 'journal_only'
      ? 'ЧЗ journal'
      : (activeMarking?.labelRu?.slice(0, 24) ?? 'ЧЗ —');

  let hintRu: string | undefined;
  if (gateBlockerCount > 0) {
    hintRu = `${gateBlockerCount} блокер(ов) ворот ТЗ`;
  }

  const segment = (nav?.articleUrlSegment ?? nav?.articleId ?? '').trim();
  const cid = nav?.collectionId?.trim() ?? '';
  const edoHref =
    cid && segment
      ? workshop2ArticleHref(cid, segment, { w2pane: 'assignment', w2sec: 'construction' })
      : undefined;
  const markingHref =
    cid && segment
      ? workshop2ArticleHref(cid, segment, { w2pane: 'tz', w2sec: 'compliance' })
      : undefined;
  const supplyHref =
    cid && segment ? workshop2ArticleHref(cid, segment, { w2pane: 'supply' }) : undefined;

  return {
    totalRubLabel,
    edoLabelRu,
    markingLabelRu,
    gateBlockerCount,
    hintRu,
    edoHref,
    markingHref,
    supplyHref,
  };
}
