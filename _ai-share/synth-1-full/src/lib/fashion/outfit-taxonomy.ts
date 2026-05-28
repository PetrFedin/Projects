import type { Product } from '@/lib/types';
import type { FashionSlot, OutfitGapResult } from './types';

const RULES: { slot: FashionSlot; patterns: RegExp[] }[] = [
  {
    slot: 'footwear',
    patterns: [/обув/i, /ботин/i, /кроссов/i, /туфл/i, /лофер/i, /shoe/i, /sneaker/i, /boot/i],
  },
  {
    slot: 'outer',
    patterns: [/пальто/i, /куртк/i, /пухов/i, /пиджак/i, /жакет/i, /coat/i, /jacket/i, /blazer/i],
  },
  { slot: 'dress', patterns: [/плать/i, /сарафан/i, /dress/i, /gown/i] },
  {
    slot: 'bottom',
    patterns: [/брюк/i, /джинс/i, /шорт/i, /юбк/i, /брюки/i, /pant/i, /skirt/i, /jean/i],
  },
  {
    slot: 'top',
    patterns: [
      /футбол/i,
      /рубаш/i,
      /свитер/i,
      /лонгслив/i,
      /топ/i,
      /поло/i,
      /tee/i,
      /shirt/i,
      /knit/i,
      /свитшот/i,
    ],
  },
  {
    slot: 'accessory',
    patterns: [
      /сумк/i,
      /ремен/i,
      /шарф/i,
      /шапк/i,
      /очк/i,
      /кепк/i,
      /пояс/i,
      /bag/i,
      /belt/i,
      /scarf/i,
      /cap/i,
    ],
  },
];

export function inferFashionSlot(product: Product): FashionSlot {
  const hay =
    `${product.name} ${product.category} ${product.subcategory ?? ''} ${product.subcategory2 ?? ''}`.toLowerCase();
  for (const { slot, patterns } of RULES) {
    if (patterns.some((re) => re.test(hay))) return slot;
  }
  return 'unknown';
}

/** Минимальный образ: верх + низ **или** платье, плюс обувь; аксессуар опционален. */
export function analyzeOutfitGaps(products: (Product | null)[]): OutfitGapResult {
  const filled = new Set<FashionSlot>();
  for (const p of products) {
    if (!p) continue;
    const s = inferFashionSlot(p);
    if (s !== 'unknown') filled.add(s);
  }
  const hasDress = filled.has('dress');
  const hasTop = filled.has('top');
  const hasBottom = filled.has('bottom');
  const hasFootwear = filled.has('footwear');

  const missing: FashionSlot[] = [];
  if (!hasDress) {
    if (!hasTop) missing.push('top');
    if (!hasBottom) missing.push('bottom');
  }
  if (!hasFootwear) missing.push('footwear');

  let hint = 'Образ выглядит связным.';
  if (missing.includes('footwear')) hint = 'Добавьте обувь — якорь силуэта.';
  else if (missing.includes('top') && missing.includes('bottom'))
    hint = 'Нужны верх и низ (или платье).';
  else if (missing.includes('top')) hint = 'Не хватает верха к выбранному низу.';
  else if (missing.includes('bottom')) hint = 'Не хватает низа к выбранному верху.';

  return {
    filled: [...filled],
    missing: [...new Set(missing)],
    hint,
  };
}
