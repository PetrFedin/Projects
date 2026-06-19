/**
 * Wave 27 #23: зеркало related strip + gate sample-order.
 */
import {
  buildWorkshop2RelatedSectionsBundle,
  type Workshop2RelatedSectionLink,
} from '@/lib/production/workshop2-related-sections';
import { countWorkshop2VaultDocumentsForRelatedStrip } from '@/lib/production/workshop2-related-vault-enrichment';
import type { Workshop2ArticleMainTab } from '@/lib/production/workshop2-collection-metrics';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';
import type { Workshop2RelatedNextStep } from '@/lib/production/workshop2-related-next-step';

export function buildWorkshop2RelatedSectionsMirror(input: {
  collectionId: string;
  articleUrlSegment: string;
  activeTab: Workshop2ArticleMainTab | 'overview';
  dossier: Workshop2DossierPhase1;
  nextStep?: Workshop2RelatedNextStep | null;
  sampleOrderStatus?: string;
}): NonNullable<Workshop2DossierPhase1['relatedSectionsMirror']> {
  const bundle = buildWorkshop2RelatedSectionsBundle({
    collectionId: input.collectionId,
    articleUrlSegment: input.articleUrlSegment,
    activeTab: input.activeTab,
    dossier: input.dossier,
    nextStep: input.nextStep,
    sampleOrderStatus: input.sampleOrderStatus,
  });
  const vaultDocCount = countWorkshop2VaultDocumentsForRelatedStrip(input.dossier);
  const hasNextStep = Boolean(bundle.nextStep);
  const blockerSampleOrder = vaultDocCount === 0;

  let hintRu: string | undefined;
  if (blockerSampleOrder) {
    hintRu = 'Vault пуст — загрузите tech pack / CAD перед заказом образца.';
  } else if (!hasNextStep && bundle.links.length < 6) {
    hintRu = 'Мало перекрёстных ссылок — проверьте заполнение ТЗ.';
  }

  return {
    mirroredAt: new Date().toISOString(),
    linkCount: bundle.links.length,
    vaultDocCount,
    hasNextStep,
    activeTab: input.activeTab,
    blockerSampleOrder,
    hintRu,
  };
}

export function persistWorkshop2RelatedSectionsMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  input: {
    collectionId: string;
    articleUrlSegment: string;
    activeTab: Workshop2ArticleMainTab | 'overview';
    nextStep?: Workshop2RelatedNextStep | null;
    sampleOrderStatus?: string;
  }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    relatedSectionsMirror: buildWorkshop2RelatedSectionsMirror({ ...input, dossier }),
  };
}

export function evaluateWorkshop2RelatedSectionsSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.relatedSectionsMirror;
  if (!mirror) {
    return {
      id: 'related.sections.mirror_missing',
      severity: 'warning',
      messageRu: 'Связанные разделы не в PG — «Related → PG» на вкладке артикула.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'related.sections.vault_empty',
      severity: 'warning',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        'Vault пуст в зеркале related — загрузите документы перед образцом.',
    };
  }
  return null;
}

/** Для тестов: подсветка next-step в bundle. */
export function workshop2RelatedLinkHasHighlight(links: Workshop2RelatedSectionLink[]): boolean {
  return links.some((l) => l.highlight);
}
