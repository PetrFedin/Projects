import type { Product } from '@/lib/types';
import type { StyleQuizProfileV1 } from './types';

type FeedWithSlug = { slug: string };

export function scoreProductForStyleQuiz(product: Product, profile: StyleQuizProfileV1): number {
  let s = 0;
  const t = `${product.name} ${product.category} ${product.color}`.toLowerCase();

  if (profile.palette === 'neutral') {
    if (/бел|черн|сер|серый|беж|молоч|navy|black|white|grey|gray|cream|camel/i.test(t)) s += 3;
  } else {
    if (/красн|син|зел|жёлт|розов|оранж|фукси|ярк|принт|red|blue|green|yellow|pink|violet/i.test(t)) s += 3;
  }

  if (profile.mood === 'minimal') {
    if (/миним|базов|clean|essential|plain|однотон/i.test(t)) s += 2;
  } else if (profile.mood === 'bold') {
    if (/принт|логотип|студи|аванг|patch|graphic|logo/i.test(t) || product.tags?.includes('newSeason')) s += 2;
  } else {
    s += 1;
  }

  if (profile.silhouette === 'fitted') {
    if (/slim|skinny|облега|приталон|fitted|slim\s*fit/i.test(t)) s += 2;
  } else {
    if (/oversize|свобод|relaxed|wide|boyfriend|мешок/i.test(t)) s += 2;
  }

  return s;
}

/** Пересортировка ленты «Для вас» при локальном режиме и сохранённом квизе. */
export function reorderForYouFeedByQuiz<T extends FeedWithSlug>(
  feed: T[],
  catalog: Product[],
  profile: StyleQuizProfileV1,
): T[] {
  const bySlug = new Map(catalog.map((p) => [p.slug, p]));
  return [...feed].sort((a, b) => {
    const pa = bySlug.get(a.slug);
    const pb = bySlug.get(b.slug);
    if (!pa || !pb) return 0;
    return scoreProductForStyleQuiz(pb, profile) - scoreProductForStyleQuiz(pa, profile);
  });
}
