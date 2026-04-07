import { getFitFeedbackAggregate } from '@/lib/platform/fit-feedback.port';
import type { ForYouPreferencesV1 } from '@/lib/platform/types';
import type { FitAdvice } from './types';

function totalVotes(a: ReturnType<typeof getFitFeedbackAggregate>) {
  return a.runsSmall + a.trueFit + a.runsLarge;
}

/** Сигналы посадки + профиль размера → рекомендация без ML. */
export function buildFitAdvice(sku: string, prefs: ForYouPreferencesV1): FitAdvice {
  const agg = getFitFeedbackAggregate(sku);
  const n = totalVotes(agg);
  if (n >= 3) {
    const max = Math.max(agg.runsSmall, agg.trueFit, agg.runsLarge);
    if (max === agg.runsLarge) {
      return {
        skew: 'size_down',
        headline: 'Чаще большемерит',
        detail: `По отзывам в этом браузере по SKU ${sku}: чаще берут размер меньше. Сравните с вашим обычным ${prefs.sizeHint}.`,
      };
    }
    if (max === agg.runsSmall) {
      return {
        skew: 'size_up',
        headline: 'Чаще маломерит',
        detail: `По отзывам для ${sku}: рассмотрите размер больше вашего типичного ${prefs.sizeHint}.`,
      };
    }
    return {
      skew: 'true_to_size',
      headline: 'В основном в размер',
      detail: `Большинство голосов за «в размер» для ${sku}. Ваш базовый размер: ${prefs.sizeHint}.`,
    };
  }
  return {
    skew: 'unknown',
    headline: 'Мало данных по посадке',
    detail: `Пока мало голосов по ${sku}. Укажите размер в «Для вас» и оставьте отзыв на карточке товара — рекомендация уточнится.`,
  };
}
