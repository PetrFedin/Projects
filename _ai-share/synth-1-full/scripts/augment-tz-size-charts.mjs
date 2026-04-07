/**
 * Добавляет в size-chart JSON поля для жёсткого ТЗ (ориентиры в см).
 * Значения выводятся из уже заданных диапазонов bust/waist/hips и т.д.
 * Запуск: node scripts/augment-tz-size-charts.mjs
 */
import fs from 'fs';
import path from 'path';

const root = path.join(import.meta.dirname, '..');
const dataDir = path.join(root, 'public', 'data');

function parseRange(s) {
  if (s == null || typeof s !== 'string') return null;
  const m = String(s).replace(/–/g, '-').match(/(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)/);
  if (!m) return null;
  return [parseFloat(m[1].replace(',', '.')), parseFloat(m[2].replace(',', '.'))];
}

function fmt(lo, hi) {
  const a = Math.round(lo);
  const b = Math.round(hi);
  return a <= b ? `${a}–${b}` : `${b}–${a}`;
}

function mid(r) {
  return r ? (r[0] + r[1]) / 2 : null;
}

function augmentRow(row, extras) {
  const out = { ...row };
  for (const [k, v] of Object.entries(extras)) {
    if (out[k] == null) out[k] = v;
  }
  return out;
}

/** Верх / пальто / костюм */
function extrasOuter(row) {
  const b = parseRange(row.bust);
  const h = parseRange(row.hips);
  const sh = parseRange(row.shoulder);
  if (!b) return {};
  const neck = fmt(b[0] * 0.408 - 1.2, b[1] * 0.412 + 0.8);
  const armhole = sh
    ? fmt(sh[0] + 18, sh[1] + 22)
    : fmt(b[0] * 0.26, b[1] * 0.3);
  const biceps = fmt(b[0] * 0.36, b[1] * 0.4);
  const wrist = fmt(b[0] * 0.188, b[1] * 0.205);
  const chestHalf = fmt(b[0] * 0.48 - 2, b[1] * 0.52 - 1);
  const hem = h ? fmt(h[0] + 6, h[1] + 14) : fmt(b[0] + 8, b[1] + 16);
  return {
    neckCircumference: neck,
    armholeDepth: armhole,
    bicepsCircumference: biceps,
    wristCircumference: wrist,
    chestHalfWidth: chestHalf,
    hemCircumference: hem,
  };
}

function extrasDress(row) {
  const b = parseRange(row.bust);
  const h = parseRange(row.hips);
  if (!b) return {};
  const neck = fmt(b[0] * 0.42 - 1, b[1] * 0.43 + 0.5);
  const armhole = fmt(b[0] * 0.24, b[1] * 0.28);
  const biceps = fmt(b[0] * 0.34, b[1] * 0.38);
  const wrist = fmt(b[0] * 0.18, b[1] * 0.2);
  const underbustBand = fmt(b[0] * 0.72, b[1] * 0.78);
  const hem = h ? fmt(h[0] + 4, h[1] + 12) : fmt(b[0] + 2, b[1] + 10);
  return {
    neckCircumference: neck,
    armholeDepth: armhole,
    bicepsCircumference: biceps,
    wristCircumference: wrist,
    underbustLevel: underbustBand,
    hemCircumference: hem,
  };
}

function extrasSkirt(row) {
  const w = parseRange(row.waist);
  const h = parseRange(row.hips);
  const th = parseRange(row.thighCircumference);
  if (!w || !h) return {};
  const hem = fmt(h[0] * 0.92 + 4, h[1] * 0.98 + 10);
  const leg = th ? fmt(th[0] * 0.42, th[1] * 0.48) : fmt(h[0] * 0.32, h[1] * 0.36);
  return {
    hemWidth: hem,
    legOpening: leg,
    waistBandHeight: '3–4',
    hipDepth: fmt(mid(h) * 0.18, mid(h) * 0.22),
  };
}

function extrasTop(row) {
  const b = parseRange(row.bust);
  if (!b) return {};
  const ac = parseRange(row.armCircumference);
  return {
    neckCircumference: fmt(b[0] * 0.405 - 1, b[1] * 0.412 + 0.5),
    armholeDepth: fmt(b[0] * 0.22, b[1] * 0.26),
    bicepsCircumference: ac ? fmt(ac[0] + 4, ac[1] + 6) : fmt(b[0] * 0.35, b[1] * 0.39),
    wristCircumference: fmt(b[0] * 0.185, b[1] * 0.2),
    cuffOpening: ac ? fmt(mid(ac) * 0.88, mid(ac) * 0.95) : fmt(b[0] * 0.31, b[1] * 0.34),
  };
}

function extrasJeans(row) {
  const w = parseRange(row.waist);
  const h = parseRange(row.hips);
  const th = parseRange(row.thighCircumference);
  const r = parseRange(row.rise);
  const ins = parseRange(row.inseam);
  if (!w || !h) return {};
  const frontRise = r ? fmt(r[0], r[1]) : '24–28';
  const backRise = r ? fmt(r[0] + 4, r[1] + 6) : '28–33';
  const legOpening = th ? fmt(th[0] * 0.38, th[1] * 0.44) : fmt(h[0] * 0.3, h[1] * 0.34);
  const kneeCirc = th ? fmt(th[0] * 0.92, th[1] * 0.98) : null;
  const riseMid = r ? mid(r) : 22;
  const out = {
    frontRise,
    backRise,
    legOpening,
    flyLength: fmt(mid(w) * 0.14, mid(w) * 0.18),
  };
  if (kneeCirc) out.kneeCircumference = kneeCirc;
  if (ins) out.outseamEstimate = fmt(ins[0] + riseMid - 2, ins[1] + riseMid + 6);
  return out;
}

function extrasTrousers(row) {
  const j = extrasJeans(row);
  const kw = parseRange(row.kneeWidth);
  if (kw) j.kneeWidthTz = fmt(kw[0] - 0.5, kw[1] + 0.5);
  return j;
}

function extrasKnit(row) {
  const b = parseRange(row.bust);
  if (!b) return {};
  return {
    neckCircumference: fmt(b[0] * 0.4 - 1, b[1] * 0.42 + 0.5),
    armholeDepth: fmt(b[0] * 0.23, b[1] * 0.27),
    bicepsCircumference: fmt(b[0] * 0.35, b[1] * 0.39),
    wristCircumference: fmt(b[0] * 0.182, b[1] * 0.198),
    hemCircumference: parseRange(row.hips) ? fmt(parseRange(row.hips)[0] + 2, parseRange(row.hips)[1] + 8) : fmt(b[0] + 4, b[1] + 10),
  };
}

function extrasLingerie(row) {
  const ub = parseRange(row.underbust);
  const b = parseRange(row.bust);
  const w = parseRange(row.waist);
  const h = parseRange(row.hips);
  if (!ub || !b) return {};
  return {
    strapLengthTypical: '32–42',
    braGoreWidth: fmt(ub[0] * 0.12, ub[1] * 0.15),
    sideSeamHeight: fmt(mid(b) * 0.22, mid(b) * 0.28),
    gussetWidth: w ? fmt(w[0] * 0.38, w[1] * 0.44) : fmt(14, 18),
    legOpening: h ? fmt(h[0] * 0.34, h[1] * 0.4) : fmt(48, 58),
  };
}

function extrasSport(row) {
  const b = parseRange(row.bust);
  const top = b
    ? {
        neckCircumference: fmt(b[0] * 0.4 - 1, b[1] * 0.42 + 0.5),
        armholeDepth: fmt(b[0] * 0.23, b[1] * 0.27),
        bicepsCircumference: fmt(b[0] * 0.35, b[1] * 0.39),
      }
    : {};
  const bottom = extrasJeans(row);
  return { ...top, ...bottom };
}

function extrasBeach(row) {
  const l = extrasLingerie(row);
  const h = parseRange(row.hips);
  const hh = parseRange(row.hipHeight);
  const r = parseRange(row.rise);
  return {
    ...l,
    legOpeningSwim: h ? fmt(h[0] * 0.36, h[1] * 0.42) : l.legOpening,
    sideTieLength: '45–55',
    hipLineHeight: hh || (h ? fmt(mid(h) * 0.12, mid(h) * 0.16) : '18–24'),
    riseDepth: r || '18–22',
  };
}

function extrasMaternity(row) {
  const b = parseRange(row.bust);
  const w = parseRange(row.waist);
  const h = parseRange(row.hips);
  const belly = parseRange(row.bellyAllowance);
  const base = extrasDress({ ...row, bust: row.bust });
  return {
    ...base,
    bellyPanelHeight: belly ? fmt(belly[0] * 0.85, belly[1] * 1.1) : '12–22',
    elasticZoneWaist: w ? fmt(w[0] - 4, w[1] + 18) : '68–110',
    sidePanelEase: h ? fmt(4, 12) : '6–10',
  };
}

function extrasAdaptive(row) {
  const seat = parseRange(row.seatingAllowance);
  const b = parseRange(row.bust);
  const base = extrasLingerie(row);
  return {
    ...base,
    seatingEase: seat || '8–18',
    sleeveOpeningElastic: b ? fmt(b[0] * 0.32, b[1] * 0.38) : '34–42',
    thighOpeningComfort: parseRange(row.hips) ? fmt(parseRange(row.hips)[0] * 0.55, parseRange(row.hips)[1] * 0.62) : '52–64',
    magneticClosureSpacing: '2–3',
  };
}

function parseFootLen(row) {
  return parseRange(row.footLength);
}

function extrasShoe(row, opts = {}) {
  const f = parseFootLen(row);
  if (!f) return {};
  const midF = mid(f);
  const instep = fmt(midF * 0.42 + 8, midF * 0.46 + 12);
  const toe = fmt(midF * 0.22 - 2, midF * 0.24 + 2);
  const insole = fmt(f[0] - 0.3, f[1] + 0.5);
  const out = {
    instepCircumference: instep,
    toeBoxWidth: toe,
    insoleLength: insole,
    ballGirth: fmt(midF * 0.52 + 10, midF * 0.56 + 14),
  };
  if (opts.ankle) {
    out.ankleCircumference = fmt(midF * 0.38 + 14, midF * 0.42 + 18);
  }
  return out;
}

function extrasBoot(row) {
  const s = extrasShoe(row, { ankle: true });
  const sh = parseRange(row.shaftHeight);
  const sg = parseRange(row.shaftGirth);
  if (sh) s.calfReferenceHeight = fmt(sh[0] * 0.35, sh[1] * 0.45);
  if (sg) s.ankleShaftTransition = fmt(sg[0] * 0.88, sg[1] * 0.95);
  return s;
}

const HANDLERS = {
  'size-chart-outerwear-men.json': (rows) => rows.map((r) => augmentRow(r, extrasOuter(r))),
  'size-chart-suits-men.json': (rows) => rows.map((r) => augmentRow(r, extrasOuter(r))),
  'size-chart-tops-men.json': (rows) => rows.map((r) => augmentRow(r, extrasTop(r))),
  'size-chart-knitwear-men.json': (rows) => rows.map((r) => augmentRow(r, extrasKnit(r))),
  'size-chart-jeans-men.json': (rows) => rows.map((r) => augmentRow(r, extrasJeans(r))),
  'size-chart-trousers-men.json': (rows) => rows.map((r) => augmentRow(r, extrasTrousers(r))),
  'size-chart-sportswear-men.json': (rows) => rows.map((r) => augmentRow(r, extrasSport(r))),
  'size-chart-outerwear.json': (rows) => rows.map((r) => augmentRow(r, extrasOuter(r))),
  'size-chart-suits.json': (rows) => rows.map((r) => augmentRow(r, extrasOuter(r))),
  'size-chart-dresses.json': (rows) => rows.map((r) => augmentRow(r, extrasDress(r))),
  'size-chart-skirts.json': (rows) => rows.map((r) => augmentRow(r, extrasSkirt(r))),
  'size-chart-tops.json': (rows) => rows.map((r) => augmentRow(r, extrasTop(r))),
  'size-chart-jeans.json': (rows) => rows.map((r) => augmentRow(r, extrasJeans(r))),
  'size-chart-trousers.json': (rows) => rows.map((r) => augmentRow(r, extrasTrousers(r))),
  'size-chart-knitwear.json': (rows) => rows.map((r) => augmentRow(r, extrasKnit(r))),
  'size-chart-lingerie.json': (rows) => rows.map((r) => augmentRow(r, extrasLingerie(r))),
  'size-chart-sportswear.json': (rows) => rows.map((r) => augmentRow(r, extrasSport(r))),
  'size-chart-beachwear.json': (rows) => rows.map((r) => augmentRow(r, extrasBeach(r))),
  'size-chart-maternity.json': (rows) => rows.map((r) => augmentRow(r, extrasMaternity(r))),
  'size-chart-adaptive.json': (rows) => rows.map((r) => augmentRow(r, extrasAdaptive(r))),
  'size-chart-sneakers.json': (rows) => rows.map((r) => augmentRow(r, extrasShoe(r))),
  'size-chart-shoes.json': (rows) => rows.map((r) => augmentRow(r, extrasShoe(r))),
  'size-chart-flats.json': (rows) => rows.map((r) => augmentRow(r, extrasShoe(r))),
  'size-chart-sandals.json': (rows) => rows.map((r) => augmentRow(r, extrasShoe(r))),
  'size-chart-boots.json': (rows) => rows.map((r) => augmentRow(r, extrasBoot(r))),
  'size-chart-home-shoes.json': (rows) => rows.map((r) => augmentRow(r, extrasShoe(r))),
};

for (const [name, fn] of Object.entries(HANDLERS)) {
  const p = path.join(dataDir, name);
  if (!fs.existsSync(p)) {
    console.warn('skip missing', name);
    continue;
  }
  const rows = JSON.parse(fs.readFileSync(p, 'utf8'));
  const next = fn(rows);
  fs.writeFileSync(p, JSON.stringify(next, null, 2) + '\n', 'utf8');
  console.log('updated', name, 'rows', next.length);
}

console.log('done');
