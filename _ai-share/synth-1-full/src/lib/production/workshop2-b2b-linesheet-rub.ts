/**
 * Wave 10: linesheet / wholesale preorder — MOQ и цены в ₽ из досье.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2ShowroomLinesheetPayload,
  type Workshop2ShowroomLinesheetPayload,
} from '@/lib/production/workshop2-showroom-linesheet-payload';
import type { Workshop2ShowroomCampaign } from '@/lib/server/workshop2-showroom-repository';
import { formatWorkshop2RubCurrency } from '@/lib/production/workshop2-rub-currency';
import { isWorkshop2RuMarket } from '@/lib/production/workshop2-market-profile';

export type Workshop2ShowroomLinesheetRubPayload = Workshop2ShowroomLinesheetPayload & {
  currency: 'RUB';
  wholesalePriceRub?: number;
  msrpRub?: number;
  moqFromDossier?: number;
  moqFormattedRu?: string;
  wholesaleFormattedRu?: string;
};

export function buildWorkshop2ShowroomLinesheetRubPayload(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  campaign?: Workshop2ShowroomCampaign | null;
  env?: Record<string, string | undefined>;
}): Workshop2ShowroomLinesheetRubPayload {
  const base = buildWorkshop2ShowroomLinesheetPayload(input);
  const env = input.env ?? process.env;
  const moq = base.moq ?? input.dossier.passportProductionBrief?.moqTargetMaxPieces ?? undefined;
  const wholesale = base.wholesalePrice ?? input.dossier.passportProductionBrief?.targetFob;
  const msrp = base.msrp ?? input.dossier.passportProductionBrief?.targetRetailPrice;
  const rubMarket = isWorkshop2RuMarket(env);
  return {
    ...base,
    currency: 'RUB',
    wholesalePriceRub: wholesale,
    msrpRub: msrp,
    moqFromDossier: moq,
    moqFormattedRu: moq != null && rubMarket ? `${moq} шт` : undefined,
    wholesaleFormattedRu:
      wholesale != null && rubMarket ? formatWorkshop2RubCurrency(wholesale) : undefined,
  };
}
