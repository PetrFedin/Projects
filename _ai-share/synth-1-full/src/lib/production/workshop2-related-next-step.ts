/**
 * «Следующий шаг» для полосы связанных разделов — из readiness / overview, не статичный список.
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-catalog';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { evaluateWorkshop2HandoffReadiness } from '@/lib/production/workshop2-handoff-readiness';
import {
  buildWorkshop2OverviewModel,
  toWorkshop2OverviewBundleSnapshot,
  type Workshop2OverviewBundleSnapshot,
} from '@/lib/production/workshop2-overview-model';

export type Workshop2RelatedNextStep = {
  labelRu: string;
  href: string;
  reasonRu: string;
  source: 'handoff' | 'overview';
};

export function suggestWorkshop2RelatedNextStep(input: {
  collectionId: string;
  articleUrlSegment: string;
  dossier: Workshop2DossierPhase1 | null;
  leaf: HandbookCategoryLeaf | null | undefined;
  bundle: Workshop2OverviewBundleSnapshot | null;
  vaultFileCount?: number;
}): Workshop2RelatedNextStep | null {
  const { collectionId, articleUrlSegment, dossier, leaf, bundle } = input;
  if (!dossier) return null;

  const handoff = evaluateWorkshop2HandoffReadiness({
    dossier,
    categoryLeafId: leaf?.leafId,
    vaultFileCount: input.vaultFileCount ?? 0,
  });
  const blocker = handoff.checks.find((c) => c.severity === 'blocker');
  if (blocker) {
    if (blocker.id === 'vault.files.min') {
      return {
        labelRu: 'Документы Vault',
        href: workshop2ArticleHref(collectionId, articleUrlSegment, { w2pane: 'vault' }),
        reasonRu: blocker.messageRu,
        source: 'handoff',
      };
    }
    if (blocker.id === 'tz.overall.min') {
      return {
        labelRu: 'ТЗ · паспорт',
        href: workshop2ArticleHref(collectionId, articleUrlSegment, {
          w2pane: 'tz',
          w2sec: 'general',
        }),
        reasonRu: blocker.messageRu,
        source: 'handoff',
      };
    }
  }

  const overview = buildWorkshop2OverviewModel({
    dossier,
    leaf,
    bundle: bundle ?? toWorkshop2OverviewBundleSnapshot(null),
  });
  const primary = overview.primaryAction;
  const href = workshop2ArticleHref(collectionId, articleUrlSegment, {
    w2pane: primary.tab === 'tz' ? 'tz' : primary.tab,
    ...(primary.dossierSection ? { w2sec: primary.dossierSection } : {}),
  });
  return {
    labelRu: primary.buttonLabel.replace(/\s*>$/, '').trim() || primary.title,
    href,
    reasonRu: primary.reason,
    source: 'overview',
  };
}
