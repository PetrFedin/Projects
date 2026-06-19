import type { Workshop2DossierMaterialPreview } from '@/lib/production/workshop2-dossier-material-preview';

const FORECAST_CONFIDENCE_BAND_PCT = 0.15;

/** Потребность по норме расхода из досье × количество в оптовом заказе. */
export function parseConsumptionPerGarment(
  preview: Workshop2DossierMaterialPreview
): number | null {
  const label = preview.consumptionLabel?.trim() ?? '';
  const m = label.match(/^([\d.,]+)/);
  if (!m) return null;
  const n = Number(m[1].replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function estimateSupplierMaterialNeed(input: {
  preview: Workshop2DossierMaterialPreview;
  orderQty: number;
}): { point: number; low: number; high: number; unitLabelRu: string } | null {
  const perGarment = parseConsumptionPerGarment(input.preview);
  if (perGarment == null || input.orderQty <= 0) return null;
  const point = Math.round(perGarment * input.orderQty * 100) / 100;
  const band = point * FORECAST_CONFIDENCE_BAND_PCT;
  return {
    point,
    low: Math.round((point - band) * 100) / 100,
    high: Math.round((point + band) * 100) / 100,
    unitLabelRu: input.preview.unitLabelRu,
  };
}

export function formatSupplierMaterialNeedRu(need: {
  point: number;
  low: number;
  high: number;
  unitLabelRu: string;
}): string {
  return `~${need.point} ${need.unitLabelRu} (диапазон ${need.low}–${need.high} ${need.unitLabelRu}, оценка по досье)`;
}

export const SUPPLIER_FORECAST_B2B_DISCLAIMER_RU =
  'Расчёт по нормам расхода из досье и количеству в оптовом заказе (B2B); без резерва склада.';

export const SUPPLIER_FORECAST_B2B_CONFIRMED_NOTE_RU =
  'По артикулам с бейджем «Поставка подтверждена» заявка зафиксирована в базе и отражена в цепочке заказа.';
