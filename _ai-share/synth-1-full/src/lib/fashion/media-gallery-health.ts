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

export function galleryHealthToCsv(rows: { sku: string; slug: string; score: number; issues: string }[]): string {
  const h = ['sku', 'slug', 'gallery_score', 'issues'];
  const lines = [h.join(',')];
  for (const r of rows) {
    const issueList = Array.isArray(r.issues) ? r.issues : [r.issues];
    lines.push([r.sku, r.slug, String(r.score), `"${issueList.join('|')}"`].join(','));
  }
  return lines.join('\n');
}
