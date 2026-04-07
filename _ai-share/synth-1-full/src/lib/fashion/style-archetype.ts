import type { Product } from '@/lib/types';
import type { StyleArchetypeV1, UserStyleProfileV1 } from './types';

/** Определяет архетип пользователя на основе его взаимодействий (просмотры/избранное). */
export function calculateStyleArchetype(products: Product[]): UserStyleProfileV1 {
  const counts: Record<StyleArchetypeV1, number> = {
    minimalist: 0,
    'avant-garde': 0,
    classicist: 0,
    streetwear: 0,
    bohemian: 0,
  };

  const colors = new Map<string, number>();
  const categories = new Map<string, number>();

  products.forEach(p => {
    const text = `${p.name} ${p.category} ${p.description}`.toLowerCase();
    
    // Minimalist: base, clean, essential
    if (/миним|баз|clean|essential|basic|однотон/i.test(text)) counts.minimalist += 1;
    // Avant-garde: asymmetrical, unique, pattern, print
    if (/аванг|необыч|принт|asymmetr|unique|print|logo/i.test(text)) counts['avant-garde'] += 1;
    // Classicist: wool, blazer, suit, silk
    if (/шерст|блейзер|пиджак|костюм|шелк|classic|suit|blazer/i.test(text)) counts.classicist += 1;
    // Streetwear: hoodie, sneakers, oversize
    if (/худи|кроссов|оверсайз|hoodie|sneakers|oversize|street/i.test(text)) counts.streetwear += 1;
    // Bohemian: linen, lace, floral, relaxed
    if (/лен|кружев|цветоч|свобод|linen|lace|floral|boho/i.test(text)) counts.bohemian += 1;

    colors.set(p.color, (colors.get(p.color) || 0) + 1);
    categories.set(p.category, (categories.get(p.category) || 0) + 1);
  });

  const sorted = (Object.entries(counts) as [StyleArchetypeV1, number][]).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0];
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  return {
    archetype: primary[0],
    confidence: Math.round((primary[1] / total) * 100),
    topCategories: [...categories.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
    colorPreferences: [...colors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
  };
}

export const ARCHETYPE_LABELS: Record<StyleArchetypeV1, string> = {
  minimalist: 'Минималист',
  'avant-garde': 'Авангардист',
  classicist: 'Классик',
  streetwear: 'Streetwear-энтузиаст',
  bohemian: 'Бохо-эстет',
};
