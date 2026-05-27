import type { Workshop2CompositionLabelLayoutElement } from '@/lib/production/workshop2-dossier-phase1.types';

const DEFAULT_IDS = {
  logo: 'layout-el-logo',
  care: 'layout-el-care',
  text: 'layout-el-text',
} as const;

function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n * 1000) / 1000));
}

export function normalizeCompositionLabelLayoutElement(
  el: Workshop2CompositionLabelLayoutElement
): Workshop2CompositionLabelLayoutElement {
  let x = clampPct(el.xPct);
  let y = clampPct(el.yPct);
  let w = clampPct(el.wPct);
  let h = clampPct(el.hPct);
  w = Math.max(1, w);
  h = Math.max(1, h);
  if (x + w > 100) x = Math.max(0, 100 - w);
  if (y + h > 100) y = Math.max(0, 100 - h);
  const rot = el.rotationDeg ?? 0;
  const rotationDeg = Number.isFinite(rot)
    ? Math.max(-180, Math.min(180, Math.round(rot * 10) / 10))
    : 0;
  const fs = el.fontSizePx ?? (el.kind === 'text' ? 11 : undefined);
  const fontSizePx =
    el.kind === 'text' && fs != null && Number.isFinite(fs)
      ? Math.max(6, Math.min(36, Math.round(fs)))
      : el.fontSizePx;
  const rawOp = el.opacityPct ?? 100;
  const opacityPct = Number.isFinite(rawOp) ? Math.round(Math.max(0, Math.min(100, rawOp))) : 100;
  const textAlign: Workshop2CompositionLabelLayoutElement['textAlign'] =
    el.kind === 'text'
      ? el.textAlign === 'center' || el.textAlign === 'right'
        ? el.textAlign
        : 'left'
      : undefined;
  return {
    ...el,
    xPct: x,
    yPct: y,
    wPct: w,
    hPct: h,
    rotationDeg,
    zIndex: el.zIndex ?? (el.kind === 'logo' ? 3 : el.kind === 'careStrip' ? 2 : 1),
    fontSizePx,
    fontWeight: el.fontWeight === 'bold' ? 'bold' : 'normal',
    textAlign,
    opacityPct,
  };
}

/** Стартовая раскладка: лого сверху по центру, полоса ухода, основной текст. */
export function buildDefaultCompositionLabelLayoutElements(): Workshop2CompositionLabelLayoutElement[] {
  return [
    normalizeCompositionLabelLayoutElement({
      elementId: DEFAULT_IDS.logo,
      kind: 'logo',
      xPct: 30,
      yPct: 2,
      wPct: 40,
      hPct: 14,
      rotationDeg: 0,
      zIndex: 3,
    }),
    normalizeCompositionLabelLayoutElement({
      elementId: DEFAULT_IDS.care,
      kind: 'careStrip',
      xPct: 4,
      yPct: 18,
      wPct: 92,
      hPct: 10,
      rotationDeg: 0,
      zIndex: 2,
    }),
    normalizeCompositionLabelLayoutElement({
      elementId: DEFAULT_IDS.text,
      kind: 'text',
      xPct: 4,
      yPct: 30,
      wPct: 92,
      hPct: 66,
      rotationDeg: 0,
      zIndex: 1,
      fontSizePx: 11,
      fontWeight: 'normal',
    }),
  ];
}

export function ensureCompositionLabelLayoutElements(
  existing: Workshop2CompositionLabelLayoutElement[] | undefined
): Workshop2CompositionLabelLayoutElement[] {
  if (existing?.length) {
    return [...existing]
      .map(normalizeCompositionLabelLayoutElement)
      .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
  }
  return buildDefaultCompositionLabelLayoutElements();
}

export function newCompositionLabelTextElement(
  index: number
): Workshop2CompositionLabelLayoutElement {
  return normalizeCompositionLabelLayoutElement({
    elementId: `layout-el-text-${Date.now()}-${index}`,
    kind: 'text',
    xPct: 8,
    yPct: 40,
    wPct: 84,
    hPct: 20,
    rotationDeg: 0,
    zIndex: 4 + index,
    fontSizePx: 10,
    fontWeight: 'normal',
  });
}
