/**
 * Парсинг пожеланий из чата для уточнения параметров подбора.
 * Сначала regex, при необходимости — LLM (через parseChatWithLLM).
 */

import type { Occasion, StyleMood, ColorPalette } from './types';

export type ParsedParams = {
  occasion?: Occasion;
  mood?: StyleMood;
  palette?: ColorPalette;
  excludeOversized?: boolean;
  excludeBright?: boolean;
  budgetMax?: number;
  colors?: string[];
  /** Дождь/осадки — приоритет верхней одежды */
  rainy?: boolean;
  /** Уточнение: дешевле, дороже, другой стиль */
  refineCheaper?: boolean;
  refinePricier?: boolean;
};

const OCCASION_KEYWORDS: { kw: string[]; occasion: Occasion }[] = [
  {
    kw: ['вечер', 'evening', 'ужин', 'ресторан', 'мероприятие', 'event', 'выход'],
    occasion: 'Evening',
  },
  { kw: ['работа', 'офис', 'деловой', 'work', 'бизнес', 'встреча', 'презентац'], occasion: 'Work' },
  { kw: ['свидание', 'date', 'романтик'], occasion: 'Date' },
  { kw: ['спорт', 'спортивный', 'тренировка', 'sport', 'активный', 'фитнес'], occasion: 'Sport' },
  { kw: ['гольф', 'golf'], occasion: 'Golf' },
  { kw: ['путешествие', 'travel', 'поездка', 'отпуск', 'отдых'], occasion: 'Travel' },
  { kw: ['повседнев', 'ежеднев', 'casual', 'daily', 'на каждый день'], occasion: 'Daily' },
];

const MOOD_KEYWORDS: { kw: string[]; mood: StyleMood }[] = [
  { kw: ['минимал', 'minimal', 'простой', 'лаконич', 'базов'], mood: 'Minimal' },
  { kw: ['урбан', 'urban', 'город', 'street', 'уличн'], mood: 'Urban' },
  { kw: ['техно', 'techwear', 'техническ', 'функциональ'], mood: 'Techwear' },
  { kw: ['классик', 'classic', 'премиум', 'элегант'], mood: 'Classic' },
  { kw: ['спорт-люкс', 'sport-luxe', 'гольф', 'атлетич'], mood: 'SportLuxe' },
  { kw: ['авангард', 'avantgarde', 'дерзк', 'смел', 'ярк', 'statement'], mood: 'AvantGarde' },
];

const PALETTE_KEYWORDS: { kw: string[]; palette: ColorPalette }[] = [
  { kw: ['тепл', 'warm', 'беж', 'карамел', 'оливк'], palette: 'Warm' },
  { kw: ['холодн', 'cool', 'синий', 'серый', 'черный'], palette: 'Cool' },
  { kw: ['нейтрал', 'neutral', 'базов'], palette: 'Neutral' },
  { kw: ['монохром', 'monochrome', 'черно-бел'], palette: 'Monochrome' },
  { kw: ['ярк', 'vibrant', 'цветн', 'акцент'], palette: 'Vibrant' },
];

const NEGATIVE_KEYWORDS = ['без', 'не', 'no', 'not', 'исключит'];

export function parseChatParams(message: string): ParsedParams {
  if (!message?.trim()) return {};
  const lower = message.toLowerCase().trim();
  const result: ParsedParams = {};

  for (const { kw, occasion } of OCCASION_KEYWORDS) {
    if (kw.some((k) => lower.includes(k))) {
      const hasNeg = NEGATIVE_KEYWORDS.some((n) => lower.includes(n));
      if (!hasNeg) {
        result.occasion = occasion;
        break;
      }
    }
  }

  for (const { kw, mood } of MOOD_KEYWORDS) {
    if (kw.some((k) => lower.includes(k))) {
      result.mood = mood;
      break;
    }
  }

  for (const { kw, palette } of PALETTE_KEYWORDS) {
    if (kw.some((k) => lower.includes(k))) {
      result.palette = palette;
      break;
    }
  }

  if (lower.includes('oversized') && (lower.includes('без') || lower.includes('не'))) {
    result.excludeOversized = true;
  }
  if (lower.includes('ярк') && (lower.includes('без') || lower.includes('не'))) {
    result.excludeBright = true;
  }

  if (['дождь', 'дожд', 'rain', 'мокр', 'сыр', 'влажн'].some((k) => lower.includes(k))) {
    result.rainy = true;
  }

  if (['дешевле', 'бюджетн', 'эконом', 'cheaper', 'подешевле'].some((k) => lower.includes(k))) {
    result.refineCheaper = true;
  }
  if (['дороже', 'премиум', 'люкс', 'pricier', 'подороже'].some((k) => lower.includes(k))) {
    result.refinePricier = true;
  }

  const budgetMatch =
    lower.match(/(?:до|бюджет|макс|max)\s*(\d+)\s*(?:к|тыс)?/i) ||
    lower.match(/(\d+)\s*(?:к|тыс)\s*(?:₽|руб)?/i) ||
    lower.match(/(\d{5,})\s*(?:₽|руб)?/i);
  if (budgetMatch) {
    let num = parseInt(budgetMatch[1], 10);
    const fullMatch = budgetMatch[0];
    if ((/к|тыс/.test(fullMatch) || num < 100) && num < 1000) num *= 1000;
    if (num > 0 && num < 1_000_000) result.budgetMax = num;
  }

  const colorMap: Record<string, string> = {
    черн: 'black',
    бел: 'white',
    сер: 'gray',
    синий: 'navy',
    голуб: 'blue',
    беж: 'beige',
    оливк: 'olive',
    коричнев: 'brown',
    красн: 'red',
    розов: 'pink',
    зелен: 'green',
    желт: 'yellow',
    'синий деним': 'blue',
  };
  const foundColors: string[] = [];
  for (const [ru, en] of Object.entries(colorMap)) {
    if (lower.includes(ru)) foundColors.push(en);
  }
  if (foundColors.length) result.colors = [...new Set(foundColors)];

  return result;
}

/**
 * Асинхронный парсер: regex + LLM при необходимости.
 * Вызывай когда regex дал пустой occasion и сообщение достаточно длинное.
 */
export async function parseChatParamsAsync(message: string): Promise<ParsedParams> {
  const regexResult = parseChatParams(message);
  if (message.trim().length < 10) return regexResult;

  const needsLLM =
    !regexResult.occasion || (!regexResult.mood && !regexResult.palette && !regexResult.budgetMax);
  if (!needsLLM) return regexResult;

  try {
    const { parseChatWithLLM } = await import('@/ai/flows/parse-chat-with-llm');
    const llmResult = await parseChatWithLLM(message);
    const merged: ParsedParams = { ...regexResult };

    if (llmResult.occasion && !merged.occasion) merged.occasion = llmResult.occasion as Occasion;
    if (llmResult.mood && !merged.mood) merged.mood = llmResult.mood as StyleMood;
    if (llmResult.palette && !merged.palette) merged.palette = llmResult.palette as ColorPalette;
    if (llmResult.budgetMax && !merged.budgetMax) merged.budgetMax = llmResult.budgetMax;
    if (llmResult.colors?.length && !merged.colors?.length) merged.colors = llmResult.colors;
    if (llmResult.excludeOversized) merged.excludeOversized = true;
    if (llmResult.excludeBright) merged.excludeBright = true;

    return merged;
  } catch {
    return regexResult;
  }
}
