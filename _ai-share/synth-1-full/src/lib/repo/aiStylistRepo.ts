import { Product, Audience } from "@/data/products.mock";
import type { WardrobeItem } from "@/data/wardrobe.mock";
export type { WardrobeItem };
import {
  filterProducts as filterProductsFn,
  buildThreeLooks,
  getStylistProductPool,
  type StylistProduct,
  type Occasion,
  type StyleMood,
  type Contrast,
  type ColorPalette,
  type Season,
  type Look,
  type LookItem,
} from "@/lib/ai-stylist";
import { enrichLookReasons, type EnrichLookReasonsParams } from "@/ai/flows/enrich-look-reasons";
import { parseChatWithLLM } from "@/ai/flows/parse-chat-with-llm";
import { generateStylistReply } from "@/ai/flows/generate-stylist-reply";

export type { Occasion, StyleMood, Contrast, ColorPalette, Season, Look, LookItem };

export type ProductCategory = Product["category"];

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export type StylistPreferences = {
  favoriteColors?: string[];
  excludedCategories?: Product["category"][];
  excludeOversized?: boolean;
  excludeBright?: boolean;
  likedTags?: string[];
  dislikedTags?: string[];
  budgetPreference?: 'economy' | 'standard' | 'premium';
};

export type StylistRequest = {
  audience: Audience;
  occasion: Occasion;
  mood: StyleMood;
  season: Season;
  includeCategories: Product["category"][];
  contrast?: Contrast;
  palette?: ColorPalette;
  budgetMax?: number;
  colors?: string[];
  wardrobe?: WardrobeItem[];
  messages?: Message[];
  preferences?: StylistPreferences;
  temperature?: number; // °C (для погоды)
  isCapsule?: boolean;
  aestheticPrompt?: string;
  personalItemImage?: string;
};

export type StylistResponse = {
  looks: Look[];
  notes: string[];
  reply?: string;
  capsule?: {
    items: LookItem[];
    combinations: Look[];
  };
};

export interface AiStylistRepo {
  generateLooks(req: StylistRequest): Promise<StylistResponse>;
  getProductDetails(query: string): Promise<Product | null>;
  suggestProductsForLook(image: string): Promise<LookItem[]>;
}

function generateAiReply(req: StylistRequest): string {
  if (req.messages && req.messages.length > 0) {
    const lastMsg = req.messages[req.messages.length - 1].content.toLowerCase();
    if (lastMsg.includes("привет") || lastMsg.includes("здравствуй")) {
      return "Привет! Я твой AI-стилист Syntha. Я проанализировал твой запрос и подготовил несколько вариантов образов. Что скажешь?";
    }
    if (lastMsg.includes("деловой") || lastMsg.includes("ужин")) {
      return "Для делового ужина я подобрал образы, которые сочетают в себе профессионализм и элегантность. Посмотри на варианты ниже.";
    }
  }

  if (req.wardrobe && req.wardrobe.length > 0) {
    return `Я подготовил образы, взяв за основу твой ${req.wardrobe[0].title}. Я добавил вещи из каталога, которые идеально его дополняют.`;
  }

  return "Я подобрал для тебя лучшие варианты на основе твоих предпочтений. Давай разберем каждый из них!";
}

export class MockAiStylistRepo implements AiStylistRepo {
  async suggestProductsForLook(image: string): Promise<LookItem[]> {
    return [
      { productId: "1", reason: "Совпадение по цветовой гамме (98%)" },
      { productId: "2", reason: "Аналогичный крой и силуэт (94%)" },
      { productId: "3", reason: "Рекомендовано как дополнение к образу" },
    ];
  }

  async getProductDetails(query: string): Promise<Product | null> {
    const q = query.toLowerCase();
    const pool = getStylistProductPool();
    const found = pool.find(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
    return found ? ({ id: found.id, title: found.title, brand: found.brand, price: found.price, tags: found.tags } as Product) : null;
  }

  async generateLooks(req: StylistRequest): Promise<StylistResponse> {
    const allProducts = getStylistProductPool();
    const colors = req.colors ?? req.preferences?.favoriteColors;
    let filtered = filterProductsFn(allProducts, {
      audience: req.audience,
      season: req.season,
      budgetMax: req.budgetMax,
      colors: colors?.length ? colors : undefined,
      brandFilter: "syntha",
    });

    if (filtered.length === 0) {
      filtered = filterProductsFn(allProducts, {
        audience: req.audience,
        season: "All",
        budgetMax: req.budgetMax,
        colors: undefined,
        brandFilter: "syntha",
      });
    }

    const pool = filtered as StylistProduct[];
    const wardrobe: WardrobeItem[] = req.wardrobe ?? [];
    let includeCategories = req.includeCategories;
    if (req.preferences?.excludedCategories?.length) {
      includeCategories = includeCategories.filter((c) => !req.preferences!.excludedCategories!.includes(c));
    }
    if (includeCategories.length === 0) includeCategories = req.includeCategories;

    const looks = buildThreeLooks(pool, {
      mood: req.mood,
      occasion: req.occasion,
      season: req.season,
      palette: req.palette,
      contrast: req.contrast,
      audience: req.audience,
      includeCategories,
      wardrobe,
      preferences: req.preferences,
      temperature: req.temperature,
    });

    // LLM-enriched объяснения выбора и персонализированный ответ
    const productMap = new Map<string, { title: string; category: string; color: string; tags: string[]; price: number }>();
    for (const p of pool) {
      productMap.set(p.id, { title: p.title, category: p.category, color: p.color, tags: p.tags, price: p.price });
    }
    for (const w of wardrobe) {
      productMap.set(w.id, { title: w.title, category: w.category, color: w.color ?? "", tags: w.tags, price: 0 });
    }

    const itemsForEnrich: EnrichLookReasonsParams["items"] = [];
    for (const look of looks) {
      for (const it of look.items) {
        const info = productMap.get(it.productId);
        if (info) {
          itemsForEnrich.push({
            productId: it.productId,
            title: info.title,
            category: info.category,
            color: info.color,
            tags: info.tags,
            currentReason: it.reason,
            isFromWardrobe: it.isFromWardrobe ?? false,
            lookTitle: look.title,
          });
        }
      }
    }

    let enrichedLooks = looks;
    if (itemsForEnrich.length > 0) {
      try {
        const enrichedReasons = await enrichLookReasons({
          occasion: req.occasion,
          mood: req.mood,
          season: req.season,
          palette: req.palette,
          items: itemsForEnrich,
        });
        enrichedLooks = looks.map((look) => ({
          ...look,
          items: look.items.map((it) => ({
            ...it,
            reason: enrichedReasons[it.productId] ?? it.reason,
          })),
        }));
      } catch {
        // fallback to original reasons
      }
    }

    const looksSummary = looks
      .map((l) => `${l.title}: ${l.items.map((it) => it.title).join(", ")}`)
      .join("; ");

    const reply = await generateStylistReply({
      userMessage: req.messages?.length ? req.messages[req.messages.length - 1].content : undefined,
      occasion: req.occasion,
      mood: req.mood,
      season: req.season,
      wardrobeItemTitle: wardrobe.length > 0 ? wardrobe[0].title : undefined,
      hasPersonalItem: !!req.personalItemImage,
      looksCount: looks.length,
      looksSummary: looksSummary.slice(0, 500),
      totalPriceRange: `${Math.min(...looks.map((l) => l.totalPrice))} - ${Math.max(...looks.map((l) => l.totalPrice))} ₽`,
      temperature: req.temperature,
    });

    const response: StylistResponse = {
      looks: enrichedLooks,
      notes: [
        `Целевая аудитория: ${req.audience}`,
        `Сценарий: ${req.occasion}`,
        `Сезон: ${req.season}`,
        `Стиль: ${req.mood}`,
        req.contrast ? `Контрастность: ${req.contrast}` : null,
        req.palette ? `Гамма: ${req.palette}` : null,
        req.budgetMax
          ? `Бюджет: до ${req.budgetMax.toLocaleString("ru-RU")} ₽`
          : "Бюджет не ограничен",
        req.personalItemImage ? "Интеграция с вашей вещью (Digital Closet Sync)" : null,
      ].filter(Boolean) as string[],
      reply,
    };

    if (req.isCapsule) {
      // Simulate capsule generation
      const capsuleItems = pool.slice(0, 6).map(p => ({
        productId: p.id,
        title: p.title,
        price: p.price,
        reason: "Идеально вписывается в капсулу"
      }));
      
      response.capsule = {
        items: capsuleItems,
        combinations: looks.map((l, i) => ({
          ...l,
          title: `Вариант сочетания #${i + 1}`,
          why: ["Эти вещи из капсулы создают гармоничный образ."]
        }))
      };
    }

    return response;
  }
}
