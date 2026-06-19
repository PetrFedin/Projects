/**
 * Wave 43: deep-link из B2B rep portal в W2 hub — assortment / plan pane коллекции.
 */
import {
  WORKSHOP2_ARTICLE_PANE_PARAM,
  workshop2CollectionListHref,
} from '@/lib/production/workshop2-url';

/** Список коллекции W2 с вкладкой plan (assortment planning context). */
export function workshop2CollectionAssortmentHref(collectionId: string): string {
  const base = workshop2CollectionListHref(collectionId);
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}${WORKSHOP2_ARTICLE_PANE_PARAM}=plan`;
}
