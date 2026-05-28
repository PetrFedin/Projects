export function cmToMm(cm: number): number {
  return cm * 10;
}

export function inchesToCm(inch: number): number {
  return inch * 2.54;
}

export function toCm(value: number, unit: 'cm' | 'in'): number {
  return unit === 'in' ? inchesToCm(value) : value;
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function toMm(m: {
  bust: number;
  waist: number;
  hip: number;
  shoulderWidth: number;
  bodyHeight?: number;
  unit: 'cm' | 'in';
}) {
  const c = m.unit;
  return {
    bust: cmToMm(toCm(m.bust, c)),
    waist: cmToMm(toCm(m.waist, c)),
    hip: cmToMm(toCm(m.hip, c)),
    shoulder: cmToMm(toCm(m.shoulderWidth, c)),
    height: m.bodyHeight != null ? cmToMm(toCm(m.bodyHeight, c)) : undefined,
  };
}
