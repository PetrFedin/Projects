import type { PatternPiece, SewingPatternDraftOptions, SewingPatternResult } from '@/lib/pattern-drafting/sewing-pattern.types';
import { escapeSvgText } from '@/lib/pattern-geometry/escape-svg';
import { offsetClosedPolygon, V2, type Vec2 } from '@/lib/pattern-geometry/vec2';

function pointsToPathD(pts: readonly Vec2[], close: boolean): string {
  if (pts.length === 0) return '';
  const f = pts[0]!;
  let d = `M ${f.x.toFixed(2)} ${f.y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i]!;
    d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }
  if (close) d += ' Z';
  return d;
}

function mergeBbox(
  min: Vec2,
  max: Vec2,
  pts: readonly Vec2[]
): { min: Vec2; max: Vec2 } {
  let a = { ...min };
  let b = { ...max };
  for (const p of pts) {
    a.x = Math.min(a.x, p.x);
    a.y = Math.min(a.y, p.y);
    b.x = Math.max(b.x, p.x);
    b.y = Math.max(b.y, p.y);
  }
  return { min: a, max: b };
}

function bboxOfPiece(p: PatternPiece): { min: Vec2; max: Vec2 } {
  let min = V2.of(Infinity, Infinity);
  let max = V2.of(-Infinity, -Infinity);
  ({ min, max } = mergeBbox(min, max, p.outline));
  for (const d of p.darts) {
    ({ min, max } = mergeBbox(min, max, [d.apex, d.leg0, d.leg1]));
  }
  if (p.grain) {
    ({ min, max } = mergeBbox(min, max, [p.grain.from, p.grain.to]));
  }
  if (p.foldLine) {
    ({ min, max } = mergeBbox(min, max, [p.foldLine.a, p.foldLine.b]));
  }
  return { min, max };
}

export function renderSewingPatternSvg(
  pieces: PatternPiece[],
  opts: SewingPatternDraftOptions,
  buildLog: { key: string; value: string; unit?: string }[],
  notes: string[]
): SewingPatternResult {
  const piece = pieces[0];
  if (!piece) {
    return {
      svg: '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
      viewBox: '0 0 1 1',
      widthMm: 1,
      heightMm: 1,
      notes: ['Пустой чертёж'],
      buildLog,
      downloadFileName: 'empty.svg',
    };
  }
  const pad = 30;
  const { min, max } = bboxOfPiece(piece);
  const w = max.x - min.x + pad * 2;
  const h = max.y - min.y + pad * 2;
  const tx = pad - min.x;
  const ty = pad - min.y;
  const tr = (v: Vec2) => V2.add(v, { x: tx, y: ty });
  const out = piece.outline.map(tr);
  const cut = pointsToPathD(out, true);
  const layers: string[] = [
    `<rect x="0" y="0" width="${w.toFixed(2)}" height="${h.toFixed(2)}" fill="#f8fafc" />`,
    `<path d="${cut}" fill="rgba(15,23,42,0.02)" stroke="#0f172a" stroke-width="1.1" fill-rule="evenodd" />`,
  ];

  if (opts.showSeamLine && opts.seamAllowanceMm > 0) {
    try {
      const sa = offsetClosedPolygon(out, opts.seamAllowanceMm, true);
      layers.push(
        `<path d="${pointsToPathD(sa, true)}" fill="none" stroke="#16a34a" stroke-width="0.85" stroke-dasharray="5 4" opacity="0.9" />`
      );
    } catch {
      /* */
    }
  }

  if (opts.showGrain) {
    const g0 = tr(piece.grain.from);
    const g1 = tr(piece.grain.to);
    layers.push(
      `<line x1="${g0.x.toFixed(2)}" y1="${g0.y.toFixed(2)}" x2="${g1.x.toFixed(2)}" y2="${g1.y.toFixed(2)}" stroke="#64748b" stroke-width="0.65" stroke-dasharray="4 3" />`
    );
    layers.push(
      `<text x="${(g0.x + 3).toFixed(0)}" y="${(g0.y + 10).toFixed(0)}" font-size="8" fill="#64748b">нитка</text>`
    );
  }

  if (piece.foldLine) {
    const fa = tr(piece.foldLine.a);
    const fb = tr(piece.foldLine.b);
    layers.push(
      `<line x1="${fa.x.toFixed(2)}" y1="${fa.y.toFixed(2)}" x2="${fb.x.toFixed(2)}" y2="${fb.y.toFixed(2)}" stroke="#94a3b8" stroke-width="0.6" stroke-dasharray="2 3" />`
    );
    const midY = (fa.y + fb.y) / 2;
    layers.push(
      `<text x="${(fa.x + 2).toFixed(0)}" y="${midY.toFixed(0)}" font-size="7" fill="#94a3b8">сгиб</text>`
    );
  }

  for (const d of piece.darts) {
    const ap = tr(d.apex);
    const l0 = tr(d.leg0);
    const l1 = tr(d.leg1);
    layers.push(
      `<path d="M ${ap.x.toFixed(2)} ${ap.y.toFixed(2)} L ${l0.x.toFixed(2)} ${l0.y.toFixed(2)} M ${ap.x.toFixed(2)} ${ap.y.toFixed(2)} L ${l1.x.toFixed(2)} ${l1.y.toFixed(2)}" fill="none" stroke="#0f766e" stroke-width="0.8" stroke-dasharray="3 2" />`
    );
  }

  const label = tr({ x: min.x + 4, y: min.y + 11 });
  layers.push(
    `<text x="${label.x.toFixed(0)}" y="${label.y.toFixed(0)}" font-size="9.5" fill="#334155" font-weight="500">${escapeSvgText(
      piece.name
    )}</text>`
  );

  if (opts.showDimensions) {
    layers.push(
      `<text x="${pad.toFixed(0)}" y="${(h - 8).toFixed(0)}" font-size="7" fill="#94a3b8">1 SVG unit = 1 мм</text>`
    );
  }

  const viewBox = `0 0 ${w.toFixed(2)} ${h.toFixed(2)}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%" role="img" aria-label="Лекало">
  ${layers.join('\n  ')}
</svg>`;

  return {
    svg,
    viewBox,
    widthMm: w,
    heightMm: h,
    notes: [
      '1 единица в SVG = 1 мм: для бумажной 1:1 согласуйте масштаб печати с линейкой теста.',
      'Пошаговая калибровка и крой «как в ателье» — отдельные процедуры, это учебно-оценочный конструктор.',
      ...notes,
    ],
    buildLog,
    downloadFileName: `lekalo-${opts.garment}.svg`,
  };
}
