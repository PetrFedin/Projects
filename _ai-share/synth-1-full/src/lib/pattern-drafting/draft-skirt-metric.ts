import type { PatternDart, PatternPiece, SewingPatternDraftOptions } from '@/lib/pattern-drafting/sewing-pattern.types';
import { cmToMm, toMm } from '@/lib/pattern-drafting/sewing-units';
import type { Vec2 } from '@/lib/pattern-geometry/vec2';

/**
 * Выкройка 1/4 юбки (CF — левая кромка). A-line: расклёш от уровня бёдер.
 */
export function draftSkirtFrontMetric(
  options: SewingPatternDraftOptions
): { piece: PatternPiece; log: { key: string; value: string; unit?: string }[] } {
  const m = toMm({ ...options.measures, unit: options.measures.unit });
  const eW = cmToMm(options.ease.waist);
  const eH = cmToMm(options.ease.hip);
  const L = cmToMm(options.waistToHemSkirtCm);
  const wW = (m.waist + eW) / 4;
  const wH = (m.hip + eH) / 4;
  const hipDepth = L * 0.22;
  const flare = 0.12;
  const wHem = wH * (1 + flare) + 8;

  const o: Vec2[] = [
    { x: 0, y: 0 },
    { x: wW, y: 0 },
    { x: wH, y: hipDepth },
    { x: wHem, y: L },
    { x: 0, y: L },
  ];

  const darts: PatternDart[] = [];
  if (options.darts.waistDart) {
    const g = 18 + wW * 0.05;
    darts.push(
      {
        id: 'skw1',
        kind: 'skirt_waist',
        apex: { x: wW * 0.4, y: hipDepth * 0.4 },
        leg0: { x: wW * 0.3, y: 0 },
        leg1: { x: wW * 0.2, y: 0 },
        intakeMm: g,
      },
      {
        id: 'skw2',
        kind: 'skirt_waist',
        apex: { x: wH * 0.65, y: hipDepth * 0.45 },
        leg0: { x: wW * 0.85, y: 0 },
        leg1: { x: wW * 0.75, y: 0 },
        intakeMm: g * 0.9,
      }
    );
  }
  return {
    piece: {
      id: 'skirt_front',
      name: 'Юбка, спереди (A-line)',
      outline: o,
      foldLine: { a: { x: 0, y: 0 }, b: { x: 0, y: L } },
      darts,
      grain: { from: { x: 0, y: 0 }, to: { x: 0, y: L } },
      meta: { L, wW, wH },
    },
    log: [
      { key: '1/4 талии', value: (wW / 10).toFixed(1), unit: 'см' },
      { key: '1/4 бёдер (ур. бёдер)', value: (wH / 10).toFixed(1), unit: 'см' },
      { key: 'Длина', value: (L / 10).toFixed(1), unit: 'см' },
    ],
  };
}

export function draftSkirtBackMetric(
  options: SewingPatternDraftOptions
): { piece: PatternPiece; log: { key: string; value: string; unit?: string }[] } {
  const f = draftSkirtFrontMetric({
    ...options,
    darts: { ...options.darts, waistDart: true },
  });
  return {
    piece: {
      ...f.piece,
      id: 'skirt_back',
      name: 'Юбка, зад (A-line, CB)',
      darts: f.piece.darts.map((d) => ({ ...d, id: d.id + '_b' })),
    },
    log: f.log,
  };
}
