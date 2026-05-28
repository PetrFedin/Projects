import {
  W2_COMPOSITION_LABEL_CARE_SYMBOL_MOCKUP_ABBR,
  W2_COMPOSITION_LABEL_FONT_PRESETS,
} from '@/lib/production/workshop2-composition-label-spec-constants';
import { compositionLabelDraftTypographyStyle } from '@/lib/production/workshop2-composition-label-typography-style';
import type {
  Workshop2CompositionLabelFontPreset,
  Workshop2CompositionLabelSpec,
} from '@/lib/production/workshop2-dossier-phase1.types';

function escXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function fontCssStack(preset: Workshop2CompositionLabelFontPreset | '' | undefined): string {
  const row = W2_COMPOSITION_LABEL_FONT_PRESETS.find((x) => x.id === (preset ?? ''));
  return row?.cssStack ?? 'system-ui, sans-serif';
}

function parseMm(raw: string | undefined, fallback: number): number {
  const n = Number.parseFloat(String(raw ?? '').replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function safeFileStem(raw: string): string {
  const s = raw.trim().replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]+/g, '-');
  return s || 'composition-label';
}

function makeDataUrlSvg(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

type DraftAssetPanel = 'combined' | 'face' | 'reverse';
type DraftAssetSvgOptions = { panel?: DraftAssetPanel; showGuides?: boolean };

export function buildCompositionLabelDraftSvg(
  spec: Workshop2CompositionLabelSpec,
  lines: string[],
  opts?: DraftAssetSvgOptions
): string {
  const widthMm = parseMm(spec.labelWidthMm, 50);
  const heightMm = parseMm(spec.labelHeightMm, 110);
  const panelMode: DraftAssetPanel = opts?.panel ?? 'combined';
  const showGuides = opts?.showGuides === true;
  const scale = 6;
  const sideGapPx = 24;
  const panelW = Math.round(widthMm * scale);
  const panelH = Math.round(heightMm * scale);
  const printOnReverse = Boolean(spec.printOnReverse);
  const hasReverse = printOnReverse && Boolean((spec.reverseFaceLines ?? '').trim());
  const totalW =
    panelMode === 'combined' ? (printOnReverse ? panelW * 2 + sideGapPx : panelW) : panelW;
  const totalH = panelH;
  const pad = 14;
  const bleedPx = Math.max(0, Math.round(parseMm(spec.labelBleedMm, 0) * scale));
  const safeInsetPx = Math.max(0, Math.round(parseMm(spec.labelSafeInsetMm, 0) * scale));
  const logo = (spec.compositionLabelLogoDataUrl ?? '').trim();
  const careIds = spec.careSymbolIds ?? [];
  const typo = compositionLabelDraftTypographyStyle(spec);
  const fontSizePx = Math.max(10, Math.round(parseMm(spec.typographyBodyPt, 9) * 1.33));
  const faceTextY0 = pad + (logo ? 58 : 8) + (careIds.length ? 34 : 0);
  const lineHeight = Number(typo.lineHeight) || 1.35;
  const lineStep = Math.max(12, Math.round(fontSizePx * lineHeight));
  const faceX = pad;
  const faceMaxW = panelW - pad * 2;
  const reverseLines = (spec.reverseFaceLines ?? '')
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);

  const drawFaceLines = lines
    .map((line, i) => {
      const y = faceTextY0 + i * lineStep;
      const weight = line.startsWith('— ') ? 700 : 400;
      return `<text x="${faceX}" y="${y}" font-size="${fontSizePx}" font-weight="${weight}" fill="#1f2937">${escXml(line.slice(0, 180))}</text>`;
    })
    .join('');

  const drawCare = careIds
    .map((id, i) => {
      const x = pad + i * 22;
      const abbr = W2_COMPOSITION_LABEL_CARE_SYMBOL_MOCKUP_ABBR[id] ?? id.slice(0, 2).toUpperCase();
      return `<rect x="${x}" y="${pad + (logo ? 36 : 6)}" rx="3" ry="3" width="18" height="18" fill="#f3f4f6" stroke="#d1d5db"/><text x="${x + 9}" y="${pad + (logo ? 49 : 19)}" text-anchor="middle" font-size="8" fill="#374151">${escXml(abbr)}</text>`;
    })
    .join('');

  const reverseX0 = panelW + sideGapPx;
  const drawReverseLines = hasReverse
    ? reverseLines
        .map((line, i) => {
          const y = pad + 14 + i * lineStep;
          return `<text x="${pad}" y="${y}" font-size="${fontSizePx}" fill="#1f2937">${escXml(line.slice(0, 180))}</text>`;
        })
        .join('')
    : '';

  const panelTitle =
    panelMode === 'face'
      ? 'Составник · лицо'
      : panelMode === 'reverse'
        ? 'Составник · оборот'
        : printOnReverse
          ? 'Составник · лицо + оборот'
          : 'Составник · лицо';

  const facePanel = `<rect x="0.5" y="0.5" width="${panelW - 1}" height="${panelH - 1}" fill="#ffffff" stroke="#d1d5db"/>
  ${
    logo
      ? `<image href="${logo}" x="${pad}" y="${pad}" width="${Math.round(panelW * 0.38)}" height="32" preserveAspectRatio="xMinYMin meet"/>`
      : ''
  }
  ${drawCare}
  <clipPath id="clip-face"><rect x="${pad}" y="${faceTextY0 - 14}" width="${faceMaxW}" height="${panelH - faceTextY0 - pad}"/></clipPath>
  <g clip-path="url(#clip-face)">${drawFaceLines}</g>`;

  const reversePanel = `<rect x="0.5" y="0.5" width="${panelW - 1}" height="${panelH - 1}" fill="#ffffff" stroke="#d1d5db"/>
  ${drawReverseLines}`;

  const guides =
    showGuides && (bleedPx > 0 || safeInsetPx > 0)
      ? `<g opacity="0.75">
  ${
    bleedPx > 0
      ? `<rect x="${bleedPx}" y="${bleedPx}" width="${Math.max(1, panelW - bleedPx * 2)}" height="${Math.max(1, panelH - bleedPx * 2)}" fill="none" stroke="#f59e0b" stroke-dasharray="6 4"/>
         <text x="${pad}" y="${panelH - 10}" font-size="10" fill="#b45309">bleed ${bleedPx}px</text>`
      : ''
  }
  ${
    safeInsetPx > 0
      ? `<rect x="${safeInsetPx}" y="${safeInsetPx}" width="${Math.max(1, panelW - safeInsetPx * 2)}" height="${Math.max(1, panelH - safeInsetPx * 2)}" fill="none" stroke="#2563eb" stroke-dasharray="4 3"/>
         <text x="${panelW - 120}" y="${panelH - 10}" font-size="10" fill="#1d4ed8">safe ${safeInsetPx}px</text>`
      : ''
  }
</g>`
      : '';

  const complianceWarning = `<text x="${pad}" y="${totalH - 5}" font-size="6" fill="#ef4444" font-weight="bold">ДРАФТ: ЗАМЕНИТЕ ТЕКСТОВЫЕ МЕТКИ НА ВЕКТОРНЫЕ ПИКТОГРАММЫ ПО ISO 3758 ПЕРЕД ПЕЧАТЬЮ</text>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <defs>
    <style>
      text { font-family: ${fontCssStack(spec.typographyFontPreset)}; letter-spacing: ${typo.letterSpacing}; }
    </style>
  </defs>
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="#f8fafc"/>
  <text x="10" y="16" font-size="11" fill="#475569">${escXml(panelTitle)} · ${widthMm}×${heightMm} мм</text>
  ${
    panelMode === 'combined'
      ? `${facePanel}
  ${printOnReverse ? `<g transform="translate(${reverseX0},0)">${reversePanel}</g>` : ''}`
      : panelMode === 'face'
        ? facePanel
        : reversePanel
  }
  ${
    panelMode === 'combined' && printOnReverse
      ? `<line x1="${panelW + sideGapPx / 2}" y1="0" x2="${panelW + sideGapPx / 2}" y2="${panelH}" stroke="#94a3b8" stroke-dasharray="4 4"/>`
      : ''
  }
  ${guides}
  ${complianceWarning}
</svg>`;
}

export function downloadCompositionLabelDraftSvg(opts: {
  spec: Workshop2CompositionLabelSpec | undefined;
  lines: string[];
  fileBase: string;
  panel?: DraftAssetPanel;
  showGuides?: boolean;
}): void {
  const spec = opts.spec ?? {};
  const svg = buildCompositionLabelDraftSvg(spec, opts.lines, {
    panel: opts.panel,
    showGuides: opts.showGuides,
  });
  const stem = safeFileStem(opts.fileBase);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const suffix = opts.panel && opts.panel !== 'combined' ? `-${opts.panel}` : '';
  downloadBlob(blob, `${stem}${suffix}.svg`);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image load'));
    img.src = src;
  });
}

export async function downloadCompositionLabelDraftPng(opts: {
  spec: Workshop2CompositionLabelSpec | undefined;
  lines: string[];
  fileBase: string;
  panel?: DraftAssetPanel;
  showGuides?: boolean;
}): Promise<void> {
  const spec = opts.spec ?? {};
  const svg = buildCompositionLabelDraftSvg(spec, opts.lines, {
    panel: opts.panel,
    showGuides: opts.showGuides,
  });
  const src = makeDataUrlSvg(svg);
  const img = await loadImage(src);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas context');
  ctx.drawImage(img, 0, 0);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('png blob'))), 'image/png', 0.92);
  });
  const stem = safeFileStem(opts.fileBase);
  const suffix = opts.panel && opts.panel !== 'combined' ? `-${opts.panel}` : '';
  downloadBlob(blob, `${stem}${suffix}.png`);
}
