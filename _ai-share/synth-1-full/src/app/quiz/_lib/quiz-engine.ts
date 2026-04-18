import { ParamKey, NormVec, SegmentInfo, SegmentId, QuizResult, StyleArchetype } from './types';

export const SEGMENTS: SegmentInfo[] = [
  {
    id: 1,
    code: 'S1',
    name: 'Ultra-Mass Market',
    description: 'Супер-массовый, ультра-дешёвый, максимальные объёмы и постоянные скидки.',
  },
  {
    id: 2,
    code: 'S2',
    name: 'Mass Market',
    description:
      'Классический масс-маркет: широкий ассортимент, частые распродажи, базовые материалы.',
  },
  {
    id: 3,
    code: 'S3',
    name: 'Upper Mass Market',
    description: 'Чуть лучшее качество и визуал, чем у масс-маркета, но всё ещё массовый сегмент.',
  },
  {
    id: 4,
    code: 'S4',
    name: 'Value Essentials',
    description: 'Умные базовые вещи: функционально, качественно, без лишнего модного шума.',
  },
  {
    id: 5,
    code: 'S5',
    name: 'Mass Premium / Affordable Premium',
    description: 'Промежуточный сегмент между массом и премиумом.',
  },
  {
    id: 6,
    code: 'S6',
    name: 'Trend-led Fast Contemporary',
    description: 'Быстро меняющиеся коллекции, трендовые модели, частые дропы.',
  },
  {
    id: 7,
    code: 'S7',
    name: 'Urban Contemporary',
    description: 'Городской современный стиль, сильный digital и визуальная айдентика.',
  },
  {
    id: 8,
    code: 'S8',
    name: 'Contemporary',
    description: 'Современный дизайн, хорошее качество и баланс цены.',
  },
  {
    id: 9,
    code: 'S9',
    name: 'Upper Contemporary',
    description: 'Шаг к доступному люксу: лучшее качество, устойчивость, визуал.',
  },
  {
    id: 10,
    code: 'S10',
    name: 'Designer Contemporary',
    description: 'Авторские коллекции, креативный дизайн, капсулы.',
  },
  {
    id: 11,
    code: 'S11',
    name: 'Avant-Garde / Experimental',
    description: 'Концептуальные, экспериментальные бренды, сильный креатив.',
  },
  {
    id: 12,
    code: 'S12',
    name: 'Streetwear',
    description: 'Уличная культура, коллаборации, лимитированные дропы.',
  },
  {
    id: 13,
    code: 'S13',
    name: 'Sport Lifestyle',
    description: 'Между спортом и лайфстайлом, технологичные ткани и функциональность.',
  },
  {
    id: 14,
    code: 'S14',
    name: 'Athleisure Premium',
    description: 'Премиальный athleisure, спорт + премиальные материалы.',
  },
  {
    id: 15,
    code: 'S15',
    name: 'Techwear / Urban Premium',
    description: 'Технологичная городская одежда, мембраны, функциональные детали.',
  },
  {
    id: 16,
    code: 'S16',
    name: 'Structured Heritage',
    description: 'Классический heritage с акцентом на костюмы и структуру.',
  },
  {
    id: 17,
    code: 'S17',
    name: 'Casual Heritage / Utility',
    description: 'Утилитарный, рабочий heritage (workwear, casual).',
  },
  {
    id: 18,
    code: 'S18',
    name: 'Heritage Luxury',
    description: 'Исторические luxury-бренды с сильным ремеслом.',
  },
  {
    id: 19,
    code: 'S19',
    name: 'Accessible Luxury',
    description: 'Доступный люкс, высокое качество, но ещё не haute couture.',
  },
  {
    id: 20,
    code: 'S20',
    name: 'Luxury / Ultra-Luxury / Couture',
    description: 'Высший люкc, couture, эксклюзивные бутики и отсутствие скидок.',
  },
];

export const DIR: Record<ParamKey, 1 | -1 | 0> = {
  price_index: 1,
  production_volume: -1,
  assortment_width: 0,
  materials_quality: 1,
  craftsmanship_level: 1,
  tech_fabrics: 0,
  category_focus: 0,
  discount_intensity: -1,
  d2c_share: 1,
  retail_presence: 1,
  boutique_presence: 1,
  heritage_age: 1,
  innovation_design: 1,
  visual_identity: 1,
  export_share: 1,
  sustainability: 1,
  collab_frequency: 0,
  audience_income: 1,
  digital_maturity: 1,
  price_stability: 1,
};

export const BPI_W: Record<ParamKey, number> = {
  price_index: 0.14,
  materials_quality: 0.12,
  craftsmanship_level: 0.12,
  price_stability: 0.08,
  discount_intensity: 0.08,
  boutique_presence: 0.08,
  retail_presence: 0.06,
  heritage_age: 0.06,
  visual_identity: 0.06,
  innovation_design: 0.05,
  sustainability: 0.05,
  export_share: 0.04,
  d2c_share: 0.04,
  production_volume: 0.02,
  assortment_width: 0,
  tech_fabrics: 0,
  category_focus: 0,
  collab_frequency: 0,
  audience_income: 0,
  digital_maturity: 0,
};

export const calcBPI = (norm: NormVec): number => {
  let s = 0;
  (Object.keys(BPI_W) as ParamKey[]).forEach((key) => {
    const w = BPI_W[key];
    if (!w) return;
    const val = DIR[key] === -1 ? 1 - norm[key] : norm[key];
    s += w * val;
  });
  return Math.round(100 * s);
};

export const getUpgradeTargetSegment = (current: SegmentInfo): SegmentInfo | null => {
  const map: Record<number, number> = {
    1: 3,
    2: 3,
    3: 8,
    4: 8,
    5: 8,
    6: 9,
    7: 9,
    8: 9,
    9: 19,
    10: 19,
    11: 19,
    12: 14,
    13: 14,
    14: 19,
    15: 19,
    16: 18,
    17: 18,
    18: 20,
    19: 20,
    20: 20,
  };
  const targetId = map[current.id as number];
  return SEGMENTS.find((s) => s.id === targetId) || null;
};
