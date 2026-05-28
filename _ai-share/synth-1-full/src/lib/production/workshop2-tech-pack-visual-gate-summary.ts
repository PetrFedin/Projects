/**
 * Сводка tech pack + визуальный gate для конструкции (один источник для UI и тестов).
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { techPackAttachmentHasZipSourceBytes } from '@/lib/production/workshop2-tech-pack-attachment-utils';
import { workshop2TechPackCanonicalWizardHintRu } from '@/lib/production/workshop2-tech-pack-canonical-summary';
import {
  buildWorkshop2VisualGateItems,
  collectWorkshop2VisualSectionWarnings,
} from '@/lib/production/workshop2-visual-section-warnings';

export type Workshop2TechPackVisualGateSummary = {
  attachmentCount: number;
  attachmentsWithZipBytes: number;
  verifiedCanonicalCount: number;
  openVisualGateCount: number;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
  visualGateMessages: string[];
};

export function evaluateWorkshop2TechPackVisualGateSummary(
  dossier: Workshop2DossierPhase1 | null | undefined,
  opts?: {
    categoryLeaf?: HandbookCategoryLeaf | null;
    sessionBlobById?: Record<string, string>;
  }
): Workshop2TechPackVisualGateSummary | null {
  if (!dossier) return null;
  const att = dossier.techPackAttachments ?? [];
  const sessionBlobById = opts?.sessionBlobById ?? {};
  const attachmentsWithZipBytes = att.filter((a) =>
    techPackAttachmentHasZipSourceBytes(a, sessionBlobById)
  ).length;
  const verifiedCanonicalCount = att.filter(
    (a) => a.canonicalSource === 'object_store_verified'
  ).length;

  const visualGateMessages = collectWorkshop2VisualSectionWarnings(
    dossier,
    opts?.categoryLeaf ?? null
  );
  const gateItems = buildWorkshop2VisualGateItems(dossier, opts?.categoryLeaf ?? null);
  const openVisualGateCount = gateItems.length;

  let state: Workshop2TechPackVisualGateSummary['state'] = 'empty';
  if (att.length > 0 && attachmentsWithZipBytes === att.length && openVisualGateCount === 0) {
    state = 'ready';
  } else if (att.length > 0 || openVisualGateCount < gateItems.length) {
    state = 'partial';
  }

  let hintRu: string | undefined;
  if (att.length === 0) {
    hintRu = 'Нет вложений tech pack — загрузите CAD/PDF на конструкции.';
  } else if (attachmentsWithZipBytes < att.length) {
    hintRu = `ZIP-готовность: ${attachmentsWithZipBytes} из ${att.length} файлов имеют байты (IDB/сессия/data URL).`;
  } else if (openVisualGateCount > 0) {
    hintRu = `Визуальный gate: ${openVisualGateCount} предупреждений — ${visualGateMessages[0] ?? 'см. блок визуала'}.`;
  } else if (verifiedCanonicalCount === 0) {
    hintRu = workshop2TechPackCanonicalWizardHintRu(att);
  }

  return {
    attachmentCount: att.length,
    attachmentsWithZipBytes,
    verifiedCanonicalCount,
    openVisualGateCount,
    state,
    hintRu,
    visualGateMessages,
  };
}
