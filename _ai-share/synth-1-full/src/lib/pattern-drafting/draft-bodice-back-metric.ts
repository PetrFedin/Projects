import type {
  PatternDart,
  PatternPiece,
  SewingPatternDraftOptions,
} from '@/lib/pattern-drafting/sewing-pattern.types';
import { cmToMm, clamp, toMm } from '@/lib/pattern-drafting/sewing-units';
import {
  armholeDepthMm,
  frontWaistLineLengthMm,
  quarterWaistSuppressionMm,
} from '@/lib/pattern-drafting/metric-formulas';
import { sampleQuadraticBezier } from '@/lib/pattern-geometry/curve-samples';
import type { Vec2 } from '@/lib/pattern-geometry/vec2';

/** Лиф, спинка: уже переда, чуть ниже/уже плечо, «вогнутая» пройма. */
export function draftBodiceBackMetric(options: SewingPatternDraftOptions): {
  piece: PatternPiece;
  log: { key: string; value: string; unit?: string }[];
} {
  const m = toMm({ ...options.measures, unit: options.measures.unit });
  const eB = cmToMm(options.ease.bust);
  const eW = cmToMm(options.ease.waist);
  const fwl = frontWaistLineLengthMm(m.bust, m.height) * 0.98;
  const yA = armholeDepthMm(m.bust) * 0.95;
  const wB = ((m.bust + eB) / 4) * 0.88;
  const wW = ((m.waist + eW) / 4) * 0.9;
  const sh = m.shoulder * 0.42 * (1 - (options.shoulderSlant - 0.5) * 0.1);

  const suppression = quarterWaistSuppressionMm(m.bust, m.waist, eB, eW) * 0.92;
  const sideTakes = clamp(suppression * 0.36, 0, suppression);
  const wWside = wW + sideTakes;

  const cbTop: Vec2 = { x: 0, y: 0 };
  const shPt: Vec2 = { x: sh, y: 0 };
  const uArm: Vec2 = { x: wB, y: yA };
  const cArm: Vec2 = { x: sh * 0.52 + wB * 0.5, y: yA * 0.38 };
  const arm = sampleQuadraticBezier(shPt, cArm, uArm, 12);
  const sideW: Vec2 = { x: wWside, y: fwl };
  const cbHem: Vec2 = { x: 0, y: fwl };
  const outline: Vec2[] = [cbTop, shPt, ...arm.slice(1), sideW, cbHem];

  const darts: PatternDart[] = [];
  if (options.darts.waistDart) {
    darts.push({
      id: 'backWaist1',
      kind: 'waist',
      apex: { x: wB * 0.4, y: fwl * 0.5 },
      leg0: { x: wWside * 0.35, y: fwl },
      leg1: { x: wWside * 0.28, y: fwl },
      intakeMm: Math.max(5, sideTakes * 0.45),
    });
  }
  if (options.darts.shoulderDart) {
    darts.push({
      id: 'backShoulder1',
      kind: 'shoulder',
      apex: { x: sh * 0.5, y: yA * 0.2 },
      leg0: { x: sh * 0.2, y: 1 },
      leg1: { x: sh * 0.4, y: 0.5 },
      intakeMm: 6,
    });
  }

  const log = [
    { key: '1/4 спинки (×0.88) на груди', value: (wB / 10).toFixed(1), unit: 'см' },
    { key: 'Длина спинки (оцен.)', value: (fwl / 10).toFixed(1), unit: 'см' },
  ];
  return {
    piece: {
      id: 'bodice_back',
      name: 'Лиф, спинка (метр. блок)',
      outline,
      foldLine: { a: { x: 0, y: 0 }, b: { x: 0, y: fwl } },
      darts,
      grain: { from: { x: 0, y: 0 }, to: { x: 0, y: fwl } },
      meta: { wB, fwl, yA },
    },
    log,
  };
}
