/**
 * Style Engine — правила стилей, скоринг и цветовая гармония
 */

import type { StyleMood, Occasion, ColorPalette, Contrast, Season, StylistProduct, WardrobeItem } from "./types";

/** Маппинг mood → теги для скоринга */
export const MOOD_TAG_MAP: Record<StyleMood, string[]> = {
  Minimal: ["minimal", "capsule", "essential", "clean", "basic"],
  Urban: ["urban", "city", "street", "casual", "everyday"],
  Techwear: ["techwear", "waterproof", "functional", "technical"],
  Classic: ["classic", "premium", "heritage", "timeless", "elegant"],
  SportLuxe: ["sport-luxe", "golf", "athletic", "elevated"],
  AvantGarde: ["avantgarde", "statement", "bold", "experimental"],
};

/** Маппинг occasion → приоритетные теги */
export const OCCASION_TAG_MAP: Record<Occasion, string[]> = {
  Daily: ["everyday", "casual", "comfortable", "comfy"],
  Work: ["minimal", "professional", "formal", "tailored"],
  Date: ["premium", "elevated", "elegant"],
  Travel: ["functional", "versatile", "lightweight", "breathable"],
  Event: ["premium", "statement", "evening", "dressy"],
  Sport: ["sport", "active", "athletic"],
  Golf: ["golf", "sport-luxe", "premium"],
  Evening: ["premium", "formal", "dressy", "evening"],
};

/** Цветовая совместимость: палитра → допустимые цвета */
export const PALETTE_COLORS: Record<ColorPalette, string[]> = {
  Warm: ["taupe", "cream", "camel", "brown", "olive", "terracotta", "sand"],
  Cool: ["black", "gray", "navy", "white", "blue", "slate"],
  Neutral: ["black", "white", "gray", "taupe", "cream", "navy", "beige"],
  Monochrome: ["black", "white", "gray", "charcoal"],
  Vibrant: ["white", "black", "blue", "red", "green", "yellow", "pink"],
};

/** Правила силуэта для occasion */
export const OCCASION_SILHOUETTE: Partial<Record<Occasion, "balanced" | "fitted" | "oversized" | "mixed">> = {
  Work: "fitted",
  Date: "balanced",
  Event: "fitted",
  Evening: "fitted",
  Sport: "oversized",
  Golf: "balanced",
  Daily: "mixed",
  Travel: "mixed",
};

/** Силуэтные теги для скоринга */
const SILHOUETTE_TAGS: Record<string, string[]> = {
  fitted: ["slim-fit", "tailored", "fitted", "form-fitting"],
  oversized: ["oversized", "relaxed", "loose", "boxy"],
  balanced: ["relaxed", "tailored", "regular-fit", "minimal"],
  mixed: [],
};

/** Акцентные цвета (один на образ при нейтральной базе) */
const ACCENT_COLORS = ["blue", "red", "green", "yellow", "pink", "olive", "terracotta"];
const NEUTRAL_COLORS = ["black", "white", "gray", "navy", "beige", "taupe", "cream", "charcoal"];

/** Дополнительные пары (для контрастных акцентов) */
const COMPLEMENTARY_PAIRS: [string, string][] = [
  ["blue", "orange"],
  ["blue", "camel"],
  ["navy", "cream"],
  ["black", "white"],
  ["olive", "terracotta"],
  ["gray", "cream"],
];

export function isAccentColor(color: string): boolean {
  return ACCENT_COLORS.includes(color.toLowerCase());
}

export function existingPicksAreNeutral(picks: { color?: string }[]): boolean {
  const colors = picks.map((p) => p.color?.toLowerCase()).filter((c): c is string => Boolean(c));
  return colors.length > 0 && colors.every((c) => NEUTRAL_COLORS.includes(c));
}

/**
 * Скоринг товара по запросу и bias-тегам
 */
export function scoreProduct(
  p: StylistProduct,
  ctx: {
    mood: StyleMood;
    occasion: Occasion;
    season: Season;
    palette?: ColorPalette;
    contrast?: Contrast;
    biasTags: string[];
    silhouetteRule?: "balanced" | "fitted" | "oversized" | "mixed";
    favoriteColors?: string[];
    excludedCategories?: string[];
    temperature?: number;
    excludeOversized?: boolean;
    excludeBright?: boolean;
    likedTags?: string[];
    dislikedTags?: string[];
    budgetPreference?: 'economy' | 'standard' | 'premium';
  }
): number {
  const tags = p.tags.map((t) => t.toLowerCase());
  let score = 0;

  // Budget Optimization
  if (ctx.budgetPreference === 'economy') {
    // Чем дешевле, тем выше балл (условно < 10к — хорошо, > 30к — плохо)
    if (p.price < 10000) score += 5;
    else if (p.price > 30000) score -= 8;
    else if (p.price > 50000) score -= 15;
  } else if (ctx.budgetPreference === 'premium') {
    // Чем дороже, тем лучше (или наличие премиум-тегов)
    if (p.price > 50000) score += 8;
    if (p.price > 100000) score += 15;
    if (tags.includes('premium') || tags.includes('luxury')) score += 5;
    if (p.price < 10000) score -= 5;
  }

  // Feedback loop: liked/disliked tags (and IDs)
  if (ctx.likedTags?.length) {
    if (ctx.likedTags.includes(p.id)) score += 10; // Сильный бонус за конкретный лайкнутый товар
    for (const t of tags) {
      if (ctx.likedTags.includes(t)) score += 2;
    }
  }
  if (ctx.dislikedTags?.length) {
    if (ctx.dislikedTags.includes(p.id)) score -= 20; // Сильный штраф
    for (const t of tags) {
      if (ctx.dislikedTags.includes(t)) score -= 4;
    }
  }

  // Базовые bias-теги (для вариативности между образами)
  for (const b of ctx.biasTags) {
    if (tags.includes(b)) score += 3;
  }

  // Mood
  const moodTags = MOOD_TAG_MAP[ctx.mood] ?? [];
  for (const t of moodTags) {
    if (tags.includes(t)) score += 2;
  }

  // Occasion
  const occasionTags = OCCASION_TAG_MAP[ctx.occasion] ?? [];
  for (const t of occasionTags) {
    if (tags.includes(t)) score += 2;
  }

  // Сезон
  if (p.season !== "All") {
    const isSS = ctx.season === "Spring" || ctx.season === "Summer";
    const isFW = ctx.season === "Autumn" || ctx.season === "Winter";
    if ((isSS && p.season === "SS") || (isFW && p.season === "FW")) score += 2;
  }

  // Палитра
  if (ctx.palette) {
    const paletteColors = PALETTE_COLORS[ctx.palette].map((c) => c.toLowerCase());
    const colorLower = p.color.toLowerCase();
    if (paletteColors.includes(colorLower)) score += 3;
  }

  // Contrast
  if (ctx.contrast) {
    const contrastTag = `${ctx.contrast.toLowerCase()}-contrast`;
    if (tags.includes(contrastTag)) score += 2;
  }

  // Occasion-specific бонусы
  if (ctx.occasion === "Golf" && tags.includes("golf")) score += 3;
  if (ctx.occasion === "Work") {
    if (tags.includes("minimal")) score += 2;
    if (tags.includes("formal") || tags.includes("professional")) score += 3;
    if (tags.includes("tailored") || tags.includes("slim-fit")) score += 2;
  }
  if (ctx.occasion === "Evening" || ctx.occasion === "Event") {
    if (tags.includes("premium")) score += 3;
    if (tags.includes("formal") || tags.includes("dressy")) score += 2;
    if (tags.includes("statement")) score += 2;
  }
  if (ctx.occasion === "Date" && (tags.includes("premium") || tags.includes("elegant"))) score += 2;
  if (ctx.occasion === "Sport" && (tags.includes("sport") || tags.includes("active") || tags.includes("athletic"))) score += 2;
  if (ctx.occasion === "Travel" && (tags.includes("functional") || tags.includes("versatile") || tags.includes("lightweight"))) score += 2;

  if (tags.includes("premium")) score += 1;

  if (ctx.excludedCategories?.includes(p.category)) score -= 5;
  if (ctx.favoriteColors?.length && ctx.favoriteColors.map((c) => c.toLowerCase()).includes(p.color.toLowerCase())) score += 3;

  if (ctx.temperature != null && ctx.temperature < 10 && p.category === "Outerwear") score += 3;
  if (ctx.temperature != null && ctx.temperature >= 25 && p.category === "Outerwear") score -= 2;

  if (ctx.excludeOversized && tags.some((t) => SILHOUETTE_TAGS.oversized.includes(t))) score -= 5;
  if (ctx.excludeBright && ACCENT_COLORS.includes(p.color.toLowerCase())) score -= 3;

  // Силуэт: бонус за соответствие правилу
  if (ctx.silhouetteRule && ctx.silhouetteRule !== "mixed") {
    const ruleTags = SILHOUETTE_TAGS[ctx.silhouetteRule] ?? [];
    if (ruleTags.some((t) => tags.includes(t))) score += 2;
  }

  return score;
}

/**
 * Оценка "долговечности" вещи (Longevity Score)
 * 0 - ультра-тренд на один сезон
 * 100 - вечная классика
 */
export function getLongevityScore(p: StylistProduct): number {
  const tags = p.tags.map((t) => t.toLowerCase());
  let score = 50; // Базовая оценка

  const longevityTags = ["basic", "classic", "timeless", "heritage", "capsule", "essential", "minimal"];
  const trendTags = ["trend", "statement", "experimental", "bold", "avantgarde", "seasonal", "y2k", "cyber"];

  for (const t of tags) {
    if (longevityTags.includes(t)) score += 8;
    if (trendTags.includes(t)) score -= 10;
  }

  // Материалы (если есть в тегах)
  if (tags.includes("wool") || tags.includes("cashmere") || tags.includes("silk") || tags.includes("leather")) {
    score += 5;
  }

  // Ограничиваем 0-100
  return Math.max(0, Math.min(100, score));
}

/** Проверка: товар не создаёт дисбаланс силуэта (oversized + oversized) */
export function checkSilhouetteBalance(
  product: StylistProduct,
  existingPicks: StylistProduct[]
): boolean {
  const tags = product.tags.map((t) => t.toLowerCase());
  const hasOversized = tags.some((t) => SILHOUETTE_TAGS.oversized.includes(t));
  if (!hasOversized) return true;

  const allPicks = [...existingPicks, product];
  const upperCategories = ["Outerwear", "Tops"];
  const lowerCategories = ["Bottoms", "Shoes"];
  const upperOversized = allPicks.filter(
    (p) => upperCategories.includes(p.category) && p.tags.some((t) => SILHOUETTE_TAGS.oversized.includes(t.toLowerCase()))
  ).length;
  const lowerOversized = allPicks.filter(
    (p) => lowerCategories.includes(p.category) && p.tags.some((t) => SILHOUETTE_TAGS.oversized.includes(t.toLowerCase()))
  ).length;
  return !(upperOversized >= 2 || lowerOversized >= 2);
}

/**
 * Проверка цветовой гармонии: товар совместим с вещами из гардероба
 */
export function checkColorHarmony(
  product: StylistProduct,
  wardrobeItems: WardrobeItem[],
  palette?: ColorPalette
): boolean {
  if (wardrobeItems.length === 0) return true;

  const productColor = product.color.toLowerCase();
  const wardrobeColors = wardrobeItems
    .map((w) => w.color?.toLowerCase())
    .filter(Boolean) as string[];

  if (wardrobeColors.length === 0) return true;

  // Нейтральные цвета сочетаются с чем угодно
  const neutrals = ["black", "white", "gray", "navy", "beige"];
  if (neutrals.includes(productColor)) return true;
  if (wardrobeColors.some((c) => neutrals.includes(c))) return true;

  // При заданной палитре — проверяем вхождение
  if (palette) {
    const allowed = PALETTE_COLORS[palette].map((c) => c.toLowerCase());
    return allowed.includes(productColor) || wardrobeColors.every((c) => allowed.includes(c));
  }

  return true;
}

/** Проверка: цвет дополняет уже выбранные в образе */
export function isComplementaryTo(
  color: string,
  existingColors: string[]
): boolean {
  const c = color.toLowerCase();
  return existingColors.some((existing) => {
    const e = existing.toLowerCase();
    return COMPLEMENTARY_PAIRS.some(([a, b]) => (a === c && b === e) || (a === e && b === c));
  });
}

const OCCASION_REASONS: Partial<Record<Occasion, string>> = {
  Work: "деловой дресс-код",
  Evening: "вечерний выход",
  Date: "романтичный образ",
  Sport: "спортивная функциональность",
  Travel: "практичность в поездке",
};

/**
 * Генерация объяснения выбора
 */
export function explainPick(
  p: StylistProduct,
  ctx: {
    mood: StyleMood;
    occasion?: Occasion;
    palette?: ColorPalette;
    contrast?: Contrast;
    biasTags: string[];
  },
  isFromWardrobe: boolean
): string {
  if (isFromWardrobe) return "Твоя вещь из гардероба";

  const reasons: string[] = [];

  if (ctx.occasion && OCCASION_REASONS[ctx.occasion] && OCCASION_TAG_MAP[ctx.occasion]?.some((t) => p.tags.includes(t))) {
    reasons.push(OCCASION_REASONS[ctx.occasion]!);
  }
  if (p.audience === "Unisex") reasons.push("универсальный крой");
  if (p.tags.includes("premium")) reasons.push("премиальное качество");
  if (ctx.palette && PALETTE_COLORS[ctx.palette]?.map((c) => c.toLowerCase()).includes(p.color.toLowerCase())) {
    reasons.push(`соответствие ${ctx.palette.toLowerCase()} гамме`);
  }
  if (ctx.contrast && p.tags.includes(`${ctx.contrast.toLowerCase()}-contrast`)) {
    reasons.push(`баланс контрастности`);
  }
  if (ctx.biasTags.some((t) => p.tags.includes(t))) reasons.push("стилистический акцент");
  if (p.category === "Outerwear" && p.tags.includes("classic")) reasons.push("классический верх");

  if (!reasons.length) reasons.push("базовый элемент образа");

  return reasons.join(", ");
}
