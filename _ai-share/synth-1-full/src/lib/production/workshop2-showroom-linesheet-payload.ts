/**
 * Linesheet payload из досье Workshop2 для B2B webhook / export.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2ShowroomCampaign } from '@/lib/server/workshop2-showroom-repository';

export type Workshop2ShowroomLinesheetColorway = {
  code: string;
  label: string;
  paletteCode?: string;
};

export type Workshop2ShowroomLinesheetPreorderWindowRu = {
  startDate?: string;
  endDate?: string;
  labelRu?: string;
};

export type Workshop2ShowroomLinesheetQtyBreak = {
  minQty: number;
  priceRub: number;
};

export type Workshop2ShowroomLinesheetPayload = {
  schemaVersion: 1;
  collectionId: string;
  articleId: string;
  campaignName?: string;
  published: boolean;
  wholesalePrice?: number;
  msrp?: number;
  moq?: number;
  windowStart?: string;
  windowEnd?: string;
  /** Wave 15 RU: окно предзаказа для B2B linesheet/showroom. */
  preorderWindowRu?: Workshop2ShowroomLinesheetPreorderWindowRu;
  /** Wave 23: ступени опта — лучшая цена по суммарному qty в матрице. */
  qtyBreaks?: Workshop2ShowroomLinesheetQtyBreak[];
  /** Wave 23: версия linesheet (JOOR Early Bird v2). */
  version?: number;
  supersedesId?: string;
  sku?: string;
  title?: string;
  colorways: Workshop2ShowroomLinesheetColorway[];
  sizes: string[];
  generatedAt: string;
};

function parseMoney(value: string | number | undefined | null): number | undefined {
  if (value == null) return undefined;
  const n = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function extractColorways(dossier: Workshop2DossierPhase1): Workshop2ShowroomLinesheetColorway[] {
  const out: Workshop2ShowroomLinesheetColorway[] = [];
  const seen = new Set<string>();

  for (const a of dossier.assignments ?? []) {
    const firstVal = a.values?.[0];
    const display = firstVal?.displayLabel?.trim() || firstVal?.text?.trim() || '';
    const code =
      (a as { paletteCode?: string }).paletteCode?.trim() ||
      (display && display.length <= 12 ? display : '') ||
      a.attributeId?.trim() ||
      '';
    if (!code || seen.has(code)) continue;
    seen.add(code);
    out.push({
      code,
      label: display || a.attributeId || code,
      paletteCode: (a as { paletteCode?: string }).paletteCode,
    });
  }

  if (out.length === 0 && dossier.optionalNote?.trim()) {
    out.push({
      code: 'DEFAULT',
      label: dossier.optionalNote.trim().slice(0, 80),
    });
  }

  return out;
}

export function buildWorkshop2ShowroomLinesheetPayload(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  campaign?: Workshop2ShowroomCampaign | null;
}): Workshop2ShowroomLinesheetPayload {
  const draft = input.dossier.b2bIntegrationDraft;
  const campaign = input.campaign;
  const wholesale =
    campaign?.wholesalePrice ??
    parseMoney(draft?.wholesalePrice) ??
    parseMoney(input.dossier.passportProductionBrief?.targetFob);
  const msrp =
    campaign?.msrp ??
    parseMoney(draft?.msrp) ??
    parseMoney(input.dossier.passportProductionBrief?.targetRetailPrice);
  const moq =
    campaign?.moq ??
    parseMoney(draft?.moq) ??
    parseMoney(input.dossier.passportProductionBrief?.moqTargetMaxPieces);

  const sizes = input.dossier.gradingSizes?.length
    ? [...input.dossier.gradingSizes]
    : ['XS', 'S', 'M', 'L', 'XL'];

  const windowStart = campaign?.windowStart ?? draft?.startDate;
  const windowEnd = campaign?.windowEnd ?? draft?.endDate;
  const preorderWindowRu =
    windowStart || windowEnd
      ? {
          startDate: windowStart,
          endDate: windowEnd,
          labelRu:
            windowStart && windowEnd
              ? `Предзаказ: ${windowStart} — ${windowEnd}`
              : windowStart
                ? `Предзаказ с ${windowStart}`
                : windowEnd
                  ? `Предзаказ до ${windowEnd}`
                  : undefined,
        }
      : undefined;

  const qtyBreaksRaw = draft?.qtyBreaks ?? campaign?.qtyBreaks;
  const qtyBreaks = Array.isArray(qtyBreaksRaw)
    ? qtyBreaksRaw
        .map((t) => ({
          minQty: Math.round(Number((t as { minQty?: number }).minQty) || 0),
          priceRub: Math.round(Number((t as { priceRub?: number }).priceRub) || 0),
        }))
        .filter((t) => t.minQty > 0 && t.priceRub > 0)
    : undefined;

  return {
    schemaVersion: 1,
    collectionId: input.collectionId,
    articleId: input.articleId,
    campaignName: campaign?.campaignName ?? `${input.collectionId} · ${input.articleId}`,
    published: Boolean(campaign?.published ?? draft?.isLive),
    wholesalePrice: wholesale,
    msrp,
    moq,
    windowStart,
    windowEnd,
    preorderWindowRu,
    qtyBreaks: qtyBreaks?.length ? qtyBreaks : undefined,
    version: campaign?.version ?? draft?.linesheetVersion,
    supersedesId: campaign?.supersedesId ?? draft?.linesheetSupersedesId,
    sku: input.articleId,
    title: input.dossier.optionalNote?.trim() || input.articleId,
    colorways: extractColorways(input.dossier),
    sizes,
    generatedAt: new Date().toISOString(),
  };
}
