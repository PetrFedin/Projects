/**
 * Look Builder — pipeline для формирования образов
 */

import type {
  Look,
  LookItem,
  LookStrategy,
  StylistProduct,
  WardrobeItem,
  ProductCategory,
  Occasion,
  Season,
} from "./types";
import { 
  scoreProduct, 
  checkColorHarmony, 
  explainPick, 
  checkSilhouetteBalance, 
  isAccentColor, 
  existingPicksAreNeutral, 
  isComplementaryTo,
  getLongevityScore
} from "./style-engine";
import { LOOK_STRATEGIES } from "./strategies";

export interface BuildContext {
  mood: string;
  occasion: Occasion;
  season: Season;
  palette?: string;
  contrast?: string;
  audience: string;
  includeCategories: ProductCategory[];
  wardrobe: WardrobeItem[];
  preferences?: {
    favoriteColors?: string[];
    excludedCategories?: ProductCategory[];
    excludeOversized?: boolean;
    excludeBright?: boolean;
    likedTags?: string[];
    dislikedTags?: string[];
  };
  temperature?: number; // °C, для выбора верхней одежды
}

export interface PipelineStep {
  name: string;
  run: (pool: StylistProduct[], ctx: BuildContext) => StylistProduct[];
}

/** Шаг 1: Фильтрация по гардеробу — помечаем категории, занятые гардеробом */
function filterByWardrobeCategories(
  pool: StylistProduct[],
  ctx: BuildContext
): StylistProduct[] {
  return pool;
}

/** Шаг 2: Фильтрация по цветовой гармонии с гардеробом (не урезаем пул до пустоты) */
function filterByColorHarmony(
  pool: StylistProduct[],
  ctx: BuildContext
): StylistProduct[] {
  if (ctx.wardrobe.length === 0) return pool;

  const filtered = pool.filter((p) =>
    checkColorHarmony(
      p,
      ctx.wardrobe,
      ctx.palette as "Warm" | "Cool" | "Neutral" | "Monochrome" | "Vibrant" | undefined
    )
  );
  return filtered.length > 0 ? filtered : pool;
}

/** 
 * Сборка одного образа по стратегии
 */
export function buildSingleLook(
  pool: StylistProduct[],
  ctx: BuildContext,
  strategy: LookStrategy,
  options: {
    seed: number;
    strictlyExcludeIds: string[];
    overlapConstraint?: { ids: string[]; max: number };
    prevLookColors?: string[];
  }
): Look {
  const { seed, strictlyExcludeIds, overlapConstraint, prevLookColors } = options;
  const wanted = ctx.includeCategories;
  const picks: StylistProduct[] = [];
  const wardrobeItems = ctx.wardrobe;
  let currentOverlaps = 0;

  for (const cat of wanted) {
    const wardrobeItem = wardrobeItems.find((it) => it.category === cat);
    if (wardrobeItem) {
      picks.push(toStylistProduct(wardrobeItem, ctx.audience));
      continue;
    }

    let candidates = pool.filter(
      (p) => p.category === cat && !strictlyExcludeIds.includes(p.id)
    );

    candidates = candidates.filter((p) => checkSilhouetteBalance(p, picks));

    if (!candidates.length) {
      candidates = pool.filter(
        (p) => p.category === cat && !strictlyExcludeIds.includes(p.id)
      );
    }

    if (!candidates.length) continue;

    const scored = candidates
      .map((p) => {
        let score = scoreProduct(p, {
          mood: ctx.mood as "Minimal" | "Urban" | "Techwear" | "Classic" | "SportLuxe" | "AvantGarde",
          occasion: ctx.occasion,
          season: ctx.season,
          palette: ctx.palette as "Warm" | "Cool" | "Neutral" | "Monochrome" | "Vibrant" | undefined,
          contrast: ctx.contrast as "High" | "Medium" | "Low" | undefined,
          biasTags: strategy.biasTags,
          silhouetteRule: strategy.silhouetteRule,
          favoriteColors: ctx.preferences?.favoriteColors,
          excludedCategories: ctx.preferences?.excludedCategories,
          temperature: ctx.temperature,
          excludeOversized: ctx.preferences?.excludeOversized,
          excludeBright: ctx.preferences?.excludeBright,
          likedTags: ctx.preferences?.likedTags,
          dislikedTags: ctx.preferences?.dislikedTags,
        });
        if (prevLookColors?.length && prevLookColors.includes(p.color.toLowerCase())) {
          score -= 3;
        }
        if (existingPicksAreNeutral(picks) && isAccentColor(p.color)) {
          score += 2;
        }
        const existingColors = picks.map((x) => x.color).filter(Boolean);
        if (existingColors.length > 0 && isComplementaryTo(p.color, existingColors)) {
          score += 2;
        }
        return { p, score };
      })
      .sort((a, b) => b.score - a.score);

    let chosen: StylistProduct | undefined;

    if (overlapConstraint) {
      const allowedCandidates = scored.filter((item) => {
        const isOverlap = overlapConstraint.ids.includes(item.p.id);
        if (isOverlap && currentOverlaps >= overlapConstraint.max) return false;
        return true;
      });
      chosen =
        allowedCandidates[Math.min(seed, allowedCandidates.length - 1)]?.p ??
        allowedCandidates[0]?.p;
      if (chosen && overlapConstraint.ids.includes(chosen.id)) currentOverlaps++;
    } else {
      chosen = scored[Math.min(seed, scored.length - 1)]?.p ?? scored[0]?.p;
    }

    if (chosen) picks.push(chosen);
  }

  const items: LookItem[] = picks.map((p) => {
    const isFromWardrobe = wardrobeItems.some((it) => it.id === p.id);
    return {
      productId: p.id,
      title: p.title,
      price: p.price,
      reason: explainPick(
        p,
        {
          mood: ctx.mood as "Minimal" | "Urban" | "Techwear" | "Classic" | "SportLuxe" | "AvantGarde",
          occasion: ctx.occasion,
          palette: ctx.palette as "Warm" | "Cool" | "Neutral" | "Monochrome" | "Vibrant" | undefined,
          contrast: ctx.contrast as "High" | "Medium" | "Low" | undefined,
          biasTags: strategy.biasTags,
        },
        isFromWardrobe
      ),
      isFromWardrobe,
    };
  });

  const totalPrice = picks.reduce((s, p) => s + p.price, 0);
  const longevityScore = Math.round(
    picks.reduce((s, p) => s + getLongevityScore(p), 0) / picks.length
  );

  const why = [
    `Синтезировано для категории ${ctx.audience}`,
    `Логика "${ctx.occasion}" + эстетика "${ctx.mood}"`,
    ctx.palette ? `Выдержана ${ctx.palette.toLowerCase()} палитра` : "Свободное цветовое решение",
    ctx.contrast ? `Учтена ${ctx.contrast.toLowerCase()} контрастность` : null,
    wardrobeItems.length > 0
      ? `Интегрировано вещей из гардероба: ${wardrobeItems.length}`
      : null,
  ].filter(Boolean) as string[];

  return {
    id: `look-${seed}-${Date.now()}`,
    title: strategy.label,
    confidence: Math.max(0.6, Math.min(0.95, 0.88 - seed * 0.05)),
    items,
    why,
    totalPrice,
    strategy: strategy.id,
    longevityScore,
  };
}

/** Формирование пула образов по pipeline */
export function buildLooksPipeline(
  pool: StylistProduct[],
  ctx: BuildContext
): StylistProduct[] {
  return [filterByWardrobeCategories, filterByColorHarmony].reduce(
    (acc, step) => step(acc, ctx),
    pool
  );
}

/** Генерация трёх образов с разными стратегиями */
export function buildThreeLooks(
  pool: StylistProduct[],
  ctx: BuildContext
): Look[] {
  const filteredPool = buildLooksPipeline(pool, ctx);

  const looks: Look[] = [];

  for (let i = 0; i < LOOK_STRATEGIES.length; i++) {
    const strategy = LOOK_STRATEGIES[i];
    const prevIds = looks[i - 1]?.items.map((it) => it.productId) ?? [];
    const prevLook = looks[i - 1];
    const prevLookColors = prevLook
      ? getLookColors(prevLook, filteredPool, ctx.wardrobe)
      : undefined;

    const overlapConstraint =
      strategy.maxOverlapWithPrevious != null && prevIds.length
        ? { ids: prevIds, max: strategy.maxOverlapWithPrevious }
        : undefined;

    const look = buildSingleLook(filteredPool, ctx, strategy, {
      seed: i,
      strictlyExcludeIds: strategy.excludeFromPrimary ?? [],
      overlapConstraint,
      prevLookColors,
    });

    looks.push(look);
  }

  return looks;
}

function getLookColors(
  look: Look,
  pool: StylistProduct[],
  wardrobe: WardrobeItem[]
): string[] {
  const colors: string[] = [];
  for (const it of look.items) {
    const fromPool = pool.find((p) => p.id === it.productId);
    if (fromPool) colors.push(fromPool.color.toLowerCase());
    else {
      const fromWardrobe = wardrobe.find((w) => w.id === it.productId);
      if (fromWardrobe?.color) colors.push(fromWardrobe.color.toLowerCase());
    }
  }
  return [...new Set(colors)];
}

function toStylistProduct(w: WardrobeItem, audience: string): StylistProduct {
  return {
    id: w.id,
    title: w.title,
    brand: "My Wardrobe",
    category: w.category,
    price: 0,
    color: w.color ?? "",
    audience,
    season: "All",
    tags: w.tags,
    image: w.image,
  };
}
