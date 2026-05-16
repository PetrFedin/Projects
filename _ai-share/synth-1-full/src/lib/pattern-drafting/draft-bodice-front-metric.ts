import type { PatternDart, PatternPiece, SewingPatternDraftOptions } from '@/lib/pattern-drafting/sewing-pattern.types';
import { cmToMm, clamp, toMm } from '@/lib/pattern-drafting/sewing-units';
import {
  armholeDepthMm,
  frontWaistLineLengthMm,
  quarterWaistSuppressionMm,
} from '@/lib/pattern-drafting/metric-formulas';
import { sampleQuadraticBezier } from '@/lib/pattern-geometry/curve-samples';
import type { Vec2 } from '@/lib/pattern-geometry/vec2';

export function draftBodiceFrontMetric(
  options: SewingPatternDraftOptions
): { piece: PatternPiece; log: { key: string; value: string; unit?: string }[] } {
  const m = toMm({ ...options.measures, unit: options.measures.unit });
  const eB = cmToMm(options.ease.bust);
  const eW = cmToMm(options.ease.waist);
  const fwl = frontWaistLineLengthMm(m.bust, m.height);
  const yA = armholeDepthMm(m.bust);
  const wB = (m.bust + eB) / 4;
  const wW = (m.waist + eW) / 4;
  const sh = m.shoulder * 0.48 * (1 - (options.shoulderSlant - 0.5) * 0.1);

  const suppression = quarterWaistSuppressionMm(m.bust, m.waist, eB, eW);
  const dartsTuned = options.darts.shoulderDart || options.darts.bustSideDart || options.darts.waistDart;
  /** Сужение бокового шва (без визуальных вытачек тоже, иначе «лишняя» талия). */
  const sideTakes = clamp(suppression * 0.38, 0, suppression);
  const wWside = wW + sideTakes;

  /** База V: глубина по CF + ширина к плечу (оценка 1/3 длины плечевой линии), мм. */
  const neckD = clamp(cmToMm(options.frontNeckDropCm), 5, 85);
  const neckR = Math.min(clamp(sh * 0.34, 10, 58), Math.max(sh - 2, 4));

  const shPt: Vec2 = { x: sh, y: 0 };
  const uArm: Vec2 = { x: wB, y: yA };
  const cArm: Vec2 = { x: sh * 0.55 + wB * 0.45, y: yA * 0.42 };
  const arm = sampleQuadraticBezier(shPt, cArm, uArm, 12);
  const sideBust = uArm;
  const sideW: Vec2 = { x: wWside, y: fwl };
  const cfHem: Vec2 = { x: 0, y: fwl };
  const cfNeckDepth: Vec2 = { x: 0, y: neckD };
  const shoulderAtNeck: Vec2 = { x: neckR, y: 0 };
  const armToShoulder: Vec2[] = [...arm].reverse();

  /**
   * Обход: низ V на CF → талия → бок → подмышка … плечо (sh) → плечо у шеи (neckR) → линия горловины к CF.
   * `arm` снят pлечо→подмышка; в контур вставляем `reverse(arm)` = подмышка … плечо.
   */
  const outline: Vec2[] = [cfNeckDepth, cfHem, sideW, ...armToShoulder, shoulderAtNeck];

  const darts: PatternDart[] = [];
  const yBust = (yA + fwl) * 0.48;
  const bustApex: Vec2 = { x: wB * 0.68, y: yBust };
  if (dartsTuned && options.darts.bustSideDart && sideTakes < suppression) {
    const wLeg = 10 + (suppression - sideTakes) * 0.1;
    darts.push({
      id: 'bustL',
      kind: 'bust_side',
      apex: bustApex,
      leg0: { x: sideBust.x - 4, y: sideBust.y - 1 },
      leg1: { x: sideBust.x - 4 - wLeg, y: sideBust.y + 2 },
      intakeMm: Math.max(0, (suppression - sideTakes) * 0.3),
    });
  }
  if (dartsTuned && options.darts.waistDart) {
    const t = 0.22;
    darts.push({
      id: 'wL',
      kind: 'waist',
      apex: { x: wB * t + 5, y: (yA + fwl) * 0.62 },
      leg0: { x: wWside * 0.18, y: fwl },
      leg1: { x: wWside * 0.12, y: fwl },
      intakeMm: Math.max(4, (suppression - sideTakes) * 0.32),
    });
    darts.push({
      id: 'wR',
      kind: 'waist',
      apex: { x: wB * (1 - t) - 5, y: (yA + fwl) * 0.62 },
      leg0: { x: wWside * 0.88, y: fwl },
      leg1: { x: wWside * 0.82, y: fwl },
      intakeMm: Math.max(4, (suppression - sideTakes) * 0.32),
    });
  }
  if (dartsTuned && options.darts.shoulderDart) {
    darts.push({
      id: 's1',
      kind: 'shoulder',
      apex: { x: sh * 0.4, y: yA * 0.25 },
      leg0: { x: neckR * 0.35, y: 1 },
      leg1: { x: sh * 0.32, y: 0.5 },
      intakeMm: 8,
    });
  }

  const log = [
    { key: 'Длина переда (FWL)', value: (fwl / 10).toFixed(1), unit: 'см' },
    { key: 'Глубина проймы', value: (yA / 10).toFixed(1), unit: 'см' },
    { key: '1/4 груди + ease', value: (wB / 10).toFixed(1), unit: 'см' },
    { key: '1/4 талии + ease', value: (wW / 10).toFixed(1), unit: 'см' },
    { key: 'Супрессия (четв.)', value: (suppression / 10).toFixed(1), unit: 'см' },
    {
      key: 'Горловина пер. (ввод, ось CF пока прямая)',
      value: options.frontNeckDropCm.toFixed(1),
      unit: 'см',
    },
  ];

  return {
    piece: {
      id: 'bodice_front',
      name: 'Лиф, спереди (метр. блок)',
      outline,
      foldLine: { a: cfNeckDepth, b: { x: 0, y: fwl } },
      darts,
      grain: { from: cfNeckDepth, to: { x: 0, y: fwl } },
      meta: { fwl: fwl, yA, wB, wW },
    },
    log,
  };
}
