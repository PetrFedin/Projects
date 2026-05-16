import type { PatternPiece, SewingPatternDraftOptions } from '@/lib/pattern-drafting/sewing-pattern.types';
import { cmToMm, toMm } from '@/lib/pattern-drafting/sewing-units';
import { armholeDepthMm, estimateArmholeCurveLengthMm } from '@/lib/pattern-drafting/metric-formulas';
import { sampleQuadraticBezier } from '@/lib/pattern-geometry/curve-samples';
import type { Vec2 } from '@/lib/pattern-geometry/vec2';

const DEFAULT_SLEEVE_LEN_CM = 59;

/**
 * 1/2 втачного рукава (по внутрен. шву — правая половина на схеме), окат = кривая по оцен. длине проймы.
 */
export function draftSleeveMetric(
  options: SewingPatternDraftOptions
): { piece: PatternPiece; log: { key: string; value: string; unit?: string }[] } {
  const m = toMm({ ...options.measures, unit: options.measures.unit });
  const eB = cmToMm(options.ease.bust);
  const yA = armholeDepthMm(m.bust);
  const wB = (m.bust + eB) / 4;
  const sh = m.shoulder * 0.48;
  const uArm: Vec2 = { x: wB, y: yA };
  const lCap = estimateArmholeCurveLengthMm(sh, uArm);
  const capH = clampCap(lCap * 0.32);
  const sleeveLen = cmToMm(DEFAULT_SLEEVE_LEN_CM);
  const bicepW = Math.max(110, (m.bust + eB) * 0.16 + 45);
  const wristW = bicepW * 0.72;

  const pTopL: Vec2 = { x: 0, y: 0 };
  const pTopR: Vec2 = { x: lCap * 0.48, y: 0 };
  const pUarm: Vec2 = { x: bicepW, y: capH };
  const cCap: Vec2 = { x: lCap * 0.2, y: capH * 0.38 };
  const cap = sampleQuadraticBezier(pTopR, cCap, pUarm, 12);
  const pBicepLow: Vec2 = { x: bicepW, y: capH + 15 };
  const pWristR: Vec2 = { x: wristW, y: sleeveLen };
  const pWristL: Vec2 = { x: 0, y: sleeveLen };

  const outline: Vec2[] = [pTopL, pTopR, ...cap.slice(1), pBicepLow, pWristR, pWristL];

  return {
    piece: {
      id: 'sleeve',
      name: 'Рукав (1/2, втачной)',
      outline,
      foldLine: { a: pTopL, b: pWristL },
      darts: [],
      grain: { from: pTopL, to: pWristL },
      meta: { lCap, capH, bicepW },
    },
    log: [
      { key: 'Длина проймы (оцен.)', value: (lCap / 10).toFixed(1), unit: 'см' },
      { key: 'Высота оката', value: (capH / 10).toFixed(1), unit: 'см' },
      { key: 'Длина', value: (sleeveLen / 10).toFixed(1), unit: 'см' },
    ],
  };
}

function clampCap(h: number): number {
  return Math.min(140, Math.max(70, h));
}
