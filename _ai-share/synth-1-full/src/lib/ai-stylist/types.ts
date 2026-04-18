/**
 * AI Stylist — типы для архитектуры формирования образов
 */

export type Occasion =
  | 'Daily'
  | 'Work'
  | 'Date'
  | 'Travel'
  | 'Event'
  | 'Sport'
  | 'Golf'
  | 'Evening';

export type StyleMood = 'Minimal' | 'Urban' | 'Techwear' | 'Classic' | 'SportLuxe' | 'AvantGarde';

export type Contrast = 'High' | 'Medium' | 'Low';
export type ColorPalette = 'Warm' | 'Cool' | 'Neutral' | 'Monochrome' | 'Vibrant';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All';

export type ProductCategory = 'Outerwear' | 'Tops' | 'Bottoms' | 'Shoes' | 'Accessories';

export interface WardrobeItem {
  id: string;
  title: string;
  category: ProductCategory;
  image: string;
  tags: string[];
  color?: string;
}

export interface StylistProduct {
  id: string;
  title: string;
  brand: string;
  category: ProductCategory;
  price: number;
  color: string;
  audience: string;
  season: string;
  tags: string[];
  image: string;
  slug?: string;
}

export interface LookItem {
  productId: string;
  reason: string;
  isFromWardrobe?: boolean;
  title?: string;
  price?: number;
}

export interface Look {
  id: string;
  title: string;
  confidence: number;
  items: LookItem[];
  why: string[];
  totalPrice: number;
  strategy?: string;
  longevityScore?: number;
}

export interface LookStrategy {
  id: string;
  label: string;
  biasTags: string[];
  excludeFromPrimary?: string[];
  maxOverlapWithPrevious?: number;
  colorBias?: string[];
  silhouetteRule?: 'balanced' | 'fitted' | 'oversized' | 'mixed';
}

export interface StylistPreferences {
  favoriteColors?: string[];
  excludedCategories?: ProductCategory[];
  excludeOversized?: boolean;
  excludeBright?: boolean;
  likedTags?: string[];
  dislikedTags?: string[];
  budgetPreference?: 'economy' | 'standard' | 'premium';
}
