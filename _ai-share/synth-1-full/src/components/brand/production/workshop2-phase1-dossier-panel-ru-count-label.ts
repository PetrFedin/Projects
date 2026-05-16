/** Склонение «N меток» для русского UI. */
export function w2RuMetkaCountLabel(n: number): string {
  const a = Math.abs(n) % 100;
  const d = a % 10;
  if (a > 10 && a < 20) return `${n} меток`;
  if (d === 1) return `${n} метка`;
  if (d >= 2 && d <= 4) return `${n} метки`;
  return `${n} меток`;
}
