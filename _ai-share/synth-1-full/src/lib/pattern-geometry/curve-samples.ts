import type { Vec2 } from '@/lib/pattern-geometry/vec2';
import { V2 } from '@/lib/pattern-geometry/vec2';

/**
 * Квадратичная Bezier: B(t) = (1-t)²P0 + 2(1-t)t C + t²P1, t∈[0,1]
 */
export function sampleQuadraticBezier(p0: Vec2, c: Vec2, p1: Vec2, steps: number): Vec2[] {
  if (steps < 2) return [p0, p1];
  const out: Vec2[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const a = (1 - t) * (1 - t);
    const b = 2 * (1 - t) * t;
    const c2 = t * t;
    out.push(V2.add(V2.add(V2.scale(p0, a), V2.scale(c, b)), V2.scale(p1, c2)));
  }
  return out;
}

/**
 * Сглаженная вставка: без дублирования p0/p1 на стыках.
 */
export function joinSamples(points: readonly Vec2[], ...runs: readonly Vec2[][]): Vec2[] {
  return [...points, ...runs.flatMap((r, i) => (i === 0 && points.length > 0 ? r.slice(1) : r))];
}
