import { CIS_CODES, CIS_VIEW_DATA } from "./geo.constants";
import { CisCode, PeriodPreset, TimePoint } from "./geo.types";

/** Цвет: от #0ea5e9 (синий) к #f97316 (оранжевый) */
export function heatColor(value: number, min: number, max: number): string {
  if (max <= min) return "#0ea5e9";
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const c1 = { r: 14, g: 165, b: 233 };
  const c2 = { r: 249, g: 115, b: 22 };
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r},${g},${b})`;
}

/** MVP: мок-таймсерия (12 недель). Заменишь на реальные данные позже через репозиторий. */
export function buildMockTimeSeries(): TimePoint[] {
  const base = Object.entries(CIS_VIEW_DATA) as [CisCode, (typeof CIS_VIEW_DATA)[CisCode]][];
  const points: TimePoint[] = [];

  for (let i = 0; i < 12; i++) {
    const factor = 0.75 + i * 0.05;
    const viewersByCountry = {} as Record<CisCode, number>;

    for (const [code, v] of base) {
      const seasonalBoost =
        code === "UZ" && i > 6 ? 1.2 :
        code === "KZ" && i > 4 ? 1.1 : 1;

      viewersByCountry[code] = Math.round(
        v.viewers * factor * seasonalBoost * (0.92 + pseudoRand(i, code) * 0.16)
      );
    }

    points.push({
      label: `Неделя ${i + 1}`,
      date: `2025-W${String(i + 1).padStart(2, "0")}`,
      viewersByCountry,
    });
  }

  return points;
}

/** стабильный псевдо-рандом без Math.random (чтобы UI не “прыгал”) */
function pseudoRand(i: number, code: string) {
  let h = 2166136261;
  const s = `${i}-${code}`;
  for (let k = 0; k < s.length; k++) {
    h ^= s.charCodeAt(k);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function sliceByPeriod(full: TimePoint[], period: PeriodPreset): TimePoint[] {
  const len = full.length;
  switch (period) {
    case "7d": return full.slice(Math.max(0, len - 2));
    case "30d": return full.slice(Math.max(0, len - 4));
    case "90d": return full.slice(Math.max(0, len - 8));
    case "season": return full.slice(Math.max(0, len - 12));
    case "year":
    default: return full;
  }
}

export function computeWeeklyInsights(prev: TimePoint | null, cur: TimePoint): string {
  if (!prev) return "Недостаточно данных для сравнения с прошлым периодом.";

  const deltas: { code: CisCode; diffPct: number }[] = [];
  for (const code of CIS_CODES) {
    const pv = prev.viewersByCountry[code] ?? 0;
    const cv = cur.viewersByCountry[code] ?? 0;
    if (pv <= 0) continue;
    deltas.push({ code, diffPct: ((cv - pv) / pv) * 100 });
  }

  deltas.sort((a, b) => Math.abs(b.diffPct) - Math.abs(a.diffPct));
  const top = deltas.slice(0, 3);
  if (!top.length) return "Изменения по странам не зафиксированы.";

  const parts = top.map(d => {
    const sign = d.diffPct >= 0 ? "+" : "";
    return `${sign}${d.diffPct.toFixed(0)}% в ${d.code}`;
  });

  return `На этой неделе: ${parts.join(", ")}.`;
}

export function minMaxForPoint(point: TimePoint) {
  const vals = CIS_CODES.map(c => point.viewersByCountry[c] ?? CIS_VIEW_DATA[c].viewers);
  return { min: Math.min(...vals), max: Math.max(...vals) };
}
