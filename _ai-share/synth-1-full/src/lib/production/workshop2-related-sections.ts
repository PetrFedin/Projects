/**
 * Перекрёстные ссылки воркспейса артикула — без «осиротевших» экранов.
 */
import {
  workshop2ArticleHref,
  type Workshop2ArticleHrefQuery,
} from '@/lib/production/workshop2-url';
import type { Workshop2ArticleMainTab } from '@/lib/production/workshop2-collection-metrics';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';
import { W2_CONSTRUCTION_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-construction-dossier-anchors';
import {
  workshop2ContextToProductionFloorFromSampleOrder,
  type Workshop2FloorBridgeContext,
} from '@/lib/production/workshop2-floor-bridge';
import type { Workshop2RelatedNextStep } from '@/lib/production/workshop2-related-next-step';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  countWorkshop2VaultDocumentsForRelatedStrip,
  formatWorkshop2RelatedVaultLinkLabel,
} from '@/lib/production/workshop2-related-vault-enrichment';

export type Workshop2RelatedSectionLink = {
  id: string;
  labelRu: string;
  href: string;
  title?: string;
  /** Подсветка рекомендуемого следующего шага. */
  highlight?: boolean;
};

export type Workshop2RelatedSectionsResult = {
  links: Workshop2RelatedSectionLink[];
  nextStep: Workshop2RelatedNextStep | null;
};

export function buildWorkshop2RelatedSectionLinks(input: {
  collectionId: string;
  articleUrlSegment: string;
  activeTab: Workshop2ArticleMainTab | 'overview';
  focusDossierSection?: DossierSection | null;
  sampleOrderStatus?: string;
  nextStep?: Workshop2RelatedNextStep | null;
}): Workshop2RelatedSectionLink[] {
  return buildWorkshop2RelatedSectionsBundle(input).links;
}

export function buildWorkshop2RelatedSectionsBundle(input: {
  collectionId: string;
  articleUrlSegment: string;
  activeTab: Workshop2ArticleMainTab | 'overview';
  focusDossierSection?: DossierSection | null;
  sampleOrderStatus?: string;
  nextStep?: Workshop2RelatedNextStep | null;
  dossier?: Workshop2DossierPhase1 | null;
}): Workshop2RelatedSectionsResult {
  const { collectionId, articleUrlSegment, activeTab, focusDossierSection, sampleOrderStatus } =
    input;
  const q = (extra: Workshop2ArticleHrefQuery): string =>
    workshop2ArticleHref(collectionId, articleUrlSegment, extra);

  const floorCtx: Workshop2FloorBridgeContext = {
    collectionId,
    articleLineId: articleUrlSegment,
  };

  const links: Workshop2RelatedSectionLink[] = [
    {
      id: 'refs',
      labelRu: 'Референсы',
      href: q({ w2pane: 'tz', w2sec: 'visuals' }),
    },
    {
      id: 'bom',
      labelRu: 'BOM',
      href: q({ w2pane: 'tz', w2sec: 'material' }),
    },
    {
      id: 'measurements',
      labelRu: 'Мерки',
      href: q({ w2pane: 'tz', w2sec: 'construction', hash: 'w2-measurements-fields' }),
    },
    {
      id: 'cad',
      labelRu: 'CAD',
      href: q({
        w2pane: 'tz',
        w2sec: 'construction',
        hash: W2_CONSTRUCTION_SUBPAGE_ANCHORS.cadViewer,
      }),
    },
    {
      id: 'routing',
      labelRu: 'Маршрут',
      href: q({
        w2pane: 'tz',
        w2sec: 'construction',
        hash: 'w2-smart-routing',
      }),
    },
    {
      id: 'nesting',
      labelRu: 'Раскладка',
      href: q({ w2pane: 'plan', hash: 'w2article-section-plan-nest' }),
    },
    {
      id: 'sketch',
      labelRu: 'Скетч',
      href: q({ w2pane: 'tz', w2sec: 'construction', hash: W2_VISUALS_SKETCH_ANCHOR_ID }),
    },
    {
      id: 'sample',
      labelRu: 'Образец',
      href: q({ w2pane: 'fit' }),
    },
    {
      id: 'handoff',
      labelRu: 'Передача',
      href: q({ w2pane: 'tz', w2sec: 'assignment' }),
    },
    {
      id: 'vault',
      labelRu: formatWorkshop2RelatedVaultLinkLabel(
        countWorkshop2VaultDocumentsForRelatedStrip(input.dossier)
      ),
      href: q({ w2pane: 'vault' }),
      title:
        countWorkshop2VaultDocumentsForRelatedStrip(input.dossier) > 0
          ? `${countWorkshop2VaultDocumentsForRelatedStrip(input.dossier)} документов в Vault`
          : 'Vault пуст — загрузите tech pack / CAD',
    },
    {
      id: 'floor',
      labelRu: 'Цех',
      href: workshop2ContextToProductionFloorFromSampleOrder(floorCtx, sampleOrderStatus),
      title: 'Пол производства с контекстом артикула',
    },
  ];

  if (activeTab === 'supply') {
    links.unshift({
      id: 'ta',
      labelRu: 'T&A',
      href: q({ w2pane: 'plan' }),
    });
  }
  if (activeTab === 'fit' && focusDossierSection) {
    // no-op: fit tab already active
  }
  if (activeTab === 'stock') {
    links.unshift({
      id: 'intake',
      labelRu: 'Sample Intake',
      href: q({ w2pane: 'stock' }),
    });
  }

  const filtered = links.filter((l) => {
    if (activeTab === 'tz' && l.id === 'refs' && focusDossierSection === 'visuals') return false;
    if (activeTab === 'fit' && l.id === 'sample') return false;
    if (activeTab === 'vault' && l.id === 'vault') return false;
    return true;
  });

  const nextStep = input.nextStep ?? null;
  if (nextStep) {
    const matchIdx = filtered.findIndex((l) => l.href === nextStep.href);
    if (matchIdx >= 0) {
      filtered[matchIdx] = { ...filtered[matchIdx]!, highlight: true, title: nextStep.reasonRu };
    }
  }

  return { links: filtered, nextStep };
}
