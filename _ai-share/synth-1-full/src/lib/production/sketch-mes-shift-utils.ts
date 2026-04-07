/** Допустимые символы: буквы, цифры, пробел, дефис, подчёркивание, двоеточие и точки (дата). */
const SHIFT_RE = /^[a-zA-Zа-яА-ЯёЁ0-9 _\-:.]+$/u;

export function isValidMesShiftId(raw: string | undefined): boolean {
  const t = (raw ?? '').trim();
  if (!t) return true;
  if (t.length > 80) return false;
  return SHIFT_RE.test(t);
}

export const MES_SHIFT_PRESETS: { id: string; label: string; value: string }[] = [
  { id: 'a', label: 'Смена A', value: 'Смена A' },
  { id: 'b', label: 'Смена B', value: 'Смена B' },
  { id: 'morning', label: 'Утро', value: 'Утро' },
  { id: 'evening', label: 'Вечер', value: 'Вечер' },
  { id: 'night', label: 'Ночь', value: 'Ночь' },
];
