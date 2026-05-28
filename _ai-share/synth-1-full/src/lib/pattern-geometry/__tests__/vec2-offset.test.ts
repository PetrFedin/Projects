import { offsetClosedPolygon, V2, type Vec2 } from '@/lib/pattern-geometry/vec2';

function rect(w: number, h: number): Vec2[] {
  return [V2.of(0, 0), V2.of(w, 0), V2.of(w, h), V2.of(0, h)];
}

describe('offsetClosedPolygon', () => {
  it('смещает квадрат наружу: площадь больше', () => {
    const a0 = 100 * 100;
    const p = rect(100, 100);
    const o = offsetClosedPolygon(p, 5, true);
    // Шорно: прибл. 110*110
    let a = 0;
    for (let i = 0; i < o.length; i++) {
      const c = o[i]!;
      const d = o[(i + 1) % o.length]!;
      a += c.x * d.y - c.y * d.x;
    }
    expect((Math.abs(a) / 2) as number).toBeGreaterThan(a0);
  });
});
