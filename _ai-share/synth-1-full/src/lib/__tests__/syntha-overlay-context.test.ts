/**
 * @jest-environment node
 */
import {
  appendSynthaOverlaySearchParams,
  brandCalendarTasksSynthaOverlayHref,
  brandMessagesSynthaOverlayHref,
  parseSynthaOverlayContext,
  shopCalendarTasksSynthaOverlayHref,
  shopMessagesSynthaOverlayHref,
  SYNTHA_PO_REF_PARAM,
} from '@/lib/communications/syntha-overlay-context';
import {
  COLLECTION_ID_PARAM,
  STAGES_SKU_PARAM,
  STAGES_STEP_PARAM,
} from '@/lib/production/stages-url';

describe('syntha-overlay-context', () => {
  it('parses order, collection, article, stage, po', () => {
    const sp = new URLSearchParams();
    sp.set('order', 'ord-1');
    sp.set('orderId', 'ord-1');
    sp.set(COLLECTION_ID_PARAM, 'col-a');
    sp.set(STAGES_SKU_PARAM, 'line-9');
    sp.set(STAGES_STEP_PARAM, 'tech-pack');
    sp.set(SYNTHA_PO_REF_PARAM, 'PO-777');
    const ctx = parseSynthaOverlayContext(sp);
    expect(ctx.orderId).toBe('ord-1');
    expect(ctx.collectionId).toBe('col-a');
    expect(ctx.articleId).toBe('line-9');
    expect(ctx.catalogStageId).toBe('tech-pack');
    expect(ctx.poRef).toBe('PO-777');
  });

  it('builds messages href with layered context', () => {
    const href = brandMessagesSynthaOverlayHref({
      orderId: 'o1',
      collectionId: 'c1',
      articleId: 'a1',
      catalogStageId: 'samples',
    });
    expect(href).toContain('/brand/messages');
    expect(href).toContain('order=o1');
    expect(href).toContain('collectionId=c1');
  });

  it('builds calendar tasks href with stages and layers', () => {
    const href = brandCalendarTasksSynthaOverlayHref({
      collectionId: 'c2',
      articleId: 'a2',
      catalogStageId: 'po',
    });
    expect(href).toContain('layers=tasks');
    expect(href).toContain('stagesStep=po');
  });

  it('appendSynthaOverlaySearchParams merges order and production keys', () => {
    const sp = new URLSearchParams();
    appendSynthaOverlaySearchParams(sp, {
      orderId: 'wo-1',
      collectionId: 'col-x',
      articleId: 'line-1',
      catalogStageId: 'samples',
      poRef: 'PO-9',
    });
    expect(sp.get('order')).toBe('wo-1');
    expect(sp.get(COLLECTION_ID_PARAM)).toBe('col-x');
    expect(sp.get(SYNTHA_PO_REF_PARAM)).toBe('PO-9');
  });

  it('shop overlay hrefs mirror brand routes', () => {
    const ctx = { orderId: 'o99', collectionId: 'c1', catalogStageId: 'tech-pack' };
    expect(shopMessagesSynthaOverlayHref(ctx)).toContain('/shop/messages');
    expect(shopCalendarTasksSynthaOverlayHref(ctx)).toContain('/shop/calendar');
    expect(shopMessagesSynthaOverlayHref(ctx)).toContain('order=o99');
  });
});
