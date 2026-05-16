import type {
  Workshop2CompositionLabelSpec,
  Workshop2DossierPhase1,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG,
  W2_COMPOSITION_LABEL_FIBER_CATALOG,
  W2_COMPOSITION_LABEL_ORIGIN_PRESETS,
} from '@/lib/production/workshop2-composition-label-spec-constants';

export function compositionLabelConstructorFiberHasRows(spec: Workshop2CompositionLabelSpec | undefined): boolean {
  return (spec?.constructorFiberRows ?? []).some((r) => Boolean(r.fiberId?.trim()) && r.percent > 0);
}

export function compositionLabelConstructorFiberPercentSum(spec: Workshop2CompositionLabelSpec | undefined): number {
  let t = 0;
  for (const r of spec?.constructorFiberRows ?? []) {
    if (!r.fiberId?.trim() || !(r.percent > 0)) continue;
    const n = Number(r.percent);
    if (Number.isFinite(n)) t += n;
  }
  return Math.round(t * 1000) / 1000;
}

export function compositionLabelFiberRowsSumIsHundred(spec: Workshop2CompositionLabelSpec | undefined): boolean {
  if (!compositionLabelConstructorFiberHasRows(spec)) return true;
  return Math.abs(compositionLabelConstructorFiberPercentSum(spec) - 100) < 0.05;
}

/** После клика по знаку: в группе ISO остаётся только выбранный символ. */
export function compositionLabelCareSymbolIdsAfterToggle(
  prevIds: string[] | undefined,
  toggledId: string,
  checked: boolean
): string[] {
  const set = new Set(prevIds ?? []);
  const entry = W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG.find((c) => c.id === toggledId);
  if (!entry) return [...set];
  if (checked) {
    for (const c of W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG) {
      if (c.group === entry.group && c.id !== toggledId) set.delete(c.id);
    }
    set.add(toggledId);
  } else {
    set.delete(toggledId);
  }
  return [...set];
}

export function buildCompositionLabelConstructorFiberLines(
  spec: Workshop2CompositionLabelSpec | undefined
): string[] {
  const lang = spec?.constructorDisplayLanguage ?? 'ru';
  const rows = spec?.constructorFiberRows ?? [];
  const lines: string[] = [];
  for (const r of rows) {
    const fid = r.fiberId?.trim();
    if (!fid || !(r.percent > 0)) continue;
    const cat = W2_COMPOSITION_LABEL_FIBER_CATALOG.find((f) => f.id === fid);
    const pct = Math.round(Number(r.percent) * 100) / 100;
    if (!cat) {
      lines.push(`${pct}% ${fid}`);
      continue;
    }
    if (lang === 'ru') lines.push(`${pct}% ${cat.labelRu}`);
    else if (lang === 'en') lines.push(`${pct}% ${cat.labelEn}`);
    else lines.push(`${pct}% ${cat.labelRu} / ${cat.labelEn}`);
  }
  return lines;
}

export function compositionLabelOriginDisplayLines(spec: Workshop2CompositionLabelSpec | undefined): string[] {
  const pid = (spec?.labelOriginPresetId ?? '').trim();
  if (!pid || pid === 'unset') return [];
  const p = W2_COMPOSITION_LABEL_ORIGIN_PRESETS.find((x) => x.id === pid);
  if (!p || (!p.lineRu && !p.lineEn)) return [];
  const lang = spec?.constructorDisplayLanguage ?? 'ru';
  if (lang === 'ru') return p.lineRu ? [p.lineRu] : [];
  if (lang === 'en') return p.lineEn ? [p.lineEn] : [];
  if (p.lineRu && p.lineEn && p.lineRu !== p.lineEn) return [p.lineRu, p.lineEn];
  return [p.lineRu || p.lineEn];
}

export function compositionLabelCardMetadataLines(spec: Workshop2CompositionLabelSpec | undefined): string[] {
  const s = spec ?? {};
  const out: string[] = [];
  const size = (s.labelGarmentSizeText ?? '').trim();
  if (size) out.push(`Размер: ${size}`);
  const sku = (s.labelArticleSkuText ?? '').trim();
  if (sku) out.push(`Артикул: ${sku}`);
  const bc = (s.labelBarcodeText ?? '').trim();
  if (bc) out.push(`Штрих-код / EAN: ${bc}`);
  const qr = (s.labelQrUrl ?? '').trim();
  if (qr) out.push(`QR: ${qr}`);
  return out;
}

/** Подсказки из досье для кнопки «Подставить из карточки» (размерная шкала, EAN). */
export function suggestedCompositionLabelMetadataFromDossier(
  dossier: Workshop2DossierPhase1 | null | undefined
): Pick<Workshop2CompositionLabelSpec, 'labelGarmentSizeText' | 'labelBarcodeText'> {
  if (!dossier) return {};
  const scale = dossier.sampleSizeScaleId?.trim();
  const ean = dossier.sampleIntakeRelease?.eanOrBatchCode?.trim();
  return {
    ...(scale ? { labelGarmentSizeText: scale } : {}),
    ...(ean ? { labelBarcodeText: ean } : {}),
  };
}
