import type { BodyProfileV1, FitMatchResultV1, SizeMeasurementsV1 } from './types';

const STORAGE_KEY = 'synth.fitProfile.v1';

export function loadBodyProfile(): BodyProfileV1 | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BodyProfileV1) : null;
  } catch {
    return null;
  }
}

export function saveBodyProfile(profile: BodyProfileV1) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

/** Сравнение мерок тела с промерами изделия. */
export function calculateFitMatch(
  profile: BodyProfileV1,
  garmentSizes: SizeMeasurementsV1[]
): FitMatchResultV1[] {
  return garmentSizes
    .map((gs) => {
      let score = 100;
      const notes: string[] = [];

      gs.measurements.forEach((m) => {
        const val = typeof m.value === 'number' ? m.value : parseFloat(String(m.value));
        if (!Number.isFinite(val)) return;

        if (m.label.includes('груди') && profile.chest) {
          // Допуск: изделие должно быть больше тела на 2-10 см для комфорта (ease)
          const diff = val * 2 - profile.chest; // val обычно полуобхват
          if (diff < 2) {
            score -= 30;
            notes.push('Будет тесно в груди');
          } else if (diff > 12) {
            score -= 15;
            notes.push('Оверсайз в груди');
          }
        }

        if (m.label.includes('талии') && profile.waist) {
          const diff = val * 2 - profile.waist;
          if (diff < 0) {
            score -= 40;
            notes.push('Мало в талии');
          } else if (diff > 15) {
            score -= 10;
            notes.push('Свободно в талии');
          }
        }

        if (m.label.includes('бёдер') && profile.hips) {
          const diff = val * 2 - profile.hips;
          if (diff < 2) {
            score -= 30;
            notes.push('Узко в бёдрах');
          }
        }
      });

      return {
        size: gs.size,
        score: Math.max(0, score),
        notes,
      };
    })
    .sort((a, b) => b.score - a.score);
}
