import type {
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2Phase1SketchSheet,
} from '@/lib/production/workshop2-dossier-phase1.types';

const CLOSE_PCT = 2.5;

function dist2(a: Workshop2Phase1CategorySketchAnnotation, b: Workshop2Phase1CategorySketchAnnotation): number {
  const dx = a.xPct - b.xPct;
  const dy = a.yPct - b.yPct;
  return dx * dx + dy * dy;
}

/** Подсказки по качеству заполнения доски (для UI). */
export function sketchBoardQualityHints(
  anns: Workshop2Phase1CategorySketchAnnotation[],
  opts: {
    leafId: string;
    hasImageSubstrate: boolean;
  }
): string[] {
  const own = anns.filter((a) => a.categoryLeafId === opts.leafId);
  const hints: string[] = [];

  if (own.length > 0 && !opts.hasImageSubstrate) {
    hints.push('Есть метки, но нет своей подложки — координаты могут быть неочевидны для цеха.');
  }

  const criticalNoText = own.filter((a) => a.priority === 'critical' && !String(a.text ?? '').trim());
  if (criticalNoText.length > 0) {
    hints.push(`Критичных меток без текста: ${criticalNoText.length} — добавьте пояснение.`);
  }

  const byCoord = new Map<string, number>();
  for (const a of own) {
    const k = `${a.xPct}:${a.yPct}`;
    byCoord.set(k, (byCoord.get(k) ?? 0) + 1);
  }
  if ([...byCoord.values()].some((n) => n > 1)) {
    hints.push('Есть метки с одинаковыми координатами — разведите точки или удалите дубль.');
  }

  for (let i = 0; i < own.length; i++) {
    for (let j = i + 1; j < own.length; j++) {
      if (dist2(own[i]!, own[j]!) < CLOSE_PCT * CLOSE_PCT) {
        hints.push('Есть метки очень близко друг к другу — проверьте, не дублируют ли они смысл.');
        break;
      }
    }
  }

  return hints;
}

export function sketchSheetQualityHints(
  sheet: Workshop2Phase1SketchSheet,
  leafId: string
): string[] {
  return sketchBoardQualityHints(sheet.annotations, {
    leafId,
    hasImageSubstrate: Boolean(sheet.imageDataUrl),
  });
}
