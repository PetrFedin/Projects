import type { Product } from '@/lib/types';
import type { GalleryHealthResult } from './types';

/** Качество медиа-карточки для мерча и маркетплейсов (метаданные + количество). */
export function assessMediaGallery(product: Product): GalleryHealthResult {
  const issues: string[] = [];
  const n = product.images?.length ?? 0;
  if (n < 1) issues.push('no_images');
  else if (n < 2) issues.push('single_image_only');
  const minW = product.attributes?.imageMinWidth ?? product.attributes?.minImageWidth;
  if (typeof minW === 'number' && minW > 0 && minW < 1200) {
    issues.push('low_width_meta');
  }
  const score = Math.max(0, 100 - issues.length * 20);
  return { score, ok: issues.length === 0, issues };
}

export function galleryHealthToCsv(
<<<<<<< HEAD
  rows: { sku: string; slug: string; score: number; issues: string }[]
=======
  rows: { sku: string; slug: string; score: number; issues: string[] }[]
>>>>>>> recover/cabinet-wip-from-stash
): string {
  const h = ['sku', 'slug', 'gallery_score', 'issues'];
  const lines = [h.join(',')];
  for (const r of rows) {
    lines.push([r.sku, r.slug, String(r.score), `"${r.issues.join('|')}"`].join(','));
  }
  return lines.join('\n');
}
