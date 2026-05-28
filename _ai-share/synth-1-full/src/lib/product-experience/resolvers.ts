import type { Product } from '@/lib/types';
import type { FootwearScanBundle } from '@/lib/footwear-viewer/types';
import { DEMO_FOOTWEAR_BUNDLE, DEMO_PAIRING_PRESETS } from '@/lib/footwear-viewer/demo-bundle';

export function resolveEyewearFrameUrl(product: Product): string | undefined {
  if (product.eyewearFrameUrl) return product.eyewearFrameUrl;
  const attrs = product.attributes as Record<string, unknown> | undefined;
  if (attrs && typeof attrs.eyewearFrameUrl === 'string') return attrs.eyewearFrameUrl;
  return undefined;
}

const EYEWEAR_HINT = /очк|солнцезащит|eyewear|оправ/i;

export function isEyewearCategory(product: Product): boolean {
  const blob = [product.category, product.subcategory, product.subcategory2, product.name]
    .filter(Boolean)
    .join(' ');
  return EYEWEAR_HINT.test(blob);
}

export function productShowsGlassesTryOn(product: Product): boolean {
  return !!(resolveEyewearFrameUrl(product) || isEyewearCategory(product));
}

function isFootwearBundle(obj: unknown): obj is FootwearScanBundle {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.skuId === 'string' &&
    typeof o.name === 'string' &&
    Array.isArray(o.angles) &&
    o.angles.length > 0
  );
}

export function parseFootwearBundle(product: Product): FootwearScanBundle | null {
  if (!isFootwearBundle(product.footwear)) return null;
  return product.footwear;
}

const FOOTWEAR_HINT = /обувь|кроссов|туфл|ботинк|сапог|лофер|босоножк|мокасин|слип|сабо/i;

export function isFootwearCategory(product: Product): boolean {
  if (product.category_group === 'Обувь') return true;
  const blob = [product.category, product.subcategory, product.name].filter(Boolean).join(' ');
  return FOOTWEAR_HINT.test(blob);
}

export function productShowsFootwear360(product: Product): boolean {
  return !!parseFootwearBundle(product) || isFootwearCategory(product);
}

export function resolveFootwearExperience(product: Product): {
  bundle: FootwearScanBundle;
  pairing: typeof DEMO_PAIRING_PRESETS;
} | null {
  const parsed = parseFootwearBundle(product);
  if (parsed) {
    return {
      bundle: parsed,
      pairing: parsed.pairingPresets?.length ? parsed.pairingPresets : DEMO_PAIRING_PRESETS,
    };
  }
  if (isFootwearCategory(product)) {
    return {
      bundle: {
        ...DEMO_FOOTWEAR_BUNDLE,
        skuId: product.sku,
        name: product.name,
      },
      pairing: DEMO_PAIRING_PRESETS,
    };
  }
  return null;
}
