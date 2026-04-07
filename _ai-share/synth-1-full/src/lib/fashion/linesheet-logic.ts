import type { Product } from '@/lib/types';
import type { LineSheetItemV1 } from './types';

export function buildLineSheetItems(products: Product[]): LineSheetItemV1[] {
  return products.map(p => {
    const wholesalePrice = Math.round(p.price * 0.45); // Demo multiplier
    const moq = p.attributes?.moq || (p.category === 'Accessory' ? 24 : 12);
    
    return {
      sku: p.sku,
      name: p.name,
      price: p.price,
      wholesalePrice,
      moq: Number(moq),
      colors: [p.color],
      sizes: (p.sizes || []).map(s => s.name),
      imageUrl: p.images[0]?.url || '',
    };
  });
}

export function lineSheetToCsv(items: LineSheetItemV1[]): string {
  const h = ['sku', 'name', 'retail_price', 'wholesale_price', 'moq', 'sizes', 'colors'];
  const lines = [h.join(',')];
  for (const i of items) {
    const esc = (s: string) => `"${String(s).replace(/"/g, '""')}"`;
    lines.push([
      esc(i.sku),
      esc(i.name),
      String(i.price),
      String(i.wholesalePrice),
      String(i.moq),
      esc(i.sizes.join('|')),
      esc(i.colors.join('|')),
    ].join(','));
  }
  return lines.join('\n');
}
