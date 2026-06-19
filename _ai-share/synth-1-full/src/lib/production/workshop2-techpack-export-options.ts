import type { WorkingOrderRow } from '@/lib/b2b/working-order-version.types';
import type { TechPackMatrixCartLine } from '@/lib/production/workshop2-techpack-qty-bridge';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { buildWorkshop2TechPackQtyBridge } from '@/lib/production/workshop2-techpack-qty-bridge';
import type { Workshop2TechPackExportOptions } from '@/lib/production/workshop2-techpack-export-sheets';

export function buildWorkshop2TechPackExportOptions(input: {
  dossier: Workshop2DossierPhase1;
  articleSku?: string;
  articleId?: string;
  collectionId?: string;
  workingOrderRows?: WorkingOrderRow[];
  cartLines?: TechPackMatrixCartLine[];
  matrixHref?: string;
  seasonLabel?: string;
}): Workshop2TechPackExportOptions {
  const bridge = buildWorkshop2TechPackQtyBridge({
    dossier: input.dossier,
    workingOrderRows: input.workingOrderRows,
    cartLines: input.cartLines,
    articleSku: input.articleSku,
    articleId: input.articleId,
    collectionId: input.collectionId,
    matrixHref: input.matrixHref,
  });
  return {
    qtyByColorSize: bridge.rows,
    qtyBridgeNote: bridge.noteRu,
    seasonLabel: input.seasonLabel,
  };
}
