import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';
import {
  workshop2ArticleHref,
  workshop2ArticleUrlSegment,
} from '@/lib/production/workshop2-url';

/** Абсолютный URL шаринга блока визуала ТЗ (секция signoff visuals). */
export function buildWorkshop2VisualsTzSignoffShareAbsoluteUrl(opts: {
  collectionId: string;
  internalArticleCode?: string;
  articleId: string;
}): string {
  if (typeof window === 'undefined') return '';
  const seg = workshop2ArticleUrlSegment(opts.internalArticleCode, opts.articleId);
  const rel = workshop2ArticleHref(opts.collectionId, seg, {
    w2step: '1',
    w2sec: 'construction',
    w2pane: 'tz',
    hash: 'w2-tz-section-signoff-visuals',
  });
  return `${window.location.origin}${rel}`;
}

/** Абсолютный URL «цех / sketch floor» для фабричного шаринга конструкции. */
export function buildWorkshop2FactorySketchFloorShareAbsoluteUrl(opts: {
  collectionId: string;
  internalArticleCode?: string;
  articleId: string;
}): string | null {
  if (typeof window === 'undefined') return null;
  const seg = workshop2ArticleUrlSegment(opts.internalArticleCode, opts.articleId);
  const rel = workshop2ArticleHref(opts.collectionId, seg, {
    w2view: 'factory',
    sketchFloor: true,
    w2step: '1',
    w2sec: 'construction',
    w2pane: 'tz',
    hash: W2_VISUALS_SKETCH_ANCHOR_ID,
  });
  return `${window.location.origin}${rel}`;
}
