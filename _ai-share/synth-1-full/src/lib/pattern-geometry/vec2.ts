/** 2D-векторы: мм, y вниз (SVG). */
export type Vec2 = { x: number; y: number };

export const V2 = {
  of(x: number, y: number): Vec2 {
    return { x, y };
  },
  add(a: Vec2, b: Vec2): Vec2 {
    return { x: a.x + b.x, y: a.y + b.y };
  },
  sub(a: Vec2, b: Vec2): Vec2 {
    return { x: a.x - b.x, y: a.y - b.y };
  },
  scale(a: Vec2, s: number): Vec2 {
    return { x: a.x * s, y: a.y * s };
  },
  len(a: Vec2): number {
    return Math.hypot(a.x, a.y);
  },
  dist(a: Vec2, b: Vec2): number {
    return V2.len(V2.sub(b, a));
  },
  mid(a: Vec2, b: Vec2): Vec2 {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  },
  lerp(a: Vec2, b: Vec2, t: number): Vec2 {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  },
  normalize(a: Vec2): Vec2 {
    const l = V2.len(a) || 1;
    return { x: a.x / l, y: a.y / l };
  },
  perpCW(dir: Vec2): Vec2 {
    return { x: dir.y, y: -dir.x };
  },
  dot(a: Vec2, b: Vec2): number {
    return a.x * b.x + a.y * b.y;
  },
  cross(a: Vec2, b: Vec2): number {
    return a.x * b.y - a.y * b.x;
  },
};

/**
 * Прямые: (p1+ t*(p2-p1)) ∩ (p3+ u*(p4-p3))
 */
function lineLineIntersection(p1: Vec2, p2: Vec2, p3: Vec2, p4: Vec2): Vec2 | null {
  const d1 = V2.sub(p2, p1);
  const d2 = V2.sub(p4, p3);
  const den = V2.cross(d1, d2);
  if (Math.abs(den) < 1e-9) return null;
  const t = V2.cross(V2.sub(p3, p1), d2) / den;
  return { x: p1.x + t * d1.x, y: p1.y + t * d1.y };
}

function polygonSignedArea(pts: readonly Vec2[]): number {
  let s = 0;
  for (let j = 0; j < pts.length; j++) {
    const p = pts[j]!;
    const q = pts[(j + 1) % pts.length]!;
    s += p.x * q.y - p.y * q.x;
  }
  return s / 2;
}

/**
 * Внешняя нормаль к ориентированному ребру (p0→p1) для площади area (± по обходу).
 */
function edgeOutwardNormal(t: Vec2, area: number): Vec2 {
  return area > 0 ? { x: t.y, y: -t.x } : { x: -t.y, y: t.x };
}

/**
 * `distanceMm` > 0, `outward: true` — смещение грани **наружи** полигона.
 */
export function offsetClosedPolygon(pts: readonly Vec2[], distanceMm: number, outward: boolean): Vec2[] {
  if (pts.length < 3) return [...pts];
  const n = pts.length;
  const area = polygonSignedArea(pts);
  const sgn = outward ? 1 : -1;
  const d = distanceMm * sgn;
  const out: Vec2[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]!;
    const p1 = pts[i]!;
    const p2 = pts[(i + 1) % n]!;
    const t0 = V2.normalize(V2.sub(p1, p0));
    const t1 = V2.normalize(V2.sub(p2, p1));
    const n0 = edgeOutwardNormal(t0, area);
    const n1 = edgeOutwardNormal(t1, area);
    const a0 = V2.add(p0, V2.scale(n0, d));
    const b0 = V2.add(p1, V2.scale(n0, d));
    const a1 = V2.add(p1, V2.scale(n1, d));
    const b1 = V2.add(p2, V2.scale(n1, d));
    const p = lineLineIntersection(a0, b0, a1, b1);
    out[i] = p ?? p1;
  }
  return out;
}
