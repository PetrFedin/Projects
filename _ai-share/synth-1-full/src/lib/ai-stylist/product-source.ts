/**
 * Единый источник товаров для AI-стилиста: products.mock + lib/products
 */

import { PRODUCTS as MOCK_PRODUCTS } from "@/data/products.mock";
import type { Product as MockProduct } from "@/data/products.mock";
import { products as LIB_PRODUCTS } from "@/lib/products";
import type { StylistProduct } from "./types";

const CATEGORY_MAP: Record<string, StylistProduct["category"]> = {
  "Топы": "Tops",
  "Брюки": "Bottoms",
  "Верхняя одежда": "Outerwear",
  "Обувь": "Shoes",
  "Аксессуары": "Accessories",
  "Платья": "Tops", // платье как верх
  Outerwear: "Outerwear",
  Tops: "Tops",
  Bottoms: "Bottoms",
  Shoes: "Shoes",
  Accessories: "Accessories",
};

const SEASON_MAP: Record<string, "SS" | "FW" | "All"> = {
  SS24: "SS",
  FW24: "FW",
  FW23: "FW",
  SS23: "SS",
  SS: "SS",
  FW: "FW",
  All: "All",
};

function inferStyleTags(
  category: string,
  brand: string,
  tags: string[],
  color: string
): string[] {
  const result: string[] = [];
  if (brand.toLowerCase().includes("syntha")) result.push("premium");
  if (category.includes("пальто") || category.includes("coat") || category.includes("тренч") || category.includes("trench")) {
    result.push("classic", "formal");
  }
  if (category.includes("брюк") || category.includes("pant")) result.push("minimal");
  if (category.includes("рубаш") || category.includes("shirt")) result.push("minimal", "casual");
  if (category.includes("джинс") || category.includes("denim")) result.push("casual", "urban");
  if (category.includes("кед") || category.includes("sneaker")) result.push("casual", "urban");
  if (category.includes("лофер") || category.includes("loafer")) result.push("classic", "formal");
  if (category.includes("платье") || category.includes("dress")) result.push("premium", "elegant");
  if (category.includes("шелк") || category.includes("silk")) result.push("premium", "elegant");
  if (category.includes("платок") || category.includes("scarf")) result.push("premium", "statement");
  if (category.includes("лонгслив") || category.includes("longsleeve")) result.push("minimal", "essential");
  if (category.includes("сумк") || category.includes("bag") || category.includes("tote")) result.push("city", "versatile");
  if (tags.includes("newSeason")) result.push("premium");
  if (tags.includes("carryover")) result.push("essential");
  const colorLower = color.toLowerCase();
  if (["black", "white", "navy"].includes(colorLower)) result.push("high-contrast");
  if (["gray", "olive", "brown", "charcoal"].includes(colorLower)) result.push("medium-contrast");
  if (["beige", "cream", "camel", "taupe"].includes(colorLower)) result.push("low-contrast");
  return [...new Set(result)];
}

function libProductToStylist(p: { id: string; name: string; brand: string; category: string; price: number; color?: string; season?: string; tags?: string[]; images?: { url: string }[] }): StylistProduct {
  const category = CATEGORY_MAP[p.category] ?? "Tops";
  const season = SEASON_MAP[p.season ?? ""] ?? "All";
  const tags = inferStyleTags(
    p.category,
    p.brand,
    (p.tags ?? []) as string[],
    p.color ?? ""
  );
  const image = Array.isArray(p.images) && p.images[0] && "url" in p.images[0]
    ? (p.images[0] as { url: string }).url
    : "";
  return {
    id: p.id,
    title: p.name,
    brand: p.brand,
    category,
    price: p.price,
    color: (p.color ?? "").split(/\s+/)[0] || "Unknown",
    audience: "Unisex",
    season,
    tags,
    image,
    slug: (p as { slug?: string }).slug,
  };
}

function mockProductToStylist(p: MockProduct): StylistProduct {
  return {
    id: p.id,
    title: p.title,
    brand: p.brand,
    category: p.category,
    price: p.price,
    color: p.color,
    audience: p.audience,
    season: p.season,
    tags: p.tags,
    image: p.image,
    slug: p.slug,
  };
}

/** Все товары для стилиста (mock + lib), только Syntha */
export function getStylistProductPool(): StylistProduct[] {
  const fromMock = MOCK_PRODUCTS.map(mockProductToStylist);
  const fromLib = LIB_PRODUCTS.filter((p) =>
    p.brand.toLowerCase().includes("syntha")
  ).map(libProductToStylist);
  const byId = new Map<string, StylistProduct>();
  for (const p of [...fromMock, ...fromLib]) {
    if (!byId.has(p.id)) byId.set(p.id, p);
  }
  return Array.from(byId.values());
}

/** Разрешить productId в данные для отображения (LookResultCard) */
export function resolveProductForDisplay(
  productId: string,
  wardrobe?: { id: string; title: string; brand?: string; category: string; image: string; color?: string }[]
): { id: string; title: string; brand: string; category: string; price: number; image: string; slug: string } | null {
  const fromWardrobe = wardrobe?.find((w) => w.id === productId);
  if (fromWardrobe) {
    return {
      id: fromWardrobe.id,
      title: fromWardrobe.title,
      brand: fromWardrobe.brand ?? "My Wardrobe",
      category: fromWardrobe.category,
      price: 0,
      image: fromWardrobe.image,
      slug: fromWardrobe.id,
    };
  }
  const pool = getStylistProductPool();
  const p = pool.find((x) => x.id === productId);
  if (p) {
    return {
      id: p.id,
      title: p.title,
      brand: p.brand,
      category: p.category,
      price: p.price,
      image: p.image,
      slug: p.slug ?? p.id,
    };
  }
  return null;
}
